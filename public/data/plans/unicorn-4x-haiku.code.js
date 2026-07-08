// unicorn-4x-haiku — prompt:
// a unicorn...

// Magical unicorn facing north - detailed voxel architecture

// BODY - main torso
cube(-2, 0.5, 1, 2, 3, 6, 7);

// CHEST - pronounced muscular
cube(-2.3, 2, -0.3, 2.3, 3.8, 0.8, 7);

// SHOULDER transition
cube(-2.2, 1.8, 0.3, 2.2, 3.1, 1.6, 7);

// NECK - tapered toward head
cube(-1.8, 2.8, -1, 1.8, 4.5, 0.3, 7);

// HEAD - rounded face
sphere(0, 4.5, -3.5, 2.2, 7);

// SNOUT - prominent muzzle
cube(-1, 2.8, -5.4, 1, 3.9, -4.3, 10);
cube(-0.7, 2.5, -5.7, 0.7, 3.2, -4, 10);

// MOUTH definition
cube(-0.5, 3.2, -5.6, 0.5, 3.5, -4.8, 3);

// NOSTRILS
block(-0.4, 3, -5.8, 1);
block(0.4, 3, -5.8, 1);

// EYES - expressive
block(-1.4, 5, -4.8, 3);
block(1.4, 5, -4.8, 3);
block(-1.3, 5.1, -5.1, 12);
block(1.5, 5.1, -5.1, 12);

// EYEBROWS
block(-1.6, 5.4, -4.6, 3);
block(1.6, 5.4, -4.6, 3);

// HORN - crystalline tower
cylinder(0, 7, -3.5, 0.7, 0.6, 13);
cylinder(0, 7.6, -3.5, 0.52, 0.8, 13);
cylinder(0, 8.4, -3.5, 0.36, 0.9, 13);
cylinder(0, 9.3, -3.5, 0.22, 1, 13);

// HORN AURA - magical glow
cube(-0.6, 8, -4.1, 0.6, 9.8, -2.9, 5);

// EARS - alert and pointed
cube(-3.2, 5.5, -2.7, -2.1, 7.4, -1.3, 7);
cube(-3.05, 5.8, -2.6, -2.25, 7.1, -1.4, 12);
cube(2.1, 5.5, -2.7, 3.2, 7.4, -1.3, 7);
cube(2.25, 5.8, -2.6, 3.05, 7.1, -1.4, 12);

// FORELOCK - mane on forehead
cube(-1, 5.5, -4.2, 1, 6.8, -2.9, 5);

// MANE - flowing along neck and back
cube(-3, 3.8, -0.8, -1.3, 6.2, 1, 5);
cube(-3.1, 3.4, 1.5, -1.2, 5.8, 3, 5);
cube(-3.1, 3, 3.5, -1.2, 5.4, 5.5, 5);

// MANE WISPS - added texture
cube(-3.4, 3.2, 0.5, -2.8, 4.5, 2, 5);
cube(-3.3, 2.8, 2.8, -2.9, 4.2, 4, 5);

// FRONT LEFT LEG
cylinder(-2.4, 0.4, -0.2, 0.6, 1.8, 7);
cube(-2.7, -1.6, -0.5, -2.1, -0.4, 0.1, 3);

// FRONT RIGHT LEG
cylinder(1.6, 0.4, -0.2, 0.6, 1.8, 7);
cube(2.1, -1.6, -0.5, 2.7, -0.4, 0.1, 3);

// BACK LEFT LEG
cylinder(-2.4, 0.4, 5.9, 0.6, 1.8, 7);
cube(-2.7, -1.6, 5.5, -2.1, -0.4, 6.3, 3);

// BACK RIGHT LEG
cylinder(1.6, 0.4, 5.9, 0.6, 1.8, 7);
cube(2.1, -1.6, 5.5, 2.7, -0.4, 6.3, 3);

// BELLY - light underbody
cube(-2, 0.5, 2, 2, 1.8, 5.5, 12);

// BACK - darker top line
cube(-2.1, 2.8, 2, 2.1, 3.2, 5.5, 7);

// TAIL - magical flowing
cube(-1, 1.4, 7, 1, 4.8, 8.8, 5);
cube(-1.4, 0, 9, 1.4, 3.8, 11, 5);
cube(-0.8, 0.4, 11, 0.8, 2.8, 12.5, 5);

// TAIL WISPS - secondary strands
cube(-2, 1, 7.5, -1.3, 3.5, 9, 5);
cube(1.3, 1, 7.5, 2, 3.5, 9, 5);

// CHEST PLATE - decoration
cube(-1.5, 2.5, -0.5, 1.5, 3, 0.2, 13);

// RUMP - rear definition
cube(-2, 1.5, 5.5, 2, 2.8, 6.5, 7);