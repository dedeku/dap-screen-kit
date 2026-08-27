#!/usr/bin/env node
/**
 * gen-component-catalog.mjs — derive src/generated/component-catalog.json from the
 * dap-design-system .d.ts prop graph, for EVERY component in the palette manifest
 * (src/schema/component-manifest.js). This is the "arbitrary DS component with its
 * real props" catalog the life-event builder drops onto the canvas.
 *
 * Deliberately SEPARATE from gen-field-schema.mjs (which stays untouched, keyed by
 * the 19 field-types): this script must never regress the field-schema. It reuses
 * the SAME extraction approach (walk .d.ts declaration graph, resolve unions to
 * enums, read @property defaults) so the prop model matches what gen-field-schema
 * produces for the overlapping components.
 *
 * Chain: TS (.d.ts) -> this catalog -> builder. Storybook is the curation authority
 * for WHICH components appear (the manifest mirrors the Components/* stories); the
 * prop TYPES come from TS, exactly as the user specified.
 *
 * Usage: node scripts/gen-component-catalog.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CATALOG_COMPONENTS } from "../src/schema/component-manifest.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const dsRoot = resolve(repoRoot, "node_modules/dap-design-system/dist");
const OUT = resolve(repoRoot, "src/generated/component-catalog.json");

const pkgVersion = JSON.parse(
  readFileSync(resolve(repoRoot, "node_modules/dap-design-system/package.json"), "utf8"),
).version;

// kebab (button) -> React export (DapDSButtonReact), and the inverse.
const reactIndex = readFileSync(resolve(dsRoot, "react/index.d.ts"), "utf8");
const reactByKebab = {};
for (const m of reactIndex.matchAll(/default as (\w+) }\s*from\s*'\.\/dap-ds-([a-z0-9-]+)\/index\.js'/g))
  reactByKebab[m[2]] = m[1];
const kebabByReact = Object.fromEntries(Object.entries(reactByKebab).map(([k, v]) => [v, k]));

// Same builder-oriented deny list as gen-field-schema.mjs: keep editable text +
// visual enums + booleans, drop internal plumbing and the ValidityState mirror.
const DENY = new Set([
  "is", "attribute", "focusElement", "effectiveAriaLabel", "effectiveSize",
  "staticSize", "sizeChildren", "parentSized", "sizeMap", "labelId", "for",
  "willValidate", "preventDefault", "focusable", "invalid", "form", "role", "tabIndex",
  "valid", "valueMissing", "badInput", "customError", "patternMismatch",
  "rangeOverflow", "rangeUnderflow", "stepMismatch", "tooLong", "tooShort", "typeMismatch",
]);

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (e.endsWith(".d.ts")) acc.push(p);
  }
  return acc;
}
const files = ["components", "internal", "common"].flatMap((d) => walk(resolve(dsRoot, d)));

const unions = {};
const decls = {};
const defaults = {};

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
function parseDefault(desc) {
  const m = desc.match(/default(?:\s+value)?\s*(?:is|:)\s*`?([^.`\n]+)`?/i);
  if (!m) return { has: false };
  let raw = m[1].trim().replace(/[.'"]+$/, "").replace(/^['"]/, "");
  if (raw === "false" || raw === "true") return { has: true, value: raw === "true" };
  if (/^-?\d+(\.\d+)?$/.test(raw)) return { has: true, value: Number(raw) };
  if (raw === "" || /^(none|empty|undefined|null)$/i.test(raw)) return { has: false };
  return { has: true, value: raw };
}

for (const f of files) {
  const txt = readFileSync(f, "utf8");

  for (const m of txt.matchAll(/(?:export\s+)?(?:declare\s+)?type\s+(\w+)\s*=\s*([^;]+);/g)) {
    const vals = [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]);
    if (vals.length) unions[m[1]] = vals;
  }

  const classNames = [];
  for (const m of txt.matchAll(/(?:export\s+)?(?:declare\s+)?(?:abstract\s+)?(?:class|interface)\s+(\w+)([^{]*)\{/g)) {
    const name = m[1];
    classNames.push(name);
    const body = bodyAt(txt, m.index + m[0].length - 1);
    const d = (decls[name] ??= { props: [], refs: [] });
    d.props.push(...propsFrom(body));
    d.refs.push(...refIds(m[2]));
  }

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

  const owner = classNames.find((n) => /^DapDS/.test(n));
  if (owner) {
    for (const m of txt.matchAll(/@property\s*\{[^}]*\}\s*(\w+)\b([^\n]*)/g)) {
      const d = parseDefault(m[2]);
      if (d.has && !(`${owner}.${m[1]}` in defaults)) defaults[`${owner}.${m[1]}`] = d.value;
    }
  }
}

function resolveProps(rootClass) {
  const seen = new Set();
  const props = new Map();
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

function propModel(className) {
  const props = resolveProps(className);
  const out = {};
  for (const [name, type] of props) {
    if (DENY.has(name)) continue;
    const enumVals = unions[type] && unions[type].length > 1 ? unions[type] : null;
    if (type !== "boolean" && !enumVals && !["string", "number"].includes(type)) {
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

// ── Optional Storybook argTypes overlay (emitted by dap-ds-lab) ──────────────
// story-argtypes.json is the CURATED control surface: which props the palette
// shows + their real enums (e.g. the 13 ButtonVariants the .d.ts gets wrong).
// When present for a component, it WINS: the editable prop set = the story's
// argTypes, each enriched with the .d.ts type + default. Storybook is the
// authority; TS only fills type/default. Components with no overlay fall back to
// the full .d.ts base (best-effort).
let overlay = null;
const overlayPath = resolve(repoRoot, "src/generated/story-argtypes.json");
try {
  overlay = JSON.parse(readFileSync(overlayPath, "utf8"));
} catch {
  /* no overlay yet — pure .d.ts base */
}

