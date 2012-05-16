/*
 *  jGine Promise class
 */
define([
    "js/util"
], function(
    util
) { "use strict";

    function Promise(context) {
        util.assertConstructor(this, Promise);

        this.context = context || self;
        this.doneCallbacks = [];
        this.failCallbacks = [];

        this.state = PENDING;
        this.finishArgs = null;
    }

    var PENDING = 1,
        DONE = 2,
        FAILED = 3;

    util.extend(Promise.prototype, {
        done: function(callback) {
            if (this.state === PENDING) {
                this.doneCallbacks.push(callback);
            } else if (this.state === DONE) {
                callback.apply(this.context, this.finishArgs);
            }
            return this;
        },
        fail: function(callback) {
            if (this.state === PENDING) {
                this.failCallbacks.push(callback);
            } else if (this.state === FAILED) {
                callback.apply(this.context, this.finishArgs);
            }
            return this;
        },
        resolve: function() {
            var finishArgs = arguments,
                context = this.context;

            if (this.state !== PENDING) {
                return this;
            }

            this.state = DONE;
            this.finishArgs = finishArgs;

            util.each(this.doneCallbacks, function() {
                var callback = this;

                setTimeout(function () {
                    callback.apply(context, finishArgs);
                });
            });

            return this;
        },
        reject: function() {
            var finishArgs = arguments,
                context = this.context;

            if (this.state !== PENDING) {
                return this;
            }

            this.state = FAILED;
            this.finishArgs = finishArgs;

            util.each(this.failCallbacks, function() {
                var callback = this;

                setTimeout(function () {
                    callback.apply(context, finishArgs);
                });
            });

            return this;
        },
        pipe: function(promise) {
            return this
                .done(function() {
                    promise.resolve.apply(promise, arguments);
                })
                .fail(function() {
                    promise.reject.apply(promise, arguments);
                });
        },
        reset: function() {
            this.state = PENDING;
            this.finishArgs = null;
            return this;
        },
        isPending: function() {
            return this.state === PENDING;
        }
    });

    // Export
    return Promise;
});
