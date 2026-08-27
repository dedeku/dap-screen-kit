import React from "react";
import { DapDSStackReact, DapDSCardReact, DapDSButtonReact, DapDSTypographyReact } from "dap-design-system/react";

/**
 * Pattern / Repeatable — a dynamic block of rows, each row a set of sub-fields.
 * VALUE-AWARE and COMPOSITE: the value is an array of row objects
 * ({ subFieldId: value }); the sub-fields (props.itemFields, arbitrary field-type
 * definitions) are rendered CONTROLLED via `renderField` handed in by the value
 * engine (Field's recursion helper). Mirrors the `repeatable` field-type — the
 * one composite that has no simple options mapping — so it can be authored as a
 * ds: catalog component with its own sub-field editor.
 */
export default function Repeatable({ itemFields = [], addLabel = "További hozzáadása", groupLabel, value, onChange, renderField }) {
  const rows = Array.isArray(value) && value.length ? value : [{}];
  const setRows = (next) => onChange && onChange(next);
  const setRow = (idx, sub, val) => setRows(rows.map((r, i) => (i === idx ? { ...r, [sub]: val } : r)));

  return (
    <DapDSStackReact gap="md">
      {groupLabel ? <DapDSTypographyReact variant="caption">{groupLabel}</DapDSTypographyReact> : null}
      {rows.map((row, idx) => (
        <DapDSCardReact key={idx}>
          <DapDSStackReact gap="sm">
            {itemFields.map((sf) =>
              renderField ? renderField(sf, row, (sub, val) => setRow(idx, sub, val)) : null,
            )}
            {rows.length > 1 ? (
              <div>
                <DapDSButtonReact variant="subtle" size="sm" onClick={() => setRows(rows.filter((_, i) => i !== idx))}>
                  Sor törlése
                </DapDSButtonReact>
              </div>
            ) : null}
          </DapDSStackReact>
        </DapDSCardReact>
      ))}
      <div>
        <DapDSButtonReact variant="outline" onClick={() => setRows([...rows, {}])}>
          {addLabel}
        </DapDSButtonReact>
      </div>
    </DapDSStackReact>
  );
}
