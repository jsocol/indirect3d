import { Color } from './color';
import { Degrees, I3DXMatrix } from './matrix';
export declare class I3DXVertex {
    coordinates: I3DXMatrix;
    color: Color;
    constructor(x: number, y: number, z: number, color: Color);
}
export declare function I3DXMatrixLookAtLH(pEye: I3DXMatrix, pAt: I3DXMatrix, pUp: I3DXMatrix): I3DXMatrix;
export declare function I3DXMatrixLookToLH(pEye: I3DXMatrix, pDir: I3DXMatrix, pUp: I3DXMatrix): I3DXMatrix;
export declare function I3DXMatrixPerspectiveFovLH(fovy: Degrees, aspect: number, zn: number, zf: number): I3DXMatrix;
export declare function I3DXMatrixOrthoLH(w: number, h: number, zn: number, zf: number): I3DXMatrix;
export declare function I3DXBarycentricCoords(x: number, y: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): [number, number, number];
//# sourceMappingURL=geometry.d.ts.map