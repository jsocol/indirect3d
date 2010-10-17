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

function I3DXMatrix (m, n) {
    if (typeof n == 'undefined') {
        n = m;
    }
    var mat = [];
    for (var i=0; i<m; i++) {
        mat[i] = new Float32Array(n);
    }
    return mat;
}

function I3DXVector (m) {
    return I3DXMatrix(m, 1);
}

function I3DXVector3(x, y, z) {
    var v = I3DXVector(3);
    v[0][0] = x;
    v[1][0] = y;
    v[2][0] = z;
    return v;
}

function I3DXMatrixIdentity(m) {
    var id = I3DXMatrix(m, m);
    for (var i=0; i<m; i++) {
        id[i][i] = 1;
    }
    return id;
}

function I3DXMatrixDimensions (A) {
    return [A.length, A[0].length];
}

function I3DXVertex (x, y, z, color) {
    var c = I3DXVector(4);
    c[0][0] = x;
    c[1][0] = y;
    c[2][0] = z;
    c[3][0] = 1;
    this.coordinates = c;
    this.color = color;
}

function XRGB (r, g, b) {
    return pack(255, r, g, b);
}

function ARGB (a, r, g, b) {
    return pack(a, r, g, b);
}

function I3DXTranslateMatrix(x, y, z) {
    var v1 = Float32Array(4),
        v2 = Float32Array(4),
        v3 = Float32Array(4),
        v4 = Float32Array(4);
    v1[0] = 1; v1[1] = 0; v1[2] = 0; v1[3] = x;
    v2[0] = 0; v2[1] = 1; v2[2] = 0; v2[3] = y;
    v3[0] = 0; v3[1] = 0; v3[2] = 1; v3[3] = z;
    v4[0] = 0; v4[1] = 0; v4[2] = 0; v4[3] = 1;
    return [v1, v2, v3, v4];
}

function I3DXScaleMatrix(sx, sy, sz) {
    var v1 = Float32Array(4),
        v2 = Float32Array(4),
        v3 = Float32Array(4),
        v4 = Float32Array(4);
    v1[0] = sx; v1[1] = 0; v1[2] = 0; v1[3] = 0;
    v2[0] = 0; v2[1] = sy; v2[2] = 0; v2[3] = 0;
    v3[0] = 0; v3[1] = 0; v3[2] = sz; v3[3] = 0;
    v4[0] = 0; v4[1] = 0; v4[2] = 0; v4[3] = 1;
    return [v1, v2, v3, v4];
}

function I3DXToRadian(f) {
    return (f/180)*Math.PI;
}

function I3DXRotateXMatrix(theta) {
    var v1 = Float32Array(4),
        v2 = Float32Array(4),
        v3 = Float32Array(4),
        v4 = Float32Array(4);
    v1[0] = 1; v1[1] = 0; v1[2] = 0; v1[3] = 0;
    v2[0] = 0; v2[1] = Math.cos(theta); v2[2] = -Math.sin(theta); v2[3] = 0;
    v3[0] = 0; v3[1] = Math.sin(theta); v3[2] = Math.cos(theta); v3[3] = 0;
    v4[0] = 0; v4[1] = 0; v4[2] = 0; v4[3] = 1;
    return [v1, v2, v3, v4];
}

function I3DXRotateYMatrix(theta) {
    var v1 = Float32Array(4),
        v2 = Float32Array(4),
        v3 = Float32Array(4),
        v4 = Float32Array(4);
    v1[0] = Math.cos(theta);
    v1[1] = 0;
    v1[2] = Math.sin(theta);
    v1[3] = 0;
    v2[0] = 0;
    v2[1] = 1;
    v2[2] = 0;
    v2[3] = 0;
    v3[0] = -Math.sin(theta);
    v3[1] = 0;
    v3[2] = Math.cos(theta);
    v3[3] = 0;
    v4[0] = 0;
    v4[1] = 0;
    v4[2] = 0;
    v4[3] = 1;
    return [v1, v2, v3, v4];
}

function I3DXRotateZMatrix(theta) {
    var v1 = Float32Array(4),
        v2 = Float32Array(4),
        v3 = Float32Array(4),
        v4 = Float32Array(4);
    v1[0] = Math.cos(theta); v1[1] = -Math.sin(theta); v1[2] = 0; v1[3] = 0;
    v2[0] = Math.sin(theta); v2[1] = Math.cos(theta); v2[2] = 0; v2[3] = 0;
    v3[0] = 0; v3[1] = 0; v3[2] = 1; v3[3] = 0;
    v4[0] = 0; v4[1] = 0; v4[2] = 0; v4[3] = 1;
    return [v1, v2, v3, v4];
}

function I3DXMatrixTranspose(A) {
    var B = [],
        m = A.length, n = A[0].length;
    for (var i=0; i<n; i++) {
        B[i] = Float32Array(m);
        for (var j=0; j<m; j++) {
            B[i][j] = A[j][i];
        }
    }
    return B;
}

