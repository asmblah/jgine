/*
 *  jGine Quadtree class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Quadtree() {
        util.assertConstructor(this, Quadtree);

        this.northWest = null;
        this.northEast = null;
        this.southWest = null;
        this.southEast = null;
    }

    util.extend(Quadtree.prototype, {
        subdivide: function () {
            
        }
    });

    // Export
    return Quadtree;
});
