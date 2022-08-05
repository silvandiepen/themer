import { sortObject, format } from "../helpers.js";
import { blockLineSuccess, blockMid } from "cli-block";
import { snakeCase } from "@sil/case";
export const tsOutput = (state) => {
    const jsonData = {
        default: sortObject(state.colors.default),
        dark: sortObject(state.colors.dark),
        light: sortObject(state.colors.light),
    };
    let defaultConsts = ``;
    const baseColors = {};
    Object.keys(jsonData.default).forEach((key, idx) => {
        if (!key.includes("-")) {
            baseColors[key] = state.colors.default[key];
            defaultConsts += `${snakeCase(key).toUpperCase()}: "${baseColors[key]}",\n`;
        }
    });
    let darkConsts = ``;
    const darkColors = {};
    Object.keys(jsonData.dark).forEach((key, idx) => {
        if (!key.includes("-")) {
            darkColors[key] = state.colors.default[key];
            darkConsts += `${snakeCase(key).toUpperCase()}: "${baseColors[key]}",\n`;
        }
    });
    let lightConst = ``;
    const lightColors = {};
    Object.keys(jsonData.light).forEach((key, idx) => {
        if (!key.includes("-")) {
            lightColors[key] = state.colors.default[key];
            lightConst += `${snakeCase(key).toUpperCase()}: "${baseColors[key]}",\n`;
        }
    });
    const fileData = format("typescript", `
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
     
    export const getColor = (colorName:string, colorSet:string = 'default') => {
      return colors[colorSet][colorName];
    }
     `);
    blockMid("Create theme TypeScript file");
    blockLineSuccess("Created theme colors");
    blockLineSuccess("Created theme darkMode colors");
    blockLineSuccess("Created theme lightMode colors");
    return fileData;
};
//# sourceMappingURL=ts.js.map