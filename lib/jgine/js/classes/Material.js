/*
 *  jGine Material class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Material(name) {
        util.assertConstructor(this, Material);

        this.name = name;

        this.ambientTextureMap = null;
    }

    util.extend(Material.prototype, {
        loadAmbientTextureMap: function (textureMap) {
            this.ambientTextureMap = textureMap;
        }
    });

    // Export
    return Material;
});
