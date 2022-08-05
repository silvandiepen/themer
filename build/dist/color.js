import { ColorMode } from "./types.js";
import { getLightness } from "@sil/color";
export const getColorMode = (set) => {
    return getLightness(set.background) > getLightness(set.foreground)
        ? ColorMode.LIGHT
        : ColorMode.DARK;
};
export const toDarkMode = (set) => {
    if (getColorMode(set) === ColorMode.DARK)
        return set;
    else {
        return {
            ...set,
            background: set.foreground,
            foreground: set.background,
        };
    }
};
export const toLightMode = (set) => {
    if (getColorMode(set) === ColorMode.LIGHT)
        return set;
    else {
        return {
            ...set,
            background: set.foreground,
            foreground: set.background,
        };
    }
};
//# sourceMappingURL=color.js.map