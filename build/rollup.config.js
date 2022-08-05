import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import globals from "rollup-plugin-node-globals";
import builtins from "rollup-plugin-node-builtins";



export default {
  external: ['fs','path'],
  input: "./build/src/task.ts",
  output: {
    // dir: "dist",
    format: "cjs",
    file: "./build/dist/task.cjs"
  },
  plugins: [
    json(),
    nodeResolve({ preferBuiltins: true }), // or `true`
    commonjs(),
    globals(),
    builtins(),
    typescript({
      compilerOptions: { lib: ["es5", "es6", "dom"], target: "es5" },
    }),
  ],
};
