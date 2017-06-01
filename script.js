const COLORS = {
	Blue: 0x66b7ff,
	Ice: 0xadf6ff,
	LightBlue: 0xeaf2ff,
	Red: 0xff0000,
	White: 0xffffff,
	Gray: 0xe1e1e1,
	DarkBlue: 0x070a19
};

var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;
const ORIGIN = new THREE.Vector3(0, 0, 0);

//global variables for testing
var test;
var customUniforms;
var iceTube;
var meth = []; var temp; var temp2; var temp3; var neg = -1; var fog; var gasherbrum; var torusRing; var metalNode; var metalLayer; var metalLayer2; var background;
var reflectiveMaterial;
var canPopulate = true; //use this to control intervals between adding molecules
var domeRadius = 50;
var birthRadius = domeRadius/10;
var TITLE;
var globalIceSphere;

//auxillary functions
function loop(){
	World.update(); //update positions of all objects in scene
	World.collectTrash();
	// World.camera.position.z -= 1.5;
	World.renderer.render(World.scene, World.camera);
	window.requestAnimationFrame(loop);
}

function addWater(){
	var angle, posX, posY;
	angle = Math.random() *2*Math.PI;
	posX = Math.random()*birthRadius*Math.cos(angle);
	posY = Math.random()*birthRadius*Math.sin(angle);
	temp2 = new Water(1, angle, posX, posY, 1000);

	World.addMolecule(temp2);

	canPopulate = false;

	setTimeout(World.togglePopulate, 300); //cannot populate for another .3s
}

var requestId;
function collapseWorld(){
	if(World.collapse()){
		console.log("completed");
		window.cancelAnimationFrame(requestId);
		return;
	}
	requestId = window.requestAnimationFrame(collapseWorld);
}

var requestId2;
function float(){
	World.float(5, 2);
	requestId2 = window.requestAnimationFrame(float);
}

//WORLD CLASS.. will eventually control transitions/destruction of objects. find a way to customize populate function?

class WORLD{
	constructor(){ //initialize scene
		var scene, camera, cubeCamera, waterCubeCamera, aspectRatio, near, far, fieldOfView, renderer; //cube camera isn't necessary, but use it to test 

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

		aspectRatio = WIDTH/HEIGHT;
		near = .1;
		far = 5000;

		camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far);
		camera.position.set(0, 0, 1000);

		cubeCamera = new THREE.CubeCamera(near, far, 256); //by default, set cubeCamera in same position as regular camera w/ same near/far
		cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
		cubeCamera.position.set(0, 0, 900);
		scene.add(cubeCamera);

		waterCubeCamera = new THREE.CubeCamera(near, far, 256);
		waterCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
		waterCubeCamera.position.set(0, 0, 980);

		scene.add(waterCubeCamera);

		renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
		renderer.setClearColor(COLORS.DarkBlue);
		renderer.setSize(WIDTH, HEIGHT);
		renderer.shadowMapEnabled = true;
		document.body.appendChild(renderer.domElement);
		this.objects = [];
		this.zPositions = [];
		this.lights = [];
		this.scene = scene;
		this.camera = camera;
		this.cubeCamera = cubeCamera;
		this.waterCubeCamera = waterCubeCamera;
		this.renderer = renderer;
		this.canPopulate = true;
		return this;
	}

	createLights(){
		var directionalLight = new THREE.DirectionalLight(COLORS.White, .7);
		directionalLight.position.set(0, 0, 1).normalize();
		var ambientLight = new THREE.AmbientLight();
		ambientLight.position.set(0, 0, 950);
		var hemLight = new THREE.HemisphereLight(COLORS.Blue, COLORS.LightBlue);
		// scene.add(hemLight);
		this.scene.add(directionalLight);
		// this.scene.add(ambientLight);
		// this.lights.push(ambientLight);
		this.lights.push(directionalLight);
	}

	populate(){
		// temp = new WaterCrystal(100, 0, 0, 955);

		// temp.mapToCube(this.waterCubeCamera);
		// this.scene.add(temp.mesh);
		// this.objects.push(temp);

		var angle, posX, posY, posZ;
		// for (var i=0; i<50; i++){
		// 	angle = Math.random() * 2*Math.PI;
		// 	posX = 30*Math.cos(angle);
		// 	posY = 2.5*Math.sin(Math.random());
		// 	posZ = 950 + 30*Math.sin(angle);
		// 	temp2 = new Water(1, posX, posY, posZ);
		// 	this.scene.add(temp2.mesh);
		// 	this.objects.push(temp2);
		// }

		// for (var i=0; i<50; i++){
		// 	angle = Math.random() *2*Math.PI;
		// 	posX = Math.random()*birthRadius*Math.cos(angle);
		// 	posY = Math.random()*birthRadius*Math.sin(angle);
		// 	temp2 = new Water(1, angle, posX, posY, 750);
		// 	this.objects.push(temp2);
		// 	this.scene.add(temp2.mesh);
		// }

		// temp = new WaterDome(domeRadius, 500, 0, 0, 1000);
		// temp.mapToCube(this.waterCubeCamera);
		// this.objects.push(temp);
		// this.scene.add(temp.mesh);

		TITLE = new Title('STATES', 0, 0, 900);
		this.scene.add(TITLE.mesh);
	}

	togglePopulate(){
		console.log('tog');
		if (this.canPopulate)
			this.canPopulate = false;
		else
			this.canPopulate = true;
	}

	addMolecule(molecule){
		this.objects.push(molecule);
		this.scene.add(molecule.mesh);
	}

	update(){

	}

	collectTrash(){
		for (var i=0; i<this.objects.length; i++){ //if past camera, remove from scene and delete from array
			if (this.objects[i].pastCamera() || this.objects[i].outOfRange()){
				this.scene.remove(this.objects[i].mesh);
				this.objects.splice(i, 1);
			}
		} 
	}

	collapse(){ //returns complete if all objects have reached the origin
		var objectsAtOrigin = true;
		var objectAtOrigin = false;
		for (var i=0; i<this.objects.length; i++){
			objectAtOrigin = this.objects[i].moveToward(0, 0, 0, 10);
			if(!objectAtOrigin){
				objectsAtOrigin = false;
			}
		}
		return objectsAtOrigin;
	}

	saveObjectPositions(){
		for (var i=0; i<this.objects.length; i++){
			this.objectPositions.push(this.objects[i].mesh.position);
		}
	}

	float(magnitude, speed){
		var x, y, z; //get current positions
		for(var i=0; i<World.objects.length; i++){
			x = this.objects[i].mesh.position.x;
			y = this.objects[i].mesh.position.y;
			z = this.objects[i].mesh.position.z;
			this.objects[i].moveToward(x+magnitude, y+magnitude, z+magnitude, speed);
		}
	}

	clearScene(){ //remove all existing objects except for light/camera, etc.
		for (var i=0; i<this.objects.length; i++){
			this.scene.remove(this.objects[i].mesh); //remove the mesh
		}
		this.objects = []; //clear objects array
	}
}

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
	translate(x, y, z){ //moves one unit towards a point in space
		this.mesh.position.x += x;
		this.mesh.position.y += y;
		this.mesh.position.z += z;
	}

	moveToward(x, y, z, magnitude){
		if (x == Math.floor(Math.abs(this.mesh.position.x)/magnitude) && y == Math.floor(Math.abs(this.mesh.position.y)/magnitude) && z == Math.floor(Math.abs(this.mesh.position.z)/magnitude)){
			// console.log(this.mesh.position);
			return true;
		} //if at the position already

		var amtX, amtY, amtZ;
		amtX = x-this.mesh.position.x;

		amtX = amtX/Math.abs(amtX);

		amtX *= magnitude;


		amtY = y-this.mesh.position.y;
		amtY = amtY/Math.abs(amtY);
		amtY *= magnitude;

		amtZ = z-this.mesh.position.z;
		amtZ = amtZ/Math.abs(amtZ);
		amtZ *= magnitude

		this.translate(amtX, amtY, amtZ);
		return false;
	}

	pastCamera(){
		return this.mesh.position.z > World.camera.position.z;
	}

	outOfRange(){
		return this.mesh.position.z < -700; //set max far to -1000
	}

	update(){ //default update
		return;
	}
}

class Atom extends Item{
	constructor(mesh, x, y, z){
		super(mesh, x, y, z);
	}
}

class Molecule extends Item{
	constructor(mesh, x, y, z, atoms){
		super(mesh, x, y, z);
		this.atoms = atoms;
	}

	update(){
		for (var i=0; i<this.atoms.length; i++){
			this.atoms[i].update();
		}
	}
}

