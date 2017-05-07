const COLORS = {
	Blue: 0x66b7ff,
	Ice: 0xadf6ff,
	LightBlue: 0xeaf2ff,
	Red: 0xff0000,
	White: 0xffffff,
	Gray: 0xe1e1e1
};

var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;

//global variables for testing
var meth = []; var temp; var neg = -1; var fog; var gasherbrum; var torusRing;

//separate function for loop
function loop(){
	World.update();
	World.renderer.render(World.scene, World.camera);
	window.requestAnimationFrame(loop);
}

//WORLD CLASS.. will eventually control transitions/destruction of objects. find a way to customize populate function?

class WORLD{
	constructor(){ //initialize scene
		var scene, camera, aspectRatio, near, far, fieldOfView, renderer;
		var ORIGIN;

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

		aspectRatio = WIDTH/HEIGHT;
		near = .1;
		far = 5000;

		camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far);
		camera.position.set(0, 0, 1000);

		renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
		renderer.setClearColor(0x111111);
		renderer.setSize(WIDTH, HEIGHT);
		renderer.shadowMapEnabled = true;
		document.body.appendChild(renderer.domElement);
		this.objects = [];
		this.lights = [];
		this.scene = scene;
		this.camera = camera;
		this.renderer = renderer;
		return this;
	}

	createLights(){
		var directionalLight = new THREE.DirectionalLight(COLORS.White, .7);
		directionalLight.position.set(-1, 1, 0).normalize();
		var hemLight = new THREE.HemisphereLight(COLORS.Blue, COLORS.LightBlue);
		// scene.add(hemLight);
		this.scene.add(directionalLight);
		this.lights.push(directionalLight);
	}

	populate(){
		torusRing = new TorusRing(50, 0, 0, 900);
		this.scene.add(torusRing.mesh);
		this.objects.push(torusRing);
	}

	update(){
		for (var i=0; i<this.objects.length; i++){
			this.objects[i].update();
		}
	}
}

var World = new WORLD();

//BASE CLASSES

class Item{
	constructor(mesh, x, y, z){
		this.mesh = mesh;
	}
	rotate(x, y, z){ 
		this.mesh.rotation.x += x;
		this.mesh.rotation.y += y;
		this.mesh.rotation.z += z;
	}
}

class Atom extends Item{
	constructor(mesh, x, y, z){
		super(mesh, x, y, z);
	}
}

class Molecule extends Item{
	constructor(mesh, x, y, z){
		super(mesh, x, y, z);
	}
}

class iceNucleus extends Atom{
	constructor(x, y, z){
		var innerGeom, outerGeom, mat, glowMat, nucleus, glow, mesh;
		innerGeom = new THREE.SphereGeometry(10, 40, 40, 0, Math.PI * 2, 0, Math.PI * 2); //constructor	
		outerGeom = innerGeom.clone();
		outerGeom.mergeVertices();

		mat = new THREE.MeshPhongMaterial({
			shininess: 25,
			ambient: 0x050505,
			specular: 0xffffff,
			emissive: COLORS.Ice,
			color: COLORS.Blue
		});

		for (var i=0; i<outerGeom.vertices.length; i++){
			outerGeom.vertices[i].x += Math.cos(Math.random()*2*Math.PI) * Math.random() ;
			outerGeom.vertices[i].x += Math.sin(Math.random()*2*Math.PI) * Math.random() ;
		}

		glowMat = new THREE.ShaderMaterial( 
		{
		    uniforms: 
			{ 
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 1.4 },
				glowColor: { type: "c", value: new THREE.Color(COLORS.Blue) },
				viewVector: { type: "v3", value: World.camera.position }
			},
			vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
	}   );

		nucleus = new THREE.Mesh(innerGeom, mat);
		nucleus.position.set(x, y, z);

		glow = new THREE.Mesh(outerGeom, glowMat);
		glow.position.set(x, y, z);
		glow.scale.multiplyScalar(1.5);

