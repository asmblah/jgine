/*
 *  jGine Matrix4D class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Matrix4D() {
        util.assertConstructor(this, Matrix4D);

        this.m11 = this.m12 = this.m13 = this.m14 =
        this.m21 = this.m22 = this.m23 = this.m24 =
        this.m31 = this.m32 = this.m33 = this.m34 =
        this.m41 = this.m42 = this.m43 = this.m44 = 0;
    }

    util.extend(Matrix4D, {
        getIdentity: function() {
            return new Matrix4D().loadIdentity();
        }
    });

    util.extend(Matrix4D.prototype, {
        loadIdentity: function() {
            this.m11 = 1; this.m12 = 0; this.m13 = 0; this.m14 = 0;
            this.m21 = 0; this.m22 = 1; this.m23 = 0; this.m24 = 0;
            this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
            this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;

            return this;
        },
        multiplyMatrix: function(otherMatrix) {
            var result = new Matrix4D();

            result.m11 = this.m11
        },
        multiplyScalar: function(scalar) {
            var result = new Matrix();

            this.m11 *= scalar;
            this.m12 *= scalar;
            this.m13 *= scalar;
            this.m14 *= scalar;

            this.m21 *= scalar;
            this.m22 *= scalar;
            this.m23 *= scalar;
            this.m24 *= scalar;

            this.m31 *= scalar;
            this.m32 *= scalar;
            this.m33 *= scalar;
            this.m34 *= scalar;

            this.m41 *= scalar;
            this.m42 *= scalar;
            this.m43 *= scalar;
            this.m44 *= scalar;
        }
    });

    // Export
    return Matrix;
});
