var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
	gray: 0x999999,
	lightgray: 0xbbbbbb
};

var texture;

window.addEventListener('load', controller, false);
/*window.addEventListener('load', create_textures, false);
window.addEventListener('load', init, false);*/

function controller(){
	create_textures(function(){
		init();
	});
}

function create_textures(callback){
	//THREE.ImageUtils.crossOrigin = '';
	//texture = new THREE.ImageUtils.loadTexture( "./crate.jpg");
	var loader = new THREE.TextureLoader();

	//allow cross origin loading
	loader.crossOrigin = '';

	// load a resource
	//loader.load('http://spiralgraphics.biz/packs/crystal_cut/previews/Salt.jpg', function(txtr){texture=txtr;});
	//texture = new THREE.TextureLoader().load( "./crate.jpg");
	/*texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 4, 4 );*/
	callback();
}

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
	scene.fog = new THREE.Fog(0x1e1d1b, -50, 800);

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

var time = 0;
Salt = function(n){
	var na = 4;
	var cl = 2*na;
	var dis = 16*(na+cl)/3;
	var connectsmall = new THREE.CylinderGeometry(.2*na, .2*na, .1*dis);
	na *= 2;
	cl *= 1.5;
	this.mesh = new THREE.Object3D();

	//var sodium = new THREE.SphereGeometry(na, 100, 100);
	//var sodium = new THREE.BoxGeometry(na, na, na, 20, 20, 20);
	var sodium = new THREE.BoxGeometry(na, na, na);
	//var chloride = new THREE.SphereGeometry(cl, 100, 100);
	//var chloride = new THREE.BoxGeometry(cl, cl, cl, 20, 20, 20);
	var chloride = new THREE.BoxGeometry(cl, cl, cl);
	//var connect = new THREE.CylinderGeometry(.2*na, .2*na, dis, 100, 100);

	var sampleTexture = THREE.ImageUtils.loadTexture('../salt.jpg');
	sampleTexture.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;

	var noiseTexture = THREE.ImageUtils.loadTexture('../crate.jpg');
	noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

	customUniforms = {
		baseTexture: 	{ type: "t", value: sampleTexture },
		baseSpeed: 		{ type: "f", value: 0.05 },
		noiseTexture: 	{ type: "t", value: noiseTexture },
		noiseScale:		{ type: "f", value: 0.5337 },
		alpha: 			{ type: "f", value: 1.0 },
		time: 			{ type: "f", value: 1.0 },				
	    fogColor:    { type: "c", value: scene.fog.color },
   		fogNear:     { type: "f", value: scene.fog.near },
    	fogFar:      { type: "f", value: scene.fog.far }
	};

	var namat = new THREE.ShaderMaterial({
		uniforms: customUniforms,
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent,
		fog: true,
				// map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
	});

	var namat2 = new THREE.MeshPhongMaterial({
		color: 0x52BEE7,
		transparent: true,
		opacity: .9,
		shading: THREE.FlatShading,
		//map: texture,
		bumpMap: sampleTexture
	});

	var sampleTexture2 = THREE.ImageUtils.loadTexture('../salt2.jpg');
	sampleTexture2.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;
	customUniforms2 = {
		baseTexture: 	{ type: "t", value: sampleTexture2 },
		baseSpeed: 		{ type: "f", value: 0.05 },
		noiseTexture: 	{ type: "t", value: noiseTexture },
		noiseScale:		{ type: "f", value: 0.5337 },
		alpha: 			{ type: "f", value: 1.0 },
		time: 			{ type: "f", value: 1.0 },				
		fogColor:    { type: "c", value: scene.fog.color },
    	fogNear:     { type: "f", value: scene.fog.near },
   		fogFar:      { type: "f", value: scene.fog.far }
	};
	var clmat = new THREE.ShaderMaterial({
				uniforms: customUniforms2,
				vertexShader: document.getElementById('vertexShader').textContent,
				fragmentShader: document.getElementById('fragmentShader').textContent,
				fog: true,
				// map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
			});

	var clmat2 = new THREE.MeshPhongMaterial({
		color: 0xC1294D,
		transparent: true,
		opacity: .9,
		shading: THREE.FlatShading,
		bumpMap: sampleTexture2
	});

	var connectormat = new THREE.MeshPhongMaterial({
		color: Colors.lightgray,
		transparent: true,
		opacity: .5,
		shading: THREE.FlatShading,
	});


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

		for(j=0; j<(n*2-2); j++){
			for(i=0; i<(n*2); i++){
				if((i+j+k)%2==0){
					cl1 = new THREE.Mesh(chloride, clmat);
					cl1.position.x += i*dis;
					cl1.position.y -= j*dis;
					//cl1.position.z = 0;
					this.layers[k].add(cl1);
					atom = cl1;
					/*x = i*dis;
					y = -j*dis;
					z = -k*dis;*/
				}else{
					na1 = new THREE.Mesh(sodium, namat);
					na1.position.x += i*dis;
					na1.position.y -= j*dis;
					//cl1.position.z = 0;
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
					connect1.position.x = atom.position.x + (.1*dis*(2*m + 1))%dis;
					// this.mesh.add(connect1);
					this.layers[k].add(connect1);
					}
				}
				if(j!=0){
					//connect2 = new THREE.Mesh(connect, connectormat);
					for(m=0; m<5; m++){
					connect2 = new THREE.Mesh(connectsmall, connectormat);
					connect2.position.y = atom.position.y + (.1*dis)*(2*m + 1);
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
					//connect1.position.z = .40*m*dis/2 - .20*dis/2;
					connect1.position.z = (.1*dis)*(2*m - 1);
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
		var speed = 2;
		for (var i = 0; i < numKLayers; i++) {
			// console.log(this.layers[i].position.z);
			if (this.layers[i].position.z >= 225) {
				this.layers[i].position.z -= numKLayers*dis + speed;
			}
			this.layers[i].position.z += speed;
		}
		//na1.material.uniforms.time.value += .005;
		//na1.rotation.y += .003;
	}
};

var salt;

function createSalt(){
	var n = 4;
	salt = new Salt(n);
	var move = (n-1)*16*(4+4*2)/3;
	salt.mesh.position.y = 1.3*move;
	salt.mesh.position.x = -1.1*move;
	//salt.mesh.position.z = 00;
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
	time += 1;
	//console.log(time);
	salt.update(time);

	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(loop);
}

