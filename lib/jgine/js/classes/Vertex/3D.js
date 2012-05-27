/*
 *  jGine Vertex3D class
 */
define([
    "js/util"
], function (
    util
) { "use strict";

    function Vertex3D(position, uv, normal) {
        util.assertConstructor(this, Vertex3D);

        this.position = position;
        this.uv = uv;
        this.normal = normal;
    }

    util.extend(Vertex3D.prototype, {

    });

    // Export
    return Vertex3D;
});
