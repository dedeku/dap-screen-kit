import * as DS from "dap-design-system/react";

// Resolve a Remix icon name (e.g. "add-line") to its DS icon component. The
// generic <dap-ds-icon name="..."> does not resolve a glyph in the npm build —
// only the individual icon components carry a baked SVG — so we map a name to its
// component by stripping the DAP category prefix and kebab-casing the rest.
// (Ported from dap-ds-lab's figma-code-connect/icon-arg.js so patterns can render
// icons without depending on the Storybook app.)
const ICON_CATEGORIES = ["Arrows", "Buildings", "Business", "Design", "Device", "Document", "Health", "Others", "System", "User"];
const kebab = (s) =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();

const ICON_BY_REMIX = {};
for (const key of Object.keys(DS)) {
  if (!key.endsWith("React")) continue;
  const base = key.slice(0, -"React".length);
  const cat = ICON_CATEGORIES.find((c) => base.startsWith(c) && base.length > c.length);
  if (!cat) continue;
  ICON_BY_REMIX[kebab(base.slice(cat.length))] = DS[key];
}

/**
 * Resolve a leadingIcon/trailingIcon arg into an icon component (or null).
 *  - falsy / "false"  -> no icon
 *  - true / "true"    -> the fallback Remix icon
 *  - any other string -> looked up as a Remix icon name (e.g. "download-line")
 */
export const resolveIcon = (val, fallbackRemix) => {
  if (!val || val === "false") return null;
  const remix = val === true || val === "true" ? fallbackRemix : String(val);
  return ICON_BY_REMIX[remix] || null;
};
