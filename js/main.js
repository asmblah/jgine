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
    "js/classes/WebGL/Program",
    "js/classes/WebGL/Shader/Vertex",
    "js/classes/WebGL/Shader/Fragment",
    "js/classes/File/AliasWavefront",
    "js/classes/World"
], function (
    util,
    Promise,
    WebGL,
    WebGLProgram,
    WebGLVertexShader,
    WebGLFragmentShader,
    AliasWavefrontFile,
    World
) { "use strict";

    function getScript(id) {
        return document.getElementById(id).textContent;
    }

    function initWebGL() {
        var promise = new Promise(webGL);

        webGL.init()
            .done(function () {
                webGLVertexShader.compile()
                    .done(function () {
                        webGLFragmentShader.compile()
                            .done(function () {
                                webGLProgram
                                    .attach(webGLVertexShader)
                                    .attach(webGLFragmentShader)
                                    .link()
                                        .done(function () {
                                            promise.resolve();
                                        });
                            })
                            .fail(function () {
                                promise.reject();
                            });
                    })
                    .fail(function () {
                        promise.reject();
                    });
            }).fail(function () {
                promise.reject();
            });

        return promise;
    }

    var canvas = document.getElementById("canvas"),
        webGL = new WebGL(canvas),
        webGLProgram = new WebGLProgram(webGL),
        webGLVertexShader = new WebGLVertexShader(webGL, getScript("vertexShader")),
        webGLFragmentShader = new WebGLFragmentShader(webGL, getScript("fragmentShader")),
        aliasWavefrontFile = new AliasWavefrontFile("models/car.obj");

    initWebGL()
        .done(function () {
            aliasWavefrontFile.read()
                .done(function (objectGroup) {
                    var world = new World(objectGroup);

                    world.render();
                })
                .fail(function (error) {
                    alert("Could not load file - " + error);
                });
        })
        .fail(function (error) {
            throw new Error("Failed to init WebGL - " + error);
        });
});
