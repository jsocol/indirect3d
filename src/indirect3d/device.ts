import { pack, unpack } from './utils';
import { Color, ColorToLab, I3DXAlphaBlend, LabToColor } from './color';
import {
    I3DXMatrix,
    I3DXMatrixIdentity,
    I3DXMatrixMultiply,
    I3DXMatrixSubtract,
    I3DXToRadian,
    I3DXVector3,
    I3DXVectorCross,
    I3DXVectorDot,
    I3DXVectorUnit,
} from './matrix';
import {
    I3DXBarycentricCoords,
    I3DXMatrixLookAtLH,
    I3DXMatrixPerspectiveFovLH,
    I3DXVertex,
} from './geometry';

export const I3DTS_WORLD = 'world';
export const I3DTS_VIEW = 'view';
export const I3DTS_PROJECTION = 'projection';

export type I3DXTransformType = typeof I3DTS_WORLD | typeof I3DTS_VIEW | typeof I3DTS_PROJECTION;

export const I3DPT_POINTLIST = 1;
export const I3DPT_LINELIST = 2;
export const I3DPT_LINESTRIP = 3;
export const I3DPT_TRIANGLELIST = 4;
export const I3DPT_TRIANGLESTRIP = 5;
export const I3DPT_TRIANGLEFAN = 6;

export type I3DXPrimitiveTopologyType =
    typeof I3DPT_POINTLIST |
    typeof I3DPT_LINELIST |
    typeof I3DPT_LINESTRIP |
    typeof I3DPT_TRIANGLELIST |
    typeof I3DPT_TRIANGLESTRIP |
    typeof I3DPT_TRIANGLEFAN;

export class I3DXDevice {
    HEIGHT: number
    WIDTH: number
    protected HHEIGHT: number
    protected HWIDTH: number
    protected _canvas: HTMLCanvasElement
    protected _ctx: CanvasRenderingContext2D
    protected _backBuffer: ImageData
    protected _transforms: {[K in I3DXTransformType]: I3DXMatrix}
    protected _zbufferData: Int32Array
    protected _zbufferDepth: Float32Array

    constructor(container: HTMLElement, WIDTH: number, HEIGHT: number) {
        this.WIDTH = WIDTH;
        this.HWIDTH = WIDTH / 2;
        this.HEIGHT = HEIGHT;
        this.HHEIGHT = HEIGHT / 2;
        this._canvas = document.createElement('canvas');
        this._canvas.width = WIDTH;
        this._canvas.height = HEIGHT;
        container.appendChild(this._canvas);
        this._ctx = this._canvas.getContext('2d')!;
        this._backBuffer = this._ctx.createImageData(WIDTH, HEIGHT);

        const defaultView = I3DXMatrixLookAtLH(
                I3DXVector3(0.0, 0.0, 10.0),
                I3DXVector3(0.0, 0.0, 0.0),
                I3DXVector3(0.0, 1.0, 0.0));
        const defaultProjection = I3DXMatrixPerspectiveFovLH(
                I3DXToRadian(45),
                WIDTH/HEIGHT,
                1,
                100);

        this._transforms = {
            [I3DTS_WORLD]: I3DXMatrixIdentity(4),
            [I3DTS_VIEW]: defaultView,
            [I3DTS_PROJECTION]: defaultProjection,
        };

        const bufferLength = this.WIDTH * this.HEIGHT;
        this._zbufferData = new Int32Array(bufferLength);
        this._zbufferDepth = new Float32Array(bufferLength)
    }

    SetTransform(type: I3DXTransformType, matrix: I3DXMatrix) {
        this._transforms[type] = matrix;
    }

    MultiplyTransform(type: I3DXTransformType, matrix: I3DXMatrix) {
        this._transforms[type] = I3DXMatrixMultiply(matrix, this._transforms[type]);
    }

    BeginScene() {
        this.ZBufferClear();
        this._backBuffer = this._ctx.createImageData(this.WIDTH, this.HEIGHT);
    }

