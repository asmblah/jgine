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
    
    var defaults = {};

    function CanvasRenderer(name, options) {
        util.assertConstructor(this, CanvasRenderer);

        Renderer.call(this, "Canvas/" + name, util.extend({}, defaults, options || {}));

        // Properties
        this.canvas = null;
        this.gl = null;
    }

    CanvasRenderer.prototype = Object.create(Renderer.prototype);

    util.extend(CanvasRenderer.prototype, {
        getContext: function (name) {
            var gl = null,
                canvas = this.getCanvas();

            try {
                gl = canvas.getContext(name);
            } catch (error) {}

            return gl;
        },
        getGL: function () {
            return this.gl;
        },
        getWidth: function () {
            return this.canvas.width;
        },
        getHeight: function () {
            return this.canvas.height;
        },
        getCanvas: function () {
            if (!this.canvas) {
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.options.width;
                this.canvas.height = this.options.height;
                this.canvas.style.width = this.canvas.width + "px";
                this.canvas.style.height = this.canvas.height + "px";
                this.canvas.style.imageRendering = "optimizeSpeed";
            }

            return this.canvas;
        }
    });

    // Export
    return CanvasRenderer;
});
