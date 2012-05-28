/*
 *  jGine Mesh class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Mesh(vertices, uvs, normals, name) {
        util.assertConstructor(this, Mesh);

        // Properties
        this.vertices = vertices || [];
        this.uvs = uvs || [];
        this.normals = normals || [];
        this.faces = [];
        this.name = name;
        this.material = null;
        this.smoothShading = false;
    }

    util.extend(Mesh.prototype, {
        setMaterial: function (material) {
            if (this.material) {
                throw new Error("Meshes may only use one material!");
            }
            this.material = material;
        },
        getMaterial: function () {
            return this.material;
        },
        toggleSmoothShading: function (enabled) {
            this.smoothShading = enabled;
        },
        render: function (renderer, fromObject) {
            var modelViewMatrix = fromObject.getWorldMatrix(),
                projectionMatrix = fromObject.getProjectionMatrix();

            this.material.render(modelViewMatrix, projectionMatrix, this.faces);
        }
    });

    // Export
    return Mesh;
});
