export declare type AlphaChannel = number;
export declare type RedChannel = number;
export declare type GreenChanenl = number;
export declare type BlueChannel = number;
export declare type Color = number;
export declare function XRGB(r: RedChannel, g: GreenChanenl, b: BlueChannel): Color;
export declare function ARGB(a: AlphaChannel, r: RedChannel, g: GreenChanenl, b: BlueChannel): Color;
export declare function I3DXAlphaBlend(bg: Color, src: Color): Color;
export declare function ColorToLab(color: Color): [number, number, number];
export declare function LabToColor(L: number, a: number, b: number): Color;
//# sourceMappingURL=color.d.ts.map