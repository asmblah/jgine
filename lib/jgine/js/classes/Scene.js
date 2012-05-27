/*
 *  jGine Scene class
 */
define([
    "js/util",
    "./Promise",
    "./Funnel",
    "require"
], function (
    util,
    Promise,
    Funnel,
    require
) { "use strict";

    var WINDING_ORDER_CCW = 1,
        WINDING_ORDER_CW = 2,
        defaults = {
            renderers: {
                "Canvas/WebGL": {},
                "Canvas/JGine3D": {},
                "SVG": {}
            },
            frontFace: WINDING_ORDER_CCW
        },
        // HTML5 requestAnimationFrame(...) shim
        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                setTimeout(callback, 1000/60);
            };

    function Scene(materials, objects, options) {
        util.assertConstructor(this, Scene);

        // Properties
        this.materials = materials;
        this.objects = objects;
        this.options = util.extend({}, defaults, options || {});
        this.renderer = null;
    }

    util.extend(Scene, {
        WINDING_ORDER_CCW: WINDING_ORDER_CCW,
        WINDING_ORDER_CW:  WINDING_ORDER_CW
    })

    util.extend(Scene.prototype, {
        init: function () {
            var promise = new Promise(this),
                scene = this,
                names = [],
                optionSets = [];

            function tryNextRenderer() {
                var name = names.shift(),
                    options = optionSets.shift();

                if (!name) {
                    promise.reject("Scene.init() :: Could not load any available renderer");
                    return;
                }

                require([
                    "./Renderer/" + name
                ], function (
                    Renderer
                ) {
                    var renderer = new Renderer(options);

                    renderer.init()
                        .done(function () {
                            scene.renderer = renderer;

                            // Initialise all materials used in scene (in any order) before continuing
                            new Funnel(scene.materials, function () {
                                var promise = new Promise(this);

                                this.init(renderer).pipe(promise);

                                return promise;
                            })
                                .done(function () {
                                    promise.resolve();
                                });
                        })
                        .fail(function () {
                            tryNextRenderer();
                        });
                });
            }

            util.each(this.options.renderers, function (name, options) {
                names.push(name);
                optionSets.push(options);
            });

            tryNextRenderer();

            return promise;
        },
        getRenderer: function () {
            return this.renderer;
        },
        render: function (fromObject) {
            var renderer = this.getRenderer(),
                objects = this.objects,
                name;

            renderer.clear();

            for (name in objects) {
                if (hasOwnProperty.call(objects, name)) {
                    objects[name].render(renderer, fromObject);
                }
            }
        },
        renderLoop: function (callback) {
            function drawFrame() {
                callback();
                requestAnimationFrame(drawFrame);
            }

            requestAnimationFrame(drawFrame);
        },
        getCanvas: function () {
            return this.renderer.getCanvas();
        }
    });

    // Export
    return Scene;
});
