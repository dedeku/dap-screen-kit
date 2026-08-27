import React from "react";
import { DapDSTimelineReact, DapDSTimelineItemReact, DapDSTypographyReact } from "dap-design-system/react";

/**
 * Pattern / Timeline — an ordered list of steps (title + description) rendered
 * with the real DapDSTimeline. Display-only (no value). Items come from the
 * options editor (props.items = [{ title, description }]); mirrors the
 * `timeline` field-type render so the two are interchangeable.
 */
export default function Timeline({ items }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <DapDSTimelineReact>
      {list.map((it, i) => (
        <DapDSTimelineItemReact key={i}>
          <DapDSTypographyReact variant="body" size="md">{it.title}</DapDSTypographyReact>
          {it.description ? (
            <DapDSTypographyReact variant="description" size="sm">{it.description}</DapDSTypographyReact>
          ) : null}
        </DapDSTimelineItemReact>
      ))}
    </DapDSTimelineReact>
  );
}
