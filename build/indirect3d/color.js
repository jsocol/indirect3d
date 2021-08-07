import { pack, unpack } from './utils';
export function XRGB(r, g, b) {
    return pack(100, r, g, b);
}
export function ARGB(a, r, g, b) {
    return pack(a, r, g, b);
}
export function I3DXAlphaBlend(bg, src) {
    const sa = src >>> 24;
    const ba = bg >>> 24;
    // src is transparent.
    if (sa == 0) {
        return bg;
    }
    // bg is transparent.
    if (ba == 0)
        return src;
    let [a0, r0, g0, b0] = unpack(bg);
    let [a1, r1, g1, b1] = unpack(src);
    a0 = a0 / 100;
    a1 = a1 / 100;
    let a = a0 + a1 - a0 * a1;
    const r = Math.round((r0 * a0 + r1 * (1 - a0) * a1) / a);
    const g = Math.round((g0 * a0 + g1 * (1 - a0) * a1) / a);
    const b = Math.round((b0 * a0 + b1 * (1 - a0) * a1) / a);
    a = Math.min(100, Math.round(a * 100));
    return pack(a, r, g, b);
}
//# sourceMappingURL=color.js.map