    DrawPrimitive(mode: I3DXPrimitiveTopologyType, list: I3DXVertex[]) {
        let transform: I3DXMatrix;
        transform = I3DXMatrixMultiply(this._transforms[I3DTS_VIEW], this._transforms[I3DTS_WORLD]);
        transform = I3DXMatrixMultiply(this._transforms[I3DTS_PROJECTION], transform);

        const screenNormal = I3DXVector3(0, 0, 1);

        switch(mode) {
            case I3DPT_POINTLIST:
                for (let i = 0; i < list.length; i++) {
                    const f = I3DXMatrixMultiply(transform, list[i].coordinates);
                    const bx = f.data[0] / f.data[3];
                    const by = f.data[1] / f.data[3];
                    const bz = f.data[2] / f.data[3];
                    // If this is in the field of view
                    if (
                        Math.abs(bx) <= 1 &&
                        Math.abs(by) <= 1 &&
                        Math.abs(bz) <= 1
                    ) {
                        const sx = Math.round((1 - bx) * this.HWIDTH);
                        const sy = Math.round((1 - by) * this.HHEIGHT);
                        this.ZBufferSet(sx, sy, list[i].color, bz);
                    }
                }
                break;
            case I3DPT_LINELIST:
            case I3DPT_LINESTRIP:
                for (let i = 0; i < list.length - 1; i++) {
                    // model space coordinates
                    const p0 = list[i];
                    const p1 = list[i+1];

                    // These should be points in the perspective space
                    const f0 = I3DXMatrixMultiply(transform, p0.coordinates);
                    const f1 = I3DXMatrixMultiply(transform, p1.coordinates);

                    // convert to the screen
                    const bx0 = f0.data[0] / f0.data[3];
                    const by0 = f0.data[1] / f0.data[3];
                    const bz0 = f0.data[2] / f0.data[3];
                    const bx1 = f1.data[0] / f1.data[3];
                    const by1 = f1.data[1] / f1.data[3];
                    const bz1 = f1.data[2] / f1.data[3];
                    
                    // Given a distance from 0 to 1 along a line segment
                    // between point f0 and point f1, return the appropriate
                    // color.
                    const [a0, r0, g0, b0] = unpack(list[i].color);
                    const [a1, r1, g1, b1] = unpack(list[i+1].color);
                    const da = a1 - a0;
                    const dr = r1 - r0;
                    const dg = g1 - g0;
                    const db = b1 - b0;
                    
                    const color = (distance: number): Color => {
                        return pack(
                            Math.round(da * distance + a0),
                            Math.round(dr * distance + r0),
                            Math.round(dg * distance + g0),
                            Math.round(db * distance + b0),
                        );
                    };

                    // Given a distance from 0 to 1 along a line segment
                    // between point f0 and point f1, return a 3D, transformed
                    // position.
                    const dx = bx1 - bx0;
                    const dy = by1 - by0;
                    const dz = bz1 - bz0;

                    const pos = (distance: number): [number, number, number] => {
                        return [
                            dx * distance + bx0,
                            dy * distance + by0,
                            dz * distance + bz0,
                        ];
                    };

                    const sx0 = Math.round((1 - bx0) * this.HWIDTH);
                    const sx1 = Math.round((1 - bx1) * this.HWIDTH);
                    const dsx = Math.abs(sx1 - sx0);
                    // console.log(`screen x length: ${sx1} - ${sx0} = ${dsx}`);

                    for (let j = 0; j <= dsx; j++) {
                        const dist = j / dsx;
                        //console.log('line dist:', dist);
                        const [x, y, z] = pos(dist);
                        //console.log('xyz', [x, y, z]);
                        const c = color(dist);

                        if (
                            Math.abs(x) < 1 &&
                            Math.abs(y) < 1 &&
                            Math.abs(z) < 1
                        ) {
                            const sx = Math.round((1 - x) * this.HWIDTH);
                            const sy = Math.round((1 - y) * this.HHEIGHT);
                            // console.log(`screen coords ${[sx, sy]}`);
                            this.ZBufferSet(sx, sy, c, z);
                        }
                    }
                    if (mode === I3DPT_LINELIST) {
                        // Disconnect the lines by moving along the list
                        i++;
                    }
                }
                break;
            case I3DPT_TRIANGLELIST:
                for (let i = 0; i < list.length - 2; i++) {
                    const p = I3DXMatrixMultiply(transform, list[i].coordinates);
                    const q = I3DXMatrixMultiply(transform, list[i+1].coordinates);
                    const r = I3DXMatrixMultiply(transform, list[i+2].coordinates);

                    const P = I3DXVector3(p.data[0] / p.data[3],
                                          p.data[1] / p.data[3],
                                          p.data[2] / p.data[3]);
                    const Q = I3DXVector3(q.data[0] / q.data[3],
                                          q.data[1] / q.data[3],
                                          q.data[2] / q.data[3]);
                    const R = I3DXVector3(r.data[0] / r.data[3],
                                          r.data[1] / r.data[3],
                                          r.data[2] / r.data[3]);


                    const N = I3DXVectorUnit(I3DXVectorCross(
                      I3DXMatrixSubtract(Q, P),
                      I3DXMatrixSubtract(R, P)
                    ));

                    // the final parameter to the equation of the plane
                    const d = I3DXVectorDot(screenNormal, P);

                    const dN = I3DXVectorDot(N, screenNormal);
                    // if dN === 0, the triangle _should_ be parallel to the ray
                    if (dN <= 0) {
                      continue;
                    }

                    // Scaled coordinates
                    const Psx = Math.round((1 - P.data[0]) * this.HWIDTH);
                    const Psy = Math.round((1 - P.data[1]) * this.HHEIGHT);
                    const Qsx = Math.round((1 - Q.data[0]) * this.HWIDTH);
                    const Qsy = Math.round((1 - Q.data[1]) * this.HHEIGHT);
                    const Rsx = Math.round((1 - R.data[0]) * this.HWIDTH);
                    const Rsy = Math.round((1 - R.data[1]) * this.HHEIGHT);

                    // Corners of a boundins square
                    const Tp = Math.max(Math.min(Psy, Qsy, Rsy), 0);
                    const Bp = Math.min(Math.max(Psy, Qsy, Rsy), this.HEIGHT);
                    const Lp = Math.max(Math.min(Psx, Qsx, Rsx), 0);
                    const Rp = Math.min(Math.max(Psx, Qsx, Rsx), this.WIDTH);

                    const [Pa] = unpack(list[i].color);
                    const PLab = ColorToLab(list[i].color);
                    const [Qa] = unpack(list[i + 1].color);
                    const QLab = ColorToLab(list[i + 1].color);
                    const [Ra] = unpack(list[i + 2].color);
                    const RLab = ColorToLab(list[i + 2].color);

                    // x and y here are literally pixel coordinates
                    for (let y = Tp; y <= Bp; y++) {
                        for (let x = Lp; x <= Rp; x++) {
                            // Determine if this point within the square is within the triangle
                            const pq = (y > ((Qsy - Psy) / (Qsx - Psx) * (x - Psx) + Psy));
                            const pr = (y < ((Rsy - Psy) / (Rsx - Psx) * (x - Psx) + Psy));
                            const qr = (y > ((Rsy - Qsy) / (Rsx - Qsx) * (x - Qsx) + Qsy));

                            // Point is on the right side of all 3 lines
                            if (pq && pr && qr) {
                                const [Wp, Wq, Wr] = I3DXBarycentricCoords(x, y, Psx, Psy, Qsx, Qsy, Rsx, Rsy);

                                // convert x and y back to perspective space
                                const px = 1 - x / this.HWIDTH;
                                const py = 1 - y / this.HHEIGHT;
                                const sOrigin = I3DXVector3(px, py, 0);
                                const z = (d - I3DXVectorDot(N, sOrigin)) / dN;
                                //const z = P.data[2] * Wp + Q.data[2] * Wq + R.data[2] * Wr;

                                const L = PLab[0] * Wp + QLab[0] * Wq + RLab[0] * Wr;
                                const a = PLab[1] * Wp + QLab[1] * Wq + RLab[1] * Wr;
                                const b = PLab[2] * Wp + QLab[2] * Wq + RLab[2] * Wr;
                                const [_, vr, vg, vb] = unpack(LabToColor(L, a, b));

                                const c = pack(
                                    Math.round(Pa * Wp + Qa * Wq + Ra * Wr),
                                    vr,
                                    vg,
                                    vb,
                                );
                                this.ZBufferSet(x, y, c, z);
                            }
                        }
                    }
                }
                break;
        }
    }

