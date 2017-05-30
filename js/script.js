var Colors = {};

window.addEventListener('load', init, false);

function init() {
	createScene();
	createLights();
	createMDMALattice();

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

	scene.fog = new THREE.Fog(0x1e1d1b, 100, 500);

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
	camera.position.z = 250;
	camera.position.y = 0;

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
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 1)

	shadowLight = new THREE.DirectionalLight(0xffffff, .8);

	shadowLight.position.set(150, 350, 350);

	shadowLight.castShadow = true;

	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	scene.add(hemisphereLight);
	scene.add(shadowLight);
}

var MDMALattice = function(n){
	this.mesh = new THREE.Object3D();
	var dis = 80;

	var i, j, k;
	var x, y, z;
	var m;

	var numKLayers = n*2;

	this.layers = [];

	for(k=0; k<numKLayers; k++){

		this.layers[k] = new THREE.Group();

		for(j=0; j<n-2; j++){
			for(i=0; i<n-1; i++){
				var mdma = CreateMDMA(i*dis + (Math.random()-0.4)*dis*0.8, -j*dis + (Math.random()-0.4)*dis*0.8, 0, true);
				mdma.scale.set(3,3,3);
				this.layers[k].add(mdma);
			}
		}

		this.layers[k].position.z -= k*dis;
		this.mesh.add(this.layers[k]);
	}

	this.mesh.receiveShadow = true;

	this.update = function() {
		var speed = 0.5;
		for (var i = 0; i < numKLayers; i++) {
			if (this.layers[i].position.z >= 200) {
				this.layers[i].position.z = -(numKLayers-1)*dis + speed;
			}
			this.layers[i].position.z += speed;
		}
	}
};

var lattice;

function createMDMALattice(){
	var n =4;
	lattice = new MDMALattice(n);
	scene.add(lattice.mesh);
}

var mousePos={x:0, y:0};

function handleMouseMove(event) {
	var tx = -1 + (event.clientX / WIDTH)*2;
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}

function loop(){
	lattice.update();
	renderer.render(scene, camera);
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
