import { Color } from './color';
import { I3DXMatrix } from './matrix';
import { I3DXVertex } from './geometry';
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
    protected _transformsCache: {
        [K in I3DXTransformType]: boolean;
    };
    protected _zbufferData: Int32Array;
    protected _zbufferDepth: Float32Array;
    constructor(container: HTMLElement, WIDTH: number, HEIGHT: number);
    SetTransform(type: I3DXTransformType, matrix: I3DXMatrix): void;
    BeginScene(): void;
    DrawPrimitive(mode: I3DXPrimitiveTopologyType, list: I3DXVertex[]): void;
    EndScene(): void;
    Present(): void;
    protected ZBufferSet(x: number, y: number, color: Color, depth: number): void;
    protected ZBufferClear(): void;
}
//# sourceMappingURL=device.d.ts.map