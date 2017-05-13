// add to this list as we go
const Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xF5986E,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
  gray: 0x999999
};

var scene,
  camera,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  HEIGHT,
  WIDTH,
  renderer,
  container;


window.addEventListener('load', init, false);

// initiate the entire scene and objects
function init() {
  // sets up the scene, the camera, and the renderer
  createScene();
  createLights();

  // add objects
  createGraphite();

  // render loop
  render();
}

function createScene() {
  // Get the width and the height of the screen,
  // use them to set up the aspect ratio of the camera
  // and the size of the renderer.
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create the scene
  scene = new THREE.Scene();

  // Add a fog effect to the scene; same color as the
  // background color used in the style sheet
  scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );

  // Set the position of the camera
  camera.position.x = 0;
  camera.position.z = 150;
  camera.position.y = 100;

  // Create the renderer
  renderer = new THREE.WebGLRenderer({
    // Allow transparency to show the gradient background
    // we defined in the CSS
    alpha: true,

    // Activate the anti-aliasing; this is less performant,
    // but, as our project is low-poly based, it should be fine :)
    antialias: true
  });

  // Define the size of the renderer; in this case,
  // it will fill the entire screen
  renderer.setSize(WIDTH, HEIGHT);

  // Enable shadow rendering
  renderer.shadowMap.enabled = true;

  // Add the DOM element of the renderer to the
  // container we created in the HTML
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  // Listen to the screen: if the user resizes it
  // we have to update the camera and the renderer size
  window.addEventListener('resize', handleWindowResize, false);
}

var hemisphereLight,
  shadowLight;
