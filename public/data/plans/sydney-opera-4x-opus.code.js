// sydney-opera-4x-opus — prompt:
// the Sydney Opera House...

const _ = "sydney-opera-house";

// ---- helpers -------------------------------------------------------------
function clamp(v,lo,hi){ return Math.max(lo,Math.min(hi,v)); }

// A curved "sail" shell: ribs across X, each rib a quarter-arc that rises
// and leans toward the viewer (north, -Z). Center ribs tall -> pointed shell.
function shell(cx, baseY, zBase, halfW, peak, sweep, dirZ, mat, ridgeMat){
  for(let i=-halfW; i<=halfW; i++){
    const frac = 1 - Math.abs(i)/(halfW+0.0001);
    if(frac<=0.02) continue;
    const rh = peak * Math.pow(frac,0.62);
    const rd = sweep * Math.pow(frac,0.5);
    const steps = Math.max(6, Math.round((rh+rd)*2)+4);
    let px=null,py=null,pz=null;
    const x = cx+i;
    for(let s=0;s<=steps;s++){
      const th = (s/steps)*(Math.PI/2);
      const y = Math.round(baseY + rh*Math.sin(th));
      const z = Math.round(zBase + dirZ*rd*(1-Math.cos(th)));
      const m = (i===0 && ridgeMat) ? ridgeMat : mat;
      if(px===null){ block(x,y,z,m); }
      else { line(px,py,pz,x,y,z,m); }
      px=x; py=y; pz=z;
    }
  }
}

// A cluster of nested overlapping shells = one concert hall
function hall(cx, baseY){
  shell(cx, baseY, 13, 8, 17, 10, -1, SNOW, COBBLE);
  shell(cx, baseY, 11, 7, 14,  8, -1, SNOW, COBBLE);
  shell(cx, baseY,  9, 6, 11,  7, -1, SNOW, COBBLE);
  shell(cx, baseY,  7, 5,  8,  6, -1, SNOW, COBBLE);
  // small opposing "mouth" shells at the front, leaning south
  shell(cx, baseY, 3, 4, 7, 4, 1, SNOW, COBBLE);
  shell(cx, baseY, 4, 3, 5, 3, 1, SNOW, COBBLE);
}

// ---- clear the forest that occupies the site -----------------------------
cube(-20, 1, -6, 20, 33, 20, AIR);

// ---- harbour water around the podium -------------------------------------
cube(-20, -1, -6, 20, 1, 20, GLASS);   // blue water plane

// ---- podium (granite platform) -------------------------------------------
cube(-17, -1, -3, 17, 2, 17, STONE);   // solid mass down into the water
cube(-17,  2, -3, 17, 2, 17, COBBLE);  // deck top surface
// upper stepped terrace the shells stand on
cube(-15, 3, 5, 15, 3, 16, COBBLE);
cube(-14, 4, 6, 14, 4, 15, COBBLE);

// ---- grand ceremonial stair on the north front ---------------------------
for(let s=0;s<6;s++){
  const y = 2 - s;
  const z = -3 - s;
  cube(-14, y, z, 14, y, z, COBBLE);
}

// ---- glass podium facade under the shells (the famous window walls) -------
cube(-15, 3, 4, 15, 8, 4, GLASS);      // north-facing glass wall
for(let x=-15;x<=15;x+=3){             // stone mullions
  cube(x, 3, 4, x, 8, 4, STONE);
}

// ---- the sail shells: three halls of decreasing size ---------------------
hall(-7, 4);    // main concert hall (largest cluster)
hall( 6, 4);    // opera theatre (second cluster)

// smaller restaurant shells to the east
shell(13, 4, 12, 4, 9, 6, -1, SNOW, COBBLE);
shell(13, 4, 10, 3, 7, 5, -1, SNOW, COBBLE);
shell(13, 4,  6, 3, 5, 3,  1, SNOW, COBBLE);

// tiny shell far west for asymmetry
shell(-15, 4, 11, 3, 7, 5, -1, SNOW, COBBLE);
shell(-15, 4,  8, 2, 5, 4, -1, SNOW, COBBLE);

// ---- promenade detail: railing + lamp posts around the deck --------------
for(let x=-16;x<=16;x++){
  block(x, 3, -3, COBBLE);            // north edge railing
  block(x, 3, 17, COBBLE);           // south edge railing
}
for(let z=-3;z<=17;z++){
  block(-17, 3, z, COBBLE);
  block( 17, 3, z, COBBLE);
}
for(let x=-14;x<=14;x+=7){           // lamp posts along the front steps
  cube(x, 3, -4, x, 5, -4, OAK_LOG);
  block(x, 6, -4, GLASS);
}

// ---- a couple of sailboats on the harbour for foreground life ------------
function boat(bx,bz){
  cube(bx-1, 1, bz, bx+1, 1, bz+3, OAK_LOG);   // hull
  cube(bx,   2, bz+1, bx, 6, bz+1, OAK_LOG);    // mast
  line(bx, 6, bz+1, bx, 3, bz+3, SNOW);         // sail edge
  cube(bx, 3, bz+1, bx, 5, bz+2, SNOW);         // sail
}
boat(-11, -6);
boat(  9, -5);