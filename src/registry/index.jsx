// The single-source component registry: canonical field type -> how it renders
// as real dap-design-system nodes. Every renderer (form-builder preview, player,
// life-event flows, Storybook) goes through THIS map, so there is exactly one
// definition of "what a radio-group looks like".
//
// Entry shape:
//   {
//     width?: "full" | "half"   // default column span; field.width may override
//     render(field, ctx) => ReactNode
//   }
//
// ctx (controlled — no DOM event delegation, matches the life-event flows):
//   {
//     value,                  // current value for field.id
//     onChange(id, val),      // update any field id (zones/repeatable write others)
//     setValue(val),          // sugar for onChange(field.id, val)
//     renderField(field, values, onChange),  // recurse (repeatable sub-fields)
//   }
//
// Non-DS markup is banned here: title / section-label / group labels render
// through DapDSTypography, NOT raw <h2>/<div>, so builder output matches Storybook.

import {
  DapDSTypographyReact,
  DapDSStackReact,
  DapDSInputReact,
  DapDSNumberInputReact,
  DapDSTextareaReact,
  DapDSSelectReact,
  DapDSOptionItemReact,
  DapDSRadioGroupReact,
  DapDSRadioButtonReact,
  DapDSCheckboxReact,
  DapDSSwitchReact,
  DapDSDatePickerReact,
  DapDSChipReact,
  DapDSContentSwitcherReact,
  DapDSContentSwitcherItemReact,
  DapDSCalloutReact,
  DapDSTimelineReact,
  DapDSTimelineItemReact,
  DapDSFileInputReact,
  DapDSCardReact,
  DapDSButtonReact,
} from "dap-design-system/react";
import { LEGACY_TYPE_ALIASES } from "../schema/field-types.js";

const opts = (field) => field.options || [];
const defaultOption = (field) => (opts(field).find((o) => o.selected) || {}).id;

/** Toggle an id within an array value. */
const toggle = (arr, id) => {
  const list = Array.isArray(arr) ? arr : [];
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
};

/** Small DS group label used above checklists / chip rows. */
const GroupLabel = ({ children }) =>
  children ? <DapDSTypographyReact variant="caption">{children}</DapDSTypographyReact> : null;

