#!/usr/bin/env node
/**
 * gen-field-schema.mjs — derive src/generated/field-schema.json from the
 * dap-design-system .d.ts prop graph, so the builder editors and Storybook
 * controls read the SAME prop model (enums, booleans, defaults) the components
 * actually expose. Kills hand-maintained prop lists that drift from the DS.
 *
 * "Code is the source of truth": we walk each component's .d.ts declaration
 * graph (own props + extends / intersection / import('./x').Iface mixins),
 * resolve named union types to enum options, and read @property JSDoc for
 * defaults. Emitted per canonical field type via FIELD_DS_COMPONENT.
 *
 * Reuses the extraction approach of dap-ds-lab/scripts/gen-stories.mjs, but with
 * a builder-oriented filter: label / placeholder / description / required stay
 * (they are editable), only truly-internal / validity-mirror props are dropped.
 *
 * Usage: node scripts/gen-field-schema.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FIELD_DS_COMPONENT } from "../src/schema/field-types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const dsRoot = resolve(repoRoot, "node_modules/dap-design-system/dist");
const OUT = resolve(repoRoot, "src/generated/field-schema.json");

const pkgVersion = JSON.parse(
  readFileSync(resolve(repoRoot, "node_modules/dap-design-system/package.json"), "utf8"),
).version;

// kebab (button) -> React export (DapDSButtonReact).
const reactIndex = readFileSync(resolve(dsRoot, "react/index.d.ts"), "utf8");
const reactByKebab = {};
for (const m of reactIndex.matchAll(/default as (\w+) }\s*from\s*'\.\/dap-ds-([a-z0-9-]+)\/index\.js'/g))
  reactByKebab[m[2]] = m[1];
const kebabByReact = Object.fromEntries(Object.entries(reactByKebab).map(([k, v]) => [v, k]));

// Builder-oriented deny: keep editable text + visual enums + booleans, drop only
// internal plumbing and the ValidityState mirror props.
const DENY = new Set([
  "is", "attribute", "focusElement", "effectiveAriaLabel", "effectiveSize",
  "staticSize", "sizeChildren", "parentSized", "sizeMap", "labelId", "for",
  "willValidate", "preventDefault", "focusable", "invalid", "form", "role", "tabIndex",
  "valid", "valueMissing", "badInput", "customError", "patternMismatch",
  "rangeOverflow", "rangeUnderflow", "stepMismatch", "tooLong", "tooShort", "typeMismatch",
]);

// ── Build a global declaration registry from all .d.ts under the DS dist ─────────
function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (e.endsWith(".d.ts")) acc.push(p);
  }
  return acc;
}
const files = ["components", "internal", "common"].flatMap((d) => walk(resolve(dsRoot, d)));

const unions = {}; // typeName -> [values]
const decls = {}; // declName -> { props:[{name,type}], refs:[names] }
const defaults = {}; // "Component.prop" -> default value (from @property JSDoc)

function bodyAt(txt, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < txt.length; i++) {
    if (txt[i] === "{") depth++;
    else if (txt[i] === "}" && --depth === 0) return txt.slice(openIdx + 1, i);
  }
  return "";
}
const refIds = (header) => {
  const out = new Set();
  for (const m of header.matchAll(/import\([^)]*\)\.(\w+)/g)) out.add(m[1]);
  for (const m of header.matchAll(/\b([A-Z]\w+)\b/g))
    if (!["T", "Constructor", "LitElement", "HTMLElement"].includes(m[1])) out.add(m[1]);
  return [...out];
};
const propsFrom = (body) => {
  const out = [];
  for (const m of body.matchAll(/^[ \t]+(?:readonly\s+)?([a-zA-Z]\w*)\??\s*:\s*([\w]+)\s*;/gm))
    if (!/^readonly\b/.test(m[0])) out.push({ name: m[1], type: m[2] });
  return out;
};

// Parse a default out of a @property JSDoc description. Handles "Default value is
// X", "Default is X", "Default: X". Returns { has, value } with typed value.
function parseDefault(desc) {
  const m = desc.match(/default(?:\s+value)?\s*(?:is|:)\s*`?([^.`\n]+)`?/i);
  if (!m) return { has: false };
  let raw = m[1].trim().replace(/[.'"]+$/, "").replace(/^['"]/, "");
  if (raw === "false" || raw === "true") return { has: true, value: raw === "true" };
  if (/^-?\d+(\.\d+)?$/.test(raw)) return { has: true, value: Number(raw) };
  if (raw === "" || /^(none|empty|undefined|null)$/i.test(raw)) return { has: false };
  return { has: true, value: raw };
}

// Which component a JSDoc block belongs to: nearest `@element dap-ds-<kebab>` or
// the enclosing class name. We map @property defaults by the class the file declares.
for (const f of files) {
  const txt = readFileSync(f, "utf8");

  for (const m of txt.matchAll(/(?:export\s+)?(?:declare\s+)?type\s+(\w+)\s*=\s*([^;]+);/g)) {
    const vals = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    if (vals.length) unions[m[1]] = vals;
  }

  // class / interface bodies
  const classNames = [];
  for (const m of txt.matchAll(/(?:export\s+)?(?:declare\s+)?(?:abstract\s+)?(?:class|interface)\s+(\w+)([^{]*)\{/g)) {
    const name = m[1];
    classNames.push(name);
    const body = bodyAt(txt, m.index + m[0].length - 1);
    const d = (decls[name] ??= { props: [], refs: [] });
    d.props.push(...propsFrom(body));
    d.refs.push(...refIds(m[2]));
  }

  // mixin composites: `declare const X: <intersection>;`
  for (const m of txt.matchAll(/(?:export\s+)?declare\s+const\s+(\w+)\s*:\s*/g)) {
    let i = m.index + m[0].length, depth = 0;
    for (; i < txt.length; i++) {
      const ch = txt[i];
      if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (ch === ";" && depth === 0) break;
    }
    const d = (decls[m[1]] ??= { props: [], refs: [] });
    d.refs.push(...refIds(txt.slice(m.index + m[0].length, i)));
  }

  // @property defaults — attribute to the DapDS* class this file declares, if any.
  const owner = classNames.find((n) => /^DapDS/.test(n));
  if (owner) {
    for (const m of txt.matchAll(/@property\s*\{[^}]*\}\s*(\w+)\b([^\n]*)/g)) {
      const d = parseDefault(m[2]);
      if (d.has && !(`${owner}.${m[1]}` in defaults)) defaults[`${owner}.${m[1]}`] = d.value;
    }
  }
}

