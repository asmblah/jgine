/*
 *  jGine ImageTexture class
 */
define([
    "js/util",
    "../Promise",
    "../Texture"
], function (
    util,
    Promise,
    Texture
) { "use strict";

    function ImageTexture(src) {
        util.assertConstructor(this, ImageTexture);

        this.src = src;
        this.image = null;
    }

    ImageTexture.prototype = Object.create(Texture.prototype);

    util.extend(ImageTexture.prototype, {
        init: function () {
            var texture = this,
                promise = new Promise(this),
                image = new Image();

            image.onload = function () {
                texture.image = image;
                promise.resolve(image);
            };

            image.onerror = function () {
                promise.reject();
            };

            image.src = this.src;

            return promise;
        },
        getImage: function () {
            return this.image;
        }
    });

    // Export
    return ImageTexture;
});
