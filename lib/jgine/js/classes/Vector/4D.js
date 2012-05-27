/*
 *  jGine Vector4D class
 */
define([
    "js/util",
    "../Vector"
], function (
    util,
    Vector
) { "use strict";
    
    var undefined;

    function Vector4D(x, y, z, w) {
        util.assertConstructor(this, Vector4D);

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w === undefined ? 1 : w;
    }

    Vector4D.prototype = Object.create(Vector.prototype);

    util.extend(Vector4D.prototype, {
        getMagnitude: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        normalize: function () {
            var magnitude = this.getMagnitude(),
                multiplier = 1 / magnitude;

            this.x *= multiplier;
            this.y *= multiplier;
            this.z *= multiplier;

            return this;
        },
        transform: function (matrix4D) {
            var vx = this.x, vy = this.y, vz = this.z, vw = this.w;

            this.x = matrix4D.m11 * vx + matrix4D.m21 * vy + matrix4D.m31 * vz + matrix4D.m41 * vw;
            this.y = matrix4D.m12 * vx + matrix4D.m22 * vy + matrix4D.m32 * vz + matrix4D.m42 * vw;
            this.z = matrix4D.m13 * vx + matrix4D.m23 * vy + matrix4D.m33 * vz + matrix4D.m43 * vw;
            this.w = matrix4D.m14 * vx + matrix4D.m24 * vy + matrix4D.m34 * vz + matrix4D.m44 * vw;

            return this;
        },
        dot: function (withVector) {
            return this.x * withVector.x + this.y * withVector.y + this.z * withVector.z;
        },
        cross: function (withVector) {
            var x = this.x,
                y = this.y,
                z = this.z;

            this.x = y * withVector.z - z * withVector.y;
            this.y = z * withVector.x - x * withVector.z;
            this.z = x * withVector.y - y * withVector.x;

            return this;
        },
        crossFrom: function (vector1, vector2) {
            vector1.copyTo(this);
            this.cross(vector2);
        },
        copyTo: function (vector) {
            vector.x = this.x;
            vector.y = this.y;
            vector.z = this.z;
            vector.w = this.w;

            return this;
        }
    });

    // Export
    return Vector4D;
});
