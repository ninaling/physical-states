var Colors = {
	iron: 0x6b6e72,
	electron: 0xffffff
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
	camera.position.x = 5;
	camera.position.z = 150;
	camera.position.y = 130;

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
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 1)

	// A directional light shines from a specific direction.
	// It acts like the sun, that means that all the rays produced are parallel.
	shadowLight = new THREE.DirectionalLight(0xffffff, .8);

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

	var iongeo = new THREE.SphereGeometry(ionSize, 30, 30);
	var ionmat = new THREE.MeshPhongMaterial({
		color: Colors.iron,
		reflectivity: .3,
		metal: true,
		shininess: 50
	});

	var egeo = new THREE.SphereGeometry(ionSize/15, 10, 10);
	var emat = new THREE.MeshPhongMaterial({
		color: Colors.electron,
		reflectivity: .3,
		metal: true,
		shininess: 50
	});

	var i, j, k;
	var x, y, z;
	var m;

	var numKLayers = (n*2)-3;

	this.layers = [];
	this.electrons = [];

	for(k=0; k<numKLayers*2; k++){

		this.layers[k] = new THREE.Group();
		this.electrons[k] = new THREE.Group();

		if (k%2 == 0) {
			for(j=0; j<(n*2-1)+1; j++){
				for(i=0; i<(n*2-1)+1; i++){
					var ion = new THREE.Mesh(iongeo, ionmat);
					ion.position.x += i*dis;
					ion.position.y -= j*dis;
					ion.position.z = 0;
					this.layers[k].add(ion);
				}
			}
		}
		else {
			for(j=0; j<(n*2-1); j++){
				for(i=0; i<(n*2-1); i++){
					var ion = new THREE.Mesh(iongeo, ionmat);
					ion.geometry.computeVertexNormals();
					ion.position.x += (i + 0.5)*dis;
					ion.position.y -= (j + 0.5)*dis;
					ion.position.z = 0;
					this.layers[k].add(ion);
				}
			}
		}

		i=j=0;
		for(j=0; j<(n*2-1)+1; j++){
			for(i=0; i<(n*2-1)+1; i++){
				for (var m=0;m<2;m++){
					var electron = new THREE.Mesh(egeo, emat);
					electron.position.x += i*dis + (Math.random()-0.5)*dis;
					electron.position.y -= j*dis + (Math.random()-0.5)*dis;
					electron.position.z = 0;
					this.electrons[k].add(electron);
				}
			}
		}
		this.electrons[k].position.z -=k*dis;
		this.mesh.add(this.electrons[k]);

		this.layers[k].position.z -= k*dis;
		this.mesh.add(this.layers[k]);
	}

	this.mesh.receiveShadow = true;

	this.update = function() {
		var speed = 3;
		for (var i = 0; i < numKLayers*2; i++) {
			if (this.layers[i].position.z >= 200) {
				this.layers[i].position.z -= numKLayers*2*dis + speed;
			}
			this.layers[i].position.z += speed;

			if (this.electrons[i].position.z >= 200) {
				this.electrons[i].position.z -= numKLayers*2*dis + speed*5;
			}
			this.electrons[i].position.z += speed*5;
		}
	}
};

var lattice;

function createLattice(){
	var n =4;
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
