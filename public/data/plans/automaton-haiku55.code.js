// automaton-haiku55 — prompt:
// a steampunk automaton robot...

// ---------- helpers ----------
function fillBox(x1,y1,z1,x2,y2,z2,id){
  for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)block(x,y,z,id);
}
// Hollow box shell. Axes with zero length are ignored, so flat boxes give rings and plane boxes give frames.
function shellBox(x1,y1,z1,x2,y2,z2,id){
  for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++){
    const edge=(x1<x2&&(x===x1||x===x2))||(y1<y2&&(y===y1||y===y2))||(z1<z2&&(z===z1||z===z2));
    if(edge)block(x,y,z,id);
  }
}
// Apply f to a box and to its mirror image across x=0.
function both(f,x1,y1,z1,x2,y2,z2,id){
  f(x1,y1,z1,x2,y2,z2,id);
  f(-x2,y1,z1,-x1,y2,z2,id);
}
// Cog on a front (XY) plane at z=cz.
function gear(cx,cy,cz){
  for(let dx=-3;dx<=3;dx++)for(let dy=-3;dy<=3;dy++){
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d>=2.2&&d<=2.95)block(cx+dx,cy+dy,cz,GOLD);
    else if(d<=1.5)block(cx+dx,cy+dy,cz,IRON);
  }
}
// Flat cog lying on the ground at y=cy.
function floorGear(cx,cy,cz){
  for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){
    const d=Math.sqrt(dx*dx+dz*dz);
    if(d>=1.9&&d<=2.9)block(cx+dx,cy,cz+dz,GOLD);
    else if(d<=1)block(cx+dx,cy,cz+dz,COPPER);
  }
}

// ---------- site prep ----------
// Clear trees and grass inside the robot footprint.
fillBox(-7,0,-5,7,8,5,AIR);

// ---------- plinth (flush with the ground) ----------
fillBox(-7,-1,-5,7,-1,5,COBBLE);
shellBox(-7,-1,-5,7,-1,5,COPPER);

// ---------- feet, legs, furnace ----------
both(fillBox,-5,0,-3,-2,1,2,IRON);        // feet
both(fillBox,-5,1,-3,-2,1,-3,COPPER);     // toe trim
both(fillBox,-4,2,-1,-3,5,0,IRON);        // piston legs
both(fillBox,-4,4,-1,-3,4,0,GOLD);        // leg collars
fillBox(-2,2,-1,2,5,1,BLACK);             // boiler furnace between legs
fillBox(-1,3,-1,-1,4,-1,GOLD);            // furnace frame
fillBox(1,3,-1,1,4,-1,GOLD);
block(0,2,-1,GOLD);
block(0,5,-1,GOLD);
block(0,3,-1,FIRE);                       // furnace mouth
block(0,4,-1,FIRE);

// ---------- hip belt ----------
fillBox(-5,6,-3,5,6,3,IRON);
block(-5,6,-3,GOLD); block(5,6,-3,GOLD);
block(-5,6,3,GOLD);  block(5,6,3,GOLD);

// ---------- torso ----------
fillBox(-5,7,-3,5,16,3,COPPER);
both(shellBox,-4,8,-3,-2,15,-3,GOLD);     // side armor panels
both(fillBox,-3,9,-3,-3,14,-3,IRON);
gear(0,14,-3);                            // front cog
fillBox(-1,8,-3,1,10,-3,GLOWSTONE);       // glowing chest core
block(-5,16,-3,GOLD); block(5,16,-3,GOLD); // corner bolts
block(-5,7,-3,GOLD);  block(5,7,-3,GOLD);

// Back boiler (behind torso, camera-side hidden)
fillBox(-4,8,4,4,15,5,COPPER);
fillBox(-4,11,4,4,11,5,GOLD);
fillBox(-4,14,4,4,14,5,GOLD);

// ---------- neck and head ----------
fillBox(-1,17,-1,1,17,1,COPPER);
fillBox(-3,18,-3,3,24,3,IRON);
both(shellBox,-3,20,-3,0,23,-3,GOLD);     // eye rims
both(fillBox,-2,21,-3,-1,22,-3,GLOWSTONE); // eyes
fillBox(-2,19,-3,2,19,-3,BLACK);          // grille mouth
block(-1,19,-3,GOLD); block(1,19,-3,GOLD); // teeth
both(fillBox,-4,20,-1,-4,22,0,GOLD);      // ear bolts
fillBox(-2,25,-2,2,25,2,GOLD);            // crown plate
line(0,26,0,0,29,0,COPPER);               // antenna
block(0,30,0,GLOWSTONE);
block(0,31,0,ELECTRIC);                   // tesla tip

// ---------- twin smokestacks + steam ----------
both(fillBox,-5,17,1,-4,21,2,COPPER);
both(fillBox,-5,22,1,-4,22,2,GOLD);
block(-5,23,1,STEAM); block(-4,23,2,STEAM);
block(5,23,1,STEAM);  block(4,23,2,STEAM);

// ---------- pauldrons, arms, claws ----------
both(fillBox,-9,14,-3,-6,16,1,COPPER);    // pauldrons
both(fillBox,-8,8,-2,-6,13,0,IRON);       // upper arms
both(fillBox,-8,7,-2,-6,7,0,GOLD);        // elbows
both(fillBox,-8,3,-2,-6,6,0,COPPER);      // forearms
both(fillBox,-8,1,-2,-6,2,0,IRON);        // hands
both(fillBox,-8,0,-2,-8,0,-1,GOLD);       // claws
both(fillBox,-6,0,-2,-6,0,-1,GOLD);

// ---------- background: brick factory chimney with steam ----------
fillBox(10,0,7,11,20,8,BRICK);
fillBox(9,21,6,12,21,9,IRON);
block(10,22,7,STEAM);
block(11,22,8,STEAM);

// ---------- foreground: dropped cog on the grass ----------
floorGear(-10,0,-5);