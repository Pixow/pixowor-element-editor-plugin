import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";

export default {
  input: "plugin.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "QingSubwindowTestPlugin"
  },
  plugins: [
    json(),
    typescript(),
    copy({
      targets: [{ src: "manifest.json", dest: "dist" }],
    }),
  ]
};