		mesh = new THREE.Group();
		mesh.add(nucleus);
		mesh.add(glow);
		super(mesh, x, y, z);
		return this;
	}
}

class Triangle extends Atom{
	constructor(color, thickness, x, y, z){
		this.slices = []; //array of triangle slice meshes
		this.mesh = new THREE.Group();

		var geom, mat, triangle, mesh;
		var spaceBetween = thickness/10;
		var _this = this;
		for (var i=0; i< thickness; i++){
			geom = new THREE.RingGeometry(5, 10, 1, 1);

			mat = new THREE.MeshPhongMaterial({
				shininess: 25,
				ambient: 0x050505,
				specular: 0xffffff,
				emissive: color,
				// transparent: true,
				// opacity: .5
			});

			triangle = new THREE.Mesh(geom, mat);
			triangle.position.set(0, 0, i*spaceBetween);
			_this.mesh.add(triangle);
			_this.slices.push(triangle);
		}
		return this;
	}
}

Gasherbrum = function(x, y, z){ //four intersecting triangles
	var geom, mat, tri1, tri2, tri3, tri4, mesh;

	tri1 = new Triangle(COLORS.Red, 5, 0, 0, 0);
	tri1.mesh.rotation.z = Math.PI/2;

	tri2 = new Triangle(COLORS.Blue, 5, 0, 0, 0);
	tri2.mesh.rotation.z = Math.PI/2;
	tri2.mesh.rotation.y += Math.PI/2;
	tri2.mesh.rotation.z += Math.PI/3;

	tri3 = new Triangle(COLORS.White, 5, 0, 0, 0);
	tri3.mesh.rotation.z = Math.PI/2 + Math.PI/3;
	tri3.mesh.rotation.y += Math.PI/2;
	// tri3.mesh.rotation.y = Math.PI/3;
	// tri3.mesh.rotation.z = Math.PI/4;

	tri4 = new Triangle(COLORS.Ice, 5, 0, 0, 0);
	tri4.mesh.rotation.y = Math.PI/2;

	mesh = new THREE.Group();
	mesh.add(tri1.mesh); 
	mesh.add(tri2.mesh); mesh.add(tri3.mesh); mesh.add(tri4.mesh);
	mesh.position.set(x, y, z);

	this.mesh = mesh;
	return this;
}

class Torus extends Atom{
	constructor(x, y, z){
		var mesh = new THREE.Group();
		var geom = new THREE.TorusGeometry( 12, 2, 5, 7);
		var mat = new THREE.MeshPhongMaterial({
			shininess: 25,
			ambient: 0x050505,
			specular: 0xffffff,
			emissive: COLORS.Ice,
			opacity: .8,
			transparent: true,
		});

		var torus = new THREE.Mesh(geom, mat);
		torus.position.set(0, 0, 0);
		mesh.add(torus);

		var outerGeom = new THREE.SphereGeometry(20, 40, 40); //constructor
		outerGeom.mergeVertices();

		// for (var i=0; i<outerGeom.vertices.length; i++){
		// 	outerGeom.vertices[i].x += Math.cos(Math.random()*2*Math.PI) * 10*Math.random() ;
		// 	outerGeom.vertices[i].x += Math.sin(Math.random()*2*Math.PI) * 10*Math.random() ;
		// }

		var glowMat = new THREE.ShaderMaterial( 
		{
		    uniforms: 
			{ 
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 1.4 },
				glowColor: { type: "c", value: new THREE.Color(COLORS.Blue) },
				viewVector: { type: "v3", value: World.camera.position }
			},
			vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true, 
			opacity: .5
		}   );

		var forceField = new THREE.Mesh(outerGeom, glowMat);
		forceField.position.set(0, 0, 0);
		// mesh.add(forceField);
		
		mesh.position.set(x, y, z);
		super(mesh, x, y, z);
		return this;
	}
	update(){
		this.rotate(0, 0, .05);
	}
}

