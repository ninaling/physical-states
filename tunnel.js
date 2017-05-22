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


var globalCam, globalScene, globalRenderer;
var globalNear = 0.01;
var globalFar = 100;

var ww = window.innerWidth;
var wh = window.innerHeight;
var isMobile = ww < 500;

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
    return this.mesh.position.z > globalCam.position.z;
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
        viewVector: { type: "v3", value: globalCam.position }
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
    //  outerGeom.vertices[i].x += Math.cos(Math.random()*2*Math.PI) * 10*Math.random() ;
    //  outerGeom.vertices[i].x += Math.sin(Math.random()*2*Math.PI) * 10*Math.random() ;
    // }

    var glowMat = new THREE.ShaderMaterial( 
    {
        uniforms: 
      { 
        "c":   { type: "f", value: 1.0 },
        "p":   { type: "f", value: 1.4 },
        glowColor: { type: "c", value: new THREE.Color(COLORS.Blue) },
        viewVector: { type: "v3", value: globalCam.position }
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
    var temp;

    var cubeCamera = new THREE.CubeCamera(globalNear, globalFar, 256);
    cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
    cubeCamera.position.set(x, y, z+120); //set right in front of the layer
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
    this.cubeCamera.updateCubeMap(globalRenderer, globalScene);
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


function Tunnel() {
  this.init();
  this.createMesh();

  this.handleEvents();

  window.requestAnimationFrame(this.render.bind(this));
}

Tunnel.prototype.init = function() {

  this.speed = 1;
  this.prevTime = 0;

  this.mouse = {
    position: new THREE.Vector2(ww * 0.5, wh * 0.7),
    ratio: new THREE.Vector2(0, 0),
    target: new THREE.Vector2(ww * 0.5, wh * 0.7)
  };

  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector("#scene")
  });
  this.renderer.setSize(ww, wh);

  globalRenderer = this.renderer;

  this.camera = new THREE.PerspectiveCamera(15, ww / wh, 0.01, 100);
  this.camera.rotation.y = Math.PI;
  this.camera.position.z = 0.35;

  globalCam = this.camera;

  globalScene = new THREE.Scene();
  globalScene.fog = new THREE.Fog(0x000d25,0.05,1.6);
  console.log(globalScene);

  // globalScene = globalScene;

  var light = new THREE.HemisphereLight( 0xe9eff2, 0x01010f, 1 );
  globalScene.add( light );

  var directionalLight = new THREE.DirectionalLight(COLORS.White, .7);
  directionalLight.position.set(0, 0, 1).normalize();

  globalScene.add( directionalLight );

  this.addParticle();
};

Tunnel.prototype.addParticle = function() {
  this.particles = [];
  for(var i = 0; i < (isMobile?70:150); i++){
    this.particles.push(new Particle(globalScene));
  }
};

Tunnel.prototype.createMesh = function() {
  var points = [];
  var i = 0;
  var geometry = new THREE.Geometry();
  
  globalScene.remove(this.tubeMesh)

  for (i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
  }
  points[4].y = -0.06;

  this.curve = new THREE.CatmullRomCurve3(points);
  this.curve.type = "catmullrom";

  geometry = new THREE.Geometry();
  geometry.vertices = this.curve.getPoints(70);
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

  this.tubeMaterial = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    color:0x000000
  });

  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 30, false);
  this.tubeGeometry_o = this.tubeGeometry.clone();
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);

  globalScene.add(this.tubeMesh);

};

Tunnel.prototype.handleEvents = function() {
  window.addEventListener('resize', this.onResize.bind(this), false);
  
  document.body.addEventListener('mousemove', this.onMouseMove.bind(this), false);
  document.body.addEventListener('touchmove', this.onMouseMove.bind(this), false);
  
  document.body.addEventListener('touchstart', this.onMouseDown.bind(this), false);
  document.body.addEventListener('mousedown', this.onMouseDown.bind(this), false);
  
  document.body.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  document.body.addEventListener('mouseleave', this.onMouseUp.bind(this), false);
  document.body.addEventListener('touchend', this.onMouseUp.bind(this), false);
  window.addEventListener('mouseout', this.onMouseUp.bind(this), false);
};

