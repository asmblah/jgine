/*
 *  jGine Texture class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Texture() {
        util.assertConstructor(this, Texture);
    }

    util.extend(Texture.prototype, {
        init: function () {
            // Stub
        }
    });

    // Export
    return Texture;
});
