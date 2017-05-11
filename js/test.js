var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 10;
var render = function() {
  requestAnimationFrame(render);

  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

render();
