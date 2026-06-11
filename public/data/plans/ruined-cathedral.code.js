// ruined-cathedral — prompt:
// A MASSIVE ruined gothic cathedral, half-collapsed and overgrown. TOWERING central spire still standing against the sky, broken at the top in a jagged silhouette. Long nave with partially collapsed roo...

// ===== GOTHIC CATHEDRAL RUINS =====
function H(x,y,z){let h=((x|0)*73856093)^((y|0)*19349663)^((z|0)*83492791);h=(h^(h>>13))*1274126177;h=h^(h>>16);return((h&0x7fffffff)/2147483647);}
function M(x,y,z){const h=H(x,y,z);return h<0.55?STONE:(h<0.92?COBBLE:BRICK);}
function ok(x,y,z){return x>=-22&&x<=22&&z>=-22&&z<=22&&y>=-8&&y<=33;}
function s(x,y,z){if(ok(x,y,z))block(x,y,z,M(x,y,z));}
function sb(x,y,z,b){if(ok(x,y,z))block(x,y,z,b);}
function fillM(x1,y1,z1,x2,y2,z2){const A=Math.min,B=Math.max;for(let x=A(x1,x2);x<=B(x1,x2);x++)for(let y=A(y1,y2);y<=B(y1,y2);y++)for(let z=A(z1,z2);z<=B(z1,z2);z++)s(x,y,z);}

// erode top: removes some blocks near top + jagged drop
function erode(x,y,z,y0,y1){
  const t=(y-y0)/Math.max(1,y1-y0);
  return H(x,y,z)<0.025+t*t*0.18;
}

function shell(x1,z1,x2,z2,y1,y2,ruinTop){
  for(let x=x1;x<=x2;x++)for(let z=z1;z<=z2;z++){
    if(!(x===x1||x===x2||z===z1||z===z2))continue;
    const drop=ruinTop?Math.floor(H(x,99,z)*5):0;
    for(let y=y1;y<=y2-drop;y++){
      if(ruinTop&&erode(x,y,z,y1,y2))continue;
      s(x,y,z);
    }
  }
}

function archOpen(cx,by,cz,w,h,face,thick){
  thick=thick||1;
  for(let dy=0;dy<=h+w;dy++)for(let d=-w;d<=w;d++){
    let inside=dy<=h?true:(d*d+(dy-h)*(dy-h))<=w*w;
    if(!inside)continue;
    for(let t=-Math.floor(thick/2);t<=Math.floor(thick/2);t++){
      if(face==='Z')sb(cx+d,by+dy,cz+t,AIR);
      else sb(cx+t,by+dy,cz+d,AIR);
    }
  }
}

function archFrameZ(cx,by,cz,w,h,mat){
  mat=mat||OAK_LOG;
  for(let dy=0;dy<=h;dy++){sb(cx-w-1,by+dy,cz,mat);sb(cx+w+1,by+dy,cz,mat);}
  for(let ang=0;ang<=180;ang+=10){
    const r=w+1,rad=ang*Math.PI/180;
    sb(cx+Math.round(-Math.cos(rad)*r),by+h+Math.round(Math.sin(rad)*r),cz,mat);
  }
  // keystone
  sb(cx,by+h+w+1,cz,BRICK);
}
function archFrameX(cx,by,cz,w,h,mat){
  mat=mat||OAK_LOG;
  for(let dy=0;dy<=h;dy++){sb(cx,by+dy,cz-w-1,mat);sb(cx,by+dy,cz+w+1,mat);}
  for(let ang=0;ang<=180;ang+=10){
    const r=w+1,rad=ang*Math.PI/180;
    sb(cx,by+h+Math.round(Math.sin(rad)*r),cz+Math.round(-Math.cos(rad)*r),mat);
  }
  sb(cx,by+h+w+1,cz,BRICK);
}

// shatter glass: place GLASS shards in a previously-cut opening
function glassShards(cx,by,cz,w,h,face,density){
  density=density||0.35;
  for(let dy=0;dy<=h+w;dy++)for(let d=-w;d<=w;d++){
    let inside=dy<=h?true:(d*d+(dy-h)*(dy-h))<=w*w;
    if(!inside)continue;
    if(H(cx+d,by+dy,cz)>1-density){
      if(face==='Z')sb(cx+d,by+dy,cz,GLASS);
      else sb(cx,by+dy,cz+d,GLASS);
    }
  }
}

