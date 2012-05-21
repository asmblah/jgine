/*
 *  jGine Mesh class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Mesh(vertices, uvs, normals) {
        util.assertConstructor(this, Mesh);

        // Properties
        this.vertices = vertices;
        this.uvs = uvs;
        this.normals = normals;
        this.name = name;
        this.faces = [];
        this.material = null;
        this.smoothShading = false;
    }

    util.extend(Mesh.prototype, {
        setMaterial: function (material) {
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
                projectionMatrix = fromObject.getProjectionMatrix(),
                rendererMaterial = this.material.getRendererMaterial(renderer);

            // Select this mesh's material for rendering
            //this.material.use(renderer);

            rendererMaterial.render(
                modelViewMatrix,
                projectionMatrix,
                this.vertices,
                this.faces,
                this.uvs,
                this.normals
            );

            /* //renderer.renderMesh(this, fromObject);

            //console.debug("Rendered " + this.faces.length + " faces");

            var gl = this.webGL.getGL(),
                modelViewMatrix = fromObject.getWorldMatrix(),
                projectionMatrix = fromObject.getProjectionMatrix();

            //modelViewMatrix.push();

            // One-time WebGL setup for mesh
            // TODO: Move this to somewhere more appropriate?
            if (!mesh.verticesBuffer) {
                createUniformsForGL(gl, this, mesh);
                createVertexBufferForGL(gl, mesh);
                createVertexIndicesBufferForGL(gl, mesh);
                createTexturesForGL(gl, mesh);
            }

            passUniformsToGL(gl, this, mesh, modelViewMatrix, projectionMatrix);
            passMeshVerticesToGL(gl, this, mesh);
            //passTexturesToGL(gl, mesh);
            passMeshFacesToGL(gl, mesh);

            //modelViewMatrix.pop();*/
        }
    });

    // Export
    return Mesh;
});
