export class I3DXMatrix {
    rows: number;
    cols: number;
    data: Float32Array;

    constructor(rows: number, cols: number, data?: number[]) {
        if (typeof cols == 'undefined') {
            cols = rows;
        }
        this.rows = rows; // m
        this.cols = cols; // n
        if (data) {
            if (data.length !== rows * cols) {
                throw new Error("data does not match matrix dimension");
            }
            this.data = Float32Array.from(data);
        } else {
            this.data = new Float32Array(rows * cols);
        }
    }

    _idx(i: number, j: number): number {
        return i * this.cols + j;
    }

    get(i: number, j: number): number {
        return this.data[this._idx(i, j)];
    }

    set(i: number, j: number, value: number) {
        this.data[this._idx(i, j)] = value;
    }

    incr(i: number, j: number, value: number) {
        this.data[this._idx(i, j)] += value;
    }

    debug() {
        const rows: number[][] = [];
        for (let i = 0; i < this.rows; i++) {
            rows.push([]);
            for (let j = 0; j < this.cols; j++) {
                rows[i].push(this.get(i, j));
            }
        }
        console.table(rows);
    }
}

export function I3DXMatrixIdentity(size: number): I3DXMatrix {
    const id = new I3DXMatrix(size, size);
    for (let i=0; i<size; i++) {
        id.set(i, i, 1);
    }
    return id;
}

export function I3DXTranslateMatrix(x: number, y: number, z: number): I3DXMatrix {
    const m = I3DXMatrixIdentity(4);
    m.set(0, 3, x);
    m.set(1, 3, y);
    m.set(2, 3, z);
    return m;
}

export function I3DXScaleMatrix(sx: number, sy: number, sz: number): I3DXMatrix {
    const m = I3DXMatrixIdentity(4);
    m.set(0, 0, sx);
    m.set(1, 1, sy);
    m.set(2, 2, sz);
    return m;
}

export type Radians = number;
export type Degrees = number;

export function I3DXToRadian(f: Degrees): Radians {
    return (f/180)*Math.PI;
}

export function I3DXRotateXMatrix(theta: Radians): I3DXMatrix {
    const m = I3DXMatrixIdentity(4);
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    m.set(1, 1, c);
    m.set(1, 2, -s);
    m.set(2, 1, s);
    m.set(2, 2, c);
    return m;
}

export function I3DXRotateYMatrix(theta: Radians): I3DXMatrix {
    const m = I3DXMatrixIdentity(4);
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    m.set(0, 0, c);
    m.set(0, 2, s);
    m.set(2, 0, -s);
    m.set(2, 2, c);
    return m;
}

export function I3DXRotateZMatrix(theta: Radians): I3DXMatrix {
    const m = I3DXMatrixIdentity(4);
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    m.set(0, 0, c);
    m.set(0, 1, -s);
    m.set(1, 0, s);
    m.set(1, 1, c);
    return m;
}

export function I3DXMatrixTranspose(A: I3DXMatrix): I3DXMatrix {
    const B = new I3DXMatrix(A.cols, A.rows);
    for (let i=0; i<A.rows; i++) {
        for (let j=0; j<A.cols; j++) {
            B.set(j, i, A.get(i, j));
        }
    }
    return B;
}