// ===== FOUNDATION + FLOOR =====
fillM(-15,-2,-19, 15,-2, 20);
fillM(-14,-1,-18, 14,-1, 19);
cube(-13, 0,-17, 13, 0, 19, COBBLE);
// nave floor pattern - dark accents
for(let x=-12;x<=12;x+=4)for(let z=-15;z<=18;z+=4)sb(x,0,z,BRICK);

// ===== FACADE (between towers) z=-17 =====
fillM(-8, 1,-17, 8, 16,-17);
// pointed gable
for(let y=16;y<=22;y++){
  const w=22-y;
  if(w<0)break;
  fillM(-w,y,-17, w,y,-17);
}
// secondary facade thickness
for(let x=-8;x<=8;x++)for(let y=1;y<=14;y++)if(H(x,y,-16)<0.3)s(x,y,-16);

// Big main doorway - arched, OAK_LOG framed
archOpen(0,1,-17, 3, 6, 'Z', 2);
archFrameZ(0,1,-17, 3, 6);
// Inner door reveal
sb(-2,1,-16,OAK_LOG);sb(2,1,-16,OAK_LOG);
sb(-2,2,-16,OAK_LOG);sb(2,2,-16,OAK_LOG);

// Rose window (huge round opening)
const RX=0,RY=14,RZ=-17;
for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
  const r2=dx*dx+dy*dy;
  if(r2<=16){sb(RX+dx,RY+dy,RZ,AIR);sb(RX+dx,RY+dy,RZ-1,AIR);}
}
// Tracery (OAK_LOG spokes + ring)
for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
  const r=Math.sqrt(dx*dx+dy*dy);
  if(r>3.4&&r<=4.0)sb(RX+dx,RY+dy,RZ,OAK_LOG);
  if(r<1.2)sb(RX+dx,RY+dy,RZ,OAK_LOG);
}
sb(RX-3,RY,RZ,OAK_LOG);sb(RX+3,RY,RZ,OAK_LOG);
sb(RX,RY-3,RZ,OAK_LOG);sb(RX,RY+3,RZ,OAK_LOG);
sb(RX-2,RY+2,RZ,OAK_LOG);sb(RX+2,RY-2,RZ,OAK_LOG);
sb(RX+2,RY+2,RZ,OAK_LOG);sb(RX-2,RY-2,RZ,OAK_LOG);
// Some glass shards left in rose
for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
  if(dx*dx+dy*dy<=9 && H(RX+dx,RY+dy,77)<0.25)sb(RX+dx,RY+dy,RZ,GLASS);
}

// Side facade arched lancets flanking the door
for(const cx of [-5,5]){
  archOpen(cx,4,-17, 1, 4, 'Z', 1);
  archFrameZ(cx,4,-17, 1, 4);
  glassShards(cx,4,-17, 1, 4, 'Z', 0.45);
}
// Niches in facade upper
for(const cx of [-6,-3,3,6]){
  archOpen(cx,17,-17, 0, 2, 'Z', 1);
}

// ===== FLANKING TOWERS =====
function tower(x1,x2,z1,z2,top){
  shell(x1,z1,x2,z2, 1, top, true);
  // inner cross beams
  for(let y=4;y<=top-2;y+=4){
    for(let x=x1+1;x<x2;x++){
      if(H(x,y,z1)<0.3)sb(x,y,z1+1,OAK_LOG);
    }
  }
}
tower(-12,-8, -17,-13, 19);
tower(  8, 12, -17,-13, 19);

// Tower windows (each face that's exposed)
for(const tx of [-10, 10]){
  // -Z face (front)
  archOpen(tx,5,-17, 1, 3, 'Z', 1);
  archFrameZ(tx,5,-17, 1, 3);
  glassShards(tx,5,-17, 1, 3, 'Z', 0.3);
  archOpen(tx,11,-17, 1, 3, 'Z', 1);
  archFrameZ(tx,11,-17, 1, 3);
  // -X / +X face (outside)
  const sx = tx<0 ? -12 : 12;
  archOpen(sx,5,-15, 1, 3, 'X', 1);
  archFrameX(sx,5,-15, 1, 3);
  glassShards(sx,5,-15, 1, 3, 'X', 0.3);
  archOpen(sx,11,-15, 1, 3, 'X', 1);
  archFrameX(sx,11,-15, 1, 3);
}

// Crenellated broken parapet on flanking towers
for(const [x1,x2] of [[-12,-8],[8,12]]){
  for(let x=x1;x<=x2;x++)for(let z=-17;z<=-13;z++){
    if(!(x===x1||x===x2||z===-17||z===-13))continue;
    if(((x+z)&1)===0 && H(x,20,z)<0.7)s(x,20,z);
    if(H(x,21,z)<0.4)s(x,21,z);
  }
}

