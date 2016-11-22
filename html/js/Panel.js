// Define namespace
var APP = APP || {};

APP.Panel = function() {
  var Width = 5;
  var Height = Width * (9 / 16);
  var Depth = 0.10;

  var self = this;

  self.init = function() {
    var geometry = new THREE.BoxGeometry(Width, Height, Depth);

    self.videoTexture = new APP.VideoTexture(480, 204, 'data/video.ogv');
    var otherMaterial = new THREE.MeshPhongMaterial({color: 0xAAAAAA});
    var imageMaterial = new THREE.MeshPhongMaterial({map: self.videoTexture});

    // Make the video texture update itself automatically
    events.addEventListener('render', self.videoTexture.onRender.bind(self.videoTexture));

    var faceMaterials = [
      otherMaterial, otherMaterial,
      otherMaterial, otherMaterial,
      imageMaterial, otherMaterial
    ];
    var meshMaterial = new THREE.MeshFaceMaterial(faceMaterials);

    THREE.Mesh.call(self, geometry, meshMaterial);
  };

  self.init();
};

APP.Panel.prototype = Object.create(THREE.Mesh.prototype);
APP.Panel.constructor = APP.Panel;
