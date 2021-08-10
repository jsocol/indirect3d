export declare class I3DXMatrix {
    rows: number;
    cols: number;
    data: Float32Array;
    constructor(rows: number, cols: number, data?: number[]);
    _idx(i: number, j: number): number;
    get(i: number, j: number): number;
    set(i: number, j: number, value: number): void;
    incr(i: number, j: number, value: number): void;
    debug(): void;
}
export declare function I3DXMatrixIdentity(size: number): I3DXMatrix;
export declare function I3DXTranslateMatrix(x: number, y: number, z: number): I3DXMatrix;
export declare function I3DXScaleMatrix(sx: number, sy: number, sz: number): I3DXMatrix;
export declare type Radians = number;
export declare type Degrees = number;
export declare function I3DXToRadian(f: Degrees): Radians;
export declare function I3DXRotateXMatrix(theta: Radians): I3DXMatrix;
export declare function I3DXRotateYMatrix(theta: Radians): I3DXMatrix;
export declare function I3DXRotateZMatrix(theta: Radians): I3DXMatrix;
export declare function I3DXMatrixTranspose(A: I3DXMatrix): I3DXMatrix;
export declare function I3DXMatrixMultiply(A: I3DXMatrix, B: I3DXMatrix): I3DXMatrix;
export declare function I3DXMatrixAdd(A: I3DXMatrix, B: I3DXMatrix): I3DXMatrix;
export declare function I3DXMatrixSubtract(A: I3DXMatrix, B: I3DXMatrix): I3DXMatrix;
export declare function I3DXMatrixScale(A: I3DXMatrix, s: number): I3DXMatrix;
export declare class I3DXVec extends I3DXMatrix {
    constructor(rows: number, cols: number, data?: number[]);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get w(): number;
    set w(value: number);
    toVec3(): I3DXVec;
}
export declare function I3DXVector(m: number, data?: number[]): I3DXVec;
export declare function I3DXVector3(x: number, y: number, z: number): I3DXVec;
export declare function I3DXVectorCross(a: I3DXVec, b: I3DXVec): I3DXVec;
export declare function I3DXVectorDot(a: I3DXVec, b: I3DXVec): number;
export declare function I3DXVectorLength(a: I3DXVec): number;
export declare function I3DXVectorUnit(a: I3DXVec): I3DXVec;
//# sourceMappingURL=matrix.d.ts.map