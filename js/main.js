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
    "js/classes/WebGL",
    "js/classes/File/AliasWavefront",
    "js/classes/Camera",
    "js/classes/World"
], function (
    util,
    Promise,
    WebGL,
    AliasWavefrontFile,
    Camera,
    World
) { "use strict";

    var canvas = document.getElementById("canvas"),
        webGL = new WebGL(canvas),
        aliasWavefrontFile = new AliasWavefrontFile("models/car.obj");

    webGL.init()
        .done(function () {
            aliasWavefrontFile.read()
                .done(function (materials, objects) {
                    var KEY_UP = 38,
                        KEY_DOWN = 40,
                        KEY_LEFT = 37,
                        KEY_RIGHT = 39,
                        KEY_W = 87,
                        KEY_S = 83;

                    var world = new World(materials, objects),
                        camera = new Camera(world),
                        angle = 0,
                        cameraX = -1.0,
                        cameraY = 0.0,
                        cameraZ = -6.0;

                    world.init()
                        .done(function () {
                            document.addEventListener("keydown", function (evt) {
                                //alert(evt.keyCode);

                                if (evt.keyCode === KEY_UP) {
                                    cameraZ += 0.1;
                                } else if (evt.keyCode === KEY_DOWN) {
                                    cameraZ -= 0.1;
                                } else if (evt.keyCode === KEY_LEFT) {
                                    cameraX += 0.1;
                                } else if (evt.keyCode === KEY_RIGHT) {
                                    cameraX -= 0.1;
                                } else if (evt.keyCode === KEY_W) {
                                    cameraY -= 0.1;
                                } else if (evt.keyCode === KEY_S) {
                                    cameraY += 0.1;
                                }

                                evt.preventDefault();
                            }, false);

                            world.load(webGL);

                            setInterval(function () {
                                var modelViewMatrix = camera.getWorldMatrix();

                                modelViewMatrix.loadIdentity();
                                modelViewMatrix.rotateY(angle);
                                modelViewMatrix.translate(cameraX, cameraY, cameraZ);

                                angle += Math.PI/180;

                                camera.renderView(webGL);
                            }, 1000 / 30);
                        })
                        .fail(function () {
                            alert("Failed to load some resources");
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
