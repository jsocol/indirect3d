function log(msg) {
    if(typeof console != 'undefined') {
        console.log(msg);
    }
}

function pack(a, b, c, d) {
    return (a << 24) | (b << 16) | (c << 8) | d;
}

function unpack(x) {
    var a = (x & 0xff000000) >>> 24,
        b = (x & 0x00ff0000) >>> 16,
        c = (x & 0x0000ff00) >>> 8,
        d = (x & 0x000000ff);
    return [a, b, c, d];
}

function XRGB (r, g, b) {
    return pack(255, r, g, b);
}

function ARGB (a, r, g, b) {
    return pack(a, r, g, b);
}

function I3DXMatrix (m, n) {
    if (typeof n == 'undefined') {
        n = m;
    }
    this.m = m;
    this.n = n;
    this.data = new Float32Array(m*n);
    return this;
}

I3DXMatrix.prototype.idx = function(i, j) {
    return i * this.n + j;
}

I3DXMatrix.prototype.get = function(i, j) {
    return this.data[this.idx(i,j)];
}

I3DXMatrix.prototype.set = function(i, j, v) {
    return this.data[this.idx(i,j)] = v;
}

I3DXMatrix.prototype.incr = function(i, j, v) {
    return this.data[this.idx(i,j)] += v;
}

function I3DXVector (m) {
    return new I3DXMatrix(m, 1);
}

function I3DXVector3(x, y, z) {
    var v = I3DXVector(3);
    v.data[0] = x;
    v.data[1] = y;
    v.data[2] = z;
    return v;
}

function I3DXMatrixIdentity(m) {
    var id = new I3DXMatrix(m, m);
    for (var i=0; i<m; i++) {
        id.set(i, i, 1);
    }
    return id;
}

function I3DXVertex (x, y, z, color) {
    var c = I3DXVector(4);
    c.data[0] = x;
    c.data[1] = y;
    c.data[2] = z;
    c.data[3] = 1;
    this.coordinates = c;
    this.color = color;
}

function I3DXTranslateMatrix(x, y, z) {
    var m = I3DXMatrixIdentity(4);
    m.set(0, 3, x);
    m.set(1, 3, y);
    m.set(2, 3, z);
    return m;
}

function I3DXScaleMatrix(sx, sy, sz) {
    var m = I3DXMatrixIdentity(4);
    m.set(0, 0, sx);
    m.set(1, 1, sy);
    m.set(2, 2, sz);
    return m;
}

function I3DXToRadian(f) {
    return (f/180)*Math.PI;
}

function I3DXRotateXMatrix(theta) {
    var m = I3DXMatrixIdentity(4);
    m.set(1, 1, Math.cos(theta));
    m.set(1, 2, -Math.sin(theta));
    m.set(2, 1, Math.sin(theta));
    m.set(2, 2, Math.cos(theta));
    return m;
}

function I3DXRotateYMatrix(theta) {
    var m = I3DXMatrixIdentity(4),
        c = Math.cos(theta),
        s = Math.sin(theta);
    m.set(0, 0, c);
    m.set(0, 2, s);
    m.set(2, 0, -s);
    m.set(2, 2, c);
    return m;
}

function I3DXRotateZMatrix(theta) {
    var m = I3DXMatrixIdentity(4);
    m.set(0, 0, Math.cos(theta));
    m.set(0, 1, -Math.sin(theta));
    m.set(1, 0, Math.sin(theta));
    m.set(1, 1, Math.cos(theta));
    return m;
}

function I3DXMatrixTranspose(A) {
    var B = new I3DXMatrix(A.n, A.m);
    for (var i=0; i<A.m; i++) {
        for (var j=0; j<A.n; j++) {
            B.set(j, i, A.get(i, j));
        }
    }
    return B;
}

