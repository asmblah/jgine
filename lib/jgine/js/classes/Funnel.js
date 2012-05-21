/*
 *  jGine Funnel class
 */
define([
    "js/util",
    "./Promise"
], function (
    util,
    Promise
) { "use strict";

    var hasOwnProperty = {}.hasOwnProperty;

    function Funnel(items, callback) {
        util.assertConstructor(this, Funnel);

        var funnel = this,
            pending = 0,
            done = false,
            key,
            promise;

        Promise.call(this);

        for (key in items) {
            if (hasOwnProperty.call(items, key)) {
                promise = callback.call(items[key]);

                if (promise && (promise instanceof Promise)) {
                    // Wait for Promise to resolve before marking as done
                    ++pending;

                    promise
                        .done(function () {
                            --pending;
                            if (pending === 0 && done) {
                                funnel.resolve();
                            }
                        })
                        .fail(function () {
                            funnel.reject();
                        });
                }
            }
        }

        if (pending === 0) {
            funnel.resolve();
        }

        done = true;
    }

    Funnel.prototype = Object.create(Promise.prototype);

    // Export
    return Funnel;
});
