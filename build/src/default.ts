import { Source } from "./types";
/*
 * Default Settings
 */

export const defaultSettings: Source = {
  outputs: {
    scss: "./src/style/theme.scss",
  },
  colors: {
    background: "#ffffff",
    foreground: "#111111",
    primary: "#01eeff",
    secondary: "#f7166c",
    tertiary: "#6a2ef7",
    caution: "#fed02f",
    warning: "#fd8324",
    error: "#fc1b1c",
    info: "#7abffc",
    success: "#54d577",
  },
  settings: {
    prefix: "",
    styleOutput: true,
    classBasedProperties: true,
    generateBase: true,
    generateTypography: true,
    generateColors: true,
    generateColorModes: true,
    colorModes: true,
    colorShades: true,
    colorPercentages: false,
    colorSteps: [10, 25, 50, 75, 90],
    colorText: true,
    breakpointNames: ["small", "medium", "large"],
    breakpointSizes: [0, 720, 1200],
  },
  base: {
    borderRadius: "0.25rem",
    shadow: "0 3px 4px 0 rgba(0, 0, 0, 0.1)",
    "space-xl": "max(calc(100vw / 12), 4em)",
    "space-l": "max(calc(100vw / 18), 3em)",
    space: "max(calc(100vw / 24), 2em)",
    "space-s": "max(calc(100vw / 48), 1em)",
    "space-xs": "max(calc(100vw / 96), 0.5em)",
    transition: "0.3s ease-in-out",
  },
  typography: {
    primaryFontFamily:
      '{-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"}',
    secondaryFontFamily: '{Georgia, "Times New Roman", serif}',
    baseSize: "16px",
    thinWeight: 100,
    lightWeight: 300,
    normalWeight: 400,
    mediumWeight: 500,
    boldWeight: 600,
    heavyWeight: 900,
  },
};
