/*
 *  jGine Object class
 */
define([
    "js/util",
    "./Matrix/4D"
], function (
    util,
    Matrix4D
) { "use strict";

    var hasOwnProperty = {}.hasOwnProperty;

    function ObjectClass(name) {
        util.assertConstructor(this, ObjectClass);

        // Properties
        this.name = name || null;
        this.meshes = [];
        this.worldMatrix = new Matrix4D().loadIdentity();
        this.boundingBox = null;
        this.boundingSphere = null;
        this.boundingFrustum = null;
    }

    util.extend(ObjectClass.prototype, {
        addMesh: function (mesh) {
            this.meshes.push(mesh);

            return this;
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
        load: function (renderer) {
            // ...
        },
        render: function (renderer, fromObject) {
            var meshes = this.meshes,
                name;

            for (name in meshes) {
                if (hasOwnProperty.call(meshes, name)) {
                    meshes[name].render(renderer, fromObject);
                }
            }
        },
        getWorldMatrix: function () {
            return this.worldMatrix;
        }
    });

    // Export
    return ObjectClass;
});
