import React from "react";
import { DapDSStackReact, DapDSChipReact } from "dap-design-system/react";

/**
 * Pattern / Chip group — selectable chips (no single DS container exists).
 * VALUE-AWARE: receives { value, onChange } from the form engine. `multiple`
 * toggles single vs multi select; the value is a single option value (single)
 * or an array of values (multi). Options come from the options editor
 * (props.items = [{ label, value }]). Mirrors the `chip-single` / `chip-multi`
 * field-types.
 */
export default function ChipGroup({ items, multiple = false, value, onChange }) {
  const list = Array.isArray(items) ? items : [];
  const sel = Array.isArray(value) ? value : value == null ? [] : [value];

  const onSelect = (id) => {
    if (!onChange) return;
    if (multiple) onChange(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
    else onChange(value === id ? undefined : id);
  };

  return (
    <DapDSStackReact direction="row" gap="sm" wrap>
      {list.map((o, i) => {
        const id = o.value ?? o.id ?? String(i);
        const selected = multiple ? sel.includes(id) : value === id;
        return (
          <DapDSChipReact key={id} selected={selected || undefined} onDdsSelect={() => onSelect(id)}>
            {o.label}
          </DapDSChipReact>
        );
      })}
    </DapDSStackReact>
  );
}
