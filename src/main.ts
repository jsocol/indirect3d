/* vim: ts=2 sts=2 sw=2: */
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
  I3DXMatrixSubtract,
  XRGB,
} from './indirect3d';

(function main() {
  const WIDTH = 640, HEIGHT = 480;
  const container = document.getElementById('indirect-container')!;

  const camXInput = document.getElementById('camera-x')! as HTMLInputElement;
  const camYInput = document.getElementById('camera-y')! as HTMLInputElement;
  const camZInput = document.getElementById('camera-z')! as HTMLInputElement;

  const fovyInput = document.getElementById('fovy')! as HTMLInputElement;

  const redDepthInput = document.getElementById('red-depth-input')! as HTMLInputElement;
  const blueDepthInput = document.getElementById('blue-depth-input')! as HTMLInputElement;

  const fixedTriangle = [
    new I3DXVertex(2.5, -3.0, 0.0, ARGB(0xff,0,0,0xff)),
    new I3DXVertex(0.0, 3.0, 0.0, ARGB(0xff,0,0xff,0)),
    new I3DXVertex(-2.5, -3.0, 0.0, ARGB(0xff,0xff,0,0)),
    new I3DXVertex(2.5, -3.0, 0.0, ARGB(0xff,0,0,0xff)),
    //new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x80,0,0,0xff))
  ];
  const movingTriangle = [
    new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x40,0,0,0xff)),
    new I3DXVertex(0.0, 3.0, 0.0, ARGB(0x40,0,0,0xff)),
    new I3DXVertex(-2.5, -3.0, 0.0, ARGB(0x40,0,0,0xff)),
    //new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x80,0,0,0xff))
  ];
  // zAxis = [
  //   new I3DXVertex(0, 0, 1000, XRGB(0, 0xff, 0)),
  //   new I3DXVertex(0, 0, -1000, XRGB(0, 0xff, 0))
  // ];


    var id = I3DXMatrixIdentity(4),
        tmat = I3DXTranslateMatrix(0, 0, -10);


    var matView = I3DXMatrixLookAtLH(
            I3DXVector3(camXInput.valueAsNumber, camYInput.valueAsNumber, camZInput.valueAsNumber), // the camera position
            I3DXVector3(0, 0, 0), // the "look-at" position
            I3DXVector3(0, 1, 0)), // the "up" direction
        matProj = I3DXMatrixPerspectiveFovLH(
            I3DXToRadian(fovyInput.valueAsNumber), // the horizontal field of view
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
        //console.time('frame');
        i3d.BeginScene();

        const matView = I3DXMatrixLookAtLH(
          I3DXVector3(camXInput.valueAsNumber, camYInput.valueAsNumber, camZInput.valueAsNumber), // the camera position
          I3DXVector3(0, 0, 0), // the "look-at" position
          I3DXVector3(0, 1, 0), // the "up" direction
        );
        const matProj = I3DXMatrixPerspectiveFovLH(
          I3DXToRadian(fovyInput.valueAsNumber), // the horizontal field of view
          WIDTH / HEIGHT, // aspect ratio
          1.0, // near view-plane
          100.0, // far view-plane
        );

        i3d.SetTransform(I3DTS_VIEW, matView);
        i3d.SetTransform(I3DTS_PROJECTION, matProj);
        i3d.SetTransform(I3DTS_WORLD, id);

        const blueDepth = blueDepthInput.valueAsNumber;
        const triLeftFront = [
          new I3DXVertex(-12, 2.5, blueDepth, XRGB(0, 0, 0xff)),
          new I3DXVertex( -9, 5.5, blueDepth, XRGB(0, 0, 0xff)),
          new I3DXVertex( -6, 2.5, blueDepth, XRGB(0, 0, 0xff)),
        ];

        const redDepth = redDepthInput.valueAsNumber;
        const triLeftBack = [
          new I3DXVertex(-12, 2.5, redDepth, XRGB(0xff, 0, 0)),
          new I3DXVertex( -9, 5.5, redDepth, XRGB(0xff, 0, 0)),
          new I3DXVertex( -6, 2.5, redDepth, XRGB(0xff, 0, 0)),
        ];

        // Fixed triangles for Perspective tests
        i3d.DrawPrimitive(I3DPT_TRIANGLELIST, triLeftFront);
        i3d.DrawPrimitive(I3DPT_TRIANGLELIST, triLeftBack);

        const rot = I3DXRotateYMatrix(idx);
        // const rev = I3DXRotateYMatrix(-idx);

        const left = I3DXTranslateMatrix(0, 0, 2 * Math.sin(idx));

        i3d.SetTransform(I3DTS_WORLD, rot);
        i3d.DrawPrimitive(I3DPT_TRIANGLELIST, movingTriangle);
        //i3d.SetTransform(I3DTS_WORLD, I3DXMatrixMultiply(rev, id));
        i3d.SetTransform(I3DTS_WORLD, left);
        i3d.DrawPrimitive(I3DPT_LINESTRIP, fixedTriangle);
        i3d.EndScene();
        i3d.Present();

        //console.timeEnd('frame');
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
