/*
 *  jGine Renderer class
 */
define([
    "js/util",
    "./Promise",
    "./Vector/4D",
    "require"
], function (
    util,
    Promise,
    Vector4D,
    require
) { "use strict";

    var defaults = {
        width: 640,
        height: 480
    };

    function Renderer(name, options) {
        util.assertConstructor(this, Renderer);

        // Properties
        this.name = name;
        this.options = util.extend({}, defaults, options || {});
    }

    util.extend(Renderer.prototype, {
        init: function () {
            var promise = new Promise(this);

            return promise.resolve();
        },
        getName: function () {
            return this.name;
        },
        getWidth: function () {
            abstract();
        },
        getHeight: function () {
            abstract();
        },
        clear: function (colorBuffer, depthBuffer) {
            abstract();
        },
        getRenderable: function (name) {
            var promise = new Promise(this);

            require([
                "./Renderer/" + this.name + "/Renderable/" + name
            ], function (Renderable) {
                promise.resolve(Renderable);
            });

            return promise;
        },
        getCanvas: function () {
            abstract();
        }
    });

    // Export
    return Renderer;
});
