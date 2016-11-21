// Define namespace
var APP = APP || {};

APP.Environment = function() {
  var Width = 10;
  var Depth = Width;
  var Height = 4;

  var self = this;

  self.size = {width: Width, depth: Depth, height: Height};

  // Create a material for the given texture
  function createMaterial(texture, normalMapTexture) {
    return new THREE.MeshPhongMaterial({
      color: 0xDDDDDD,
      side: THREE.DoubleSide,
      specular: 0x222222,
      shininess: 30,
      normalScale: new THREE.Vector2(1, 1),
      map: texture,
      normalMap: normalMapTexture
    });
  }

  // Initialize threejs visuals
  self.init = function() {
    var geometry = new THREE.BoxGeometry(Width, Height, Depth);

    // Create & load texture maps
    var wallTexture = new THREE.Texture();
    wallTexture.minFilter = THREE.LinearFilter;
    var floorTexture = new THREE.Texture();
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(2, 2);
    var wallNormalMap = new THREE.Texture();
    wallNormalMap.minFilter = THREE.LinearFilter;
    var floorNormalMap = new THREE.Texture();
    floorNormalMap.wrapS = THREE.RepeatWrapping;
    floorNormalMap.wrapT = THREE.RepeatWrapping;
    floorNormalMap.repeat.set(2, 2);

    var images = [
      'data/wall.jpg', 'data/wall-normalmap.jpg',
      'data/wood.jpg', 'data/wood-normalmap.jpg'
    ];

    imageLoader.load(images, function() {
      wallTexture.image = imageLoader.images['data/wall.jpg'];
      wallTexture.needsUpdate = true;
      floorTexture.image = imageLoader.images['data/wood.jpg'];
      floorTexture.needsUpdate = true;
      wallNormalMap.image = imageLoader.images['data/wall-normalmap.jpg'];
      wallNormalMap.needsUpdate = true;
      floorNormalMap.image = imageLoader.images['data/wood-normalmap.jpg'];
      floorNormalMap.needsUpdate = true;
    });

    // Create different materials for walls and floor/ceiling
    var wallMaterial = createMaterial(wallTexture, wallNormalMap);
    var floorMaterial = createMaterial(floorTexture, floorNormalMap);

    var faceMaterials = [
      wallMaterial, wallMaterial,
      floorMaterial, floorMaterial,
      wallMaterial, wallMaterial
    ];
    var meshMaterial = new THREE.MeshFaceMaterial(faceMaterials);

    THREE.Mesh.call(this, geometry, meshMaterial);
  };

  self.init();
};

APP.Environment.prototype = Object.create(THREE.Mesh.prototype);
APP.Environment.constructor = APP.Environment;
