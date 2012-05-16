/*
 *  jGine Vector base class
 */
define([
    "js/util"
], function(
    util
) {

    function Vector() {
        util.assertConstructor(this, Vector);
    }

    util.extend(Vector, {

    });

    util.extend(Vector.prototype, {
        dotProduct: function() {

        },
        crossProduct: function() {

        },
        intersect: function() {
            
        }
    });

    // Export
    return Vector;
});
