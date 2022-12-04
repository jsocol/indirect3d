import { pack, unpack } from './utils';
import { Color, ColorToLab, I3DXAlphaBlend, LabToColor, I3DColor, XRGB } from './color';
import {
    I3DXMatrix,
    I3DXMatrixIdentity,
    I3DXMatrixMultiply,
    I3DXMatrixScale,
    I3DXMatrixSubtract,
    I3DXToRadian,
    I3DXVec,
    I3DXVector3,
    I3DXVectorCross,
    I3DXVectorDot,
    I3DXVectorLength,
    I3DXVectorUnit,
} from './matrix';
import {
    I3DXBarycentricCoords,
    I3DXMatrixLookAtLH,
    I3DXMatrixPerspectiveFovLH,
    I3DXVertex,
} from './geometry';
import {I3DLight, I3DLightType} from './lights';

const WHITE = XRGB(0xff, 0xff, 0xff);

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
    protected _ambientLight: I3DColor = {
        r: 0.0,
        g: 0.0,
        b: 0.0,
        a: 0.0,
    };
    protected _lights: I3DLight[] = [];

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

    SetAmbientLight(color: I3DColor) {
        this._ambientLight = color;
    }

    SetLight(index: number, light: I3DLight) {
        this._lights[index] = light;
    }

    GetLight(index: number): I3DLight | undefined {
        return this._lights[index];
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

    protected drawPoint(transformed4vec: I3DXVec, color: I3DColor) {
        const bx = transformed4vec.x / transformed4vec.w;
        const by = transformed4vec.y / transformed4vec.w;
        const bz = transformed4vec.z / transformed4vec.w;
        // If this is in the field of view
        if (
            Math.abs(bx) <= 1 &&
            Math.abs(by) <= 1 &&
            Math.abs(bz) <= 1
        ) {
            const sx = Math.round((1 - bx) * this.HWIDTH);
            const sy = Math.round((1 - by) * this.HHEIGHT);
            let { a, r, g, b } = color;
            r = r * this._ambientLight.r;
            g = g * this._ambientLight.g;
            b = b * this._ambientLight.b;
            this.ZBufferSet(sx, sy, pack(a, r, g, b), bz);
        }
    }

    DrawPrimitive(mode: I3DXPrimitiveTopologyType, list: I3DXVertex[]) {
        const transformCamera = I3DXMatrixMultiply(this._transforms[I3DTS_VIEW], this._transforms[I3DTS_WORLD]);
        const transform = I3DXMatrixMultiply(this._transforms[I3DTS_PROJECTION], transformCamera);

        const screenNormal = I3DXVector3(0, 0, 1);

        const lightPositions = this._lights.filter((light) => light.type === I3DLightType.Point).map((light) => ({
            light: light,
            pos: I3DXMatrixMultiply(this._transforms[I3DTS_VIEW], light.position!),
        }));

        switch(mode) {
            case I3DPT_POINTLIST:
                for (let i = 0; i < list.length; i++) {
                    const f = I3DXMatrixMultiply(transform, list[i].coordinates) as I3DXVec;
                    this.drawPoint(f, list[i].color);
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
                    const { a: a0, r: r0, g: g0, b: b0 } = list[i].color;
                    const { a: a1, r: r1, g: g1, b: b1 } = list[i+1].color;
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

                    for (let j = 0; j <= dsx; j++) {
                        const dist = j / dsx;
                        const [x, y, z] = pos(dist);
                        const c = color(dist);

                        if (
                            Math.abs(x) < 1 &&
                            Math.abs(y) < 1 &&
                            Math.abs(z) < 1
                        ) {
                            const sx = Math.round((1 - x) * this.HWIDTH);
                            const sy = Math.round((1 - y) * this.HHEIGHT);
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
            case I3DPT_TRIANGLESTRIP:
            case I3DPT_TRIANGLEFAN:
                for (let m = 0; m < list.length - 2; ) {
                    let i: number, j: number, k: number;

                    if (mode === I3DPT_TRIANGLELIST) {
                        i = m;
                        j = m + 1;
                        k = m + 2;
                        m += 3;
                    } else if (mode === I3DPT_TRIANGLESTRIP) {
                        i = m;
                        j = m + 1;
                        k = m + 2;
                        if (m % 2 === 1) {
                            [j, k] = [k, j]
                        }
                        m++;
                    } else {
                        i = 0;
                        j = m + 1;
                        k = m + 2;
                        m++;
                    }
                    const pCam = I3DXMatrixMultiply(transformCamera, list[i].coordinates);
                    const qCam = I3DXMatrixMultiply(transformCamera, list[j].coordinates);
                    const rCam = I3DXMatrixMultiply(transformCamera, list[k].coordinates);
                    const nCam = I3DXVectorUnit(I3DXVectorCross(
                        I3DXMatrixSubtract(qCam, pCam) as I3DXVec,
                        I3DXMatrixSubtract(rCam, pCam) as I3DXVec,
                    ));

                    const pColor = list[i].color;
                    const qColor = list[j].color;
                    const rColor = list[k].color;

                    const p = I3DXMatrixMultiply(this._transforms[I3DTS_PROJECTION], pCam);
                    const q = I3DXMatrixMultiply(this._transforms[I3DTS_PROJECTION], qCam);
                    const r = I3DXMatrixMultiply(this._transforms[I3DTS_PROJECTION], rCam);

                    const P = I3DXVector3(p.data[0] / p.data[3],
                                          p.data[1] / p.data[3],
                                          p.data[2] / p.data[3]);
                    const Q = I3DXVector3(q.data[0] / q.data[3],
                                          q.data[1] / q.data[3],
                                          q.data[2] / q.data[3]);
                    const R = I3DXVector3(r.data[0] / r.data[3],
                                          r.data[1] / r.data[3],
                                          r.data[2] / r.data[3]);


                    const QP = I3DXMatrixSubtract(Q, P) as I3DXVec;
                    const RP = I3DXMatrixSubtract(R, P) as I3DXVec;
                    const RQ = I3DXMatrixSubtract(R, Q) as I3DXVec;
                    const PR = I3DXMatrixSubtract(P, R) as I3DXVec;
                    const N = I3DXVectorUnit(I3DXVectorCross(QP, RP));

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

                    const Pa = pColor.a;
                    const Qa = qColor.a;
                    const Ra = rColor.a;
                    const pNormColor = {
                        r: pColor.r / 255,
                        g: pColor.g / 255,
                        b: pColor.b / 255,
                    };

                    const qNormColor = {
                        r: qColor.r / 255,
                        g: qColor.g / 255,
                        b: qColor.b / 255,
                    };

                    const rNormColor = {
                        r: rColor.r / 255,
                        g: rColor.g / 255,
                        b: rColor.b / 255,
                    };

                    // Ambient light
                    const pLitColor = {
                        a: Pa,
                        r: pNormColor.r * this._ambientLight.r,
                        g: pNormColor.g * this._ambientLight.g,
                        b: pNormColor.b * this._ambientLight.b,
                    }

                    const qLitColor = {
                        a: Qa,
                        r: qNormColor.r * this._ambientLight.r,
                        g: qNormColor.g * this._ambientLight.g,
                        b: qNormColor.b * this._ambientLight.b,
                    };

                    const rLitColor = {
                        a: Ra,
                        r: rNormColor.r * this._ambientLight.r,
                        g: rNormColor.g * this._ambientLight.g,
                        b: rNormColor.b * this._ambientLight.b,
                    };

                    for (let l of lightPositions) {
                        let pLdir = I3DXMatrixSubtract(pCam, l.pos) as I3DXVec;
                        const pLdist = I3DXVectorLength(pLdir);
                        pLdir = I3DXMatrixScale(pLdir, 1/pLdist) as I3DXVec;
                        const pLambert = Math.max(I3DXVectorDot(I3DXVector3(pLdir.data[0], pLdir.data[1], pLdir.data[2]), nCam), 0);
                        const pAtten = l.light.atten0 + l.light.atten1 * pLdist + l.light.atten2 * pLdist * pLdist;
                        
                        pLitColor.r += pNormColor.r * l.light.diffuse!.r * pLambert * 1.0 / pAtten;
                        pLitColor.g += pNormColor.g * l.light.diffuse!.g * pLambert * 1.0 / pAtten;
                        pLitColor.b += pNormColor.b * l.light.diffuse!.b * pLambert * 1.0 / pAtten;

                        let qLdir = I3DXMatrixSubtract(qCam, l.pos) as I3DXVec;
                        const qLdist = I3DXVectorLength(qLdir);
                        qLdir = I3DXMatrixScale(qLdir, 1/qLdist) as I3DXVec;
                        const qLambert = Math.max(I3DXVectorDot(I3DXVector3(qLdir.data[0], qLdir.data[1], qLdir.data[2]), nCam), 0);
                        const qAtten = l.light.atten0 + l.light.atten1 * qLdist + l.light.atten2 * qLdist * qLdist;

                        qLitColor.r += qNormColor.r * l.light.diffuse!.r * qLambert * 1.0 / qAtten;
                        qLitColor.g += qNormColor.g * l.light.diffuse!.g * qLambert * 1.0 / qAtten;
                        qLitColor.b += qNormColor.b * l.light.diffuse!.b * qLambert * 1.0 / qAtten;

                        let rLdir = I3DXMatrixSubtract(rCam, l.pos) as I3DXVec;
                        const rLdist = I3DXVectorLength(rLdir);
                        rLdir = I3DXMatrixScale(rLdir, 1/rLdist) as I3DXVec;
                        const rLambert = Math.max(I3DXVectorDot(I3DXVector3(rLdir.data[0], rLdir.data[1], rLdir.data[2]), nCam), 0);
                        const rAtten = l.light.atten0 + l.light.atten1 * rLdist + l.light.atten2 * rLdist * rLdist;

                        rLitColor.r += rNormColor.r * l.light.diffuse!.r * rLambert * 1.0 / rAtten;
                        rLitColor.g += rNormColor.g * l.light.diffuse!.g * rLambert * 1.0 / rAtten;
                        rLitColor.b += rNormColor.b * l.light.diffuse!.b * rLambert * 1.0 / rAtten;

                    }

                    pLitColor.r = Math.min(pLitColor.r, 1.0) * 255;
                    pLitColor.g = Math.min(pLitColor.g, 1.0) * 255;
                    pLitColor.b = Math.min(pLitColor.b, 1.0) * 255;

                    qLitColor.r = Math.min(qLitColor.r, 1.0) * 255;
                    qLitColor.g = Math.min(qLitColor.g, 1.0) * 255;
                    qLitColor.b = Math.min(qLitColor.b, 1.0) * 255;

                    rLitColor.r = Math.min(rLitColor.r, 1.0) * 255;
                    rLitColor.g = Math.min(rLitColor.g, 1.0) * 255;
                    rLitColor.b = Math.min(rLitColor.b, 1.0) * 255;

                    // Calculate light colors and convert to L*a*b*
                    const PLab = ColorToLab(pLitColor);
                    const QLab = ColorToLab(qLitColor);
                    const RLab = ColorToLab(rLitColor);

                    // x and y here are literally pixel coordinates
                    for (let y = Tp; y <= Bp; y++) {
                        for (let x = Lp; x <= Rp; x++) {
                            // convert x and y back to perspective space
                            const px = 1 - x / this.HWIDTH;
                            const py = 1 - y / this.HHEIGHT;
                            const sOrigin = I3DXVector3(px, py, 0);

                            // Depth at intersection with plane of the triangle
                            const z = (d - I3DXVectorDot(N, sOrigin)) / dN;
                            const O = I3DXVector3(px, py, z);

                            if (!(
                                I3DXVectorDot(I3DXVectorCross(QP, I3DXMatrixSubtract(O, P) as I3DXVec), N) >= 0 &&
                                I3DXVectorDot(I3DXVectorCross(RQ, I3DXMatrixSubtract(O, Q) as I3DXVec), N) >= 0 &&
                                I3DXVectorDot(I3DXVectorCross(PR, I3DXMatrixSubtract(O, R) as I3DXVec), N) >= 0
                            )) {
                                continue;
                            }

                            const [Wp, Wq, Wr] = I3DXBarycentricCoords(px, py, P.x, P.y, Q.x, Q.y, R.x, R.y);

                            const L = PLab[0] * Wp + QLab[0] * Wq + RLab[0] * Wr;
                            const a = PLab[1] * Wp + QLab[1] * Wq + RLab[1] * Wr;
                            const b = PLab[2] * Wp + QLab[2] * Wq + RLab[2] * Wr;
                            const { r: vr, g: vg, b: vb } = LabToColor(L, a, b);

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
                break;
        }
    }

    EndScene() {
        const max = this.WIDTH * this.HEIGHT * 4;
        for (let i = 0; i < max; ) {
            const { a, r, g, b } = unpack(this._zbufferData[i/4]);
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
        const idx = this.WIDTH * (y - 1) + x;
        const zdepth = this._zbufferDepth[idx];
        const zcolor = this._zbufferData[idx];

        // Current pixel is solid and closer
        const { a: za } = unpack(zcolor);
        if (za >= 255 && zdepth < depth) {
            return;
        }

        // New pixel is solid, or no current color
        const { a } = unpack(color);

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
