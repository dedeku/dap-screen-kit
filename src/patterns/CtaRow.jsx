import React from "react";
import { DapDSButtonReact, DapDSStackReact } from "dap-design-system/react";
import { resolveIcon } from "./icon.js";

/**
 * Pattern / CTA Row — a composed, fully editable call-to-action row (not a single
 * DS component). Three arg-driven action slots (a1/a2/a3, each exposing the full
 * Button prop model) + row-level axes. Lives in screen-kit so Storybook and the
 * designer render the same component.
 */
export const CTA_VARIANTS = [
  "primary", "outline", "subtle", "clean", "subtle-neutral", "subtle-quiet",
  "subtle-menu", "subtle-menu-item", "primary-inverted", "outline-inverted",
  "subtle-inverted", "clean-inverted", "subtle-quiet-inverted",
];
export const CTA_SIZES = ["lg", "md", "sm", "xs"];
const ALIGN = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" };

function ActionButton({ text, leadingIcon, trailingIcon, fullWidth, ...args }) {
  const Lead = resolveIcon(leadingIcon, "add-line");
  const Trail = resolveIcon(trailingIcon, "arrow-right-line");
  const style = fullWidth ? { display: "block", width: "100%" } : undefined;
  if (!Lead && !Trail)
    return <DapDSButtonReact {...args} style={style}>{text}</DapDSButtonReact>;
  return (
    <DapDSButtonReact {...args} style={style}>
      <DapDSStackReact direction="row">
        {Lead ? <Lead size={20} /> : null}
        <span>{text}</span>
        {Trail ? <Trail size={20} /> : null}
      </DapDSStackReact>
    </DapDSButtonReact>
  );
}

export default function CtaRow(args = {}) {
  const {
    inverted = false,
    align = "start",
    orientation = "row",
    reverse = false,
    divider = false,
    fullBleed = false,
    fullWidth = false,
    maxWidth = 720,
  } = args;

  const column = orientation === "column";

  const actions = [1, 2, 3]
    .filter((i) => args[`a${i}`])
    .map((i) => ({
      key: i,
      text: args[`a${i}Text`],
      variant: args[`a${i}Variant`],
      size: args[`a${i}Size`],
      leadingIcon: args[`a${i}Leading`],
      trailingIcon: args[`a${i}Trailing`],
      danger: args[`a${i}Danger`],
      loading: args[`a${i}Loading`],
      disabled: args[`a${i}Disabled`],
    }));

  const ordered = reverse ? [...actions].reverse() : actions;

  const surface = {
    background: inverted
      ? "var(--dds-background-brand-base-inverted, #4258ed)"
      : "var(--dds-background-neutral-base, #f5f7fa)",
    width: "100%",
    boxSizing: "border-box",
  };
  const inner = {
    maxWidth: fullBleed ? "100%" : maxWidth,
    margin: "0 auto",
    padding: "24px",
    boxSizing: "border-box",
    borderTop: divider
      ? `1px solid ${inverted ? "var(--dds-border-neutral-transparent, rgba(255,255,255,0.3))" : "var(--dds-border-neutral-divider, #e9edf2)"}`
      : "none",
  };
  const list = {
    display: "flex",
    flexDirection: column ? "column" : "row",
    gap: 12,
    alignItems: column ? "stretch" : "center",
    justifyContent: column ? "stretch" : ALIGN[align],
    flexWrap: column ? "nowrap" : "wrap",
  };

  return (
    <div style={surface}>
      <div style={inner}>
        <div style={list}>
          {ordered.map((a) => (
            <ActionButton
              key={a.key}
              text={a.text}
              variant={a.variant}
              size={a.size}
              leadingIcon={a.leadingIcon}
              trailingIcon={a.trailingIcon}
              danger={a.danger}
              loading={a.loading}
              disabled={a.disabled}
              fullWidth={column || fullWidth}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
