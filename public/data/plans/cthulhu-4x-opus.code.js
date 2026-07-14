// cthulhu-4x-opus — prompt:
// Cthulhu...

// ===== CTHULHU — the Great Old One, rising =====
// Front (face + tentacle-beard) points NORTH (-Z). Wings sweep back (+Z) & up.
// Green rubbery skin = LEAVES, stony wing membrane = STONE, bone/claws = COBBLE.

const SKIN = LEAVES;

// ---- helpers ----
function limb(joints, r, id){
  for(let j=0;j<joints.length-1;j++){
    const a=joints[j], b=joints[j+1];
    const steps=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]),Math.abs(b[2]-a[2]),1);
    for(let i=0;i<=steps;i++){
      const t=i/steps;
      const x=a[0]+(b[0]-a[0])*t;
      const y=a[1]+(b[1]-a[1])*t;
      const z=a[2]+(b[2]-a[2])*t;
      const rr=Array.isArray(r)? r[j]+(r[j+1]-r[j])*t : r;
      sphere(Math.round(x),Math.round(y),Math.round(z),Math.max(1,Math.round(rr)),id);
    }
  }
}

function tentacle(ax,ay,az,sway,curl,length,r0,sucker){
  for(let i=0;i<=length;i++){
    const t=i/length;
    const x=ax + sway*Math.sin(t*Math.PI*0.55);
    const y=Math.round(ay - t*length);
    const z=Math.round(az - curl*Math.sin(t*Math.PI*0.7) - t*2);
    const r=Math.max(1,Math.round(r0*(1-t*0.6)));
    sphere(Math.round(x),y,z,r,SKIN);
    if(sucker && i%3===0 && t>0.15) block(Math.round(x),y,z-r,COBBLE); // pale suckers on front
  }
}

// ---- ground: sunken stone altar + rubble ring ----
disk(0,-1,1,9,STONE);
disk(0,-2,1,7,STONE);
for(let a=0;a<360;a+=18){
  const rx=Math.round(10*Math.cos(a*Math.PI/180));
  const rz=Math.round(1+10*Math.sin(a*Math.PI/180));
  block(rx,0,rz,COBBLE); block(rx,-1,rz,COBBLE);
}

// framing monoliths (foreground, flanking the shot)
function monolith(x,z,h){
  cube(x-1,0,z-1,x+1,h,z+1,COBBLE);
  cube(x-1,h,z-1,x+1,h,z+1,STONE);
  block(x,Math.floor(h/2),z-2,BRICK);   // glowing rune
  block(x,Math.floor(h/2)+2,z-2,BRICK);
}
monolith(-14,-13,6);
monolith(14,-13,6);

// ---- LEGS (hunched, clawed) ----
for(const sx of [-5,5]){
  limb([[sx,0,1],[sx,5,0],[sx,9,1]],[3,3,3],SKIN); // thigh->shin
  sphere(sx,9,1,3,SKIN);                            // hip
  sphere(sx,5,0,3,SKIN);                            // knee
  cube(sx-2,0,-4,sx+2,1,1,SKIN);                    // foot forward
  for(const tx of [-2,0,2]){                        // toe claws
    line(sx+tx,1,-4,sx+tx,0,-6,COBBLE);
    block(sx+tx,0,-7,COBBLE);
  }
}

// ---- TORSO (bulging, organic) ----
sphere(0,11,-1,5,SKIN);
sphere(0,14,-1,6,SKIN);
sphere(0,17,0,5,SKIN);
sphere(0,19,1,4,SKIN);        // neck base
sphere(0,12,-4,4,SKIN);       // belly bulge forward
// pectorals
sphere(-3,17,-4,2,SKIN);
sphere(3,17,-4,2,SKIN);
// scaly belly ridges
for(let y=10;y<=15;y+=2) line(-3,y,-5,3,y,-5,COBBLE);
// stubby tail behind
limb([[0,10,4],[0,7,7],[0,6,9]],[3,2,1],SKIN);

