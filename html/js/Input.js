// Define namespace
var APP = APP || {};

/**
 * Manages mouse/touch input.
 *
 * @constructor
 */
APP.Input = function() {
  var self = this;

  this.pointerDown = function(location, event) {
    self.isDragging = true;
    self.draggedElement = event.target;
    self.lastPosition = location;
  };

  this.pointerMoved = function(location, event) {
    if (self.isDragging && self.onDrag) {
      var diff = {
        x: location.x - self.lastPosition.x,
        y: location.y - self.lastPosition.y
      };
      self.onDrag(location, diff, self.draggedElement);
      self.lastPosition = location;
    }
  };

  this.pointerUp = function(event) {
    if (self.isDragging && self.onDragEnd) {
      self.onDragEnd(self.lastPosition, self.draggedElement);
    }

    self.isDragging = false;
    self.lastPosition = null;
    delete self.draggedElement;
  };

  // Mouse events

  this.onMouseMove = function(event) {
    event.preventDefault();

    self.pointerMoved({x: event.clientX, y: event.clientY}, event);
  };

  this.onMouseDown = function(event) {
    event.preventDefault();

    self.pointerDown({x: event.clientX, y: event.clientY}, event);
  };

  this.onMouseUp = function(event) {
    event.preventDefault();

    self.pointerUp(event);
  };

  function touchForId(touches, touchId) {
    for (var i = 0; i < touches.length; i++) {
      if (touches[i].identifier === touchId) {
        return touches[i];
      }
    }
  }

  // Touch events

  this.onTouchStart = function(event) {
    event.preventDefault();

    if (self.touchId === null) {
      var touch = event.touches[0];
      self.touchId = touch.identifier;
      self.pointerDown({x: touch.pageX, y: touch.pageY}, event);
    }
  };

  this.onTouchMove = function(event) {
    event.preventDefault();

    if (self.touchId !== null) {
      var touch = touchForId(event.touches, self.touchId);
      if (touch) {
        self.pointerMoved({x: touch.pageX, y: touch.pageY}, event);
      }
    }
  };

  this.onTouchEnd = function(event) {
    event.preventDefault();

    if (self.touchId !== null) {
      var touch = touchForId(event.touches, self.touchId);
      if (!touch) {
        self.touchId = null;
        self.pointerUp(event);
      }
    }
  };

  self.isDragging = false;
  self.lastPosition = null;
  self.touchId = null;

  document.body.addEventListener('mousedown', self.onMouseDown.bind(self), true);
  document.body.addEventListener('mouseup', self.onMouseUp.bind(self), true);
  document.body.addEventListener('mousemove', self.onMouseMove.bind(self), true);

  document.body.addEventListener('touchstart', self.onTouchStart.bind(self), true);
  document.body.addEventListener('touchend', self.onTouchEnd.bind(self), true);
  document.body.addEventListener('touchcancel', self.onTouchEnd.bind(self), true);
  document.body.addEventListener('touchmove', self.onTouchMove.bind(self), true);
};

APP.Input.constructor = APP.Input;