// ===== CENTRAL SPIRE =====
// Spire base (square tower behind facade)
shell(-3,-17, 3,-13, 1, 24, false);
// Inside cross-rib
for(let y=8;y<=22;y+=4){
  sb(-2,y,-15,OAK_LOG);sb(2,y,-15,OAK_LOG);
  sb(0,y,-16,OAK_LOG);sb(0,y,-14,OAK_LOG);
}
// Spire windows
for(let y of [6,12,18]){
  archOpen(0,y,-17, 1, 3, 'Z', 1);
  archFrameZ(0,y,-17, 1, 3);
}
// Spire taper above y=24 - octagonal-ish shrinking square
for(let layer=0; layer<5; layer++){
  const y = 24+layer;
  const inset = layer; // shrink
  const x1=-3+inset, x2=3-inset, z1=-17+inset, z2=-13;
  if(x1>x2)break;
  for(let x=x1;x<=x2;x++)for(let z=z1;z<=z2;z++){
    if(x===x1||x===x2||z===z1||z===z2)s(x,y,z);
  }
}
// Spire pinnacle - tall narrow tapering pillar
fillM(-1, 29, -16, 1, 30, -14);
fillM(0, 31, -15, 0, 32, -15);
// JAGGED BROKEN TOP - remove blocks on one side
for(let y=24; y<=32; y++){
  // wind/decay break on +X side
  if(H(y,7,3)<0.5){
    sb(2-Math.floor(H(y,9,1)*2), y, -15+Math.floor(H(y,3,1)*3)-1, AIR);
  }
  if(H(y,11,5)<0.6 && y>=27){
    sb(1, y, -14, AIR);
  }
}
// broken jagged edges - a few blocks tilted off
sb(2,28,-14,COBBLE);sb(2,29,-13,COBBLE);
sb(-2,27,-13,COBBLE);

// ===== NAVE WALLS =====
// Left wall x=-7, z=-13..15  ;  Right wall x=7
const NAVE_TOP = 12;
for(const wx of [-7, 7]){
  for(let z=-13; z<=15; z++){
    const drop = Math.floor(H(wx,77,z)*4);
    for(let y=1; y<=NAVE_TOP - (z>2 && z<14 && H(z,3,wx)<0.15 ? drop+3 : drop); y++){
      if(H(wx,y,z)<0.04)continue;
      s(wx, y, z);
    }
  }
  // collapsed section (gap in wall)
  for(let y=4;y<=NAVE_TOP;y++)for(let z=4;z<=6;z++) if(H(wx,y,z)<0.55) sb(wx,y,z,AIR);
}

// Bay arched windows along nave (every 4 blocks)
for(let bayZ=-10; bayZ<=14; bayZ+=4){
  for(const wx of [-7, 7]){
    if(H(wx, 50, bayZ)<0.15)continue; // skip if collapsed area
    archOpen(wx, 4, bayZ, 1, 5, 'X', 1);
    archFrameX(wx, 4, bayZ, 1, 5);
    glassShards(wx, 4, bayZ, 1, 5, 'X', 0.25);
  }
}

// Clerestory above (raised wall with smaller windows) - mostly collapsed
for(const wx of [-4, 4]){
  for(let z=-12; z<=14; z++){
    if(H(wx,222,z)<0.45)continue; // mostly missing
    const top = 16 - Math.floor(H(wx,223,z)*5);
    for(let y=NAVE_TOP+1; y<=top; y++){
      if(H(wx,y,z)<0.1)continue;
      s(wx,y,z);
    }
  }
  // clerestory windows
  for(let bz=-9; bz<=13; bz+=4){
    if(H(wx,225,bz)<0.4)continue;
    archOpen(wx, NAVE_TOP+2, bz, 1, 2, 'X', 1);
    archFrameX(wx, NAVE_TOP+2, bz, 1, 2);
  }
}

// ===== RIB VAULTS (broken stubs) - OAK_LOG arches across nave =====
for(let bz=-10; bz<=14; bz+=3){
  // arch from left wall top to right wall top at z=bz
  for(let ang=0;ang<=180;ang+=10){
    const r=7,rad=ang*Math.PI/180;
    const dx=Math.round(-Math.cos(rad)*r);
    const dy=Math.round(Math.sin(rad)*r*0.7);
    // most are broken - only place if random allows
    if(H(bz, ang, 1)<0.35)continue;
    sb(dx, NAVE_TOP+dy+1, bz, OAK_LOG);
  }
}

