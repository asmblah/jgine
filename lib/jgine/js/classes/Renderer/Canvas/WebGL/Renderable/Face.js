/*
 *  jGine WebGLFaceRenderable class
 */
define([
    "js/util",
    "../../../../Promise",
    "../../../../Renderable/Face",
    "../../../../Matrix/4D"
], function (
    util,
    Promise,
    FaceRenderable,
    Matrix4D
) { "use strict";

    function WebGLFaceRenderable(renderer, material) {
        util.assertConstructor(this, WebGLFaceRenderable);

        FaceRenderable.call(this, renderer, material);

        // Properties
        this.program = null;
        this.vertexPositionAttribute = null;
        this.uvAttribute = null;
        this.loaded = false; // TODO: This is inefficient

        this.modelViewUniform = null;
        this.projectionUniform = null;
        this.textureUniforms = [];
        this.glTextures = [];
    }

    WebGLFaceRenderable.prototype = Object.create(FaceRenderable.prototype);

    util.extend(WebGLFaceRenderable.prototype, {
        init: function (textures) {
            var gl = this.renderer.getGL(),
                program = gl.createProgram(),
                vertexShader = compileShader(gl, gl.VERTEX_SHADER, getScript("vertexShader")),
                fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, getScript("fragmentShader")),
                textureUniforms = this.textureUniforms,
                glTextures = this.glTextures,
                textureIdx = 0;

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw new Error("Failed to link program");
            }

            gl.useProgram(program);

            this.program = program;
            this.modelViewUniform = gl.getUniformLocation(program, "uMVMatrix");
            this.projectionUniform = gl.getUniformLocation(program, "uPMatrix");

            locateAttributesForGL(gl, this);

            util.each(textures, function () {
                var textureUniform = gl.getUniformLocation(program, "uSampler" + textureIdx),
                    glTexture = gl.createTexture();

                gl.activeTexture(gl.TEXTURE0);
                gl.uniform1i(textureUniform, 0);

                gl.bindTexture(gl.TEXTURE_2D, glTexture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.getImage());
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);

                textureUniforms[textureIdx] = textureUniform;
                glTextures[textureIdx] = glTexture;

                ++textureIdx;
            });
        },
        use: function (modelViewMatrix, projectionMatrix) {
            var gl = this.renderer.getGL();

            gl.useProgram(this.program);
            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(this.textureUniforms[0], 0);
            gl.bindTexture(gl.TEXTURE_2D, this.glTextures[0]);

            gl.uniformMatrix4fv(this.modelViewUniform, false, new Float32Array(modelViewMatrix.flatten()));
            gl.uniformMatrix4fv(this.projectionUniform, false, new Float32Array(projectionMatrix.flatten()));
        },
        render: function (modelViewMatrix, projectionMatrix, faces) {
            var gl = this.renderer.getGL();

            this.use(modelViewMatrix, projectionMatrix);

            if (!faces.verticesBuffer) {
                buildFacesBuffer(gl, faces);
            }

            passFacesToGL(gl, this, faces.verticesBuffer, faces.verticesArray, faces.length);
        }
    });

    function getScript(id) {
        return document.getElementById(id).textContent;
    }

    function compileShader(gl, type, code) {
        var shader = gl.createShader(type);

        gl.shaderSource(shader, code);

        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error("Failed to compile shader: " + gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    function locateAttributesForGL(gl, renderable) {
        var vertexPositionAttribute = gl.getAttribLocation(renderable.program, "aVertexPosition"),
            uvAttribute = gl.getAttribLocation(renderable.program, "aTextureCoord");

        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.enableVertexAttribArray(uvAttribute);

        renderable.vertexPositionAttribute = vertexPositionAttribute;
        renderable.uvAttribute = uvAttribute;
    }

    function buildFacesBuffer(gl, faces) {
        var numFaces = faces.length,
            faceIndex,
            vboIndex,
            face,
            verticesArray = new Float32Array(faces.length * 3 * (3 + 3 + 2));

        for (faceIndex = 0, vboIndex = -1 ; faceIndex < numFaces ; ++faceIndex) {
            face = faces[faceIndex];

            // Interleaved VBO
            verticesArray[++vboIndex] = face.vertex1.position.x;
            verticesArray[++vboIndex] = face.vertex1.position.y;
            verticesArray[++vboIndex] = face.vertex1.position.z;
            verticesArray[++vboIndex] = face.vertex1.normal.x;
            verticesArray[++vboIndex] = face.vertex1.normal.y;
            verticesArray[++vboIndex] = face.vertex1.normal.z;
            verticesArray[++vboIndex] = face.vertex1.uv.u;
            verticesArray[++vboIndex] = face.vertex1.uv.v;

            verticesArray[++vboIndex] = face.vertex2.position.x;
            verticesArray[++vboIndex] = face.vertex2.position.y;
            verticesArray[++vboIndex] = face.vertex2.position.z;
            verticesArray[++vboIndex] = face.vertex2.normal.x;
            verticesArray[++vboIndex] = face.vertex2.normal.y;
            verticesArray[++vboIndex] = face.vertex2.normal.z;
            verticesArray[++vboIndex] = face.vertex2.uv.u;
            verticesArray[++vboIndex] = face.vertex2.uv.v;

            verticesArray[++vboIndex] = face.vertex3.position.x;
            verticesArray[++vboIndex] = face.vertex3.position.y;
            verticesArray[++vboIndex] = face.vertex3.position.z;
            verticesArray[++vboIndex] = face.vertex3.normal.x;
            verticesArray[++vboIndex] = face.vertex3.normal.y;
            verticesArray[++vboIndex] = face.vertex3.normal.z;
            verticesArray[++vboIndex] = face.vertex3.uv.u;
            verticesArray[++vboIndex] = face.vertex3.uv.v;
        }

        faces.verticesBuffer = gl.createBuffer();
        faces.verticesArray = verticesArray;
    }

    function passFacesToGL(gl, renderable, verticesBuffer, verticesArray, numFaces) {
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesArray, gl.STATIC_DRAW);
        gl.vertexAttribPointer(renderable.vertexPositionAttribute, 3, gl.FLOAT, false, 8*4, 0*4); // Position
        //gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8*4, 3*4); // Normal
        gl.vertexAttribPointer(renderable.uvAttribute, 2, gl.FLOAT, false, 8*4, 6*4); // UV

        // TODO: Use drawElements(...)?
        gl.drawArrays(gl.TRIANGLES, 0, numFaces * 3);
    }

    // Export
    return WebGLFaceRenderable;
});
