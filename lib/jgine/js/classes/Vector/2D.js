/*
 *  jGine Vector2D class
 */
define([
    "js/util",
    "../Vector"
], function(
    util,
    Vector
) {

    function Vector2D(x, y) {
        util.assertConstructor(this, Vector2D);

        this.x = x;
        this.y = y;
    }

    Vector2D.prototype = Object.create(Vector.prototype);

    util.extend(Vector2D, {

    });

    util.extend(Vector2D.prototype, {

    });

    // Export
    return Vector2D;
});
