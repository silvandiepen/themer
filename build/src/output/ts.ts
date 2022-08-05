import { ColorSet, State } from "../types.js";
import { sortObject, format } from "../helpers.js";
import { blockLineSuccess, blockMid } from "cli-block";
import {  snakeCase } from "@sil/case";

export const tsOutput = (state: State) => {
  const jsonData: { [key: string]: ColorSet } = {
    default: sortObject(state.colors.default) as ColorSet,
    dark: sortObject(state.colors.dark) as ColorSet,
    light: sortObject(state.colors.light) as ColorSet,
  };

  let defaultConsts: string = ``;
  const baseColors: { [key: string]: string | number } = {};
  Object.keys(jsonData.default).forEach((key: string, idx: number) => {
    if (!key.includes("-")) {
      //@ts-ignore
      baseColors[key] = state.colors.default[key] as string;
      defaultConsts += `${snakeCase(key).toUpperCase()}: "${
        baseColors[key]
      }",\n`;
    }
  });

  let darkConsts: string = ``;
  const darkColors: { [key: string]: string | number } = {};
  Object.keys(jsonData.dark).forEach((key: string, idx: number) => {
    if (!key.includes("-")) {
      //@ts-ignore
      darkColors[key] = state.colors.default[key] as string;
      darkConsts += `${snakeCase(key).toUpperCase()}: "${baseColors[key]}",\n`;
    }
  });

  let lightConst: string = ``;
  const lightColors: { [key: string]: string | number } = {};
  Object.keys(jsonData.light).forEach((key: string, idx: number) => {
    if (!key.includes("-")) {
      //@ts-ignore
      lightColors[key] = state.colors.default[key] as string;
      lightConst += `${snakeCase(key).toUpperCase()}: "${baseColors[key]}",\n`;
    }
  });

  const fileData = format(
    "typescript",
    `
    export enum ColorSetName {
      DEFAULT = 'default',
      DARK = 'dark',
      LIGHT = 'light'
    }
    export type ColorSet = {
      [key in ColorSetName]: {
        [key:string]: string | number;
      }
    }
     export const colors:ColorSet = ${JSON.stringify(jsonData)}

     export const defaultColors = {
      ${defaultConsts}
     }     
     export const darkColors = {
      ${darkConsts}
     }     
     export const lightColors = {
      ${lightConst}
     }
     
     export const getColor = (colorName: string, colorSet: ColorSetName = ColorSetName.DEFAULT) => {
      return (colors as ColorSet)[colorSet as ColorSetName][colorName as string];
    };
    
     `
  );

  blockMid("Create theme TypeScript file");

  blockLineSuccess("Created theme colors");
  blockLineSuccess("Created theme darkMode colors");
  blockLineSuccess("Created theme lightMode colors");

  return fileData;
};
