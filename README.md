# @dap/screen-kit

Common DAP screen runtime. One render path — a single-source **registry** over
`dap-design-system` plus a `<ScreenRenderer>` — shared by every DAP surface, so a
screen assembled in the builder looks **1:1** with the original design components
in Storybook.

## Why

Three renderers had drifted apart, each re-mapping field-type → DS component by
hand, with different field-type sets and two different conditional schemas:

| Surface | Was | Now |
|---|---|---|
| Form builder preview / player | `form-builder/src/components/PreviewPanel.jsx` | mounts `<ScreenRenderer>` |
| Life-event flows | `dap-elvesztettem-a-munkam/src/ScreenRenderer.jsx` | mounts `<ScreenRenderer>` (controlled) |
| Storybook | curated + generated stories | canonical stories read the `registry` |

The DS components were already identical (same package, same `light.theme.css`).
The drift lived in the glue. This package **is** the glue, once.

## Install (git-tag dependency, zero infra to start)

```json
{
  "dependencies": {
    "@dap/screen-kit": "github:dedeku/dap-screen-kit#v0.1.0"
  }
}
```

`dap-design-system`, `react`, `react-dom` are **peerDependencies** — the consumer
owns the single copy (a second `dap-design-system` would double-register the web
components). `prepare` builds `dist/` on install.

Later, if release cadence grows, publish to GitHub Packages under the private
`@dap` scope instead.

## Usage

```jsx
import { ScreenRenderer } from "@dap/screen-kit";
// consumer already imports the DS theme once, at its entry:
//   import "dap-design-system/styles/dds-reset.css";
//   import "dap-design-system/styles/light.theme.css";

// uncontrolled (builder preview, standalone player)
<ScreenRenderer screen={screenJson} />

// controlled (XState life-event flow)
<ScreenRenderer
  screen={screenJson}
  values={ctx.values}
  onChange={(id, value) => send({ type: "ANSWER", id, value })}
  onAction={(action) => send({ type: "ACTION", action })}
/>
```

## API

- `ScreenRenderer` — renders a screen JSON 1:1; controlled or uncontrolled.
- `registry`, `isWired(type)` — the field-type → DS render map (single source).
- `Field`, `Header`, `Actions` — the pieces, if you compose your own shell.
- schema: `FIELD_TYPES`, `FIELD_TYPE_SET`, `matchPredicate`, `isVisible`,
  `normalizeVisibleWhen`, JSON typedefs.
- state: `initialValues`, `fieldTypeMap`, `makeChangeHandler`, `readChangeValue`.

## Conditional visibility

`visibleWhen` is canonical:

```json
{ "visibleWhen": { "field": "employed", "op": "equals", "value": "yes" } }
```

`op`: `equals | includes | truthy | falsy`. The legacy form-builder
`showWhen: { field, equals }` is auto-normalized by `normalizeVisibleWhen`, so old
JSON keeps rendering until a codemod rewrites it.

## Field types

Canonical superset in `src/schema/field-types.js`. `wired: true` = real registry
entry; `wired: false` = catalogued, entry still a TODO (port from the two
existing renderers).

## Status — scaffold

- [x] package + build (tsup ESM, external peer deps)
- [x] schema: field-type catalog, `visibleWhen`, JSON typedefs
- [x] value-state engine (initial values, change delegation)
- [x] registry: title, section-label, text-field, date-picker, radio-group,
      dropdown, content-switcher, checkbox, switch, chip-multi
- [x] `<ScreenRenderer>` + Header/Field/Actions (DS Typography, no raw markup)
- [ ] registry: info-callout, number-field, textarea, checklist, chip-single,
      data-list, timeline, file-upload, repeatable
- [x] `gen-field-schema.mjs` — `.d.ts` extractor → `src/generated/field-schema.json`
      (per field type: DS component + prop enums/defaults). Accessors:
      `getFieldPropModel` / `getPropEnum` / `getPropDefault` (DS-free via
      `@dap/screen-kit/schema`). Regen after DS bump: `npm run gen:field-schema`.
- [ ] migrate form-builder → delete PreviewPanel render
- [ ] migrate elvesztettem → delete local ScreenRenderer
- [ ] Storybook canonical stories through `registry`
- [ ] Chromatic snapshot of a sample screen (regression guard)
