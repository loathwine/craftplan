// santa-sleigh-4x-haiku — prompt:
// Santa's sleigh pulled by reindeer...

// Santa's Sleigh Pulled by Reindeer

function drawReindeer(cx, cz) {
  // Body
  cube(cx - 1.5, 1.5, cz, cx + 1.5, 3.5, cz + 2.5, 4); // OAK_LOG
  
  // Neck
  cube(cx - 0.8, 3, cz - 2, cx + 0.8, 4.5, cz, 4);
  
  // Head
  cube(cx - 0.7, 4.5, cz - 3.5, cx + 0.7, 5.5, cz - 1.5, 4);
  
  // Ears
  cube(cx - 1, 5.3, cz - 3.2, cx - 0.6, 6, cz - 2.5, 4);
  cube(cx + 0.6, 5.3, cz - 3.2, cx + 1, 6, cz - 2.5, 4);
  
  // Antlers
  cube(cx - 1.2, 5.5, cz - 3, cx - 0.8, 7.5, cz - 2, 5);
  cube(cx + 0.8, 5.5, cz - 3, cx + 1.2, 7.5, cz - 2, 5);
  
  // Small antler branches
  cube(cx - 1.5, 6.5, cz - 2.5, cx - 1.2, 7.2, cz - 2, 5);
  cube(cx + 1.2, 6.5, cz - 2.5, cx + 1.5, 7.2, cz - 2, 5);
  
  // Snout
  cube(cx - 0.5, 4, cz - 4.2, cx + 0.5, 4.8, cz - 3.5, 4);
  
  // Nose
  block(cx, 4.3, cz - 4.5, 10);
  
  // Eyes
  block(cx - 0.4, 5, cz - 3.2, 3);
  block(cx + 0.4, 5, cz - 3.2, 3);
  
  // Front legs
  cube(cx - 1.2, 0.5, cz + 0.5, cx - 0.6, 1.8, cz + 1.5, 4);
  cube(cx + 0.6, 0.5, cz + 0.5, cx + 1.2, 1.8, cz + 1.5, 4);
  
  // Back legs
  cube(cx - 1.2, 0.5, cz + 2, cx - 0.6, 1.8, cz + 3.2, 4);
  cube(cx + 0.6, 0.5, cz + 2, cx + 1.2, 1.8, cz + 3.2, 4);
  
  // Hooves
  cube(cx - 1.2, 0, cz + 0.5, cx - 0.6, 0.5, cz + 1.5, 3);
  cube(cx + 0.6, 0, cz + 0.5, cx + 1.2, 0.5, cz + 1.5, 3);
  cube(cx - 1.2, 0, cz + 2, cx - 0.6, 0.5, cz + 3.2, 3);
  cube(cx + 0.6, 0, cz + 2, cx + 1.2, 0.5, cz + 3.2, 3);
  
  // Tail
  line(cx + 1.5, 2.5, cz + 2.5, cx + 2.5, 2, cz + 4, 12);
}

function drawSleigh() {
  // Main body
  cube(-6, 2, 6, 6, 6, 18, 10);
  
  // Runners
  cube(-7.5, 0.5, 2, -6, 1.5, 7, 8);
  cube(6, 0.5, 2, 7.5, 1.5, 7, 8);
  
  // Runner curve detail
  cube(-7, 1, 3, -6.5, 2, 6, 10);
  cube(6.5, 1, 3, 7, 2, 6, 10);
  
  // Front wall
  cube(-6, 2, 5, 6, 6, 6.5, 10);
  
  // Side walls
  cube(-6.5, 2, 6, -6, 6, 18, 10);
  cube(6, 2, 6, 6.5, 6, 18, 10);
  
  // Back wall
  cube(-6, 2, 17.5, 6, 6, 18.5, 10);
  
  // Roof
  cube(-5.5, 6.5, 8, 5.5, 7.5, 16, 12);
  
  // Gold trim
  cube(-6.2, 5.8, 6, 6.2, 6.2, 18, 3);
  
  // Window
  cube(-3.5, 3.5, 5, 3.5, 5, 7, 11);
  
  // Interior seat
  cube(-4, 2.5, 10, 4, 3.5, 14, 7);
  
  // Backrest
  cube(-4, 3.5, 14, 4, 6, 14.5, 10);
}

