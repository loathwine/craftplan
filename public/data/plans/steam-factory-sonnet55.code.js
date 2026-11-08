// steam-factory-sonnet55 — prompt:
// a Victorian factory with smoking chimneys...

const M = new Map();
function P(x,y,z,id){ if(x<-22||x>22||z<-22||z>22||y<-8||y>33) return; M.set(x+','+y+','+z,[x,y,z,id]); }
function C(x1,y1,z1,x2,y2,z2,id){ for(let x=Math.min(x1,x2);x<=Math.max(x1,x2);x++) for(let y=Math.min(y1,y2);y<=Math.max(y1,y2);y++) for(let z=Math.min(z1,z2);z<=Math.max(z1,z2);z++) P(x,y,z,id); }
function walls(x1,z1,x2,z2,y1,y2,id){ C(x1,y1,z1,x2,y2,z1,id); C(x1,y1,z2,x2,y2,z2,id); C(x1,y1,z1,x1,y2,z2,id); C(x2,y1,z1,x2,y2,z2,id); }
function ring(x1,z1,x2,z2,y,id){ walls(x1,z1,x2,z2,y,y,id); }

// clear site (trees)
C(-20,0,-15,20,8,8,AIR);

// ===== MAIN HALL =====
walls(-12,-6,10,5,0,9,BRICK);
walls(-12,-6,10,5,0,1,COBBLE);
ring(-13,-7,11,6,9,STONE);
for (const [x,z] of [[-12,-6],[10,-6],[-12,5],[10,5]]) C(x,2,z,x,8,z,STONE);
for (const x of [-9,6]) { C(x,2,-6,x,8,-6,STONE); C(x,2,5,x,8,5,STONE); }

// windows north face
const litN = [-8,7];
for (const x of [-11,-8,4,7]) {
  const g = litN.includes(x) ? GLOWSTONE : GLASS;
  C(x,2,-6,x+1,7,-6,g);
  C(x,4,-6,x+1,4,-6,IRON);
  C(x-1,1,-6,x+2,1,-6,STONE);
  C(x-1,8,-6,x+2,8,-6,STONE);
}
// south face windows
for (const x of [-11,-8,-5,-2,1,4,7]) { C(x,2,5,x+1,7,5,GLASS); C(x-1,1,5,x+2,1,5,STONE); C(x,8,5,x+1,8,5,STONE); }
// west face south part
for (const z of [1,3]) { C(-12,2,z,-12,7,z,GLASS); C(-12,8,z,-12,8,z,STONE); }

// sawtooth roof
for (const z0 of [-6,-2,2]) {
  for (let x=-12;x<=10;x++){
    const slate = GRAY;
    P(x,10,z0+3,slate);
    P(x,10,z0+2,slate); P(x,11,z0+2,slate);
    P(x,11,z0+1,slate); P(x,12,z0+1,slate);
    P(x,13,z0,slate);
    P(x,10,z0,slate);
    const mull = ((x+12)%4===0);
    P(x,11,z0,mull?IRON:GLASS); P(x,12,z0,mull?IRON:GLASS);
  }
  for (const x of [-12,10]) P(x,10,z0+1,GRAY);
}

// ===== ENTRANCE TOWER =====
walls(-4,-10,2,-4,0,17,BRICK);
walls(-4,-10,2,-4,0,1,COBBLE);
for (const [x,z] of [[-4,-10],[2,-10],[-4,-4],[2,-4]]) C(x,2,z,x,17,z,STONE);
// door
C(-2,0,-10,0,3,-6,AIR);
C(-3,0,-10,-3,4,-10,STONE); C(1,0,-10,1,4,-10,STONE); C(-3,4,-10,1,4,-10,STONE);
C(-2,4,-11,0,4,-11,STONE); C(-3,0,-11,-3,3,-11,IRON); C(1,0,-11,1,3,-11,IRON);
C(-2,0,-11,0,0,-11,STONE);
block(-1,3,-7,GLOWSTONE);
// plaque
C(-3,6,-11,1,7,-11,BLACK); C(-3,5,-11,1,5,-11,GOLD); C(-3,8,-11,1,8,-11,GOLD);
for (const x of [-2,0]) block(x,6,-12,GOLD);
block(-1,7,-12,GOLD);
// tower windows
for (const x of [-3,1]) C(x,10,-10,x,11,-10,GLOWSTONE);
for (const z of [-8,-6]) for (const x of [-4,2]) C(x,9,z,x,10,z,GLASS);
// clock
const cx=-1, cy=14;
for (let dx=-3;dx<=3;dx++) for (let dy=-3;dy<=3;dy++){
  const d=Math.hypot(dx,dy);
  if (d<=2.3) P(cx+dx,cy+dy,-11,WHITE);
  else if (d<=3.2) P(cx+dx,cy+dy,-11,BLACK);
}
for (let y=cy;y<=cy+2;y++) P(cx,y,-12,GOLD);
P(cx+1,cy,-12,GOLD); P(cx+2,cy,-12,GOLD);
for (const [dx,dy] of [[0,-2],[-2,0]]) P(cx+dx,cy+dy,-12,GOLD);
// cornice & roof
ring(-5,-11,3,-3,18,STONE);
for (const [x,z] of [[-5,-11],[3,-11],[-5,-3],[3,-3]]) { C(x,19,z,x,20,z,STONE); block(x,21,z,IRON); }
ring(-4,-10,2,-4,19,GRAY);
ring(-3,-9,1,-5,20,GRAY);
C(-2,21,-8,0,21,-6,GRAY);
block(-1,22,-7,GRAY);
C(-1,23,-7,-1,27,-7,IRON);
block(-1,28,-7,GOLD);
C(0,26,-7,2,27,-7,RED);

