// octopus-4x-fable — prompt:
// a giant octopus...

function hash(x,y,z){const s=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return s-Math.floor(s);}
function put(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;block(x,y,z,id);}
function fsphere(x,y,z,r,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);r=Math.max(1,Math.round(r));if(x<-22+r)x=-22+r;if(x>22-r)x=22-r;if(z<-22+r)z=-22+r;if(z>22-r)z=22-r;if(y>33-r)y=33-r;sphere(x,y,z,r,id);}

// --- targeted site clearing (AIR is free) ---
cube(-9,0,-8,9,16,9,AIR);        // canopy + trunks where the body sits
cube(-12,3,4,-9,10,13,AIR);      // tree crowding the shipwreck
cube(-10,0,8,-10,2,8,AIR);       // its trunk

// --- tentacle skirt / body base ---
disk(0,3,0,4,BRICK);
disk(0,2,0,5,BRICK);
disk(0,1,0,6,SAND);
disk(0,0,0,6,SAND);

// --- mantle: mottled ellipsoid shell (hollow to save budget) ---
const CX=0,CY=9,CZ=0,A=6.5,B=5.5,C=6;
for(let x=-7;x<=7;x++)for(let y=-6;y<=6;y++)for(let z=-6;z<=6;z++){
  const rr=(x/A)*(x/A)+(y/B)*(y/B)+(z/C)*(z/C);
  if(rr>1||rr<0.55)continue;
  let id=BRICK;
  const h=hash(x,y,z);
  if(rr>0.78){
    if(y/B<-0.5)id=SAND;          // pale underside
    else if(h>0.93)id=SAND;       // mottled spots
    else if(h<0.035)id=COBBLE;    // warty bumps
  }
  block(CX+x,CY+y,CZ+z,id);
}

// --- face: bulging eyes, pupils, angry brow ridges, siphon ---
sphere(3,10,-6,2,SNOW);
sphere(-3,10,-6,2,SNOW);
sphere(3,10,-8,1,STONE);
sphere(-3,10,-8,1,STONE);
line(2,12,-5,5,13,-3,COBBLE);
line(-2,12,-5,-5,13,-3,COBBLE);
sphere(6,8,2,1,BRICK);
put(7,8,2,BRICK);

// --- eight tentacles: grounded crawlers, raised arms, one grabbing the ship ---
function tentacle(c){
  const a0=c.ang*Math.PI/180,N=14;
  for(let i=0;i<=N;i++){
    const t=i/N;
    const ang=a0+c.wig*Math.sin(t*6.9+c.ph);
    let d=4.2+t*c.len,y;
    if(c.type==='ground'){
      y=0.8+3.7*Math.pow(1-Math.min(1,t*1.9),1.5);
      if(t>0.72){const u=(t-0.72)/0.28;y+=c.curl*u*u;d-=2*u*u;}
    }else{
      y=4+c.height*Math.sin(t*Math.PI*0.58);
      if(c.curlBack&&t>0.8){const u=(t-0.8)/0.2;d-=c.curlBack*u*u;}
    }
    const x=Math.cos(ang)*d,z=Math.sin(ang)*d,r=2.3-1.6*t;
    fsphere(x,y,z,r,BRICK);
    if(c.type==='ground'&&i%3===1&&r>1.2){
      put(x+Math.cos(ang+Math.PI/2)*r,y+0.3,z+Math.sin(ang+Math.PI/2)*r,SAND);
    }
  }
}
const TENT=[
  {ang:10, type:'ground',len:14, curl:4.0,wig:0.20,ph:0.5},
  {ang:55, type:'raised',len:12, height:13,curlBack:3,wig:0.10,ph:1.2},
  {ang:100,type:'ground',len:15, curl:5.0,wig:0.22,ph:2.1},
  {ang:150.3,type:'raised',len:11.9,height:4.8,curlBack:0,wig:0.05,ph:0},
  {ang:192,type:'ground',len:15, curl:3.5,wig:0.25,ph:4.0},
  {ang:236,type:'raised',len:11, height:15,curlBack:3,wig:0.12,ph:2.6},
  {ang:280,type:'ground',len:14, curl:5.0,wig:0.20,ph:5.3},
  {ang:325,type:'ground',len:13, curl:4.5,wig:0.18,ph:0.9}
];
for(const c of TENT)tentacle(c);

// --- shipwreck being seized (west-southwest) ---
cube(-16,0,5,-12,0,12,PLANKS);   // deck/bottom
cube(-17,1,5,-17,2,12,PLANKS);   // port wall
cube(-11,1,5,-11,2,12,PLANKS);   // starboard wall
cube(-16,1,4,-12,2,4,PLANKS);    // bow
cube(-16,1,13,-12,2,13,PLANKS);  // stern
cube(-11,1,10,-11,2,11,AIR);     // hull breach
block(-11,1,10,PLANKS);
line(-14,2,4,-14,3,1,OAK_LOG);   // bowsprit
line(-14,1,8,-14,13,8,OAK_LOG);  // mast
line(-17,11,8,-11,11,8,OAK_LOG); // yard
cube(-16,7,8,-12,10,8,SNOW);     // sail
block(-13,8,8,AIR);              // torn sail
block(-15,9,8,AIR);
block(-12,7,8,AIR);

// tentacle tip coiled around the mast
for(let a=0;a<Math.PI*3.6;a+=0.55){
  const hy=8.3-a*(5.3/(Math.PI*3.6));
  put(-14+Math.cos(a)*1.7,hy,8+Math.sin(a)*1.7,BRICK);
  put(-14+Math.cos(a)*2.4,hy,8+Math.sin(a)*2.4,BRICK);
}

// --- spilled treasure chest (northeast, between tentacles) ---
cube(6,0,-10,8,0,-9,OAK_LOG);
cube(6,1,-10,8,1,-9,SAND);
cube(6,2,-11,8,2,-10,PLANKS);    // lid propped open
block(7,2,-9,SAND);
block(5,0,-8,SAND);
block(9,0,-9,SAND);

// --- seabed boulders ---
sphere(11,0,5,2,COBBLE);
sphere(-6,0,-14,2,STONE);
sphere(1,0,16,2,COBBLE);

// --- drifting ink cloud (north) ---
fsphere(13,2,-13,2,STONE);
fsphere(16,3,-11,1,STONE);
fsphere(11,3,-16,1,STONE);
fsphere(14,5,-14,1,STONE);