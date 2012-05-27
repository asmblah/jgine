/*
 *  jGine FaceRenderable class
 */
define([
    "js/util",
    "../Promise",
    "../Renderable",
    "../Vector/4D"
], function (
    util,
    Promise,
    Renderable,
    Vector4D
) { "use strict";

    function FaceRenderable(renderer, material) {
        util.assertConstructor(this, FaceRenderable);

        Renderable.call(this, renderer, material);
    }

    FaceRenderable.prototype = Object.create(Renderable.prototype);

    util.extend(FaceRenderable.prototype, {
        render: function (modelViewMatrix, projectionMatrix, faces) {
            var faceIdx,
                vertexIdx,
                numFaces = faces.length,
                face,
                x,
                y,
                z,
                vector1 = new Vector4D(),
                vector2 = new Vector4D(),
                vector3 = new Vector4D(),
                faceNormal = new Vector4D(),
                edgeVector1 = new Vector4D(),
                edgeVector2 = new Vector4D(),
                modelViewProjectionMatrix = modelViewMatrix.clone().multiplyMatrix(projectionMatrix),
                screenWidth = this.renderer.getWidth(),
                screenHeight = this.renderer.getHeight(),
                halfScreenWidth = screenWidth / 2,
                halfScreenHeight = screenHeight / 2,
                triangles = [];

            this.use(modelViewMatrix, projectionMatrix);

            for (faceIdx = 0 ; faceIdx < numFaces ; ++faceIdx) {
                face = faces[faceIdx];

                face.vertex1.position.copyTo(vector1);
                // normal1
                face.vertex2.position.copyTo(vector2);
                // normal2
                face.vertex3.position.copyTo(vector3);
                // normal3

                // Object space -> Eye space -> Clip space
                vector1.transform(modelViewProjectionMatrix);
                vector2.transform(modelViewProjectionMatrix);
                vector3.transform(modelViewProjectionMatrix);

                // Get edge vectors
                edgeVector1.x = vector2.x - vector1.x;
                edgeVector1.y = vector2.y - vector1.y;
                edgeVector1.z = vector2.z - vector1.z;
                edgeVector2.x = vector3.x - vector1.x;
                edgeVector2.y = vector3.y - vector1.y;
                edgeVector2.z = vector3.z - vector1.z;

                // Calc face normal @ 90deg to face
                faceNormal.crossFrom(edgeVector1, edgeVector2);

                // Cull if back-facing
                if (vector1.dot(faceNormal) < 0) {
                    continue;
                }

                // Once in clip space we can cull entire polygons if they are entirely behind one plane
                // - TODO: can results of frustum cull test be reused by adjacent faces?
                if (
                    // Near plane (most likely, so test this first for an early-out
                    //  as we use short-circuit boolean OR evaluation of these)
                    (vector1.z < -vector1.w && vector2.z < -vector2.w && vector3.z < -vector3.w) ||
                    // Left plane
                    (vector1.x < -vector1.w && vector2.x < -vector2.w && vector3.x < -vector3.w) ||
                    // Right plane
                    (vector1.x > vector1.w && vector2.x > vector2.w && vector3.x > vector3.w) ||
                    // Top plane
                    (vector1.y < -vector1.w && vector2.y < -vector2.w && vector3.y < -vector3.w) ||
                    // Bottom plane
                    (vector1.y > vector1.w && vector2.y > vector2.w && vector3.y > vector3.w) ||
                    // Far plane (least likely, so test this last - see near plane test notes)
                    (vector1.z > vector1.w && vector2.z > vector2.w && vector3.z > vector3.w)
                ) {
                    continue;
                }

                // Clip space -> Normalized Device Coordinates
                vector1.x /= vector1.w; vector1.y /= vector1.w; vector1.z /= vector1.w;
                vector2.x /= vector2.w; vector2.y /= vector2.w; vector2.z /= vector2.w;
                vector3.x /= vector3.w; vector3.y /= vector3.w; vector3.z /= vector3.w;

                // NDCs -> Output Device Coordinates & then push
                triangles[triangles.length] = {
                    x1: vector1.x * halfScreenWidth + halfScreenWidth,
                    y1: -vector1.y * halfScreenHeight + halfScreenHeight,
                    z1: vector1.z,

                    x2: vector2.x * halfScreenWidth + halfScreenWidth,
                    y2: -vector2.y * halfScreenHeight + halfScreenHeight,
                    z2: vector2.z,

                    x3: vector3.x * halfScreenWidth + halfScreenWidth,
                    y3: -vector3.y * halfScreenHeight + halfScreenHeight,
                    z3: vector3.z,

                    centroid: (vector1.z + vector2.z + vector3.z) / 3,

                    u1: face.vertex1.uv.u, v1: face.vertex1.uv.v,
                    u2: face.vertex2.uv.u, v2: face.vertex2.uv.v,
                    u3: face.vertex3.uv.u, v3: face.vertex3.uv.v
                };
            }

            this.depthSortTriangles(triangles);
            this.fillTriangles(triangles);
        },
        depthSortTriangles: function (triangles) {
            triangles.sort(function (a, b) {
                return b.centroid - a.centroid;
            });
        },
        fillTriangles: function (triangles) {
            var triangleIdx,
                numTriangles = triangles.length,
                triangle;

            for (triangleIdx = 0 ; triangleIdx < numTriangles ; ++triangleIdx) {
                triangle = triangles[triangleIdx];

                this.fillTriangle(
                    triangle.x1, triangle.y1,
                    triangle.x2, triangle.y2,
                    triangle.x3, triangle.y3,
                    triangle.u1, triangle.v1,
                    triangle.u2, triangle.v2,
                    triangle.u3, triangle.v3
                );
            }
        },
        fillTriangle: function (x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
            abstract();
        }
    });

    // Export
    return FaceRenderable;
});
