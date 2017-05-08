var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
	gray: 0x999999
};

window.addEventListener('load', init, false);

function init() {
	// set up the scene, the camera and the renderer
	createScene();

	// add the lights
	createLights();

	// add the objects
	createSalt();

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

Salt = function(){
	var n = 3;
	var na = 4;
	var cl = 2*na;
	var dis = 10*(na+cl)/3;
	this.mesh = new THREE.Object3D();

	var sodium = new THREE.SphereGeometry(na, 100, 100);
	var chloride = new THREE.SphereGeometry(cl, 100, 100);
	var connect = new THREE.CylinderGeometry(.2*na, .2*na, dis, 100, 100);

	var namat = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: 1,
		shading: THREE.FlatShading,
	});

	var clmat = new THREE.MeshPhongMaterial({
		color: Colors.red,
		transparent: true,
		opacity: 1,
		shading: THREE.FlatShading,
	});

	var connectormat = new THREE.MeshPhongMaterial({
		color: Colors.gray,
		transparent: true,
		opacity: .9,
		shading: THREE.FlatShading,
	});

	/*na1 = new THREE.Mesh(sodium, namat);
	cl1 = new THREE.Mesh(sodium, clmat);
	this.mesh.add(na1);
	this.mesh.add(cl1);*/
	connect1 = new THREE.Mesh(connect, connectormat);
	connect1.rotation.z = Math.PI/2;
	connect1.position.x = dis/2;
	connect1.position.y = 6;
	//this.mesh.add(connect1);

	var i;
	var j;
	var atom;

	for(i=0; i<(n*2-1); i++){
		for(j=0; j<(n*2-1); j++){
			for(k=0; k<(n*2-1); k++){
				if((i+j+k)%2==0){
					cl1 = new THREE.Mesh(chloride, clmat);
					cl1.position.x += i*dis;
					cl1.position.y -= j*dis;
					cl1.position.z -= k*dis;
					this.mesh.add(cl1);
					atom = cl1;
				}else{
					na1 = new THREE.Mesh(sodium, namat);
					na1.position.x += i*dis;
					na1.position.y -= j*dis;
					na1.position.z -= k*dis;
					this.mesh.add(na1);
					atom = na1;
				}
				if(i!=0){
					connect1 = new THREE.Mesh(connect, connectormat);
					connect1.rotation.z = Math.PI/2;
					connect1.position.z = atom.position.z;
					connect1.position.y = atom.position.y;
					connect1.position.x = atom.position.x - dis/2;
					this.mesh.add(connect1);
				}
				if(j!=0){
					connect2 = new THREE.Mesh(connect, connectormat);
					//connect1.rotation.z = Math.PI/2;
					connect2.position.y = atom.position.y + dis/2;
					connect2.position.x = atom.position.x;
					connect2.position.z = atom.position.z;
					this.mesh.add(connect2);
				}
				if(k!=0){
					connect1 = new THREE.Mesh(connect, connectormat);
					connect1.rotation.x = Math.PI/2;
					connect1.position.x = atom.position.x;
					connect1.position.y = atom.position.y;
					connect1.position.z = atom.position.z + dis/2;
					this.mesh.add(connect1);
				}
			}
		}
	}

	this.mesh.receiveShadow = true;
};

var salt;

function createSalt(){
	salt = new Salt();
	salt.mesh.position.y = 175;
	salt.mesh.position.x = -75;
	salt.mesh.position.z = -50;
	scene.add(salt.mesh);
}

renderer.render(scene, camera);

function loop(){
	// Rotate the propeller, the sea and the sky
	//airplane.propeller.rotation.x += 0.3;
	//sea.mesh.rotation.z += .005;
	//sky.mesh.rotation.z += .01;
	/*glycine.mesh.rotation.x += 0.005;
	glycine.mesh.rotation.y += 0.005;
	glycine.mesh.rotation.z += 0.005;*/

	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(loop);
}