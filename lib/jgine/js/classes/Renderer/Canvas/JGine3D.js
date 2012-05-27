/*
 *  jGine JGine3DCanvasRenderer class
 */
define([
    "js/util",
    "../../Promise",
    "../Canvas"
], function (
    util,
    Promise,
    CanvasRenderer
) { "use strict";

    function JGine3DCanvasRenderer(options) {
        util.assertConstructor(this, JGine3DCanvasRenderer);

        CanvasRenderer.call(this, "JGine3D", options);
    }

    JGine3DCanvasRenderer.prototype = Object.create(CanvasRenderer.prototype);

    util.extend(JGine3DCanvasRenderer.prototype, {
        init: function () {
            var promise = new Promise(this),
                gl = this.getContext("2d");

            if (gl) {
                this.gl = gl;

                return promise.resolve();
            } else {
                return promise.reject(new Error("Could not get a 2D <canvas> context"));
            }
        },
        clear: function (colorBuffer, depthBuffer) {
            this.gl.clearRect(0, 0, this.getWidth(), this.getHeight());
        }
    });

    // Export
    return JGine3DCanvasRenderer;
});