class Title extends Item{
	constructor(text, x, y, z){
		var loader, geometry, mat, mesh;
		loader = new THREE.FontLoader();
		loader.load('/assets/helvetiker_regular.typeface.json', function(font){
			console.log(font);
			geometry = new THREE.TextGeometry('three.js', {
				font: font,
				size: 50,
				height: 5,
				curveSegments:12,
				bevelThickness: 5,
				bevelSize: 1,
				bevelEnabled: false,
			});
		});

		mat = new THREE.MeshPhongMaterial({
			color: 0xff0000,
			shading: THREE.FlatShading
		});
		mesh = new THREE.Mesh(geometry, mat);
		console.log(mesh);
		mesh.position.set(x, y, z);
		super(mesh, x, y, z);
	}
}

class WaterDome extends Item{
	constructor(radius, height, x, y, z){
		var mesh, geom, mat;

		geom = new THREE.CylinderGeometry(radius/5, radius, height, 3, 1, true);

		mat = new THREE.MeshBasicMaterial({transparent: true, opacity: 1});
		mat.side = THREE.DoubleSide; //see inside

		mesh = new THREE.Mesh(geom, mat);
		mesh.position.set(x, y, z); //place where the camera is
		mesh.rotation.x = -Math.PI/2;

		super(mesh, x, y, z);
	}

	mapToCube(cubeCamera){
		this.mesh.material.envMap = cubeCamera.renderTarget;
		this.cubeCamera = World.waterCubeCamera;
	}

	update(){
		this.mesh.rotation.y += .005;
		this.cubeCamera.updateCubeMap(World.renderer, World.scene);
	}
}

class WaterCrystal extends Molecule{
	constructor(height, x, y, z){
		var mesh, top, bottom, coneGeom, mat;
		var atoms = [];

		mesh = new THREE.Group();
		coneGeom = new THREE.CylinderGeometry(0, height/4, height/2, 8);

		mat = new THREE.MeshBasicMaterial({transparent: true, opacity: 1});

		top = new THREE.Mesh(coneGeom, mat);
		top.position.y = height/4;

		bottom = top.clone();
		bottom.position.y = -height/4;
		bottom.rotation.x = Math.PI;

		mesh.add(top);
		mesh.add(bottom);
		// mesh.add(new THREE.Mesh(new THREE.SphereGeometry(20, 30, 30), mat));
		mesh.position.set(x, y, z);

		super(mesh, x, y, z, atoms);
		this.cubeCamera = World.waterCubeCamera;
	}

	mapToCube(cubeCamera){
		for(var i=0; i<this.mesh.children.length; i++){
			this.mesh.children[i].material.envMap = cubeCamera.renderTarget;
		}
	}

	update(){
		this.mesh.rotation.y += .005;
		this.cubeCamera.updateCubeMap(World.renderer, World.scene);
	}
}

class Oxygen extends Atom{
	constructor(radius, x, y, z){
		var geom, innerGeom, mat, glowMat, mesh;

		mesh = new THREE.Group();

		geom = new THREE.SphereGeometry(radius, 30, 30);
		innerGeom = new THREE.SphereGeometry(radius/10, 15, 15);

		mat = new THREE.MeshPhongMaterial({
			shininess: 25,
			ambient: 0x050505,
			specular: 0xffffff,
			emissive: COLORS.Ice,
			color: COLORS.Blue
		});

		glowMat = new THREE.ShaderMaterial( 
		{
		    uniforms: 
			{ 
				"c":   { type: "f", value: 1.0 },
				"p":   { type: "f", value: 1.4 },
				glowColor: { type: "c", value: new THREE.Color(COLORS.White) },
				viewVector: { type: "v3", value: World.camera.position }
			},
			vertexShader:   document.getElementById( 'glowVertexShader'   ).textContent,
			fragmentShader: document.getElementById( 'glowFragmentShader' ).textContent,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		}  );

		mesh.add(new THREE.Mesh(geom, glowMat));
		mesh.add(new THREE.Mesh(innerGeom, mat));
		mesh.position.set(x, y, z);
		super(mesh, x, y, z);
		return this;
	}
}

class Hydrogen extends Atom{
	constructor(radius, x, y, z){
		var geom, mat, glowMat, mesh;
		geom = new THREE.SphereGeometry(radius, 30, 30);

		mat = new THREE.MeshPhongMaterial({
			shininess: 25,
			ambient: 0x050505,
			specular: 0xffffff,
			emissive: COLORS.Ice,
			color: COLORS.Blue
		});

		mesh = new THREE.Mesh(geom, mat);
		mesh.position.set(x, y, z);
		super(mesh, x, y, z);
		return this;
	}
}

