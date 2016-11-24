// Defines bind() unless it exists already. Taken directly from:
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP    = function() {},
      fBound  = function() {
        return fToBind.apply(this instanceof fNOP
            ? this
            : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/**
 * Given value scalar range end points a and b (so that a < b) and a value 'value',
 * returns a value between 0 and 1 so that at value <= a 0 ís returned and at
 * value >= b 1 is returned and in between it is interpolated.
 *
 * @param a lower endpoint of scalar range
 * @param b upper endpoint of scalar range
 * @param value
 * @returns value in the range [0, 1]
 */
function linearStep(a, b, value) {
  assert(a !== undefined);
  assert(b !== undefined);
  assert(value !== undefined);
  assert(a < b, 'Lower range endpoint must be less than upper');

  if (value <= a) {
    return 0;
  }

  if (value >= b) {
    return 1;
  }

  return ((value - a) / (b - a));
}

function isMobile() {
  if (navigator.platform === "MacIntel") {
    return false;
  } else {
    return (/Mobi/.test(navigator.userAgent));
  }
}

if (!assert) {
  var assert = function (condition, message) {
    if (!condition) {
      message = message || "Assertion failed";
      if (typeof Error !== "undefined") {
        throw new Error(message);
      }
      throw message; // Fallback
    }
  }
}
