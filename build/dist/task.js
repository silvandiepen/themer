var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFileSync } from "fs";
import { join } from "path";
import * as url from "url";
import prettier from "prettier";
import { hello } from "@sil/tools";
import { mix, hexToRgb, rgbToHex, getLightness, toHex, hexToHsl } from "@sil/color";
import { toSassObject } from "@sil/sass";
import { blockFooter, blockHeader, blockLine, blockMid, blockRowLine, bold, yellow, dim, blockLineSuccess, } from "cli-block";
import { writeFile } from "fs/promises";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
export var ColorMode;
(function (ColorMode) {
    ColorMode["DARK"] = "dark";
    ColorMode["LIGHT"] = "light";
})(ColorMode || (ColorMode = {}));
export const defaultSettings = {
    "colors": {
        "background": "#ffffff",
        "foreground": "#111111",
        "primary": "#01eeff",
        "secondary": "#f7166c",
        "tertiary": "#6a2ef7",
        "caution": "#fed02f",
        "warning": "#fd8324",
        "error": "#fc1b1c",
        "info": "#7abffc",
        "success": "#54d577"
    },
    "settings": {
        "prefix": "",
        "styleOutput": true,
        "classBasedProperties": true,
        "generateBase": true,
        "generateTypography": true,
        "generateColors": true,
        "generateColorModes": true,
        "colorModes": true,
        "colorShades": true,
        "colorPercentages": false,
        "colorSteps": [10, 25, 50, 75, 90],
        "colorText": true,
        "breakpointNames": ["small", "medium", "large"],
        "breakpointSizes": [0, 720, 1200]
    },
    "base": {
        "borderRadius": "0.25rem",
        "shadow": "0 3px 4px 0 rgba(0, 0, 0, 0.1)",
        "space-xl": "max(calc(100vw / 12), 4em)",
        "space-l": "max(calc(100vw / 18), 3em)",
        "space": "max(calc(100vw / 24), 2em)",
        "space-s": "max(calc(100vw / 48), 1em)",
        "space-xs": "max(calc(100vw / 96), 0.5em)",
        "transition": "0.3s ease-in-out"
    },
    "typography": {
        "primaryFontFamily": [
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Helvetica",
            "Arial",
            "sans-serif",
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol"
        ],
        "secondaryFontFamily": "times",
        "baseSize": "16px",
        "thinWeight": 100,
        "lightWeight": 300,
        "normalWeight": 400,
        "mediumWeight": 500,
        "boldWeight": 600,
        "heavyWeight": 900
    }
};
const getKey = (haystack, needle) => {
    let index = 0;
    Object.keys(haystack).forEach((key, idx) => {
        if (key == needle) {
            index = idx;
        }
    });
    return Object.values(haystack)[index];
};
const getTextColor = (color) => getLightness(color) > 50
    ? state.colors.og.dark
        ? state.colors.og.dark
        : "#000000"
    : state.colors.og.light
        ? state.colors.og.light
        : "#ffffff";
