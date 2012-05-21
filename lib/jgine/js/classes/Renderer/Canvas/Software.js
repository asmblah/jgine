/*
 *  jGine SoftwareCanvasRenderer class
 */
define([
    "js/util",
    "../Promise",
    "../Canvas",
    "./Software/Material"
], function (
    util,
    Promise,
    CanvasRenderer,
    WebGLRendererMaterial
) { "use strict";

    function SoftwareCanvasRenderer(canvas) {
        util.assertConstructor(this, SoftwareCanvasRenderer);

        CanvasRenderer.call(this, "Software", canvas);
    }

    SoftwareCanvasRenderer.prototype = Object.create(CanvasRenderer.prototype);

    util.extend(SoftwareCanvasRenderer.prototype, {
        init: function () {
            var promise = new Promise(this),
                gl = getContext("2d");

            if (gl) {
                this.gl = gl;

                return promise.resolve();
            } else {
                return promise.reject(new Error("Could not get a 2D <canvas> context"));
            }
        },
        clear: function (colorBuffer, depthBuffer) {

        },
        createRendererMaterial: function (material) {
            return new SoftwareRendererMaterial(this, material);
        }
    });

    // Export
    return SoftwareCanvasRenderer;
});
