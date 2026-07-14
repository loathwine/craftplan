// blue-whale-4x-fable — prompt:
// a blue whale...

const PI=Math.PI;
function hsh(a,b,c){const s=Math.sin(a*12.9898+b*78.233+c*37.719)*43758.5453;return s-Math.floor(s);}

// ---------- ocean: elliptical lagoon with ripple rings, cleared of trees ----------
const RX=20,RZ=20,CZ=1;
for(let x=-22;x<=22;x++){
  for(let z=-21;z<=22;z++){
    const d=(x*x)/(RX*RX)+((z-CZ)*(z-CZ))/(RZ*RZ);
    if(d>1.2)continue;
    cube(x,1,z,x,9,z,AIR);            // remove vegetation above the water
    if(d>1)continue;
    let id=GLASS;
    const rr=Math.sqrt((x+4)*(x+4)+(z+4)*(z+4)); // ripples radiate from the adult
    if(d>0.90)id=ICE;                             // pale shoreline rim
    else if(rr>4.5&&(rr%7)<1.1)id=(rr<13?SNOW:ICE); // foam rings near the whale
    else if(hsh(x,0,z)<0.05)id=ICE;               // sun glints
    block(x,0,z,id);
  }
}

// ---------- whale builder (nose faces -Z / the camera) ----------
function whale(cx,noseZ,L,S){
  const RMAX=5.8*S;
  const prof=t=>{
    let r;
    if(t<0.28)r=(2.0*S)+(RMAX-2.0*S)*Math.sin((t/0.28)*PI/2);
    else r=Math.max(1.3*S,RMAX*(1-Math.pow((t-0.28)/0.72,1.8)*0.95));
    const cy=(2.0+1.8*S)+(3.0*S)*Math.sin(PI*0.75*t)+Math.max(0,t-0.78)/0.22*4.5*S;
    return[r,cy];
  };
  let tailCY=0;
  for(let zi=noseZ;zi<=noseZ+L;zi++){
    const t=(zi-noseZ)/L;
    const[r,cy]=prof(t);
    const w=r,h=r*0.8,wI=Math.ceil(w);
    tailCY=cy;
    const yLo=Math.max(1,Math.round(cy-h)),yHi=Math.round(cy+h);
    for(let x=-wI;x<=wI;x++){
      for(let y=yLo;y<=yHi;y++){
        const e=(x*x)/(w*w)+((y-cy)*(y-cy))/(h*h);
        if(e>1.06)continue;
        let id;
        if(y<cy-0.3*h){
          id=SNOW;                                          // white belly
          if(t<0.42&&y<cy-0.5*h&&((x%2+2)%2===0))id=COBBLE; // throat pleats
        }else{
          id=hsh(x+cx,y,zi)<0.24?GLASS:STONE;               // blue-gray mottled back
        }
        block(cx+x,y,zi,id);
      }
    }
    if(cy-h<=3.4){ // hull meets water: foam skirt + bow wake
      const fw=Math.floor(w*0.8);
      for(let x=-fw;x<=fw;x++)for(let y=1;y<=Math.min(2,yLo-1);y++)block(cx+x,y,zi,SNOW);
      block(cx+wI+1,1,zi,SNOW);block(cx-wI-1,1,zi,SNOW);
    }
  }
  // mouth line wrapping the front of the head
  const[r0,cy0]=prof(0);
  const my0=Math.round(cy0-0.4*r0*0.8);
  line(cx-Math.round(r0*0.9),my0,noseZ,cx+Math.round(r0*0.9),my0,noseZ,OAK_LOG);
  for(let i=1;i<=Math.round(0.30*L);i++){
    const[mr,mcy]=prof(i/L);
    const my=Math.round(mcy-0.5*mr*0.8),mx=Math.round(mr*0.9);
    block(cx+mx,my,noseZ+i,OAK_LOG);block(cx-mx,my,noseZ+i,OAK_LOG);
  }
  // eyes just above the jaw
  const[er,ecy]=prof(0.13);const ez=noseZ+Math.round(0.13*L);
  block(cx+Math.round(er*0.95),Math.round(ecy),ez,OAK_LOG);
  block(cx-Math.round(er*0.95),Math.round(ecy),ez,OAK_LOG);
  // tiny falcate dorsal fin, far back like a real blue whale
  const[dr,dcy]=prof(0.66);const dzz=noseZ+Math.round(0.66*L);
  const dy=Math.round(dcy+dr*0.8);
  block(cx,dy+1,dzz,STONE);
  if(S>0.7){block(cx,dy+1,dzz+1,STONE);block(cx,dy+2,dzz+1,STONE);}
  // pectoral flippers sweeping down into the water
  const[fr,fcy]=prof(0.32);const fz=noseZ+Math.round(0.32*L);
  for(let i=0;i<=Math.round(6*S);i++){
    const fx=Math.round(fr-1+i*0.9);
    const fy=Math.max(1,Math.round(fcy-1.5-i*0.7));
    const z2=fz+Math.round(i*0.4);
    block(cx+fx,fy,z2,STONE);block(cx+fx,fy,z2+1,STONE);
    block(cx-fx,fy,z2,STONE);block(cx-fx,fy,z2+1,STONE);
  }
  // raised tail fluke with center notch
  const widths=[2,4,6,7,5];
  for(let dz=0;dz<5;dz++){
    const z3=noseZ+L+1+dz;
    if(z3>22)break;
    const wsp=Math.max(1,Math.round(widths[dz]*S));
    for(let x=-wsp;x<=wsp;x++){
      if(S>0.7&&dz>=3&&Math.abs(x)<=1)continue;
      const y=Math.round(tailCY+(dz*0.5-Math.abs(x)*0.35)*S);
      block(cx+x,y,z3,STONE);
      if(Math.abs(x)<=2*S)block(cx+x,y-1,z3,STONE);
    }
  }
  // blow: dark blowhole + tall white spout with spray arms, or a small puff for the calf
  const[sr,scy]=prof(0.18);const sz=noseZ+Math.round(0.18*L);
  const sy=Math.round(scy+sr*0.8);
  block(cx,sy,sz,OAK_LOG);
  if(S>0.7){
    for(let k=1;k<=7;k++)block(cx,sy+k,sz,SNOW);
    for(let j=1;j<=4;j++){
      block(cx-j,sy+5+j,sz,SNOW);block(cx+j,sy+5+j,sz,SNOW);
      if(j>=2){block(cx+j+1,sy+3+j,sz,GLASS);block(cx-j-1,sy+3+j,sz,GLASS);}
      if(j<=3)block(cx,sy+5+j,sz-j,SNOW);
    }
  }else{
    block(cx,sy+1,sz,SNOW);block(cx,sy+2,sz,SNOW);block(cx+1,sy+2,sz,SNOW);
  }
}

// ---------- adult blue whale, tail arched out of the water ----------
whale(-4,-17,30,1);
// splash where the lifted tail left the sea
disk(-4,1,8,3,SNOW);
block(-6,2,8,SNOW);block(-2,2,9,SNOW);block(-4,2,7,SNOW);block(-4,3,9,SNOW);block(-1,2,7,SNOW);
// water streaming off the fluke tips
block(-9,8,15,GLASS);block(1,8,15,GLASS);block(-7,6,16,GLASS);block(-1,5,16,GLASS);block(-4,7,17,GLASS);

// ---------- calf swimming alongside, to the east ----------
whale(9,-7,15,0.5);

// ---------- ice floes drifting near the rim ----------
disk(-15,1,13,2,ICE);
disk(14,1,-11,2,ICE);
block(15,2,-11,SNOW);block(-15,2,13,SNOW);

// ---------- gulls circling the spout ----------
block(4,18,-10,SNOW);block(3,19,-10,SNOW);block(5,19,-10,SNOW);
block(-13,16,2,SNOW);block(-14,17,2,SNOW);block(-12,17,2,SNOW);