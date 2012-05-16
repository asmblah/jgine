/*
 *  jGine Object class
 */
define([
    "js/util"
], function(
    util
) {

    function ObjectClass(name) {
        util.assertConstructor(this, ObjectClass);

        this.name = name;
        //this.worldMatrix = worldMatrix; // Or "ModelView" matrix
        this.meshes = [];
        this.boundingBox = null;
        this.boundingSphere = null;
        this.boundingFrustum = null;
    }

    util.extend(ObjectClass.prototype, {
        addMesh: function (mesh) {
            this.meshes.push(mesh);
        },
        getBoundingBox: function () {

        },
        getBoundingSphere: function () {

        },
        getBoundingFrustum: function () {

        },
        getName: function () {
            return this.name;
        },
        render: function () {

        }
    });

    // Export
    return ObjectClass;
});