export const registry = {
  /* ---- typography / structure ---------------------------------------- */
  title: {
    width: "full",
    render: (field) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {field.subtitle && (
          <DapDSTypographyReact variant="caption">{field.subtitle}</DapDSTypographyReact>
        )}
        {(field.title || field.label) && (
          <DapDSTypographyReact variant="h2">{field.title || field.label}</DapDSTypographyReact>
        )}
        {field.description && (
          <DapDSTypographyReact variant="body" size="md">
            {field.description}
          </DapDSTypographyReact>
        )}
      </div>
    ),
  },

  "section-label": {
    width: "full",
    render: (field) => (
      <DapDSTypographyReact variant="caption">{field.label}</DapDSTypographyReact>
    ),
  },

  "info-callout": {
    width: "full",
    render: (field) => (
      <DapDSCalloutReact variant={field.variant || "neutral"} title={field.title || undefined}>
        {(field.body || field.label || "").split("\n").map((line, i) => (
          <p key={i} style={{ margin: i ? "6px 0 0" : 0 }}>
            {line}
          </p>
        ))}
      </DapDSCalloutReact>
    ),
  },

  /* ---- text inputs --------------------------------------------------- */
  // helperText -> `description` (helper under the label), NOT `feedback` (that is
  // the validation message slot). The life-event flow used `feedback` — canonical
  // corrects it to `description`, matching the form-builder + design intent.
  "text-field": {
    render: (field, { value, setValue }) => (
      <DapDSInputReact
        label={field.label || " "}
        placeholder={field.placeholder || ""}
        description={field.helperText || ""}
        value={value ?? ""}
        required={field.required || undefined}
        onDdsInput={(e) => setValue(e.target.value)}
      />
    ),
  },

  "number-field": {
    render: (field, { value, setValue }) => (
      <DapDSNumberInputReact
        label={field.label || " "}
        placeholder={field.placeholder || ""}
        description={field.helperText || ""}
        value={value ?? ""}
        thousandSeparator={field.thousandSeparator}
        required={field.required || undefined}
        onDdsInput={(e) => setValue(e.target.value)}
      />
    ),
  },

  textarea: {
    render: (field, { value, setValue }) => (
      <DapDSTextareaReact
        label={field.label || " "}
        placeholder={field.placeholder || ""}
        description={field.helperText || ""}
        value={value ?? ""}
        required={field.required || undefined}
        onDdsInput={(e) => setValue(e.target.value)}
      />
    ),
  },

  "date-picker": {
    render: (field, { value, setValue }) => (
      <DapDSDatePickerReact
        label={field.label || " "}
        placeholder={field.placeholder || ""}
        description={field.helperText || ""}
        value={value || undefined}
        required={field.required || undefined}
        onDdsChange={(e) => setValue(e.target.value)}
      />
    ),
  },

  /* ---- choice -------------------------------------------------------- */
  "radio-group": {
    width: "full",
    render: (field, { value, setValue }) => (
      <DapDSRadioGroupReact
        label={field.groupLabel || field.label || " "}
        value={value ?? defaultOption(field) ?? ""}
        onDdsChange={(e) => setValue(e.target.value)}
      >
        {opts(field).map((o) => (
          <DapDSRadioButtonReact key={o.id} value={o.id} label={o.label} />
        ))}
      </DapDSRadioGroupReact>
    ),
  },

  dropdown: {
    render: (field, { value, setValue }) => (
      <DapDSSelectReact
        label={field.label || " "}
        placeholder={field.placeholder || ""}
        value={value ?? defaultOption(field) ?? ""}
        onDdsChange={(e) => setValue(e.target.value)}
      >
        {opts(field).map((o) => (
          <DapDSOptionItemReact key={o.id} value={o.id}>
            {o.label}
          </DapDSOptionItemReact>
        ))}
      </DapDSSelectReact>
    ),
  },

  "content-switcher": {
    width: "full",
    render: (field, { value, setValue }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <GroupLabel>{field.groupLabel}</GroupLabel>
        <DapDSContentSwitcherReact
          value={value ?? defaultOption(field)}
          onDdsChange={(e) => setValue(e.target.value)}
        >
          {opts(field).map((o) => (
            <DapDSContentSwitcherItemReact key={o.id} value={o.id}>
              {o.label}
            </DapDSContentSwitcherItemReact>
          ))}
        </DapDSContentSwitcherReact>
      </div>
    ),
  },

  checkbox: {
    width: "full",
    render: (field, { value, setValue }) => (
      <DapDSCheckboxReact
        label={field.label || " "}
        checked={value ?? field.checked ?? field.default ?? false}
        disabled={field.locked || undefined}
        onDdsChange={(e) => setValue(field.locked ? true : e.target.checked)}
      />
    ),
  },

  switch: {
    width: "full",
    render: (field, { value, setValue }) => (
      <DapDSSwitchReact
        label={field.label || " "}
        checked={value ?? field.checked ?? false}
        onDdsChange={(e) => setValue(e.target.checked)}
      />
    ),
  },

  // Group of checkboxes; value is an array of selected option ids.
  checklist: {
    width: "full",
    render: (field, { value, setValue }) => {
      const sel = Array.isArray(value) ? value : field.default ?? [];
      return (
        <DapDSStackReact gap="sm">
          <GroupLabel>{field.groupLabel}</GroupLabel>
          {opts(field).map((o) => (
            <DapDSCheckboxReact
              key={o.id}
              label={o.label}
              checked={sel.includes(o.id)}
              disabled={o.locked || undefined}
              onDdsChange={() => setValue(o.locked ? sel : toggle(sel, o.id))}
            />
          ))}
        </DapDSStackReact>
      );
    },
  },

  // Single-choice chip row; value is the selected option id.
  "chip-single": {
    width: "full",
    render: (field, { value, setValue }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <GroupLabel>{field.groupLabel}</GroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {opts(field).map((o) => (
            <DapDSChipReact
              key={o.id}
              selectable
              selected={value === o.id}
              onDdsSelect={() => setValue(value === o.id ? undefined : o.id)}
            >
              {o.label}
            </DapDSChipReact>
          ))}
        </div>
      </div>
    ),
  },

  // Multi-choice chip row; value is an array of selected option ids.
  "chip-multi": {
    width: "full",
    render: (field, { value, setValue }) => {
      const sel = Array.isArray(value) ? value : [];
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <GroupLabel>{field.groupLabel}</GroupLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {opts(field).map((o) => (
              <DapDSChipReact
                key={o.id}
                selectable
                selected={sel.includes(o.id)}
                onDdsSelect={() => setValue(toggle(sel, o.id))}
              >
                {o.label}
              </DapDSChipReact>
            ))}
          </div>
        </div>
      );
    },
  },

  /* ---- data / files / composite -------------------------------------- */
  // Process step overview — no input. items: [{ title, description }].
  timeline: {
    width: "full",
    render: (field) => (
      <DapDSTimelineReact>
        {(field.items || []).map((it, i) => (
          <DapDSTimelineItemReact key={i}>
            <DapDSTypographyReact variant="body" size="md">{it.title}</DapDSTypographyReact>
            {it.description && (
              <DapDSTypographyReact variant="description" size="sm">
                {it.description}
              </DapDSTypographyReact>
            )}
          </DapDSTimelineItemReact>
        ))}
      </DapDSTimelineReact>
    ),
  },

  // Read-only prefilled data (e.g. DÁP identity). items: [{ label, value }].
  "data-list": {
    width: "full",
    render: (field) => (
      <DapDSCardReact>
        <div style={{ display: "grid", gap: 10, padding: 4 }}>
          {(field.items || []).map((it, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(120px,38%) 1fr", gap: 12 }}>
              <DapDSTypographyReact variant="description" size="sm">{it.label}</DapDSTypographyReact>
              <DapDSTypographyReact variant="body" size="md">{it.value}</DapDSTypographyReact>
            </div>
          ))}
        </div>
        {field.editHint && (
          <div style={{ marginTop: 12 }}>
            <DapDSTypographyReact variant="description" size="sm">{field.editHint}</DapDSTypographyReact>
          </div>
        )}
      </DapDSCardReact>
    ),
  },

  // File upload zone(s). value is a list of selected file names per zone id.
  "file-upload": {
    width: "full",
    render: (field, { onChange }) => (
      <DapDSStackReact gap="md">
        {(field.zones || [{ id: field.id, label: field.label }]).map((z) => (
          <DapDSFileInputReact
            key={z.id}
            label={z.label}
            description={z.description}
            multiple={z.multiple ?? true}
            accept={z.accept}
            onDdsFileChange={(e) => onChange(z.id, (e.detail?.files || []).map((f) => f.name))}
          />
        ))}
      </DapDSStackReact>
    ),
  },

  // Repeatable block of sub-fields. value is an array of row objects.
  repeatable: {
    width: "full",
    render: (field, { value, setValue, renderField }) => {
      const rows = Array.isArray(value) && value.length ? value : [{}];
      const setRow = (idx, sub, val) =>
        setValue(rows.map((r, i) => (i === idx ? { ...r, [sub]: val } : r)));
      return (
        <DapDSStackReact gap="md">
          <GroupLabel>{field.groupLabel}</GroupLabel>
          {rows.map((row, idx) => (
            <DapDSCardReact key={idx}>
              <DapDSStackReact gap="sm">
                {(field.itemFields || []).map((sf) =>
                  renderField(sf, row, (sub, val) => setRow(idx, sub, val)),
                )}
              </DapDSStackReact>
            </DapDSCardReact>
          ))}
          <div>
            <DapDSButtonReact variant="outline" onClick={() => setValue([...rows, {}])}>
              {field.addLabel || "További hozzáadása"}
            </DapDSButtonReact>
          </div>
        </DapDSStackReact>
      );
    },
  },
};

// Wire legacy type names to their canonical entry (e.g. "multi-select" -> chip-multi).
for (const [legacy, canonical] of Object.entries(LEGACY_TYPE_ALIASES)) {
  if (!registry[legacy] && registry[canonical]) registry[legacy] = registry[canonical];
}

/** True when a field type has a real (non-stub) registry entry. */
export function isWired(type) {
  return Object.prototype.hasOwnProperty.call(registry, type);
}
