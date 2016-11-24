// Define namespace
var APP = APP || {};

APP.Environment = function() {
  var Width = 12;
  var Depth = Width;
  var Height = 3;

  var confineMaxX = (Width / 2) - 0.5;
  var confineMinX = -confineMaxX;
  var confineMinZ = -((Depth / 2) - 3);
  var confineMaxZ = (Depth / 2) - 0.5;

  var WallTexture = 'data/qvik_wall_dark.jpg';
  var WallNormalMap = 'data/qvik_wall_dark-normalmap.jpg';
  var FloorTexture = 'data/marble.jpg';
  var FloorNormalMap = 'data/marble-normalmap.jpg';

  var self = this;

  self.size = {width: Width, depth: Depth, height: Height};

  // Create a material for the given texture
  function createMaterial(texture, normalMapTexture) {
    return new THREE.MeshPhongMaterial({
      color: 0xDDDDDD,
      side: THREE.DoubleSide,
      specular: 0x222222,
      shininess: 5,
      //normalScale: new THREE.Vector2(1, 1),
      map: texture,
      normalMap: normalMapTexture
    });
  }

  /**
   * Confines the location within the environment
   *
   * @param location
   */
  self.confineLocation = function(location) {
    var confined = location.clone();

    confined.x = Math.min(confined.x, confineMaxX);
    confined.x = Math.max(confined.x, confineMinX);
    confined.z = Math.min(confined.z, confineMaxZ);
    confined.z = Math.max(confined.z, confineMinZ);

    return confined;
  };

  // Initialize threejs visuals
  self.init = function() {
    var geometry = new THREE.BoxGeometry(Width, Height, Depth);

    // Create the wall texture
    var wallTexture = new THREE.Texture();
    wallTexture.minFilter = THREE.LinearFilter;
    var wallNormalMap = new THREE.Texture();
    wallNormalMap.minFilter = THREE.LinearFilter;

    // We must flip the texture since we are inside the BoxGeometry
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.repeat.x = -1;
    wallNormalMap.wrapS = THREE.RepeatWrapping;
    wallNormalMap.repeat.x = -1;

    // Allows non-power-of-2 images
    wallTexture.minFilter = THREE.LinearFilter;
    wallNormalMap.minFilter = THREE.LinearFilter;

    // Create the floor/ceiling texture
    var floorTexture = new THREE.Texture();
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);
    var floorNormalMap = new THREE.Texture();
    floorNormalMap.wrapS = THREE.RepeatWrapping;
    floorNormalMap.wrapT = THREE.RepeatWrapping;
    floorNormalMap.repeat.set(4, 4);

    var images = [WallTexture, WallNormalMap, FloorTexture, FloorNormalMap];

    imageLoader.load(images, function() {
      wallTexture.image = imageLoader.images[WallTexture];
      wallTexture.needsUpdate = true;
      floorTexture.image = imageLoader.images[FloorTexture];
      floorTexture.needsUpdate = true;
      wallNormalMap.image = imageLoader.images[WallNormalMap];
      wallNormalMap.needsUpdate = true;
      floorNormalMap.image = imageLoader.images[FloorNormalMap];
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
