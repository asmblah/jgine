/*
 *  jGine Vector3D class
 */
define([
    "js/util",
    "../Vector"
], function(
    util,
    Vector
) {

    function Vector3D(x, y, z) {
        util.assertConstructor(this, Vector3D);

        this.x = x;
        this.y = y;
        this.z = z;
    }

    Vector3D.prototype = Object.create(Vector.prototype);

    util.extend(Vector3D, {

    });

    util.extend(Vector3D.prototype, {

    });

    // Export
    return Vector3D;
});
