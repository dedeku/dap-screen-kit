import React from "react";
import {
  DapDSButtonReact,
  DapDSStackReact,
  DapDSSearchReact,
  SystemShareLineReact,
  DocumentFileTextLineReact,
} from "dap-design-system/react";

/**
 * Pattern / Hero — a composed, fully editable page hero (not a single DS
 * component). Reproduces the Figma "Hero section" set from DAP primitives +
 * tokens; every element is arg-driven. Lives here (screen-kit) so BOTH the
 * Storybook story and the life-event designer render the SAME component.
 * The surface is full-bleed; content sits in a centered max-width container.
 */
export const HERO_RESOLUTIONS = { "1024-": 1140, "640-1024": 720, "320-640": 360 };
export const HERO_CTA_VARIANTS = ["primary", "outline", "subtle", "clean", "outline-inverted", "subtle-inverted", "primary-inverted"];
const SUGGESTIONS = ["Csecsemőgondozási Díj (CSED)", "Nyugdíj", "Álláskeresési járadék"];

const HEADING = {
  fontFamily: "var(--dds-font-type, Inter, sans-serif)",
  fontSize: "var(--dds-font-7xl, 2.5rem)",
  fontWeight: "var(--dds-font-weight-bold, 700)",
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
  margin: 0,
};
const BODY = {
  fontFamily: "var(--dds-font-type, Inter, sans-serif)",
  fontSize: "var(--dds-font-lg, 1.125rem)",
  fontWeight: "var(--dds-font-weight-medium, 500)",
  lineHeight: 1.5,
  margin: 0,
};

export default function Hero({
  layout = "content",
  inverted = false,
  title = "Elvesztettem a munkámat",
  body = "Ha elvesztetted a munkádat, nálunk online elkezdheted az álláskeresőként történő regisztrációt és az álláskeresési járadék igénylésének előkészítését.",
  showShare = true,
  showPrint = true,
  cta = true,
  ctaText = "Regisztráció indítása",
  ctaVariant = "outline-inverted",
  secondaryCta = false,
  secondaryCtaText = "Secondary action",
  secondaryCtaVariant = "subtle",
  illustration = false,
  resolution = "1024-",
}) {
  const width = HERO_RESOLUTIONS[resolution] ?? 1140;
  const narrow = width < 720;

  const surface = {
    background: inverted
      ? "var(--dds-background-brand-base-inverted, #4258ed)"
      : "var(--dds-background-neutral-base, #f5f7fa)",
    width: "100%",
    borderRadius: 0,
    boxSizing: "border-box",
  };
  const inner = {
    maxWidth: width,
    margin: "0 auto",
    padding: narrow ? "24px 16px" : "48px 24px",
    display: "flex",
    gap: 40,
    alignItems: "center",
  };
  const headingColor = inverted
    ? "var(--dds-text-neutral-on-inverted, #fff)"
    : "var(--dds-text-neutral-strong, #1C1F26)";
  const bodyColor = inverted
    ? "var(--dds-text-neutral-on-inverted, #fff)"
    : "var(--dds-text-neutral-base, #404753)";
  const actionVariant = inverted ? "subtle-inverted" : "subtle";
  const chipVariant = inverted ? "outline-inverted" : "outline";

  const Content = layout === "search" ? (
    <div style={{ display: "grid", gap: 24, flex: 1, minWidth: 0 }}>
      <h1 style={{ ...HEADING, color: headingColor }}>{title}</h1>
      <div style={{ maxWidth: 560 }}>
        <DapDSSearchReact placeholder="Keresés életeseményekre és ügyekre" searchMode="none" />
      </div>
      <DapDSStackReact direction="row">
        {SUGGESTIONS.map((sug) => (
          <DapDSButtonReact key={sug} variant={chipVariant} size="sm">{sug}</DapDSButtonReact>
        ))}
      </DapDSStackReact>
    </div>
  ) : (
    <div style={{ display: "grid", gap: 20, flex: 1, minWidth: 0 }}>
      {(showShare || showPrint) && (
        <DapDSStackReact direction="row">
          {showShare && (
            <DapDSButtonReact variant={actionVariant} size="sm">
              <DapDSStackReact direction="row"><SystemShareLineReact size={16} /><span>Megosztás</span></DapDSStackReact>
            </DapDSButtonReact>
          )}
          {showPrint && (
            <DapDSButtonReact variant={actionVariant} size="sm">
              <DapDSStackReact direction="row"><DocumentFileTextLineReact size={16} /><span>Nyomtatás</span></DapDSStackReact>
            </DapDSButtonReact>
          )}
        </DapDSStackReact>
      )}
      {title && <h1 style={{ ...HEADING, color: headingColor }}>{title}</h1>}
      {body && <p style={{ ...BODY, color: bodyColor, maxWidth: 560 }}>{body}</p>}
      {(cta || secondaryCta) && (
        <DapDSStackReact direction="row">
          {cta && <DapDSButtonReact variant={ctaVariant}>{ctaText}</DapDSButtonReact>}
          {secondaryCta && <DapDSButtonReact variant={secondaryCtaVariant}>{secondaryCtaText}</DapDSButtonReact>}
        </DapDSStackReact>
      )}
    </div>
  );

  const Illustration = illustration && layout !== "search" && !narrow ? (
    <div
      aria-hidden
      style={{
        width: 320, height: 220, flex: "0 0 auto", borderRadius: 12,
        background: "var(--dds-transparent-white-subtle, rgba(255,255,255,0.12))",
        border: "1px dashed var(--dds-border-neutral-transparent, rgba(255,255,255,0.3))",
        display: "grid", placeItems: "center",
        font: "12px/1.4 monospace", color: headingColor, opacity: 0.8,
      }}
    >
      Illustration
    </div>
  ) : null;

  return (
    <div style={surface}>
      <div style={inner}>
        {Content}
        {Illustration}
      </div>
    </div>
  );
}
