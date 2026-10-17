// ghost-ship-fable — prompt:
// a ghost pirate ship...

const Z0=-18, Z1=17, KEEL=2, DECK=8;
function h(x,y,z){const n=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return n-Math.floor(n);}
function hw(z){
  const t=(z-Z0)/(Z1-Z0);
  if(t<0.4) return Math.max(0,Math.round(0.5+6*Math.sqrt(t/0.4)));
  if(t<0.7) return 6;
  return Math.round(6-1.5*((t-0.7)/0.3));
}
// clear trees / canopy where the hull and rigging go
cube(-9,0,Z0-7,9,9,Z1+2,AIR);
cube(-8,10,-12,8,31,13,AIR);

// ---- spectral sea mist under the hull ----
for(let z=Z0-4;z<=Z1+3;z++)for(let x=-9;x<=9;x++){
  const r=h(x,0,z);
  if(r<0.22) block(x,0,z,CYAN);
  else if(r<0.34) block(x,0,z,LIGHT_BLUE);
  else if(r<0.40) block(x,1,z,ICE);
}

// ---- hull ----
for(let z=Z0;z<=Z1;z++){
  const H=hw(z);
  for(let y=KEEL;y<=DECK;y++){
    const w=Math.max(0,Math.round(H-(DECK-y)*0.55));
    if(y===KEEL){ for(let x=-w;x<=w;x++) block(x,y,z,OAK_LOG); continue; }
    for(const s of [-1,1]){
      for(let k=0;k<2;k++){
        const x=s*(w-k); if(w-k<0) continue;
        const r=h(x,y,z);
        let id;
        if(y===DECK-1) id=BLACK;
        else if(y<=KEEL+1) id=OAK_LOG;
        else id = r<0.3?OAK_LOG:(r<0.42?GRAY:BROWN);
        if(k===0 && r>0.9 && y<DECK-1) continue;          // rotted-out hole
        if(k===0 && r>0.84 && r<=0.9) id=LIGHT_GRAY;        // barnacles / ghost pale
        block(x,y,z,id);
      }
    }
  }
  // deck
  const wd=Math.max(0,Math.round(hw(z)));
  for(let x=-wd;x<=wd;x++) block(x,DECK,z,h(x,DECK,z)<0.15?GRAY:PLANKS);
  // railing
  if(wd>=1 && z>Z0+1){
    for(const s of [-1,1]){
      const x=s*wd;
      block(x,DECK+1,z,(z%2===0)?OAK_LOG:GRAY);
      if(z%2===0) block(x,DECK+2,z,OAK_LOG);
    }
  }
}
// gunports + cannons
for(const z of [-6,-1,4,9]) for(const s of [-1,1]){
  const w=Math.round(hw(z)-(DECK-(DECK-2))*0.55);
  block(s*w,DECK-2,z,AIR);
  line(s*(w-1),DECK-2,z,s*(w+2),DECK-2,z,BLACK);
}

// ---- forecastle ----
cube(-4,DECK+1,Z0+3,4,DECK+2,Z0+9,PLANKS);
cube(-4,DECK+1,Z0+3,4,DECK+1,Z0+9,BROWN);
for(let x=-4;x<=4;x++){ block(x,DECK+3,Z0+9,x%2?GRAY:OAK_LOG); }
for(const s of[-1,1]) for(let z=Z0+3;z<=Z0+9;z++) block(s*4,DECK+3,z,(z%2)?OAK_LOG:GRAY);
// bow lanterns
for(const s of [-1,1]){ block(s*2,DECK+3,Z0+4,IRON); block(s*2,DECK+4,Z0+4,FIRE); }

// ---- quarterdeck + stern cabin ----
cube(-5,DECK+1,Z1-9,5,DECK+3,Z1,BROWN);
cube(-5,DECK+4,Z1-9,5,DECK+4,Z1,PLANKS);
// cabin side windows (glowing, ghostly)
for(const s of [-1,1]) for(const z of [Z1-7,Z1-5,Z1-3,Z1-1]){ block(s*5,DECK+2,z,GLOWSTONE); }
// stern transom
cube(-5,KEEL+2,Z1+1,5,DECK+5,Z1+1,BROWN);
cube(-4,DECK+1,Z1+1,4,DECK+2,Z1+1,BLACK);
for(const x of [-3,-1,1,3]) block(x,DECK+2,Z1+1,GLOWSTONE);
cube(-5,DECK+6,Z1+1,5,DECK+6,Z1+1,OAK_LOG);
// quarterdeck rail
for(let x=-5;x<=5;x++) block(x,DECK+5,Z1-9,x%2?OAK_LOG:GRAY);
for(const s of[-1,1]) for(let z=Z1-9;z<=Z1;z++) block(s*5,DECK+5,z,(z%2)?GRAY:OAK_LOG);
// stern lanterns
for(const s of[-1,1]){ block(s*4,DECK+6,Z1,IRON); block(s*4,DECK+7,Z1,FIRE); }
// ship's wheel
block(0,DECK+5,Z1-6,OAK_LOG); block(0,DECK+6,Z1-6,OAK_LOG);
for(const [dx,dy] of [[-1,0],[1,0],[0,1],[0,-1],[-1,1],[1,1],[-1,-1],[1,-1]]) block(dx,DECK+6+dy,Z1-7,GOLD);
block(0,DECK+6,Z1-7,BLACK);

