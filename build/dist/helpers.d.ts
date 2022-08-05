import { COLOR } from "@sil/color";
import { State } from "./types.js";
export declare const getKey: (haystack: Object, needle: string) => any;
export declare const getTextColor: (state: State, color: COLOR) => COLOR;
export declare const getEnv: () => {
    themer: string;
    local: string;
};
export declare const writeFile: (path: string, contents: string) => Promise<void>;
export declare const sortObject: (o: any) => {};
export declare const format: (type: string, content: string) => string;
//# sourceMappingURL=helpers.d.ts.map