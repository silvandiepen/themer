import { ColorSet, State } from "../types.js";
import { sortObject, format } from "../helpers.js";
import { blockLineSuccess, blockMid } from "cli-block";

export const jsonOutput = (state: State) => {
  const defaultColors: ColorSet = sortObject(state.colors.default) as ColorSet;
  const darkColors: ColorSet = sortObject(state.colors.dark) as ColorSet;
  const lightColors: ColorSet = sortObject(state.colors.light) as ColorSet;

  const jsonData = {
    default: defaultColors,
    dark: darkColors,
    light: lightColors,
  };

  const fileData = format(
    "json",
    `
   ${JSON.stringify(jsonData)}
     `
  );

  blockMid("Create theme JSON file");

  blockLineSuccess("Created theme colors");
  blockLineSuccess("Created theme darkMode colors");
  blockLineSuccess("Created theme lightMode colors");

  return fileData;
};
