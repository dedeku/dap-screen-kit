// @dap/screen-kit — public API.

export { default as ScreenRenderer } from "./render/ScreenRenderer.jsx";
export { default as Field } from "./render/Field.jsx";
export { default as Header } from "./render/Header.jsx";
export { default as Actions } from "./render/Actions.jsx";

export { registry, isWired } from "./registry/index.jsx";

// generic DS-component node renderer (catalog components on the builder canvas)
export { default as renderComponentNode, resolveComponent } from "./render/ComponentNode.jsx";

// composed page patterns (Hero/Header/CtaRow). The components live under the
// "@dap/screen-kit/patterns" subpath to avoid clashing with the render Header
// above; the root only re-exports the registry helpers.
export { PATTERNS, getPattern, isPattern, FlowContext } from "./patterns/index.jsx";

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
