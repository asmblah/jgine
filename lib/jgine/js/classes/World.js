/*
 *  jGine World class
 */
define([
    "js/util"
], function(
    util
) {

    function World(objects) {
        util.assertConstructor(this, World);

        this.objects = objects;
    }

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;  

    util.extend(World.prototype, {
        render: function() {
            var i,
                objects = this.objects,
                num = objects.length;

            for (i = 0 ; i < num ; ++i) {
                objects[i].render();
            }
        }
    });

    // Export
    return World;
});
