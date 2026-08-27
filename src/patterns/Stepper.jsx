import React, { useContext, useState } from "react";
import { FlowContext } from "./FlowContext.js";

/**
 * Pattern / Stepper — the DAP "Main menu" v2 (Figma node 2227:78493): a vertical
 * progress rail (a dot per phase: done / active / upcoming) beside an accordion
 * phase menu (phase header + its step sub-items, the active step highlighted).
 *
 * FLOW-AWARE: it reads `{ steps, current, screensMap, onNavigate }` from
 * FlowContext, so the menu tracks the real flow with zero configuration — the
 * same data the runtime frame and the designer canvas both provide. With no
 * provider (Storybook) it falls back to the `steps`/`current` props or a small
 * built-in sample. Editable props are just the chrome: `label`, `showRail`.
 */

const SAMPLE_STEPS = [
  { id: "belepes", stepLabel: "Bejelentkezés", title: "Bejelentkezés" },
  { id: "szemelyes", stepLabel: "Kötelező adatok", title: "Személyes adatok" },
  { id: "elerhetoseg", stepLabel: "Kötelező adatok", title: "Telefonszám és e-mail cím" },
  { id: "cim", stepLabel: "Kötelező adatok", title: "Értesítési cím" },
  { id: "utolso-mv", stepLabel: "Utolsó munkaviszony", title: "Utolsó munkaviszony adatai" },
  { id: "tanulmanyok", stepLabel: "Tanulmányok és készségek", title: "Legmagasabb iskolai végzettség" },
  { id: "munkakeeses", stepLabel: "Munkakeresés", title: "Legfontosabb cél" },
  { id: "nyilatkozatok", stepLabel: "Nyilatkozatok", title: "Nyilatkozatok" },
  { id: "kerelem", stepLabel: "Kérelem benyújtása", title: "Kérelem ellenőrzése" },
];

const itemTitle = (step, screensMap) =>
  (step.screen && screensMap?.[step.screen]?.header?.title) || step.title || step.stepLabel || step.id;

// Group steps into phases by stepLabel, preserving flow order; drops `done`.
function buildGroups(steps, screensMap) {
  const groups = [];
  for (const s of steps || []) {
    if (s.id === "done") continue;
    const label = s.stepLabel || "Lépések";
    let g = groups.find((x) => x.label === label);
    if (!g) groups.push((g = { label, items: [] }));
    g.items.push({ id: s.id, title: itemTitle(s, screensMap) });
  }
  return groups;
}

const C = {
  ink: "var(--dds-text-neutral-base, #1C1F26)",
  muted: "var(--dds-text-neutral-subtle, #5b6069)",
  brand: "var(--dds-background-brand-base-inverted, #4258ed)",
  brandSubtle: "var(--dds-background-brand-subtle, #e6e2fb)",
  done: "var(--dds-background-positive-base, #12B76A)",
  upcoming: "#C2C9D6",
  line: "var(--dds-border-neutral-divider, #e9edf2)",
};

function Chevron({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .15s", flex: "0 0 auto", color: C.muted }}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Dot({ state }) {
  const base = { width: 14, height: 14, borderRadius: "50%", flex: "0 0 auto", boxSizing: "border-box" };
  if (state === "done") return <span style={{ ...base, background: C.done }} />;
  if (state === "active") return <span style={{ ...base, background: C.brand, boxShadow: `0 0 0 4px ${C.brandSubtle}` }} />;
  return <span style={{ ...base, background: C.upcoming }} />;
}

export default function Stepper({ label, showRail = true, steps, current: argCurrent, screensMap: argScreens }) {
  const ctx = useContext(FlowContext);
  const flowSteps = ctx?.steps || steps || SAMPLE_STEPS;
  const screensMap = ctx?.screensMap || argScreens || {};
  const current = ctx?.current ?? argCurrent ?? flowSteps.find((s) => s.id !== "done")?.id;
  const onNavigate = ctx?.onNavigate;

  const groups = buildGroups(flowSteps, screensMap);
  const activeIdx = Math.max(0, groups.findIndex((g) => g.items.some((i) => i.id === current)));
  const [open, setOpen] = useState(activeIdx);

  const stateOf = (i) => (i < activeIdx ? "done" : i === activeIdx ? "active" : "upcoming");

  return (
    <nav aria-label={label || "Menü"} style={{ font: "500 15px/1.4 Inter, sans-serif", color: C.ink, width: "100%", boxSizing: "border-box" }}>
      {label && <div style={{ fontWeight: 700, fontSize: 13, color: C.muted, margin: "0 0 12px 4px", letterSpacing: ".02em" }}>{label}</div>}
      {groups.map((g, i) => {
        const isOpen = open === i;
        const st = stateOf(i);
        const isFirst = i === 0;
        const isLast = i === groups.length - 1;
        return (
          <div key={g.label} style={{ position: "relative", paddingLeft: showRail ? 34 : 4 }}>
            {showRail && (
              <>
                {/* connecting line: from top (unless first) to bottom (unless last) */}
                <span style={{ position: "absolute", left: 10, top: isFirst ? 18 : 0, bottom: isLast ? "calc(100% - 18px)" : 0, width: 2, background: st === "done" ? C.done : C.line }} />
                <span style={{ position: "absolute", left: 4, top: 11 }}><Dot state={st} /></span>
              </>
            )}
            {/* phase header */}
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 8px 8px 0", border: "none", background: "none", cursor: "pointer", font: "inherit", fontWeight: 600, color: C.ink, textAlign: "left" }}
            >
              <span style={{ flex: 1 }}>{g.label}</span>
              <Chevron open={isOpen} />
            </button>
            {/* sub-items */}
            {isOpen && (
              <div style={{ display: "grid", gap: 2, padding: "2px 0 10px" }}>
                {g.items.map((it) => {
                  const active = it.id === current;
                  return (
                    <a
                      key={it.id}
                      href={`#${it.id}`}
                      onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(it.id); } }}
                      style={{ display: "block", padding: "6px 8px", borderRadius: 8, textDecoration: "none", fontSize: 15, fontWeight: active ? 700 : 500, color: active ? C.brand : C.muted, background: active ? C.brandSubtle : "transparent" }}
                    >
                      {it.title}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
