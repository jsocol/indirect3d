(function main() {
    function log(msg) {
        if (typeof console != 'undefined')
            console.log(msg);
    }

    var WIDTH = 640,
        HEIGHT = 480;
    var container = document.getElementById('indirect-container');

    var triangle = [
            new I3DXVertex(2.5, -3.0, 0.0, XRGB(0,0,0xff)),
            new I3DXVertex(0.0, 3.0, 0.0, XRGB(0,0xff,0)),
            new I3DXVertex(-2.5, -3.0, 0.0, XRGB(0xff,0,0)),
            new I3DXVertex(2.5, -3.0, 0.0, XRGB(0,0,0xff))
        ],
        zAxis = [
            new I3DXVertex(0, 0, 1000, XRGB(0, 0xff, 0)),
            new I3DXVertex(0, 0, -1000, XRGB(0, 0xff, 0))
        ];


    var id = I3DXMatrixIdentity(4),
        tmat = I3DXTranslateMatrix(0, 0, -10);

    var matView = I3DXMatrixLookAtLH(
            I3DXVector3(0.0, 0.0, 10.0), // the camera position
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

    var intv;
    function play() {
        return setInterval(function() {
            log("Start frame.");
            i3d.BeginScene();
            var rot = I3DXRotateYMatrix(idx);
            i3d.SetTransform(I3DTS_WORLD, I3DXMatrixMultiply(rot, id));
            i3d.DrawPrimitive(I3DPT_LINESTRIP, triangle);
            i3d.SetTransform(I3DTS_WORLD, id);
            i3d.DrawPrimitive(I3DPT_LINESTRIP, triangle);
            //i3d.DrawPrimitive(I3DPT_LINESTRIP, zAxis);
            i3d.EndScene();
            i3d.Present();
            log("End frame.");
            idx += 0.05;
        }, 60);
    }
    //intv = play();

    window.addEventListener('keyup', function(e) {
        if(e.keyCode == 27) {
            clearInterval(intv);
            log("Stop animation.");
        }
        else if (e.keyCode == 32) {
            log("Start animation.");
            intv = play();
        }
    }, true);
    i3d.DrawPrimitive(I3DPT_LINESTRIP, triangle);
    i3d.EndScene();
    i3d.Present();
})();
