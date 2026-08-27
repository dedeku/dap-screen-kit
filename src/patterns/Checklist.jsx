import React from "react";
import { DapDSStackReact, DapDSCheckboxReact } from "dap-design-system/react";

/**
 * Pattern / Checklist — a multi-select checkbox group (no single DS container
 * exists). VALUE-AWARE: receives { value, onChange } from the form engine and
 * holds an array of the selected option values. Options come from the options
 * editor (props.items = [{ label, value, locked? }]).
 *
 *   locked option  → always checked + disabled (mandatory, can't be removed)
 *   defaultValue   → the pre-selected values applied once on mount
 *
 * Mirrors the `checklist` field-type (including its default / locked semantics).
 */
export default function Checklist({ items = [], defaultValue, value, onChange }) {
  const list = Array.isArray(items) ? items : [];
  const idOf = (o, i) => o.value ?? o.id ?? String(i);
  const lockedVals = list.filter((o) => o.locked).map((o, i) => idOf(o, i));
  const sel = Array.isArray(value) ? value : [];
  // locked options are always part of the effective selection.
  const effective = [...new Set([...sel, ...lockedVals])];

  // Seed the default (+ locked) into the form value once, so branching sees it.
  React.useEffect(() => {
    if (!onChange) return;
    const seed = [...new Set([...sel, ...(Array.isArray(defaultValue) ? defaultValue : []), ...lockedVals])];
    if (seed.length !== sel.length || seed.some((x) => !sel.includes(x))) onChange(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id, locked) => {
    if (locked || !onChange) return;
    onChange(effective.includes(id) ? effective.filter((x) => x !== id) : [...effective, id]);
  };

  return (
    <DapDSStackReact gap="sm">
      {list.map((o, i) => {
        const id = idOf(o, i);
        return (
          <DapDSCheckboxReact key={id} checked={effective.includes(id)} disabled={o.locked || undefined} onDdsChange={() => toggle(id, o.locked)}>
            {o.label}
          </DapDSCheckboxReact>
        );
      })}
    </DapDSStackReact>
  );
}
