import { ColorSet, State } from "../types.js";
import { sortObject, format } from "../helpers.js";
import { blockLineSuccess, blockMid } from "cli-block";
import { toSassObject, fixSassTypes, SassOutput } from "@sil/sass";

export const sassOutput = (state: State) => {
  const defaultColors: ColorSet = sortObject(state.colors.default) as ColorSet;
  const darkColors: ColorSet = sortObject(state.colors.dark) as ColorSet;
  const lightColors: ColorSet = sortObject(state.colors.light) as ColorSet;

  const sassStrings: { [key: string]: SassOutput } = {
    "$theme-colors": toSassObject(fixSassTypes(defaultColors)),
    "$darkmode-colors": toSassObject(fixSassTypes(darkColors)),
    "$lightmode-colors": toSassObject(fixSassTypes(lightColors)),
    "$theme-settings": toSassObject(fixSassTypes(state.settings)),
    "$theme-base": toSassObject(fixSassTypes(state.base)),
    "$theme-typography": toSassObject(fixSassTypes(state.typography)),
  };

  let themeMaps: string = "";
  let themeVariables: string = "";

  Object.keys(sassStrings).forEach((strKey) => {
    themeMaps += `${strKey}: (${sassStrings[strKey].result});`;
  });
  Object.keys(sassStrings).forEach((strKey) => {
    themeVariables += `${sassStrings[strKey].variablesString}`;
  });

  const fileData = format(
    "scss",
    `
     ${themeVariables}
     ${themeMaps}
     `
  );

  blockMid("Create theme Scss file");

  blockLineSuccess("Created theme colors");
  blockLineSuccess("Created theme darkMode colors");
  blockLineSuccess("Created theme lightMode colors");
  blockLineSuccess("Created theme Settings");
  blockLineSuccess("Created theme Base");

  return fileData;
};
