import { DapDSTypographyReact } from "dap-design-system/react";

// Screen header rendered with DapDSTypography — NOT the old preview-* raw markup.
// stepLabel -> caption, title -> h2, description -> body. This is the piece that
// made builder output drift from Storybook; going through DS fixes the 1:1.
export default function Header({ header }) {
  if (!header) return null;
  const { stepLabel, title, description } = header;
  if (!stepLabel && !title && !description) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {stepLabel && <DapDSTypographyReact variant="caption">{stepLabel}</DapDSTypographyReact>}
      {title && <DapDSTypographyReact variant="h2">{title}</DapDSTypographyReact>}
      {description && (
        <DapDSTypographyReact variant="body" size="md">
          {description}
        </DapDSTypographyReact>
      )}
    </div>
  );
}
