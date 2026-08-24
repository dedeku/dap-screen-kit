// JSDoc typedefs for the DAP screen JSON. Pure types — no runtime. Consumers and
// the generator import these for autocomplete / .d.ts emission.

/**
 * @typedef {Object} VisibleWhen
 * @property {string} field  id of the field this condition reads
 * @property {"equals"|"includes"|"truthy"|"falsy"} op
 * @property {*} [value]     compared value (for equals / includes)
 */

/**
 * @typedef {Object} FieldOption
 * @property {string} id
 * @property {string} label
 * @property {boolean} [selected]
 */

/**
 * @typedef {Object} Field
 * @property {string} id
 * @property {string} type            one of FIELD_TYPES[].type
 * @property {string} [label]
 * @property {string} [groupLabel]
 * @property {string} [placeholder]
 * @property {string} [helperText]
 * @property {"full"|"half"} [width]
 * @property {boolean} [required]
 * @property {boolean} [checked]
 * @property {FieldOption[]} [options]
 * @property {VisibleWhen} [visibleWhen]
 */

/**
 * @typedef {Object} ScreenHeader
 * @property {string} [stepLabel]
 * @property {string} [title]
 * @property {string} [description]
 */

/**
 * @typedef {Object} ScreenAction
 * @property {string} id
 * @property {"button-primary"|"button-outline"} type
 * @property {string} label
 * @property {"left"|"right"} position
 */

/**
 * @typedef {Object} Screen
 * @property {string} id
 * @property {string} [title]
 * @property {string} [flow]
 * @property {number} [step]
 * @property {number} [width]
 * @property {number} [gap]
 * @property {ScreenHeader} [header]
 * @property {Field[]} fields
 * @property {ScreenAction[]} [actions]
 */

export {};
