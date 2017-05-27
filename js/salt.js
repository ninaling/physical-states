var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
	gray: 0x999999,
	lightgray: 0xdddddd
};

window.addEventListener('load', init, false);

function init() {
	createScene();
	createLights();
	createLattice();

	document.addEventListener('mousemove', handleMouseMove, false);

	loop();
}

var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container;

function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	scene = new THREE.Scene();

	scene.fog = new THREE.Fog(0x1e1d1b, -100, 800);

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
		alpha: true,
		antialias: true
	});

	renderer.setSize(WIDTH, HEIGHT);

	renderer.shadowMap.enabled = true;

	container = document.getElementById('world');
	container.appendChild(renderer.domElement);

	window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
	// A hemisphere light is a gradient colored light;
	// the first parameter is the sky color, the second parameter is the ground color,
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

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

Lattice = function(n){
	var ionSize = 16;
	var dis = 20*ionSize/3;
	ionSize *= 1.5;
	this.mesh = new THREE.Object3D();

	var ion = new THREE.SphereGeometry(ionSize, 7, 7);

	var ionmat = new THREE.MeshPhongMaterial({
		color: Colors.red,
		transparent: true,
		opacity: .9,
		shading: THREE.FlatShading,
	});

	var i, j, k;
	var atom;
	var x, y, z;
	var m;

	var numKLayers = (n*2) + 2;

	this.layers = [];

	for(k=0; k<numKLayers; k++){

		this.layers[k] = new THREE.Group();

		for(j=0; j<(n*2-1)-1; j++){
			for(i=0; i<(n*2-1)+1; i++){
				cl1 = new THREE.Mesh(ion, ionmat);
				cl1.position.x += i*dis;
				cl1.position.y -= j*dis;
				cl1.position.z = 0;
				this.layers[k].add(cl1);
				atom = cl1;
				x = i*dis;
				y = -j*dis;
				z = -k*dis;
			}
		}
		this.layers[k].position.z -= k*dis;
		this.mesh.add(this.layers[k]);
	}

	this.mesh.receiveShadow = true;

	this.update = function() {
		var speed = 3;
		for (var i = 0; i < numKLayers; i++) {
			// console.log(this.layers[i].position.z);
			if (this.layers[i].position.z >= 200) {
				this.layers[i].position.z -= numKLayers*dis + speed;
			}
			this.layers[i].position.z += speed;
		}
	}
};

var lattice;

function createLattice(){
	var n =3;
	lattice = new Lattice(n);
	var move = (n-1)*16*(8+8*2)/3;
	lattice.mesh.position.y = 1.3*move;
	lattice.mesh.position.x = -1.1*move;
	lattice.mesh.position.z = -100;
	scene.add(lattice.mesh);
}

var mousePos={x:0, y:0};

// now handle the mousemove event

function handleMouseMove(event) {

	// here we are converting the mouse position value received
	// to a normalized value varying between -1 and 1;
	// this is the formula for the horizontal axis:

	var tx = -1 + (event.clientX / WIDTH)*2;

	// for the vertical axis, we need to inverse the formula
	// because the 2D y-axis goes the opposite direction of the 3D y-axis

	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}


// renderer.render(scene, camera);

function loop(){
	lattice.update();

	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(loop);
}


function normalize(v,vmin,vmax,tmin, tmax){

	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;

}
