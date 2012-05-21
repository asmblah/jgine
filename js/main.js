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
    "js/classes/Renderer/Canvas/WebGL",
    "js/classes/File/AliasWavefront",
    "js/classes/World",
    "js/classes/Camera",
    "js/classes/Input/DirectionalPad"
], function (
    util,
    Promise,
    WebGLCanvasRenderer,
    AliasWavefrontFile,
    World,
    Camera,
    DirectionalPad
) { "use strict";

    var canvas = document.getElementById("canvas"),
        webGLRenderer = new WebGLCanvasRenderer(canvas),
        aliasWavefrontFile = new AliasWavefrontFile("models/car.obj");

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            setTimeout(callback, 1000/60);
        };

    webGLRenderer.init()
        .done(function () {
            aliasWavefrontFile.read()
                .done(function (materials, objects) {

                    var world = new World(materials, objects),
                        camera = new Camera(world),
                        pad = new DirectionalPad(),
                        fps = 0,
                        nextSecond = Date.now() + 1000,
                        angle = 0,
                        cameraX = -1.0,
                        cameraY = -1.5,
                        cameraZ = -6.0;

                    pad.init()
                        .done(function () {
                            world.init()
                                .done(function () {

                                    world.load(webGLRenderer);

                                    requestAnimationFrame(function renderLoop() {
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

                                        //webGLRenderer.clear();

                                        camera.renderView(webGLRenderer);
                                        /*modelViewMatrix.loadIdentity();
                                        modelViewMatrix.rotateY(-angle);
                                        modelViewMatrix.translate(cameraX, cameraY + 1.5, cameraZ);
                                        camera.renderView(webGLRenderer);*/

                                        ++fps;
                                        if (Date.now() > nextSecond) {
                                            document.getElementById("fps").textContent = fps;
                                            fps = 0;
                                            nextSecond = Date.now() + 1000;
                                        }

                                        // Render next frame when ready
                                        requestAnimationFrame(renderLoop);
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
        })
        .fail(function (error) {
            throw new Error("Failed to init WebGL - " + error);
        });
});
