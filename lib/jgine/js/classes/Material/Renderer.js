/*
 *  jGine RendererMaterial class
 */
define([
    "js/util",
    "../Promise"
], function (
    util,
    Promise
) { "use strict";

    function RendererMaterial() {
        util.assertConstructor(this, RendererMaterial);
    }

    util.extend(RendererMaterial.prototype, {

    });

    // Export
    return RendererMaterial;
});
