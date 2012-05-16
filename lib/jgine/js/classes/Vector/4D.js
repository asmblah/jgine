/*
 *  jGine Vector4D class
 */
define([
    "js/util",
    "../Vector"
], function(
    util,
    Vector
) {

    function Vector4D(x, y, z, w) {
        util.assertConstructor(this, Vector4D);

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    Vector4D.prototype = Object.create(Vector.prototype);

    util.extend(Vector4D, {

    });

    util.extend(Vector4D.prototype, {

    });

    // Export
    return Vector4D;
});
