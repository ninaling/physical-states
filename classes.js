const COLORS = {
	Blue: 0x66b7ff,
	Ice: 0xadf6ff,
	LightBlue: 0xeaf2ff,
	Red: 0xff0000,
	White: 0xffffff,
	Gray: 0xe1e1e1,
	DarkBlue: 0x070a19,
	iron: 0x6b6e72,
	electron: 0xffffff
};

//CLASS DECLARATIONS

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

	spinWildly(){
		var i=0;
		var _this = this;
		var speed = Math.random() + .5;
		var interval = setInterval(function(){
			if (i > 200){
				clearInterval(interval);
				return;
			}
			if (i<150){
				_this.mesh.rotation.y += .075*speed;
				_this.mesh.rotation.x += .075*speed;
				_this.mesh.rotation.z += .075*speed;
			}
			else if (i<160){
				_this.mesh.rotation.y += .05*speed;
				_this.mesh.rotation.x += .05*speed;
				_this.mesh.rotation.z += .05*speed;
			}
			else if (i<180){
				_this.mesh.rotation.y += .03*speed;
				_this.mesh.rotation.x += .03*speed;
				_this.mesh.rotation.z += .03*speed;
			}
			else if (i<190){
				_this.mesh.rotation.y += .02*speed;
				_this.mesh.rotation.x += .02*speed;
				_this.mesh.rotation.z += .02*speed;
			}
			else{
				_this.mesh.rotation.y += .01*speed;
				_this.mesh.rotation.x += .01*speed;
				_this.mesh.rotation.z += .01*speed;
			}
			i++;
		}, 5);
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
	constructor(mesh, x, y, z){
		super(mesh, x, y, z)
	}

	mapToCube(cubeCamera){
		this.mesh.material.envMap = cubeCamera.renderTarget;
		this.cubeCamera = cubeCamera;
	}

	update(){
		// this.mesh.rotation.y += .005;
		this.cubeCamera.updateCubeMap(World.renderer, World.scene);
	}
}

class TitleGlobe extends Item{
	constructor(radius, x, y, z){
		var mesh, geom, mat;
		var sampleTexture = new THREE.TextureLoader().load('/assets/images/microscopy2.jpg');
		sampleTexture.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;

		var noiseTexture = new THREE.TextureLoader().load('/assets/images/cloud.png');
		noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

		var customUniforms = {
			baseTexture: 	{ type: "t", value: sampleTexture },
			baseSpeed: 		{ type: "f", value: 0.01 },
			noiseTexture: 	{ type: "t", value: noiseTexture },
			noiseScale:		{ type: "f", value: 0.5 },
			alpha: 			{ type: "f", value: 1.0 },
			time: 			{ type: "f", value: 1.0 }
		};

		mat = new THREE.ShaderMaterial({
			uniforms: customUniforms,
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent,
			// map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
		});

		// mat = new THREE.MeshBasicMaterial({color: COLORS.Blue});

		mat.side = THREE.DoubleSide;

		geom = new THREE.SphereGeometry(radius, 30, 30);
		mesh = new THREE.Mesh(geom, mat);
		mesh.position.set(x, y, z);
		super(mesh, x, y, z);
	}

	update(){
		this.mesh.rotation.y += .005;
		this.mesh.rotation.x += .005;
		this.mesh.material.uniforms.time.value += .015;
	}

	distort(){
		console.log('disrty');
		var i=0;
		var _this = this;
		var interval = setInterval(function(){
			if (i > 200){
				clearInterval(interval);
				return;
			}
			if (i<150){
				_this.mesh.material.uniforms.time.value += .3;
			}
			else if (i<160){
				_this.mesh.material.uniforms.time.value += .05;
			}
			else if (i<180){
				_this.mesh.material.uniforms.time.value += .02;
			}
			else if (i<190){
				_this.mesh.material.uniforms.time.value += .01;
			}
			else{
				_this.mesh.material.uniforms.time.value += .005;
			}
			i++;
		}, 7);
	}
}

class IceDome extends Item{
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
    this.cubeCamera = World.iceCubeCamera;
  }

  update(){
    this.mesh.rotation.y += .005;
    this.cubeCamera.updateCubeMap(World.renderer, World.scene);
  }
}

class Ice extends Molecule{
  constructor(size, angle, dir, x, y, z){
    var oxygen, hydrogen, hydrogen2, mesh;
    var atoms = [];

    mesh = new THREE.Group();

    oxygen = new Oxygen(size/1.5, 0, 0, 0);

    var vertices = oxygen.mesh.children[0].geometry.vertices;

    for (var i=0; i<vertices.length; i++){
      vertices[i].x += Math.sin(Math.random())*.1;
      vertices[i].y += Math.sin(Math.random())*.1;
      vertices[i].z += Math.sin(Math.random())*.1;
    }

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
    this.dir = dir;
  }

  update(){
    // this.mesh.position.x = 30*Math.cos(this.angle);
    // this.mesh.position.z = 950 + 30*Math.sin(this.angle);
    // this.mesh.position.y = 20*Math.sin(this.angle);

    // this.mesh.rotation.z += this.speed*.05;
    // this.mesh.rotation.y += this.speed*.05;
    // // console.log(Math.cos(this.angle));
    // if (this.angle >= Math.PI*2){
    //  console.log('angle limit');
    //  this.angle = 0;
    // }
    // else{
    //  this.angle += this.speed*.005;
    // }

    // this.mesh.position.z += .05;
    // this.mesh.position.y = 20*Math.sin(this.angle);

    this.mesh.rotation.z += this.speed*.05;
    this.mesh.rotation.y += this.speed*.05;

    this.mesh.position.z += this.dir*this.speed*.5;
  }

  outOfRange(){
  	return this.mesh.position.z <= 800;
  }
}


