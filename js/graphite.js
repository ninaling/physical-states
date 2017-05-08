var scene,
  camera,
  renderer;


var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// initiate the entire scene and objects
function init() {
  scene = new THREE.Scene();

  addObject();
  initCamera();
  initRenderer();

  // addLights();

  document.body.appendChild(renderer.domElement);
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 10);
  camera.position.set(0, 1, 5);
  camera.lookAt(scene.position);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
}

// function addLights() {
//   var dirLight = new
// }

function addObject() {

}

function render() {
  requestAnimationFrame(render);
  //add rotation functionality here
  render.render(scene, camera);
}
