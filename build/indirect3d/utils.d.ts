import { I3DColor } from "./color";
export declare function pack(color: I3DColor): number;
export declare const UNPACK_INT = "int";
export declare const UNPACK_FLOAT = "float";
declare type UnpackMode = typeof UNPACK_INT | typeof UNPACK_FLOAT;
export declare function unpack(x: number, mode?: UnpackMode): I3DColor;
export declare function sqr(i: number): number;
export {};
//# sourceMappingURL=utils.d.ts.map