/*
 *  jGine ObjectGroup class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function ObjectGroup() {
        util.assertConstructor(this, ObjectGroup);

        this.objects = [];
        this.objectNameMap = {};
    }

    util.extend(ObjectGroup.prototype, {
        addObject: function (object) {
            this.objects.push(object);
            this.objectNameMap[object.getName()] = object;
        },
        getList: function () {
            return this.objects;
        }
    });

    // Export
    return ObjectGroup;
});
