/*
 *  jGine WebGLCanvasRenderer class
 */
define([
    "js/util",
    "../../Promise",
    "../Canvas",
    "./WebGL/Material"
], function (
    util,
    Promise,
    CanvasRenderer,
    WebGLRendererMaterial
) { "use strict";

    function WebGLCanvasRenderer(canvas) {
        util.assertConstructor(this, WebGLCanvasRenderer);

        CanvasRenderer.call(this, "WebGL", canvas);
    }

    WebGLCanvasRenderer.prototype = Object.create(CanvasRenderer.prototype);

    util.extend(WebGLCanvasRenderer.prototype, {
        init: function () {
            var promise = new Promise(this),
                gl = this.getContext("webgl") || this.getContext("experimental-webgl");

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
        createRendererMaterial: function (material) {
            return new WebGLRendererMaterial(this, material);
        }
    });

    // Export
    return WebGLCanvasRenderer;
});
