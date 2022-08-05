import { sortObject, format } from "../helpers.js";
import { blockLineSuccess, blockMid } from "cli-block";
export const jsonOutput = (state) => {
    const defaultColors = sortObject(state.colors.default);
    const darkColors = sortObject(state.colors.dark);
    const lightColors = sortObject(state.colors.light);
    const jsonData = {
        default: defaultColors,
        dark: darkColors,
        light: lightColors,
    };
    const fileData = format("json", `
   ${JSON.stringify(jsonData)}
     `);
    blockMid("Create theme JSON file");
    blockLineSuccess("Created theme colors");
    blockLineSuccess("Created theme darkMode colors");
    blockLineSuccess("Created theme lightMode colors");
    return fileData;
};
//# sourceMappingURL=json.js.map