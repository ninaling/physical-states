var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
var WIDTH = $(document).width();
var BOUNDS = $(document).height();
var renderer = new THREE.WebGLRenderer();
renderer.setSize(500, 400);
document.body.appendChild(renderer.domElement);
// var materialColor = 0x0040C0;
// var geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
// var material = new THREE.MeshNormalMaterial();


var geometry = new THREE.SphereGeometry( 5, 10,10);
var material_sphere = new THREE.MeshNormalMaterial();
var material_h1 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var sphere = new THREE.Mesh( geometry, material_sphere );
var h1 = new THREE.Mesh( geometry, material_h1);
scene.add( sphere );
scene.add( h1);


camera.position.z = 20;
var render = function () {
    requestAnimationFrame(render);

    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
};

render();
