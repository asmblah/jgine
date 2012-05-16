/*
 *  jGine Object class
 */
define([
    "js/util"
], function(
    util
) {

    function Object(worldMatrix) {
        util.assertConstructor(this, Object);

        this.worldMatrix = worldMatrix; // Or "ModelView" matrix
        this.meshes = [];
        this.boundingBox = null;
        this.boundingSphere = null;
        this.boundingFrustum = null;
    }

    util.extend(Object, {

    });

    util.extend(Object.prototype, {
        addMesh: function(mesh) {
            this.meshes.push(mesh);
        },
        getBoundingBox: function() {

        },
        getBoundingSphere: function() {

        },
        getBoundingFrustum: function() {

        }
    });

    // Export
    return Object;
});
