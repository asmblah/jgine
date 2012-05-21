/*
 *  jGine Face class
 */
define([
    "js/util"
], function (
    util
) { "use strict";

    function Face(vertex1, vertex2, vertex3) {
        util.assertConstructor(this, Face);

        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.vertex3 = vertex3;
    }

    util.extend(Face.prototype, {

    });

    // Export
    return Face;
});
