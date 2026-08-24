import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header.jsx";
import Field from "./Field.jsx";
import Actions from "./Actions.jsx";
import { initialValues, isVisible } from "../conditional/index.js";

/**
 * Renders one DAP screen JSON 1:1 with dap-design-system, through the shared
 * registry. This is the ONE render path — the form-builder preview/player and
 * the life-event flows both mount this instead of hand-rolling their own.
 *
 * Two modes:
 *  - Uncontrolled (default): holds its own values, seeded from defaults. Good
 *    for the builder preview and the standalone player.
 *  - Controlled: pass `values` + `onChange(id, value, allValues)` to drive it
 *    from an external store (e.g. an XState flow that branches on answers).
 *
 * Fields are controlled per-field (DS onDds* callbacks) — no DOM delegation.
 *
 * @param {Object} props
 * @param {import("../schema/types.js").Screen} props.screen
 * @param {Record<string, any>} [props.values]     controlled values
 * @param {(id: string, value: any, all: Record<string, any>) => void} [props.onChange]
 * @param {(action: import("../schema/types.js").ScreenAction) => void} [props.onAction]
 */
export default function ScreenRenderer({ screen, values, onChange, onAction }) {
  const controlled = values != null;

  const [internal, setInternal] = useState(() => initialValues(screen.fields));
  const internalRef = useRef(internal);
  internalRef.current = internal;

  // Re-seed uncontrolled state when the screen identity changes.
  useEffect(() => {
    if (!controlled) {
      const seed = initialValues(screen.fields);
      setInternal(seed);
      internalRef.current = seed;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.id]);

  const current = controlled ? values : internal;

  const handleChange = useCallback(
    (id, value) => {
      const base = controlled ? values : internalRef.current;
      const next = { ...base, [id]: value };
      if (!controlled) {
        setInternal(next);
        internalRef.current = next;
      }
      if (onChange) onChange(id, value, next);
    },
    [controlled, values, onChange],
  );

  const gap = screen.gap ?? 24;
  const visible = (screen.fields || []).filter((f) => isVisible(f, current));

  return (
    <div style={{ maxWidth: screen.width || 800, display: "flex", flexDirection: "column", gap }}>
      <Header header={screen.header} />

      {visible.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap }}>
          {visible.map((f) => (
            <Field key={f.id} field={f} values={current} onChange={handleChange} />
          ))}
        </div>
      )}

      <Actions actions={screen.actions} onAction={onAction} />
    </div>
  );
}
