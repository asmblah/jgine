/*
 *  jGine WebGLShader class
 */
define([
    "js/util",
    "../Promise"
], function(
    util,
    Promise
) { "use strict";

    function WebGLShader(webGL, code, type) {
        util.assertConstructor(this, WebGLShader);

        // Dependencies
        this.webGL = webGL;

        // Properties
        this.code = code;
        this.type = type;
        this.shader = null;
    }

    util.extend(WebGLShader.prototype, {
        compile: function () {
            var promise = new Promise(this),
                gl = this.webGL.getGL(),
                shader;

            if (this.shader) {
                return promise.resolve();
            }

            shader = gl.createShader(this.type);
            gl.shaderSource(shader, this.code);

            gl.compileShader(shader);

            this.shader = shader;

            if (!gl.getShaderParameter(shader, WebGLRenderingContext.COMPILE_STATUS)) {
                return promise.reject(new Error("Failed to compile shader: " + gl.getShaderInfoLog(shader)));
            }

            return promise.resolve();
        },
        getShader: function () {
            return this.shader;
        }
    });

    // Export
    return WebGLShader;
});