// ===== WEST WING (offices) =====
walls(-19,-8,-13,-1,0,6,BRICK);
walls(-19,-8,-13,-1,0,1,COBBLE);
ring(-20,-9,-12,0,6,STONE);
for (const [x,z] of [[-19,-8],[-13,-8],[-19,-1],[-13,-1]]) C(x,2,z,x,5,z,STONE);
for (let z=-9;z<=0;z++){
  for (const x of [-20,-19,-13,-12]) P(x,7,z,GRAY);
  for (const x of [-19,-18,-14,-13]) P(x,8,z,GRAY);
  for (const x of [-18,-17,-15,-14]) P(x,9,z,GRAY);
  for (const x of [-17,-16,-15]) P(x,10,z,GRAY);
}
for (const z of [-8,-1]) { C(-19,7,z,-13,7,z,BRICK); C(-18,8,z,-14,8,z,BRICK); C(-17,9,z,-15,9,z,BRICK); }
for (const x of [-18,-14]) { C(x,2,-8,x,3,-8,GLASS); }
for (const x of [-18,-16,-14]) { C(x,4,-8,x,5,-8,GLOWSTONE); }
C(-16,0,-8,-16,2,-8,AIR); C(-17,0,-8,-17,3,-8,STONE); C(-15,0,-8,-15,3,-8,STONE);
C(-17,3,-8,-15,3,-8,STONE);
block(-16,3,-9,GOLD);
for (const z of [-6,-3]) { C(-19,2,z,-19,3,z,GLASS); C(-19,4,z,-19,5,z,GLASS); }

// ===== EAST WING (boiler house) =====
walls(11,-3,19,4,0,7,BRICK);
walls(11,-3,19,4,0,1,COBBLE);
C(11,8,-3,19,8,4,GRAY);
ring(11,-3,19,4,9,STONE);
for (const [x,z] of [[11,-3],[19,-3],[11,4],[19,4]]) C(x,2,z,x,8,z,STONE);
C(14,0,-3,16,4,-1,AIR);
C(13,0,-3,13,5,-3,STONE); C(17,0,-3,17,5,-3,STONE); C(13,5,-3,17,5,-3,STONE);
C(14,5,-4,16,5,-4,IRON);
C(14,0,-1,16,1,-1,LAVA);
C(14,2,-1,16,2,-1,GLOWSTONE);
block(15,3,-2,FIRE);
for (const x of [12,18]) { C(x,3,-3,x,5,-3,GLASS); C(x,2,-3,x,2,-3,STONE); }
for (const z of [0,2]) { C(19,3,z,19,5,z,GLASS); }
// pipes
C(12,0,-4,12,9,-4,COPPER);
C(12,7,-4,18,7,-4,COPPER);
C(18,7,-4,18,9,-4,COPPER);
block(12,10,-4,STEAM); block(18,10,-4,STEAM);

// ===== CHIMNEYS =====
function chimney(cx,cz,y0,yTop,baseLayers,steam2){
  for (let y=y0;y<=yTop;y++){
    const big = (y<y0+baseLayers) || y>=yTop-1;
    const r = big?2:1;
    let id = BRICK;
    if (y>=yTop-1) id=STONE;
    else if (y===y0+baseLayers-1 || y===Math.floor((y0+baseLayers+yTop-3)/2)) id=STONE;
    if (y===yTop) id=BLACK;
    ring(cx-r,cz-r,cx+r,cz+r,y,id);
  }
  block(cx,yTop,cz,STEAM);
  if (steam2) block(cx,yTop+3,cz,STEAM);
}
chimney(16,1,9,30,6,true);
chimney(-7,2,10,26,2,true);
chimney(5,3,10,22,2,true);
chimney(-16,-4,8,19,1,true);

// ===== YARD =====
C(-8,-1,-14,6,-1,-11,GRAY);
C(-2,-1,-14,0,-1,-11,COBBLE);
for (let x=-16;x<=16;x++){ if (x>=-2&&x<=0) continue; P(x,1,-15,IRON); if ((x+16)%3===0) P(x,0,-15,IRON); }
for (const x of [-3,1]) { C(x,0,-15,x,3,-15,STONE); block(x,4,-15,GOLD); }
for (const [x,z] of [[-5,-13],[3,-13],[-14,-12],[12,-12],[-6,-10]]) { C(x,0,z,x,3,z,IRON); block(x,4,z,GLOWSTONE); }
C(6,0,-13,7,1,-12,PLANKS); C(8,0,-13,8,0,-13,PLANKS); C(6,2,-13,6,2,-13,PLANKS);
C(9,0,-12,9,1,-11,PLANKS);
for (const [x,z] of [[-8,-10],[-9,-10]]) C(x,0,z,x,1,z,BROWN);
C(12,0,-9,17,0,-6,BLACK); C(13,1,-8,16,1,-7,BLACK); C(14,2,-8,15,2,-8,BLACK);

// ===== EMIT =====
for (const [x,y,z,id] of M.values()) block(x,y,z,id);