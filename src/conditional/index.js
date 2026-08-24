// Value-state engine shared by every renderer: seed initial values, map a DAP DS
// change event back to the values map, and expose the field-type lookup the
// delegated handler needs. Generalized over the canonical field-type sets so a
// new choice/boolean/multi field is handled by adding it to schema, not here.

import {
  BOOLEAN_FIELD_TYPES,
  MULTI_VALUE_FIELD_TYPES,
  OPTION_SELECTED_FIELD_TYPES,
} from "../schema/field-types.js";

export { isVisible, matchPredicate, normalizeVisibleWhen } from "../schema/visible-when.js";

/** Seed the values map from defaults so visibleWhen evaluates before any input. */
export function initialValues(fields) {
  const v = {};
  for (const f of fields || []) {
    if (OPTION_SELECTED_FIELD_TYPES.has(f.type)) {
      const sel = (f.options || []).find((o) => o.selected);
      if (sel) v[f.id] = sel.id;
    } else if (BOOLEAN_FIELD_TYPES.has(f.type)) {
      v[f.id] = !!f.checked;
    } else if (MULTI_VALUE_FIELD_TYPES.has(f.type)) {
      const sel = (f.options || []).filter((o) => o.selected).map((o) => o.id);
      if (sel.length) v[f.id] = sel;
    }
  }
  return v;
}

/** Map field id → type, so the delegated handler knows how to read the value. */
export function fieldTypeMap(fields) {
  const m = {};
  for (const f of fields || []) m[f.id] = f.type;
  return m;
}

// Read the new value from a DAP DS change event. Boolean fields carry `checked`,
// everything else carries `value` (option id / text).
export function readChangeValue(fieldType, e) {
  const d = e.detail;
  if (BOOLEAN_FIELD_TYPES.has(fieldType)) {
    if (d && typeof d === "object" && "checked" in d) return d.checked;
    return e.target?.checked;
  }
  if (d && typeof d === "object" && "value" in d) return d.value;
  return e.target?.value;
}

/**
 * Build a delegated handler for dds-change / dds-input / dds-select that updates
 * a values map. Attach it once to the fields container; each field wrapper
 * carries data-field-id. Multi-value fields track an array of option ids.
 *
 * @param {(updater: (v: object) => object) => void} setValues  React setter-style
 * @param {Record<string,string>} typeMap  from fieldTypeMap()
 */
export function makeChangeHandler(setValues, typeMap) {
  return (e) => {
    const wrap = e.target?.closest?.("[data-field-id]");
    if (!wrap) return;
    const fid = wrap.getAttribute("data-field-id");
    const ftype = typeMap[fid];

    if (MULTI_VALUE_FIELD_TYPES.has(ftype)) {
      const optId = e.detail?.value;
      if (optId == null) return;
      const selected = e.detail?.selected;
      setValues((v) => {
        const cur = Array.isArray(v[fid]) ? v[fid] : [];
        const next = selected
          ? [...new Set([...cur, optId])]
          : cur.filter((x) => x !== optId);
        return { ...v, [fid]: next };
      });
      return;
    }

    setValues((v) => ({ ...v, [fid]: readChangeValue(ftype, e) }));
  };
}
