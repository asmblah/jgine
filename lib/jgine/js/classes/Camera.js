/*
 *  jGine Camera class
 */
define([
    "js/util",
    "./Object",
    "./Matrix/4D"
], function (
    util,
    ObjectClass,
    Matrix4D
) { "use strict";

    function Camera(world) {
        util.assertConstructor(this, Camera);

        ObjectClass.call(this);

        // Dependencies
        this.world = world;

        // Properties
        this.projectionMatrix = new Matrix4D().makePerspective(45, 640.0/480.0, 0.1, 10.0);
    }

    Camera.prototype = Object.create(ObjectClass.prototype);

    util.extend(Camera.prototype, {
        renderView: function (renderer) {
            this.world.render(renderer, this);
        },
        getProjectionMatrix: function () {
            return this.projectionMatrix;
        }
    });

    // Export
    return Camera;
});