// ===== FLYING BUTTRESSES =====
function buttress(wx, bz, outer){
  // pier outside the nave wall
  const px = outer; // pier x position
  // vertical pier
  fillM(px, 1, bz, px, 9, bz);
  fillM(px, 1, bz+1, px, 9, bz+1);
  // stepped top
  s(px, 10, bz); s(px, 10, bz+1);
  // arch from pier to clerestory wall
  for(let t=0; t<=1; t+=0.08){
    const x = Math.round(px + (wx-px)*t);
    const y = 10 + Math.round(Math.sin(t*Math.PI)*3) + Math.floor(t*2);
    sb(x, y, bz, M(x,y,bz));
    if(t<0.5)sb(x, y, bz+1, M(x,y,bz+1));
  }
  // pinnacle on pier top
  fillM(px,10,bz,px,11,bz);
  sb(px,12,bz,BRICK);
}
for(let bz=-10; bz<=14; bz+=4){
  buttress(-7, bz, -10);
  buttress( 7, bz,  10);
}

// ===== APSE (curved back end) =====
const AZ = 16;
for(let ang=0; ang<=180; ang+=8){
  const rad = ang*Math.PI/180;
  const dx = Math.round(Math.cos(rad)*7);
  const dz = Math.round(Math.sin(rad)*5);
  const top = 11 - Math.floor(H(dx, 333, dz)*4);
  for(let y=1; y<=top; y++){
    if(H(dx,y,dz+AZ)<0.06)continue;
    s(dx, y, AZ + dz);
  }
}
// apse windows
for(let ang=30;ang<=150;ang+=30){
  const rad=ang*Math.PI/180;
  const dx=Math.round(Math.cos(rad)*7);
  const dz=Math.round(Math.sin(rad)*5);
  archOpen(dx, 3, AZ+dz, 1, 4, dx===0?'Z':(Math.abs(dx)>Math.abs(dz)?'X':'Z'), 1);
  if(dx===0)archFrameZ(dx, 3, AZ+dz, 1, 4);
  else if(Math.abs(dx)>Math.abs(dz))archFrameX(dx, 3, AZ+dz, 1, 4);
  else archFrameZ(dx, 3, AZ+dz, 1, 4);
}

// ===== PARTIAL ROOF (collapsed) =====
// Side aisle roofs (low pitched) - mostly intact toward facade, broken toward apse
for(let z=-12; z<=14; z++){
  // Left aisle roof slope
  for(let dx=0; dx<=2; dx++){
    const x = -7 - dx;
    const y = NAVE_TOP + 1 - dx;
    if(H(x,y,z) > 0.3 + (z+12)/30) sb(x, y, z, BRICK);
  }
  for(let dx=0; dx<=2; dx++){
    const x = 7 + dx;
    const y = NAVE_TOP + 1 - dx;
    if(H(x,y,z) > 0.3 + (z+12)/30) sb(x, y, z, BRICK);
  }
}

// Main nave roof remnants (high, mostly fallen)
for(let z=-10; z<=12; z++){
  for(let x=-4; x<=4; x++){
    const y = 17 - Math.abs(x);
    if(H(x,y,z) > 0.7) sb(x, y, z, BRICK);
  }
}

// ===== RUBBLE PILES at base =====
function rubblePile(cx, cz, r){
  for(let dx=-r; dx<=r; dx++)for(let dz=-r; dz<=r; dz++){
    const dist = Math.sqrt(dx*dx+dz*dz);
    if(dist>r)continue;
    const h = Math.max(0, Math.round((r-dist) * 0.8 - H(cx+dx, 444, cz+dz)*1.5));
    for(let y=1; y<=h; y++){
      if(H(cx+dx, y, cz+dz)<0.85){
        sb(cx+dx, y, cz+dz, H(cx+dx,y,cz+dz)<0.6?COBBLE:STONE);
      }
    }
  }
}
rubblePile(-13, -10, 3);
rubblePile( 13, -8, 3);
rubblePile(-10,  6, 3);
rubblePile( 10,  9, 4);
rubblePile(-6, 18, 2);
rubblePile( 8, 19, 3);
rubblePile(-14, 4, 3);
rubblePile( 14, 16, 3);
// fallen masonry chunks
for(let i=0;i<25;i++){
  const x = -18 + Math.floor(H(i,1,1)*36);
  const z = -16 + Math.floor(H(i,2,2)*36);
  const sz = 1 + Math.floor(H(i,3,3)*2);
  const id = H(i,4,4)<0.5?COBBLE:STONE;
  for(let dx=0;dx<sz;dx++)for(let dz=0;dz<sz;dz++) sb(x+dx, 1, z+dz, id);
}

