import { ColorSet, ColorMode } from "./types.js";
import { getLightness } from "@sil/color";

export const getColorMode = (set: ColorSet): ColorMode => {
    return getLightness(set.background) > getLightness(set.foreground)
      ? ColorMode.LIGHT
      : ColorMode.DARK;
  };
  
export  const toDarkMode = (set: ColorSet): ColorSet => {
    if (getColorMode(set) === ColorMode.DARK) return set;
    else {
      return {
        ...set,
        background: set.foreground,
        foreground: set.background,
      };
    }
  };
 export const toLightMode = (set: ColorSet): ColorSet => {
    if (getColorMode(set) === ColorMode.LIGHT) return set;
    else {
      return {
        ...set,
        background: set.foreground,
        foreground: set.background,
      };
    }
  };
  