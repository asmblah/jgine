/*
 *  jGine Normal3D class
 */
define([
    "js/util",
    "../Vector/3D"
], function(
    util,
    Vector3D
) {

    function Normal3D(x, y, z) {
        util.assertConstructor(this, Normal3D);

        Vector3D.call(this, x, y, z);
    }

    Normal3D.prototype = Object.create(Vector3D.prototype);

    util.extend(Normal3D.prototype, {

    });

    // Export
    return Normal3D;
});
