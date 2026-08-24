// Unified conditional-visibility predicate. `visibleWhen` WON the merge over the
// form-builder's legacy `showWhen: { field, equals }`.
//
//   visibleWhen: { field, op, value }
//     op: "equals" | "includes" | "truthy" | "falsy"
//
// `normalizeVisibleWhen` accepts the legacy `showWhen` shape too, so existing
// form-builder JSON keeps working until a codemod rewrites it. Prefer running
// the codemod (scripts/codemod-showwhen.mjs) once and dropping the legacy path.

export const VISIBLE_WHEN_OPS = ["equals", "includes", "truthy", "falsy"];

/** Coerce a field's condition (either shape) into the canonical visibleWhen. */
export function normalizeVisibleWhen(field) {
  if (field?.visibleWhen?.field) return field.visibleWhen;
  // legacy: showWhen: { field, equals }
  if (field?.showWhen?.field) {
    return { field: field.showWhen.field, op: "equals", value: field.showWhen.equals };
  }
  return null;
}

/** Evaluate a normalized predicate against the collected values map. */
export function matchPredicate(values, pred) {
  if (!pred || !pred.field) return true;
  const v = values[pred.field];
  switch (pred.op) {
    case "equals":
      // string-loose compare: option ids and typed text both round-trip cleanly
      if (v === undefined || v === null) return false;
      return String(v) === String(pred.value);
    case "includes":
      return Array.isArray(v) && v.includes(pred.value);
    case "falsy":
      return !v || (Array.isArray(v) && v.length === 0);
    case "truthy":
    default:
      return Array.isArray(v) ? v.length > 0 : !!v;
  }
}

/** A field is visible when it has no predicate, or its predicate holds. */
export function isVisible(field, values) {
  return matchPredicate(values, normalizeVisibleWhen(field));
}
