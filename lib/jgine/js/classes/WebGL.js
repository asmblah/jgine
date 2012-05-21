/*
 *  jGine WebGL class
 */
define([
    "js/util",
    "./Promise",
    "./Renderer",
    "./WebGL/MaterialRenderer"
], function (
    util,
    Promise,
    Renderer,
    WebGLMaterialRenderer
) { "use strict";

    function getContext(canvas, name) {
        var gl = null;

        try {
            gl = canvas.getContext(name);
        } catch (error) {}

        return gl;
    }

    function WebGL(canvas) {
        util.assertConstructor(this, WebGL);

        Renderer.call(this, "WebGL");

        this.canvas = canvas;
        this.gl = null;
    }

    WebGL.prototype = Object.create(Renderer.prototype);

    util.extend(WebGL.prototype, {
        init: function () {
            var promise = new Promise(this),
                gl = getContext(this.canvas, "webgl") || getContext(this.canvas, "experimental-webgl");

            // TODO: Handle WebGL CONTEXT_LOST events properly (as defined in spec)

            if (gl) {
                this.gl = gl;

                gl.clearColor(1.0, 1.0, 1.0, 1.0); // Clears should be to fully opaque black
                gl.clearDepth(1.0);                // Clear all pixels

                gl.enable(gl.DEPTH_TEST);          // Enable z-buffering
                gl.depthFunc(gl.LEQUAL);           // Nearer objects are drawn in front of those further away

                gl.enable(gl.CULL_FACE);           // Enable backface culling
                gl.cullFace(gl.BACK);
                gl.frontFace(gl.CCW);              // Counter-clockwise polygon winding order

                return promise.resolve();
            } else {
                return promise.reject(new Error("Could not get a WebGL <canvas> context"));
            }
        },
        getGL: function () {
            return this.gl;
        },
        clear: function (colorBuffer, depthBuffer) {
            var gl = this.gl,
                what = 0;

            if (colorBuffer !== false) {
                what |= gl.COLOR_BUFFER_BIT;
            }
            if (depthBuffer !== false) {
                what |= gl.DEPTH_BUFFER_BIT;
            }

            gl.clear(what);
        },
        createMaterialRenderer: function (material) {
            return new WebGLMaterialRenderer(this, material);
        }
    });

    // Export
    return WebGL;
});
