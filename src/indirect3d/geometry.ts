import { Color } from './color';
import {
  Degrees,
  I3DXMatrix,
  I3DXMatrixAdd,
  I3DXMatrixSubtract,
  I3DXVector,
  I3DXVectorCross,
  I3DXVectorDot,
  I3DXVectorUnit,
} from './matrix';

export class I3DXVertex {
  coordinates: I3DXMatrix
  color: Color

  constructor(x: number, y: number, z: number, color: Color) {
    const c = I3DXVector(4, [x, y, z, 1]);
    this.coordinates = c;
    this.color = color;
  }
}

export function I3DXMatrixLookAtLH(pEye: I3DXMatrix, pAt: I3DXMatrix, pUp: I3DXMatrix): I3DXMatrix {
  const zaxis = I3DXVectorUnit(I3DXMatrixSubtract(pAt, pEye));
  const xaxis = I3DXVectorUnit(I3DXVectorCross(pUp, zaxis));
  const yaxis = I3DXVectorCross(zaxis, xaxis);
  const xdot = I3DXVectorDot(xaxis, pEye);
  const ydot = I3DXVectorDot(yaxis, pEye);
  const zdot = I3DXVectorDot(zaxis, pEye);

  const matrix = new I3DXMatrix(4, 4, [
    xaxis.data[0], xaxis.data[1], xaxis.data[2], -xdot,
    yaxis.data[0], yaxis.data[1], yaxis.data[2], -ydot,
    zaxis.data[0], zaxis.data[1], zaxis.data[2], -zdot,
                0,             0,             0,     1,
  ]);

  return matrix;
}

export function I3DXMatrixLookToLH(pEye: I3DXMatrix, pDir: I3DXMatrix, pUp: I3DXMatrix): I3DXMatrix {
  const pAt = I3DXMatrixAdd(pEye, pDir);
  return I3DXMatrixLookAtLH(pEye, pAt, pUp);
}

export function I3DXMatrixPerspectiveFovLH(fovy: Degrees, aspect: number, zn: number, zf: number): I3DXMatrix {
  const y = 1/Math.tan(fovy/2);
  const x = y/aspect;
  const zfn = zf / (zf - zn);

  const matrix = new I3DXMatrix(4, 4, [
    x, 0,   0, 0,
    0, y,   0, 0,
    0, 0, zfn, -zn * zfn,
    0, 0,   1, 0,
  ]);

  return matrix;
}

export function I3DXMatrixOrthoLH(w: number, h: number, zn: number, zf: number): I3DXMatrix {
  const zfzn = zf - zn;
  const matrix = new I3DXMatrix(4, 4, [
    2 / w,     0,        0,          0,
        0, 2 / h,        0,          0,
        0,     0, 1 / zfzn, -zn / zfzn,
        0,     0,        0,          1,
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
