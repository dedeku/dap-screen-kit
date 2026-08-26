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
  { name: "DapDSSelect",         label: "Select",          story: "Components/Select",         slot: "options" },
  { name: "DapDSRadioGroup",     label: "Radio group",     story: "Components/Radio",          slot: "options" },
  { name: "DapDSNavigationMenu", label: "Navigation menu", story: "Components/NavigationMenu", slot: "options" },
  { name: "DapDSBreadcrumb",     label: "Breadcrumb",      story: "Components/Breadcrumb",     slot: "options" },
  { name: "DapDSListItem",       label: "List item",       story: "Components/ListItem",       slot: "text" },
  { name: "DapDSModal",          label: "Modal",           story: "Components/Modal",          slot: "text" },
  { name: "DapDSPopup",          label: "Popup",           story: "Components/Popup",          slot: "text" },
  { name: "DapDSStack",          label: "Stack",           story: "Components/Stack",          slot: "none" },
  { name: "DapDSTOC",            label: "TOC",             story: "Components/TOC",            slot: "options" },
];

/** Base React export names in the manifest (e.g. "DapDSButton"). */
export const CATALOG_COMPONENT_NAMES = CATALOG_COMPONENTS.map((c) => c.name);

/** Manifest entry by base name, or undefined. */
export function getManifestEntry(name) {
  return CATALOG_COMPONENTS.find((c) => c.name === name);
}