// ---- bowsprit + skull figurehead ----
line(0,DECK+2,Z0+1,0,DECK+5,Z0-7,OAK_LOG);
line(0,DECK+1,Z0+1,0,DECK+4,Z0-7,OAK_LOG);
line(-3,DECK+3,Z0-2,3,DECK+3,Z0-2,GRAY);
cube(-1,DECK-3,Z0-2,1,DECK-1,Z0-1,WHITE);
block(0,DECK-4,Z0-2,WHITE); block(-1,DECK-4,Z0-2,WHITE); block(1,DECK-4,Z0-2,WHITE);
block(-1,DECK-2,Z0-3,NEON_BLUE); block(1,DECK-2,Z0-3,NEON_BLUE);
block(0,DECK-3,Z0-3,BLACK);
// bow stem
line(0,KEEL,Z0,0,DECK-3,Z0-1,OAK_LOG);

// ---- masts, yards, sails ----
function mast(z,top,yards){
  line(0,DECK,z,0,top,z,OAK_LOG);
  block(0,top+1,z,BLACK);
  for(const [y,half] of yards){
    line(-half,y,z,half,y,z,OAK_LOG);
    // sail hangs one cell south of the yard
    const rows=Math.min(7,half+1);
    for(let dy=1;dy<=rows;dy++){
      const yy=y-dy;
      const shrink=dy>rows-2?1:0;
      for(let x=-half+shrink;x<=half-shrink;x++){
        const r=h(x,yy,z);
        if(dy>=rows-1 && r<0.5) continue;
        if(r<0.12) continue;
        block(x,yy,z+1, r<0.19?CYAN:(r<0.45?WHITE:LIGHT_GRAY));
      }
    }
  }
}
mast(-9,26,[[24,5],[17,6]]);
mast(1,30,[[28,5],[20,7]]);
mast(10,25,[[23,4],[16,5]]);
// crow's nest on main
hollowCube(-1,22,0,1,22,2,OAK_LOG); block(0,22,1,OAK_LOG);
hollowCube(-1,23,0,1,23,2,GRAY);
// Jolly Roger flag at main top
cube(0,27,1,4,30,1,BLACK); block(2,29,1,WHITE); block(2,28,1,WHITE); block(1,28,1,WHITE); block(3,28,1,WHITE);
block(1,30,1,AIR); block(4,27,1,AIR);
// tattered ghost pennants
line(0,25,-9,-3,25,-9,CYAN); line(0,24,10,3,24,10,CYAN);

// rigging
line(0,26,-9,0,DECK+4,Z0-5,GRAY);
line(0,30,1,0,26,-9,GRAY);
line(0,30,1,0,25,10,GRAY);
line(0,25,10,0,DECK+6,Z1,GRAY);
for(const s of[-1,1]){
  line(0,24,-9,s*6,DECK+1,-9,GRAY);
  line(0,28,1,s*6,DECK+1,1,GRAY);
  line(0,23,10,s*5,DECK+4,10,GRAY);
  line(s*5,20,1,s*6,DECK+1,-4,GRAY);
}
// St. Elmo's fire crackling on the mast tops
block(0,28,-9,ELECTRIC); block(0,32,1,ELECTRIC); block(0,27,10,ELECTRIC);
block(-6,21,1,ELECTRIC); block(6,18,-9,ELECTRIC);

// ---- skeleton crew ----
function skel(x,y,z,hat){
  block(x,y,z,WHITE); block(x,y+1,z,WHITE); block(x,y+2,z,LIGHT_GRAY);
  block(x,y+3,z,WHITE);
  block(x-1,y+2,z,WHITE); block(x+1,y+2,z,WHITE);
  if(hat){ block(x,y+4,z,BLACK); block(x-1,y+4,z,BLACK); block(x+1,y+4,z,BLACK); }
}
skel(-3,DECK+1,-3,false);
skel(4,DECK+1,3,false);
skel(-5,DECK+3,Z0+6,true);
skel(2,DECK+1,-12,false);
skel(0,DECK+5,Z1-4,true);   // captain at the wheel
skel(-3,DECK+5,Z1-2,false);
skel(0,24,1,false);        // lookout
// captain's cutlass
line(1,DECK+7,Z1-4,3,DECK+9,Z1-4,IRON);

// ---- deck clutter ----
cube(-2,DECK+1,6,-1,DECK+2,7,OAK_LOG); block(-2,DECK+3,6,GOLD); block(-1,DECK+3,7,GOLD);
for(const [x,z] of [[3,-5],[4,-6],[3,-7],[-4,0],[-3,1]]) { cylinder(x,DECK+1,z,0,2,BROWN); block(x,DECK+2,z,OAK_LOG); }
block(2,DECK+1,-9,CYAN); block(-2,DECK+1,2,CYAN);   // drifting ghost-light on deck
// ghostly anchor hanging at the bow
line(-6,DECK-1,Z0+6,-6,KEEL+1,Z0+6,GRAY);
cube(-7,KEEL+1,Z0+5,-5,KEEL+1,Z0+7,IRON); block(-6,KEEL+2,Z0+6,IRON);