// ── Resolve a component's full prop set by walking the declaration graph ─────────
function resolveProps(rootClass) {
  const seen = new Set();
  const props = new Map(); // name -> type (first wins)
  const queue = [rootClass];
  while (queue.length) {
    const n = queue.shift();
    if (seen.has(n) || !decls[n]) continue;
    seen.add(n);
    for (const p of decls[n].props) if (!props.has(p.name)) props.set(p.name, p.type);
    for (const r of decls[n].refs) if (!seen.has(r)) queue.push(r);
  }
  return props;
}

const controlFor = (type, hasEnum) =>
  hasEnum ? "select" : type === "boolean" ? "boolean" : type === "number" ? "number" : "text";

function propModel(reactName) {
  const className = reactName.replace(/React$/, ""); // DapDSButton
  const props = resolveProps(className);
  const out = {};
  for (const [name, type] of props) {
    if (DENY.has(name)) continue;
    const enumVals = unions[type] && unions[type].length > 1 ? unions[type] : null;
    if (type !== "boolean" && !enumVals && !["string", "number"].includes(type)) {
      // non-enum object/element types (e.g. HTMLElement refs) — skip as non-editable
      if (!/^(string|number|boolean)$/.test(type)) continue;
    }
    const entry = { type, control: controlFor(type, !!enumVals) };
    if (enumVals) entry.enum = enumVals;
    const dk = `${className}.${name}`;
    if (dk in defaults) entry.default = defaults[dk];
    out[name] = entry;
  }
  return out;
}

// ── Emit — only the components the registry actually uses (via FIELD_DS_COMPONENT) ─
const wantedComponents = [...new Set(Object.values(FIELD_DS_COMPONENT))];
const components = {};
const missing = [];
for (const react of wantedComponents) {
  const kebab = kebabByReact[`${react}React`];
  if (!kebab) { missing.push(react); continue; }
  components[react] = { kebab: `dap-ds-${kebab}`, props: propModel(`${react}React`) };
}

const fieldTypes = {};
for (const [type, react] of Object.entries(FIELD_DS_COMPONENT))
  fieldTypes[type] = { component: react, resolved: react in components };

const json = {
  $comment: "AUTO-GENERATED by scripts/gen-field-schema.mjs from the dap-design-system .d.ts prop graph. Do not edit by hand.",
  generatedFrom: `dap-design-system@${pkgVersion}`,
  fieldTypes,
  components,
};
writeFileSync(OUT, JSON.stringify(json, null, 2) + "\n");

// ── Report ───────────────────────────────────────────────────────────────────────
const lines = [];
for (const [react, c] of Object.entries(components)) {
  const props = Object.entries(c.props);
  const enums = props.filter(([, p]) => p.enum).map(([n, p]) => `${n}(${p.enum.length})`);
  const defs = props.filter(([, p]) => "default" in p).length;
  lines.push(`✓ ${react}: ${props.length} props, enums:[${enums.join(",") || "—"}], defaults:${defs}`);
}
if (missing.length) lines.push(`✗ no React export for: ${missing.join(", ")}`);
console.error(lines.join("\n"));
console.error(`\nWrote ${OUT}  (${Object.keys(components).length} components, dap-design-system@${pkgVersion})`);
