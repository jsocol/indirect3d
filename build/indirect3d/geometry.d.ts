import { Color } from './color';
import { I3DXMatrix, Degrees } from './matrix';
export declare class I3DXVertex {
    coordinates: I3DXMatrix;
    color: Color;
    constructor(x: number, y: number, z: number, color: Color);
}
export declare function I3DXMatrixLookAtLH(pEye: I3DXMatrix, pAt: I3DXMatrix, pUp: I3DXMatrix): I3DXMatrix;
export declare function I3DXMatrixPerspectiveFovLH(fovy: Degrees, aspect: number, zn: number, zf: number): I3DXMatrix;
export declare function I3DXBarycentricCoords(x: number, y: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): [number, number, number];
//# sourceMappingURL=geometry.d.ts.map