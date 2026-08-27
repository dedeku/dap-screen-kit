import React from "react";
import { DapDSButtonReact, DapDSLinkReact } from "dap-design-system/react";

/**
 * Pattern / Footer — the global site footer, composed from DAP primitives.
 * Reproduces the Figma "Footer" component (EM_ÉE v1.0): a help block (phones +
 * e-mail + help-centre button), an optional app-download promo, the program
 * links, and a legal bar. Arg-driven so every text + the section toggles are
 * editable; full-bleed (100% width, no radius, no outer padding). Lives in
 * screen-kit so Storybook and the life-event designer render the same footer.
 */
const PROGRAM_LINKS = [
  ["/digitalis-allampolgarsag", "Digitális állampolgárság"],
  ["/dap-szolgaltatasok", "DÁP szolgáltatások"],
  ["/allami-piaci", "Állami és piaci szereplőknek"],
];
const LEGAL_LINKS = [
  ["/sutik", "Sütik beállítása"],
  ["/aszf", "Általános szerződési feltételek"],
  ["/akadalymentesites", "Akadálymentesítési nyilatkozat"],
  ["/impresszum", "Impresszum"],
];

export default function Footer({
  inverted = false,
  helpTitle = "Segítség",
  phoneHu = "1818",
  phoneIntl = "+36 1 550 1858",
  email = "1818@1818.hu",
  helpButtonText = "Súgóközpont",
  showApp = true,
  appTitle = "Töltsd le a Digitális Állampolgár mobilalkalmazást!",
  programTitle = "Digitális Állampolgárság Program",
  showLegal = true,
  copyright = "© 2025",
}) {
  const ink = inverted ? "var(--dds-text-neutral-on-inverted, #fff)" : "var(--dds-text-neutral-base, #1C1F26)";
  const subtle = inverted ? "rgba(255,255,255,0.72)" : "var(--dds-text-neutral-subtle, #5b6069)";
  const surface = {
    background: inverted
      ? "var(--dds-background-brand-base-inverted, #4258ed)"
      : "var(--dds-background-neutral-medium, #eef0f2)",
    color: ink,
    width: "100%",
    boxSizing: "border-box",
  };
  const band = { maxWidth: 1440, margin: "0 auto", boxSizing: "border-box" };
  const linkStyle = { color: ink, textDecoration: "none" };

  return (
    <div style={surface}>
      <div style={{ ...band, padding: 40, display: "grid", gridTemplateColumns: showApp ? "1fr 1fr" : "1fr", gap: 40 }}>
        {/* Help */}
        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <h3 style={{ margin: "0 0 8px", color: ink }}>{helpTitle}</h3>
          <div>Telefonszám (Magyarországról): <strong>{phoneHu}</strong></div>
          <div>Telefonszám (külföldről): <strong>{phoneIntl}</strong></div>
          <div>E-mail cím: <strong>{email}</strong></div>
          {helpButtonText && (
            <div style={{ marginTop: 8 }}>
              <DapDSButtonReact variant={inverted ? "subtle-inverted" : "primary"}>{helpButtonText}</DapDSButtonReact>
            </div>
          )}
        </div>

        {/* App download promo */}
        {showApp && (
          <div style={{
            background: inverted ? "rgba(255,255,255,0.14)" : "var(--dds-background-brand-base-inverted, #4258ed)",
            color: "var(--dds-text-neutral-on-inverted, #fff)",
            borderRadius: 16, padding: 24, display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>{appTitle}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ background: "#000", color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: 13 }}>▶ Google Play</span>
                <span style={{ background: "#000", color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: 13 }}> App Store-ból</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Program links */}
      <div style={{ ...band, padding: "0 40px 24px" }}>
        <h3 style={{ margin: "0 0 12px", color: ink }}>{programTitle}</h3>
        <div style={{ display: "grid", gap: 6 }}>
          {PROGRAM_LINKS.map(([href, label]) => (
            <DapDSLinkReact key={href} href={href} style={linkStyle}>{label}</DapDSLinkReact>
          ))}
        </div>
      </div>

      {/* Legal bar */}
      {showLegal && (
        <div style={{ borderTop: `1px solid ${inverted ? "rgba(255,255,255,0.28)" : "var(--dds-border-neutral-subtle, #d9dbde)"}` }}>
          <div style={{ ...band, padding: "16px 40px", display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13, color: subtle }}>
            {LEGAL_LINKS.map(([href, label]) => (
              <a key={href} href={href} style={{ ...linkStyle, color: "inherit" }}>{label}</a>
            ))}
            <span style={{ marginLeft: "auto" }}>{copyright}</span>
          </div>
        </div>
      )}
    </div>
  );
}
