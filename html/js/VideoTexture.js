// Define namespace
var APP = APP || {};

APP.VideoTexture	= function(width, height, videoPath) {
  var self = this;

  var BorderWidth = 10;

  self.init = function() {
    // Create the video element for decoding the video
    self.video = document.createElement('video');
    self.video.setAttribute('webkit-playsinline', '');
    self.video.setAttribute('playsinline', '');
    // self.video.setAttribute('muted', '');
    self.video.width = width;
    self.video.height = height;
    self.video.loop = true;
    self.video.autoplay = true;

    // console.log('video element: ', self.video);

    self.video.src = videoPath;
  //  self.video.load();
//    self.video.play();

    // Create a canvas for rendering the video into
    self.canvas = document.createElement('canvas');
    self.canvas.width = width + (2 * BorderWidth);
    self.canvas.height = height + (2 * BorderWidth);

    self.canvasContext = self.canvas.getContext('2d');

    self.canvasContext.fillStyle = '#000000';
    self.canvasContext.fillRect(0, 0, width, height);

    THREE.Texture.call(self, self.canvas);

    self.minFilter = THREE.LinearFilter;
    self.magFilter = THREE.LinearFilter;
  };

  self.onRender	= function() {
    // Update volume based on the distance to the video panel
    var distance = videoPanel.position.distanceTo(camera.position);
    var distanceFactor = linearStep(4, (environment.size.width * 0.8), distance);
    self.video.volume = 0.2 + (0.8 * (1.0 - distanceFactor));

    // Update video frame
    if (self.video.readyState === self.video.HAVE_ENOUGH_DATA) {
      var w = self.canvas.width;
      var h = self.canvas.height;

      // Draw the background color which will form the image border
      self.canvasContext.fillStyle = 'rgb(100, 100, 100)';
      self.canvasContext.fillRect(0, 0, w, h);

      // Draw the main image
      self.canvasContext.drawImage(self.video, BorderWidth, BorderWidth,
        w - (BorderWidth * 2), h - (BorderWidth * 2));


      //self.canvasContext.drawImage(self.video, 0, 0);

      self.needsUpdate = true;
    }
  };

  self.init();
};

APP.VideoTexture.prototype = Object.create(THREE.Texture.prototype);
APP.VideoTexture.constructor = APP.VideoTexture;
