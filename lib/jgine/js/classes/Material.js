/*
 *  jGine Material class
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

    function Material(name) {
        util.assertConstructor(this, Material);

        this.name = name;
        this.ambientTextures = [];
        this.renderable = null;
    }

    util.extend(Material.prototype, {
        init: function (renderer) {
            var promise = new Promise(this),
                material = this;

            // Load all Textures used in Material (in any order) before continuing
            new Funnel(this.ambientTextures, function () {
                var promise = new Promise(this);

                this.init().pipe(promise);

                return promise;
            })
                .done(function () {
                    renderer.getRenderable("Face")
                        .done(function (Renderable) {
                            var renderable = new Renderable(renderer, material);

                            renderable.init(material.ambientTextures);

                            material.renderable = renderable;

                            promise.resolve();
                        });
                });

            return promise;
        },
        addAmbientTexture: function (texture) {
            this.ambientTextures.push(texture);
        },
        render: function (modelViewMatrix, projectionMatrix, faces) {
            this.renderable.render(modelViewMatrix, projectionMatrix, faces);
        }
    });

    // Export
    return Material;
});
