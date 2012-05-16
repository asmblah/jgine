/*
 *  jGine Mesh class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Mesh() {
        util.assertConstructor(this, Mesh);

        this.faces = [];
    }

    util.extend(Mesh.prototype, {
        addFace: function (face) {
            this.faces.push(face);
        }
    });

    // Export
    return Mesh;
});
