// Define namespace
var APP = APP || {};

/**
 * Manages loading images. After onLoaded callback has been called,
 * images can be retrieved as ```imageLoader.images[path]```.
 *
 * @constructor
 */
APP.ImageLoader = function() {
  var self = this;

  /**
   * Loads several images and calls the onLoaded callback when done.
   *
   * @param imagePaths Array of image paths / urls
   * @param onLoaded callback method
   */
  self.load = function(imagePaths, onLoaded) {
    self.images = {};

    var completions = 0;

    var loadCompleted = function() {
      completions++;
      if (completions === imagePaths.length) {
        if (onLoaded) {
          onLoaded();
        }
      }
    };

    for (var i = 0; i < imagePaths.length; i++) {
      var path = imagePaths[i];
      var image = new Image();
      image.src = path;

      (function(path, image) {
        image.onerror = function (error) {
          console.log('Image loading failed', path, error);
          loadCompleted();
        };

        image.onload = function () {
          self.images[path] = image;
          loadCompleted();
        };
      })(path, image);
    }
  };
};

APP.ImageLoader.constructor = APP.ImageLoader;