class CubicIce extends Molecule{
  constructor(size, angle, x, y, z){
    var oxygen, hydrogen, hydrogen2, mesh;
    var atoms = [];

    mesh = new THREE.Group();

    oxygen = new CubicOxygen(size/1.5, 0, 0, 0);

    // var vertices = oxygen.mesh.children[0].geometry.vertices;

    // for (var i=0; i<vertices.length; i++){
    //   vertices[i].x += Math.sin(Math.random())*.1;
    //   vertices[i].y += Math.sin(Math.random())*.1;
    //   vertices[i].z += Math.sin(Math.random())*.1;
    // }

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
    //  console.log('angle limit');
    //  this.angle = 0;
    // }
    // else{
    //  this.angle += this.speed*.005;
    // }

    // this.mesh.position.z += .05;
    // this.mesh.position.y = 20*Math.sin(this.angle);

    this.mesh.rotation.z += this.speed*.05;
    this.mesh.rotation.y += this.speed*.05;

    this.mesh.position.z -= this.speed*.5;
  }
}


class GlobalWaterSphere extends Item{
	constructor(radius, x, y, z){
		var mesh, geom, mat;
		var sampleTexture = new THREE.TextureLoader().load('/assets/images/ocean.png');
		sampleTexture.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;

		var noiseTexture = new THREE.TextureLoader().load('/assets/images/cloud.png');
		noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

		var customUniforms = {
			baseTexture: 	{ type: "t", value: sampleTexture },
			baseSpeed: 		{ type: "f", value: 0.01 },
			noiseTexture: 	{ type: "t", value: noiseTexture },
			noiseScale:		{ type: "f", value: 0.5 },
			alpha: 			{ type: "f", value: 1.0 },
			time: 			{ type: "f", value: 1.0 }
		};

		var mat = new THREE.ShaderMaterial({
			uniforms: customUniforms,
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent,
			// map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
		});

		geom = new THREE.SphereGeometry(radius, 30, 30);

		// mat = new THREE.MeshBasicMaterial({transparent: true, opacity: 1});
		mat.side = THREE.DoubleSide; //see inside

		mesh = new THREE.Mesh(geom, mat);
		mesh.position.set(x, y, z); //place where the camera is
		mesh.rotation.x = -Math.PI/2;

		super(mesh, x, y, z);
	}

	mapToCube(cubeCamera){
		this.mesh.material.envMap = cubeCamera.renderTarget.texture;
		this.cubeCamera = cubeCamera;
	}

	distort(){
		var i=0;
		var _this = this;
		var interval = setInterval(function(){
			if (i > 200){
				clearInterval(interval);
				return;
			}
			if (i<150){
				_this.mesh.material.uniforms.time.value += .35;
			}
			else if (i<160){
				_this.mesh.material.uniforms.time.value += .05;
			}
			else if (i<180){
				_this.mesh.material.uniforms.time.value += .02;
			}
			else if (i<190){
				_this.mesh.material.uniforms.time.value += .01;
			}
			else{
				_this.mesh.material.uniforms.time.value += .005;
			}
			i++;
		}, 5);
	}

