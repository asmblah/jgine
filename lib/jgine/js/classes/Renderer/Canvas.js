/*
 *  jGine CanvasRenderer class
 */
define([
    "js/util",
    "../Promise",
    "../Renderer"
], function (
    util,
    Promise,
    Renderer
) { "use strict";

    function CanvasRenderer(name, canvas) {
        util.assertConstructor(this, CanvasRenderer);

        Renderer.call(this, "Canvas" + name);

        this.canvas = canvas;
        this.gl = null;
    }

    CanvasRenderer.prototype = Object.create(Renderer.prototype);

    util.extend(CanvasRenderer.prototype, {
        getContext: function (name) {
            var gl = null;

            try {
                gl = this.canvas.getContext(name);
            } catch (error) {}

            return gl;
        },
        init: function () {

        },
        getGL: function () {
            return this.gl;
        },
        clear: function (colorBuffer, depthBuffer) {

        },
        createRendererMaterial: function (material) {

        }
    });

    // Export
    return CanvasRenderer;
});
