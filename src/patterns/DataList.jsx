import React from "react";
import { DapDSCardReact, DapDSTypographyReact } from "dap-design-system/react";

/**
 * Pattern / Data list — read-only label/value rows in a DapDSCard (e.g. the
 * pre-filled DÁP-profile data the citizen only checks). Display-only. Rows come
 * from the options editor (props.items = [{ label, value }]); `editHint` is an
 * optional footnote. Mirrors the `data-list` field-type render.
 */
export default function DataList({ items, editHint }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <DapDSCardReact>
      <div style={{ display: "grid", gap: 8, padding: 4 }}>
        {list.map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
            <DapDSTypographyReact variant="description" size="sm">{it.label}</DapDSTypographyReact>
            <DapDSTypographyReact variant="body" size="md">{it.value}</DapDSTypographyReact>
          </div>
        ))}
        {editHint ? <DapDSTypographyReact variant="description" size="sm">{editHint}</DapDSTypographyReact> : null}
      </div>
    </DapDSCardReact>
  );
}
