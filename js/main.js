/*
 *  Main load routines for jGine demo
 */
require({
    paths: {
        "js": "/jgine/lib/jgine/js",
        "lib": "/jgine/lib"
    }
}, [
    "js/util",
    "js/classes/Promise",
    "js/classes/Scene",
    "js/classes/File/AliasWavefront",
    "js/classes/Camera",
    "js/classes/Input/DirectionalPad"
], function (
    util,
    Promise,
    Scene,
    AliasWavefrontFile,
    Camera,
    DirectionalPad
) { "use strict";

    var aliasWavefrontFile = new AliasWavefrontFile("models/car.obj");

    aliasWavefrontFile.read()
        .done(function (materials, objects) {

            var scene = new Scene(materials, objects),
                camera = new Camera(),
                pad = new DirectionalPad(),
                fps = 0,
                nextSecond = Date.now() + 1000,
                angle = 0,
                cameraX = -1.0,
                cameraY = -1.5,
                cameraZ = -6.0;

            pad.init()
                .done(function () {
                    scene.init()
                        .done(function () {
                            // Add the canvas to the document
                            var canvas = this.getCanvas();
                            canvas.id = "canvas";
                            document.body.appendChild(canvas);

                            scene.renderLoop(function () {
                                var modelViewMatrix = camera.getWorldMatrix();

                                if (pad.up) {
                                    cameraZ += 0.1;
                                }
                                if (pad.down) {
                                    cameraZ -= 0.1;
                                }
                                if (pad.left) {
                                    cameraX += 0.1;
                                }
                                if (pad.right) {
                                    cameraX -= 0.1;
                                }

                                modelViewMatrix.loadIdentity();
                                modelViewMatrix.rotateY(angle);
                                modelViewMatrix.translate(cameraX, cameraY, cameraZ);

                                angle += Math.PI/180;

                                //renderer.clear();

                                scene.render(camera);
                                /*modelViewMatrix.loadIdentity();
                                modelViewMatrix.rotateY(-angle);
                                modelViewMatrix.translate(cameraX, cameraY + 1.5, cameraZ);
                                scene.render(camera);*/

                                ++fps;
                                if (Date.now() > nextSecond) {
                                    document.getElementById("fps").textContent = fps;
                                    fps = 0;
                                    nextSecond = Date.now() + 1000;
                                }

                                document.getElementById("renderer").textContent = scene.getRenderer().getName();
                            });
                        })
                        .fail(function () {
                            alert("Failed to load some resources");
                        });
                });
        })
        .fail(function (error) {
            alert("Could not load file - " + error);
        });
});
