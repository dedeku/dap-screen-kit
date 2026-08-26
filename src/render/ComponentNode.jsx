import React from "react";
import * as DS from "dap-design-system/react";
import { getComponentSlot } from "../schema/component-catalog.js";

/**
 * Generic DS-component node renderer — the counterpart to registry/index.jsx's
 * per-field-type render functions, but for ARBITRARY catalog components dropped
 * on the builder canvas. A node is:
 *
 *   { kind: "component", component: "DapDSButton", props: {...}, children?, items? }
 *
 * `component` is the DS React export BASE name (no "React" suffix); we look up the
 * real `DapDS<Name>React` on the DS react bundle and createElement it. Props are
 * passed through minus empties (so an unset select "—" never forces an attribute),
 * exactly like the Storybook stories render. Slot content comes from the manifest
 * slot kind: "text" -> a single text child; "options" -> slotted option items;
 * "none" -> no children.
 *
 * This keeps the ONE-render-path invariant: builder canvas, player and Storybook
 * all reach the same DS component the same way.
 */

const OPTION_EL = {
  // component base name -> [wrapperUnused, the DS React child element to slot per option]
  DapDSSelect: "DapDSOptionItemReact",
  DapDSRadioGroup: "DapDSRadioButtonReact",
  DapDSNavigationMenu: "DapDSNavigationMenuItemReact",
  DapDSBreadcrumb: "DapDSBreadcrumbItemReact",
  DapDSTOC: "DapDSTOCItemReact",
};

const isEmpty = (v) => v === "" || v == null;

/** Resolve the DS React component for a catalog base name, or null. */
export function resolveComponent(name) {
  return DS[`${name}React`] || null;
}

/** Clean a props object for spreading onto a DS component (drop empties). */
function cleanProps(props = {}) {
  const out = {};
  for (const [k, v] of Object.entries(props)) {
    if (k === "children" || k === "items") continue;
    if (isEmpty(v)) continue;
    out[k] = v;
  }
  return out;
}

/** Render slotted option children for "options"-slot components, if any. */
function renderOptions(name, items) {
  const childName = OPTION_EL[name];
  const Child = childName && DS[childName];
  if (!Child || !Array.isArray(items)) return null;
  return items.map((it, i) =>
    React.createElement(Child, { key: it.id ?? i, value: it.value ?? it.id ?? String(i) }, it.label ?? String(it.value ?? i)),
  );
}

/**
 * Render one component node. Returns null (not a throw) for an unknown component
 * so a single bad node can't crash the whole canvas.
 */
export function renderComponentNode(node) {
  if (!node || !node.component) return null;
  const Component = resolveComponent(node.component);
  if (!Component) return null;

  const slot = node.slot || getComponentSlot(node.component);
  const props = cleanProps(node.props);

  let children;
  if (slot === "options") children = renderOptions(node.component, node.props?.items ?? node.items);
  else if (slot === "none") children = undefined;
  else {
    // "text" or derived: node.children wins; else a `label` prop means text lives
    // there, so no child; else fall back to nothing.
    const text = node.children ?? node.props?.children;
    children = isEmpty(text) ? undefined : text;
  }

  return React.createElement(Component, props, children);
}

export default renderComponentNode;
