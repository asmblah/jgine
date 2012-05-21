<!DOCTYPE html>
<html>
    <head>
        <title>jGine demo</title>

        <script id="vertexShader" type="x-shader/x-vertex">
            /*attribute vec3 aVertexPosition;

            uniform mat4 uMVMatrix;
            uniform mat4 uPMatrix;

            void main(void) {
                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            }*/
            attribute vec3 aVertexPosition;
            attribute vec2 aTextureCoord;

            uniform mat4 uMVMatrix;
            uniform mat4 uPMatrix;

            varying vec2 vTextureCoord;


            void main(void) {
                gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
                vTextureCoord = aTextureCoord;
            }
        </script>

        <script id="fragmentShader" type="x-shader/x-fragment">
            /*precision mediump float;

            void main(void) {
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }*/
            precision mediump float;

            varying vec2 vTextureCoord;

            uniform sampler2D uSampler0;

            void main(void) {
                gl_FragColor = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));
            }
        </script>

        <script data-main="js/main" type="text/javascript" src="lib/require-jquery.js"></script>

        <style type="text/css">
            html, body {
                margin: 0; padding: 0; outline: 0;

                width: 100%; height: 100%;
            }
            body {
                padding: 1em;

                background: black;
                color: white;
                font-family: Helvetica, Arial, sans-serif;
            }
            #info {
                overflow: auto;
            }
            #info dt {
                float: left;

                width: 40px;

                font-weight: bold;
            }
            #info dd {
                margin-left: 40px;
            }
            #canvas {
                border: solid white 1px;

                display: block;

                margin: auto;

                background: white;
            }
        </style>
    </head>
    <body>
        <h1>jGine demo</h1>

        <dl id="info">
            <dt>FPS:</dt> <dd id="fps"></dd>
        </dl>

        <canvas id="canvas" width="640" height="480">
            <p>Sorry, your browser doesn't support HTML5.</p>
        </canvas>
    </body>
</html>
