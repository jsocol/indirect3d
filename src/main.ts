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
  I3DXMatrixMultiply,
  I3DPT_TRIANGLELIST,
  I3DPT_LINELIST,
  I3DPT_LINESTRIP,
  ARGB,
  XRGB,
  I3DXMatrixLookToLH,
} from './indirect3d';

(function main() {
  const WIDTH = 640, HEIGHT = 480;
  const container = document.getElementById('indirect-container')!;

  const camXInput = document.getElementById('camera-x')! as HTMLInputElement;
  const camYInput = document.getElementById('camera-y')! as HTMLInputElement;
  const camZInput = document.getElementById('camera-z')! as HTMLInputElement;

  const dirXInput = document.getElementById('direction-x')! as HTMLInputElement;
  const dirYInput = document.getElementById('direction-y')! as HTMLInputElement;
  const dirZInput = document.getElementById('direction-z')! as HTMLInputElement;

  const fovyInput = document.getElementById('fovy')! as HTMLInputElement;

  const redDepthInput = document.getElementById('red-depth-input')! as HTMLInputElement;
  const blueDepthInput = document.getElementById('blue-depth-input')! as HTMLInputElement;

  const fixedTriangle = [
    new I3DXVertex(2.5, -3.0, 1.0, ARGB(0xff,0,0,0xff)),
    new I3DXVertex(-2.5, -3.0, 1.0, ARGB(0xff,0xff,0,0)),
    new I3DXVertex(0.0, 3.0, 1.0, ARGB(0xff,0,0xff,0)),
    new I3DXVertex(2.5, -3.0, 1.0, ARGB(0xff,0,0,0xff)),
  ];
  const movingTriangle = [
    new I3DXVertex(2.5, -3.0, 0, ARGB(0x40,0,0,0xff)),
    new I3DXVertex(0.0, 3.0, 0, ARGB(0x40,0,0,0xff)),
    new I3DXVertex(-2.5, -3.0, 0, ARGB(0x40,0,0,0xff)),
  ];


  const id = I3DXMatrixIdentity(4);

  const triLeftFront = [
    new I3DXVertex(0, 0, 0, ARGB(0x80, 0, 0, 0xff)),
    new I3DXVertex(3, 3, 0, ARGB(0x80, 0, 0, 0xff)),
    new I3DXVertex(6, 0, 0, ARGB(0x80, 0, 0, 0xff)),
  ];

  const triLeftBack = [
    new I3DXVertex(0, 0, 0, XRGB(0xff, 0, 0)),
    new I3DXVertex(3, 3, 0, XRGB(0xff, 0, 0)),
    new I3DXVertex(6, 0, 0, XRGB(0xff, 0, 0)),
  ];


  const matView = I3DXMatrixLookToLH(
    I3DXVector3(camXInput.valueAsNumber, camYInput.valueAsNumber, camZInput.valueAsNumber), // the camera position
    I3DXVector3(dirXInput.valueAsNumber, dirYInput.valueAsNumber, dirZInput.valueAsNumber), // the "look-to" direction
    I3DXVector3(0, 1, 0), // the "up" direction
  );
  const matProj = I3DXMatrixPerspectiveFovLH(
    I3DXToRadian(fovyInput.valueAsNumber), // the horizontal field of view
    WIDTH / HEIGHT, // aspect ratio
    1.0, // near view-plane
    100.0, // far view-plane
  );

  const i3d = new I3DXDevice(container, WIDTH, HEIGHT);

  i3d.SetTransform(I3DTS_VIEW, matView);
  i3d.SetTransform(I3DTS_PROJECTION, matProj);
  i3d.SetTransform(I3DTS_WORLD, id);

  let idx = 0;
  let isPlaying = false;
  let lastFrameEnd: number;
  function play() {
    //console.time('frame');
    i3d.BeginScene();

    const matView = I3DXMatrixLookToLH(
      I3DXVector3(camXInput.valueAsNumber, camYInput.valueAsNumber, camZInput.valueAsNumber), // the camera position
      I3DXVector3(dirXInput.valueAsNumber, dirYInput.valueAsNumber, dirZInput.valueAsNumber), // the "look-to" direction
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
    const blueTransform = I3DXTranslateMatrix(-9, 2, blueDepth);
    i3d.SetTransform(I3DTS_WORLD, blueTransform);
    i3d.DrawPrimitive(I3DPT_TRIANGLELIST, triLeftFront);

    const redDepth = redDepthInput.valueAsNumber;
    const redTransform = I3DXTranslateMatrix(-9, 2, redDepth);
    i3d.SetTransform(I3DTS_WORLD, redTransform);
    i3d.DrawPrimitive(I3DPT_TRIANGLELIST, triLeftBack);

    const rot = I3DXRotateYMatrix(idx);

    i3d.SetTransform(I3DTS_WORLD, rot);
    i3d.DrawPrimitive(I3DPT_TRIANGLELIST, movingTriangle);

    const left = I3DXTranslateMatrix(0, 0, Math.sin(idx / 2));

    i3d.SetTransform(I3DTS_WORLD, left);
    i3d.DrawPrimitive(I3DPT_TRIANGLELIST, fixedTriangle);

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
    if (e.keyCode == 13) {
      isPlaying = !isPlaying;
      if (isPlaying) {
        lastFrameEnd = Date.now();
        requestAnimationFrame(play);
      }
    }
    e.preventDefault();
    return false;
  }, true);

  i3d.BeginScene();
  i3d.DrawPrimitive(I3DPT_TRIANGLELIST, fixedTriangle);

  const blueDepth = blueDepthInput.valueAsNumber;
  const blueTransform = I3DXTranslateMatrix(-9, 2, blueDepth);
  i3d.SetTransform(I3DTS_WORLD, blueTransform);
  i3d.DrawPrimitive(I3DPT_TRIANGLELIST, triLeftFront);

  const redDepth = redDepthInput.valueAsNumber;
  const redTransform = I3DXTranslateMatrix(-9, 2, redDepth);
  i3d.SetTransform(I3DTS_WORLD, redTransform);
  i3d.DrawPrimitive(I3DPT_TRIANGLELIST, triLeftBack);

  i3d.EndScene();
  i3d.Present();
})();