const overlayControl = (c) =>
  c === "select" ? "select"
  : c === "boolean" ? "boolean"
  : c === "number" || c === "range" ? "number"
  : "text"; // text | color | inline-radio(without options) | unknown

/** Merge one component's .d.ts base with its Storybook argTypes overlay. */
function mergedProps(name) {
  const base = propModel(name);
  const ov = overlay?.components?.[name];
  if (!ov) return { props: base, source: "dts" };

  const props = {};
  const args = ov.args || {};
  for (const [prop, at] of Object.entries(ov.argTypes || {})) {
    const b = base[prop] || {};
    const control = overlayControl(at.control);
    const entry = {
      type: b.type || (control === "boolean" ? "boolean" : control === "number" ? "number" : "string"),
      control,
    };
    const enumVals = at.options || b.enum;
    if (enumVals) entry.enum = enumVals;
    if (prop in args) entry.default = args[prop];
    else if ("default" in b) entry.default = b.default;
    props[prop] = entry;
  }
  return { props, source: "storybook" };
}

const components = {};
const missing = [];
for (const entry of CATALOG_COMPONENTS) {
  const isPattern = entry.kind === "pattern";
  // Patterns are not DS custom elements — no kebab tag, no .d.ts base; their whole
  // prop schema comes from the Storybook argTypes overlay (mergedProps' base is
  // empty for a name with no .d.ts declaration).
  const kebab = isPattern ? null : kebabByReact[`${entry.name}React`];
  if (!isPattern && !kebab) { missing.push(entry.name); continue; }
  const { props, source } = mergedProps(entry.name);
  components[entry.name] = {
    kebab: kebab ? `dap-ds-${kebab}` : null,
    label: entry.label,
    slot: entry.slot ?? null,
    kind: entry.kind ?? null,
    source,
    props,
  };
}

const json = {
  $comment: "AUTO-GENERATED by scripts/gen-component-catalog.mjs from the dap-design-system .d.ts prop graph + component-manifest.js, overlaid with Storybook argTypes (story-argtypes.json) where available. Do not edit by hand.",
  generatedFrom: `dap-design-system@${pkgVersion}`,
  overlay: overlay ? { source: overlay.source || "storybook-csf", components: Object.keys(overlay.components || {}).length } : null,
  components,
};

writeFileSync(OUT, JSON.stringify(json, null, 2) + "\n");
const n = Object.keys(components).length;
const propCount = Object.values(components).reduce((s, c) => s + Object.keys(c.props).length, 0);
console.log(`[gen-component-catalog] ${n} components, ${propCount} props -> ${OUT}`);
if (missing.length) console.warn(`[gen-component-catalog] MISSING react export (skipped): ${missing.join(", ")}`);
