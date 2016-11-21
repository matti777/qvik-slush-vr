// Define namespace
var APP = APP || {};

/**
 * Event dispatcher.
 *
 * @constructor
 */
APP.EventDispatcher = function() {
  var self = this;

  self.addEventListener = function(type, listener) {
    var listeners = self.map[type] || [];
    var index = listeners.indexOf(listener);
    if (index === - 1) {
      listeners.push(listener);
      self.map[type] = listeners;
    }
  };

  self.removeEventListener = function(type, listener) {
    var listeners = self.map[type] || [];
    var index = listeners.indexOf(listener);
    if (index !== - 1) {
      listeners.splice(index, 1);
      self.map[type] = listeners;
    }
  };

  self.dispatchEvent = function(event) {
    var listeners = self.map[event.type];
    if (listeners) {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].call(self, event);
      }
    }
  };

  self.map = {};
};

APP.EventDispatcher.constructor = APP.EventDispatcher;
