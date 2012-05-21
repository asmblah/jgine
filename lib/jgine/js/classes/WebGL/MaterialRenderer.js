/*
 *  jGine WebGLMaterialRenderer class
 */
define([
    "js/util",
    "../Promise",
    "../MaterialRenderer",
    "../Matrix/4D"
], function (
    util,
    Promise,
    MaterialRenderer,
    Matrix4D
) { "use strict";

    function WebGLMaterialRenderer(webGL, material) {
        util.assertConstructor(this, WebGLMaterialRenderer);

        MaterialRenderer.call(this);

        // Dependencies
        this.webGL = webGL;
        this.material = material;

        // Properties
        this.program = null;
        this.vertexPositionAttribute = null;
        this.uvAttribute = null;
        this.loaded = false; // TODO: This is inefficient

        this.modelViewUniform = null;
        this.projectionUniform = null;
        this.textures = [];
        this.textureUniforms = [];
    }

    WebGLMaterialRenderer.prototype = Object.create(MaterialRenderer.prototype);

    util.extend(WebGLMaterialRenderer.prototype, {
        load: function () {
            var gl = this.webGL.getGL(),
                program = gl.createProgram(),
                vertexShader = compileShader(gl, gl.VERTEX_SHADER, getScript("vertexShader")),
                fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, getScript("fragmentShader")),
                samplerUniform,
                i;

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw new Error("Failed to link program");
            }

            this.program = program;
            this.modelViewUniform = gl.getUniformLocation(program, "uMVMatrix");
            this.projectionUniform = gl.getUniformLocation(program, "uPMatrix");

            for (i = 0 ; i < 32 ; ++i) {
                this.textureUniforms[i] = gl.getUniformLocation(program, "uSampler" + i);
            }

            locateAttributesForGL(gl, this);
        },
        unload: function () {
            // TODO
        },
        loadTexture: function (texture) {
            var gl = this.webGL.getGL(),
                image = texture.getImage(),
                glTexture = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);

            this.textures.push(glTexture);
        },
        render: function (modelViewMatrix, projectionMatrix, vertices, faces, uvs, normals, verticesBuffer, verticesArray) {
            var gl = this.webGL.getGL();

            verticesBuffer = gl.createBuffer();
            verticesArray = new Float32Array(faces.length * 3 * (3 + 3 + 2));

            // TODO: Handle loads better by loading/unloading when visible/invisible in scene
            if (!this.loaded) {
                this.load();
                this.loaded = true;
            }

            gl.useProgram(this.program);

            gl.uniformMatrix4fv(this.modelViewUniform, false, new Float32Array(modelViewMatrix.flatten()));
            gl.uniformMatrix4fv(this.projectionUniform, false, new Float32Array(projectionMatrix.flatten()));

            passTexturesToGL(gl, this);
            passFacesToGL(gl, this, faces, verticesBuffer, verticesArray);
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

    function passTexturesToGL(gl, materialRenderer) {
        var i,
            textures = materialRenderer.textures,
            textureUniforms = materialRenderer.textureUniforms;

        for (i = 0 ; i < textures.length ; ++i) {
            gl.activeTexture(gl["TEXTURE" + i]);
            gl.bindTexture(gl.TEXTURE_2D, textures[i]);
            gl.uniform1i(textureUniforms[i], 0);
        }
    }

    function locateAttributesForGL(gl, materialRenderer) {
        var vertexPositionAttribute = gl.getAttribLocation(materialRenderer.program, "aVertexPosition"),
            uvAttribute = gl.getAttribLocation(materialRenderer.program, "aTextureCoord");

        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.enableVertexAttribArray(uvAttribute);

        materialRenderer.vertexPositionAttribute = vertexPositionAttribute;
        materialRenderer.uvAttribute = uvAttribute;
    }

    function passFacesToGL(gl, materialRenderer, faces, verticesBuffer, verticesArray) {
        var numFaces = faces.length,
            faceIndex,
            vboIndex,
            face;

        for (faceIndex = 0, vboIndex = -1 ; faceIndex < numFaces ; ++faceIndex) {
            face = faces[faceIndex];

            // Interleaved VBO
            verticesArray[++vboIndex] = face.vertex1.vertex.x;
            verticesArray[++vboIndex] = face.vertex1.vertex.y;
            verticesArray[++vboIndex] = face.vertex1.vertex.z;
            verticesArray[++vboIndex] = face.vertex1.normal.x;
            verticesArray[++vboIndex] = face.vertex1.normal.y;
            verticesArray[++vboIndex] = face.vertex1.normal.z;
            verticesArray[++vboIndex] = face.vertex1.uv.u;
            verticesArray[++vboIndex] = face.vertex1.uv.v;

            verticesArray[++vboIndex] = face.vertex2.vertex.x;
            verticesArray[++vboIndex] = face.vertex2.vertex.y;
            verticesArray[++vboIndex] = face.vertex2.vertex.z;
            verticesArray[++vboIndex] = face.vertex2.normal.x;
            verticesArray[++vboIndex] = face.vertex2.normal.y;
            verticesArray[++vboIndex] = face.vertex2.normal.z;
            verticesArray[++vboIndex] = face.vertex2.uv.u;
            verticesArray[++vboIndex] = face.vertex2.uv.v;

            verticesArray[++vboIndex] = face.vertex3.vertex.x;
            verticesArray[++vboIndex] = face.vertex3.vertex.y;
            verticesArray[++vboIndex] = face.vertex3.vertex.z;
            verticesArray[++vboIndex] = face.vertex3.normal.x;
            verticesArray[++vboIndex] = face.vertex3.normal.y;
            verticesArray[++vboIndex] = face.vertex3.normal.z;
            verticesArray[++vboIndex] = face.vertex3.uv.u;
            verticesArray[++vboIndex] = face.vertex3.uv.v;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesArray, gl.STATIC_DRAW);
        gl.vertexAttribPointer(materialRenderer.vertexPositionAttribute, 3, gl.FLOAT, false, 8*4, 0*4); // Position
        //gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8*4, 3*4); // Normal
        gl.vertexAttribPointer(materialRenderer.uvAttribute, 2, gl.FLOAT, false, 8*4, 6*4); // UV

        // TODO: Use drawElements(...)?
        gl.drawArrays(gl.TRIANGLES, 0, numFaces * 3);
    }

    // Export
    return WebGLMaterialRenderer;
});
