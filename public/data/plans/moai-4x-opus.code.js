// moai-4x-opus — prompt:
// the Moai statues of Easter Island...

// ===== The Moai statues of Easter Island =====
// Ceremonial ahu platform + a row of giant stone heads facing NORTH (-Z)
// toward the camera, plus a toppled, moss-grown moai in the foreground.

function speckle(x1,y1,z1,x2,y2,z2,id,mod){
  for(let x=x1;x<=x2;x++)
    for(let y=y1;y<=y2;y++)
      for(let z=z1;z<=z2;z++)
        if((((x*7+y*13+z*5)%mod)+mod)%mod===0) block(x,y,z,id);
}

// ---- A single Moai. Front (face) toward -Z. ----
function moai(cx, gy, cz, bh, hh, topknot){
  const fz = cz-2;            // front / north plane
  const bz = cz+2;           // back plane
  const headBz = cz+1;

  // Torso / heavy shoulders (body emerges from the ahu)
  cube(cx-3, gy, fz, cx+3, gy+bh-1, bz, STONE);
  // Neck
  const neckY0=gy+bh, neckY1=gy+bh+1;
  cube(cx-2, neckY0, cz-1, cx+2, neckY1, bz, STONE);
  // Head (tall, elongated, blocky)
  const headY0=gy+bh+2;
  const headTop=headY0+hh-1;
  cube(cx-3, headY0, fz, cx+3, headTop, headBz, STONE);

  // Weather the whole carving BEFORE cutting features
  speckle(cx-3, gy, fz, cx+3, headTop, headBz, COBBLE, 8);
  speckle(cx-3, gy, fz, cx+3, headY0-1, bz, DIRT, 17); // grime on lower body

  // Long arms carved down the sides, hands meeting on the belly
  cube(cx-3, gy+1, fz, cx-3, gy+bh-2, fz, COBBLE);
  cube(cx+3, gy+1, fz, cx+3, gy+bh-2, fz, COBBLE);
  cube(cx-2, gy+1, fz, cx+2, gy+1, fz, COBBLE);

  // Heavy brow ridge (protruding shelf)
  const browY = headY0 + Math.round(hh*0.60);
  cube(cx-3, browY, fz-1, cx+3, browY, fz, STONE);
  block(cx-3, browY+1, fz, STONE); block(cx+3, browY+1, fz, STONE);

  // Deep-set eye sockets (recessed into the front plane)
  const eyeY0=browY-2, eyeY1=browY-1;
  cube(cx-2, eyeY0, fz, cx-1, eyeY1, fz, AIR);
  cube(cx+1, eyeY0, fz, cx+2, eyeY1, fz, AIR);

  // Long straight nose from brow down to the lip
  const noseBot = headY0 + Math.round(hh*0.20);
  cube(cx, noseBot, fz-1, cx, browY-1, fz-1, STONE);
  cube(cx-1, noseBot, fz-1, cx+1, noseBot, fz-1, STONE); // broad nostrils
  block(cx, noseBot-1, fz-2, STONE);                     // jutting tip

  // Thin pressed lips
  cube(cx-1, noseBot-1, fz-1, cx+1, noseBot-1, fz-1, COBBLE);

  // Elongated ears running down the sides
  cube(cx-4, headY0+1, cz-1, cx-4, browY, headBz, STONE);
  cube(cx+4, headY0+1, cz-1, cx+4, browY, headBz, STONE);

  // Pukao (red topknot) on some
  if(topknot){
    cube(cx-3, headTop+1, cz-1, cx+3, headTop+2, headBz, BRICK);
    cube(cx-2, headTop+3, cz-1, cx+2, headTop+3, headBz, BRICK);
    block(cx-3,headTop+2,headBz,AIR); block(cx+3,headTop+2,headBz,AIR);
    speckle(cx-3, headTop+1, cz-1, cx+3, headTop+3, headBz, STONE, 6);
  }
}

// ---- The ahu (fitted-stone ceremonial platform) ----
cube(-19, 0, 5, 19, 2, 9, STONE);
speckle(-19, 0, 5, 19, 2, 9, COBBLE, 6);
speckle(-19, 0, 5, 19, 2, 5, COBBLE, 3);   // fitted stones on the front face
cube(-19, -1, 3, 19, -1, 9, COBBLE);       // lower step
// Packed-earth ceremonial ground in front
cube(-20, -1, -3, 20, -1, 4, DIRT);
speckle(-20, -1, -3, 20, -1, 4, GRASS, 5);

// ---- The row of standing Moai (feet on the platform top, y=2) ----
moai(-14, 3, 7, 6,  9, false);
moai( -5, 3, 7, 7, 12, true);
moai(  5, 3, 7, 8, 13, true);   // tallest
moai( 14, 3, 7, 6, 10, false);

// ---- A toppled, moss-grown Moai lying in the foreground ----
(function(){
  const cx=-9, cz=-13, y0=-1;
  cube(cx-2, y0, cz-4, cx+2, y0+3, cz+3, STONE);           // fallen head/body
  speckle(cx-2, y0, cz-4, cx+2, y0+3, cz+3, COBBLE, 6);
  speckle(cx-2, y0+3, cz-4, cx+2, y0+3, cz+3, LEAVES, 4);  // moss on the top
  speckle(cx-2, y0, cz-4, cx+2, y0, cz+3, DIRT, 3);        // sunk in earth
  cube(cx, y0+4, cz-2, cx, y0+4, cz, STONE);               // nose facing up
  block(cx-1, y0+3, cz+1, AIR); block(cx+1, y0+3, cz+1, AIR); // eye pits
})();

// ---- Scattered rubble / broken stones ----
sphere(12, -1, -9, 2, STONE);  speckle(10,-2,-11,14,0,-7, COBBLE, 4);
sphere(16,  0, -5, 1, COBBLE);
sphere(-16,-1, -8, 2, STONE);  speckle(-18,-2,-10,-14,0,-6, DIRT, 5);
sphere(6,  -1, -11, 1, COBBLE);