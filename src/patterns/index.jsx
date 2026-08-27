// Pattern registry — composed, arg-driven page patterns (Hero, Header, CTA Row)
// that are NOT single DS components. They live here so BOTH the Storybook stories
// (dap-ds-lab) and the life-event designer render the exact same implementation.
//
// A pattern is a plain `(props) => JSX` React component. The catalog manifest maps
// a pattern name -> its Storybook title; the generic node renderer resolves the
// component from PATTERNS below (before falling back to a real DS export).
//
// Adding a pattern: create the component here, add it to PATTERNS, add a manifest
// entry (kind: "pattern"), and a thin Storybook wrapper story. The catalog +
// drift-check pipeline picks it up from the argTypes automatically.

import Hero, { HERO_RESOLUTIONS, HERO_CTA_VARIANTS } from "./Hero.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Stepper from "./Stepper.jsx";
import Timeline from "./Timeline.jsx";
import DataList from "./DataList.jsx";
import Checklist from "./Checklist.jsx";
import ChipGroup from "./ChipGroup.jsx";
import CtaRow, { CTA_VARIANTS, CTA_SIZES } from "./CtaRow.jsx";
import { FlowContext } from "./FlowContext.js";

/** Pattern base name -> React component. */
export const PATTERNS = {
  PatternHero: Hero,
  PatternHeader: Header,
  PatternFooter: Footer,
  PatternStepper: Stepper,
  PatternTimeline: Timeline,
  PatternDataList: DataList,
  PatternChecklist: Checklist,
  PatternChipGroup: ChipGroup,
  PatternCtaRow: CtaRow,
};

/** The pattern component for a base name, or null. */
export function getPattern(name) {
  return PATTERNS[name] || null;
}

/** True if `name` is a registered pattern (vs. a real DS component). */
export function isPattern(name) {
  return Object.prototype.hasOwnProperty.call(PATTERNS, name);
}

export { Hero, Header, Footer, Stepper, Timeline, DataList, Checklist, ChipGroup, CtaRow, FlowContext, HERO_RESOLUTIONS, HERO_CTA_VARIANTS, CTA_VARIANTS, CTA_SIZES };
