// Define namespace
var APP = APP || {};

// 'Globals'
var camera, scene, renderer, environment, videoPanel, input, controls;
var stereoEffect;

var imageLoader = new APP.ImageLoader();
var events = new APP.EventDispatcher();

function init() {
  scene = new THREE.Scene();

  // Create the surrounding environment ("room")
  environment = new APP.Environment();
  scene.add(environment);

  // Add the video 'panel'
  videoPanel = new APP.Panel();
  videoPanel.position.z = -((environment.size.depth / 2) - 0.5);
  scene.add(videoPanel);

  // Add a little bit of ambient lighting
  var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
  scene.add(ambientLight);

  // Our camera; place at the origin
  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(70, aspect, 0.2, 100);
  scene.add(camera);

  // Add a point light to where our camera is
  var pointLight = new THREE.PointLight(0xFFFFFF, 0.8, 100);
  camera.add(pointLight);

  try {
    // Create our renderer..
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  } catch (error) {
   console.log('Error creating WebGLRenderer', error);
    //TODO show error in UI!
    return;
  }

  // Attach input handler(s)
  input = new APP.Input();
  input.onDrag = onDrag;

  if (isMobile()) {
    // Stereoscopic effect with 2 cameras for VR
    stereoEffect = new THREE.StereoEffect(renderer);
    stereoEffect.setSize(window.innerWidth, window.innerHeight);

    // Add device orientation controls to control the camera
    controls = new THREE.DeviceOrientationControls(camera);
  }

  // Add event listeners
  window.addEventListener('resize', onWindowResize, false);
}

function onDrag(location, diff) {
  camera.rotation.y += diff.x / 500;
}

function animate(time) {
  // Request next frame to be drawn after this one completes
  requestAnimationFrame(animate);

  if (controls) {
    controls.update();
  }

  // Render the visuals
  if (stereoEffect) {
    stereoEffect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }

  events.dispatchEvent({type: 'render'});
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if (stereoEffect) {
    stereoEffect.setSize(window.innerWidth, window.innerHeight);
  } else {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

APP.main = function() {
  // Init the scene + all needed instances
  init();

  // Start animating!
  animate();
};
