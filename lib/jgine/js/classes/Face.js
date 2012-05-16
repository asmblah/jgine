/*
 *  jGine Face class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Face() {
        util.assertConstructor(this, Face);

        this.vertices = [];
        this.smoothShading = false;
    }

    util.extend(Face, {

    });

    util.extend(Face.prototype, {
        addVertex: function (vertex) {
            this.vertices.push(vertex);
        },
        enableSmoothShading: function () {
            this.smoothShading = true;
        },
        disableSmoothShading: function () {
            this.smoothShading = false;
        }
    });

    // Export
    return Face;
});
