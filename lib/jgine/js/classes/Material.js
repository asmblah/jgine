/*
 *  jGine Material class
 */
define([
    "js/util"
], function(
    util
) {

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
