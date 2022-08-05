import { defaultSettings } from "./default.js";
import { ColorMode } from "./types.js";
export const state = {
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
    output: {}
};
//# sourceMappingURL=state.js.map