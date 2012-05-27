/*
 *  jGine Vector2D class
 */
define([
    "js/util",
    "../Vector"
], function(
    util,
    Vector
) { "use strict";

    function Vector2D(x, y) {
        util.assertConstructor(this, Vector2D);

        this.x = x;
        this.y = y;
    }

    Vector2D.prototype = Object.create(Vector.prototype);

    util.extend(Vector2D.prototype, {
        getMagnitude: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        normalize: function () {
            var magnitude = this.getMagnitude(),
                multiplier = 1 / magnitude;

            this.x *= multiplier;
            this.y *= multiplier;
        },
        transform: function (matrix3D) {

        },
        copyTo: function (vector) {
            vector.x = this.x;
            vector.y = this.y;

            return this;
        }
    });

    // Export
    return Vector2D;
});
