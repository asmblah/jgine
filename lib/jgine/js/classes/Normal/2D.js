/*
 *  jGine Normal2D class
 */
define([
    "js/util",
    "../Vector/2D"
], function(
    util,
    Vector2D
) {

    function Normal2D(x, y) {
        util.assertConstructor(this, Normal2D);

        Vector2D.call(this, x, y);
    }

    Normal2D.prototype = Object.create(Vector2D.prototype);

    util.extend(Normal2D.prototype, {

    });

    // Export
    return Normal2D;
});
