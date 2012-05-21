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
        this.rendererMaterials = {};
    }

    util.extend(Material.prototype, {
        init: function () {
            // Load all Textures used in Material (in any order) before continuing
            return new Funnel(this.ambientTextures, function () {
                var promise = new Promise(this);

                this.init().pipe(promise);

                return promise;
            });
        },
        addAmbientTexture: function (texture) {
            this.ambientTextures.push(texture);
        },
        load: function (renderer) {
            var i,
                ambientTextures = this.ambientTextures,
                ambientTexture,
                rendererMaterial = renderer.createRendererMaterial(this);

            for (i = 0 ; i < ambientTextures.length ; ++i) {
                ambientTexture = ambientTextures[i];
                rendererMaterial.loadTexture(ambientTexture);
            }

            this.rendererMaterials[renderer.getName()] = rendererMaterial;
        },
        getRendererMaterial: function (renderer) {
            return this.rendererMaterials[renderer.getName()];
        }
    });

    // Export
    return Material;
});
