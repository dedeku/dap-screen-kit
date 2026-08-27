import { createContext } from "react";

/**
 * Flow context for flow-aware patterns (e.g. PatternStepper / the side menu).
 * The consumer (the life-event runtime frame AND the designer canvas) provides
 * `{ steps, current, screensMap, onNavigate }`; a pattern reads it to render the
 * live phase menu + progress. In Storybook there is no provider, so patterns
 * fall back to their sample/arg data.
 *
 *   steps       : flowSteps [{ id, stepLabel, screen }]
 *   current     : the active step id
 *   screensMap  : { [screenId]: screen } (for item titles)
 *   onNavigate  : (stepId) => void  (undefined ⇒ non-interactive)
 */
export const FlowContext = createContext(null);
