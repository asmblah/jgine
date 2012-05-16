/*
 *  jGine Object class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

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
            console.debug("Object '" + this.getName() + "' rendered");
        }
    });

    // Export
    return ObjectClass;
});