Tunnel.prototype.onMouseDown = function() {
  this.mousedown = true;
  TweenMax.to(globalScene.fog.color, 0.6, {
    r: 1,
    g: 1,
    b: 1
  });
  TweenMax.to(this.tubeMaterial.color, 0.6, {
    r:0,
    g:0,
    b:0
  });
  TweenMax.to(this, 1.5, {
    speed: 0.1,
    ease: Power2.easeInOut
  });
};
Tunnel.prototype.onMouseUp = function() {
  this.mousedown = false;
  TweenMax.to(globalScene.fog.color, 0.6, {
    r:0,
    g:0.050980392156862744,
    b :0.1450980392156863
  });
  TweenMax.to(this.tubeMaterial.color, 0.6, {
    r:0,
    g:0,
    b:0
  });
  TweenMax.to(this, 0.6, {
    speed: 1,
    ease: Power2.easeIn
  });
};

Tunnel.prototype.onResize = function() {
  ww = window.innerWidth;
  wh = window.innerHeight;
  
  isMobile = ww < 500;

  this.camera.aspect = ww / wh;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(ww, wh);
};

Tunnel.prototype.onMouseMove = function(e) {
  if (e.type === "mousemove"){
    this.mouse.target.x = e.clientX;
    this.mouse.target.y = e.clientY;
  } else {
    this.mouse.target.x = e.touches[0].clientX;
    this.mouse.target.y = e.touches[0].clientY;
  }
};

Tunnel.prototype.updateCameraPosition = function() {

  this.mouse.position.x += (this.mouse.target.x - this.mouse.position.x) / 30;
  this.mouse.position.y += (this.mouse.target.y - this.mouse.position.y) / 30;

  this.mouse.ratio.x = (this.mouse.position.x / ww);
  this.mouse.ratio.y = (this.mouse.position.y / wh);

  this.camera.rotation.z = ((this.mouse.ratio.x) * 1 - 0.05);
  this.camera.rotation.y = Math.PI - (this.mouse.ratio.x * 0.3 - 0.15);
  this.camera.position.x = ((this.mouse.ratio.x) * 0.044 - 0.025);
  this.camera.position.y = ((this.mouse.ratio.y) * 0.044 - 0.025);

};

Tunnel.prototype.updateCurve = function() {
  var i = 0;
  var index = 0;
  var vertice_o = null;
  var vertice = null;
  for (i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
    vertice_o = this.tubeGeometry_o.vertices[i];
    vertice = this.tubeGeometry.vertices[i];
    index = Math.floor(i / 30);
    vertice.x += ((vertice_o.x + this.splineMesh.geometry.vertices[index].x) - vertice.x) / 15;
    vertice.y += ((vertice_o.y + this.splineMesh.geometry.vertices[index].y) - vertice.y) / 15;
  }
  this.tubeGeometry.verticesNeedUpdate = true;

  this.curve.points[2].x = 0.6 * (1 - this.mouse.ratio.x) - 0.3;
  this.curve.points[3].x = 0;
  this.curve.points[4].x = 0.6 * (1 - this.mouse.ratio.x) - 0.3;

  this.curve.points[2].y = 0.6 * (1 - this.mouse.ratio.y) - 0.3;
  this.curve.points[3].y = 0;
  this.curve.points[4].y = 0.6 * (1 - this.mouse.ratio.y) - 0.3;

  this.splineMesh.geometry.verticesNeedUpdate = true;
  this.splineMesh.geometry.vertices = this.curve.getPoints(70);
};

