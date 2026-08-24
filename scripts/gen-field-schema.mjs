#!/usr/bin/env node
// Derive src/generated/field-schema.json from the dap-design-system .d.ts prop
// graph, so the builder editors and Storybook controls read the SAME enums and
// defaults the components actually expose. Prevents hand-maintained prop lists
// (e.g. the button VARIANTS array duplicated in the builder) from drifting.
//
// TODO: port the .d.ts extraction from
//   ../dap-ds-lab/scripts/gen-stories.mjs
// and emit, per DS component: { props: { name: { type, enum, default } } }.
// For now this is a stub that keeps the placeholder JSON in place.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../src/generated/field-schema.json");

function main() {
  const existing = JSON.parse(readFileSync(OUT, "utf8"));
  // no-op passthrough until the extractor lands
  writeFileSync(OUT, JSON.stringify(existing, null, 2) + "\n");
  console.log("[gen-field-schema] stub ran; wrote", OUT);
}

main();
