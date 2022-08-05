import { getBrightness } from "@sil/color";
import { COLOR} from "@sil/color";
import { State } from "./types.js";
import { mkdirSync, writeFileSync } from "fs";
import { dirname,resolve } from "path";
import {fileURLToPath} from "url";
import { format as prettierFormat } from "prettier";
/*
 * Helpers
 */

export const getKey = (haystack: Object, needle: string) => {
  let index = 0;

  Object.keys(haystack).forEach((key, idx) => {
    if (key == needle) {
      index = idx;
    }
  });
  return Object.values(haystack)[index];
};

export const getTextColor = (state: State, color: COLOR): COLOR =>
  getBrightness(color) > 60
    ? state.colors.og.dark
      ? state.colors.og.dark
      : "#000000"
    : state.colors.og.light
    ? state.colors.og.light
    : "#ffffff";

export const getEnv = () => {
    // const __dirname: string = url.fileURLToPath(new URL(".", import.meta.url));
   const __dirname = resolve(dirname(''));
  return {
    themer: __dirname,
    local: process.cwd(),
  };
};

export const writeFile = async (
  path: string,
  contents: string
): Promise<void> => {
  try {
    mkdirSync(dirname(path), { recursive: true });
  } catch (err) {
    console.warn("Dir could not be created", err);
  }

  try {
    writeFileSync(path, contents);
  } catch (err) {
    console.warn("File could not be created", err);
  }
};

//@ts-ignore
export const sortObject = (o) =>
  Object.keys(o)
    .sort()
    // @ts-ignore
    .reduce((r, k) => ((r[k] = o[k]), r), {});

export const format = (type: string, content: string) => {
// return content;

  return prettierFormat(content, { parser: type });
};
