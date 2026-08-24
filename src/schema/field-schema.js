// Ergonomic access to the generated DS prop model (src/generated/field-schema.json).
// Builder editors and Storybook controls read enums / defaults from HERE instead
// of hand-maintaining prop lists that drift from dap-design-system.
//
// Regenerate after a DS bump: `npm run gen:field-schema`.

import data from "../generated/field-schema.json";

export const fieldSchema = data;

/** DS React component name backing a canonical field type (e.g. "text-field" -> "DapDSInput"). */
export function getComponentForField(type) {
  return data.fieldTypes?.[type]?.component;
}

/** Prop model for a field type's primary DS component: { prop: { type, control, enum?, default? } }. */
export function getFieldPropModel(type) {
  const comp = getComponentForField(type);
  return (comp && data.components?.[comp]?.props) || {};
}

/** Enum options for one prop of a field type's component, or undefined. */
export function getPropEnum(type, prop) {
  return getFieldPropModel(type)[prop]?.enum;
}

/** Declared default for one prop of a field type's component, or undefined. */
export function getPropDefault(type, prop) {
  return getFieldPropModel(type)[prop]?.default;
}