Tunnel.prototype.render = function(time) {

  this.updateCameraPosition();

  this.updateCurve();
  
  for(var i = 0; i < this.particles.length; i++){
    this.particles[i].updateMe(this);
    if(this.particles[i].burst && this.particles[i].percent > 1){
      this.particles.splice(i, 1);
      i--;
    }
  }
  
  // When mouse down, add a lot of shapes
  if (this.mousedown){
    if(time - this.prevTime > 20){
      this.prevTime = time;
      this.particles.push(new Particle(globalScene, true, time));
      if(!isMobile){
        this.particles.push(new Particle(globalScene, true, time));
        this.particles.push(new Particle(globalScene, true, time));
      }
    }
  }
  
  this.renderer.render(globalScene, this.camera);

  window.requestAnimationFrame(this.render.bind(this));
};


class Test{
  constructor() {
    this.mesh = new THREE.Group();

    var mat = new THREE.MeshPhongMaterial({
      color: COLORS.Ice,
      shading:THREE.FlatShading
    });
    
    // this.ice = new IceTube(0, 0, 0, Math.PI/2, 1);
    var temp1 = new THREE.IcosahedronBufferGeometry(1,0);
    this.mesh.add(new THREE.Mesh(this.temp1, mat));

    var temp2 = new THREE.BoxBufferGeometry(1, 1, 1);
    this.mesh.add(new THREE.Mesh(this.temp2, mat));

    console.log(this.mesh);
  }
}

function Particle(scene, burst, time) {
  var radius = Math.random()*0.002 + 0.0003;
  var geom = this.icosahedron;
  var random = Math.random();
  // if(random > 0.9){
  //   geom = this.cube;
  // } else if(random > 0.8){
  //   geom = this.sphere;
  // }
  var range = 50;
  if(burst){
    this.color = new THREE.Color("hsl("+(time / 50)+",100%,60%)");
  } else {
    var offset = 180;
    this.color = new THREE.Color("hsl("+(Math.random()*range+offset)+",100%,80%)");
  }
  var mat = new THREE.MeshPhongMaterial({
    color: this.color,
    shading:THREE.FlatShading
  });
  // this.ice = new IceTube(0, 0, 0, Math.PI/2, 1);
  // this.ice = new THREE.IcosahedronBufferGeometry(1,0);
  this.mesh = this.ice.mesh;
  this.mesh.scale.set(radius, radius, radius);
  this.mesh.position.set(0,0,1.5);
  this.percent = burst ? 0.2 : Math.random();
  this.burst = burst ? true : false;
  this.offset = new THREE.Vector3((Math.random()-0.5)*0.025, (Math.random()-0.5)*0.025, 0);
  this.speed = Math.random()*0.004 + 0.0002;
  if (this.burst){
    this.speed += 0.003;
    this.mesh.scale.x *= 1.4;
    this.mesh.scale.y *= 1.4;
    this.mesh.scale.z *= 1.4;
  }
  this.rotate = new THREE.Vector3(-Math.random()*0.1+0.01,0,Math.random()*0.01);
  
  this.pos = new THREE.Vector3(0,0,0);
  scene.add(this.mesh);
}

// Particle.prototype.cube = new THREE.BoxBufferGeometry(1, 1, 1);
// Particle.prototype.sphere = new THREE.SphereBufferGeometry(1, 6, 6 );
// Particle.prototype.icosahedron = new THREE.IcosahedronBufferGeometry(1,0);
// Particle.prototype.ice = new IceTube(0, 0, 0, Math.PI/2, 1);
Particle.prototype.ice = new Test();
Particle.prototype.updateMe = function (tunnel) {
  // this.update();
  this.percent += this.speed * (this.burst?1:tunnel.speed);
  
  this.pos = tunnel.curve.getPoint(1 - (this.percent%1)) .add(this.offset);
  this.mesh.position.x = this.pos.x;
  this.mesh.position.y = this.pos.y;
  this.mesh.position.z = this.pos.z;
  this.mesh.rotation.x += this.rotate.x;
  this.mesh.rotation.y += this.rotate.y;
  this.mesh.rotation.z += this.rotate.z;
};


window.onload = function() {

  window.tunnel = new Tunnel();

};