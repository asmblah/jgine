/*
 *  jGine WebGL class
 */
define([
    "js/util",
    "./Promise"
], function (
    util,
    Promise
) { "use strict";

    function getContext(canvas, name) {
        var context = null;

        try {
            context = canvas.getContext(name);
        } catch (error) {}

        return context;
    }

    function WebGL(canvas) {
        util.assertConstructor(this, WebGL);

        this.canvas = canvas;
        this.context = null;
    }

    util.extend(WebGL.prototype, {
        init: function () {
            var promise = new Promise(this),
                context = getContext(this.canvas, "webgl") || getContext(this.canvas, "experimental-webgl");

            if (context) {
                this.context = context;

                return promise.resolve();
            } else {
                return promise.reject(new Error("Could not get a WebGL <canvas> context"));
            }
        },
        getGL: function () {
            return this.context;
        },
        render: function () {
            
        }
    });

    // Export
    return WebGL;
});
