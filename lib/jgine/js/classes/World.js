/*
 *  jGine World class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function World(objectGroup) {
        util.assertConstructor(this, World);

        this.objectGroup = objectGroup;
    }

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;  

    util.extend(World.prototype, {
        render: function() {
            var i,
                objects = this.objectGroup.getList(),
                num = objects.length;

            for (i = 0 ; i < num ; ++i) {
                objects[i].render();
            }
        }
    });

    // Export
    return World;
});
