// Ergonomic access to the generated DS component catalog
// (src/generated/component-catalog.json) + the builder-facing feature flag.
//
// This is the BASE prop model, extracted from the dap-design-system .d.ts for
// every component in the palette manifest. It is a SUPERSET (all typed props,
// including internal-ish ones) and it inherits any staleness in the DS .d.ts
// (e.g. DapDSButton.variant resolves to the wrong enum in some DS builds — the
// Storybook story hand-corrects it). The intended final model is this base
// OVERLAID by the curated Storybook argTypes (which win on conflicts). Until the
// overlay lands, treat enums here as best-effort.
//
// Regenerate after a DS bump: `npm run gen:component-catalog`.

import data from "../generated/component-catalog.json";
import { CATALOG_COMPONENTS, CATALOG_COMPONENT_NAMES, getManifestEntry } from "./component-manifest.js";

export const componentCatalog = data;

/** Whole catalog: { generatedFrom, components: { DapDSButton: { kebab, label, slot, props } } }. */
export function getComponentCatalog() {
  return data;
}

/** Manifest, in palette order, joined with the generated prop model + resolved flag. */
export function listCatalogComponents() {
  return CATALOG_COMPONENTS.map((m) => ({
    ...m,
    props: data.components?.[m.name]?.props || {},
    kebab: data.components?.[m.name]?.kebab,
    resolved: !!data.components?.[m.name],
  }));
}

/** Prop model for one component base name: { prop: { type, control, enum?, default? } }. */
export function getComponentPropModel(name) {
  return data.components?.[name]?.props || {};
}

/** The manifest's authored slot kind for a component ("text" | "options" | "none" | null). */
export function getComponentSlot(name) {
  return getManifestEntry(name)?.slot ?? null;
}

export { CATALOG_COMPONENTS, CATALOG_COMPONENT_NAMES };

// ── Feature flag ────────────────────────────────────────────────────────────
// The generic-DS-component palette is OFF by default. The builder falls back to
// the 19 field-types with zero behaviour change until this is explicitly turned
// on — the practical rollback: flip it off and the builder reverts instantly, no
// redeploy of screen-kit needed. Resolution order (first decisive wins):
//   1. an in-session override set via setComponentCatalogEnabled()
//   2. localStorage "dap:ds-catalog" ("1"/"true" | "0"/"false")
//   3. Vite env VITE_DS_CATALOG ("1"/"true")
//   4. default: false
let _override; // undefined = not set

const truthy = (v) => v === "1" || v === "true" || v === true;
const falsy = (v) => v === "0" || v === "false" || v === false;

export function isComponentCatalogEnabled() {
  if (_override !== undefined) return _override;
  try {
    if (typeof localStorage !== "undefined") {
      const v = localStorage.getItem("dap:ds-catalog");
      if (truthy(v)) return true;
      if (falsy(v)) return false;
    }
  } catch {
    /* private-mode / no storage */
  }
  try {
    const env = import.meta && import.meta.env;
    if (env && env.VITE_DS_CATALOG != null) return truthy(String(env.VITE_DS_CATALOG));
  } catch {
    /* not a Vite/import.meta context */
  }
  return false;
}

/**
 * Force the flag for this session (persists to localStorage so a reload keeps it).
 * Pass undefined to clear the override and fall back to env/default.
 */
export function setComponentCatalogEnabled(on) {
  _override = on;
  try {
    if (typeof localStorage !== "undefined") {
      if (on === undefined) localStorage.removeItem("dap:ds-catalog");
      else localStorage.setItem("dap:ds-catalog", on ? "1" : "0");
    }
  } catch {
    /* ignore */
  }
}
