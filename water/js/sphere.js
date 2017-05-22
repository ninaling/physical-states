// Set the scene size.
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  // Set some camera attributes.
  const VIEW_ANGLE = 45;
  const ASPECT = WIDTH / HEIGHT;
  const NEAR = 0.1;
  const FAR = 10000;

  // Get the DOM element to attach to
  const container =
      document.querySelector('#container');

  // Create a WebGL renderer, camera
  // and a scene
  const renderer = new THREE.WebGLRenderer();
  const camera =
      new THREE.PerspectiveCamera(
          VIEW_ANGLE,
          ASPECT,
          NEAR,
          FAR
      );

  const scene = new THREE.Scene();

  // Add the camera to the scene.
  scene.add(camera);

  // Start the renderer.
  renderer.setSize(WIDTH, HEIGHT);

  // Attach the renderer-supplied
  // DOM element.
  container.appendChild(renderer.domElement);

  // create a point light
  const pointLight =
    new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);

  // create the sphere's material
  const sphereMaterial =
    new THREE.MeshPhongMaterial(
      {
        color: 0x6FA8DC
      });

  // Set up the sphere vars
  const RADIUS_OXYGEN = 40;
  const RADIUS_HYDROGEN = 20;
  const SEGMENTS = 16;
  const RINGS = 16;
  const bond_distance = 50;

  // Create a new mesh with
  // sphere geometry - we will cover
  // the sphereMaterial next!
  const sphere_1 = new THREE.Mesh(

    new THREE.SphereGeometry(
      RADIUS_OXYGEN,
      SEGMENTS,
      RINGS),

    sphereMaterial);

  // Move the Sphere back in Z so we
  // can see it.
  sphere_1.position.z = -300;

  // Finally, add the sphere to the scene.
  scene.add(sphere_1);

  const sphere_2 = new THREE.Mesh(
    new THREE.SphereGeometry(
      RADIUS_HYDROGEN,
      SEGMENTS,
      RINGS),
    sphereMaterial);

  // Move the Sphere back in Z so we
  // can see it.
  sphere_2.position.z = -300;
  sphere_2.position.x = bond_distance;
  sphere_2.position.y = bond_distance;

  scene.add(sphere_2);

  const sphere_3 = new THREE.Mesh(
    new THREE.SphereGeometry(
      RADIUS_HYDROGEN,
      SEGMENTS,
      RINGS),
    sphereMaterial);

  // Move the Sphere back in Z so we
  // can see it.
  sphere_3.position.z = -300;
  sphere_3.position.x = -bond_distance;
  sphere_3.position.y = bond_distance;

  scene.add(sphere_3);

  function update () {
    // Draw!
    renderer.render(scene, camera);

    // Schedule the next frame.
    requestAnimationFrame(update);
  }

  // Schedule the first frame.
  requestAnimationFrame(update);
