/*
 *  jGine Vertex2D class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Vertex2D(x, y) {
        util.assertConstructor(this, Vertex2D);

        this.x = x;
        this.y = y;
    }

    util.extend(Vertex2D.prototype, {

    });

    // Export
    return Vertex2D;
});
