// leaning-tower-pisa — prompt:
// The Leaning Tower of Pisa, the famous tilted bell tower. A tall cylindrical tower of SNOW (white marble) and STONE, clearly LEANING to one side (shift each stacked level sideways so it visibly tilts)....

// ============ The Leaning Tower of Pisa ============
// White-marble (SNOW) + STONE campanile, 8 stacked colonnaded levels,
// visibly LEANING in +X (sideways to the -Z viewer), on a green lawn.
const LEAN = 0.22, YMID = 15;
const cX = y => LEAN * (y - YMID);   // leaning centreline X
const cZ = y => 0;

// ---------- leaning helpers (centre follows the lean per Y) ----------
function fillDisk(y, r, id){
  const cx=cX(y), cz=cZ(y), R=Math.ceil(r)+1, ox=Math.round(cx), oz=Math.round(cz);
  for(let X=ox-R;X<=ox+R;X++)for(let Z=oz-R;Z<=oz+R;Z++){
    const a=X-cx,b=Z-cz; if(a*a+b*b<=r*r+0.001) block(X,y,Z,id);
  }
}
function ring(y, rO, rI, id){
  const cx=cX(y), cz=cZ(y), R=Math.ceil(rO)+1, ox=Math.round(cx), oz=Math.round(cz);
  for(let X=ox-R;X<=ox+R;X++)for(let Z=oz-R;Z<=oz+R;Z++){
    const a=X-cx,b=Z-cz,d=a*a+b*b; if(d<=rO*rO+0.001&&d>rI*rI) block(X,y,Z,id);
  }
}
function cols(y, r, n, id){
  const cx=cX(y), cz=cZ(y);
  for(let k=0;k<n;k++){const t=k*2*Math.PI/n;
    block(Math.round(cx+r*Math.cos(t)), y, Math.round(cz+r*Math.sin(t)), id);}
}
// ---------- flat (no-lean) helpers for ground / lawn ----------
function flatDisk(cx,cy,cz,r,id){
  const R=Math.ceil(r)+1;
  for(let X=Math.round(cx)-R;X<=Math.round(cx)+R;X++)for(let Z=Math.round(cz)-R;Z<=Math.round(cz)+R;Z++){
    const a=X-cx,b=Z-cz; if(a*a+b*b<=r*r+0.001) block(X,cy,Z,id);
  }
}
function flatRing(cx,cy,cz,rO,rI,id){
  const R=Math.ceil(rO)+1;
  for(let X=Math.round(cx)-R;X<=Math.round(cx)+R;X++)for(let Z=Math.round(cz)-R;Z<=Math.round(cz)+R;Z++){
    const a=X-cx,b=Z-cz,d=a*a+b*b; if(d<=rO*rO+0.001&&d>rI*rI) block(X,cy,Z,id);
  }
}
function cypress(cx,cz,h){
  for(let y=0;y<=h+2;y++) block(cx,y,cz, y<=2?OAK_LOG:LEAVES);
  for(let y=3;y<=h;y++){ block(cx+1,y,cz,LEAVES);block(cx-1,y,cz,LEAVES);block(cx,y,cz+1,LEAVES);block(cx,y,cz-1,LEAVES); }
}

const BX = Math.round(cX(1));   // base centre X (-3)

// ---------- 1. clear vegetation over the lawn, lay fresh lawn ----------
for(let y=1;y<=9;y++) flatDisk(0,y,0,12,AIR);
flatDisk(0,-1,0,14,DIRT);
flatDisk(0, 0,0,14,GRASS);

// ---------- 2. piazza apron + stepped foundation ----------
flatRing(BX,0,0,7,6,STONE);             // outer step
flatDisk(BX,0,0,6,COBBLE);              // pavement
flatRing(BX,0,0,6,5.1,SNOW);            // marble trim
flatDisk(BX,1,0,4.8,STONE);             // foundation pad
flatRing(BX,1,0,4.8,3.9,COBBLE);        // step lip
for(let k=0;k<24;k++){const t=k*2*Math.PI/24,X=Math.round(BX+8*Math.cos(t)),Z=Math.round(8*Math.sin(t));
  block(X,0,Z,COBBLE); block(X,1,Z,STONE);}   // baluster ring framing the piazza

// ---------- 3. ground floor: solid blind-arcade drum + portal ----------
for(let y=2;y<=5;y++){ fillDisk(y,3.4,SNOW); cols(y,3.4,12,STONE); }
fillDisk(6,3.6,SNOW); ring(6,3.6,3.0,STONE);   // heavy cornice
{ const dx=Math.round(cX(3));                   // arched portal facing the viewer (-Z)
  for(let y=2;y<=4;y++){const w=y<=3?1:0;
    for(let X=dx-w;X<=dx+w;X++)for(let Z=-3;Z<=-1;Z++) block(X,y,Z,AIR);}
}

// ---------- 4. six open colonnaded galleries ----------
for(let g=0; g<6; g++){
  const yA=7+g*3, yB=yA+1, yS=yA+2;
  fillDisk(yA,2.3,SNOW); cols(yA,3.4,10,STONE);
  fillDisk(yB,2.3,SNOW); cols(yB,3.4,10,STONE);
  fillDisk(yS,3.6,SNOW); ring(yS,3.6,3.0,STONE);   // floor slab + projecting cornice
}

// ---------- 5. bell chamber (narrower belfry) ----------
for(let y=25;y<=27;y++){ fillDisk(y,1.6,SNOW); cols(y,2.3,8,STONE); }
fillDisk(28,2.6,SNOW); ring(28,2.6,2.0,STONE);     // belfry cornice
block(Math.round(cX(26)),26,0,COBBLE);             // the bell
block(Math.round(cX(26)),25,0,COBBLE);

// ---------- 6. roof cap + finial ----------
fillDisk(29,2.0,SNOW);
fillDisk(30,1.4,SNOW);
fillDisk(31,0.7,SNOW);
block(Math.round(cX(32)),32,0,COBBLE);

// ---------- 7. approach path, framing bollards, cypress grove ----------
for(let Z=-13;Z<=-4;Z++)for(let dX=-1;dX<=1;dX++) block(BX+dX,0,Z,COBBLE);
[[BX-3,-12],[BX+3,-12]].forEach(([X,Z])=>{ block(X,1,Z,STONE); block(X,2,Z,SNOW); block(X,3,Z,COBBLE); });
cypress(-9,11,7); cypress(9,11,6); cypress(12,4,6);
cypress(-12,4,6); cypress(11,-6,5); cypress(-11,-6,5);