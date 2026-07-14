// basilisk-4x-opus — prompt:
// a basilisk...

const meta = null; // (ignored — this is a build script)

// ---------- helpers ----------
function R(v){ return Math.round(v); }

// thick body: walk a path, lay overlapping spheres, per-segment color + radius
function tube(P, RAD, COL){
  for(let i=0;i<P.length-1;i++){
    const a=P[i], b=P[i+1];
    const ra=RAD[i], rb=RAD[i+1];
    const dx=b[0]-a[0], dy=b[1]-a[1], dz=b[2]-a[2];
    const d=Math.hypot(dx,dy,dz);
    const steps=Math.max(1,Math.ceil(d*1.5));
    for(let s=0;s<=steps;s++){
      const t=s/steps;
      sphere(R(a[0]+dx*t), R(a[1]+dy*t), R(a[2]+dz*t), ra+(rb-ra)*t, COL[i]);
    }
  }
}
function spike(x,y,z,h,id){ for(let k=0;k<h;k++) block(R(x),R(y+k),R(z),id); }

// ---------- serpent path (tail -> neck) ----------
const P=[], RAD=[], COL=[];
const N=54;
for(let i=0;i<=N;i++){
  const t=i/N;
  const theta=t*2.0*2*Math.PI;      // two coils
  const rad=13-9*t;                 // spiral inward
  const x=Math.cos(theta)*rad;
  const z=6+Math.sin(theta)*rad;    // coil centered at z=6
  const y=2+3*t;                    // rise slightly toward center
  let br;
  if(t<0.35) br=1.3+(2.9-1.3)*(t/0.35);       // taper up from thin tail
  else       br=2.9-(2.9-2.4)*((t-0.35)/0.65); // ease down toward neck
  P.push([x,y,z]); RAD.push(br);
  COL.push((Math.floor(t*10)%3===0)?COBBLE:LEAVES); // dark saddle bands
}
// neck: rise up and curve forward to the reared head (front = -Z)
const neck=[[5,5,6,2.5],[3.5,7,4,2.5],[2,10,1,2.4],[1.2,13,-3,2.3],[1,16,-6,2.2],[1,18,-9,2.2]];
for(const q of neck){ P.push([q[0],q[1],q[2]]); RAD.push(q[3]); COL.push(LEAVES); }

tube(P, RAD, COL);

// ---------- dorsal crest spines (cobble) ----------
for(let i=6;i<P.length;i+=2){
  const p=P[i], r=RAD[i];
  spike(p[0], p[1]+r-0.5, p[2], (p[1]>9?3:2), COBBLE);
}

// ---------- head (reared, facing -Z, turned slightly +X for light) ----------
// upper skull + snout
sphere(1,18,-8,4,LEAVES);
sphere(1.3,17.5,-11,3,LEAVES);
sphere(1.6,17,-13,2.3,LEAVES);
sphere(1.8,16.7,-15,1.6,LEAVES);
// throat / connect to neck
sphere(1,15.5,-6,2.6,LEAVES);
// lower jaw (juts forward -> gaping mouth)
sphere(1,15,-9,2.5,LEAVES);
sphere(1.3,14.7,-12,2.1,LEAVES);
sphere(1.6,14.6,-14,1.7,LEAVES);
sphere(1.8,14.6,-16,1.2,LEAVES);

// crown of horns
spike(1,22,-8,3,STONE);
spike(-1,21.5,-7,3,STONE);
spike(3,21.5,-7,3,STONE);
spike(-2.5,20.5,-6,2,STONE);
spike(4.5,20.5,-6,2,STONE);
// large back-swept horns (cobble)
line(-2,20,-6,-5,24,1,COBBLE);  line(-2,20,-7,-5,23,0,COBBLE);
line(4,20,-6,7,24,1,COBBLE);    line(4,20,-7,7,23,0,COBBLE);

// brow ridges (stone)
line(-2.5,20,-9,0,20.5,-10,STONE);
line(2.5,20.5,-10,4.5,20,-9,STONE);

// deadly eyes (glowing red) with stone pupils
sphere(-1.2,19,-10.7,1,BRICK);
sphere(3.2,19,-10.7,1,BRICK);
block(-1,19,-11.7,STONE);
block(3,19,-11.7,STONE);

// nostrils
block(0,17.6,-15,AIR);
block(3,17.6,-15,AIR);

// mouth lining + forked tongue (brick)
sphere(1.4,15.3,-12,1.2,BRICK);
block(1,15,-13,BRICK);
line(1.6,15,-16,2,14,-20,BRICK);
line(2,14,-20,1,13,-21,BRICK);
line(2,14,-20,3,13,-21,BRICK);

// fangs (snow)
line(0.3,16,-14,0.3,13.5,-14,SNOW);
line(3,16,-14,3,13.5,-14,SNOW);

// ---------- petrified victim (turned to stone by the gaze) ----------
const sx=-11;
cube(sx,0,-14,sx,3,-13,STONE);       // leg
cube(sx+2,0,-14,sx+2,3,-13,STONE);   // leg
cube(sx,4,-14,sx+2,6,-13,STONE);     // torso
line(sx,6,-13,sx-1,9,-13,STONE);     // arm raised
line(sx+2,6,-13,sx+3,9,-13,STONE);   // arm raised
sphere(sx+1,8,-13,1,STONE);          // head
block(sx+1,5,-13,COBBLE);            // crack

// ---------- scattered ground detail ----------
sphere(-15,0,3,2,STONE);
sphere(15,0,-3,2,COBBLE);
sphere(11,0,15,2,STONE);
sphere(-17,0,12,1,COBBLE);
// bones (a previous victim)
line(6,0,-11,9,0,-10,SNOW);
block(7,1,-11,SNOW);
block(8,0,-9,SNOW);
line(-6,0,17,-3,0,18,SNOW);