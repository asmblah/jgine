/*
 *  jGine Vector base class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Vector() {
        util.assertConstructor(this, Vector);
    }

    util.extend(Vector, {

    });

    util.extend(Vector.prototype, {
        getMagnitude: function () {
            abstract();
        },
        normalize: function () {
            abstract();
        },
        transform: function () {
            abstract();
        },
        dot: function (withVector) {
            abstract();
        },
        cross: function (withVector) {
            abstract();
        },
        intersect: function () {
            abstract();
        },
        copyTo: function (vector) {
            abstract();
        }
    });

    // Export
    return Vector;
});