// ===== IVY (LEAVES creeping up walls) =====
function ivyStrand(x, z, yTop, yBot, face){
  let y = yBot;
  let curX = x, curZ = z;
  while(y <= yTop){
    sb(curX, y, curZ, LEAVES);
    // sometimes branch sideways
    if(H(curX,y,curZ)<0.25){
      const dx = face==='Z' ? (H(y,curX,1)<0.5?-1:1) : 0;
      const dz = face==='X' ? (H(y,curZ,2)<0.5?-1:1) : 0;
      sb(curX+dx, y, curZ+dz, LEAVES);
    }
    y++;
    if(H(curX,y+100,curZ)<0.15){
      if(face==='Z') curX += (H(y,1,curZ)<0.5?-1:1);
      else curZ += (H(y,2,curX)<0.5?-1:1);
    }
  }
}
// Ivy on facade
for(const x of [-9, -5, -1, 4, 8, 11, -3, 6]){
  ivyStrand(x, -17, 1+Math.floor(H(x,1,9)*10), 1, 'Z');
}
// Ivy on tower outer faces
for(const z of [-16,-14]){
  ivyStrand(-12, z, 8+Math.floor(H(z,3,3)*6), 1, 'X');
  ivyStrand( 12, z, 8+Math.floor(H(z,4,4)*6), 1, 'X');
}
// Ivy on nave walls (both sides)
for(let z=-12; z<=14; z+=2){
  if(H(z,5,5)<0.4){
    ivyStrand(-7, z, 5+Math.floor(H(z,6,6)*5), 1, 'X');
  }
  if(H(z,7,7)<0.4){
    ivyStrand( 7, z, 5+Math.floor(H(z,8,8)*5), 1, 'X');
  }
}
// Ivy clumps on rubble
for(let i=0;i<20;i++){
  const x = -14 + Math.floor(H(i,9,9)*28);
  const z = -14 + Math.floor(H(i,10,10)*32);
  sb(x, 2, z, LEAVES);
  if(H(i,11,11)<0.5)sb(x+1, 2, z, LEAVES);
  if(H(i,12,12)<0.5)sb(x, 3, z, LEAVES);
}

// ===== A FEW BRICK ACCENTS (cornices) =====
// String course on facade
for(let x=-8;x<=8;x++)sb(x, 8, -17, BRICK);
for(let x=-12;x<=-8;x++)sb(x, 8, -17, BRICK);
for(let x=8;x<=12;x++)sb(x, 8, -17, BRICK);
// Tower cornices
for(const [x1,x2] of [[-12,-8],[8,12]]){
  for(let x=x1;x<=x2;x++){sb(x,16,-17,BRICK);sb(x,16,-13,BRICK);}
  for(let z=-17;z<=-13;z++){sb(x1,16,z,BRICK);sb(x2,16,z,BRICK);}
}

// ===== INTERIOR DETAILS =====
// Broken pews / floor debris
for(let z=-10; z<=12; z+=2){
  for(let x=-5; x<=5; x+=4){
    if(H(x,55,z)<0.4){
      sb(x, 1, z, OAK_LOG);
      if(H(x+1,56,z)<0.5)sb(x+1, 1, z, OAK_LOG);
    }
  }
}
// Altar at apse end
fillM(-2, 1, 16, 2, 2, 17);
sb(0, 3, 16, BRICK);
sb(-1, 3, 17, COBBLE);
sb(1, 3, 17, COBBLE);

// ===== EXTRA: gargoyles / pinnacles atop buttress piers =====
for(let bz=-10; bz<=14; bz+=4){
  for(const px of [-10, 10]){
    if(H(px,bz,99)<0.5) sb(px, 12, bz, OAK_LOG); // broken-off statue stub
  }
}

// Cross atop one flanking tower (the other broken)
sb(10, 22, -15, OAK_LOG);
sb(10, 23, -15, OAK_LOG);
sb( 9, 22, -15, OAK_LOG);
sb(11, 22, -15, OAK_LOG);

// Final touch: scattered glass on ground from broken windows
for(let i=0;i<15;i++){
  const x = -10 + Math.floor(H(i,77,1)*20);
  const z = -10 + Math.floor(H(i,78,2)*22);
  sb(x, 1, z, GLASS);
}