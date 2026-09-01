// Value bindings for the input DS components rendered on the builder canvas.
// The generic ComponentNode renderer is presentational by default; when a render
// CONTEXT ({ value, onChange }) is supplied (the runtime / player, via Field),
// an input component in this table is wired controlled — the same value prop +
// change event the field-type registry uses, so a ds:<Input> captures form data
// exactly like the `text-field` field-type does. Components not in this table
// stay presentational (Button, Callout, Divider, patterns, …).
//
//   prop   : the DS value/checked prop
//   event  : the DS change event name
//   read   : event -> next value

export const VALUE_BINDINGS = {
  DapDSInput:           { prop: "value",   event: "onDdsInput",      read: (e) => e?.target?.value },
  DapDSNumberInput:     { prop: "value",   event: "onDdsInput",      read: (e) => e?.target?.value },
  DapDSTextarea:        { prop: "value",   event: "onDdsInput",      read: (e) => e?.target?.value },
  DapDSSearch:          { prop: "value",   event: "onDdsInput",      read: (e) => e?.target?.value },
  // blankUndefined: an empty value must reach the DS component as `undefined`,
  // not "" — DapDSDatePicker parses "" as a date and renders "Invalid Date".
  DapDSDatePicker:      { prop: "value",   event: "onDdsChange",     read: (e) => e?.target?.value, blankUndefined: true },
  DapDSSelect:          { prop: "value",   event: "onDdsChange",     read: (e) => e?.target?.value },
  DapDSRadioGroup:      { prop: "value",   event: "onDdsChange",     read: (e) => e?.target?.value },
  DapDSContentSwitcher: { prop: "value",   event: "onDdsChange",     read: (e) => e?.target?.value },
  DapDSCheckbox:        { prop: "checked", event: "onDdsChange",     read: (e) => e?.target?.checked },
  DapDSSwitch:          { prop: "checked", event: "onDdsChange",     read: (e) => e?.target?.checked },
  // write-only: no value prop to reflect back; captures file names on change.
  DapDSFileInput:       { prop: null,      event: "onDdsFileChange", read: (e) => (e?.detail?.files || []).map((f) => f.name) },
};

// Value-bearing composed PATTERNS (no single DS component): they manage the
// value themselves and receive { value, onChange } as props. Multi-value ones
// hold an array of selected option ids.
export const VALUE_PATTERNS = {
  PatternChecklist: { multi: true },
  PatternChipGroup: { multi: true },
  // repeatable: value is an array of row objects; starts empty ([]) and is not a
  // simple multi-select (no option-includes branching), so `multi:false`.
  PatternRepeatable: { multi: false, array: true },
};

/** True if a catalog entry captures form data (input component OR value pattern). */
export const isValueComponent = (name) =>
  Object.prototype.hasOwnProperty.call(VALUE_BINDINGS, name) ||
  Object.prototype.hasOwnProperty.call(VALUE_PATTERNS, name);

/** True if a value entry holds an array (multi-select). */
export const isMultiValue = (name) => !!VALUE_PATTERNS[name]?.multi;

/** The default value shape for a value entry (arrays [], booleans false, else ""). */
export const emptyValueFor = (name) => {
  const vp = VALUE_PATTERNS[name];
  if (vp?.multi || vp?.array) return [];
  return VALUE_BINDINGS[name]?.prop === "checked" ? false : "";
};
