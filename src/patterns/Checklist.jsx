import React from "react";
import { DapDSStackReact, DapDSCheckboxReact } from "dap-design-system/react";

/**
 * Pattern / Checklist — a multi-select checkbox group (no single DS container
 * exists). VALUE-AWARE: it receives { value, onChange } from the form engine and
 * holds an array of the selected option values. Options come from the options
 * editor (props.items = [{ label, value }]). Mirrors the `checklist` field-type.
 */
export default function Checklist({ items, value, onChange }) {
  const list = Array.isArray(items) ? items : [];
  const sel = Array.isArray(value) ? value : [];
  const toggle = (id) => {
    if (!onChange) return;
    onChange(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  };
  return (
    <DapDSStackReact gap="sm">
      {list.map((o, i) => {
        const id = o.value ?? o.id ?? String(i);
        return (
          <DapDSCheckboxReact key={id} checked={sel.includes(id)} onDdsChange={() => toggle(id)}>
            {o.label}
          </DapDSCheckboxReact>
        );
      })}
    </DapDSStackReact>
  );
}
