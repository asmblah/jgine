/*
 *  jGine FaceVertex3D class
 */
define([
    "js/util"
], function (
    util
) { "use strict";

    function FaceVertex3D(vertex, vertexIndex, uv, normal) {
        util.assertConstructor(this, FaceVertex3D);

        this.vertex = vertex;
        this.vertexIndex = vertexIndex;
        this.uv = uv;
        this.normal = normal;
    }

    util.extend(FaceVertex3D.prototype, {

    });

    // Export
    return FaceVertex3D;
});
