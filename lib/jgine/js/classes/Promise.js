/*
 *  jGine Promise class
 */
define([
    "js/util"
], function(
    util
) {

    function Promise(context) {
        util.assertConstructor(this, Promise);

        this.context = context;
        this.doneCallbacks = [];
        this.failCallbacks = [];
        this.pending = true;
    }

    util.extend(Promise.prototype, {
        done: function(callback) {
            this.doneCallbacks.push(callback);
            return this;
        },
        fail: function(callback) {
            this.failCallbacks.push(callback);
            return this;
        },
        resolve: function(data) {
            var context = this.context;

            if (!this.pending) {
                return;
            }
            this.pending = false;

            util.each(this.doneCallbacks, function() {
                this.call(context, data);
            });
            return this;
        },
        reject: function(data) {
            var context = this.context;

            if (!this.pending) {
                return;
            }
            this.pending = false;

            util.each(this.failCallbacks, function() {
                this.call(context, data);
            });
            return this;
        }
    });

    // Export
    return Promise;
});
