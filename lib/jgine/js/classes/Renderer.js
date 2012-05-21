/*
 *  jGine Renderer class
 */
define([
    "js/util",
    "./Promise"
], function (
    util,
    Promise
) { "use strict";

    function Renderer(name) {
        util.assertConstructor(this, Renderer);

        // Properties
        this.name = name;
    }

    util.extend(Renderer.prototype, {
        init: function () {
            var promise = new Promise(this);

            return promise.resolve();
        },
        getName: function () {
            return this.name;
        }
    });

    // Export
    return Renderer;
});
