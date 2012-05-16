/*
 *  jGine AliasWavefrontFile class
 */
define([
    "js/util",
    "../File",
    "../Promise"
], function(
    util,
    File,
    Promise
) {

    function AliasWavefrontFile(uri) {
        util.assertConstructor(this, AliasWavefrontFile);

        File.call(this, uri);
    }

    AliasWavefrontFile.prototype = Object.create(File.prototype);

    util.extend(AliasWavefrontFile.prototype, {
        read: function() {
            var promise = new Promise(this);

            File.prototype.read.call(this)
                .done(function(data) {
                    var objects = [];

                    alert(data);

                    promise.resolve(objects);
                })
                .fail(function() {
                    promise.reject();
                });

            return promise;
        }
    });

    // Export
    return AliasWavefrontFile;
});
