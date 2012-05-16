/*
 *  jGine PolygonGroup class
 */
define([
    "js/util",
    "./Group"
], function(
    util,
    Group
) {

    function PolygonGroup() {
        util.assertConstructor(this, PolygonGroup);
    }
    PolygonGroup.prototype = Object.create(Group.prototype);

    util.extend(PolygonGroup, {

    });

    util.extend(PolygonGroup.prototype, {

    });

    // Export
    return PolygonGroup;
});
