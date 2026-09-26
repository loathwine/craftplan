// pikachu-fx-opus — prompt:
// Pikachu...

cube(-10,0,-6, 17,33,10, AIR);

// ---- helpers ----
function ellipsoid(cx,cy,cz,rx,ry,rz,id){
  for(let x=-rx;x<=rx;x++)
   for(let y=-ry;y<=ry;y++)
    for(let z=-rz;z<=rz;z++){
      const d=(x*x)/(rx*rx)+(y*y)/(ry*ry)+(z*z)/(rz*rz);
      if(d<=1.0) block(cx+x,cy+y,cz+z,id);
    }
}
const HX=0,HY=16,HZ=3,HRX=7,HRY=6,HRZ=6;
function putFront(x,y,id){
  const t=1-((x-HX)*(x-HX))/(HRX*HRX)-((y-HY)*(y-HY))/(HRY*HRY);
  if(t<=0) return;
  const zf=HZ-HRZ*Math.sqrt(t);
  const z=Math.round(zf);
  block(x,y,z,id); block(x,y,z+1,id);
}
function stampCircle(cx0,cy0,r,id){
  for(let dx=-r;dx<=r;dx++)
   for(let dy=-r;dy<=r;dy++){
     if(dx*dx+dy*dy>r*r+0.3) continue;
     putFront(cx0+dx,cy0+dy,id);
   }
}
function buildEar(sign){
  const steps=16;
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    const cx=Math.round(sign*(4+4*t));
    const cy=Math.round(21+9*t);
    const cz=Math.round(3+2*t);
    const r=Math.max(1,2.7-1.8*t);
    const id=t>0.58?BLACK:YELLOW;
    sphere(cx,cy,cz,r,id);
  }
}
function tailSeg(x1,y1,x2,y2,id){ cube(x1,y1,5, x2,y2,7, id); }

// ---- body ----
ellipsoid(0,7,3, 5,6,5, YELLOW);       // torso / lower body
ellipsoid(0,8,3, 4,5,4, YELLOW);       // fill

// feet
sphere(-3,1,-1,2,YELLOW);
sphere(3,1,-1,2,YELLOW);
sphere(-4,1,-2,1,YELLOW);
sphere(4,1,-2,1,YELLOW);

// arms
sphere(-5,7,1,2,YELLOW);
sphere(5,7,1,2,YELLOW);

// ---- head ----
ellipsoid(HX,HY,HZ,HRX,HRY,HRZ, YELLOW);

// ears
buildEar(-1);
buildEar(1);

// ---- face features (front, -Z) ----
// red cheeks
stampCircle(-5,13,2,RED);
stampCircle(5,13,2,RED);
// eyes (black) with white shine
stampCircle(-3,18,2,BLACK);
stampCircle(3,18,2,BLACK);
putFront(-4,19,WHITE); putFront(-3,20,WHITE);
putFront(4,19,WHITE);  putFront(3,20,WHITE);
// nose
putFront(0,16,BLACK);
// mouth (small smile)
putFront(0,14,BLACK);
putFront(-1,14,BLACK); putFront(1,14,BLACK);
putFront(-2,15,BLACK); putFront(2,15,BLACK);

// ---- lightning-bolt tail (east, +X) ----
tailSeg(4,4,7,7,BROWN);      // brown base
tailSeg(5,7,8,11,YELLOW);    // lower vertical
tailSeg(8,9,12,12,YELLOW);   // step right
tailSeg(10,12,13,17,YELLOW); // upper vertical
tailSeg(6,16,13,19,YELLOW);  // top jag
tailSeg(6,19,10,24,YELLOW);  // top spike
// tail black bottom edge accent
tailSeg(4,4,7,4,BLACK);

// ---- electric sparks (sparse) ----
block(-6,13,-6,ELECTRIC);
block(6,13,-6,ELECTRIC);
block(9,25,6,ELECTRIC);
block(-7,30,4,ELECTRIC);
block(7,30,4,ELECTRIC);