import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";

export default {
  input: "index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "PixoworElementEditorPlugin"
  },
  plugins: [
    json(),
    typescript(),
    copy({
      targets: [{ src: "manifest.json", dest: "dist" }],
    }),
  ]
};
