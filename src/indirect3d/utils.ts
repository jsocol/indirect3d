import {I3DColor} from "./color";

export function clamp(v: number, lo: number, hi: number): number {
    return Math.max(Math.min(v, hi), lo);
}

export function pack(a: number, b: number, c: number, d: number): number {
    return (clamp(a, 0, 255) << 24) | (clamp(b, 0, 255) << 16) | (clamp(c, 0, 255) << 8) | clamp(d, 0, 255);
}

export function unpack(x: number): I3DColor {
    const a = (x & 0xff000000) >>> 24,
          r = (x & 0x00ff0000) >>> 16,
          g = (x & 0x0000ff00) >>> 8,
          b = (x & 0x000000ff);
    return {a, r, g, b};
}

export function sqr(i: number): number {
    return i * i;
}
