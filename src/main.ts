import {
    I3DXVertex,
    I3DXMatrixIdentity,
    I3DXTranslateMatrix,
    I3DXMatrixLookAtLH,
    I3DXVector3,
    I3DXMatrixPerspectiveFovLH,
    I3DXToRadian,
    I3DXDevice,
    I3DTS_VIEW,
    I3DTS_PROJECTION,
    I3DTS_WORLD,
    I3DXRotateYMatrix,
    I3DXMatrixAdd,
    I3DXMatrixMultiply,
    I3DPT_TRIANGLELIST,
    I3DPT_LINELIST,
    I3DPT_LINESTRIP,
    ARGB,
} from './indirect3d';

(function main() {
    var WIDTH = 640,
        HEIGHT = 480;
    var container = document.getElementById('indirect-container')!;

    var fixedTriangle = [
            new I3DXVertex(2.5, -3.0, 0.0, ARGB(0xff,0,0,0xff)),
            new I3DXVertex(0.0, 3.0, 0.0, ARGB(0xff,0,0xff,0)),
            new I3DXVertex(-2.5, -3.0, 0.0, ARGB(0xff,0xff,0,0)),
            new I3DXVertex(2.5, -3.0, 0.0, ARGB(0xff,0,0,0xff)),
            //new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x80,0,0,0xff))
        ];
    var movingTriangle = [
            new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x40,0,0,0xff)),
            new I3DXVertex(0.0, 3.0, 0.0, ARGB(0x40,0,0,0xff)),
            new I3DXVertex(-2.5, -3.0, 0.0, ARGB(0x40,0,0,0xff)),
            //new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x80,0,0,0xff))
        ];
        // zAxis = [
        //     new I3DXVertex(0, 0, 1000, XRGB(0, 0xff, 0)),
        //     new I3DXVertex(0, 0, -1000, XRGB(0, 0xff, 0))
        // ];


    var id = I3DXMatrixIdentity(4),
        tmat = I3DXTranslateMatrix(0, 0, -10);

    var matView = I3DXMatrixLookAtLH(
            I3DXVector3(0.0, 0.0, 30.0), // the camera position
            I3DXVector3(0, 0, 0), // the "look-at" position
            I3DXVector3(0, 1, 0)), // the "up" direction
        matProj = I3DXMatrixPerspectiveFovLH(
            I3DXToRadian(45), // the horizontal field of view
            WIDTH / HEIGHT, // aspect ratio
            1.0, // near view-plane
            100.0); // far view-plane

    // matProj.debug();

    let i3d = new I3DXDevice(container, WIDTH, HEIGHT);
    let idx = 0;

    i3d.SetTransform(I3DTS_VIEW, matView);
    i3d.SetTransform(I3DTS_PROJECTION, matProj);
    i3d.SetTransform(I3DTS_WORLD, id);

    let isPlaying = false;
    let lastFrameEnd: number;
    function play() {
        console.time('frame');
        i3d.BeginScene();
        var rot = I3DXRotateYMatrix(idx);
        var rev = I3DXRotateYMatrix(-idx);

        var left = I3DXTranslateMatrix(0, 0, 150);

        i3d.SetTransform(I3DTS_WORLD, I3DXMatrixAdd(I3DXMatrixMultiply(rot, id), left));
        i3d.DrawPrimitive(I3DPT_TRIANGLELIST, movingTriangle);
        i3d.SetTransform(I3DTS_WORLD, I3DXMatrixMultiply(rev, id));
        i3d.DrawPrimitive(I3DPT_TRIANGLELIST, fixedTriangle);
        i3d.EndScene();
        i3d.Present();

        console.timeEnd('frame');
        const now = Date.now();
        const dt = now - lastFrameEnd;
        idx += 0.005 * dt;
        if (isPlaying) {
            requestAnimationFrame(play);
        }
        lastFrameEnd = now;
    }

    window.addEventListener('keyup', function(e) {
        if(e.keyCode == 27) { // Escape
            isPlaying = false;
            console.log("Stop animation.");
        }
        else if (e.keyCode == 13) {
            isPlaying = true;
            lastFrameEnd = Date.now();
            console.log("Start animation.");
            requestAnimationFrame(play);
        }
        e.preventDefault();
        return false;
    }, true);
    console.log("Construct scene", new Date());
    i3d.BeginScene();
    i3d.DrawPrimitive(I3DPT_TRIANGLELIST, fixedTriangle);
    i3d.EndScene();
    i3d.Present();
    console.log("End Construct scene", new Date());
})();

import { XRGB, ColorToLab, LabToColor } from './indirect3d/color';

const red = XRGB(0xff, 0, 0);
console.log('red as int:', red);

const lab = ColorToLab(red);
console.log('in lab:', lab);

const rered = LabToColor(...lab);
console.log('as int again:', rered);
