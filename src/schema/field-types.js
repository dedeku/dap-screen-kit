// Canonical DAP field-type catalog — the SUPERSET of what the form-builder and
// the life-event flows each grew independently. This is the single source: the
// builder palette, the registry, and Storybook all read from here.
//
// `wired: true` → has a real registry entry rendering a dap-design-system node.
// (all types are wired now; the flag stays so a future new type can land here
//  catalogued before its registry entry exists.)

export const FIELD_TYPES = [
  // structure / typography
  { type: "title",            label: "Title",            icon: "◈", group: "layout",  wired: true  },
  { type: "section-label",    label: "Section label",    icon: "§", group: "layout",  wired: true  },
  { type: "info-callout",     label: "Info callout",     icon: "ⓘ", group: "layout",  wired: true   },

  // text inputs
  { type: "text-field",       label: "Text field",       icon: "T", group: "input",   wired: true  },
  { type: "number-field",     label: "Number field",     icon: "#", group: "input",   wired: true   },
  { type: "textarea",         label: "Textarea",         icon: "¶", group: "input",   wired: true   },
  { type: "date-picker",      label: "Date picker",      icon: "📅", group: "input",  wired: true  },

  // choice
  { type: "radio-group",      label: "Radio group",      icon: "◉", group: "choice",  wired: true  },
  { type: "dropdown",         label: "Dropdown",         icon: "▾", group: "choice",  wired: true  },
  { type: "content-switcher", label: "Content switcher", icon: "▥", group: "choice",  wired: true  },
  { type: "checkbox",         label: "Checkbox",         icon: "☑", group: "choice",  wired: true  },
  { type: "switch",           label: "Switch",           icon: "◑", group: "choice",  wired: true  },
  { type: "checklist",        label: "Checklist",        icon: "☰", group: "choice",  wired: true   },
  { type: "chip-single",      label: "Chip (single)",    icon: "◇", group: "choice",  wired: true   },
  { type: "chip-multi",       label: "Chip (multi)",     icon: "▦", group: "choice",  wired: true  },

  // data / files / composite
  { type: "data-list",        label: "Data list",        icon: "▤", group: "data",    wired: true   },
  { type: "timeline",         label: "Timeline",         icon: "┃", group: "data",    wired: true   },
  { type: "file-upload",      label: "File upload",      icon: "⇪", group: "data",    wired: true   },
  { type: "repeatable",       label: "Repeatable group", icon: "⧉", group: "data",    wired: true   },
];

export const FIELD_TYPE_SET = new Set(FIELD_TYPES.map((f) => f.type));

// Canonical field type -> the PRIMARY dap-design-system React component whose
// props the builder edits (options/items are field data, not this component's
// props). gen-field-schema.mjs reads this to key the extracted prop model by
// field type, so the builder editors and Storybook controls stay in sync with
// what the components actually expose.
export const FIELD_DS_COMPONENT = {
  title: "DapDSTypography",
  "section-label": "DapDSTypography",
  "info-callout": "DapDSCallout",
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
    (t) => !["title", "section-label", "info-callout", "data-list", "timeline"].includes(t),
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
