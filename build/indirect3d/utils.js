export function pack(a, b, c, d) {
    return (a << 24) | (b << 16) | (c << 8) | d;
}
export function unpack(x) {
    var a = (x & 0xff000000) >>> 24, b = (x & 0x00ff0000) >>> 16, c = (x & 0x0000ff00) >>> 8, d = (x & 0x000000ff);
    return [a, b, c, d];
}
export function sqr(i) {
    return i * i;
}
//# sourceMappingURL=utils.js.map