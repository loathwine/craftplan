// kirby-4x-opus — prompt:
// Kirby...

const BRICK=10, GLASS=11, SNOW=12, ICE=13, SAND=6, AIR=0;

// ---------- helpers ----------
function ellipsoid(cx,cy,cz,rx,ry,rz,id){
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)
  for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    const dx=(x-cx)/rx, dy=(y-cy)/ry, dz=(z-cz)/rz;
    if(dx*dx+dy*dy+dz*dz<=1.0) block(x,y,z,id);
  }
}
function pointInPoly(px,py,vs){
  let inside=false;
  for(let i=0,j=vs.length-1;i<vs.length;j=i++){
    const xi=vs[i][0],yi=vs[i][1],xj=vs[j][0],yj=vs[j][1];
    if(((yi>py)!=(yj>py)) && (px<(xj-xi)*(py-yi)/(yj-yi)+xi)) inside=!inside;
  }
  return inside;
}
function star5(cx,cy,cz,R,r,thick,id){
  const v=[];
  for(let i=0;i<10;i++){
    const a=Math.PI/2 - i*(Math.PI/5);
    const rad=(i%2==0)?R:r;
    v.push([cx+rad*Math.cos(a), cy+rad*Math.sin(a)]);
  }
  for(let x=Math.floor(cx-R);x<=Math.ceil(cx+R);x++)
  for(let y=Math.floor(cy-R);y<=Math.ceil(cy+R);y++)
    if(pointInPoly(x+0.001,y+0.001,v))
      for(let z=cz;z<cz+thick;z++) block(x,y,z,id);
}
function sparkle(cx,cy,cz,s,id){
  for(let i=-s;i<=s;i++){ block(cx+i,cy,cz,id); block(cx,cy+i,cz,id); }
  block(cx+1,cy+1,cz,id); block(cx-1,cy-1,cz,id);
  block(cx+1,cy-1,cz,id); block(cx-1,cy+1,cz,id);
}

// ---------- clear the enveloping forest canopy ----------
cube(-14,0,-13, 15,22,15, AIR);        // around the subject
cube(-14,0,-22, 15,15,-14, AIR);       // open the northern view corridor to camera

// ---------- KIRBY ----------
const BCX=1, BCY=10, BCZ=4, BR=9;      // body center + radius; front faces NORTH (-Z)

// feet — two red oval slippers splayed forward at the bottom front
ellipsoid(-5, 1, -2, 3.6, 2.1, 4.2, BRICK);   // left foot
ellipsoid( 7, 1, -2, 3.6, 2.1, 4.2, BRICK);   // right foot

// arms — little mitts, waving pose (right up, left down = asymmetry)
ellipsoid(-7, 8, 3, 3.0, 3.0, 3.0, BRICK);    // left arm (down)
ellipsoid( 9,14, 2, 3.0, 3.0, 3.0, BRICK);    // right arm (raised)

// main round body
sphere(BCX, BCY, BCZ, BR, BRICK);

// front-surface z for a given (x,y) on the body sphere
function frontZ(x,y){
  const rr = BR*BR - (x-BCX)*(x-BCX) - (y-BCY)*(y-BCY);
  return rr>0 ? BCZ - Math.sqrt(rr) : null;
}

// eyes — tall ovals: white shine on top, navy middle, blue bottom
function eye(ecx){
  for(let x=ecx-2;x<=ecx+2;x++)
  for(let y=10;y<=16;y++){
    const ex=(x-ecx)/1.5, ey=(y-13)/2.7;
    if(ex*ex+ey*ey<=1.0){
      const zf=frontZ(x,y);
      if(zf!==null){
        let col=GLASS;
        if(y>=15) col=SNOW;        // sparkle highlight
        else if(y<=11) col=ICE;    // bright blue lower tint
        const zi=Math.round(zf);
        block(x,y,zi,col);
        block(x,y,zi-1,col);       // proud so it reads from the north
      }
    }
  }
}
eye(-2);
eye(4);

// mouth — small open oval carved in; AO shading reads as a dark opening
for(let x=-1;x<=3;x++)
for(let y=7;y<=9;y++){
  const mx=(x-1)/2.4, my=(y-8)/1.5;
  if(mx*mx+my*my<=1.0){
    const zf=frontZ(x,y);
    if(zf!==null){
      const zi=Math.round(zf);
      for(let z=zi-1;z<=zi+2;z++) block(x,y,z,AIR);
    }
  }
}

// ---------- Warp Star (yellow) beside him, foreground-left ----------
star5(-14, 6, -7, 5.0, 2.1, 2, SAND);

// ---------- little sparkles for depth ----------
sparkle(13,18,11, 2, SAND);   // background
sparkle(-11,19,9, 1, SAND);   // background
sparkle(7,21,-3, 1, SAND);    // foreground top
sparkle(14,7,-5, 2, SAND);    // foreground right