function drawSanta() {
  // Body in red suit
  cube(-1.2, 6, 11, 1.2, 8.5, 12.5, 10);
  
  // Belly
  cube(-1.8, 6.5, 11.2, 1.8, 8, 12.3, 10);
  
  // Head
  sphere(0, 9.3, 11.75, 1, 12);
  
  // Cheeks
  block(-0.7, 9, 11, 10);
  block(0.7, 9, 11, 10);
  
  // Hat
  cube(-1.3, 9.5, 10.8, 1.3, 11, 12.7, 10);
  
  // Pom-pom
  sphere(0, 11.3, 11.75, 0.6, 12);
  
  // Fur trim
  cube(-1.5, 8.3, 11, 1.5, 8.7, 12.5, 12);
  
  // Arms
  cube(-2.2, 7, 11, -1.2, 8, 12.5, 4);
  cube(1.2, 7, 11, 2.2, 8, 12.5, 4);
  
  // Mittens
  cube(-2.5, 6.8, 11.5, -2.2, 7.5, 12.5, 12);
  cube(2.2, 6.8, 11.5, 2.5, 7.5, 12.5, 12);
  
  // Legs/boots
  cube(-1, 4.5, 11, 1, 6, 12.5, 3);
  
  // Belt
  cube(-1.8, 6.2, 11, 1.8, 6.5, 12.5, 3);
}

function drawGiftBag() {
  // Main sack
  cube(-3.5, 5, 13, 3.5, 9, 16, 10);
  
  // Sack top
  cube(-3, 8.8, 13.5, 3, 9.5, 15.5, 12);
  
  // Presents in bag
  cube(-3, 6, 14, -1, 7.5, 15.5, 10);
  cube(1, 6, 14, 3, 7.5, 15.5, 10);
  
  // Ribbons
  cube(-2, 6.5, 13.5, 0, 8, 14, 11);
  cube(0, 6.5, 15, 2, 8, 16, 11);
}

function drawHarness() {
  // Reins from reindeer to sleigh
  line(-9, 4, -5, -5.5, 4, 5, 3);
  line(-3, 4, -7, -5.5, 4, 5, 3);
  line(3, 4, -7, 5.5, 4, 5, 3);
  line(9, 4, -5, 5.5, 4, 5, 3);
  
  // Rein attachment
  cube(-5, 3.5, 5.5, 5, 4.5, 6, 4);
}

function drawDecorations() {
  // Holly sprigs
  sphere(-6.3, 5, 8, 0.8, 5);
  sphere(6.3, 5, 8, 0.8, 5);
  sphere(-6.3, 5, 14, 0.8, 5);
  sphere(6.3, 5, 14, 0.8, 5);
  
  // Back wreath
  sphere(0, 5, 18, 1.2, 5);
  
  // Bells
  cube(-5, 1, 3, -4.5, 1.7, 3.8, 10);
  cube(4.5, 1, 3, 5, 1.7, 3.8, 10);
  
  // Snow on roof
  cube(-5, 7.5, 10, 5, 8, 14, 12);
}

// Draw four reindeer team
drawReindeer(-10, -6);  // Back left
drawReindeer(-4, -8);   // Front left
drawReindeer(4, -8);    // Front right
drawReindeer(10, -6);   // Back right (Rudolph)

// Draw sleigh
drawSleigh();

// Draw Santa
drawSanta();

// Draw gift bag
drawGiftBag();

// Draw harness
drawHarness();

// Add decorations
drawDecorations();