import React from "react";
import {
  DapDSNavigationMenuReact,
  DapDSNavigationMenuItemReact,
  DapDSButtonReact,
  DapDSIconButtonReact,
  SystemSearchLineReact,
} from "dap-design-system/react";

/**
 * Pattern / Header — the global site header, composed from DAP primitives.
 * Arg-driven variant axes (variant, inverted, activePanel, action toggles).
 * Full-bleed. Lives in screen-kit so Storybook and the designer share it.
 */
const NAV = [
  ["/ugyintezes", "Ügyintézés"],
  ["/mobil", "Mobilalkalmazás"],
  ["/hirek", "Hírek"],
];

function Logo({ inverted }) {
  const fg = inverted ? "var(--dds-text-neutral-on-inverted, #fff)" : "var(--dds-background-brand-base-inverted, #4258ed)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flex: "0 0 auto",
        background: inverted ? "rgba(255,255,255,0.14)" : "var(--dds-background-brand-subtle, #e6e2fb)",
        color: fg, display: "grid", placeItems: "center",
        font: "800 20px/1 Inter, sans-serif", letterSpacing: "-0.03em",
      }}>iD</div>
      <div style={{ font: "700 12px/1.15 Inter, sans-serif", color: fg }}>
        Digitális<br />Állampolgárság<br />Program
      </div>
    </div>
  );
}

export default function Header({
  variant = "Global",
  inverted = false,
  activePanel = "None",
  showSearch = true,
  showLang = true,
  showLogout = true,
  langText = "EN",
  logoutText = "Kijelentkezés",
}) {
  const isGlobal = variant === "Global";
  const surface = {
    background: inverted
      ? "var(--dds-background-brand-base-inverted, #4258ed)"
      : "var(--dds-background-neutral-subtle, #fff)",
    borderBottom: inverted ? "none" : "1px solid var(--dds-border-neutral-divider, #e9edf2)",
    width: "100%",
    boxSizing: "border-box",
  };
  const inner = {
    maxWidth: 1280, margin: "0 auto", padding: "12px 24px",
    display: "flex", alignItems: "center", gap: 24,
  };
  const actionVariant = inverted ? "subtle-inverted" : "outline";
  const activeHref = activePanel === "Menu" ? "/ugyintezes" : undefined;

  return (
    <div style={surface}>
      <div style={inner}>
        <Logo inverted={inverted} />

        {isGlobal && (
          <DapDSNavigationMenuReact orientation="horizontal" activeHref={activeHref} style={{ flex: 1 }}>
            {NAV.map(([href, label]) => (
              <DapDSNavigationMenuItemReact key={href} href={href} label={label} />
            ))}
          </DapDSNavigationMenuReact>
        )}
        {!isGlobal && <div style={{ flex: 1 }} />}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {showLang && <DapDSButtonReact variant={actionVariant} size="sm">{langText}</DapDSButtonReact>}
          {showLogout && <DapDSButtonReact variant={inverted ? "subtle-inverted" : "subtle"} size="sm">{logoutText}</DapDSButtonReact>}
          {isGlobal && showSearch && (
            <DapDSIconButtonReact
              ariaLabel="Keresés"
              variant={activePanel === "Search" ? (inverted ? "primary-inverted" : "primary") : (inverted ? "subtle-inverted" : "outline")}
            >
              <SystemSearchLineReact size={20} />
            </DapDSIconButtonReact>
          )}
        </div>
      </div>
    </div>
  );
}
