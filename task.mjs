import { readFileSync } from "fs";
import { join } from "path";
import * as url from "url";
import { hello } from "@sil/tools";
import prettier from "prettier";
import {
  // setLightness,
  // isHex,
  // getLightness,
  // hexToHsl,
  // hslToHex,
  mix,
  hexToRgb,
  rgbToHex,
  getLightness,
} from "@sil/color";

import { toSassObject } from "@sil/sass";
import {
  blockFooter,
  blockHeader,
  blockLine,
  blockMid,
  blockRowLine,
  // blockSettings,
  bold,
  yellow,
  dim,
  blockLineSuccess,
  // toStringValue,
} from "cli-block";
import { writeFile } from "fs/promises";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Data

const state = {
  themer: null,
  local: null,
  colors: {
    mode: "",
    og: {},
    default: {},
    light: {},
    dark: {},
  },
  settings: {},
  base: {},
  typography: {},
};

const env = {
  themer: __dirname,
  local: process.cwd(),
};

// Init

// Get files

const getFiles = () => {
  // Get Local

  console.log(join(env.themer, "default.json"), join(env.local, "themer.json"));

  try {
    const data = readFileSync(join(env.themer, "default.json"), {
      encoding: "utf8",
    });
    state.themer = JSON.parse(data);
  } catch (err) {
    console.error("woops");
  }

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

// Generate files

const mergeData = async () => {
  //   console.log(state);

  blockMid("Colors");
  const mergedColors = { ...state.themer.colors, ...state.local.colors };

  Object.keys(mergedColors).forEach((key) => {
    if (state.themer.colors[key] == state.local.colors[key]) {
      blockRowLine([bold(key), mergedColors[key]]);
    } else {
      blockRowLine([
        bold(key),
        `${dim(state.themer.colors[key])} ${yellow("→")} ${
          state.local.colors[key]
        }`,
      ]);
    }
  });
  // console.log(SassObject(mergedColors));

  state.colors.og = mergedColors;

  blockMid("Settings");
  const mergedSettings = { ...state.themer.settings, ...state.local.settings };

  Object.keys(mergedSettings).forEach((key) => {
    blockRowLine([key, mergedSettings[key]]);
  });

  state.settings = mergedSettings;

  blockMid("Base");
  const mergedBase = { ...state.themer.base, ...state.local.base };

  Object.keys(mergedBase).forEach((key) => {
    blockRowLine([key, mergedBase[key]]);
  });

  state.base = mergedBase;

  blockMid("Typography");
  const mergedTypography = {
    ...state.themer.typography,
    ...state.local.typography,
  };

  Object.keys(mergedTypography).forEach((key) => {
    blockRowLine([key, mergedTypography[key]]);
  });

  state.typography = mergedTypography;
};

const fixColors = () => {
  if (state.colors.og.background && state.colors.og.foreground) {
    state.colors.mode =
      getLightness(state.colors.og.background) <
      getLightness(state.colors.og.foreground)
        ? "dark"
        : "light";
  }

  state.colors.og.dark =
    state.colors.og.dark || state.colors.mode == "dark"
      ? state.colors.og.background
      : state.colors.og.foreground;
  state.colors.og.light =
    state.colors.og.light || state.colors.mode == "dark"
      ? state.colors.og.foreground
      : state.colors.og.background;
};

const getTextColor = (color) => {
  return getLightness(color) > 50
    ? state.colors.og.dark
    : state.colors.og.light;
};

const buildColors = (ogColors, mixColor, mixColorAlt) => {
  const newColors = {};

  Object.keys(ogColors).forEach((key) => {
    state.settings.colorSteps.forEach((step) => {
      const color = ogColors[key];

      const mixer = color == mixColor ? mixColorAlt : mixColor;

      const mixed = mix(hexToRgb(mixer), hexToRgb(color), step);

      newColors[`${key}${step}`] = rgbToHex(mixed);
      newColors[`${key}${step}-r`] = mixed.r;
      newColors[`${key}${step}-g`] = mixed.g;
      newColors[`${key}${step}-b`] = mixed.b;
      newColors[`${key}${step}Text`] = getTextColor(mixed);
    });
  });
  return newColors;
};

const createColors = () => {
  const ogColors = Object.assign({}, state.colors.og);

  const darkColor = state.colors.og.dark;
  const lightColor = state.colors.og.light;

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

const writeConfig = async () => {
  // const fileData = ``;

  // console.log(state.colors);

  const fileData = prettier.format(
    `
    $theme-colors: (
    ${toSassObject(state.colors.default)}
    );
    $darkmode-colors: (
    ${toSassObject(state.colors.dark)}
    );
    $lightmode-colors: (
    ${toSassObject(state.colors.light)}
    );
    $theme-settings: (
      ${toSassObject(state.settings)}
    );
    $theme-base: (
      ${toSassObject(state.base)}
    );
    $theme-typography: (
      ${toSassObject(state.typography)}
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

  const themeFile = join(env.local, "src/style/theme.scss");
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
