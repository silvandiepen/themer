import { defaultSettings } from "./default.js";
import { ColorMode, State } from "./types.js";
/*
 * State
 */

export const state: State = {
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
    output:{}
  };