// Define namespace
var APP = APP || {};

APP.VideoTexture	= function(width, height, videoPath){
  var self = this;

  self.init = function() {
    // Create the video element for decoding the video
    self.video = document.createElement('video');
    self.video.width = width;
    self.video.height = height;
    self.video.autoplay = true;
    self.video.loop = true;
    self.video.src = videoPath;
    self.video.volume = 0.0;
    self.video.load();

    // Create a canvas for rendering the video into
    self.canvas = document.createElement('canvas');
    self.canvas.width = width;
    self.canvas.height = height;

    self.canvasContext = self.canvas.getContext('2d');

    self.canvasContext.fillStyle = '#000000';
    self.canvasContext.fillRect(0, 0, width, height);

    THREE.Texture.call(self, self.canvas);
    self.minFilter = THREE.LinearFilter;
    self.magFilter = THREE.LinearFilter;
  };

  self.onRender	= function() {
    if (self.video.readyState === self.video.HAVE_ENOUGH_DATA) {
      self.canvasContext.drawImage(self.video, 0, 0);
      self.needsUpdate = true;
    }
  };

  self.init();
};

APP.VideoTexture.prototype = Object.create(THREE.Texture.prototype);
APP.VideoTexture.constructor = APP.VideoTexture;
