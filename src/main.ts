/* vim: set ts=2 sts=2 sw=2: */
import {
  I3DXVertex,
  I3DXMatrixIdentity,
  I3DXTranslateMatrix,
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
  I3DXMatrixScale,
  I3DXVectorUnit,
  I3DXMatrixAdd,
  I3DXVector,
  I3DXVectorCross,
  I3DXVec,
  I3DPT_TRIANGLESTRIP,
  I3DPT_TRIANGLEFAN,
  I3DXRotateXMatrix,
  I3DXScaleMatrix,
  I3DVertexBuffer,
  I3DIndexBuffer,
} from './indirect3d';
import {I3DLight, I3DLightType} from './indirect3d/lights';

(function main() {
  const WIDTH = 640, HEIGHT = 480;
  const container = document.getElementById('indirect-container')!;

  const camXInput = document.getElementById('camera-x')! as HTMLInputElement;
  const camYInput = document.getElementById('camera-y')! as HTMLInputElement;
  const camZInput = document.getElementById('camera-z')! as HTMLInputElement;

  const dirXInput = document.getElementById('direction-x')! as HTMLInputElement;
  const dirYInput = document.getElementById('direction-y')! as HTMLInputElement;
  const dirZInput = document.getElementById('direction-z')! as HTMLInputElement;

  const basicLightInput = document.getElementById('light-0')! as HTMLInputElement;
  const keyLightInput = document.getElementById('light-1')! as HTMLInputElement;
  const sunLightInput = document.getElementById('light-2')! as HTMLInputElement;
  const sunXInput = document.getElementById('sun-x') as HTMLInputElement;
  const sunYInput = document.getElementById('sun-y') as HTMLInputElement;
  const sunZInput = document.getElementById('sun-z') as HTMLInputElement;

  const fovyInput = document.getElementById('fovy')! as HTMLInputElement;

  const fpsMeter = document.getElementById('fps')! as HTMLSpanElement;

  const redDepthInput = document.getElementById('red-depth-input')! as HTMLInputElement;
  const blueDepthInput = document.getElementById('blue-depth-input')! as HTMLInputElement;

  const fixedTriangle = [
    new I3DXVertex(-2.5, -3.0, 0.0, ARGB(1.0,1.0,0,0)),
    new I3DXVertex(0.0, 3.0, 0.0, ARGB(1.0,0,1.0,0)),
    new I3DXVertex(2.5, -3.0, 0.0, ARGB(1.0,0,0,1.0)),
  ];

  const pyramidBuffer: I3DVertexBuffer = [
    new I3DXVertex(0, 1, 0, XRGB(1.0, 1.0, 1.0)),
    new I3DXVertex(-1, 0, 0, XRGB(1.0, 0.25, 0.25)),
    new I3DXVertex(0, 0, -1, XRGB(1.0, 1.0, 0.25)),
    new I3DXVertex(1, 0, 0, XRGB(0.25, 0.25, 1.0)),
    new I3DXVertex(0, 0, 1, XRGB(0.25, 1.0, 0.25)),
  ];

  const pyramidIndexBuffer: I3DIndexBuffer = [
    0, 1, 2, 3, 4, 1,
  ];

  const ring1 = ARGB(1.0, 1.0, 1.0, 1.0);
  const ring2 = ARGB(1.0, 0.75, 0.56, 0.25);
  const root2o2 = Math.sqrt(2) / 2;
  const root2m2 = Math.sqrt(2 - Math.sqrt(2)) / 2;
  const root2p2 = Math.sqrt(2 + Math.sqrt(2)) / 2;
  const ring = [
    new I3DXVertex(1, 1, 0, ring1),
    new I3DXVertex(root2p2, 0, root2m2, ring2),
    new I3DXVertex(root2o2, 1, root2o2, ring1),
    new I3DXVertex(root2m2, 0, root2p2, ring2),
    new I3DXVertex(0, 1, 1, ring1),
    new I3DXVertex(-root2m2, 0, root2p2, ring2),
    new I3DXVertex(-root2o2, 1, root2o2, ring1),
    new I3DXVertex(-root2p2, 0, root2m2, ring2),
    new I3DXVertex(-1, 1, 0, ring1),
    new I3DXVertex(-root2p2, 0, -root2m2, ring2),
    new I3DXVertex(-root2o2, 1, -root2o2, ring1),
    new I3DXVertex(-root2m2, 0, -root2p2, ring2),
    new I3DXVertex(0, 1, -1, ring1),
    new I3DXVertex(root2m2, 0, -root2p2, ring2),
    new I3DXVertex(root2o2, 1, -root2o2, ring1),
    new I3DXVertex(root2p2, 0, -root2m2, ring2),
    new I3DXVertex(1, 1, 0, ring1),
    new I3DXVertex(root2p2, 0, root2m2, ring2),
    new I3DXVertex(root2o2, 1, root2o2, ring1),
    new I3DXVertex(root2p2, 0, root2m2, ring2),
    new I3DXVertex(1, 1, 0, ring1),
    new I3DXVertex(root2p2, 0, -root2m2, ring2),
    new I3DXVertex(root2o2, 1, -root2o2, ring1),
    new I3DXVertex(root2m2, 0, -root2p2, ring2),
    new I3DXVertex(0, 1, -1, ring1),
    new I3DXVertex(-root2m2, 0, -root2p2, ring2),
    new I3DXVertex(-root2o2, 1, -root2o2, ring1),
    new I3DXVertex(-root2p2, 0, -root2m2, ring2),
    new I3DXVertex(-1, 1, 0, ring1),
    new I3DXVertex(-root2p2, 0, root2m2, ring2),
    new I3DXVertex(-root2o2, 1, root2o2, ring1),
    new I3DXVertex(-root2m2, 0, root2p2, ring2),
    new I3DXVertex(0, 1, 1, ring1),
    new I3DXVertex(root2m2, 0, root2p2, ring2),
    new I3DXVertex(root2o2, 1, root2o2, ring1),
    new I3DXVertex(root2p2, 0, root2m2, ring2),
    new I3DXVertex(1, 1, 0, ring1),
  ];

  const ringBuf: I3DVertexBuffer = [
    new I3DXVertex(-1, 1, 0, ring1), // 0
    new I3DXVertex(-root2m2, 0, -root2p2, ring2), // 1
    new I3DXVertex(-root2m2, 0, root2p2, ring2), // 2
    new I3DXVertex(-root2o2, 1, -root2o2, ring1), // 3
    new I3DXVertex(-root2o2, 1, root2o2, ring1), // 4
    new I3DXVertex(-root2p2, 0, -root2m2, ring2), // 5
    new I3DXVertex(-root2p2, 0, root2m2, ring2), // 6
    new I3DXVertex(0, 1, -1, ring1), // 7
    new I3DXVertex(0, 1, 1, ring1), // 8
    new I3DXVertex(1, 1, 0, ring1), // 9
    new I3DXVertex(root2m2, 0, -root2p2, ring2), // 10
    new I3DXVertex(root2m2, 0, root2p2, ring2), // 11
    new I3DXVertex(root2o2, 1, -root2o2, ring1), // 12
    new I3DXVertex(root2o2, 1, root2o2, ring1), // 13
    new I3DXVertex(root2o2, 1, root2o2, ring1), // 14
    new I3DXVertex(root2p2, 0, -root2m2, ring2), // 15
    new I3DXVertex(root2p2, 0, root2m2, ring2), // 16
  ];

  const ringIdxBuf: I3DIndexBuffer = [
    9, 16, 14, 11, 8, 2, 4, 6, 0, 5, 3, 1, 7, 10, 12, 15, 9, 
    16, 13, 16, 9, 15, 12, 10, 7, 1, 3, 5, 0, 6, 4, 2, 8,
    11, 13, 16, 9,
  ];

  const ringSize = I3DXMatrixMultiply(I3DXScaleMatrix(2, 1, 2), I3DXTranslateMatrix(0, -0.5, 0));

  const id = I3DXMatrixIdentity(4);
  const vUp = I3DXVector3(0, 1, 0);

  const triLeftFront = [
    new I3DXVertex(0, 0, 0, ARGB(0.5, 0, 0, 1.0)),
    new I3DXVertex(1, 1, 0, ARGB(0.5, 0, 0, 1.0)),
    new I3DXVertex(2, 0, 0, ARGB(0.5, 0, 0, 1.0)),
  ];

  const triLeftBack = [
    new I3DXVertex(0, 0, 0, XRGB(1.0, 0, 0)),
    new I3DXVertex(1, 1, 0, XRGB(1.0, 0, 0)),
    new I3DXVertex(2, 0, 0, XRGB(1.0, 0, 0)),
  ];

  let facing = I3DXVector(4, [0, 0, -1, 0]);

  const matView = I3DXMatrixLookToLH(
    I3DXVector3(camXInput.valueAsNumber, camYInput.valueAsNumber, camZInput.valueAsNumber), // the camera position
    I3DXVector3(facing.data[0], facing.data[1], facing.data[2]), // the "look-to" direction
    vUp, // the "up" direction
  );
  const matProj = I3DXMatrixPerspectiveFovLH(
    I3DXToRadian(fovyInput.valueAsNumber), // the horizontal field of view
    WIDTH / HEIGHT, // aspect ratio
    1.0, // near view-plane
    100.0, // far view-plane
  );

  const i3d = new I3DXDevice(container, WIDTH, HEIGHT);

  i3d.SetAmbientLight(XRGB(0.1, 0.1, 0.1));

  i3d.SetTransform(I3DTS_VIEW, matView);
  i3d.SetTransform(I3DTS_PROJECTION, matProj);
  i3d.SetTransform(I3DTS_WORLD, id);

  const basicLight = new I3DLight(I3DLightType.Point);
  basicLight.diffuse = {
    a: 0.0,
    r: 0.15,
    g: 0.0,
    b: 0.5,
  };
  basicLight.position = I3DXVector(4, [-8, 5, 15, 1]);
  basicLight.atten0 = 0;
  basicLight.atten1 = 0.05;
  basicLight.atten2 = 0.001;
  i3d.SetLight(0, basicLight);

  const keyLight = new I3DLight(I3DLightType.Point);
  keyLight.diffuse = {
    a: 0.0,
    r: 0.5,
    g: 0.05,
    b: 0.2,
  };
  keyLight.position = I3DXVector(4, [1, 0, -15, 1]);
  keyLight.atten0 = 0;
  keyLight.atten1 = 0.01;
  keyLight.atten2 = 0.001;
  i3d.SetLight(1, keyLight);

  const sunLight = new I3DLight(I3DLightType.Directional);
  sunLight.diffuse = {
    a: 0.0,
    r: 0.4,
    g: 0.4,
    b: 0.3,
  };
  sunLight.direction = I3DXVector(3, [-0.5, -0.5, -0.5]);
  i3d.SetLight(2, sunLight);

  let idx = 0;
  let dPosition = 0.2;
  let dTheta = 0.005;
  let isPlaying = false;
  let lastFrameEnd: number;
  let frameTime = 0;
  const keys: Record<string, boolean> = {
    'KeyW': false, // forward
    'KeyQ': false, // strafe left
    'KeyE': false, // strafe right
    'KeyS': false, // backward
    'KeyA': false, // turn left
    'KeyD': false, // turn right
  };
  function play() {
    //console.time('frame');
    let now = Date.now();
    const dt = now - lastFrameEnd;

    i3d.BeginScene();

    // turning
    facing = I3DXVectorUnit(I3DXVector(4, [dirXInput.valueAsNumber, dirYInput.valueAsNumber, dirZInput.valueAsNumber, 1]));
    if (keys['KeyA']) {
      const rotate = I3DXRotateYMatrix(dTheta * dt);
      facing = I3DXMatrixMultiply(rotate, facing) as I3DXVec;
    } else if (keys['KeyD']) {
      const rotate = I3DXRotateYMatrix(-dTheta * dt);
      facing = I3DXMatrixMultiply(rotate, facing) as I3DXVec;
    }

    dirXInput.valueAsNumber = facing.data[0];
    dirYInput.valueAsNumber = facing.data[1];
    dirZInput.valueAsNumber = facing.data[2];

    // moving
    if (keys['KeyW']) {
      const mvmt = I3DXMatrixScale(facing, dPosition * dt);
      camXInput.valueAsNumber += mvmt.data[0];
      camYInput.valueAsNumber += mvmt.data[1];
      camZInput.valueAsNumber += mvmt.data[2];
    } else if (keys['KeyS']) {
      const mvmt = I3DXMatrixScale(facing, -dPosition * dt);
      camXInput.valueAsNumber += mvmt.data[0];
      camYInput.valueAsNumber += mvmt.data[1];
      camZInput.valueAsNumber += mvmt.data[2];
    }
    if (keys['KeyQ']) {
      const vLeft = I3DXVectorUnit(I3DXVectorCross(vUp, facing));
      const mvmt = I3DXMatrixScale(vLeft, dPosition * dt / 10);
      camXInput.valueAsNumber += mvmt.data[0];
      camYInput.valueAsNumber += mvmt.data[1];
      camZInput.valueAsNumber += mvmt.data[2];
    } else if (keys['KeyE']) {
      const vLeft = I3DXVectorUnit(I3DXVectorCross(vUp, facing));
      const mvmt = I3DXMatrixScale(vLeft, -dPosition * dt / 10);
      camXInput.valueAsNumber += mvmt.data[0];
      camYInput.valueAsNumber += mvmt.data[1];
      camZInput.valueAsNumber += mvmt.data[2];
    }

    const matView = I3DXMatrixLookToLH(
      I3DXVector3(camXInput.valueAsNumber, camYInput.valueAsNumber, camZInput.valueAsNumber), // the camera position
      I3DXVector3(facing.data[0], facing.data[1], facing.data[2]), // the "look-to" direction
      vUp, // the "up" direction
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

    i3d.LightEnable(0, basicLightInput.checked);
    i3d.LightEnable(1, keyLightInput.checked);
    i3d.LightEnable(2, sunLightInput.checked);
    sunLight.direction = I3DXVector3(sunXInput.valueAsNumber, sunYInput.valueAsNumber, sunZInput.valueAsNumber);

    const blueDepth = blueDepthInput.valueAsNumber;
    const blueTransform = I3DXTranslateMatrix(-9, 2, blueDepth);
    i3d.SetTransform(I3DTS_WORLD, blueTransform);
    i3d.DrawPrimitiveUP(I3DPT_TRIANGLELIST, triLeftFront);

    const redDepth = redDepthInput.valueAsNumber;
    const redTransform = I3DXTranslateMatrix(-9, 2, redDepth);
    i3d.SetTransform(I3DTS_WORLD, redTransform);
    i3d.DrawPrimitiveUP(I3DPT_TRIANGLELIST, triLeftBack);

    i3d.SetTransform(I3DTS_WORLD, I3DXMatrixMultiply(I3DXRotateXMatrix(idx / 3), ringSize));
    // i3d.DrawPrimitiveUP(I3DPT_TRIANGLESTRIP, ring);
    i3d.SetStreamSource(0, ringBuf);
    i3d.SetIndices(ringIdxBuf);
    i3d.DrawIndexedPrimitive(I3DPT_TRIANGLESTRIP, 0, ringIdxBuf.length - 3);

    const left = I3DXTranslateMatrix(0, 0, Math.sin(idx / 2));

    i3d.SetTransform(I3DTS_WORLD, left);
    i3d.DrawPrimitiveUP(I3DPT_TRIANGLESTRIP, fixedTriangle);

    i3d.SetTransform(I3DTS_WORLD, I3DXRotateYMatrix(idx / 3));
    i3d.MultiplyTransform(I3DTS_WORLD, I3DXTranslateMatrix(8, 0, 0));
    i3d.SetStreamSource(0, pyramidBuffer);
    i3d.SetIndices(pyramidIndexBuffer);
    i3d.DrawIndexedPrimitive(I3DPT_TRIANGLEFAN, 0, 4);

    i3d.EndScene();
    i3d.Present();

    //console.timeEnd('frame');
    idx += 0.005 * dt;
    if (isPlaying) {
        requestAnimationFrame(play);
    }
    frameTime += (now - lastFrameEnd - frameTime) / 20;
    lastFrameEnd = now;
  }

  setInterval(() => {
    fpsMeter.innerText = (1000 / frameTime).toFixed(1) + ' fps';
  }, 500);

  window.addEventListener('keydown', function(e) {
    if (e.code in keys) {
      keys[e.code] = true;
    }
  });

  window.addEventListener('keyup', function(e) {
    if (e.code in keys) {
      keys[e.code] = false;
    } else if (e.code == 'Enter') {
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
  i3d.DrawPrimitiveUP(I3DPT_TRIANGLESTRIP, fixedTriangle);

  i3d.SetTransform(I3DTS_WORLD, I3DXScaleMatrix(2, 1, 2));
  i3d.DrawPrimitiveUP(I3DPT_TRIANGLESTRIP, ring);

  i3d.EndScene();
  i3d.Present();
})();
