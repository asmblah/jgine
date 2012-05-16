/*
 *  jGine File class
 */
define([
    "js/util",
    "./Promise"
], function(
    util,
    Promise
) { "use strict";

    function File(uri) {
        util.assertConstructor(this, File);

        this.uri = uri;
        this.loaded = false;
    }

    util.extend(File, {

    });

    util.extend(File.prototype, {
        read: function() {
            var promise = new Promise(this);

            $.ajax({
                type: "GET",
                url: this.uri
            }).done(function(data) {
                promise.resolve(data);
            }).fail(function() {
                promise.reject();
            });

            return promise;
        }
    });

    // Export
    return File;
});
