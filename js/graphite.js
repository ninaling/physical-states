// add to this list as we go
const COLORS = {
  Grey: 0x7F7A78
};

var scene,
  camera,
  renderer;

// declare objects
var sphere,
  cylinder;

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
  //one sphere
  var sphere_geometry = new THREE.SphereGeometry(1, 10, 10, 0, Math.PI * 2, 0, Math.PI * 2);
  var sphere_material = new THREE.MeshBasicMaterial({
    color: COLORS.Grey
  });

  //one cylinder
  var cylinder_geometry = new THREE.CylinderGeometry(.1, 0.1, 3, 100, false);
  // var cylinder_material = new THREE.MeshLambertMaterial({
  //   wireframe: true,
  //   color: 0xffffff
  // });
  var cylinder_material = new THREE.MeshNormalMaterial();


  sphere = new THREE.Mesh(sphere_geometry, sphere_material);
  cylinder = new THREE.Mesh(cylinder_geometry, cylinder_material);
  cylinder.rotation.x += 5;
  cylinder.position.set(.2, .3, 2);
  scene.add(sphere);
  scene.add(cylinder);

// var geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
// var material = new THREE.MeshNormalMaterial();
// sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);
}

function render() {
  requestAnimationFrame(render);
  //add rotation functionality here
  // sphere.rotation.y += 0.01;

  renderer.render(scene, camera);
}

init();
render();
