// @dap/screen-kit — public API.

export { default as ScreenRenderer } from "./render/ScreenRenderer.jsx";
export { default as Field } from "./render/Field.jsx";
export { default as Header } from "./render/Header.jsx";
export { default as Actions } from "./render/Actions.jsx";

export { registry, isWired } from "./registry/index.jsx";

// generic DS-component node renderer (catalog components on the builder canvas)
export { default as renderComponentNode, resolveComponent } from "./render/ComponentNode.jsx";

// schema (field-type catalog, visibleWhen predicate, JSON typedefs)
export * from "./schema/index.js";

// value-state engine (initial values, change delegation)
export {
  initialValues,
  fieldTypeMap,
  readChangeValue,
  makeChangeHandler,
  isVisible,
  matchPredicate,
  normalizeVisibleWhen,
} from "./conditional/index.js";
