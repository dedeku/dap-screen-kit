// Canonical DAP field-type catalog — the SUPERSET of what the form-builder and
// the life-event flows each grew independently. This is the single source: the
// builder palette, the registry, and Storybook all read from here.
//
// `wired: true` → has a real registry entry rendering a dap-design-system node.
// (all types are wired now; the flag stays so a future new type can land here
//  catalogued before its registry entry exists.)

// Intrinsic per-type metadata (used by any editor, not just rendering):
//   hasOptions  — carries an options[] list (radio/dropdown/chips/…)
//   labelKind   — where the type's primary text lives:
//                   "label"      → field.label
//                   "groupLabel" → field.groupLabel (grouped choices, repeatable)
//                   "none"       → text lives elsewhere (items/body/zones) — an
//                                  editor hides the generic label input
//   placeholder — accepts a placeholder
export const FIELD_TYPES = [
  // structure / typography
  { type: "title",            label: "Title",            icon: "◈", group: "layout",  wired: true, hasOptions: false, labelKind: "label",      placeholder: false },
  { type: "section-label",    label: "Section label",    icon: "§", group: "layout",  wired: true, hasOptions: false, labelKind: "label",      placeholder: false },
  { type: "info-callout",     label: "Info callout",     icon: "ⓘ", group: "layout",  wired: true, hasOptions: false, labelKind: "none",       placeholder: false },
  { type: "button-row",       label: "Button row",       icon: "▭", group: "layout",  wired: true, hasOptions: false, labelKind: "none",       placeholder: false },

  // text inputs
  { type: "text-field",       label: "Text field",       icon: "T", group: "input",   wired: true, hasOptions: false, labelKind: "label",      placeholder: true  },
  { type: "number-field",     label: "Number field",     icon: "#", group: "input",   wired: true, hasOptions: false, labelKind: "label",      placeholder: true  },
  { type: "textarea",         label: "Textarea",         icon: "¶", group: "input",   wired: true, hasOptions: false, labelKind: "label",      placeholder: true  },
  { type: "date-picker",      label: "Date picker",      icon: "📅", group: "input",  wired: true, hasOptions: false, labelKind: "label",      placeholder: true  },

  // choice
  { type: "radio-group",      label: "Radio group",      icon: "◉", group: "choice",  wired: true, hasOptions: true,  labelKind: "groupLabel", placeholder: false },
  { type: "dropdown",         label: "Dropdown",         icon: "▾", group: "choice",  wired: true, hasOptions: true,  labelKind: "label",      placeholder: true  },
  { type: "content-switcher", label: "Content switcher", icon: "▥", group: "choice",  wired: true, hasOptions: true,  labelKind: "groupLabel", placeholder: false },
  { type: "checkbox",         label: "Checkbox",         icon: "☑", group: "choice",  wired: true, hasOptions: false, labelKind: "label",      placeholder: false },
  { type: "switch",           label: "Switch",           icon: "◑", group: "choice",  wired: true, hasOptions: false, labelKind: "label",      placeholder: false },
  { type: "checklist",        label: "Checklist",        icon: "☰", group: "choice",  wired: true, hasOptions: true,  labelKind: "groupLabel", placeholder: false },
  { type: "chip-single",      label: "Chip (single)",    icon: "◇", group: "choice",  wired: true, hasOptions: true,  labelKind: "groupLabel", placeholder: false },
  { type: "chip-multi",       label: "Chip (multi)",     icon: "▦", group: "choice",  wired: true, hasOptions: true,  labelKind: "groupLabel", placeholder: false },

  // data / files / composite
  { type: "data-list",        label: "Data list",        icon: "▤", group: "data",    wired: true, hasOptions: false, labelKind: "none",       placeholder: false },
  { type: "timeline",         label: "Timeline",         icon: "┃", group: "data",    wired: true, hasOptions: false, labelKind: "none",       placeholder: false },
  { type: "file-upload",      label: "File upload",      icon: "⇪", group: "data",    wired: true, hasOptions: false, labelKind: "none",       placeholder: false },
  { type: "repeatable",       label: "Repeatable group", icon: "⧉", group: "data",    wired: true, hasOptions: false, labelKind: "groupLabel", placeholder: false },
];

export const FIELD_TYPE_SET = new Set(FIELD_TYPES.map((f) => f.type));

// Derived classification sets (from the intrinsic metadata above) — editors read
// THESE instead of hand-listing which types carry options / group labels / etc.
export const OPTION_FIELD_TYPES = FIELD_TYPES.filter((f) => f.hasOptions).map((f) => f.type);
export const GROUP_LABEL_FIELD_TYPES = FIELD_TYPES.filter((f) => f.labelKind === "groupLabel").map((f) => f.type);
export const PLACEHOLDER_FIELD_TYPES = FIELD_TYPES.filter((f) => f.placeholder).map((f) => f.type);
export const NO_LABEL_FIELD_TYPES = FIELD_TYPES.filter((f) => f.labelKind === "none").map((f) => f.type);

/** Where a field type's primary text lives: "label" | "groupLabel" | "none". */
export const labelKindOf = (type) => FIELD_TYPES.find((f) => f.type === type)?.labelKind ?? "label";

// Canonical field type -> the PRIMARY dap-design-system React component whose
// props the builder edits (options/items are field data, not this component's
// props). gen-field-schema.mjs reads this to key the extracted prop model by
// field type, so the builder editors and Storybook controls stay in sync with
// what the components actually expose.
export const FIELD_DS_COMPONENT = {
  title: "DapDSTypography",
  "section-label": "DapDSTypography",
  "info-callout": "DapDSCallout",
  "button-row": "DapDSButton",
  "text-field": "DapDSInput",
  "number-field": "DapDSNumberInput",
  textarea: "DapDSTextarea",
  "date-picker": "DapDSDatePicker",
  "radio-group": "DapDSRadioGroup",
  dropdown: "DapDSSelect",
  "content-switcher": "DapDSContentSwitcher",
  checkbox: "DapDSCheckbox",
  switch: "DapDSSwitch",
  checklist: "DapDSCheckbox",
  "chip-single": "DapDSChip",
  "chip-multi": "DapDSChip",
  "data-list": "DapDSCard",
  timeline: "DapDSTimeline",
  "file-upload": "DapDSFileInput",
  repeatable: "DapDSCard",
};

// Value-carrying fields (everything that can appear in the values map / feed a
// visibleWhen predicate). Pure display fields are excluded.
export const VALUE_FIELD_TYPES = new Set(
  FIELD_TYPES.map((f) => f.type).filter(
    (t) => !["title", "section-label", "info-callout", "button-row", "data-list", "timeline"].includes(t),
  ),
);

// Legacy type names kept as registry aliases during migration. The form-builder
// emitted "multi-select"; canonical is "chip-multi".
export const LEGACY_TYPE_ALIASES = { "multi-select": "chip-multi" };

// Multi-value fields hold an array of selected ids rather than a scalar.
// (includes the legacy "multi-select" so initialValues seeds its array default.)
export const MULTI_VALUE_FIELD_TYPES = new Set(["chip-multi", "checklist", "multi-select"]);

// Fields whose value is a boolean toggle.
export const BOOLEAN_FIELD_TYPES = new Set(["checkbox", "switch"]);

// Fields that default their value from an `options[].selected` flag.
export const OPTION_SELECTED_FIELD_TYPES = new Set([
  "radio-group",
  "content-switcher",
  "dropdown",
  "chip-single",
]);
