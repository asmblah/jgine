/*
 *  jGine Matrix4D class
 */
define([
    "js/util"
], function (
    util
) { "use strict";

    // 4x4 matrix with column-major order (as per OpenGL)
    function Matrix4D() {
        util.assertConstructor(this, Matrix4D);

        this.m11 = this.m12 = this.m13 = this.m14 =
        this.m21 = this.m22 = this.m23 = this.m24 =
        this.m31 = this.m32 = this.m33 = this.m34 =
        this.m41 = this.m42 = this.m43 = this.m44 = 0;

        this.stack = [];
    }

    util.extend(Matrix4D.prototype, {
        push: function () {
            var state = {
                m11: this.m11, m21: this.m21, m31: this.m31, m41: this.m41,
                m12: this.m12, m22: this.m22, m32: this.m32, m42: this.m42,
                m13: this.m13, m23: this.m23, m33: this.m33, m43: this.m43,
                m14: this.m14, m24: this.m24, m34: this.m34, m44: this.m44
            };

            this.stack.push(state);

            return this;
        },
        pop: function () {
            var state = this.stack.pop();

            this.m11 = state.m11; this.m12 = state.m12; this.m13 = state.m13; this.m14 = state.m14;
            this.m21 = state.m21; this.m22 = state.m22; this.m23 = state.m23; this.m24 = state.m24;
            this.m31 = state.m31; this.m32 = state.m32; this.m33 = state.m33; this.m34 = state.m34;
            this.m41 = state.m41; this.m42 = state.m42; this.m43 = state.m43; this.m44 = state.m44;

            return this;
        },
        loadIdentity: function () {
            this.m11 = 1; this.m21 = 0; this.m31 = 0; this.m41 = 0;
            this.m12 = 0; this.m22 = 1; this.m32 = 0; this.m42 = 0;
            this.m13 = 0; this.m23 = 0; this.m33 = 1; this.m43 = 0;
            this.m14 = 0; this.m24 = 0; this.m34 = 0; this.m44 = 1;

            return this;
        },
        makeLookAt: function (ex, ey, ez, cx, cy, cz, ux, uy, uz) {
            /*
            var eye = $V([ex, ey, ez]);
            var center = $V([cx, cy, cz]);
            var up = $V([ux, uy, uz]);

            var mag;

            var z = eye.subtract(center).toUnitVector();
            var x = up.cross(z).toUnitVector();
            var y = z.cross(x).toUnitVector();

            var m = $M([[x.e(1), x.e(2), x.e(3), 0],
                        [y.e(1), y.e(2), y.e(3), 0],
                        [z.e(1), z.e(2), z.e(3), 0],
                        [0, 0, 0, 1]]);

            var t = $M([[1, 0, 0, -ex],
                        [0, 1, 0, -ey],
                        [0, 0, 1, -ez],
                        [0, 0, 0, 1]]);
            return m.x(t);
            */
        },
        makeOrthographic: function (left, right, bottom, top, zNear, zFar) {
            /*
            var tx = -(right+left)/(right-left);
            var ty = -(top+bottom)/(top-bottom);
            var tz = -(zfar+znear)/(zfar-znear);

            return $M([[2/(right-left), 0, 0, tx],
                       [0, 2/(top-bottom), 0, ty],
                       [0, 0, -2/(zfar-znear), tz],
                       [0, 0, 0, 1]]);
            */
        },
        makePerspective: function (fovY, aspectRatio, zNear, zFar) {
            var ymax = zNear * Math.tan(fovY * Math.PI / 360.0),
                ymin = -ymax,
                xmin = ymin * aspectRatio,
                xmax = ymax * aspectRatio;

            return this.makeFrustum(xmin, xmax, ymin, ymax, zNear, zFar);
        },
        makeFrustum: function (left, right, bottom, top, zNear, zFar) {
            var X = 2*zNear/(right-left),
                Y = 2*zNear/(top-bottom),

                A = (right+left)/(right-left),
                B = (top+bottom)/(top-bottom),
                C = -(zFar+zNear)/(zFar-zNear),
                D = -2*zFar*zNear/(zFar-zNear);

            /*this.m11 = X; this.m12 = 0; this.m13 = A; this.m14 = 0;
            this.m21 = 0; this.m22 = Y; this.m23 = B; this.m24 = 0;
            this.m31 = 0; this.m32 = 0; this.m33 = C; this.m34 = D;
            this.m41 = 0; this.m42 = 0; this.m43 = -1; this.m44 = 0;*/

            this.m11 = X; this.m21 = 0; this.m31 = A; this.m41 = 0;
            this.m12 = 0; this.m22 = Y; this.m32 = B; this.m42 = 0;
            this.m13 = 0; this.m23 = 0; this.m33 = C; this.m43 = D;
            this.m14 = 0; this.m24 = 0; this.m34 = -1; this.m44 = 0;

            return this;
        },
        multiplyMatrix: function (otherMatrix) {
            var m11 = this.m11 * otherMatrix.m11 + this.m12 * otherMatrix.m21 + this.m13 * otherMatrix.m31 + this.m14 * otherMatrix.m41,
                m12 = this.m11 * otherMatrix.m12 + this.m12 * otherMatrix.m22 + this.m13 * otherMatrix.m32 + this.m14 * otherMatrix.m42,
                m13 = this.m11 * otherMatrix.m13 + this.m12 * otherMatrix.m23 + this.m13 * otherMatrix.m33 + this.m14 * otherMatrix.m43,
                m14 = this.m11 * otherMatrix.m14 + this.m12 * otherMatrix.m24 + this.m13 * otherMatrix.m34 + this.m14 * otherMatrix.m44,

                m21 = this.m21 * otherMatrix.m11 + this.m22 * otherMatrix.m21 + this.m23 * otherMatrix.m31 + this.m24 * otherMatrix.m41,
                m22 = this.m21 * otherMatrix.m12 + this.m22 * otherMatrix.m22 + this.m23 * otherMatrix.m32 + this.m24 * otherMatrix.m42,
                m23 = this.m21 * otherMatrix.m13 + this.m22 * otherMatrix.m23 + this.m23 * otherMatrix.m33 + this.m24 * otherMatrix.m43,
                m24 = this.m21 * otherMatrix.m14 + this.m22 * otherMatrix.m24 + this.m23 * otherMatrix.m34 + this.m24 * otherMatrix.m44,

                m31 = this.m31 * otherMatrix.m11 + this.m32 * otherMatrix.m21 + this.m33 * otherMatrix.m31 + this.m34 * otherMatrix.m41,
                m32 = this.m31 * otherMatrix.m12 + this.m32 * otherMatrix.m22 + this.m33 * otherMatrix.m32 + this.m34 * otherMatrix.m42,
                m33 = this.m31 * otherMatrix.m13 + this.m32 * otherMatrix.m23 + this.m33 * otherMatrix.m33 + this.m34 * otherMatrix.m43,
                m34 = this.m31 * otherMatrix.m14 + this.m32 * otherMatrix.m24 + this.m33 * otherMatrix.m34 + this.m34 * otherMatrix.m44,

                m41 = this.m41 * otherMatrix.m11 + this.m42 * otherMatrix.m21 + this.m43 * otherMatrix.m31 + this.m44 * otherMatrix.m41,
                m42 = this.m41 * otherMatrix.m12 + this.m42 * otherMatrix.m22 + this.m43 * otherMatrix.m32 + this.m44 * otherMatrix.m42,
                m43 = this.m41 * otherMatrix.m13 + this.m42 * otherMatrix.m23 + this.m43 * otherMatrix.m33 + this.m44 * otherMatrix.m43,
                m44 = this.m41 * otherMatrix.m14 + this.m42 * otherMatrix.m24 + this.m43 * otherMatrix.m34 + this.m44 * otherMatrix.m44;

            this.m11 = m11; this.m21 = m21; this.m31 = m31; this.m41 = m41;
            this.m12 = m12; this.m22 = m22; this.m32 = m32; this.m42 = m42;
            this.m13 = m13; this.m23 = m23; this.m33 = m33; this.m43 = m43;
            this.m14 = m14; this.m24 = m24; this.m34 = m34; this.m44 = m44;

            return this;
        },
        multiplyScalar: function (scalar) {
            this.m11 *= scalar; this.m21 *= scalar; this.m31 *= scalar; this.m41 *= scalar;
            this.m12 *= scalar; this.m22 *= scalar; this.m32 *= scalar; this.m42 *= scalar;
            this.m13 *= scalar; this.m23 *= scalar; this.m33 *= scalar; this.m43 *= scalar;
            this.m14 *= scalar; this.m24 *= scalar; this.m34 *= scalar; this.m44 *= scalar;

            return this;
        },
        translate: function (x, y, z) {
            /*var translationMatrix = new Matrix4D().loadIdentity();

            translationMatrix.m12 = x;
            translationMatrix.m13 = y;
            translationMatrix.m14 = z;

            return this.multiplyMatrix(translationMatrix);*/

            //this.m14 = this.m11 * x + this.m12 * y + this.m13 * z + this.m14;
            //this.m24 = this.m21 * x + this.m22 * y + this.m23 * z + this.m24;
            //this.m34 = this.m31 * x + this.m32 * y + this.m33 * z + this.m34;
            //this.m44 = this.m41 * x + this.m42 * y + this.m43 * z + this.m44;

            this.m41 = x;
            this.m42 = y;
            this.m43 = z;

            return this;
        },
        rotateY: function (angle) {
            var m11 = this.m11,
                m21 = this.m21,
                m31 = this.m31,
                m41 = this.m41,
                m13 = this.m13,
                m23 = this.m23,
                m33 = this.m33,
                m43 = this.m43,
                c = Math.cos(angle),
                s = Math.sin(angle);

            this.m11 = c * m11 - s * m13;
            this.m21 = c * m21 - s * m23;
            this.m31 = c * m31 - s * m33;
            this.m41 = c * m41 - s * m43;

            this.m13 = c * m13 + s * m11;
            this.m23 = c * m23 + s * m21;
            this.m33 = c * m33 + s * m31;
            this.m43 = c * m43 + s * m41;

            return this;
        },
        flatten: function () {
            /*debugger;*/
            return [
                this.m11, this.m12, this.m13, this.m14,
                this.m21, this.m22, this.m23, this.m24,
                this.m31, this.m32, this.m33, this.m34,
                this.m41, this.m42, this.m43, this.m44
            ];
            /*return [
                this.m11, this.m21, this.m31, this.m41,
                this.m12, this.m22, this.m32, this.m42,
                this.m13, this.m23, this.m33, this.m43,
                this.m14, this.m24, this.m34, this.m44
            ];*/
        },
        copyTo: function (toMatrix) {
            toMatrix.m11 = this.m11; toMatrix.m21 = this.m21; toMatrix.m31 = this.m31; toMatrix.m41 = this.m41;
            toMatrix.m12 = this.m12; toMatrix.m22 = this.m22; toMatrix.m32 = this.m32; toMatrix.m42 = this.m42;
            toMatrix.m13 = this.m13; toMatrix.m23 = this.m23; toMatrix.m33 = this.m33; toMatrix.m43 = this.m43;
            toMatrix.m14 = this.m14; toMatrix.m24 = this.m24; toMatrix.m34 = this.m34; toMatrix.m44 = this.m44;

            return toMatrix;
        },
        clone: function () {
            return this.copyTo(new Matrix4D());
        }
    });

    /*var matrixA = new Matrix4D().loadIdentity(),
        matrixB = new Matrix4D().loadIdentity();

    matrixA.multiplyMatrix(matrixB);

    debugger;*/

    // Export
    return Matrix4D;
});
