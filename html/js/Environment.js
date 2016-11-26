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

  var WallTexture = 'data/textures/qvik_wall_dark.jpg';
  var WallNormalMap = 'data/textures/qvik_wall_dark-normalmap.jpg';
  var FloorTexture = 'data/textures/marble.jpg';
  var FloorNormalMap = 'data/textures/marble-normalmap.jpg';

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
    return location;

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

  /**
   * Create cloned plants
   */
  self.createPlants = function(object) {
    var Scale = 0.035;
    object.scale.set(Scale, Scale, Scale);

    var PlantDistance = 1;

    var plant1 = object.clone();
    plant1.position.set(-Width / 2 + PlantDistance, -Height / 2, -Depth / 2 + PlantDistance);
    plant1.rotation.y = THREE.Math.degToRad(35);
    self.add(plant1);

    var plant2 = object.clone();
    plant2.position.set(Width / 2 - PlantDistance, -Height / 2, -Depth / 2 + PlantDistance);
    plant2.rotation.y = THREE.Math.degToRad(135);
    self.add(plant2);

    var plant3 = object.clone();
    plant3.position.set(Width / 2 - PlantDistance, -Height / 2, Depth / 2 - PlantDistance);
    plant3.rotation.y = THREE.Math.degToRad(104);
    self.add(plant3);

    var plant4 = object.clone();
    plant4.position.set(-Width / 2 + PlantDistance, -Height / 2, Depth / 2 - PlantDistance);
    plant4.rotation.y = THREE.Math.degToRad(276);
    self.add(plant4);
  };

  /**
   * Populate the room with some furnishings.
   */
  self.createChildren = function() {
    // Add a point light to the roof in the center
    var pointLight = new THREE.PointLight(0xFFDDDD, 0.9, 10);
    pointLight.position.y = (Height / 2) - 0.2;
    self.add(pointLight);

    // Load the plant textures
    var textureLoader = new THREE.TextureLoader();
    var woodTexture = textureLoader.load('data/textures/wood.jpg');
    woodTexture.minFilter = THREE.LinearFilter;
    var woodMaterial = new THREE.MeshPhongMaterial({
      map: woodTexture
    });

    var leafTexture = textureLoader.load('data/textures/leaf.jpg');
    leafTexture.minFilter = THREE.LinearFilter;
    var leafMaterial = new THREE.MeshPhongMaterial({
      map: leafTexture
    });

    // Load the plant model
    var objLoader = new THREE.OBJLoader();
    objLoader.load('data/models/plant.obj', function(obj) {
      // console.log('Loaded OBJ', obj);

      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          // console.log('child', child);

          if (child.material.name === '04_-_Default') {
            child.material = leafMaterial;
          } else {
            child.material = woodMaterial;
          }
        }
      });

      // Add some plants
      self.createPlants(obj);
    }, function(progress) {}, function(error) {
      console.log('error loading OBJ', error);
    });
  };

  self.init();
  self.createChildren();
};

APP.Environment.prototype = Object.create(THREE.Mesh.prototype);
APP.Environment.constructor = APP.Environment;
