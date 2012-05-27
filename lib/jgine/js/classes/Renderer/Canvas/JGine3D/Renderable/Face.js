/*
 *  jGine JGine3DFaceRenderable class
 */
define([
    "js/util",
    "../../../../Promise",
    "../../../../Renderable/Face",
    "../../../../Matrix/4D"
], function (
    util,
    Promise,
    FaceRenderable,
    Matrix4D
) { "use strict";

    function JGine3DFaceRenderable(renderer, material) {
        util.assertConstructor(this, JGine3DFaceRenderable);

        FaceRenderable.call(this, renderer, material);

        // Properties
        this.textures = null;

        this.pattern = null;
    }

    JGine3DFaceRenderable.prototype = Object.create(FaceRenderable.prototype);

    util.extend(JGine3DFaceRenderable.prototype, {
        init: function (textures) {
            var gl = this.renderer.getGL(),
                renderable = this;

            util.each(textures, function () {
                // UV wrapping is supported by repeating patterns
                // FIXME: Ignores all textures other than 1st one at the moment
                renderable.pattern = gl.createPattern(this.getImage(), "repeat");
            });

            this.textures = textures;
        },
        use: function () {
            var gl = this.renderer.getGL();

            gl.fillStyle = this.pattern;
        },
        fillTriangles: function (triangles) {
            var triangleIdx,
                numTriangles = triangles.length,
                triangle,
                renderable = this.material.renderable,
                uvScaleX = renderable.textures[0].getImage().width,
                uvScaleY = renderable.textures[0].getImage().height;

            for (triangleIdx = 0 ; triangleIdx < numTriangles ; ++triangleIdx) {
                triangle = triangles[triangleIdx];

                this.fillTriangle(
                    triangle.x1, triangle.y1,
                    triangle.x2, triangle.y2,
                    triangle.x3, triangle.y3,

                    // Scale UVs
                    triangle.u1 * uvScaleX, (1 - triangle.v1) * uvScaleY,
                    triangle.u2 * uvScaleX, (1 - triangle.v2) * uvScaleY,
                    triangle.u3 * uvScaleX, (1 - triangle.v3) * uvScaleY
                );
            }
        },
        /*
         * Uses affine texture mapping to draw a textured triangle
         * at screen coordinates [x0, y0], [x1, y1], [x2, y2] from
         * img *pixel* coordinates [u0, v0], [u1, v1], [u2, v2]
         *
         * See http://extremelysatisfactorytotalitarianism.com/blog/?p=2120
         */
        fillTriangle: function (x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
            var gl = this.renderer.getGL(),
                determinant,
                inverseDeterminant,
                a,
                b,
                c,
                d,
                e,
                f;

            gl.beginPath();
            gl.moveTo(x0, y0);
            gl.lineTo(x1, y1);
            gl.lineTo(x2, y2);
            gl.closePath();

            x1 -= x0;
            y1 -= y0;
            x2 -= x0;
            y2 -= y0;

            u1 -= u0;
            v1 -= v0;
            u2 -= u0;
            v2 -= v0;

            determinant = (u1 * v2 - u2 * v1);

            if (determinant === 0) {
                return;
            }

            inverseDeterminant = 1 / determinant;

            // Linear transformation
            a = (v2 * x1 - v1 * x2) * inverseDeterminant;
            b = (v2 * y1 - v1 * y2) * inverseDeterminant;
            c = (u1 * x2 - u2 * x1) * inverseDeterminant;
            d = (u1 * y2 - u2 * y1) * inverseDeterminant;

            // Translation
            e = x0 - a * u0 - c * v0;
            f = y0 - b * u0 - d * v0;

            gl.save();

            gl.transform(a, b, c, d, e, f);
            gl.fill();

            gl.restore();
        }
    });

    // Export
    return JGine3DFaceRenderable;
});