function createLights() {
  // A hemisphere light is a gradient colored light;
  // the first parameter is the sky color, the second parameter is the ground color,
  // the third parameter is the intensity of the light
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)

  // A directional light shines from a specific direction.
  // It acts like the sun, that means that all the rays produced are parallel.
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);

  // Set the direction of the light
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // to activate the lights, just add them to the scene
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}
function handleWindowResize() {
  // update height and width of the renderer and the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


Graphite = function() {

  carbonradius = 5;
  oxygenradius = .8 * carbonradius;
  nitrogenradius = .9 * carbonradius;
  hydroradius = .6 * carbonradius;

  this.mesh = new THREE.Object3D();

  var carbon = new THREE.SphereGeometry(carbonradius, 100, 100);
  var connector1 = new THREE.CylinderGeometry(.2 * carbonradius, .2 * carbonradius, 4 * carbonradius, 100, 100);
  var connector2 = new THREE.CylinderGeometry(.2 * carbonradius, .2 * carbonradius, 4 * (carbonradius + oxygenradius) / 2, 100, 100);


  var carbonmat = new THREE.MeshPhongMaterial({
    color: Colors.gray,
    transparent: true,
    opacity: 1,
    shading: THREE.FlatShading,
  });

  var connectormat = new THREE.MeshPhongMaterial({
    color: Colors.white,
    transparent: true,
    opacity: .9,
    shading: THREE.FlatShading,
  });

  // there are 6 carbons
  var carbon_1 = new THREE.Mesh(carbon, carbonmat);
  var carbon_2 = new THREE.Mesh(carbon, carbonmat);
  var carbon_3 = new THREE.Mesh(carbon, carbonmat);
  var carbon_4 = new THREE.Mesh(carbon, carbonmat);
  var carbon_5 = new THREE.Mesh(carbon, carbonmat);
  var carbon_6 = new THREE.Mesh(carbon, carbonmat);

  carbon_1.position.x -= 2 * carbonradius;
  carbon_2.position.x += 2 * carbonradius;
  carbon_3.position.x += 6 * carbonradius;
  carbon_3.position.z -= 20;


  var connector_1 = new THREE.Mesh(connector1, connectormat);
  var connector_2 = new THREE.Mesh(connector2, connectormat);
  connector_1.rotation.z = Math.PI / 2;

  this.mesh.add(carbon_1);
  this.mesh.add(carbon_2);
  this.mesh.add(carbon_3);
  this.mesh.add(connector_1);

  // co2 = new THREE.Mesh(connector2, connectormat);
  // co2.position.x = c2.position.x;
  // co2.rotation.z = -Math.PI / 6;
  // co2.position.x += 4 * (carbonradius + oxygenradius) / 2 * Math.sin(Math.PI / 6) / 2;
  // co2.position.y += 4 * (carbonradius + oxygenradius) / 2 * Math.cos(Math.PI / 6) / 2;
  //
  // o1 = new THREE.Mesh(oxygen, oxygenmat);
  // o1.position.x = co2.position.x + 4 * (carbonradius + oxygenradius) / 2 * Math.sin(Math.PI / 6) / 2;
  // o1.position.y = co2.position.y + 4 * (carbonradius + oxygenradius) / 2 * Math.cos(Math.PI / 6) / 2;
  //
  // co9 = new THREE.Mesh(connector2, doublemat);
  // co9.position.x = c2.position.x;
  // co9.rotation.z = 7 * Math.PI / 6;
  // co9.position.x += 4 * (carbonradius + oxygenradius) / 2 * Math.sin(-7 * Math.PI / 6) / 2;
  // co9.position.y += 4 * (carbonradius + oxygenradius) / 2 * Math.cos(7 * Math.PI / 6) / 2;
  //
  // o2 = new THREE.Mesh(oxygen, oxygenmat);
  // o2.position.x = co2.position.x + 4 * (carbonradius + oxygenradius) / 2 * Math.sin(-7 * Math.PI / 6) / 2;
  // o2.position.y = co2.position.y + 4 * (carbonradius + oxygenradius) / 2 * Math.cos(Math.PI / 6) / 2;
  // o2.position.y *= -1;
  //
  // co3 = new THREE.Mesh(connector3, connectormat);
  // co3.position.x = o1.position.x;
  // co3.position.y = o1.position.y;
  // co3.rotation.z = Math.PI / 2;
  // co3.position.x += 4 * (oxygenradius + hydroradius) / 2 / 2;
  //
  // h1 = new THREE.Mesh(hydrogen, hydromat);
  // h1.position.x = co3.position.x;
  // h1.position.y = co3.position.y;
  // h1.position.x += 4 * (oxygenradius + hydroradius) / 2 / 2;
  //
  // co4 = new THREE.Mesh(connector4, connectormat);
  // co4.rotation.z = Math.PI / 2;
  // co4.position.x = c1.position.x;
  // co4.position.x -= 4 * (carbonradius + hydroradius) / 2 / 2;
  // co4.rotation.y = Math.PI / 3;
  // co4.position.z += 4 * (carbonradius + hydroradius) / 2 / 2 * Math.sin(Math.PI / 3);
  // co4.position.x += 4 * (carbonradius + hydroradius) / 2 / 2 * (1 - Math.cos(Math.PI / 3));
  // co4.rotation.z = -Math.PI / 3;
  // co4.position.y -= 4 * (carbonradius + hydroradius) / 2 / 2 * Math.sin(Math.PI / 6);
  // co4.position.z -= 4 * (carbonradius + hydroradius) / 2 / 2 * (1 - Math.cos(Math.PI / 6));
  //
  // co5 = new THREE.Mesh(connector4, connectormat);
  // co5.rotation.z = Math.PI / 2;
  // co5.position.x = c1.position.x;
  // co5.position.x -= 4 * (carbonradius + hydroradius) / 2 / 2;
  // co5.rotation.y = -Math.PI / 3;
  // co5.position.x += 4 * (carbonradius + hydroradius) / 2 / 2 * Math.sin(Math.PI / 6);
  // co5.position.z -= 4 * (carbonradius + hydroradius) / 2 / 2 * (1 - Math.cos(Math.PI / 3));
  // co5.rotation.z = -Math.PI / 3;
  // co5.position.y -= 4 * (carbonradius + hydroradius) / 2 / 2 * Math.sin(Math.PI / 6);
  // co5.position.z -= 4 * (carbonradius + hydroradius) / 2 / 2 * (1 - Math.cos(Math.PI / 6));
  //
  // h2 = new THREE.Mesh(hydrogen, hydromat);
  // h2.position.x = co4.position.x;
  // h2.position.y = co4.position.y;
  // h2.position.z = co4.position.z;
  // h2.position.x += co4.position.x - c1.position.x;
  // h2.position.y += co4.position.y - c1.position.y;
  // h2.position.z += co4.position.z - c1.position.z;
  //
  // h3 = new THREE.Mesh(hydrogen, hydromat);
  // h3.position.x = co5.position.x;
  // h3.position.y = co5.position.y;
  // h3.position.z = co5.position.z;
  // h3.position.x += co5.position.x - c1.position.x;
  // h3.position.y += co5.position.y - c1.position.y;
  // h3.position.z += co5.position.z - c1.position.z;
  //
  // co6 = new THREE.Mesh(connector5, connectormat);
  // co6.rotation.z = Math.PI / 6;
  // co6.position.x = c1.position.x;
  // co6.position.x -= 4 * (carbonradius + nitrogenradius) / 2 * Math.sin(Math.PI / 6) / 2;
  // co6.position.y += 4 * (carbonradius + nitrogenradius) / 2 * Math.cos(Math.PI / 6) / 2;
  //
  // n1 = new THREE.Mesh(nitrogen, nitromat);
  // n1.position.x = co6.position.x + co6.position.x - c1.position.x;
  // n1.position.y = co6.position.y + co6.position.y - c1.position.y;
  //
  // co7 = new THREE.Mesh(connector7, connectormat);
  // co7.rotation.z = Math.PI / 6;
  // co7.position.x = n1.position.x;
  // co7.position.y = n1.position.y;
  // co7.position.x -= 4 * (nitrogenradius + hydroradius) / 2 * Math.sin(Math.PI / 6) / 2;
  // co7.position.y += 4 * (nitrogenradius + hydroradius) / 2 * Math.cos(Math.PI / 6) / 2;
  // co7.rotation.x = Math.PI / 3;
  // co7.position.z += 4 * (nitrogenradius + hydroradius) / 2 * Math.sin(Math.PI / 3) / 2;
  // co7.position.y -= 4 * (nitrogenradius + hydroradius) / 2 / 2 * (1 - Math.cos(Math.PI / 3));
  //
  // co8 = new THREE.Mesh(connector7, connectormat);
  // co8.rotation.z = Math.PI / 6;
  // co8.position.x = n1.position.x;
  // co8.position.y = n1.position.y;
  // co8.position.x -= 4 * (nitrogenradius + hydroradius) / 2 * Math.sin(Math.PI / 6) / 2;
  // co8.position.y += 4 * (nitrogenradius + hydroradius) / 2 * Math.cos(Math.PI / 6) / 2;
  // co8.rotation.x = -Math.PI / 3;
  // co8.position.z -= 4 * (nitrogenradius + hydroradius) / 2 * Math.sin(Math.PI / 3) / 2;
  // co8.position.y -= 4 * (nitrogenradius + hydroradius) / 2 / 2 * (1 - Math.cos(Math.PI / 3));
  //
  // h4 = new THREE.Mesh(hydrogen, hydromat);
  // h4.position.x = co7.position.x + co7.position.x - n1.position.x;
  // h4.position.y = co7.position.y + co7.position.y - n1.position.y;
  // h4.position.z = co7.position.z + co7.position.z - n1.position.z;
  //
  // h5 = new THREE.Mesh(hydrogen, hydromat);
  // h5.position.x = co8.position.x + co8.position.x - n1.position.x;
  // h5.position.y = co8.position.y + co8.position.y - n1.position.y;
  // h5.position.z = co8.position.z + co8.position.z - n1.position.z;


  // this.mesh.add(co2);
  // this.mesh.add(o1);
  // this.mesh.add(co9);
  // this.mesh.add(o2);
  // this.mesh.add(co3);
  // this.mesh.add(h1);
  // this.mesh.add(co4);
  // this.mesh.add(co5);
  // this.mesh.add(h2);
  // this.mesh.add(h3);
  // this.mesh.add(co6);
  // this.mesh.add(n1);
  // this.mesh.add(co7);
  // this.mesh.add(co8);
  // this.mesh.add(h4);
  // this.mesh.add(h5);

  this.mesh.receiveShadow = true;
};

var graphite;
function createGraphite() {
  graphite = new Graphite();
  graphite.mesh.position.y = 100;
  scene.add(graphite.mesh);
}

function render() {
  requestAnimationFrame(render);

  // can add rotation in render
  renderer.render(scene, camera);
}
