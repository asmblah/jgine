/*
 *  jGine Vertex3D class
 */
define([
    "js/util"
], function (
    util
) { "use strict";

    function Vertex3D(x, y, z) {
        util.assertConstructor(this, Vertex3D);

        this.x = x;
        this.y = y;
        this.z = z;
    }

    util.extend(Vertex3D.prototype, {

    });

    // Export
    return Vertex3D;
});
