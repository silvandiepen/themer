import { readFileSync } from "fs";
import { join } from "path";
import { hello } from "@sil/tools";
import { hexToRgb, toHex, toRGB, toHSL, mix } from "@sil/color";
import { jsOutput, tsOutput, sassOutput, jsonOutput } from "./output.js";
import { toDarkMode, toLightMode, getColorMode } from "./color.js";
import { state } from "./state.js";
import { getKey, getTextColor, getEnv, writeFile } from "./helpers.js";
import { ColorMode } from "./types.js";
import { blockFooter, blockHeader, blockLine, blockMid, blockRowLine, bold, yellow, dim, blockSettings, } from "cli-block";
const buildColors = (ogColors, mixColor, mixColorAlt) => {
    const newColors = {};
    const mixRgb = hexToRgb(toHex(mixColor));
    const altMixRgb = hexToRgb(toHex(mixColorAlt));
    Object.keys(ogColors).forEach((key) => {
        const isBase = key == "background" || key == "foreground";
        state.settings.colorSteps.forEach((step) => {
            const color = getKey(ogColors, key);
            const mixer = color == mixColor ? altMixRgb : mixRgb;
            const mixStep = isBase ? Math.abs(100 - step) : step;
            const mixed = mix(mixer, toRGB(color), mixStep);
            const hsl = toHSL(color);
            newColors[`${key}${step}`] = toHex(mixed);
            newColors[`${key}${step}-r`] = mixed.r;
            newColors[`${key}${step}-g`] = mixed.g;
            newColors[`${key}${step}-b`] = mixed.b;
            newColors[`${key}${step}-h`] = hsl.h;
            newColors[`${key}${step}-s`] = hsl.s;
            newColors[`${key}${step}-l`] = hsl.l;
            newColors[`${key}${step}-text`] = getTextColor(state, mixed);
        });
    });
    Object.keys(ogColors).forEach((key) => {
        const color = getKey(ogColors, key);
        const rgb = toRGB(color);
        const hsl = toHSL(color);
        const textColor = getTextColor(state, color);
        newColors[`${key}-r`] = rgb.r;
        newColors[`${key}-g`] = rgb.g;
        newColors[`${key}-b`] = rgb.b;
        newColors[`${key}-h`] = hsl.h;
        newColors[`${key}-s`] = hsl.s;
        newColors[`${key}-l`] = hsl.l;
        newColors[`${key}-text`] = textColor;
    });
    return newColors;
};
const getFiles = () => {
    const env = getEnv();
    try {
        const data = readFileSync(join(env.local, "themer.json"), {
            encoding: "utf8",
        });
        state.local = JSON.parse(data);
    }
    catch (err) {
        console.error("woops");
    }
};
const setOutputs = async () => {
    state.output = { ...state.themer.outputs, ...state.local.outputs };
    await blockMid('Outputs');
    await blockSettings(state.output);
};
const mergeData = async () => {
    blockMid("Colors");
    const mergedColors = {
        ...(state?.themer?.colors ? state.themer.colors : {}),
        ...state.local.colors,
    };
    Object.keys(mergedColors).forEach((key) => {
        let localColor = "";
        if (state.local.colors && getKey(state.local.colors, key)) {
            localColor = getKey(state.local.colors, key);
        }
        const themerColor = getKey(state.themer.colors, key);
        if (themerColor == localColor) {
            blockRowLine([bold(key), getKey(mergedColors, key)]);
        }
        else {
            blockRowLine([
                bold(key),
                `${dim(themerColor)} ${yellow("→")} ${localColor}`,
            ]);
        }
    });
    state.colors.og = mergedColors;
    blockMid("Settings");
    const mergedSettings = { ...state.themer.settings, ...state.local.settings };
    Object.keys(mergedSettings).forEach((key) => {
        blockRowLine([key, getKey(mergedSettings, key)]);
    });
    state.settings = mergedSettings;
    blockMid("Base");
    const mergedBase = { ...state.themer.base, ...state.local.base };
    Object.keys(mergedBase).forEach((key) => {
        blockRowLine([key, getKey(mergedBase, key)]);
    });
    state.base = mergedBase;
    blockMid("Typography");
    const mergedTypography = {
        ...state.themer.typography,
        ...state.local.typography,
    };
    Object.keys(mergedTypography).forEach((key) => {
        blockRowLine([key, getKey(mergedTypography, key)]);
    });
    state.typography = mergedTypography;
};
const fixColors = () => {
    if (state.colors.og.background && state.colors.og.foreground) {
        state.colors.mode = getColorMode(state.colors.og);
    }
    state.colors.og.dark =
        state.colors.og.dark || state.colors.mode == ColorMode.DARK
            ? state.colors.og.background
            : state.colors.og.foreground;
    state.colors.og.light =
        state.colors.og.light || state.colors.mode == ColorMode.LIGHT
            ? state.colors.og.background
            : state.colors.og.foreground;
};
const createColors = () => {
    const ogColors = Object.assign({}, state.colors.og);
    const darkColor = state.colors.og.dark || "#000000";
    const lightColor = state.colors.og.light || "#ffffff";
    const darkmodeColorSet = toDarkMode(state.colors.og);
    const lightmodeColorSet = toLightMode(state.colors.og);
    const lightModeColors = buildColors(lightmodeColorSet, lightColor, darkColor);
    const darkModeColors = buildColors(darkmodeColorSet, darkColor, lightColor);
    state.colors.light = { ...ogColors, ...lightModeColors };
    state.colors.dark = { ...ogColors, ...darkModeColors };
    if (state.colors.mode == "light") {
        state.colors.dark.background = state.colors.og.foreground;
        state.colors.dark.foreground = state.colors.og.background;
    }
    else {
        state.colors.light.background = state.colors.og.foreground;
        state.colors.light.foreground = state.colors.og.background;
    }
    state.colors.default =
        state.colors.mode == "light" ? state.colors.light : state.colors.dark;
};
const writeConfig = async () => {
    const env = getEnv();
    if (state.output.scss) {
        const sassData = sassOutput(state);
        const sassFile = join(env.local, state.output.scss);
        await writeFile(sassFile, sassData);
    }
    if (state.output.js) {
        const jsData = jsOutput(state);
        const jsFile = join(env.local, state.output.js || "src/data/theme.js");
        await writeFile(jsFile, jsData);
    }
    if (state.output.ts) {
        const tsData = tsOutput(state);
        const tsFile = join(env.local, state.output.ts || "src/data/theme.ts");
        await writeFile(tsFile, tsData);
    }
    if (state.output.json) {
        const jsonData = jsonOutput(state);
        const jsonFile = join(env.local, state.output.json || "src/data/theme.json");
        await writeFile(jsonFile, jsonData);
    }
};
hello()
    .then(() => {
    blockHeader("Themer Config");
    blockLine();
    blockLine([
        "Themer is creating your config files. If you didnt define any",
        "custom options, Themer will just use the defaults",
    ]);
})
    .then(() => getFiles())
    .then(() => mergeData())
    .then(() => setOutputs())
    .then(() => fixColors())
    .then(() => createColors())
    .then(() => writeConfig())
    .then(() => {
    blockFooter();
});
//# sourceMappingURL=task.js.map