function CreateMDMA(x, y, z, randomAngle) {
  var atom = CreateMDMAAtom(x, y, z);
  var atom2 = CreateMDMAAtom(x, y + 4.2, z);
  var atom3 = CreateMDMAAtom(x - 4, y - 1.5, z);
  var atom4 = CreateMDMAAtom(x - 4, y + 6, z);
  var atom5 = CreateMDMAAtom(x - 6.6, y + 2.3, z);

  //leftmost two
  var atom6 = CreateMDMAAtom(x - 9.2, y + 2.8, z + 3.2, 0.8, 6, 6);
  var atom7 = CreateMDMAAtom(x - 9, y + 2.8, z - 3.2, 0.8, 6, 6);

  var atom8 = CreateMDMAAtom(x + 3.8, y + 6.2, z);
  var atom9 = CreateMDMAAtom(x + 3.8, y - 1.8, z);
  var atom10 = CreateMDMAAtom(x + 3.8, y + 10.2, z, 0.8, 6, 6);
  var atom11 = CreateMDMAAtom(x + 3.8, y - 5.8, z, 0.8, 6, 6);
  var atom12 = CreateMDMAAtom(x + 7.8, y + 4.7, z);
  var atom13 = CreateMDMAAtom(x + 7.8, y, z);
  var atom14 = CreateMDMAAtom(x + 11.4, y + 6, z);
  var atom15 = CreateMDMAAtom(x + 10.4, y - 1.8, z, 0.8, 6, 6);

  //third hexagon top
  var atom16 = CreateMDMAAtom(x + 11.3, y + 8.8, z + 2.7, 0.8, 6, 6);
  var atom17 = CreateMDMAAtom(x + 11.3, y + 8.8, z - 2.7, 0.8, 6, 6);

  var atom18 = CreateMDMAAtom(x + 18.3, y + 6, z);
  var atom19 = CreateMDMAAtom(x + 15, y + 3.5, z);

  var atom20 = CreateMDMAAtom(x + 15, y + 2, z - 3, 0.8, 6, 6);

  var atom21 = CreateMDMAAtom(x + 18.3, y + 8.8, z - 2.7, 0.8, 6, 6);
  var atom23 = CreateMDMAAtom(x + 15, y + 2, z + 3);

  //bottom, closest three
  var atom27 = CreateMDMAAtom(x + 15, y + 4.3, z + 5.5, 0.8, 6, 6);
  var atom28 = CreateMDMAAtom(x + 12.5, y + 0.5, z + 5.5, 0.8, 6, 6);
  var atom29 = CreateMDMAAtom(x + 17.5, y + 0.5, z + 5.5, 0.8, 6, 6);

  //righmost four
  var atom22 = CreateMDMAAtom(x + 22.3, y + 3.6, z);
  var atom24 = CreateMDMAAtom(x + 24, y + 1.8, z + 3, 0.8, 6, 6);
  var atom25 = CreateMDMAAtom(x + 24.5, y + 6.2, z, 0.8, 6, 6);
  var atom26 = CreateMDMAAtom(x + 24.5, y + 1.8, z - 3, 0.8, 6, 6);


  //-3, -1.2, 0
  var Cylinder1 = CreateMDMABond(x - 2.1, y - 0.8, z, 4, 2, 45, 0.3, 0.3);
  var Cylinder3 = CreateMDMABond(x - 1.55, y + 5.4, z, -4, 1.2, 45, 0.3, 0.3);
  var Cylinder4 = CreateMDMABond(x - 5.5, y + 4.2, z, 2.7, 4, 200, 0.3, 0.3);
  var Cylinder5 = CreateMDMABond(x - 5.5, y + 0.3, z, -0.8, 1, 20, 0.3, 0.3);

  //leftmost two
  var Cylinder6 = CreateMDMABond(x - 8, y + 2.5, z + 2, -1.5, 0.2, -1);
  var Cylinder7 = CreateMDMABond(x - 8, y + 2.5, z - 2, -1.5, 0.2, 1);

  var Cylinder8 = CreateMDMABond(x + 2.1, y - 0.9, z, -1.5, 1, 20, 0.3, 0.3);
  var Cylinder9 = CreateMDMABond(x + 2.03, y + 5.4, z, 1.5, 1, 20, 0.3, 0.3);
  var Cylinder12 = CreateMDMABond(x + 6.1, y + 5.9, z, -4, 2, 45);
  var Cylinder13 = CreateMDMABond(x + 6.2, y + 5.4, z, -4, 2, 45);
  var Cylinder15 = CreateMDMABond(x + 6, y - 0.8, z, 4, 2, 45, 0.3, 0.3);
  var Cylinder16 = CreateMDMABond(x + 8.8, y - 0.8, z, -1.5, 1, 20, 0.3, 0.3);
  var Cylinder17 = CreateMDMABond(x + 9.8, y + 5.5, z, 1.5, 1, 20, 0.3, 0.3);

  //third hexagon top
  var Cylinder18 = CreateMDMABond(x + 11.5, y + 7.7, z + 1.5, 0, 0.5, -0.5);
  var Cylinder19 = CreateMDMABond(x + 11.5, y + 8, z - 1.5, 0, 0.5, 0.5);

  var Cylinder20 = CreateMDMABond(x + 13.5, y + 5.2, z, -3, 2, 45, 0.3, 0.3);

  var Cylinder22 = CreateMDMABond(x + 15, y + 2.7, z - 2, 0, -0.1, 0.05, 0.3);

  //right top
  var Cylinder23 = CreateMDMABond(x + 18.3, y + 7.2, z - 1.2, 0, 0.5, 0.5);
  var Cylinder32 = CreateMDMABond(x + 16.3, y + 5.2, z + 0.5, -0.4, -0.3, -10, 0.3, 0.3);

  var Cylinder25 = CreateMDMABond(x + 15, y + 2.7, z + 2, 0, -0.1, -0.05, 0.3, 0.3);

  //bottom three
  var Cylinder29 = CreateMDMABond(x + 15, y + 3.2, z + 4.5, 0, 0.4, -0.5);
  var Cylinder30 = CreateMDMABond(x + 16.5, y + 1.2, z + 4.5, -0.5, 0.3, 1);
  var Cylinder31 = CreateMDMABond(x + 13.5, y + 1.2, z + 4.5, 0.5, 0.3, 1);

  //rightmost four
  var Cylinder24 = CreateMDMABond(x + 20.3, y + 4.6, z, -0.4, 0.3, 10, 0.3, 0.3);
  var Cylinder26 = CreateMDMABond(x + 23.3, y + 2.8, z + 1.6, -0.5, 0.5, 0.5);
  var Cylinder27 = CreateMDMABond(x + 23.5, y + 4.7, z, 1.2, 1.5, 20);
  var Cylinder28 = CreateMDMABond(x + 23.5, y + 3, z - 1.5, -0.5, 0.5, -0.5);

  var geometry1 = new THREE.CylinderGeometry(0.15, 0.2, 3, 3);
  var geometry3 = new THREE.CylinderGeometry(0.15, 0.2, 2, 3);
  var geometry2 = new THREE.CylinderGeometry(0.3, 0.3, 3.1, 3);
  var material = new THREE.MeshLambertMaterial({
      color: 0xFFFF01,
  });
  var Cylinder = new THREE.Mesh(geometry1, material);
  var Cylinder2 = new THREE.Mesh(geometry1, material);
  var Cylinder10 = new THREE.Mesh(geometry1, material);
  var Cylinder11 = new THREE.Mesh(geometry1, material);
  var Cylinder14 = new THREE.Mesh(geometry2, material);
  var Cylinder21 = new THREE.Mesh(geometry2, material);
  Cylinder.position.set(x - 0.3, y + 2.2, z);
  Cylinder2.position.set(x + 0.3, y + 2.2, z);
  Cylinder10.position.set(x + 3.8, y + 8.2, z);
  Cylinder11.position.set(x + 3.8, y - 3.8, z);
  Cylinder14.position.set(x + 7.8, y + 2.2, z);
  Cylinder21.position.set(x + 15, y + 2.2, z);

  var group = new THREE.Group();
  group.add(atom);
  group.add(atom2);
  group.add(atom3);
  group.add(atom4);
  group.add(atom5);

  //leftmost two
  group.add(atom6);
  group.add(atom7);

  group.add(atom9);
  group.add(atom8);
  group.add(atom10);
  group.add(atom11);
  group.add(atom12);
  group.add(atom13);
  group.add(atom14);
  group.add(atom15);

  //third hexagon top
  group.add(atom16);
  group.add(atom17);

  group.add(atom18); //right top c 20
  group.add(atom19);

  group.add(atom20); // c 22 || a 23

  group.add(atom21); //right top c 23

  group.add(atom23); // c 25 || a 20

  //bottom, closest three
  group.add(atom27) // c 29
  group.add(atom28) // c 31
  group.add(atom29) // c 30

  //rightmost four
  group.add(atom22);
  group.add(atom24); // c 26
  group.add(atom25);
  group.add(atom26);

  group.add(Cylinder);
  group.add(Cylinder1);
  group.add(Cylinder2);
  group.add(Cylinder3);
  group.add(Cylinder4);
  group.add(Cylinder8);
  group.add(Cylinder9);
  group.add(Cylinder5);

  //leftmost two
  group.add(Cylinder6);
  group.add(Cylinder7);

  group.add(Cylinder10);
  group.add(Cylinder11);
  group.add(Cylinder12);
  group.add(Cylinder13);
  group.add(Cylinder14);
  group.add(Cylinder15);
  group.add(Cylinder16);
  group.add(Cylinder17);

  //third hexagon top
  group.add(Cylinder18);
  group.add(Cylinder19);

  group.add(Cylinder20);
  // group.add(Cylinder21);//dont use
  group.add(Cylinder22); // a 20 || c 25

  group.add(Cylinder23); // a 21
  group.add(Cylinder32); // a 18

  group.add(Cylinder25); // a 23 || c 22

  //bottom, closest three
  group.add(Cylinder29); // a 27
  group.add(Cylinder30); // a 29
  group.add(Cylinder31); // a 28

  //rightmost four
  group.add(Cylinder24);
  group.add(Cylinder26); // a 24
  group.add(Cylinder27);
  group.add(Cylinder28);

  if (randomAngle) {
    console.log("hai");
    group.rotation.x += Math.random()*3;
    group.rotation.y += Math.random()*3;
    group.rotation.z += Math.random()*3;
  }

  return group;
}

function CreateMDMAAtom(x, y, z, n = 1.2, k = 8, j = 8) {
    var neheTexture = new THREE.ImageUtils.loadTexture("assets/image.png");
    var geometry = new THREE.SphereGeometry(n, k, j);
    var material = new THREE.MeshLambertMaterial({
        map: neheTexture
    });
    neheTexture.offset.x = Math.random(); // 0.0 - 1.0
    neheTexture.offset.y = 0;
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    return sphere;
}

function CreateMDMABond(x, y, z, vx, vy, vz, n = 0.15, k = 0.2) {
    var geometry1 = new THREE.CylinderGeometry(n, k, 3, 3);
    var material = new THREE.MeshLambertMaterial({
        color: 0xFFFF01
    });
    var cylinder = new THREE.Mesh(geometry1, material);
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
