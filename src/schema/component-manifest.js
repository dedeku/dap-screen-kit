// The DS component palette manifest — the SUPERSET of DS components a builder may
// drop, keyed by dap-design-system React export base name (no "React" suffix).
//
// SINGLE SOURCE OF "WHICH COMPONENTS": this list mirrors the authored Storybook
// top-level component stories (Components/* — the `generated/` coverage set is
// intentionally excluded, same policy as the Storybook sidebar). Storybook stays
// the curation authority; a drift-check in dap-ds-lab (scripts/check-catalog-
// manifest.mjs) fails CI if a Components/* story exists with no manifest entry or
// vice-versa, so this can never silently diverge from Storybook.
//
// `slot` — how the component's TEXT / CHILDREN content is authored, which argTypes
// and .d.ts prop models cannot express:
//   "text"    → a single editable text child (Button, Callout, Link, Typography…)
//   "options" → a repeatable option/item list rendered as slotted children
//               (Select <option>, RadioGroup, NavigationMenu, Breadcrumb)
//   "none"    → no author-editable children; text lives in a prop like `label`
//               (Input, Checkbox, DatePicker, Search) or it is a pure container
//   (omitted) → derived at render time: components exposing a `label` prop default
//               to "none", everything else to "text".
//
// Prop SCHEMA per component is NOT here — it is generated from the DS .d.ts by
// scripts/gen-component-catalog.mjs into src/generated/component-catalog.json
// (same extractor as gen-field-schema.mjs). This file only names + curates.

// ── Option-item specs (slot: "options") ─────────────────────────────────────
// How one item object ({label, value, href, …}) maps to its DS child element,
// matched to each child's real API (verified against the DS .d.ts):
//   el     — the DS React child export base name (…React appended at render)
//   fields — item keys the builder's option editor shows, in order
//   text   — item key rendered as the child's TEXT children (omit if none)
//   props  — { childProp: itemKey } passed as child props
// The renderer (render/ComponentNode.jsx) and the editor both read this, so a
// child's prop shape lives in exactly one place.
const SELECT_ITEM     = { el: "DapDSOptionItem",         fields: ["label", "value"], text: "label", props: { value: "value" } };
const RADIO_ITEM      = { el: "DapDSRadioButton",        fields: ["label", "value"], props: { value: "value", label: "label" } }; // RadioButton takes label as a PROP, not children
const NAV_ITEM        = { el: "DapDSNavigationMenuItem", fields: ["label"],          props: { label: "label" } };                 // NavigationMenuItem: label prop
const BREADCRUMB_ITEM = { el: "DapDSBreadcrumbItem",     fields: ["label", "href"],  text: "label", props: { href: "href" } };   // BreadcrumbItem: href prop + text

export const CATALOG_COMPONENTS = [
  { name: "DapDSButton",         label: "Button",          story: "Components/Button",         slot: "text" },
  { name: "DapDSIconButton",     label: "Icon button",     story: "Components/IconButton",     slot: "none" },
  { name: "DapDSCallout",        label: "Callout",         story: "Components/Callout",        slot: "text" },
  { name: "DapDSLink",           label: "Link",            story: "Components/Link",           slot: "text" },
  { name: "DapDSLabel",          label: "Label",           story: "Components/Label",          slot: "text" },
  { name: "DapDSTypography",     label: "Typography",      story: "Components/Typography",     slot: "text" },
  { name: "DapDSFeedback",       label: "Feedback",        story: "Components/Feedback",       slot: "text" },
  { name: "DapDSDivider",        label: "Divider",         story: "Components/Divider",        slot: "none" },
  { name: "DapDSInput",          label: "Input",           story: "Components/Input",          slot: "none" },
  { name: "DapDSCheckbox",       label: "Checkbox",        story: "Components/Checkbox",       slot: "none" },
  { name: "DapDSDatePicker",     label: "Date picker",     story: "Components/DatePicker",     slot: "none" },
  { name: "DapDSSearch",         label: "Search",          story: "Components/Search",         slot: "none" },
  // options-slot components declare an `item` spec (below) so the renderer and the
  // builder's option-list editor agree on the child element + which item fields
  // map to child props vs. text.
  { name: "DapDSSelect",         label: "Select",          story: "Components/Select",         slot: "options", item: SELECT_ITEM },
  { name: "DapDSRadioGroup",     label: "Radio group",     story: "Components/Radio",          slot: "options", item: RADIO_ITEM },
  { name: "DapDSNavigationMenu", label: "Navigation menu", story: "Components/NavigationMenu", slot: "options", item: NAV_ITEM },
  { name: "DapDSBreadcrumb",     label: "Breadcrumb",      story: "Components/Breadcrumb",     slot: "options", item: BREADCRUMB_ITEM },
  { name: "DapDSListItem",       label: "List item",       story: "Components/ListItem",       slot: "text" },
  { name: "DapDSModal",          label: "Modal",           story: "Components/Modal",          slot: "text" },
  { name: "DapDSPopup",          label: "Popup",           story: "Components/Popup",          slot: "text" },
  { name: "DapDSStack",          label: "Stack",           story: "Components/Stack",          slot: "none" },
  // TOC has no per-item child element in this DS build (no DapDSTOCItem export) and
  // is normally driven from page headings — not authorable as a value/label list,
  // so it is a plain (no-children) node here.
  { name: "DapDSTOC",            label: "TOC",             story: "Components/TOC",            slot: "none" },

  // ── Patterns (kind: "pattern") ────────────────────────────────────────────
  // Composed, arg-driven page patterns — NOT single DS components. Their React
  // implementation lives in src/patterns/ (the PATTERNS registry); the renderer
  // resolves them from there. No .d.ts base — their whole prop schema comes from
  // the Storybook argTypes overlay. slot "none" (arg-driven, no children).
  { name: "PatternHeader",  label: "Header (pattern)",  story: "Patterns/Header",  slot: "none", kind: "pattern" },
  { name: "PatternHero",    label: "Hero (pattern)",    story: "Patterns/Hero",    slot: "none", kind: "pattern" },
  { name: "PatternCtaRow",  label: "CTA Row (pattern)", story: "Patterns/CTA Row", slot: "none", kind: "pattern" },
];

/** Base React export names in the manifest (e.g. "DapDSButton"). */
export const CATALOG_COMPONENT_NAMES = CATALOG_COMPONENTS.map((c) => c.name);

/** Manifest entry by base name, or undefined. */
export function getManifestEntry(name) {
  return CATALOG_COMPONENTS.find((c) => c.name === name);
}
