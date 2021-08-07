import { Color } from './color';
import {
    I3DXMatrix,
    I3DXVector,
    I3DXMatrixIdentity,
    I3DXVectorUnit,
    I3DXMatrixSubtract,
    I3DXVectorCross,
    I3DXVectorDot,
    Degrees,
} from './matrix';

export class I3DXVertex {
    coordinates: I3DXMatrix;
    color: Color;

    constructor(x: number, y: number, z: number, color: Color) {
        const c = I3DXVector(4, [x, y, z, 1]);
        this.coordinates = c;
        this.color = color;
    }
}

export function I3DXMatrixLookAtLH(pEye: I3DXMatrix, pAt: I3DXMatrix, pUp: I3DXMatrix): I3DXMatrix {
    const matrix = I3DXMatrixIdentity(4);

    const zaxis = I3DXVectorUnit(I3DXMatrixSubtract(pAt, pEye));
    const xaxis = I3DXVectorUnit(I3DXVectorCross(pUp, zaxis));
    const yaxis = I3DXVectorCross(zaxis, xaxis);

    matrix.set(0, 0, xaxis.data[0]);
    matrix.set(1, 0, xaxis.data[1]);
    matrix.set(2, 0, xaxis.data[2]);
    matrix.set(3, 0, -I3DXVectorDot(xaxis, pEye));
    matrix.set(0, 1, yaxis.data[0]);
    matrix.set(1, 1, yaxis.data[1]);
    matrix.set(2, 1, yaxis.data[2]);
    matrix.set(3, 1, -I3DXVectorDot(yaxis, pEye));
    matrix.set(0, 2, zaxis.data[0]);
    matrix.set(1, 2, zaxis.data[1]);
    matrix.set(2, 2, zaxis.data[2]);
    matrix.set(3, 2, -I3DXVectorDot(zaxis, pEye));
    return matrix;
}

export function I3DXMatrixPerspectiveFovLH(fovy: Degrees, aspect: number, zn: number, zf: number): I3DXMatrix {
  const y = 1/Math.tan(fovy/2);
  const x = y/aspect;
  const zfn = zf / (zf - zn);
  const matrix = new I3DXMatrix(4, 4, [
    x, 0,         0, 0,
    0, y,         0, 0,
    0, 0,       zfn, 1,
    0, 0, -zn * zfn, 0,
  ]);
  return matrix;
}

export function I3DXMatrixOrthoLH(w: number, h: number, zn: number, zf: number): I3DXMatrix {
  const zfzn = zf - zn;
  const matrix = new I3DXMatrix(4, 4, [
    2 / w,     0,          0, 0,
        0, 2 / h,          0, 0,
        0,     0,   1 / zfzn, 0,
        0,     0, -zn / zfzn, 1,
  ]);

  return matrix;
}

export function I3DXBarycentricCoords(x: number, y: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): [number, number, number] {
    const y2y3 = y2 - y3;
    const x3x2 = x3 - x2;
    const x1x3 = x1 - x3;
    const y1y3 = y1 - y3;
    const y3y1 = y3 - y1;
    const xx3 = x - x3;
    const yy3 = y - y3;
    const d = y2y3 * x1x3 + x3x2 * y1y3;
    const w1 = (y2y3 * xx3 + x3x2 * yy3) / d;
    const w2 = (y3y1 * xx3 + x1x3 * yy3) / d;
    return [w1, w2, 1 - w1 - w2];
}
