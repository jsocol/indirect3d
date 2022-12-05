import {I3DColor} from "./color";

function clamp(v: number, lo: number = 0, hi: number = 0xff): number {
    return Math.max(Math.min(Math.round(v * 0xff), hi), lo);
}

export function pack(color: I3DColor): number {
    return (clamp(color.a) << 24) | (clamp(color.r) << 16) | (clamp(color.g) << 8) | clamp(color.b);
}

export const UNPACK_INT = 'int';
export const UNPACK_FLOAT = 'float';

type UnpackMode = typeof UNPACK_INT | typeof UNPACK_FLOAT;

export function unpack(x: number, mode: UnpackMode = UNPACK_FLOAT): I3DColor {
    const divisor = mode == UNPACK_INT ? 1 : 0xff;
    const a = ((x & 0xff000000) >>> 24) / divisor,
          r = ((x & 0x00ff0000) >>> 16) / divisor,
          g = ((x & 0x0000ff00) >>> 8) / divisor,
          b = (x & 0x000000ff) / divisor;
    return {a, r, g, b};
}

export function sqr(i: number): number {
    return i * i;
}
