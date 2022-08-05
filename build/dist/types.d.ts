import { COLOR } from "@sil/color";
export declare enum ColorMode {
    DARK = "dark",
    LIGHT = "light"
}
export interface ColorSet {
    dark?: COLOR;
    light?: COLOR;
    background: COLOR;
    foreground: COLOR;
    primary: COLOR;
    secondary: COLOR;
    tertiary: COLOR;
    caution: COLOR;
    warning: COLOR;
    error: COLOR;
    info: COLOR;
    success: COLOR;
}
export interface SettingsSet {
    prefix: string;
    styleOutput: boolean;
    classBasedProperties: boolean;
    generateBase: boolean;
    generateTypography: boolean;
    generateColors: boolean;
    generateColorModes: boolean;
    colorModes: boolean;
    colorShades: boolean;
    colorPercentages: boolean;
    colorSteps: number[];
    colorText: boolean;
    breakpointNames: string[];
    breakpointSizes: number[];
}
export interface BaseSet {
    borderRadius: string;
    shadow: string;
    "space-xl": string;
    "space-l": string;
    space: string;
    "space-s": string;
    "space-xs": string;
    transition: string;
}
export interface TypographySet {
    primaryFontFamily: string | string[];
    secondaryFontFamily: string | string[];
    baseSize: string;
    thinWeight: number;
    lightWeight: number;
    normalWeight: number;
    mediumWeight: number;
    boldWeight: number;
    heavyWeight: number;
}
export interface OutputSet {
    js?: string;
    ts?: string;
    scss?: string;
    json?: string;
}
export interface Source {
    outputs?: OutputSet;
    colors: ColorSet;
    settings: SettingsSet;
    base: BaseSet;
    typography: TypographySet;
}
export interface IncomingSource {
    outputs?: OutputSet;
    colors?: Partial<ColorSet>;
    settings?: Partial<SettingsSet>;
    base?: Partial<BaseSet>;
    typography?: Partial<TypographySet>;
}
export interface State {
    themer: Source;
    local: IncomingSource;
    colors: {
        mode: ColorMode;
        og: ColorSet;
        default: ColorSet;
        light: ColorSet;
        dark: ColorSet;
    };
    settings: SettingsSet;
    base: BaseSet;
    typography: TypographySet;
    output: OutputSet;
}
//# sourceMappingURL=types.d.ts.map