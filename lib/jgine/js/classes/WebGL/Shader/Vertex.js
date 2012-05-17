/*
 *  jGine WebGLVertexShader class
 */
define([
    "js/util",
    "../../Promise",
    "../Shader"
], function(
    util,
    Promise,
    Shader
) { "use strict";

    function WebGLVertexShader(webGL, code) {
        util.assertConstructor(this, WebGLVertexShader);

        Shader.call(this, webGL, code, WebGLRenderingContext.VERTEX_SHADER);
    }

    WebGLVertexShader.prototype = Object.create(Shader.prototype);

    // Export
    return WebGLVertexShader;
});