export function I3DXMatrixMultiply(A: I3DXMatrix, B: I3DXMatrix): I3DXMatrix {
    if (A.cols !== B.rows) {
        const Adim = `(${A.rows},${A.cols})`;
        const Bdim = `(${B.rows},${B.cols})`;
        throw new Error(`Matrices must be multiplicable! ${Adim}:${Bdim}`);
    }
    const M = new I3DXMatrix(A.rows, B.cols);
    // Shortcut for 3x3 matrices.
    if (3 === A.rows && 3 === A.cols && 3 === B.rows && 3 === B.cols) {
        M.data[0] = A.data[0] * B.data[0] + A.data[1] * B.data[3] + A.data[2] * B.data[6];
        M.data[1] = A.data[0] * B.data[1] + A.data[1] * B.data[4] + A.data[2] * B.data[7];
        M.data[2] = A.data[0] * B.data[2] + A.data[1] * B.data[5] + A.data[2] * B.data[8];
        M.data[3] = A.data[3] * B.data[0] + A.data[4] * B.data[3] + A.data[5] * B.data[6];
        M.data[4] = A.data[3] * B.data[1] + A.data[4] * B.data[4] + A.data[5] * B.data[7];
        M.data[5] = A.data[3] * B.data[2] + A.data[4] * B.data[5] + A.data[5] * B.data[8];
        M.data[6] = A.data[6] * B.data[0] + A.data[7] * B.data[3] + A.data[8] * B.data[6];
        M.data[7] = A.data[6] * B.data[1] + A.data[7] * B.data[4] + A.data[8] * B.data[7];
        M.data[8] = A.data[6] * B.data[2] + A.data[7] * B.data[5] + A.data[8] * B.data[8];
    }
    // Shortcut for 4x4
    else if (4 === A.rows && 4 === A.cols && 4 === B.rows && 4 === B.cols) {
        M.data[0] = A.data[0] * B.data[0] + A.data[1] * B.data[4] + A.data[2] * B.data[8] + A.data[3] * B.data[12];
        M.data[1] = A.data[0] * B.data[1] + A.data[1] * B.data[5] + A.data[2] * B.data[9] + A.data[3] * B.data[13];
        M.data[2] = A.data[0] * B.data[2] + A.data[1] * B.data[6] + A.data[2] * B.data[10] + A.data[3] * B.data[14];
        M.data[3] = A.data[0] * B.data[3] + A.data[1] * B.data[7] + A.data[2] * B.data[11] + A.data[3] * B.data[15];
        M.data[4] = A.data[4] * B.data[0] + A.data[5] * B.data[4] + A.data[6] * B.data[8] + A.data[7] * B.data[12];
        M.data[5] = A.data[4] * B.data[1] + A.data[5] * B.data[5] + A.data[6] * B.data[9] + A.data[7] * B.data[13];
        M.data[6] = A.data[4] * B.data[2] + A.data[5] * B.data[6] + A.data[6] * B.data[10] + A.data[7] * B.data[14];
        M.data[7] = A.data[4] * B.data[3] + A.data[5] * B.data[7] + A.data[6] * B.data[11] + A.data[7] * B.data[15];
        M.data[8] = A.data[8] * B.data[0] + A.data[9] * B.data[4] + A.data[10] * B.data[8] + A.data[11] * B.data[12];
        M.data[9] = A.data[8] * B.data[1] + A.data[9] * B.data[5] + A.data[10] * B.data[9] + A.data[11] * B.data[13];
        M.data[10] = A.data[8] * B.data[2] + A.data[9] * B.data[6] + A.data[10] * B.data[10] + A.data[11] * B.data[14];
        M.data[11] = A.data[8] * B.data[3] + A.data[9] * B.data[7] + A.data[10] * B.data[11] + A.data[11] * B.data[15];
        M.data[12] = A.data[12] * B.data[0] + A.data[13] * B.data[4] + A.data[14] * B.data[8] + A.data[15] * B.data[12];
        M.data[13] = A.data[12] * B.data[1] + A.data[13] * B.data[5] + A.data[14] * B.data[9] + A.data[15] * B.data[13];
        M.data[14] = A.data[12] * B.data[2] + A.data[13] * B.data[6] + A.data[14] * B.data[10] + A.data[15] * B.data[14];
        M.data[15] = A.data[12] * B.data[3] + A.data[13] * B.data[7] + A.data[14] * B.data[11] + A.data[15] * B.data[15];
    }
    // Multiply anything.
    else {
        for (let i = 0; i < A.rows; i++) {
            for (let j = 0; j < B.cols; j++) {
                let t = 0;
                for (let k = 0; k < A.cols; k++) {
                    t += A.get(i, k) * B.get(k, j);
                }
                M.set(i, j, t);
            }
        }
    }
    return M;
}

export function I3DXMatrixAdd(A: I3DXMatrix, B: I3DXMatrix): I3DXMatrix {
    if ((A.rows !== B.rows) || (A.cols !== B.cols)) {
        throw new Error("Matrices must be the same size!");
    }
    const M = new I3DXMatrix(A.rows, A.cols);
    const l = A.rows * A.cols;
    for (let i = 0; i < l; i++) {
        M.data[i] = A.data[i] + B.data[i];
    }
    return M;
}

export function I3DXMatrixSubtract(A: I3DXMatrix, B: I3DXMatrix): I3DXMatrix {
    if (A.rows !== B.rows || A.cols !== B.cols) {
        throw new Error("Matrices must be the same size!");
    }
    const M = new I3DXMatrix(A.rows, A.cols);
    const l = A.rows * A.cols;
    for (let i = 0; i < l; i++) {
        M.data[i] = A.data[i] - B.data[i];
    }
    return M;
}

export function I3DXMatrixScale(A: I3DXMatrix, s: number): I3DXMatrix {
    const B = new I3DXMatrix(A.rows, A.cols);
    const l = A.rows * A.cols;
    for (let i = 0; i < l; i++) {
        B.data[i] = A.data[i] * s;
    }
    return B;
}

export class I3DXVec extends I3DXMatrix {
    constructor(rows: number, cols: number, data?: number[]) {
        super(rows, cols, data);
    }

    get x(): number {
        return this.data[0];
    }

    set x(value: number) {
        this.data[0] = value;
    }

    get y(): number {
        return this.data[1];
    }

    set y(value: number) {
        this.data[1] = value;
    }

    get z(): number {
        return this.data[2];
    }

    set z(value: number) {
        this.data[2] = value;
    }

    get w(): number {
        return this.data[3];
    }

    set w(value: number) {
        this.data[3] = value;
    }
}

export function I3DXVector(m: number, data?: number[]): I3DXVec {
    return new I3DXVec(m, 1, data);
}

export function I3DXVector3(x: number, y: number, z: number): I3DXVec {
    const v = I3DXVector(3, [x, y, z]);
    return v;
}

export function I3DXVectorCross(a: I3DXVec, b: I3DXVec): I3DXVec {
    const c = I3DXVector(3);
    c.x = a.data[1]*b.data[2] - a.data[2]*b.data[1];
    c.y = a.data[2]*b.data[0] - a.data[0]*b.data[2];
    c.z = a.data[0]*b.data[1] - a.data[1]*b.data[0];
    return c;
}

export function I3DXVectorDot(a: I3DXVec, b: I3DXVec): number {
    if (a.rows !== b.rows || a.cols !== b.cols) {
        throw new Error("Vectors must be the same size!");
    }
    let total = 0;
    const l = a.rows * a.cols;
    for (let i = 0; i < l; i++) {
        total += a.data[i] * b.data[i];
    }
    return total;
}

export function I3DXVectorLength(a: I3DXVec): number {
    return Math.sqrt(I3DXVectorDot(a, a));
}

export function I3DXVectorUnit(a: I3DXVec): I3DXVec {
    return I3DXMatrixScale(a, 1 / I3DXVectorLength(a)) as I3DXVec;
}