const buildColors = (ogColors, mixColor, mixColorAlt) => {
    const newColors = {};
    Object.keys(ogColors).forEach((key) => {
        state.settings.colorSteps.forEach((step) => {
            const color = getKey(ogColors, key);
            const mixer = color == mixColor ? mixColorAlt : mixColor;
            const mixed = mix(hexToRgb(toHex(mixer)), hexToRgb(toHex(color)), step);
            const hsl = hexToHsl(toHex(color));
            newColors[`${key}${step}`] = rgbToHex(mixed);
            newColors[`${key}${step}-r`] = mixed.r;
            newColors[`${key}${step}-g`] = mixed.g;
            newColors[`${key}${step}-b`] = mixed.b;
            newColors[`${key}${step}-h`] = hsl.h;
            newColors[`${key}${step}-s`] = hsl.s;
            newColors[`${key}${step}-l`] = hsl.l;
            newColors[`${key}${step}-text`] = getTextColor(mixed);
        });
    });
    Object.keys(ogColors).forEach((key) => {
        const color = getKey(ogColors, key);
        const rgb = hexToRgb(toHex(color));
        const hsl = hexToHsl(toHex(color));
        newColors[`${key}-r`] = rgb.r;
        newColors[`${key}-g`] = rgb.g;
        newColors[`${key}-b`] = rgb.b;
        newColors[`${key}-h`] = hsl.h;
        newColors[`${key}-s`] = hsl.s;
        newColors[`${key}-l`] = hsl.l;
        newColors[`${key}-text`] = getTextColor(rgb);
    });
    return newColors;
};
const state = {
    themer: defaultSettings,
    local: defaultSettings,
    colors: {
        mode: ColorMode.LIGHT,
        og: defaultSettings.colors,
        default: defaultSettings.colors,
        light: defaultSettings.colors,
        dark: defaultSettings.colors,
    },
    settings: defaultSettings.settings,
    base: defaultSettings.base,
    typography: defaultSettings.typography,
};
const env = {
    themer: __dirname,
    local: process.cwd(),
};
const getFiles = () => {
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
const mergeData = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    blockMid("Colors");
    const mergedColors = Object.assign(Object.assign({}, (((_a = state === null || state === void 0 ? void 0 : state.themer) === null || _a === void 0 ? void 0 : _a.colors) ? state.themer.colors : {})), state.local.colors);
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
    const mergedSettings = Object.assign(Object.assign({}, state.themer.settings), state.local.settings);
    Object.keys(mergedSettings).forEach((key) => {
        blockRowLine([key, getKey(mergedSettings, key)]);
    });
    state.settings = mergedSettings;
    blockMid("Base");
    const mergedBase = Object.assign(Object.assign({}, state.themer.base), state.local.base);
    Object.keys(mergedBase).forEach((key) => {
        blockRowLine([key, getKey(mergedBase, key)]);
    });
    state.base = mergedBase;
    blockMid("Typography");
    const mergedTypography = Object.assign(Object.assign({}, state.themer.typography), state.local.typography);
    Object.keys(mergedTypography).forEach((key) => {
        blockRowLine([key, getKey(mergedTypography, key)]);
    });
    state.typography = mergedTypography;
});
const fixColors = () => {
    if (state.colors.og.background && state.colors.og.foreground) {
        state.colors.mode =
            getLightness(state.colors.og.background) <
                getLightness(state.colors.og.foreground)
                ? ColorMode.DARK
                : ColorMode.LIGHT;
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
    const lightModeColors = buildColors(Object.assign({}, state.colors.og), lightColor, darkColor);
    const darkModeColors = buildColors(Object.assign({}, state.colors.og), darkColor, lightColor);
    state.colors.light = Object.assign(Object.assign({}, lightModeColors), ogColors);
    state.colors.dark = Object.assign(Object.assign({}, darkModeColors), ogColors);
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
const fixObjectTypes = (input) => {
    const sassInput = {};
    Object.keys(input).forEach((key) => {
        const value = getKey(input, key);
        sassInput[key] = typeof value == "number" ? value : `${value}`;
    });
    return sassInput;
};
const writeConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const fileData = prettier.format(`
    $theme-colors: (
    ${toSassObject(fixObjectTypes(state.colors.default))}
    );
    $darkmode-colors: (
    ${toSassObject(fixObjectTypes(state.colors.dark))}
    );
    $lightmode-colors: (
    ${toSassObject(fixObjectTypes(state.colors.light))}
    );
    $theme-settings: (
      ${toSassObject(fixObjectTypes(state.settings))}
    );
    $theme-base: (
      ${toSassObject(fixObjectTypes(state.base))}
    );
    $theme-typography: (
      ${toSassObject(fixObjectTypes(state.typography))}
    );

    `, {
        parser: "scss",
    });
    blockMid("Create themes file");
    blockLineSuccess("Created theme colors");
    blockLineSuccess("Created theme darkMode colors");
    blockLineSuccess("Created theme lightMode colors");
    blockLineSuccess("Created theme Settings");
    blockLineSuccess("Created theme Base");
    const themeFile = join(env.local, state.local.output || "src/style/theme.scss");
    yield writeFile(themeFile, fileData);
});
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
    .then(() => fixColors())
    .then(() => createColors())
    .then(() => writeConfig())
    .then(() => {
    blockFooter();
});
//# sourceMappingURL=task.js.map