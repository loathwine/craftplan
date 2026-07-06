// yoda-4x-haiku — prompt:
// Yoda...

// Yoda - Jedi Master Voxel Sculpture

// Base platform
cube(-2, 0, -2, 2, 1, 2, 2);

// Feet
cube(-1, 1, -1, -0.3, 2, 0.5, 8);
cube(0.3, 1, -1, 1, 2, 0.5, 8);

// Thin legs
cylinder(-0.6, 2, -0.2, 0.35, 2.5, 3);
cylinder(0.7, 2, -0.2, 0.35, 2.5, 3);

// Robed torso - hollow to save blocks
hollowCube(-1.8, 4.5, -1.5, 1.8, 8, 1.5, 10);
cube(-1.6, 5.5, -1.3, 1.6, 6.5, -1.3, 8);

// Lower robe skirts - layered volume
cube(-2.5, 5, 0.2, -2, 7.5, 1.8, 7);
cube(2, 5, 0.2, 2.5, 7.5, 1.8, 7);
cube(-1, 4.5, 1.5, 1, 6.5, 2.2, 7);

// Robe folds - asymmetry
cube(-2.3, 5.5, -0.5, -1.8, 7, 0.8, 10);
cube(1.8, 5.5, -0.5, 2.3, 7, 0.8, 10);

// Arms - thin nubs
cylinder(-2.2, 6, 0.2, 0.3, 1.5, 2);
cylinder(2.2, 6, 0.2, 0.3, 1.5, 2);

// Hands
cube(-2.3, 5.7, 0, -2, 6.4, 0.4, 8);
cube(2, 5.7, 0, 2.3, 6.4, 0.4, 8);

// Head - main feature, large sphere
sphere(0, 9.3, 0.2, 2.8, 3);
hollowSphere(0, 9.3, 0.2, 2.4, 8);
hollowSphere(0, 9.3, 0.2, 2, 8);

// Head back bulge
sphere(0, 9.3, 1.8, 2, 3);

// Face wrinkles - detailed texture
cube(-2, 10.3, -1, 2, 10.45, -1.5, 8);
cube(-2, 10.7, -1.3, 2, 10.85, -1.8, 8);
line(-2.3, 9.7, -0.5, 2.3, 9.7, -0.5, 8);

// Large expressive eyes
sphere(-1.2, 9.3, -2.2, 0.85, 11);
sphere(1.2, 9.3, -2.2, 0.85, 11);
block(-1.2, 9.3, -2.3, 3);
block(1.2, 9.3, -2.3, 3);

// Eye whites
block(-1.2, 9.4, -2.2, 12);
block(1.2, 9.4, -2.2, 12);

// Distinctive large pointed ears
cylinder(-3.2, 9.3, 0.2, 0.6, 3.8, 3);
hollowCylinder(-3.2, 9.3, 0.2, 0.4, 3.5, 8);
cylinder(3.2, 9.3, 0.2, 0.6, 3.8, 3);
hollowCylinder(3.2, 9.3, 0.2, 0.4, 3.5, 8);

// Ear tips
sphere(-3.2, 13.3, 0.2, 0.4, 10);
sphere(3.2, 13.3, 0.2, 0.4, 10);

// Cheek definition
line(-2.5, 9, -1, -1.5, 8.8, -1.5, 8);
line(2.5, 9, -1, 1.5, 8.8, -1.5, 8);

// Snout/chin area
cube(-1.2, 7.8, -2.5, 1.2, 8.4, -1.5, 8);
cube(-1, 7.5, -2.7, 1, 8, -1.5, 3);

// Mouth line
line(-0.8, 7.9, -2.4, 0.8, 7.9, -2.4, 8);

// Nose
cube(-0.4, 8.4, -2.8, 0.4, 8.8, -2.3, 8);

// Neck
cube(-1, 8, -0.5, 1, 8.5, 0.3, 3);

// Front robe panel
cube(-0.6, 7, -1.5, 0.6, 8, -1.2, 10);
hollowCube(-0.4, 7.1, -1.45, 0.4, 7.9, -1.25, 8);

// Robe hem details
line(-1.8, 6.5, 1.5, -2.2, 5.5, 1.8, 10);
line(1.8, 6.5, 1.5, 2.2, 5.5, 1.8, 10);

// Right side robe tassels
disk(-1.8, 5.8, 1.2, 0.4, 7);
disk(1.8, 5.8, 1.2, 0.4, 7);

// Iconic walking staff
line(4, 1, 4, 4, 10, 4, 4);
sphere(4, 10.5, 4, 0.9, 4);
cube(3.7, 10.7, 3.7, 4.3, 11.3, 4.3, 10);
hollowSphere(4, 11.3, 4, 0.5, 8);

// Staff grip detail
cylinder(4, 9.2, 4, 0.5, 1.2, 4);

// Base shadow/depth
cube(-2, -1, -2, 2, 0, 2, 8);
cube(-3, -2, -3, 3, -1, 3, 8);