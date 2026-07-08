// ender-dragon-4x-opus — prompt:
// the Ender Dragon...

block(0,0,0,AIR); // no-op anchor

// ===== The Ender Dragon =====
// Black segmented body (STONE/COBBLE), glowing GLASS eyes,
// huge bat-wings with GLASS membranes. Head faces NORTH (-Z).

function lerp(a,b,t){ return a+(b-a)*t; }

// ---- spinal ridge fin (leans back toward +Z) ----
function fin(x,y,z){
  block(x,y,z,COBBLE);
  block(x,y+1,z,COBBLE);
  block(x,y+1,z+1,COBBLE);
}

// ---- one hanging leg with clawed foot (claws point north) ----
function leg(x,z){
  cube(x-1,12,z-1, x+1,15,z+1, STONE);     // thigh (attached to body side)
  const fz=z-1;
  cube(x-1,8,fz-1, x+1,12,fz+1, STONE);    // shin, swung slightly forward
  cube(x-1,7,fz-2, x+1,8,fz+1, STONE);     // foot
  block(x-1,7,fz-3,COBBLE);                // claws
  block(x,  7,fz-3,COBBLE);
  block(x+1,7,fz-3,COBBLE);
  block(x-2,8,fz,  STONE);                  // ankle spur
  block(x+2,8,fz,  STONE);
}

// ---- one bat-wing. sign=-1 west(-X), +1 east(+X) ----
function wing(sign){
  const sx=3*sign, sy=22, sz=0;   // shoulder
  const tx=22*sign, ty=27, tz=3;  // wing tip
  const steps=44;
  for(let i=0;i<=steps;i++){
    const u=i/steps;
    const px=Math.round(lerp(sx,tx,u));
    const py=Math.round(lerp(sy,ty,u));
    const pz=Math.round(lerp(sz,tz,u));
    // thick leading-edge arm bone
    block(px,py,pz,STONE);
    block(px,py+1,pz,STONE);
    block(px,py,pz-1,STONE);
    // membrane: hang down (-Y) and sweep back (+Z)
    const chord = Math.round(13*(1-0.55*u))+2;
    for(let c=1;c<=chord;c++){
      const my=py-c;
      const mz=pz+Math.round(c*0.5);
      block(px,my,mz,GLASS);
    }
    // finger ribs + trailing claw every few steps
    if(i%9===0){
      const my=py-chord;
      const mz=pz+Math.round(chord*0.5);
      line(px,py,pz, px,my,mz, COBBLE);
      block(px,my-1,mz+1,COBBLE); // claw at rib tip
    }
  }
  // prominent wing-finger claw at the very tip
  block(tx,ty,tz,COBBLE);
  block(tx,ty+1,tz,COBBLE);
  block(tx,ty,tz-1,COBBLE);
}

// ================= BODY =================
cube(-3,15,-2, 3,21,10, STONE);            // torso
// round the shoulders / hips a touch
block(-3,21,-2,AIR); block(3,21,-2,AIR);
block(-3,21,10,AIR); block(3,21,10,AIR);
block(-3,15,-2,AIR); block(3,15,-2,AIR);
block(-3,15,10,AIR); block(3,15,10,AIR);

// belly scutes (COBBLE plating stripes)
for(let z=-1;z<=9;z+=2){ cube(-2,15,z, 2,15,z, COBBLE); }
// flank ribs
for(let z=0;z<=9;z+=3){ block(-3,17,z,COBBLE); block(3,17,z,COBBLE); }

// ================= NECK =================
cube(-1,19,-6, 1,21,-2, STONE);
cube(-1,20,-9, 1,22,-6, STONE);
cube(-1,20,-12,1,22,-9, STONE);
cube(-1,19,-15,1,21,-12,STONE);

// ================= HEAD (faces -Z) =================
cube(-2,16,-19, 2,21,-15, STONE);          // skull
cube(-2,18,-22, 2,20,-19, STONE);          // upper snout
cube(-1,15,-22, 1,16,-18, STONE);          // lower jaw (mouth open, gap at y17)
// glowing eyes (bulge out to the sides)
block(-3,19,-17,GLASS); block(-3,19,-16,GLASS);
block( 3,19,-17,GLASS); block( 3,19,-16,GLASS);
// heavy brow over the eyes
block(-3,20,-17,COBBLE); block(3,20,-17,COBBLE);
block(-2,21,-17,COBBLE); block(2,21,-17,COBBLE);
// swept-back head horns
line(-2,21,-16, -4,24,-12, COBBLE);
line( 2,21,-16,  4,24,-12, COBBLE);
line(-2,21,-15, -3,23,-11, STONE);
line( 2,21,-15,  3,23,-11, STONE);
// teeth
for(let z=-22;z<=-19;z++){ block(-2,17,z,COBBLE); block(2,17,z,COBBLE); }
block(0,16,-22,COBBLE); block(0,16,-21,COBBLE); // lower fangs
// nostril pits
block(-1,20,-22,AIR); block(1,20,-22,AIR);

// ================= TAIL (toward +Z) =================
cube(-2,16,10, 2,20,13, STONE);
cube(-1,16,13, 1,19,16, STONE);
cube(-1,16,16, 1,18,19, STONE);
cube( 0,16,19, 1,17,21, STONE);
// tail-tip spade fin (vertical blade)
cube(0,16,21, 0,20,22, STONE);
block(-1,18,22,COBBLE); block(1,18,22,COBBLE);
block(0,21,22,COBBLE);

// ================= SPINAL RIDGE =================
const ridge=[
  [0,22,-17],[0,22,-15],
  [0,23,-13],[0,23,-10],[0,23,-7],[0,22,-4],
  [0,22,-1],[0,22,1],[0,22,3],[0,22,5],[0,22,7],[0,22,9],
  [0,21,11],[0,20,14],[0,19,17],[0,18,19]
];
for(const [x,y,z] of ridge){ fin(x,y,z); }

// ================= LEGS =================
leg(-3,-1); leg(3,-1);   // front legs
leg(-3, 8); leg(3, 8);   // hind legs

// ================= WINGS =================
wing(-1);  // west wing
wing( 1);  // east wing