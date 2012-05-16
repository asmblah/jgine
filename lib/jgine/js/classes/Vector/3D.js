/*
 *  jGine Vector3D class
 */
define([
    "js/util",
    "../Vector"
], function(
    util,
    Vector
) { "use strict";

    function Vector3D(x, y, z) {
        util.assertConstructor(this, Vector3D);

        this.x = x;
        this.y = y;
        this.z = z;
    }

    Vector3D.prototype = Object.create(Vector.prototype);

    util.extend(Vector3D.prototype, {
        getMagnitude: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        normalize: function () {
            var magnitude = this.getMagnitude(),
                multiplier = 1 / magnitude;

            this.x *= multiplier;
            this.y *= multiplier;
            this.z *= multiplier;
        }
    });

    // Export
    return Vector3D;
});
