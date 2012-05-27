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

        trim: function (str) {
            return str.replace(/^\s+|\s+$/g, "");
        },

        assertConstructor: function(obj, constructor) {
            if (!obj || !(obj instanceof constructor)) {
                throw new Error("util.assertConstructor() :: Constructor '' not called properly");
            }
        }
    };

    // Export
    return util;
});
