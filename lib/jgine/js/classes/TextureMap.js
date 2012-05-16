/*
 *  jGine TextureMap class
 */
define([
    "js/util"
], function(
    util
) {

    function TextureMap(path) {
        util.assertConstructor(this, TextureMap);

        this.path = path;
    }

    util.extend(TextureMap.prototype, {

    });

    // Export
    return TextureMap;
});
