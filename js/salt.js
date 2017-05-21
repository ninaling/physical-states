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
	// set up the scene, the camera and the renderer
	createScene();

	// add the lights
	createLights();

	// add the objects
	createSalt();

	//add the listener
	document.addEventListener('mousemove', handleMouseMove, false);

	// start a loop that will update the objects' positions
	// and render the scene on each frame
	loop();
}

var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container;

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

function handleWindowResize() {
	// update height and width of the renderer and the camera
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

Sodium = function(size){
	//size *= 2;
	var sodium = new THREE.BoxGeometry(size, size, size, 100, 100, 100);
	var geo = new THREE.EdgesGeometry(sodium);
	//var sodium = new THREE.SphereGeometry(size, 100, 100);

	var namat = new THREE.MeshPhongMaterial({
		color: Colors.red,
		transparent: true,
		opacity: 1,
		shading: THREE.FlatShading,
	});
	var mat = new THREE.LineBasicMaterial({color: Colors.red, linewidth: 100});
	var wireframe = new THREE.LineSegments(geo, mat);

	var group = new THREE.Group();
	/*var i = 0;
	for(i=0; i<4; i++){
		var sodium1 = new THREE.Mesh(sodium, namat);
		sodium1.position.x = size/2;
		sodium1.position.z = size/2;
		var sodium2 = new THREE.Mesh(sodium, namat);
		sodium2.position.x = -size/2;
		sodium2.position.z = size/2;
		var sodium3 = new THREE.Mesh(sodium, namat);
		sodium3.position.x = size/2;
		sodium3.position.z = -size/2;
		var sodium4 = new THREE.Mesh(sodium, namat);
		sodium4.position.x = -size/2;
		sodium4.position.z = -size/2;
		group.add(sodium1);
		group.add(sodium2);
		group.add(sodium3);
		group.add(sodium4);
	}
	var sodium5 = new THREE.Mesh(sodium, namat);
	var sodium6 = new THREE.Mesh(sodium, namat);
	var sodium7 = new THREE.Mesh(sodium, namat);
	var sodium8 = new THREE.Mesh(sodium, namat);
	var sodium9 = new THREE.Mesh(sodium, namat);
	var sodium10 = new THREE.Mesh(sodium, namat);
	var sodium11 = new THREE.Mesh(sodium, namat);
	var sodium12 = new THREE.Mesh(sodium, namat);*/
	//sodium1.position.x = x;
	//sodium1.position.y = y;
	//sodium1.position.z = z;
	//mesh.add(sodium1);
	//mesh.receiveShadow = true;
	//console.log("works")
	//console.log(sodium1.position.x);
	//return this.mesh;
	//group.add(sodium1);
	return wireframe;
}

Salt = function(n){
	var na = 8;
	var cl = 2*na;
	var dis = 16*(na+cl)/3;
	var connectsmall = new THREE.CylinderGeometry(.2*na, .2*na, .1*dis, 30, 30);
	na *= 2;
	cl *= 1.5;
	this.mesh = new THREE.Object3D();

	//var sodium = new THREE.SphereGeometry(na, 100, 100);
	var sodium = new THREE.BoxGeometry(na, na, na, 20, 20, 20);
	//var chloride = new THREE.SphereGeometry(cl, 100, 100);
	var chloride = new THREE.BoxGeometry(cl, cl, cl, 20, 20, 20);
	//var connect = new THREE.CylinderGeometry(.2*na, .2*na, dis, 100, 100);

	var namat = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: .9,
		shading: THREE.FlatShading,
	});

	var clmat = new THREE.MeshPhongMaterial({
		color: Colors.red,
		transparent: true,
		opacity: .9,
		shading: THREE.FlatShading,
	});

	var connectormat = new THREE.MeshPhongMaterial({
		color: Colors.lightgray,
		transparent: true,
		opacity: .3,
		shading: THREE.FlatShading,
	});

	/*na1 = new THREE.Mesh(sodium, namat);
	cl1 = new THREE.Mesh(sodium, clmat);
	this.mesh.add(na1);
	this.mesh.add(cl1);*/
	/*connect1 = new THREE.Mesh(connect, connectormat);
	connect1.rotation.z = Math.PI/2;
	connect1.position.x = dis/2;
	connect1.position.y = 6;*/
	//this.mesh.add(connect1);

	var i, j, k;
	var atom;
	var x, y, z;
	var m;

	var numKLayers = (n*2) + 2;

	//cl1 = new Sodium(na);
	//this.mesh.add(cl1);

	this.layers = [];

	for(k=0; k<numKLayers; k++){

		this.layers[k] = new THREE.Group();

		for(j=0; j<(n*2-1)-1; j++){
			for(i=0; i<(n*2-1)+1; i++){
				if((i+j+k)%2==0){
					cl1 = new THREE.Mesh(chloride, clmat);
					//cl1 = new Sodium(na);
					cl1.position.x += i*dis;
					cl1.position.y -= j*dis;
					cl1.position.z = 0;
					// this.mesh.add(cl1);
					this.layers[k].add(cl1);
					atom = cl1;
					x = i*dis;
					y = -j*dis;
					z = -k*dis;
				}else{
					na1 = new THREE.Mesh(sodium, namat);
					na1.position.x += i*dis;
					na1.position.y -= j*dis;
					cl1.position.z = 0;
					// this.mesh.add(na1);
					this.layers[k].add(na1);
					atom = na1;
				}
				if(i!=0){
					//connect1 = new THREE.Mesh(connect, connectormat);
					for(m=0; m<5; m++){
					connect1 = new THREE.Mesh(connectsmall, connectormat);
					connect1.rotation.z = Math.PI/2;
					connect1.position.z = 0;
					connect1.position.y = atom.position.y;
					connect1.position.x = atom.position.x - .45*m*dis/2 - .05*dis/2;
					// this.mesh.add(connect1);
					this.layers[k].add(connect1);
					}
				}
				if(j!=0){
					//connect2 = new THREE.Mesh(connect, connectormat);
					for(m=0; m<5; m++){
					connect2 = new THREE.Mesh(connectsmall, connectormat);
					connect2.position.y = atom.position.y + .45*m*dis/2 + .05*dis/2;
					connect2.position.x = atom.position.x;
					connect2.position.z = 0;
					// this.mesh.add(connect2);
					this.layers[k].add(connect2);
					}
				}
				if(k!=0){
					//connect1 = new THREE.Mesh(connect, connectormat);
					for(m=0; m<5; m++){
					connect1 = new THREE.Mesh(connectsmall, connectormat);
					connect1.rotation.x = Math.PI/2;
					connect1.position.x = atom.position.x;
					connect1.position.y = atom.position.y;
					connect1.position.z = - .45*m*dis/2 - .05*dis/2;
					// this.mesh.add(connect1);
					this.layers[k].add(connect1);
					}
				}
			}
		}
		this.layers[k].position.z -= k*dis;
		this.mesh.add(this.layers[k]);
	}

	this.mesh.receiveShadow = true;

	this.update = function() {
		var speed = 25;
		for (var i = 0; i < numKLayers; i++) {
			// console.log(this.layers[i].position.z);
			if (this.layers[i].position.z >= 200) {
				this.layers[i].position.z -= numKLayers*dis + speed;
			}
			this.layers[i].position.z += speed;
		}
	}
};

var salt;

function createSalt(){
	var n = 4;
	salt = new Salt(n);
	var move = (n-1)*16*(8+8*2)/3;
	salt.mesh.position.y = 1.3*move;
	salt.mesh.position.x = -1.1*move;
	salt.mesh.position.z = -100;
	scene.add(salt.mesh);
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
	salt.update();

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