function I3DXMatrixMultiply(A, B) {
    if (A.n != B.m) {
        var Adim = '('+A.m+','+A.n+')',
            Bdim = '('+B.m+','+B.n+')';
        throw "Matrices must be multiplicable! " + Adim + ':' + Bdim;
    }
    var M = new I3DXMatrix(A.m, B.n);
    // Shortcut for 3x3 matrices.
    if (3 == A.m && 3 == A.n && 3 == B.m && 3 == B.n) {
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
    else if (4 == A.m && 4 == A.n && 4 == B.m && 4 == B.n) {
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
        for (var i=0; i<A.m; i++) {
            for (var j=0; j<B.n; j++) {
                var t = 0;
                for (var k=0; k<A.n; k++) {
                    t += A.get(i,k) * B.get(k,j);
                }
                M.set(i, j, t);
            }
        }
    }
    return M;
}

function I3DXMatrixAdd (A, B) {
    if ((A.m != B.m) || (A.n != B.n)) {
        throw "Matrices must be the same size!";
    }
    var M = new I3DXMatrix(A.m, A.n),
        l = A.m * A.n;
    for (var i=0; i<l; i++) {
        M.data[i] = A.data[i] + B.data[i];
    }
    return M;
}

function I3DXMatrixSubtract (A, B) {
    if (A.m != B.m || A.n != B.n)
        throw "Matrices must be the same size!";
    var M = new I3DXMatrix(A.m, A.n),
        l = A.m * A.n;
    for (var i=0; i<l; i++) {
        M.data[i] = A.data[i] - B.data[i];
    }
    return M;
}

function I3DXVectorCross (a, b) {
    var c = I3DXVector(3);
    c.data[0] = a.data[1]*b.data[2] - a.data[2]*b.data[1];
    c.data[1] = a.data[2]*b.data[0] - a.data[0]*b.data[2];
    c.data[2] = a.data[0]*b.data[1] - a.data[1]*b.data[0];
    return c;
}

function I3DXVectorDot (a, b) {
    if (a.m != b.m || a.n != b.n)
        throw "Vectors must be the same size!";
    var total = 0,
        l = a.m * a.n;
    for (var i=0; i<l; i++) {
        total += a.data[i] * b.data[i];
    }
    return total;
}

function I3DXVectorLength (a) {
    return Math.sqrt(I3DXVectorDot(a, a));
}

function I3DXMatrixScale (A, s) {
    var B = new I3DXMatrix(A.m, A.n),
        l = A.m * A.n;
    for (var i=0; i<l; i++) {
        B.data[i] = A.data[i] * s;
    }
    return B;
}

function I3DXVectorUnit (a) {
    return I3DXMatrixScale(a, 1/I3DXVectorLength(a));
}

function I3DXMatrixLookAtLH(pEye, pAt, pUp) {
    var vec = I3DXVector(3),
        right = I3DXVector(3),
        up = I3DXVector(3),
        matrix = I3DXMatrixIdentity(4);

    vec = I3DXVectorUnit(I3DXMatrixSubtract(pAt, pEye));
    right = I3DXVectorUnit(I3DXVectorCross(pUp, vec));
    up = I3DXVectorCross(vec, right);

    matrix.set(0, 0, right.data[0]);
    matrix.set(1, 0, right.data[1]);
    matrix.set(2, 0, right.data[2]);
    matrix.set(3, 0, -I3DXVectorDot(right, pEye));
    matrix.set(0, 1, up.data[0]);
    matrix.set(1, 1, up.data[1]);
    matrix.set(2, 1, up.data[2]);
    matrix.set(3, 1, -I3DXVectorDot(up, pEye));
    matrix.set(0, 2, vec.data[0]);
    matrix.set(1, 2, vec.data[1]);
    matrix.set(2, 2, vec.data[2]);
    matrix.set(3, 2, -I3DXVectorDot(vec, pEye));
    return matrix;
}

function I3DXMatrixPerspectiveFovLH (fovy, aspect, zn, zf) {
    var y = 1/Math.tan(fovy/2),
        x = y/aspect,
        matrix = new I3DXMatrix(4);

    matrix.set(0, 0, x);
    matrix.set(1, 1, y);
    matrix.set(2, 2, zf/(zf-zn));
    matrix.set(2, 3, 1);
    matrix.set(3, 2, -zn*zf/(zf-zn));
    return matrix;
}

function I3DXDevice(container, WIDTH, HEIGHT) {
    // Set up the canvas we'll use to draw.
    var canvas = document.createElement('canvas'),
        HWIDTH = WIDTH/2,
        HHEIGHT = HEIGHT/2;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    // Create an emtpy zbuffer.
    var bufferLength = WIDTH * HEIGHT;
        zbufferData = new Int32Array(bufferLength),
        zbufferDepth = new Float32Array(bufferLength);

    // Store our back buffer.
    var backBuffer = ctx.createImageData(WIDTH, HEIGHT);

    // Init our default transforms.
    var defaultView = I3DXMatrixLookAtLH(
            I3DXVector3(0.0, 0.0, 10.0),
            I3DXVector3(0.0, 0.0, 0.0),
            I3DXVector3(0.0, 1.0, 0.0)),
        defaultProjection = I3DXMatrixPerspectiveFovLH(
            I3DXToRadian(45),
            WIDTH/HEIGHT,
            1,
            100);
    var transforms = {
            'world': I3DXMatrixIdentity(4),
            'view': defaultView,
            'projection': defaultProjection
        },
        transformsCache = {
            'world': false,
            'view': false,
            'projection': false
        };

    this.SetTransform = function(type, matrix) {
        transforms[type] = matrix;
        transformsCache[type] = true;
    }

    function ZBufferSet(x, y, color, depth) {
        var idx = WIDTH * (y-1) + x,
            zdepth = zbufferDepth[idx],
            zcolor = zbufferData[idx],
            a, r, g, b,
            a, zr, zg, zb;
        depth = depth - 1;

        // Pixel is solid and closer.
        [za, zr, zg, zb] = unpack(zcolor);
        if ( za == 255 && zdepth < depth)
            return;

        // New pixel is solid.
        [a, r, g, b] = unpack(color);
        if ( a == 255 || za == 0 ) {
            zbufferData[idx] = color;
            zbufferDepth[idx] = depth;
            return;
        }

        // No solids, blend!
        zbufferData[idx] = AlphaBlend(zcolor, color);

        // Which was closer?
        if (depth < zdepth)
            zbufferDepth[idx] = depth;
    }

    function ZBufferClear() {
        zbufferData = new Int32Array(bufferLength),
        zbufferDepth = new Float32Array(bufferLength);
    }

    function AlphaBlend(bg, src) {
        var sa = src >>> 24,
            ba = bg >>> 24;

        // src is transparent.
        if ( sa == 0 )
            return bg;

        // bg is transparent.
        if ( ba == 0 )
            return src;

        var a0, r0, g0, b0,
            a1, r1, g1, b1;
        [a0, r0, g0, b0] = unpack(bg);
        [a1, r1, g1, b1] = unpack(src);
        a0 = a0/255; a1 = a1/255;
        var a = a0 + a1 - a0 * a1;
        var r = Math.round((r0 * a0 + r1 * (1 - a0) * a1)/a),
            g = Math.round((g0 * a0 + g1 * (1 - a0) * a1)/a),
            b = Math.round((b0 * a0 + b1 * (1 - a0) * a1)/a);
        a = Math.min(255, Math.round(a * 255));
        return pack(a, r, g, b);
    }



    /**
     * Right now this does nothing!
     */
    this.BeginScene = function () {
        ZBufferClear();
        backBuffer = ctx.createImageData(WIDTH, HEIGHT);
    }

    /**
     * Given a render mode and list of vertexes,
     * render the primitive into the zbuffer.
     */
    this.DrawPrimitive = function (mode, list) {
        var trans; // Will hold our final transform matrix.
        trans = I3DXMatrixMultiply(transforms[I3DTS_VIEW], transforms[I3DTS_PROJECTION]);
        trans = I3DXMatrixMultiply(transforms[I3DTS_WORLD], trans);

        switch(mode) {
            case I3DPT_POINTLIST:
                var m = list.length;
                for (var i=0; i<m; i++) {
                    var f = I3DXMatrixMultiply(trans, list[i].coordinates),
                        bx, by, bz;
                    bx = f.data[0]/f.data[3];
                    by = f.data[1]/f.data[3];
                    bz = f.data[2]/f.data[3];
                    // If in the field of view.
                    if ( Math.abs(bx) <= 1 &&
                         Math.abs(by) <= 1 &&
                         Math.abs(bz) <= 1 ) {
                        var sx = Math.round((1-bx) * HWIDTH),
                            sy = Math.round((1-by) * HHEIGHT);
                        ZBufferSet(sx, sy, list[i].color, bz);
                    }
                }
                break;
            case I3DPT_LINELIST:
                var m = list.length;
                for (var i=0; i<m-1; i++) {
                    var f0 = I3DXMatrixMultiply(trans, list[i].coordinates),
                        f1 = I3DXMatrixMultiply(trans, list[i+1].coordinates),
                        bx0, by0, bz0,
                        bx1, by1, bz1;
                    bx0 = f0.data[0]/f0.data[3];
                    by0 = f0.data[1]/f0.data[3];
                    bz0 = f0.data[2]/f0.data[3];
                    bx1 = f1.data[0]/f1.data[3];
                    by1 = f1.data[1]/f1.data[3];
                    bz1 = f1.data[2]/f1.data[3];

                    /**
                     * Given a distance along a line segment between
                     * 0 and 1, return the appropriate color.
                     */
                    var a0, r0, b0, g0,
                        a1, r1, b1, g1,
                        da, dr, dg, db;
                    [a0, r0, b0, g0] = unpack(list[i].color);
                    [a1, r1, b1, g1] = unpack(list[i+1].color);
                    da = a1 - a0;
                    dr = r1 - r0;
                    dg = g1 - g0;
                    db = b1 - b0;
                    function color (dist) {
                        var a = Math.round(da * dist + a0),
                            r = Math.round(dr * dist + r0),
                            g = Math.round(dg * dist + g0),
                            b = Math.round(db * dist + b0);
                        return pack(a, r, g, b);
                    }

                    /**
                     * Return a 3d, transformed, position.
                     */
                    var dx = bx1 - bx0,
                        dy = by1 - by0,
                        dz = bz1 - bz0;
                    function pos (dist) {
                        var x = dx * dist + bx0,
                            y = dy * dist + by0,
                            z = dz * dist + bz0;
                        return [x, y, z];
                    }

                    var sx0 = Math.round((1-bx0) * HWIDTH),
                        sx1 = Math.round((1-bx1) * HWIDTH);
                    var dsx = Math.abs(sx1 - sx0);
                    for (var j=0; j<=dsx; j++) {
                        var dist = j/dsx;
                        var x, y, z, c = color(dist);
                        [x, y, z] = pos(dist);
                        if ( Math.abs(x) < 1 &&
                             Math.abs(y) < 1 &&
                             Math.abs(z) < 1 ) {
                            var sx = Math.round((1 - x) * HWIDTH),
                                sy = Math.round((1 - y) * HHEIGHT);
                            ZBufferSet(sx, sy, c, z);
                        }
                    }
                    i++;
                }
                break;
            case I3DPT_LINESTRIP:
                var m = list.length;
                for (var i=0; i<m-1; i++) {
                    var f0 = I3DXMatrixMultiply(trans, list[i].coordinates),
                        f1 = I3DXMatrixMultiply(trans, list[i+1].coordinates),
                        bx0, by0, bz0,
                        bx1, by1, bz1;
                    bx0 = f0.data[0]/f0.data[3];
                    by0 = f0.data[1]/f0.data[3];
                    bz0 = f0.data[2]/f0.data[3];
                    bx1 = f1.data[0]/f1.data[3];
                    by1 = f1.data[1]/f1.data[3];
                    bz1 = f1.data[2]/f1.data[3];

                    /**
                     * Given a distance along a line segment between
                     * 0 and 1, return the appropriate color.
                     */
                    var a0, r0, b0, g0,
                        a1, r1, b1, g1,
                        da, dr, dg, db;
                    [a0, r0, b0, g0] = unpack(list[i].color);
                    [a1, r1, b1, g1] = unpack(list[i+1].color);
                    da = a1 - a0;
                    dr = r1 - r0;
                    dg = g1 - g0;
                    db = b1 - b0;
                    function color (dist) {
                        var a = Math.round(da * dist + a0),
                            r = Math.round(dr * dist + r0),
                            g = Math.round(dg * dist + g0),
                            b = Math.round(db * dist + b0);
                        return pack(a, r, g, b);
                    }

                    /**
                     * Return a 3d, transformed, position.
                     */
                    var dx = bx1 - bx0,
                        dy = by1 - by0,
                        dz = bz1 - bz0;
                    function pos (dist) {
                        var x = dx * dist + bx0,
                            y = dy * dist + by0,
                            z = dz * dist + bz0;
                        return [x, y, z];
                    }

                    var sx0 = Math.round((1 - bx0) * HWIDTH),
                        sx1 = Math.round((1 - bx1) * HWIDTH);
                    var dsx = Math.abs(sx1 - sx0);
                    for (var j=0; j<=dsx; j++) {
                        var dist = j/dsx;
                        var x, y, z, c = color(dist);
                        [x, y, z] = pos(dist);
                        if ( Math.abs(x) < 1 &&
                             Math.abs(y) < 1 &&
                             Math.abs(z) < 1 ) {
                            var sx = Math.round((1 - x) * HWIDTH),
                                sy = Math.round((1 - y) * HHEIGHT);
                            ZBufferSet(sx, sy, c, z);
                        }
                    }
                }
                break;
            case I3DPT_TRIANGLELIST:
                var m = list.length;
                for (var i=0; i<m-2; i++) {
                    var p = I3DXMatrixMultiply(trans, list[i].coordinates),
                        q = I3DXMatrixMultiply(trans, list[i+1].coordinates),
                        r = I3DXMatrixMultiply(trans, list[i+2].coordinates),
                        P, R, Q, N;
                    P = I3DXVector3(p.data[0]/p.data[3],
                                    p.data[1]/p.data[3],
                                    p.data[2]/p.data[3]);
                    Q = I3DXVector3(q.data[0]/q.data[3],
                                    q.data[1]/q.data[3],
                                    q.data[2]/q.data[3]);
                    R = I3DXVector3(r.data[0]/r.data[3],
                                    r.data[1]/r.data[3],
                                    r.data[2]/r.data[3]);

                    N = I3DXVectorCross(I3DXMatrixSubtract(Q, P),
                                        I3DXMatrixSubtract(R, P));

                    /**
                     * A 3D, transformed, position. NOT a screen position.
                     */
                    function pos(dist, A, B) {
                        var x = (B.data[0] - A.data[0]) * dist + A.data[0],
                            y = (B.data[1] - A.data[1]) * dist + A.data[1],
                            z = (B.data[2] - A.data[2]) * dist + A.data[2];
                        return [x, y, z];
                    }

                    function color(dist, c0, c1) {
                        var a0, r0, g0, b0,
                            a1, r1, g1, b1;
                        [a0, r0, g0, b0] = unpack(c0);
                        [a1, r1, g1, b1] = unpack(c1);
                        var a = Math.round((a1 - a0) * dist + a0),
                            r = Math.round((r1 - r0) * dist + r0),
                            g = Math.gound((g1 - g0) * dist + g0),
                            b = Math.bound((b1 - b0) * dist + b0);
                        return pack(a, r, g, b);
                    }

                    var Tp, Bp, Lp, Rp, dx, dy
                        Psx = Math.round((1 - P.data[0]) * HWIDTH),
                        Psy = Math.round((1 - P.data[1]) * HHEIGHT),
                        Qsx = Math.round((1 - Q.data[0]) * HWIDTH),
                        Qsy = Math.round((1 - Q.data[1]) * HHEIGHT),
                        Rsx = Math.round((1 - R.data[0]) * HWIDTH),
                        Rsy = Math.round((1 - R.data[1]) * HHEIGHT);
                    Tp = Math.min(Psy, Qsy, Rsy);
                    Bp = Math.max(Psy, Qsy, Rsy);
                    Lp = Math.min(Psx, Qsx, Rsx);
                    Rp = Math.max(Psx, Qsx, Rsx);
                    dx = Bp - Tp;
                    dy = Rp - Lp;

                    function sq (i) {
                        return i*i;
                    }

                    var Pa, Pr, Pg, Pb,
                        Qa, Qr, Qg, Qb,
                        Ra, Rr, Rg, Rb;
                    [Pa, Pr, Pg, Pb] = unpack(list[i].color);
                    [Qa, Qr, Qg, Qb] = unpack(list[i+1].color);
                    [Ra, Rr, Rg, Rb] = unpack(list[i+2].color);

                    for (var y=Tp; y<=Bp && y<=HEIGHT; y++) {
                        for (var x=Lp; x<=Rp && x<=WIDTH; x++) {
                            var pq = (y > ((Qsy-Psy)/(Qsx-Psx) * (x-Psx) + Psy)),
                                pr = (y < ((Rsy-Psy)/(Rsx-Psx) * (x-Psx) + Psy)),
                                qr = (y > ((Rsy-Qsy)/(Rsx-Qsx) * (x-Qsx) + Qsy));
                            if (pq && pr && qr) {

                                var dP = Math.sqrt(sq(x - Psx) + sq(y - Psy)),
                                    dQ = Math.sqrt(sq(x - Qsx) + sq(y - Qsy)),
                                    dR = Math.sqrt(sq(x - Rsx) + sq(y - Rsy)),
                                    dSum;
                                dSum = dP + dQ + dR;
                                var a = Math.round(Pa * dP + Qa * dQ + Ra * dR)/dSum,
                                    r = Math.round(Pr * dP + Qr * dQ + Rr * dR)/dSum,
                                    g = Math.round(Pg * dP + Qg * dQ + Rg * dR)/dSum,
                                    b = Math.round(Pb * dP + Qb * dQ + Rb * dR)/dSum;
                                ZBufferSet(x, y, pack(a, r, g, b), 0);
                            }
                        }
                    }

                }
                break;
        }
    }

    /**
     * Draw data from the zbuffer into the back buffer.
     */
    this.EndScene = function() {
        var a, r, g, b, max = bufferLength * 4;
        for (var i=0; i<max;) {
            [a, r, g, b] = unpack(zbufferData[i/4]);
            backBuffer.data[i++] = r;
            backBuffer.data[i++] = g;
            backBuffer.data[i++] = b;
            backBuffer.data[i++] = a;
        }
    }

    /**
     * Move the back buffer into the front and present the
     * scene.
     */
    this.Present = function() {
        ctx.putImageData(backBuffer, 0, 0);
    }
}

var I3DTS_WORLD = 'world',
    I3DTS_VIEW = 'view',
    I3DTS_PROJECTION = 'projection';

var I3DPT_POINTLIST = 1,
    I3DPT_LINELIST = 2,
    I3DPT_LINESTRIP = 3,
    I3DPT_TRIANGLELIST = 4,
    I3DPT_TRIANGLESTRIP = 5,
    I3DPT_TRIANGLEFAN = 6;
