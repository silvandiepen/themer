import { getBrightness } from "@sil/color";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { format as prettierFormat } from "prettier";
export const getKey = (haystack, needle) => {
    let index = 0;
    Object.keys(haystack).forEach((key, idx) => {
        if (key == needle) {
            index = idx;
        }
    });
    return Object.values(haystack)[index];
};
export const getTextColor = (state, color) => getBrightness(color) > 60
    ? state.colors.og.dark
        ? state.colors.og.dark
        : "#000000"
    : state.colors.og.light
        ? state.colors.og.light
        : "#ffffff";
export const getEnv = () => {
    const __dirname = resolve(dirname(''));
    return {
        themer: __dirname,
        local: process.cwd(),
    };
};
export const writeFile = async (path, contents) => {
    try {
        mkdirSync(dirname(path), { recursive: true });
    }
    catch (err) {
        console.warn("Dir could not be created", err);
    }
    try {
        writeFileSync(path, contents);
    }
    catch (err) {
        console.warn("File could not be created", err);
    }
};
export const sortObject = (o) => Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {});
export const format = (type, content) => {
    return prettierFormat(content, { parser: type });
};
//# sourceMappingURL=helpers.js.map