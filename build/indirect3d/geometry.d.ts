import { I3DColor } from './color';
import { Degrees, I3DXMatrix, I3DXVec } from './matrix';
import { I3DMaterial } from './material';
export declare class I3DXVertex {
    coordinates: I3DXVec;
    color: I3DColor;
    material?: I3DMaterial;
    constructor(x: number, y: number, z: number, color: I3DColor);
}
export declare function I3DXMatrixLookAtLH(pEye: I3DXVec, pAt: I3DXVec, pUp: I3DXVec): I3DXMatrix;
export declare function I3DXMatrixLookToLH(pEye: I3DXVec, pDir: I3DXVec, pUp: I3DXVec): I3DXMatrix;
export declare function I3DXMatrixPerspectiveFovLH(fovy: Degrees, aspect: number, zn: number, zf: number): I3DXMatrix;
export declare function I3DXMatrixOrthoLH(w: number, h: number, zn: number, zf: number): I3DXMatrix;
export declare function I3DXBarycentricCoords(x: number, y: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): [number, number, number];
//# sourceMappingURL=geometry.d.ts.map