function I3DXMatrixMultiply(A, B) {
    var v = [],
        m = A.length, n = A[0].length, np = B.length, p = B[0].length;
    if (n != np)
        throw "Arrays must be multiplicable!";
    for (var i=0; i<m; i++) {
        v[i] = Float32Array(p);
        for (var j=0; j<p; j++) {
            for (var k=0; k<n; k++) {
                v[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return v;
}

function I3DXMatrixAdd (A, B) {
    var m = A.length, n = A[0].length,
        C = I3DXMatrix(m, n);
    for (var i=0; i<m; i++) {
        for (var j=0; j<n; j++) {
            C[i][j] = A[i][j] + B[i][j];
        }
    }
    return C;
}

function I3DXMatrixSubtract (A, B) {
    var m = A.length, n = A[0].length,
        C = I3DXMatrix(m, n);
    for (var i=0; i<m; i++) {
        for (var j=0; j<n; j++) {
            C[i][j] = A[i][j] - B[i][j];
        }
    }
    return C;
}

function I3DXVectorCross (a, b) {
    var c = I3DXVector(3);
    c[0][0] = a[1][0]*b[2][0] - a[2][0]*b[1][0];
    c[1][0] = a[2][0]*b[0][0] - a[0][0]*b[2][0];
    c[2][0] = a[0][0]*b[1][0] - a[1][0]*b[0][0];
    return c;
}

function I3DXVectorDot (a, b) {
    var total = 0,
        m = a.length;
    for (var i=0; i<m; i++) {
        total += a[i][0]*b[i][0];
    }
    return total;
}

function I3DXVectorLength (a) {
    return Math.sqrt(I3DXVectorDot(a, a));
}

function I3DXMatrixScale (A, s) {
    var m, n;
    [m, n] = I3DXMatrixDimensions(A);
    var B = I3DXMatrix(m, n);
    for (var i=0; i<m; i++) {
        for (var j=0; j<n; j++) {
            B[i][j] = s*A[i][j];
        }
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

    matrix[0][0] = right[0][0];
    matrix[1][0] = right[1][0];
    matrix[2][0] = right[2][0];
    matrix[3][0] = -I3DXVectorDot(right, pEye);
    matrix[0][1] = up[0][0];
    matrix[1][1] = up[1][0];
    matrix[2][1] = up[2][0];
    matrix[3][1] = -I3DXVectorDot(up, pEye);
    matrix[0][2] = vec[0][0];
    matrix[1][2] = vec[1][0];
    matrix[2][2] = vec[2][0];
    matrix[3][2] = -I3DXVectorDot(vec, pEye);
    matrix[3][3] = 1;
    return matrix;
}

function I3DXMatrixLookAtRH(pEye, pAt, pUp) {
    var vec = I3DXVector(3),
        right = I3DXVector(3),
        up = I3DXVector(3),
        matrix = I3DXMatrixIdentity(4);

    vec = I3DXVectorUnit(I3DXMatrixSubtract(pEye, pAt));
    right = I3DXVectorUnit(I3DXVectorCross(pUp, vec));
    up = I3DXVectorCross(vec, right);

    matrix[0][0] = right[0][0];
    matrix[1][0] = right[1][0];
    matrix[2][0] = right[2][0];
    matrix[3][0] = -I3DXVectorDot(right, pEye);
    matrix[0][1] = up[0][0];
    matrix[1][1] = up[1][0];
    matrix[2][1] = up[2][0];
    matrix[3][1] = -I3DXVectorDot(up, pEye);
    matrix[0][2] = vec[0][0];
    matrix[1][2] = vec[1][0];
    matrix[2][2] = vec[2][0];
    matrix[3][2] = -I3DXVectorDot(vec, pEye);
    matrix[3][3] = 1;
    return matrix;
}

function I3DXMatrixPerspectiveFovLH (fovy, aspect, zn, zf) {
    var y = 1/Math.tan(fovy/2),
        x = y/aspect,
        matrix = I3DXMatrix(4);

    matrix[0][0] = x;
    matrix[1][1] = y;
    matrix[2][2] = zf/(zf-zn);
    matrix[2][3] = 1;
    matrix[3][2] = -zn*zf/(zf-zn);
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
        zbufferData = Int32Array(bufferLength),
        zbufferDepth = Float32Array(bufferLength);
    }

    function AlphaBlend(bg, src) {
        var sa = src >>> 24;

        // src is transparent.
        if ( sa == 0)
            return bg;

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
                    bx = f[0][0]/f[3][0];
                    by = f[1][0]/f[3][0];
                    bz = f[2][0]/f[3][0];
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
                    bx0 = f0[0][0]/f0[3][0];
                    by0 = f0[1][0]/f0[3][0];
                    bz0 = f0[2][0]/f0[3][0];
                    bx1 = f1[0][0]/f1[3][0];
                    by1 = f1[1][0]/f1[3][0];
                    bz1 = f1[2][0]/f1[3][0];

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
                    bx0 = f0[0][0]/f0[3][0];
                    by0 = f0[1][0]/f0[3][0];
                    bz0 = f0[2][0]/f0[3][0];
                    bx1 = f1[0][0]/f1[3][0];
                    by1 = f1[1][0]/f1[3][0];
                    bz1 = f1[2][0]/f1[3][0];

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
