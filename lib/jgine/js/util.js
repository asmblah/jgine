/*
 *  Utilities for jGine
 */
define([
    "jquery"
], function(
    $
) { "use strict";

    var util = {
        extend: $.extend,
        each: $.each,

        assertConstructor: function(obj, constructor) {
            if (!obj || !(obj instanceof constructor)) {
                throw new Error("util.assertConstructor() :: Constructor '' not called properly");
            }
        }
    };

    // Export
    return util;
});
