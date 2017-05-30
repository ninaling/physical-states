var temp;
var sphere; var cylinder; //globals to save memory

var neheTexture = new THREE.ImageUtils.loadTexture("assets/image.png");
var SphereGeometry = new THREE.SphereGeometry(1.2, 8, 8);
var SphereMaterial = new THREE.MeshLambertMaterial({
        map: neheTexture
});

var CylinderGeometry = new THREE.CylinderGeometry(.15, .2, 3, 3);
var CylinderMaterial = new THREE.MeshLambertMaterial({
        color: 0xFFFF01
});

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
