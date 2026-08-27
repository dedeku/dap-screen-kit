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
  DapDSInput:           { prop: "value",   event: "onDdsInput",  read: (e) => e?.target?.value },
  DapDSNumberInput:     { prop: "value",   event: "onDdsInput",  read: (e) => e?.target?.value },
  DapDSTextarea:        { prop: "value",   event: "onDdsInput",  read: (e) => e?.target?.value },
  DapDSSearch:          { prop: "value",   event: "onDdsInput",  read: (e) => e?.target?.value },
  DapDSDatePicker:      { prop: "value",   event: "onDdsChange", read: (e) => e?.target?.value },
  DapDSSelect:          { prop: "value",   event: "onDdsChange", read: (e) => e?.target?.value },
  DapDSRadioGroup:      { prop: "value",   event: "onDdsChange", read: (e) => e?.target?.value },
  DapDSContentSwitcher: { prop: "value",   event: "onDdsChange", read: (e) => e?.target?.value },
  DapDSCheckbox:        { prop: "checked", event: "onDdsChange", read: (e) => e?.target?.checked },
  DapDSSwitch:          { prop: "checked", event: "onDdsChange", read: (e) => e?.target?.checked },
};

/** True if a catalog component is a value-bearing input (captures form data). */
export const isValueComponent = (name) => Object.prototype.hasOwnProperty.call(VALUE_BINDINGS, name);

/** The default value shape for an input component (booleans start false). */
export const emptyValueFor = (name) => (VALUE_BINDINGS[name]?.prop === "checked" ? false : "");