// ---- SHOULDERS ----
sphere(-7,18,1,4,SKIN);
sphere(7,18,1,4,SKIN);

// ---- ARMS (bent, claws reaching down-forward) ----
function arm(side){
  const sx=side*7;
  limb([[sx,18,0],[side*11,13,-2],[side*9,9,-4],[side*8,7,-5]],[3,2,2,2],SKIN);
  sphere(side*11,13,-2,2,SKIN); // elbow
  const hx=side*8, hy=7, hz=-5; // hand
  sphere(hx,hy,hz,2,SKIN);
  for(const d of [-2,0,2]){     // finger claws
    line(hx+d*side*0.5,hy,hz, hx+d,hy-2,hz-3,COBBLE);
    block(hx+d,hy-3,hz-4,COBBLE);
  }
}
arm(-1); arm(1);

// ---- HEAD (octopoid dome) ----
sphere(0,23,0,5,SKIN);        // cranium
sphere(0,21,-2,4,SKIN);       // face mass
sphere(0,20,-4,3,SKIN);       // muzzle/beak base
// brow ridge
cube(-4,24,-5,4,24,-4,COBBLE);
sphere(-4,25,-3,1,SKIN); sphere(4,25,-3,1,SKIN); // brow bumps
// EYES — glowing red, sunken
sphere(-2,24,-5,1,BRICK);
sphere(2,24,-5,1,BRICK);
block(-2,24,-6,BRICK); block(2,24,-6,BRICK);
block(-2,25,-5,SNOW);  block(2,25,-5,SNOW);      // hard glint
// beak/mouth slit
line(-2,20,-6,2,20,-6,COBBLE);

// horns curving back
limb([[-4,26,0],[-6,29,2],[-7,31,5]],[2,1,1],STONE);
limb([[4,26,0],[6,29,2],[7,31,5]],[2,1,1],STONE);
// side head-tendrils
limb([[-5,22,0],[-8,20,2],[-9,17,4]],[2,1,1],SKIN);
limb([[5,22,0],[8,20,2],[9,17,4]],[2,1,1],SKIN);

// ---- FACE TENTACLE BEARD (the signature) ----
const tents=[
  [-4,22,-3,-4,2,14,2,false],
  [-2.5,22,-4,-2,3,15,2,true],
  [-1,21,-5,0,4,16,2,true],
  [1,21,-5,0,4,16,2,true],
  [2.5,22,-4,2,3,15,2,true],
  [4,22,-3,4,2,14,2,false],
  [-5,21,-2,-6,1,17,2,false],  // long outer feelers
  [5,21,-2,6,1,17,2,false],
];
for(const t of tents) tentacle(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7]);

// ---- WINGS (vast, bat/dragon, swept back & up) ----
function wing(side){
  const x0=6,x1=21;
  // leading arm-bone
  limb([[side*8,19,2],[side*14,26,5],[side*21,30,9]],[2,2,1],COBBLE);
  // membrane
  for(let ax=x0;ax<=x1;ax++){
    const t=(ax-x0)/(x1-x0);
    const yTop=Math.round(19 + t*11);
    const yBot=Math.round(13 + t*9 - 3*Math.abs(Math.sin(t*Math.PI*3))); // scalloped trailing edge
    const z=Math.round(4 + t*5);
    const X=side*ax;
    for(let y=yBot;y<=yTop;y++) block(X,y,z,STONE);
  }
  // finger struts + wingtip claws
  for(const fx of [9,13,17,21]){
    const t=(fx-x0)/(x1-x0);
    const yTop=Math.round(19+t*11);
    const yBot=Math.round(13+t*9-3*Math.abs(Math.sin(t*Math.PI*3)));
    const z=Math.round(4+t*5);
    for(let y=yBot;y<=yTop;y++) block(side*fx,y,z,COBBLE);
    block(side*fx,yBot-1,z,COBBLE);
    block(side*fx,yTop+1,z,COBBLE); // upper claw
  }
}
wing(-1); wing(1);