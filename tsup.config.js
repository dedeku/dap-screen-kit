import { defineConfig } from "tsup";

// Ship built ESM so any consumer (Vite app, Storybook, generator script) can
// import without worrying about JSX transforms in node_modules. peerDeps stay
// external — the consumer owns the single dap-design-system / react copy.
export default defineConfig({
  entry: {
    index: "src/index.js",
    "schema/index": "src/schema/index.js",
    "patterns/index": "src/patterns/index.jsx",
  },
  format: ["esm"],
  target: "es2020",
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  external: ["react", "react-dom", "dap-design-system"],
  loader: { ".js": "jsx", ".jsx": "jsx" },
  esbuildOptions(o) {
    o.jsx = "automatic";
  },
});
