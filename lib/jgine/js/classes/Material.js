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
        this.materialRenderers = {};
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
                materialRenderer = renderer.createMaterialRenderer(this);

            for (i = 0 ; i < ambientTextures.length ; ++i) {
                ambientTexture = ambientTextures[i];
                materialRenderer.loadTexture(ambientTexture);
            }

            this.materialRenderers[renderer.getName()] = materialRenderer;
        },
        getMaterialRenderer: function (renderer) {
            return this.materialRenderers[renderer.getName()];
        }
    });

    // Export
    return Material;
});