class Water extends Molecule{
	constructor(size, angle, x, y, z){
		var oxygen, hydrogen, hydrogen2, mesh;
		var atoms = [];

		mesh = new THREE.Group();

		oxygen = new Oxygen(size/2, 0, 0, 0);

		hydrogen = new Hydrogen(size/4, 0, 0, 0);
		hydrogen.mesh.position.set(-size/1.5, -size/1.5, 0);
		hydrogen2 = new Hydrogen(size/4, 0, 0, 0);
		hydrogen2.mesh.position.set(size/1.5, -size/1.5, 0);

		atoms.push(oxygen);
		atoms.push(hydrogen);
		atoms.push(hydrogen2);

		mesh.add(oxygen.mesh);
		mesh.add(hydrogen.mesh);
		mesh.add(hydrogen2.mesh);

		mesh.position.set(x, y, z);

		super(mesh, x, y, z, atoms);
		this.angle = angle;
		this.speed = Math.random();
	}

	update(){
		// this.mesh.position.x = 30*Math.cos(this.angle);
		// this.mesh.position.z = 950 + 30*Math.sin(this.angle);
		// this.mesh.position.y = 20*Math.sin(this.angle);

		// this.mesh.rotation.z += this.speed*.05;
		// this.mesh.rotation.y += this.speed*.05;
		// // console.log(Math.cos(this.angle));
		// if (this.angle >= Math.PI*2){
		// 	console.log('angle limit');
		// 	this.angle = 0;
		// }
		// else{
		// 	this.angle += this.speed*.005;
		// }

		// this.mesh.position.z += .05;
		// this.mesh.position.y = 20*Math.sin(this.angle);

		this.mesh.rotation.z += this.speed*.05;
		this.mesh.rotation.y += this.speed*.05;

		this.mesh.position.z -= this.speed*.5;
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
	constructor(radius, x, y, z){
		var mesh = new THREE.Group();
		var geom = new THREE.TorusGeometry( radius, 2, 5, 7);
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
			temp = new Torus(12, dispX, dispY, 0);
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

		atoms = atoms.slice();
		super(mesh, x, y, z, atoms);

		var _this = this;
		this.amp = Math.random()*.01;
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
 
class MetalNode extends Atom{ //construct them with radius 1
	constructor(radius, x, y, z){
		var mesh = new THREE.Group();

		var geom = new THREE.TorusGeometry(1, 10, 4, 25, 6.3);
		var mat = new THREE.MeshBasicMaterial({transparent: true, opacity: 1, shading: THREE.SmoothShading});

		var centralMesh = new THREE.Mesh(geom, mat);
		centralMesh.rotation.x += Math.PI/2;
		centralMesh.position.set(0, 0, 0);

		var sphereGeom = new THREE.SphereGeometry(1, 32, 32);
		var sphereMeshTop = new THREE.Mesh(sphereGeom, mat);
		var sphereMeshBottom = sphereMeshTop.clone();
		sphereMeshTop.position.set(0, 15, 0);
		sphereMeshBottom.position.set(0, -15, 0);

		mesh.add(centralMesh);
		mesh.add(sphereMeshTop);
		mesh.add(sphereMeshBottom);
		mesh.position.set(x, y, z);

		super(mesh, x, y, z);
		return this;
	}

	mapToCube(cubeCamera){
		for(var i=0; i<this.mesh.children.length; i++){
			this.mesh.children[i].material.envMap = cubeCamera.renderTarget;
		}
	}

	update(){
		this.mesh.children[0].geometry.arc -= .01;
		this.mesh.rotation.x += .01;
		this.mesh.rotation.y += .01;
		this.mesh.rotation.z += .01;
	}
}

class MetalLayer extends Molecule{
	constructor(radius, x, y, z, hasNucleus, numNodes, spinDirection, cubeCamera){ //pass in "nucleus" argument as 1 or 0 only (T/F)
		var dispX, dispY, temp, lightning;
		var angle = 2*Math.PI/numNodes;
		var tempAngle;
		var mesh = new THREE.Group();
		var atoms = [];

		for (var i=0; i<numNodes; i++){
			tempAngle = i*angle; //add rings
			dispX = radius*Math.cos(tempAngle);
			dispY = radius*Math.sin(tempAngle);
			temp = new MetalNode(1, dispX, dispY, 0);
			temp.mesh.rotation.x += Math.PI/2;
			temp.mesh.rotation.y += angle;
			atoms.push(temp);
			mesh.add(temp.mesh);

			// lightning = new Lightning(1, 50, dispX, dispY, 0); //add lightnings
			// lightning.mesh.rotation.z += angle + Math.PI/3;
			// lightning.mesh.position.x -= 25*Math.cos(angle + Math.PI/3);
			// lightning.mesh.position.y -= 25*Math.sin(angle + Math.PI/3);
			// atoms.push(lightning);
			// mesh.add(lightning.mesh);
		}

		if (hasNucleus){
			var nucleus = new IceCube(0, 0, 0);
			nucleus.mesh.rotation.x = Math.PI/2;
			mesh.add(nucleus.mesh);
			atoms.push(nucleus);
		}

		mesh.position.set(x, y, z);
		atoms = atoms.slice();
		super(mesh, x, y, z, atoms);

		var _this = this;

		for (var i=0; i<this.atoms.length-hasNucleus; i++){ 
			this.atoms[i].mapToCube(cubeCamera);
		}
		
		if (spinDirection == 0)
			this.spin = -1;
		else
			this.spin = 1;

		return this;
	}

	update(){
		for(var i=0; i<this.atoms.length; i++){
			this.atoms[i].update();
		}
		this.mesh.rotation.z += .01*this.spin;
	}
}

class LightningCircle extends Atom{
	constructor(radius, x, y, z){
		var geom, mat, circle;
		geom = new THREE.TorusGeometry(radius, .75, 10, 65);
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

		circle = new THREE.Mesh(geom, mat);
		circle.position.set(x, y, z);
		circle.rotation.z = Math.PI/2

		super(circle, x, y, z);
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

class IceCube extends Atom{
	constructor(x, y, z){
		var mesh = new THREE.Group();
		var mat = new THREE.MeshPhongMaterial({ //use this material for the cylinder (inner)
			shininess: 25,
			ambient: 0x050505,
			specular: 0xffffff,
			emissive: COLORS.Ice,
			color: COLORS.Blue
		});

		var cylinderGeom = new THREE.CylinderGeometry(5, 10, 15, 3, 1);
		var cylinder = new THREE.Mesh(cylinderGeom, mat);
		cylinder.position.set(0, 0, 0);
		mesh.add(cylinder);

		var lightningCircles = [];
		var temp;

		for (var i=1; i>-2; i--){
			temp = new LightningCircle(15, 0, 0, 0);
			temp.mesh.rotation.x = Math.PI/2;
			temp.mesh.position.y = i*8;
			mesh.add(temp.mesh);
			lightningCircles.push(temp);
		}

		mesh.position.set(x, y, z);
		super(mesh, x, y, z);
		this.lightningCircles = lightningCircles;
	}

	update(){
		for (var i=0; i<this.lightningCircles.length; i++){
			this.lightningCircles[i].update();
		}
		this.mesh.rotation.x += .01*Math.random();
		this.mesh.rotation.y += .02*Math.random();
		this.mesh.rotation.z += .03*Math.random();
	}
}

class IceTube extends Item{
	constructor(x, y, z, rotation, length){
		var mesh = new THREE.Group();
		var layers = [];

		var cubeCamera = new THREE.CubeCamera(World.near, World.far, 256);
		cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
		cubeCamera.position.set(x, y, z+120); //set right in front of the layer
		// World.scene.add(cubeCamera);

		mesh.add(cubeCamera);

		for (var i=1; i<length+1; i++){
			if (i==1)
				temp = new MetalLayer(50*i, 0, 0, z+100*i, 1, 3*i, i%2, cubeCamera);
			else{
				temp = new MetalLayer(50*i, 0, 0, z+100*i, 0, 3*i, i%2, cubeCamera);
			}

			layers.push(temp);
			mesh.add(temp.mesh);
		}

		mesh.rotation.y = rotation;

		super(mesh, x, y, z);
		this.mesh = mesh;
		this.layers = layers;
		this.cubeCamera = cubeCamera;
	}

	update(){
		for(var i=0; i<this.layers.length; i++){
			this.layers[i].update();
		}
		this.cubeCamera.updateCubeMap(World.renderer, World.scene);
	}
}

class Background extends Item{
	constructor(height, x, y, z){
		var geom = new THREE.SphereGeometry(200, 32, 32);
		var material =  new THREE.MeshBasicMaterial({transparent: true, opacity: 1, color: COLORS.Red, shading: THREE.SmoothShading});
		// material.envMap = World.cubeCamera.renderTarget;

		var mesh = new THREE.Mesh(geom, material);
		mesh.position.set(x, y, z);

		super(mesh, x, y, z);
		return this;
	}

	update(){
		// this.mesh.rotation.y += Math.PI/2/360;
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

window.addEventListener('mousedown', addWater);

// window.addEventListener('mousemove', handleMouseMove);

//render

var World = new WORLD();

World.createLights();
World.populate();

loop();