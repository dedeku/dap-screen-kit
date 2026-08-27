import { registry } from "../registry/index.jsx";
import renderComponentNode from "./ComponentNode.jsx";

// Renders one field through the registry, controlled.
//   values : the whole values map (a field reads values[field.id]; composites
//            like `repeatable` pass a row object down to their sub-fields)
//   onChange(id, val) : update any field id
//
// The wrapper carries data-field-id (canvas editor overlays measure it) and the
// column span: registry default, then field.width.
export default function Field({ field, values, onChange }) {
  // Generic DS-component node (builder catalog): type "ds:<DapDSName>", carrying
  // a free-form `props` object + optional `children`. Rendered by the generic
  // component renderer. Input components (Input/Select/Checkbox/…) are wired
  // controlled through the value engine via `ctx`; presentational ones ignore it.
  if (typeof field.type === "string" && field.type.startsWith("ds:")) {
    const wantsFull = field.width !== "half";
    const style = wantsFull ? { gridColumn: "1 / -1" } : undefined;
    const dsCtx = { value: values ? values[field.id] : undefined, onChange: (v) => onChange && onChange(field.id, v) };
    return (
      <div style={style} data-field-id={field.id}>
        {renderComponentNode({ component: field.type.slice(3), props: field.props, children: field.children }, dsCtx)}
      </div>
    );
  }

  const entry = registry[field.type];

  if (!entry) {
    if (import.meta.env?.DEV) {
      return (
        <div style={{ gridColumn: "1 / -1", padding: 8, border: "1px dashed #c00", color: "#c00", font: "12px monospace" }}>
          screen-kit: no registry entry for "{field.type}" (id: {field.id})
        </div>
      );
    }
    return null;
  }

  const value = values ? values[field.id] : undefined;
  const ctx = {
    value,
    values,
    onChange,
    setValue: (val) => onChange(field.id, val),
    renderField,
  };

  const wantsFull = (field.width || entry.width) !== "half";
  const style = wantsFull ? { gridColumn: "1 / -1" } : undefined;

  return (
    <div style={style} data-field-id={field.id}>
      {entry.render(field, ctx)}
    </div>
  );
}

/** Recurse into a sub-field with its own values map + onChange (repeatable rows). */
function renderField(field, values, onChange) {
  return <Field key={field.id} field={field} values={values} onChange={onChange} />;
}
