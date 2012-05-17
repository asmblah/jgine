/*
 *  jGine WebGLProgram class
 */
define([
    "js/util",
    "../Promise"
], function(
    util,
    Promise
) { "use strict";

    function WebGLProgram(webGL) {
        util.assertConstructor(this, WebGLProgram);

        // Dependencies
        this.webGL = webGL;

        // Properties
        this.shaders = [];
        this.program = null;
    }

    util.extend(WebGLProgram.prototype, {
        attach: function (shader) {
            var promise = new Promise(this),
                gl = this.webGL.getGL(),
                program;

            this.shaders.push(shader);

            return this;
        },
        link: function () {
            var promise = new Promise(this),
                gl = this.webGL.getGL(),
                program = gl.createProgram();

            util.each(this.shaders, function () {
                gl.attachShader(program, this.getShader());
            });

            gl.linkProgram(program);

            this.program = program;

            if (!gl.getProgramParameter(program, WebGLRenderingContext.LINK_STATUS)) {
                return promise.reject(new Error("Failed to link program"));
            }

            return promise.resolve();
        },
        use: function () {
            this.webGL.getGL().useProgram(this.program);
        }
    });

    // Export
    return WebGLProgram;
});
