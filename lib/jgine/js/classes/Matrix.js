/*
 *  jGine Matrix class
 */
define([
    "js/util"
], function(
    util
) {

    function Matrix() {
        util.assertConstructor(this, Matrix);

        this.m11 = this.m12 = this.m13 = this.m14 =
        this.m21 = this.m22 = this.m23 = this.m24 =
        this.m31 = this.m32 = this.m33 = this.m34 =
        this.m41 = this.m42 = this.m43 = this.m44 = 0;
    }

    util.extend(Matrix, {
        getIdentity: function() {
            return new Matrix().loadIdentity();
        }
    });

    util.extend(Matrix.prototype, {
        loadIdentity: function() {
            this.m11 = 1; this.m12 = 0; this.m13 = 0; this.m14 = 0;
            this.m21 = 0; this.m22 = 1; this.m23 = 0; this.m24 = 0;
            this.m31 = 0; this.m32 = 0; this.m33 = 1; this.m34 = 0;
            this.m41 = 0; this.m42 = 0; this.m43 = 0; this.m44 = 1;

            return this;
        },
        multiplyMatrix: function(otherMatrix) {
            var result = new Matrix();

            result.m11 = this.m11
        },
        multiplyScalar: function(scalar) {
            var result = new Matrix();

            result.m11 = this.m11 * scalar;
            result.m12 = this.m12 * scalar;
            result.m13 = this.m13 * scalar;
            result.m14 = this.m14 * scalar;

            result.m21 = this.m21 * scalar;
            result.m22 = this.m22 * scalar;
            result.m23 = this.m23 * scalar;
            result.m24 = this.m24 * scalar;

            result.m31 = this.m31 * scalar;
            result.m32 = this.m32 * scalar;
            result.m33 = this.m33 * scalar;
            result.m34 = this.m34 * scalar;

            result.m41 = this.m41 * scalar;
            result.m42 = this.m42 * scalar;
            result.m43 = this.m43 * scalar;
            result.m44 = this.m44 * scalar;
        }
    });

    // Export
    return Matrix;
});
