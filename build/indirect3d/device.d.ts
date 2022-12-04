import { Color, I3DColor } from './color';
import { I3DXMatrix, I3DXVec } from './matrix';
import { I3DXVertex } from './geometry';
import { I3DLight } from './lights';
export declare const I3DTS_WORLD = "world";
export declare const I3DTS_VIEW = "view";
export declare const I3DTS_PROJECTION = "projection";
export declare type I3DXTransformType = typeof I3DTS_WORLD | typeof I3DTS_VIEW | typeof I3DTS_PROJECTION;
export declare const I3DPT_POINTLIST = 1;
export declare const I3DPT_LINELIST = 2;
export declare const I3DPT_LINESTRIP = 3;
export declare const I3DPT_TRIANGLELIST = 4;
export declare const I3DPT_TRIANGLESTRIP = 5;
export declare const I3DPT_TRIANGLEFAN = 6;
export declare type I3DXPrimitiveTopologyType = typeof I3DPT_POINTLIST | typeof I3DPT_LINELIST | typeof I3DPT_LINESTRIP | typeof I3DPT_TRIANGLELIST | typeof I3DPT_TRIANGLESTRIP | typeof I3DPT_TRIANGLEFAN;
export declare class I3DXDevice {
    HEIGHT: number;
    WIDTH: number;
    protected HHEIGHT: number;
    protected HWIDTH: number;
    protected _canvas: HTMLCanvasElement;
    protected _ctx: CanvasRenderingContext2D;
    protected _backBuffer: ImageData;
    protected _transforms: {
        [K in I3DXTransformType]: I3DXMatrix;
    };
    protected _zbufferData: Int32Array;
    protected _zbufferDepth: Float32Array;
    protected _ambientLight: I3DColor;
    protected _lights: I3DLight[];
    constructor(container: HTMLElement, WIDTH: number, HEIGHT: number);
    SetAmbientLight(color: I3DColor): void;
    SetLight(index: number, light: I3DLight): void;
    GetLight(index: number): I3DLight | undefined;
    SetTransform(type: I3DXTransformType, matrix: I3DXMatrix): void;
    MultiplyTransform(type: I3DXTransformType, matrix: I3DXMatrix): void;
    BeginScene(): void;
    protected drawPoint(transformed4vec: I3DXVec, color: I3DColor): void;
    protected drawLine(p0: I3DXVec, c0: I3DColor, p1: I3DXVec, c1: I3DColor): void;
    DrawPrimitive(mode: I3DXPrimitiveTopologyType, list: I3DXVertex[]): void;
    EndScene(): void;
    Present(): void;
    protected ZBufferSet(x: number, y: number, color: Color, depth: number): void;
    protected ZBufferClear(): void;
}
//# sourceMappingURL=device.d.ts.map