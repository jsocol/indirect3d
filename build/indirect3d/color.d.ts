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
export declare function RGBToXYZ(r: number, g: number, b: number): [number, number, number];
export declare function XYZToRGB(x: number, y: number, z: number): [number, number, number];
export declare function XYZToLab(x: number, y: number, z: number): [number, number, number];
export declare function LabToXYZ(L: number, a: number, b: number): [number, number, number];
//# sourceMappingURL=color.d.ts.map