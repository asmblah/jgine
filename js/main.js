/*
 *  Main load routines for jGine demo
 */
require({
    paths: {
        "js": "/jgine/lib/jgine/js",
        "lib": "/jgine/lib"
    }
}, [
    "js/util",
    "js/classes/File/AliasWavefront",
    "js/classes/World"
], function(
    util,
    AliasWavefrontFile,
    World
) {
    var aliasWavefrontFile = new AliasWavefrontFile("models/car.obj");

    aliasWavefrontFile.read()
        .done(function(objectGroup) {
            var world = new World(objectGroup);

            world.render();
        })
        .fail(function(error) {
            alert("Could not load file - " + error);
        });
});
