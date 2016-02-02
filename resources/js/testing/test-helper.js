!(function (global) {

  /**
   * Function that, as side-effects, modify the global object to emulate the
   *  real runtime environment for testing.
   */
  var prepEnv = function () {
    global.angular.module('lodash', []).constant('_', window._);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find#Polyfill
    if (!Array.prototype.find) {
      Array.prototype.find = function(predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      };
    }
  };

  prepEnv();

})(window);
