/*
 *  jGine MaterialRenderer class
 */
define([
    "js/util",
    "./Promise"
], function (
    util,
    Promise
) { "use strict";

    function MaterialRenderer() {
        util.assertConstructor(this, MaterialRenderer);
    }

    util.extend(MaterialRenderer.prototype, {

    });

    // Export
    return MaterialRenderer;
});
