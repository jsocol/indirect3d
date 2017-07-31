(function main() {
    var WIDTH = 640,
        HEIGHT = 480;
    var container = document.getElementById('indirect-container');

    var fixedTriangle = [
            new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x80,0,0,0xff)),
            new I3DXVertex(0.0, 3.0, 0.0, ARGB(0x80,0,0xff,0)),
            new I3DXVertex(-2.5, -3.0, 0.0, ARGB(0x80,0xff,0,0)),
            //new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x80,0,0,0xff))
        ],
        movingTriangle = [
            new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x40,0,0,0xff)),
            new I3DXVertex(0.0, 3.0, 0.0, ARGB(0x40,0,0,0xff)),
            new I3DXVertex(-2.5, -3.0, 0.0, ARGB(0x40,0,0,0xff)),
            //new I3DXVertex(2.5, -3.0, 0.0, ARGB(0x80,0,0,0xff))
        ],
        zAxis = [
            new I3DXVertex(0, 0, 1000, XRGB(0, 0xff, 0)),
            new I3DXVertex(0, 0, -1000, XRGB(0, 0xff, 0))
        ];


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

    var i3d = new I3DXDevice(container, WIDTH, HEIGHT),
        idx = 0;

    i3d.SetTransform(I3DTS_VIEW, matView);
    i3d.SetTransform(I3DTS_PROJECTION, matProj);
    i3d.SetTransform(I3DTS_WORLD, id);

    var isPlaying = false;
    function play() {
        var start = new Date();
        console.log("Start frame.");
        i3d.BeginScene();
        var rot = I3DXRotateYMatrix(idx);
        i3d.SetTransform(I3DTS_WORLD, I3DXMatrixMultiply(rot, id));
        i3d.DrawPrimitive(I3DPT_TRIANGLELIST, movingTriangle);
        i3d.SetTransform(I3DTS_WORLD, id);
        i3d.DrawPrimitive(I3DPT_TRIANGLELIST, fixedTriangle);
        i3d.EndScene();
        i3d.Present();
        var dt = new Date() - start;
        console.log("End frame:", dt);
        idx += 0.05;
        if (isPlaying) {
            requestAnimationFrame(play);
        }
    }

    window.addEventListener('keyup', function(e) {
        if(e.keyCode == 27) { // Escape
            isPlaying = false;
            console.log("Stop animation.");
        }
        else if (e.keyCode == 13) {
            isPlaying = true;
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