    EndScene() {
        const max = this.WIDTH * this.HEIGHT * 4;
        for (let i = 0; i < max; ) {
            const [a, r, g, b] = unpack(this._zbufferData[i/4]);
            this._backBuffer.data[i++] = r;
            this._backBuffer.data[i++] = g;
            this._backBuffer.data[i++] = b;
            this._backBuffer.data[i++] = a;
        }
    }

    Present() {
        this._ctx.putImageData(this._backBuffer, 0, 0);
    }

    protected ZBufferSet(x: number, y: number, color: Color, depth: number) {
        //console.log(`setting ${x},${y},${depth} to ${unpack(color)}`);
        const idx = this.WIDTH * (y - 1) + x;
        const zdepth = this._zbufferDepth[idx];
        const zcolor = this._zbufferData[idx];

        // Current pixel is solid and closer
        const [za] = unpack(zcolor);
        if (za >= 255 && zdepth < depth) {
            return;
        }

        // New pixel is solid, or no current color
        const [a] = unpack(color);

        if ((a >= 255 && depth < zdepth) || za === 0) {
            this._zbufferData[idx] = color;
            this._zbufferDepth[idx] = depth;
            return;
        }

        // Nothing solid, blend 'em
        if (depth > zdepth) {
          this._zbufferData[idx] = I3DXAlphaBlend(color, zcolor);
        } else {
          this._zbufferData[idx] = I3DXAlphaBlend(zcolor, color);
        }

        // Which is closer
        if (depth < zdepth) {
            this._zbufferDepth[idx] = depth;
        }
    }

    protected ZBufferClear() {
        const bufferLength = this.WIDTH * this.HEIGHT;
        this._zbufferData = new Int32Array(bufferLength);
        this._zbufferDepth = new Float32Array(bufferLength)
    }
};
