import { readFileSync } from "fs";
import { join } from "path";
import * as url from "url";
import prettier from "prettier";
import { hello } from "@sil/tools";
import {
  mix,
  hexToRgb,
  rgbToHex,
  getLightness,
  toHex,
  RGB,
  COLOR
} from "@sil/color";
import { toSassObject } from "@sil/sass";

import {
  blockFooter,
  blockHeader,
  blockLine,
  blockMid,
  blockRowLine,
  bold,
  yellow,
  dim,
  blockLineSuccess,
} from "cli-block";
import { writeFile } from "fs/promises";
import { SassInput } from "@sil/sass/dist/types";

const __filename:string = url.fileURLToPath(import.meta.url);
const __dirname:string = url.fileURLToPath(new URL(".", import.meta.url));


/*
* Types
*/

export enum ColorMode {
  DARK = "dark",
  LIGHT = "light",
}
export interface ColorSet {
  dark?: COLOR;
  light?: COLOR;
  background: COLOR;
  foreground: COLOR;
  primary: COLOR;
  secondary: COLOR;
  tertiary: COLOR;
  caution: COLOR;
  warning: COLOR;
  error: COLOR;
  info: COLOR;
  success: COLOR;
}
export interface SettingsSet {
  prefix: string;
  styleOutput: boolean;
  classBasedProperties: boolean;
  generateBase: boolean;
  generateTypography: boolean;
  generateColors: boolean;
  generateColorModes: boolean;
  colorModes: boolean;
  colorShades: boolean;
  colorPercentages: boolean;
  colorSteps: number[];
  colorText: boolean;
  breakpointNames: string[];
  breakpointSizes: number[];
}
export interface BaseSet {
  borderRadius: string;
  shadow: string;
  "space-xl": string;
  "space-l": string;
  space: string;
  "space-s": string;
  "space-xs": string;
  transition: string;
}
export interface TypographySet {
  primaryFontFamily: string | string[];
  secondaryFontFamily: string | string[];
  baseSize: string;
  thinWeight: number;
  lightWeight: number;
  normalWeight: number;
  mediumWeight: number;
  boldWeight: number;
  heavyWeight: number;
}

export interface Source {
  colors: ColorSet;
  settings: SettingsSet;
  base: BaseSet;
  typography: TypographySet;
}
export interface IncomingSource {
  colors?: Partial<ColorSet>;
  settings?: Partial<SettingsSet>;
  base?: Partial<BaseSet>;
  typography?: Partial<TypographySet>;
  output?: string;
}
export interface State {
  themer: Source;
  local: IncomingSource;
  colors: {
    mode: ColorMode;
    og: ColorSet;
    default: ColorSet;
    light: ColorSet;
    dark: ColorSet;
  };
  settings: SettingsSet;
  base: BaseSet;
  typography: TypographySet;
}


/*
* Default Settings
*/


export const defaultSettings:Source = {
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
}

/*
* Helpers
*/

const getKey = (haystack: Object, needle: string) => {
  let index = 0;

  Object.keys(haystack).forEach((key, idx) => {
    if (key == needle) {
      index = idx;
    }
  });
  return Object.values(haystack)[index];
};


const getTextColor = (color: COLOR): COLOR => getLightness(color) > 50
    ? state.colors.og.dark
      ? state.colors.og.dark
      : "#000000"
    : state.colors.og.light
    ? state.colors.og.light
    : "#ffffff";

const buildColors = (
  ogColors: ColorSet,
  mixColor: COLOR,
  mixColorAlt: COLOR
) => {

  const newColors: { [key: string]: COLOR | number } = {};

  Object.keys(ogColors).forEach((key) => {
    state.settings.colorSteps.forEach((step) => {
      const color: COLOR = getKey(ogColors, key);

      const mixer = color == mixColor ? mixColorAlt : mixColor;
      const mixed = mix(
        hexToRgb(toHex(mixer)),
        hexToRgb(toHex(color)),
        step
      ) as RGB;

      newColors[`${key}${step}`] = rgbToHex(mixed);
      newColors[`${key}${step}-r`] = mixed.r;
      newColors[`${key}${step}-g`] = mixed.g;
      newColors[`${key}${step}-b`] = mixed.b;
      newColors[`${key}${step}Text`] = getTextColor(mixed);
    });
  });
  return newColors;
};


/*
* State
*/

const state: State = {
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

// Init

// Get files

const getFiles = () => {
  // Get Project

  try {
    const data = readFileSync(join(env.local, "themer.json"), {
      encoding: "utf8",
    });
    // console.log(data);
    state.local = JSON.parse(data);
  } catch (err) {
    console.error("woops");
  }
};


/*
* Steps
*/

// Generate files

const mergeData = async () => {
  blockMid("Colors");

  const mergedColors = {
    ...(state?.themer?.colors ? state.themer.colors : {}),
    ...state.local.colors,
  };

  Object.keys(mergedColors).forEach((key: string) => {
    let localColor = "";
    if (state.local.colors && getKey(state.local.colors, key)) {
      localColor = getKey(state.local.colors, key);
    }
    const themerColor = getKey(state.themer.colors, key);

    if (themerColor == localColor) {
      blockRowLine([bold(key), getKey(mergedColors, key)]);
    } else {
      blockRowLine([
        bold(key),
        `${dim(themerColor)} ${yellow("→")} ${localColor}`,
      ]);
    }
  });

  state.colors.og = mergedColors as ColorSet;

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


  const lightModeColors = buildColors(
    Object.assign({}, state.colors.og),
    lightColor,
    darkColor
  );

  const darkModeColors = buildColors(
    Object.assign({}, state.colors.og),
    darkColor,
    lightColor
  );

  state.colors.light = { ...lightModeColors, ...ogColors };
  state.colors.dark = { ...darkModeColors, ...ogColors };

  // Fix background / Foreground

  if (state.colors.mode == "light") {
    state.colors.dark.background = state.colors.og.foreground;
    state.colors.dark.foreground = state.colors.og.background;
  } else {
    state.colors.light.background = state.colors.og.foreground;
    state.colors.light.foreground = state.colors.og.background;
  }

  // Set default colors according to current colormode
  state.colors.default =
    state.colors.mode == "light" ? state.colors.light : state.colors.dark;
};

const fixObjectTypes = (input: Object): SassInput => {
  const sassInput: SassInput = {};

  Object.keys(input).forEach((key: string) => {
    const value = getKey(input, key);
    sassInput[key] = typeof value == "number" ? value : `${value}`;
  });

  return sassInput;
};

const writeConfig = async () => {
  const fileData = prettier.format(
    `
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

    `,
    {
      parser: "scss",
    }
  );

  blockMid("Create themes file");

  blockLineSuccess("Created theme colors");
  blockLineSuccess("Created theme darkMode colors");
  blockLineSuccess("Created theme lightMode colors");
  blockLineSuccess("Created theme Settings");
  blockLineSuccess("Created theme Base");

  const themeFile = join(env.local, state.local.output || "src/style/theme.scss");

  
  await writeFile(themeFile, fileData);
};

// Runner

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
