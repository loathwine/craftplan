// yoda-4x-opus — prompt:
// Yoda...

disk(0,-2,0,8,COBBLE);
disk(0,-1,0,9,STONE);
hollowCylinder(0,-1,0,9,1,COBBLE);

const GREEN=LEAVES, ROBE=OAK_LOG, TRIM=PLANKS, HILT=STONE, HAIR=SNOW, DARK=BRICK;

// clear forest clutter only around the statue footprint (AIR is free)
cube(-12,3,-11,12,32,11,AIR);

// ---- Robe: tapered cone, wide hem to narrow shoulders ----
for(let y=0;y<=14;y++){
  const r=Math.round(7 - y*(4/14));
  disk(0,y,0,r,ROBE);
}
// vertical robe folds (lighter tan)
for(let a=0;a<360;a+=45){
  for(let y=1;y<=13;y++){
    const r=(7 - y*(4/14))-0.15;
    const x=Math.round(Math.cos(a*Math.PI/180)*r);
    const z=Math.round(Math.sin(a*Math.PI/180)*r);
    block(x,y,z,TRIM);
  }
}
// waist sash / belt
hollowCylinder(0,7,0,5,2,COBBLE);
// inner tunic V on chest (front = +Z)
for(let y=8;y<=14;y++){
  const r=Math.round(7 - y*(4/14));
  const w=Math.max(0,Math.floor((y-8)/2));
  for(let x=-w;x<=w;x++){ block(x,y,r,SNOW); }
}
// collar ring + green neck
disk(0,14,0,5,ROBE);
hollowCylinder(0,14,0,4,2,ROBE);
cube(-2,14,-2,2,17,2,GREEN);

// ---- Head ----
sphere(0,19,0,4,GREEN);
// forehead wrinkles + brow (darker green→OAK shading)
for(let x=-2;x<=2;x++){ block(x,22,3,ROBE); block(x,21,4,ROBE); }
// eyes: big bulging brown orbs
for(const ex of [-2,2]){
  block(ex,20,5,ROBE);
  block(ex,20,4,ROBE);
  block(ex+ (ex<0?0:0),19,5,DARK);
}
block(-2,19,5,DARK); block(2,19,5,DARK);
// nose (small snout)
block(0,19,5,GREEN); block(0,18,4,GREEN);
// mouth (thin downturned line)
line(-1,17,4,1,17,4,ROBE);
block(-2,17,3,ROBE); block(2,17,3,ROBE);

// ---- Ears: large, pointed, swept up-and-out ----
for(const sx of [-1,1]){
  for(let i=0;i<=6;i++){
    const x=sx*(4+i);
    const bottom=Math.round(16 + i*1.0);
    const top=Math.round(21 + i*0.35);
    const zt=i<4?1:0;
    for(let y=bottom;y<=top;y++){
      for(let z=-zt;z<=zt;z++) block(x,y,z,GREEN);
    }
  }
}

// ---- White wispy hair on sides / back of head ----
for(const sx of [-1,1]){
  block(sx*3,22,-2,HAIR); block(sx*2,23,-2,HAIR); block(sx*3,21,-3,HAIR);
}
block(0,23,-2,HAIR); block(-1,23,-1,HAIR); block(1,23,-1,HAIR);

// ---- Arms ----
function limb(x1,y1,z1,x2,y2,z2,id){
  const steps=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1));
  for(let s=0;s<=steps;s++){
    const t=s/steps;
    const x=Math.round(x1+(x2-x1)*t);
    const y=Math.round(y1+(y2-y1)*t);
    const z=Math.round(z1+(z2-z1)*t);
    cube(x,y,z,x+1,y,z+1,id);
  }
}
// right arm raised, sleeve then green hand
limb(3,15,-1,5,17,2,ROBE);
sphere(6,17,2,1,GREEN);
// left arm resting forward on cane
limb(-3,14,0,-5,10,4,ROBE);
sphere(-6,10,4,1,GREEN);

// ---- Lightsaber (right hand) ----
cylinder(6,17,2,1,3,HILT);        // hilt
block(6,19,3,COBBLE);             // emitter
for(let y=20;y<=31;y++){ block(6,y,2,GREEN); block(7,y,2,GREEN); } // green blade

// ---- Gimer stick / cane (left hand to ground) ----
limb(-6,11,4,-7,0,6,OAK_LOG);
block(-7,11,5,ROBE); // gnarled top knob

// ---- Little green toes peeking from robe hem ----
cube(-3,0,6,-1,1,7,GREEN);
cube(1,0,6,3,1,7,GREEN);

// ================= SCENE / BACKGROUND (Dagobah swamp) =================
// gnarled leaning tree behind
limb(-9,0,-7,-11,10,-9,OAK_LOG);
limb(-11,10,-9,-13,13,-8,OAK_LOG);
sphere(-13,14,-8,3,LEAVES);
sphere(-10,10,-8,2,LEAVES);
line(-13,11,-8,-13,6,-8,LEAVES); // hanging vine
line(-9,7,-9,-9,4,-9,LEAVES);
// a second smaller stump foreground-right
limb(10,0,7,11,4,8,OAK_LOG);
sphere(11,5,8,2,LEAVES);

// mossy swamp rocks
sphere(8,0,8,2,COBBLE);
sphere(-7,0,9,1,STONE);
sphere(9,-1,4,2,STONE);
sphere(-9,0,5,1,COBBLE);
// scattered grass tufts
for(const p of [[5,0,9],[-4,0,10],[7,0,6],[-8,0,7],[3,0,10],[-2,0,11]]) block(p[0],p[1],p[2],GRASS);