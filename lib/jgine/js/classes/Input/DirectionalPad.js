/*
 *  jGine DirectionalPad class
 */
define([
    "js/util",
    "../Promise"
], function(
    util,
    Promise
) { "use strict";

    var KEY_UP = 38,
        KEY_DOWN = 40,
        KEY_LEFT = 37,
        KEY_RIGHT = 39,
        KEY_S = 83,
        KEY_W = 87;

    function DirectionalPad() {
        util.assertConstructor(this, DirectionalPad);

        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }

    util.extend(DirectionalPad, {
        KEY_UP: KEY_UP,
        KEY_DOWN: KEY_DOWN,
        KEY_LEFT: KEY_LEFT,
        KEY_RIGHT: KEY_RIGHT,
        // ...
        KEY_S: KEY_S,
        // ...
        KEY_W: KEY_W
    });

    util.extend(DirectionalPad.prototype, {
        init: function () {
            var promise = new Promise(this),
                pad = this;

            document.addEventListener("keydown", function (evt) {
                //alert(evt.keyCode);

                if (evt.keyCode === KEY_UP) {
                    pad.up = true;
                } else if (evt.keyCode === KEY_DOWN) {
                    pad.down = true;
                } else if (evt.keyCode === KEY_LEFT) {
                    pad.left = true;
                } else if (evt.keyCode === KEY_RIGHT) {
                    pad.right = true;
                }/* else if (evt.keyCode === KEY_W) {
                    cameraY -= 0.1;
                } else if (evt.keyCode === KEY_S) {
                    cameraY += 0.1;
                }*/

                evt.preventDefault();
            }, false);

            document.addEventListener("keyup", function (evt) {
                //alert(evt.keyCode);

                if (evt.keyCode === KEY_UP) {
                    pad.up = false;
                } else if (evt.keyCode === KEY_DOWN) {
                    pad.down = false;
                } else if (evt.keyCode === KEY_LEFT) {
                    pad.left = false;
                } else if (evt.keyCode === KEY_RIGHT) {
                    pad.right = false;
                }/* else if (evt.keyCode === KEY_W) {
                    cameraY -= 0.1;
                } else if (evt.keyCode === KEY_S) {
                    cameraY += 0.1;
                }*/

                evt.preventDefault();
            }, false);

            return promise.resolve();
        }
    });

    // Export
    return DirectionalPad;
});
