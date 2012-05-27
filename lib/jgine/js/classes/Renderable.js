/*
 *  jGine Renderable class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Renderable(renderer, material) {
        util.assertConstructor(this, Renderable);

        // Dependencies
        this.renderer = renderer;
        this.material = material;
    }

    util.extend(Renderable.prototype, {
        init: function () {
            abstract();
        },
        render: function (modelViewMatrix, projectionMatrix, elements) {
            abstract();
        }
    });

    // Export
    return Renderable;
});
