import { DapDSButtonReact } from "dap-design-system/react";

const variantOf = (a) => (a.type === "button-primary" ? "primary" : "outline");

// Footer action row. Left/right split preserved from the form-builder. `onAction`
// lets a flow runner (XState) react to a button; omit it for a static preview.
export default function Actions({ actions = [], onAction }) {
  if (!actions.length) return null;
  const left = actions.filter((a) => a.position === "left");
  const right = actions.filter((a) => a.position !== "left");

  const btn = (a) => (
    <DapDSButtonReact key={a.id} variant={variantOf(a)} onClick={onAction ? () => onAction(a) : undefined}>
      {a.label}
    </DapDSButtonReact>
  );

  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 8 }}>
      <div style={{ display: "flex", gap: 12 }}>{left.map(btn)}</div>
      <div style={{ display: "flex", gap: 12 }}>{right.map(btn)}</div>
    </div>
  );
}
