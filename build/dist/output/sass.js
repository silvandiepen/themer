import { sortObject, format } from "../helpers.js";
import { blockLineSuccess, blockMid } from "cli-block";
import { toSassObject, fixSassTypes } from "@sil/sass";
export const sassOutput = (state) => {
    const defaultColors = sortObject(state.colors.default);
    const darkColors = sortObject(state.colors.dark);
    const lightColors = sortObject(state.colors.light);
    const sassStrings = {
        "$theme-colors": toSassObject(fixSassTypes(defaultColors)),
        "$darkmode-colors": toSassObject(fixSassTypes(darkColors)),
        "$lightmode-colors": toSassObject(fixSassTypes(lightColors)),
        "$theme-settings": toSassObject(fixSassTypes(state.settings)),
        "$theme-base": toSassObject(fixSassTypes(state.base)),
        "$theme-typography": toSassObject(fixSassTypes(state.typography)),
    };
    let themeMaps = "";
    let themeVariables = "";
    Object.keys(sassStrings).forEach((strKey) => {
        themeMaps += `${strKey}: (${sassStrings[strKey].result});`;
    });
    Object.keys(sassStrings).forEach((strKey) => {
        themeVariables += `${sassStrings[strKey].variablesString}`;
    });
    const fileData = format("scss", `
     ${themeVariables}
     ${themeMaps}
     `);
    blockMid("Create theme Scss file");
    blockLineSuccess("Created theme colors");
    blockLineSuccess("Created theme darkMode colors");
    blockLineSuccess("Created theme lightMode colors");
    blockLineSuccess("Created theme Settings");
    blockLineSuccess("Created theme Base");
    return fileData;
};
//# sourceMappingURL=sass.js.map