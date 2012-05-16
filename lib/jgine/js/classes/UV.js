/*
 *  jGine UV (Texture coord) class
 */
define([
    "js/util",
    "./Vector/2D"
], function(
    util,
    Vector2D
) {

    function UV(u, v) {
        util.assertConstructor(this, UV);

        this.u = u;
        this.v = v;
    }

    UV.prototype = Object.create(Vector2D.prototype);

    util.extend(UV, {

    });

    util.extend(UV.prototype, {

    });

    // Export
    return UV;
});
