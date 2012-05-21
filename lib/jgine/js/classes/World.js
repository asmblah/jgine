/*
 *  jGine World class
 */
define([
    "js/util",
    "./Promise",
    "./Funnel"
], function (
    util,
    Promise,
    Funnel
) { "use strict";

    var hasOwnProperty = {}.hasOwnProperty;

    function World(materials, objects) {
        util.assertConstructor(this, World);

        this.materials = materials;
        this.objects = objects;
    }

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;  

    util.extend(World.prototype, {
        init: function () {
            // Initialise all Materials used in World (in any order) before continuing
            return new Funnel(this.materials, function () {
                var promise = new Promise(this);

                this.init().pipe(promise);

                return promise;
            });
        },
        load: function (renderer) {
            this.loadMaterials(renderer);
            this.loadObjects(renderer);
        },
        loadMaterials: function (renderer) {
            var materials = this.materials,
                name;

            for (name in materials) {
                if (hasOwnProperty.call(materials, name)) {
                    materials[name].load(renderer);
                }
            }
        },
        loadObjects: function (renderer) {
            var objects = this.objects,
                name;

            for (name in objects) {
                if (hasOwnProperty.call(objects, name)) {
                    objects[name].load(renderer);
                }
            }
        },
        render: function (renderer, fromObject) {
            var objects = this.objects,
                name;

            renderer.clear();

            for (name in objects) {
                if (hasOwnProperty.call(objects, name)) {
                    objects[name].render(renderer, fromObject);
                }
            }
        }
    });

    // Export
    return World;
});
