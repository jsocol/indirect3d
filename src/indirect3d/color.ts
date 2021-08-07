import { pack, unpack } from './utils';

export type AlphaChannel = number;
export type RedChannel = number;
export type GreenChanenl = number;
export type BlueChannel = number;
export type Color = number;

export function XRGB(r: RedChannel, g: GreenChanenl, b: BlueChannel): Color {
    return pack(255, r, g, b);
}

export function ARGB(a: AlphaChannel, r: RedChannel, g: GreenChanenl, b: BlueChannel): Color {
    return pack(a, r, g, b);
}

export function I3DXAlphaBlend(bg: Color, src: Color): Color {
    const sa = src >>> 24;
    const ba = bg >>> 24;

    // src is transparent.
    if ( sa == 0 ) {
        return bg;
    }

    // bg is transparent.
    if ( ba == 0 )
        return src;

    let [a0, r0, g0, b0] = unpack(bg);
    let [a1, r1, g1, b1] = unpack(src);
    a0 = a0/255;
    a1 = a1/255;
    let a = a0 + a1 - a0 * a1;
    const r = Math.round((r0 * a0 + r1 * (1 - a0) * a1)/a);
    const g = Math.round((g0 * a0 + g1 * (1 - a0) * a1)/a);
    const b = Math.round((b0 * a0 + b1 * (1 - a0) * a1)/a);
    a = Math.min(255, Math.round(a * 255));
    return pack(a, r, g, b);
}

export function ColorToLab(color: Color): [number, number, number] {
    const [_, r, g, b] = unpack(color);
    const [X, Y, Z] = RGBToXYZ(r, g, b);
    return XYZToLab(X, Y, Z);
}

export function LabToColor(L: number, a: number, b: number): Color {
    const [X, Y, Z] = LabToXYZ(L, a, b);
    const [rc, gc, bc] = XYZToRGB(X, Y, Z);
    return XRGB(rc, gc, bc);
}

// These conversions come from http://www.easyrgb.com/en/math.php

export function RGBToXYZ(r: number, g: number, b: number): [number, number, number] {
    let rf = r / 255;
    let gf = g / 255;
    let bf = b / 255;

    if ( rf > 0.04045 ) {
        rf = Math.pow(((rf + 0.055) / 1.055), 2.4);
    } else {
        rf = rf / 12.92;
    }

    rf *= 100;

    if ( gf > 0.04045 ) {
        gf = Math.pow(((gf + 0.055) / 1.055), 2.4);
    } else {
        gf = gf / 12.92;
    }

    gf *= 100;

    if ( bf > 0.04045 ) {
        bf = Math.pow(((bf + 0.055) / 1.055), 2.4);
    } else {
        bf = bf / 12.92;
    }

    bf *= 100;

    return [
        rf * 0.4124 + gf * 0.3576 + bf * 0.1805,
        rf * 0.2126 + gf * 0.7152 + bf * 0.0722,
        rf * 0.0193 + gf * 0.1192 + bf * 0.9505,
    ];
}

export function XYZToRGB(x: number, y: number, z: number): [number, number, number] {
    const vx = x / 100.0;
    const vy = y / 100.0;
    const vz = z / 100.0;

    let vr = vx *  3.2406 + vy * -1.5372 + vz * -0.4986;
    let vg = vx * -0.9689 + vy *  1.8758 + vz *  0.0415;
    let vb = vx *  0.0557 + vy * -0.2040 + vz *  1.0570;

    if (Math.abs(vr) > 0.0031308) {
        vr = 1.055 * (Math.pow(vr, (1/2.4))) - 0.055;
    } else {
        vr = 12.92 * vr;
    }

    if (Math.abs(vg) > 0.0031308) {
        vg = 1.055 * (Math.pow(vg, (1/2.4))) - 0.055;
    } else {
        vg = 12.92 * vg;
    }

    if (Math.abs(vb) > 0.0031308) {
        vb = 1.055 * (Math.pow(vb, (1/2.4))) - 0.055;
    } else {
        vb = 12.92 * vb;
    }

    return [
        Math.min(Math.max(Math.round(vr * 255), 0), 255),
        Math.min(Math.max(Math.round(vg * 255), 0), 255),
        Math.min(Math.max(Math.round(vb * 255), 0), 255),
    ];
}

// Reference 2° (CIE 1931) / D65
const RefX = 95.047;
const RefY = 100;
const RefZ = 108.883;

export function XYZToLab(x: number, y: number, z: number): [number, number, number] {
    let vx = x / RefX;
    let vy = y / RefY;
    let vz = z / RefZ;

    if ( vx > 0.008856 ) {
        vx = Math.pow(vx, (1 / 3));
    } else {
        vx = (7.787 * vx) + (16 / 116);
    }

    if ( vy > 0.008856 ) {
        vy = Math.pow(vy, (1 / 3));
    } else {
        vy = (7.787 * vy) + (16 / 116);
    }

    if ( vz > 0.008856 ) {
        vz = Math.pow(vz, (1 / 3));
    } else {
        vz = (7.787 * vz) + (16 / 116);
    }

    return [
        (116 * vy) - 16,
        500 * (vx - vy),
        200 * (vy - vz),
    ];
}

export function LabToXYZ(L: number, a: number, b: number): [number, number, number] {
    let vy = (L + 16) / 116;
    let vx = a / 500 + vy;
    let vz = vy - b / 200;

    if (Math.pow(vx, 3) > 0.008856) {
        vx = Math.pow(vx, 3);
    } else {
        vx = (vx - 16 / 116) / 7.787;
    }

    if (Math.pow(vy, 3) > 0.008856) {
        vy = Math.pow(vy, 3);
    } else {
        vy = (vy - 16 / 116) / 7.787;
    }

    if (Math.pow(vz, 3) > 0.008856) {
        vz = Math.pow(vz, 3);
    } else {
        vz = (vz - 16 / 116) / 7.787;
    }

    return [
        vx * RefX,
        vy * RefY,
        vz * RefZ,
    ];
}