	update(){
		this.mesh.rotation.y += .0015;
		this.mesh.rotation.z += .015;
		this.mesh.material.uniforms.time.value += .025;
		// this.cubeCamera.updateCubeMap(World.renderer, World.scene);
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
		this.cubeCamera = cubeCamera;
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


class CubicOxygen extends Atom{
	constructor(radius, x, y, z){
		var geom, innerGeom, mat, glowMat, mesh;

		mesh = new THREE.Group();

		geom = new THREE.BoxGeometry(radius, radius, radius);
		innerGeom = new THREE.SphereGeometry(radius/10, 15, 15);

		mat = new THREE.MeshPhongMaterial({
			shininess: 25,
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
	constructor(size, angle, dir, x, y, z){
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
		this.dir = dir;
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

		this.mesh.position.z += this.dir*this.speed*.5;
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

class TitleMetalNode extends Atom{ //construct them with radius 1
	constructor(radius, x, y, z){
		var mesh, geom, mat;
		mat = new THREE.MeshBasicMaterial({transparent: true, opacity: 1, shading: THREE.SmoothShading});

		geom = new THREE.SphereGeometry(radius, 32, 32);
		mesh = new THREE.Mesh(geom, mat);
		mesh.position.set(x, y, z);

		super(mesh, x, y, z);
		this.speed = Math.random();
	}

	mapToCube(cubeCamera){
		this.mesh.material.envMap = cubeCamera.renderTarget;
		this.cubeCamera = cubeCamera;
	}

	update(){
		this.mesh.rotation.x += this.speed;
		this.mesh.rotation.y += this.speed;
		this.mesh.rotation.z += this.speed;

		// this.cubeCamera.updateCubeMap(World.renderer, World.scene);
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

		// for (var i=1; i>-2; i--){
		// 	temp = new LightningCircle(15, 0, 0, 0);
		// 	temp.mesh.rotation.x = Math.PI/2;
		// 	temp.mesh.position.y = i*8;
		// 	mesh.add(temp.mesh);
		// 	lightningCircles.push(temp);
		// }

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

		// var cubeCamera = new THREE.CubeCamera(World.near, World.far, 256);
		// cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
		// cubeCamera.position.set(x, y, z+120); //set right in front of the layer
		// mesh.add(cubeCamera);

		for (var i=1; i<length+1; i++){
			if (i==1)
				temp = new MetalLayer(30*i, 0, 0, z+100*i, 1, 3*i, i%2, World.cubeCamera);
			else{
				temp = new MetalLayer(30*i, 0, 0, z+100*i, 0, 3*i, i%2, World.cubeCamera);
			}

			layers.push(temp);
			mesh.add(temp.mesh);
		}

		mesh.rotation.y = rotation;

		super(mesh, x, y, z);
		this.mesh = mesh;
		this.layers = layers;
		this.speed = 3 + Math.random() * 6;
		this.private_x = 0 + Math.random() * 100;
		if(Math.random() > 0.5) {
			this.private_x *= -1;
		}
		this.mesh.position.x = 0;

		//CONTROL: populate according to mouse position
		// if(World.mouse_x) {
		// 	this.mesh.position.x = World.mouse_x - window.innerWidth/2;	
		// 	console.log(this.mesh.position);
		// }
		
		this.mesh.position.z = 0;
		this.speed_x = (this.private_x * this.speed / 1000);
		this.cubeCamera = World.cubeCamera;
	}

	update(){
		for(var i=0; i<this.layers.length; i++){
			this.layers[i].update();
		}

		this.mesh.position.x += this.speed_x;
		this.mesh.position.z += this.speed;

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

var neheTexture = new THREE.TextureLoader().load("assets/images/image.png");
var neheTexture2 = new THREE.TextureLoader().load("assets/images/image.png");

class Smiley extends Atom{
	constructor(radius, x, y, z){
		var geom, mat, mesh;
		geom = new THREE.SphereGeometry(radius, 30, 30);
		mat = new THREE.MeshBasicMaterial({
			map: neheTexture
		});

		mesh = new THREE.Mesh(geom, mat);
		mesh.position.set(x, y, z);

		super(mesh, x, y, z);
		this.speed = 1 + Math.random()*5; 
	}

	update(){
		this.mesh.rotation.y += this.speed*.005;
		this.mesh.rotation.x += this.speed*.005;
	}
}

var SphereGeometry = new THREE.SphereGeometry(1.2, 8, 8);
var SphereMaterial = new THREE.MeshBasicMaterial({
        map: neheTexture2
});

var CylinderGeometry = new THREE.CylinderGeometry(.15, .2, 3, 3);
var CylinderMaterial = new THREE.MeshLambertMaterial({
        color: 0xFFFF01
});

function CreateMDMAAtom(x, y, z, n = 1.2, k = 8, j = 8) {
    neheTexture.offset.x = Math.random(); // 0.0 - 1.0
    neheTexture.offset.y = 0;
    sphere = new THREE.Mesh(SphereGeometry, SphereMaterial);
    sphere.position.set(x, y, z);
    return sphere;
}

function CreateMDMABond(x, y, z, vx, vy, vz, n = 0.15, k = 0.2) {
    cylinder = new THREE.Mesh(CylinderGeometry, CylinderMaterial);
    cylinder.position.set(x, y, z);
    var vector = new THREE.Vector3(vx, vy, vz);

    var focalPoint = new THREE.Vector3(
        cylinder.position.x + vector.x,
        cylinder.position.y + vector.y,
        cylinder.position.z + vector.z
    );
    cylinder.up = new THREE.Vector3(0, 0, 1); //Z axis up
    cylinder.lookAt(focalPoint);

    return cylinder;
}

function CreateMDMA(x, y, z, randomAngle) {
  var group = new THREE.Group();

  temp = CreateMDMAAtom(x, y, z);
  group.add(temp);

  temp = CreateMDMAAtom(x, y + 4.2, z);
  group.add(temp);

  temp = CreateMDMAAtom(x - 4, y - 1.5, z);
  group.add(temp);

  temp = CreateMDMAAtom(x - 4, y + 6, z);
  group.add(temp);

  temp = CreateMDMAAtom(x - 6.6, y + 2.3, z);
  group.add(temp);

  //leftmost two
  temp = CreateMDMAAtom(x - 9.2, y + 2.8, z + 3.2, 0.8, 6, 6);
  group.add(temp);

  temp = CreateMDMAAtom(x - 9, y + 2.8, z - 3.2, 0.8, 6, 6);
  group.add(temp);

  temp = CreateMDMAAtom(x + 3.8, y + 6.2, z);
  group.add(temp);

  temp = CreateMDMAAtom(x + 3.8, y - 1.8, z);
  group.add(temp);

  temp = CreateMDMAAtom(x + 3.8, y + 10.2, z, 0.8, 6, 6);
  group.add(temp);
  temp = CreateMDMAAtom(x + 3.8, y - 5.8, z, 0.8, 6, 6);
  group.add(temp);
  temp = CreateMDMAAtom(x + 7.8, y + 4.7, z);
  group.add(temp);
  temp = CreateMDMAAtom(x + 7.8, y, z);
  group.add(temp);
  temp = CreateMDMAAtom(x + 11.4, y + 6, z);
  group.add(temp);
  temp = CreateMDMAAtom(x + 10.4, y - 1.8, z, 0.8, 6, 6);
  group.add(temp);

  //third hexagon top
  temp = CreateMDMAAtom(x + 11.3, y + 8.8, z + 2.7, 0.8, 6, 6);
  group.add(temp);
  temp = CreateMDMAAtom(x + 11.3, y + 8.8, z - 2.7, 0.8, 6, 6);
  group.add(temp);

  temp = CreateMDMAAtom(x + 18.3, y + 6, z);
  group.add(temp);
  temp = CreateMDMAAtom(x + 15, y + 3.5, z);
  group.add(temp);

  temp = CreateMDMAAtom(x + 15, y + 2, z - 3, 0.8, 6, 6);
  group.add(temp);

  temp = CreateMDMAAtom(x + 18.3, y + 8.8, z - 2.7, 0.8, 6, 6);
  group.add(temp);
  temp = CreateMDMAAtom(x + 15, y + 2, z + 3);
  group.add(temp);

  //bottom, closest three
  temp = CreateMDMAAtom(x + 15, y + 4.3, z + 5.5, 0.8, 6, 6);
  group.add(temp);
  temp = CreateMDMAAtom(x + 12.5, y + 0.5, z + 5.5, 0.8, 6, 6);
  group.add(temp);
  temp = CreateMDMAAtom(x + 17.5, y + 0.5, z + 5.5, 0.8, 6, 6);
  group.add(temp);

  //righmost four
  temp = CreateMDMAAtom(x + 22.3, y + 3.6, z);
  group.add(temp);
  temp = CreateMDMAAtom(x + 24, y + 1.8, z + 3, 0.8, 6, 6);
  group.add(temp);
  temp = CreateMDMAAtom(x + 24.5, y + 6.2, z, 0.8, 6, 6);
  group.add(temp);
  temp = CreateMDMAAtom(x + 24.5, y + 1.8, z - 3, 0.8, 6, 6);
  group.add(temp);


  //-3, -1.2, 0
  temp = CreateMDMABond(x - 2.1, y - 0.8, z, 4, 2, 45, 0.3, 0.3);
  group.add(temp);
  temp = CreateMDMABond(x - 1.55, y + 5.4, z, -4, 1.2, 45, 0.3, 0.3);
  group.add(temp);
  temp = CreateMDMABond(x - 5.5, y + 4.2, z, 2.7, 4, 200, 0.3, 0.3);
  group.add(temp);
  temp = CreateMDMABond(x - 5.5, y + 0.3, z, -0.8, 1, 20, 0.3, 0.3);
  group.add(temp);

  //leftmost two
  temp = CreateMDMABond(x - 8, y + 2.5, z + 2, -1.5, 0.2, -1);
  group.add(temp);
  temp = CreateMDMABond(x - 8, y + 2.5, z - 2, -1.5, 0.2, 1);
  group.add(temp);

  temp = CreateMDMABond(x + 2.1, y - 0.9, z, -1.5, 1, 20, 0.3, 0.3);
  group.add(temp);

  temp = CreateMDMABond(x + 2.03, y + 5.4, z, 1.5, 1, 20, 0.3, 0.3);
  group.add(temp);

  temp = CreateMDMABond(x + 6.1, y + 5.9, z, -4, 2, 45);
  group.add(temp);
  temp = CreateMDMABond(x + 6.2, y + 5.4, z, -4, 2, 45);
  group.add(temp);
  temp = CreateMDMABond(x + 6, y - 0.8, z, 4, 2, 45, 0.3, 0.3);
  group.add(temp);
  temp = CreateMDMABond(x + 8.8, y - 0.8, z, -1.5, 1, 20, 0.3, 0.3);
  group.add(temp);
  temp = CreateMDMABond(x + 9.8, y + 5.5, z, 1.5, 1, 20, 0.3, 0.3);
  group.add(temp);

  //third hexagon top
  temp = CreateMDMABond(x + 11.5, y + 7.7, z + 1.5, 0, 0.5, -0.5);
  group.add(temp);
  temp = CreateMDMABond(x + 11.5, y + 8, z - 1.5, 0, 0.5, 0.5);
  group.add(temp);

  temp = CreateMDMABond(x + 13.5, y + 5.2, z, -3, 2, 45, 0.3, 0.3);
  group.add(temp);

  temp = CreateMDMABond(x + 15, y + 2.7, z - 2, 0, -0.1, 0.05, 0.3);
  group.add(temp);

  //right top
  temp = CreateMDMABond(x + 18.3, y + 7.2, z - 1.2, 0, 0.5, 0.5);
  group.add(temp);
  temp = CreateMDMABond(x + 16.3, y + 5.2, z + 0.5, -0.4, -0.3, -10, 0.3, 0.3);
  group.add(temp);

  temp = CreateMDMABond(x + 15, y + 2.7, z + 2, 0, -0.1, -0.05, 0.3, 0.3);
  group.add(temp);

  //bottom three
  temp = CreateMDMABond(x + 15, y + 3.2, z + 4.5, 0, 0.4, -0.5);
  group.add(temp);
  temp = CreateMDMABond(x + 16.5, y + 1.2, z + 4.5, -0.5, 0.3, 1);
  group.add(temp);
  temp = CreateMDMABond(x + 13.5, y + 1.2, z + 4.5, 0.5, 0.3, 1);
  group.add(temp);

  //rightmost four
  temp = CreateMDMABond(x + 20.3, y + 4.6, z, -0.4, 0.3, 10, 0.3, 0.3);
  group.add(temp);
  temp = CreateMDMABond(x + 23.3, y + 2.8, z + 1.6, -0.5, 0.5, 0.5);
  group.add(temp);
  temp = CreateMDMABond(x + 23.5, y + 4.7, z, 1.2, 1.5, 20);
  group.add(temp);
  temp = CreateMDMABond(x + 23.5, y + 3, z - 1.5, -0.5, 0.5, -0.5);
  group.add(temp);

  var geometry1 = new THREE.CylinderGeometry(0.15, 0.2, 3, 3);
  var geometry3 = new THREE.CylinderGeometry(0.15, 0.2, 2, 3);
  var geometry2 = new THREE.CylinderGeometry(0.3, 0.3, 3.1, 3);
  var material = new THREE.MeshLambertMaterial({
      color: 0xFFFF01,
  });

  temp = new THREE.Mesh(geometry1, material);
  temp.position.set(x - 0.3, y + 2.2, z);
  group.add(temp);

  temp = new THREE.Mesh(geometry1, material);
  temp.position.set(x + 0.3, y + 2.2, z);
  group.add(temp);

  temp = new THREE.Mesh(geometry1, material);
  temp.position.set(x + 3.8, y + 8.2, z);
  group.add(temp);

  temp = new THREE.Mesh(geometry1, material);
  temp.position.set(x + 3.8, y - 3.8, z);
  group.add(temp);

  temp = new THREE.Mesh(geometry2, material);
  temp.position.set(x + 7.8, y + 2.2, z);
  group.add(temp);

  temp = new THREE.Mesh(geometry2, material);
  temp.position.set(x + 15, y + 2.2, z);
  group.add(temp);

  if (randomAngle) {
    console.log("hai");
    group.rotation.x += Math.random()*3;
    group.rotation.y += Math.random()*3;
    group.rotation.z += Math.random()*3;
  }

  return group;
}

class MDMALattice extends Molecule{
	constructor(n, x, y, z){
		var mesh;
		var layers;
		var atoms = [];

		mesh = new THREE.Object3D();
		var dis = 80;

		var i, j, k;
		var x, y, z;
		var m;

		var numKLayers = n*2;

		layers = [];

		for(k=0; k<numKLayers; k++){

			layers[k] = new THREE.Group();

			for(j=0; j<n-2; j++){
				for(i=0; i<n-1; i++){
					var mdma = CreateMDMA(i*dis + (Math.random()-0.4)*dis*0.8, -j*dis + (Math.random()-0.4)*dis*0.8, 0, true);
					mdma.scale.set(3,3,3);
					layers[k].add(mdma);
				}
			}
			layers[k].position.z -= k*dis;
			mesh.add(layers[k]);
		}
		mesh.receiveShadow = true;
		mesh.position.set(x, y, z);

		super(mesh, 0, 0, 900, atoms);
		this.mesh = mesh;
		this.layers = layers;
		this.numKLayers = numKLayers;
		this.dis = dis;
	}

	update(){
		var speed = 0.5;
			for (var i = 0; i < this.numKLayers; i++) {
				if (this.layers[i].position.z >= 200) {
					this.layers[i].position.z = -(this.numKLayers-1)*this.dis + speed;
				}
				this.layers[i].position.z += speed;
			}
			// this.mesh.rotation.y += speed*.01;
		this.mesh.rotation.z += speed*.01;
	}
}

class MDMABackground extends Item{
	constructor(x, y, z){
		var sampleTexture = new THREE.TextureLoader().load('/assets/images/mdma2.jpg');
		sampleTexture.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;

		var noiseTexture = new THREE.TextureLoader().load('/assets/images/cloud.png');
		noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

		var customUniforms = {
			baseTexture: 	{ type: "t", value: sampleTexture },
			baseSpeed: 		{ type: "f", value: 0.01 },
			noiseTexture: 	{ type: "t", value: noiseTexture },
			noiseScale:		{ type: "f", value: 0.5 },
			alpha: 			{ type: "f", value: 1.0 },
			time: 			{ type: "f", value: 1.0 }
		};

		var mat = new THREE.ShaderMaterial({
			uniforms: customUniforms,
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent,
			// map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
		});

		var mesh = new THREE.Mesh(new THREE.SphereGeometry(WIDTH*2, 50, 50), mat);
		mesh.material.side = THREE.BackSide;
		mesh.position.set(x, y, z);
		super(mesh, x, y, z);
	}

	update(){
		this.mesh.material.uniforms.time.value += .025;
		this.mesh.rotation.y += .006;
		this.mesh.rotation.x += .006;
	}
}

class Iron extends Atom{
	constructor(radius, x, y, z){
		  var iongeo = new THREE.SphereGeometry(radius, 30, 30);
		  var vertices = iongeo.vertices;

		  for (var i=0; i<vertices.length; i++){
		  	vertices[i].x += Math.random()*.05;
		  	vertices[i].y += Math.random()*.05;
		  	vertices[i].z += Math.random()*.05;
		  }

		  var ionmat = new THREE.MeshPhongMaterial({
		    color: COLORS.iron,
		    reflectivity: .3,
		    metal: true,
		    shininess: 50
		  });

	  	var mesh = new THREE.Mesh(iongeo, ionmat);
	  	mesh.position.set(x, y, z);
	  	super(mesh, x, y, z);
	  	this.speed = Math.random()*.75;
	}
	update(){
		this.mesh.rotation.y += .05*this.speed;
		this.mesh.rotation.x += .05*this.speed;
	}
}

class Lattice extends Molecule{
	constructor(n){
	  var mesh, layers, electrons;
	  var ionSize = 16;
	  var dis = 20*ionSize/3;
	  ionSize *= 1.5;
	  mesh = new THREE.Object3D();

	  var iongeo = new THREE.SphereGeometry(ionSize, 30, 30);
	  var ionmat = new THREE.MeshPhongMaterial({
	    color: COLORS.iron,
	    reflectivity: .3,
	    metal: true,
	    shininess: 50
	  });

	  var egeo = new THREE.SphereGeometry(ionSize/15, 10, 10);
	  var emat = new THREE.MeshPhongMaterial({
	    color: COLORS.electron,
	    reflectivity: .3,
	    metal: true,
	    shininess: 50
	  });

	  var i, j, k;
	  var x, y, z;
	  var m;

	  var numKLayers = (n*2)-3;

	  layers = [];
	  electrons = [];

	  for(k=0; k<numKLayers*2; k++){

	    layers[k] = new THREE.Group();
	    electrons[k] = new THREE.Group();

	    if (k%2 == 0) {
	      for(j=0; j<(n*2-1)+1; j++){
	        for(i=0; i<(n*2-1)+1; i++){
	          var ion = new THREE.Mesh(iongeo, ionmat);
	          ion.position.x += i*dis;
	          ion.position.y -= j*dis;
	          ion.position.z = 0;
	          layers[k].add(ion);
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
	          layers[k].add(ion);
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
	          electrons[k].add(electron);
	        }
	      }
	    }
	    electrons[k].position.z -=k*dis;
	    mesh.add(electrons[k]);

	    layers[k].position.z -= k*dis;
	    mesh.add(layers[k]);
	  }
	  mesh.receiveShadow = true;
	  mesh.position.set(-window.innerWidth/2, window.innerHeight/2, 950);
	  super(mesh, 0, 0, 0);
	  this.electrons = electrons;
	  this.layers = layers;
	  this.numKLayers = numKLayers;
	  this.dis = dis;
	}

	update(){
		var speed = 3;
	    for (var i = 0; i < this.numKLayers*2; i++) {
	      if (this.layers[i].position.z >= 200) {
	        this.layers[i].position.z -= this.numKLayers*2*this.dis + speed;
	      }
	      this.layers[i].position.z += speed;

	      if (this.electrons[i].position.z >= 200) {
	        this.electrons[i].position.z -= this.numKLayers*2*this.dis + speed*5;
	      }
	      this.electrons[i].position.z += speed*5;
	    }
	}
}

 var namat = new THREE.MeshPhongMaterial({
		    color: COLORS.Red,
		    transparent: true,
		    opacity: 1,
		    shading: THREE.FlatShading,
	});

class Sodium extends Atom{
	constructor(size){
		//size *= 2;
		  var sodium = new THREE.BoxGeometry(size, size, size, 100, 100, 100);
		  var geo = new THREE.EdgesGeometry(sodium);
		  //var sodium = new THREE.SphereGeometry(size, 100, 100);
		  var mat = new THREE.LineBasicMaterial({color: Colors.red, linewidth: 100});
		  var wireframe = new THREE.LineSegments(geo, mat);

		  var group = new THREE.Group();

		  return wireframe;
	}
}

var cl1, na1, connect1, connect2, time = 0;
class Salt extends Molecule{
	constructor(n, x, y, z){
		  var mesh, layers;
		  var atoms = [];
		  var na = 4;
		  var cl = 2*na;
		  var dis = 16*(na+cl)/3;
		  var connectsmall = new THREE.CylinderGeometry(.2*na, .2*na, .1*dis, 30, 30);
		  na *= 2;
		  cl *= 1.5;
		  mesh = new THREE.Object3D();

		  //var sodium = new THREE.SphereGeometry(na, 100, 100);
		  var sodium = new THREE.BoxGeometry(na, na, na, 20, 20, 20);
		  //var chloride = new THREE.SphereGeometry(cl, 100, 100);
		  var chloride = new THREE.BoxGeometry(cl, cl, cl, 20, 20, 20);
		  //var connect = new THREE.CylinderGeometry(.2*na, .2*na, dis, 100, 100);

		  var sampleTexture = THREE.ImageUtils.loadTexture('/assets/images/salt.jpg');
	      sampleTexture.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;

	      var noiseTexture = THREE.ImageUtils.loadTexture('/assets/images/crate.jpg');
	      noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

	      customUniforms = {
	      baseTexture:  { type: "t", value: sampleTexture },
	      baseSpeed:    { type: "f", value: 0.05 },
	      noiseTexture:   { type: "t", value: noiseTexture },
	      noiseScale:   { type: "f", value: 0.5337 },
	      alpha:      { type: "f", value: 1.0 },
	      time:       { type: "f", value: 1.0 },        
	        // fogColor:    { type: "c", value: World.scene.fog.color },
	        // fogNear:     { type: "f", value: World.scene.fog.near },
	        // fogFar:      { type: "f", value: World.scene.fog.far }
	      };

	      var namat = new THREE.ShaderMaterial({
	        uniforms: customUniforms,
	        vertexShader: document.getElementById('vertexShader').textContent,
	        fragmentShader: document.getElementById('fragmentShader').textContent,
	        // fog: true,
	        // map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
	      });

		  /*var namat = new THREE.MeshPhongMaterial({
		    color: Colors.blue,
		    transparent: true,
		    opacity: .9,
		    //shading: THREE.FlatShading,
		    map: texture,
		  });*/

		  /*var clmat = new THREE.MeshPhongMaterial({
		    color: Colors.red,
		    transparent: true,
		    opacity: .9,
		    shading: THREE.FlatShading,
		  });*/
		  var sampleTexture2 = THREE.ImageUtils.loadTexture('/assets/images/salt2.jpg');
		  sampleTexture2.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;
		  var customUniforms2 = {
		      baseTexture:  { type: "t", value: sampleTexture2 },
		      baseSpeed:    { type: "f", value: 0.05 },
		      noiseTexture:   { type: "t", value: noiseTexture },
		      noiseScale:   { type: "f", value: 0.5337 },
		      alpha:      { type: "f", value: 1.0 },
		      time:       { type: "f", value: 1.0 },        
		        // fogColor:    { type: "c", value: World.scene.fog.color },
		        // fogNear:     { type: "f", value: World.scene.fog.near },
		        // fogFar:      { type: "f", value: World.scene.fog.far }
		      };
		  var clmat = new THREE.ShaderMaterial({
		        uniforms: customUniforms2,
		        vertexShader: document.getElementById('vertexShader').textContent,
		        fragmentShader: document.getElementById('fragmentShader').textContent,
		        // fog: true,
		        // map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
		      });

		  var connectormat = new THREE.MeshPhongMaterial({
		    color: COLORS.Gray,
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

		  layers = [];

		  for(k=0; k<numKLayers; k++){

		    layers[k] = new THREE.Group();

		    for(j=0; j<(n*2-1)-1; j++){
		      for(i=0; i<(n*2-1)+1; i++){
		        if((i+j+k)%2==0){
		          cl1 = new THREE.Mesh(chloride, clmat);
		          //cl1 = new Sodium(na);
		          cl1.position.x += i*dis;
		          cl1.position.y -= j*dis;
		          cl1.position.z = 0;
		          // this.mesh.add(cl1);
		          layers[k].add(cl1);
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
		          layers[k].add(na1);
		          atom = na1;
		        }
		        if(i!=0){
		          //connect1 = new THREE.Mesh(connect, connectormat);
		          for(m=0; m<5; m++){
		          connect1 = new THREE.Mesh(connectsmall, connectormat);
		          connect1.rotation.z = Math.PI/2;
		          connect1.position.z = 0;
		          connect1.position.y = atom.position.y;
		          connect1.position.x = atom.position.x + (-1*(-.40*m*dis/2 - .20*dis/2 - time))%dis;
		          // this.mesh.add(connect1);
		          layers[k].add(connect1);
		          }
		        }
		        if(j!=0){
		          //connect2 = new THREE.Mesh(connect, connectormat);
		          for(m=0; m<5; m++){
		          connect2 = new THREE.Mesh(connectsmall, connectormat);
		          connect2.position.y = atom.position.y + .40*m*dis/2 + .20*dis/2;
		          connect2.position.x = atom.position.x;
		          connect2.position.z = 0;
		          // this.mesh.add(connect2);
		          layers[k].add(connect2);
		          }
		        }
		        if(k!=0){
		          //connect1 = new THREE.Mesh(connect, connectormat);
		          for(m=0; m<5; m++){
		          connect1 = new THREE.Mesh(connectsmall, connectormat);
		          connect1.rotation.x = Math.PI/2;
		          connect1.position.x = atom.position.x;
		          connect1.position.y = atom.position.y;
		          connect1.position.z = .40*m*dis/2 - .20*dis/2;
		          // this.mesh.add(connect1);
		          layers[k].add(connect1);
		          }
		        }
		      }
		    }
		    layers[k].position.z -= k*dis;
		    mesh.add(layers[k]);
		  }

		  mesh.receiveShadow = true;
		  mesh.position.set(x, y, z);
		  super(mesh, x, y, z, atoms);
		  this.mesh = mesh;
		  this.layers = layers;
		  this.numKLayers = numKLayers;
		  this.dis = dis;
	}

	update(){
		var speed = 2;
		for (var i = 0; i < this.numKLayers; i++) {
			// console.log(this.layers[i].position.z);
			if (this.layers[i].position.z >= 225) {
				this.layers[i].position.z -= this.numKLayers*this.dis + speed;
			}
			this.layers[i].position.z += speed;
		}
		//na1.material.uniforms.time.value += .005;
		//na1.rotation.y += .003;
	}
}

class SaltCube extends Atom{
	constructor(size, x, y, z){
		var geom, mat, mesh;
		geom = new THREE.BoxGeometry(size, size, size);

		var sampleTexture = THREE.ImageUtils.loadTexture('/assets/images/salt2.jpg');
	      sampleTexture.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;

	      var noiseTexture = THREE.ImageUtils.loadTexture('/assets/images/crate.jpg');
	      noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

	      customUniforms = {
	      baseTexture:  { type: "t", value: sampleTexture },
	      baseSpeed:    { type: "f", value: 0.05 },
	      noiseTexture:   { type: "t", value: noiseTexture },
	      noiseScale:   { type: "f", value: 0.5337 },
	      alpha:      { type: "f", value: 1.0 },
	      time:       { type: "f", value: 1.0 },
	      };

	      mat = new THREE.ShaderMaterial({
	        uniforms: customUniforms,
	        vertexShader: document.getElementById('vertexShader').textContent,
	        fragmentShader: document.getElementById('fragmentShader').textContent
	        // map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
	      });

	      mesh = new THREE.Mesh(geom, mat);
	      mesh.position.set(x, y, z);
	      super(mesh, x, y, z);
	      this.speed = Math.random();
	}

	update(){
		this.mesh.rotation.y += this.speed*.05;
		this.mesh.rotation.x += this.speed*.05;

	}
}

class Diamond extends Atom{
	constructor(radius, x, y, z){
		var geom, mat, top, bottom, mesh;
		var height = 2*radius;
		geom = new THREE.CylinderGeometry(0, radius, height, 5);
		mat = new THREE.MeshPhongMaterial({
			shininess: 25,
			specular: 0xffffff,
			emissive: COLORS.Ice,
			color: COLORS.Blue
		});

		top = new THREE.Mesh(geom, mat);
		top.position.set(0, height/2, 0);

		bottom = new THREE.Mesh(geom, mat);
		bottom.position.set(0, -height/2, 0);
		bottom.rotation.x = Math.PI;
		bottom.rotation.y = Math.PI/5;

		mesh = new THREE.Group();
		mesh.position.set(x, y, z);
		mesh.add(top);
		mesh.add(bottom);

		super(mesh, x, y, z);
		this.speed = Math.random();
	}

	update(){
		this.mesh.rotation.y += .025+.005*this.speed;
		this.mesh.rotation.x += .025+.005*this.speed;
	}
}

class DiamondRing extends Molecule{
	constructor(radius, x, y, z){
		var temp, mesh, atoms;
		atoms = [];
		mesh = new THREE.Group();
		var num = 12; //how many diamonds will be in the circle
		var interval = 2*Math.PI/num;
		var angle;
		var posX, posY;

		for (var i=0; i<num; i++){
			angle = interval*i;
			posX = Math.cos(angle)*radius;
			posY = Math.sin(angle)*radius;
			temp = new Diamond(.5, posX, posY, 0);
			atoms.push(temp);
			mesh.add(temp.mesh);
		}

		mesh.position.set(x, y, z);

		super(mesh, x, y, z, atoms);
		this.speed = 1+Math.random();
		this.radius = radius;
		this.interval = interval;
	}

	update(){
		this.mesh.rotation.z += .02*this.speed;
		this.radius += .25*this.speed;

		var angle;
		for (var i=0; i<this.atoms.length; i++){
			this.atoms[i].update();
			angle = this.interval*i;
			this.atoms[i].mesh.position.x = this.radius * Math.cos(angle);
			this.atoms[i].mesh.position.y = this.radius * Math.sin(angle);
		}
	}

	outOfRange(){
		return this.mesh.position.z >= 1000 || this.radius >= 50;
	}
}

class MetalPlane extends Item{
	constructor(x, y, z){
		var geom, mat, mesh;

		geom = new THREE.SphereGeometry(100, 40, 40);
		var sampleTexture = THREE.ImageUtils.loadTexture('/assets/images/diamonds.jpg');
	      sampleTexture.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;

	      var noiseTexture = THREE.ImageUtils.loadTexture('/assets/images/diamonds.jpg');
	      noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

	      customUniforms = {
	      baseTexture:  { type: "t", value: sampleTexture },
	      baseSpeed:    { type: "f", value: 0.05 },
	      noiseTexture:   { type: "t", value: noiseTexture },
	      noiseScale:   { type: "f", value: 0.5337 },
	      alpha:      { type: "f", value: 1.0 },
	      time:       { type: "f", value: 1.0 },
	      };

	      mat = new THREE.ShaderMaterial({
	        uniforms: customUniforms,
	        vertexShader: document.getElementById('vertexShader').textContent,
	        fragmentShader: document.getElementById('fragmentShader').textContent
	        // map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
	      });
		mat.side = THREE.DoubleSide;

		mesh = new THREE.Mesh(geom, mat);
		mesh.position.set(x, y, z);
		super(mesh, x, y, z);
		this.speed = Math.random()*Math.random();
	}

	update(){
		this.mesh.rotation.y += .005*this.speed;
		this.mesh.rotation.x += .005*this.speed;

		this.mesh.material.uniforms.time.value += .01;
	}
}

class S extends Atom{
	constructor(mesh, x, y, z){
		super(mesh, x, y, z);
		mesh.position.set(x, y, z);
	}

	mapToCube(cubeCamera){
		this.mesh.material.envMap = cubeCamera.renderTarget;
		this.cubeCamera = cubeCamera;
	}

	update(){
		// this.mesh.rotation.y += .005;
		// this.cubeCamera.updateCubeMap(World.renderer, World.scene);
	}

	spinWildly(){
		var i=0;
		var _this = this;
		var speed = Math.random() + 1;
		var interval = setInterval(function(){
			if (i > 200){
				clearInterval(interval);
				return;
			}
			if (i<150){
				_this.mesh.rotation.y += .075*speed;
			}
			else if (i<160){
				_this.mesh.rotation.y += .05*speed;
			}
			else if (i<180){
				_this.mesh.rotation.y += .03*speed;
			}
			else if (i<190){
				_this.mesh.rotation.y += .02*speed;
			}
			else{
				_this.mesh.rotation.y += .01*speed;
			}
			i++;
		}, 5);
	}
}

class Button extends Item{
	constructor(radius, x, y, z){
		var geom, mat, mesh;
		geom = new THREE.BoxGeometry(radius, radius, radius);

		var sampleTexture = new THREE.TextureLoader().load('/assets/images/microscopy2.jpg');
		sampleTexture.wrapS = sampleTexture.wrapT = THREE.RepeatWrapping;

		var noiseTexture = new THREE.TextureLoader().load('/assets/images/cloud.png');
		noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

		var customUniforms = {
			baseTexture: 	{ type: "t", value: sampleTexture },
			baseSpeed: 		{ type: "f", value: 0.01 },
			noiseTexture: 	{ type: "t", value: noiseTexture },
			noiseScale:		{ type: "f", value: 0.5 },
			alpha: 			{ type: "f", value: 1.0 },
			time: 			{ type: "f", value: 1.0 }
		};

		mat = new THREE.ShaderMaterial({
			uniforms: customUniforms,
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent,
			// map: THREE.ImageUtils.loadTexture('/assets/images/carbon.jpg')
		});

		mesh = new THREE.Mesh(geom, mat);
		mesh.position.set(x, y, z);
		super(mesh, x, y, z);
		this.speed = Math.random() + 1;
	}

	update(){
		this.mesh.material.uniforms.time.value += .5*this.speed;
		this.mesh.rotation.y += .01;
	}

	spinWildly(){
			var i=0;
		var _this = this;
		var speed = Math.random() + .7;
		var interval = setInterval(function(){
			if (i > 200){
				clearInterval(interval);
				return;
			}
			if (i<125){
				_this.mesh.rotation.y += .075*speed;
			}
			else if (i<150){
				_this.mesh.rotation.y += .05*speed;
			}
			else if (i<180){
				_this.mesh.rotation.y += .03*speed;

			}
			else if (i<190){
				_this.mesh.rotation.y += .02*speed;
			}
			else{
				_this.mesh.rotation.y += .01*speed;
			}
			i++;
		}, 5);
	}
}


function rgb2Hex(r, g, b) {

	return '0x' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);

}

function byte2Hex(n) {

	var nybHexString = "0123456789ABCDEF";
	return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);

}

function deg2Rad(deg) {

	return deg * (Math.PI / 180);

}

function startStop() {

	var player = document.getElementById('player');
	if (timer) {
		timer = clearInterval(timer);
		player.pause();
	} else {
		timer = setInterval(loop, 1000 / 60);
		player.play();
	}

}

class CarbonTube extends Molecule{
	constructor(){
		var LENGTH = 800, RADIUS = 200, VELOCITY = 1;
		var timer, count = 0, deg = 0, spiralParticles = [], curveSpiralParticles = [];
		var random = Math.random, abs = Math.abs, sin = Math.sin, cos = Math.cos;
		var mouseX = 0, mouseY = 0, windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;

		var mesh = new THREE.Group();
		var atoms = [];

		for (var i = 0; i < LENGTH; i++) {

			var n = 20,
				frequency = 0.3,
				r = sin(frequency) * 127 + 128,
				g = sin(frequency) * 127 + 128,
				b = sin(frequency) * 127 + 128,
				// r = sin(frequency * (i % n) + 0) * 127 + 128,
				// g = sin(frequency * (i % n) + 0) * 127 + 128,
				// b = sin(frequency * (i % n) + 0) * 127 + 128,
				color = rgb2Hex(r, g, b);

			var particle = spiralParticles[i] = new THREE.Particle(new THREE.ParticleCircleMaterial({
				color: color,
				opacity: 0.6
			}));
			particle.position.x = particle.position.y = 0;
			particle.position.z = -1800 + i * 5;
			particle.scale.x = particle.scale.y = 10;
			mesh.add(particle);

			super(mesh, 0, 0, 0, atoms);

			this.spiralParticles = spiralParticles;
			this.curveSpiralParticles = curveSpiralParticles;
			// World.scene.addObject(particle);

			// var curveParticle = curveSpiralParticles[i] = new THREE.Particle(new THREE.ParticleCircleMaterial({
			// 	color: color,
			// 	opacity: 0.8
			// }));
			// curveParticle.position.x = curveParticle.position.y = 0;
			// curveParticle.position.z = -1800 + i * 16;
			// curveParticle.scale.x = curveParticle.scale.y = 3;
			// scene.addObject(curveParticle);
		}

	}
}