class TorusRing extends Molecule{
	constructor(radius, x, y, z){
		var dispX, dispY, temp, lightning;
		var angle = Math.PI/3;
		var mesh = new THREE.Group();
		var atoms = [];

		for (var i=0; i<6; i++){
			angle = i*Math.PI/3; //add rings
			dispX = radius*Math.cos(angle);
			dispY = radius*Math.sin(angle);
			console.log(dispX + ", " + dispY);
			temp = new Torus(dispX, dispY, 0);
			temp.mesh.rotation.x += Math.PI/2;
			temp.mesh.rotation.y += angle;
			atoms.push(temp);
			mesh.add(temp.mesh);

			lightning = new Lightning(1, 50, dispX, dispY, 0); //add lightnings
			lightning.mesh.rotation.z += angle + Math.PI/3;
			lightning.mesh.position.x -= 25*Math.cos(angle + Math.PI/3);
			lightning.mesh.position.y -= 25*Math.sin(angle + Math.PI/3);
			atoms.push(lightning);
			mesh.add(lightning.mesh);
		}

		var nucleus = new iceNucleus(0, 0, 0);
		mesh.add(nucleus.mesh);

		mesh.position.set(x, y, z);
		super(mesh, x, y, z);

		this.atoms = atoms.slice();

		var _this = this;
		this.amp = Math.random()*.005;
		return this;
	}
	update(){
		for (var i=0; i<this.atoms.length; i++){
				this.atoms[i].update();
		}
		this.rotate(Math.random()*this.amp, Math.random()*this.amp, Math.random()*this.amp);
	}
}

class Lightning extends Atom{
	constructor(radius, length, x, y, z){
		var geom, mat, cylinder;
		geom = new THREE.CylinderGeometry(radius, radius, length, 2, 50);
		geom.mergeVertices();
		var vertices = [];

		for (var i=0; i<geom.vertices.length; i++){
			var v = geom.vertices[i];

			vertices.push({
				x: v.x,
				y: v.y,
				z: v.z,
				angle: Math.PI/2, //Math.random() * Math.PI * 2, 
				amp: Math.random()*3.5,
				speed: Math.random()*2
			});
		}

		mat = new THREE.MeshPhongMaterial({
			shininess: 50,
			ambient: 0x050505,
			emissive: COLORS.Ice,
			wireframe: true,
			wireframeLinecap: "round",
			wireframeLinejoin: "round",
			wireFrameLinewidth: .1
		});

		cylinder = new THREE.Mesh(geom, mat);
		cylinder.position.set(x, y, z);
		cylinder.rotation.z = Math.PI/2

		super(cylinder, x, y, z);
		this.vertices = vertices.slice();
		return this;
	}

	crackle(){
		var verts = this.mesh.geometry.vertices;
		var length = verts.length;

		for (var i=0; i<length; i++){
			var v = verts[i];
			var vprops = this.vertices[i];

			// v.x = vprops.x + Math.cos(vprops.angle)*vprops.amp;
			v.x = vprops.x + Math.sin(vprops.angle)*vprops.amp;

			vprops.angle += vprops.speed;
		}

		this.mesh.geometry.verticesNeedUpdate = true;
		// this.mesh.rotation.x += .0025;
	}

	update(){
		this.crackle();
	}
}

//mouse events

var mouse = {x:0,y:0};
var cameraMoves = {x:0,y:0,z:-0.1,move:false,speed: 20};

function handleMouseMove(e){
	World.camera.position.x += Math.max(Math.min((e.clientX - mouse.x) * 1, cameraMoves.speed), -cameraMoves.speed);
	World.camera.position.y += Math.max(Math.min((mouse.y - e.clientY) * 1, cameraMoves.speed), -cameraMoves.speed);

    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.addEventListener('mousemove', handleMouseMove);

//Start the scene

World.createLights();
World.populate();

loop();