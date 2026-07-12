// cobra-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
function lerp(a,b,t){ return a+(b-a)*t; }
function cr(p0,p1,p2,p3,t){
  const t2=t*t, t3=t2*t;
  return 0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);
}
function sampleCurve(points, steps){
  const out=[]; const n=points.length; const segs=n-1;
  for(let s=0;s<=steps;s++){
    const tt=s/steps; const st=tt*segs;
    let i=Math.floor(st); if(i>=segs) i=segs-1;
    const lt=st-i;
    const p0=points[Math.max(i-1,0)], p1=points[i], p2=points[i+1], p3=points[Math.min(i+2,n-1)];
    out.push([
      cr(p0[0],p1[0],p2[0],p3[0],lt),
      cr(p0[1],p1[1],p2[1],p3[1],lt),
      cr(p0[2],p1[2],p2[2],p3[2],lt),
      lerp(p1[3],p2[3],lt)
    ]);
  }
  return out;
}
function R(v){ return Math.round(v); }

// ---- SPINE: tail (south, coiled on ground) -> rises -> neck/hood junction ----
const spine = [
  [9,-1,20,0.6],
  [10,-1,17,1.3],
  [9,-1,13,2.0],
  [6,-1,9,2.5],
  [2,-1,8,2.8],
  [-1,-1,11,2.9],
  [-1,0,15,2.7],
  [2,0,17,2.4],
  [5,1,15,2.2],
  [6,1,11,2.1],
  [4,2,8,2.0],
  [2,3,7,1.9],
  [1,5,4,1.9],
  [0,7,1,1.9],
  [-1,9,-3,1.9],
  [-1,11,-6,1.9],
  [-1,13,-9,2.0],
  [0,13.5,-11,2.0]
];
const headUpper = [
  [0,13.5,-11,2.0],
  [0.5,12.6,-13,1.7],
  [1,11.8,-15,1.3],
  [1.4,11.3,-16.5,0.8]
];
const headLower = [
  [0,12.7,-11,1.6],
  [0.6,11.0,-13,1.2],
  [1.1,9.7,-15,0.9],
  [1.4,9.2,-16.3,0.55]
];
function hoodPts(side){
  const pts=[]; const steps=26;
  for(let i=0;i<=steps;i++){
    const a=i/steps;
    const angle=a*Math.PI*0.85;
    const spread=7.5;
    const hx=side*(0.8+spread*Math.sin(angle));
    const hy=13.5+2.0*Math.cos(angle)-a*3.4;
    const hz=-10.8 - a*1.3;
    const rad=lerp(2.0,0.4,a);
    pts.push([hx,hy,hz,rad,a]);
  }
  return pts;
}
const bodyPts = sampleCurve(spine, 150);
const upperPts = sampleCurve(headUpper, 40);
const lowerPts = sampleCurve(headLower, 40);
const hoodL = hoodPts(-1);
const hoodR = hoodPts(1);

// ---- PHASE 1: carve corridor through terrain/trees along the whole snake ----
[bodyPts, upperPts, lowerPts, hoodL, hoodR].forEach(list=>{
  list.forEach(p=>{
    const [x,y,z,r]=p;
    sphere(R(x),R(y),R(z), Math.ceil(r)+1, AIR);
  });
});

// ---- PHASE 2: main coiled body + rising neck ----
bodyPts.forEach((p,idx)=>{
  const [x,y,z,r]=p;
  const t=idx/bodyPts.length;
  const dark = Math.floor(t*45)%5===0;
  const top = dark?DIRT:OAK_LOG;
  sphere(R(x),R(y),R(z), Math.max(1,R(r)), top);
  sphere(R(x),R(y-r*0.55),R(z), Math.max(1,R(r*0.55)), SAND);
});

// occasional cream chevron highlight bands along the spine top
for(let i=10;i<bodyPts.length-10;i+=14){
  const [x,y,z,r]=bodyPts[i];
  sphere(R(x),R(y+r*0.3),R(z), Math.max(1,R(r*0.35)), SAND);
}

// ---- PHASE 3: head ----
upperPts.forEach(p=>{
  const [x,y,z,r]=p;
  sphere(R(x),R(y),R(z), Math.max(1,R(r)), DIRT);
});
lowerPts.forEach(p=>{
  const [x,y,z,r]=p;
  sphere(R(x),R(y),R(z), Math.max(1,R(r*0.9)), SAND);
});

// ---- PHASE 4: hood, flared to both sides behind the head ----
[hoodL,hoodR].forEach(list=>{
  list.forEach(p=>{
    const [x,y,z,r,a]=p;
    const color = a<0.65?OAK_LOG:DIRT;
    sphere(R(x),R(y),R(z), Math.max(1,R(r)), color);
    sphere(R(x),R(y-r*0.4),R(z), Math.max(1,R(r*0.5)), SAND);
  });
});

// ---- PHASE 5: fine details ----
// eyes
sphere(-1,13,-12,1,STONE);
sphere(1,13,-12,1,STONE);
// fangs
line(-1,11,-16,-1,9,-16,SNOW);
line(1,11,-16,1,9,-16,SNOW);
block(-1,10,-16,SNOW);
block(1,10,-16,SNOW);
// forked tongue
line(0,10,-16,-1,9,-19,BRICK);
line(0,10,-16,2,9,-19,BRICK);
line(0,10.5,-14,0,10,-16,BRICK);

// ---- foreground: rocks around the base of the coil ----
cube(-5,-2,20,-2,-1,22,STONE);
cube(11,-2,10,13,-1,12,COBBLE);
cube(-4,-2,6,-2,-1,7,STONE);
sphere(-4,-1,21,1,COBBLE);
sphere(12,-1,17,1,STONE);
```
