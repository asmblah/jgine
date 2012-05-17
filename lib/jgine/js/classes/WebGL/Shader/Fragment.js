/*
 *  jGine WebGLFragmentShader class
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

    function WebGLFragmentShader(webGL, code) {
        util.assertConstructor(this, WebGLFragmentShader);

        Shader.call(this, webGL, code, WebGLRenderingContext.FRAGMENT_SHADER);
    }

    WebGLFragmentShader.prototype = Object.create(Shader.prototype);

    // Export
    return WebGLFragmentShader;
});
