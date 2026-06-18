// eiffel-tower — prompt:
// The Eiffel Tower, a tall iron lattice tower. It must be TALL and tapering with an open lattice look. Build it in STONE and COBBLE (dark iron). Four splayed legs at the base joined by a big arch, narro...

const STONE=3, COBBLE=8, GLASS=11, AIR=0;
const R = Math.round;

// half-width profile: concave splayed feet -> taper to a point
function hw(y){
  if (y<=0) return 8;
  if (y<=8){ let t=y/8; return 8 - 3.5*Math.pow(t,0.72); }   // 8 -> 4.5 (legs, concave flare)
  if (y<=16){ let t=(y-8)/8; return 4.5 - 1.8*t; }           // 4.5 -> 2.7
  if (y<=25){ let t=(y-16)/9; return 2.7 - 1.5*t; }          // 2.7 -> 1.2
  let t=Math.min(1,(y-25)/8); return Math.max(0,1.2*(1-t));  // 1.2 -> 0 (spire)
}

const SGN=[[1,1],[1,-1],[-1,-1],[-1,1]];
function mid(p,q){ return [(p[0]+q[0])/2,(p[1]+q[1])/2]; }

// open lattice prism between two horizontal squares (centre cx,cz, half-size hs)
function prism(cx0,cz0,hs0,y0, cx1,cz1,hs1,y1, post, brace, dens){
  let span=y1-y0;
  let bays=Math.max(1, Math.round(span/2.6));
  for (let s=0;s<bays;s++){
    let ta=s/bays, tb=(s+1)/bays;
    let ya=R(y0+span*ta), yb=R(y0+span*tb);
    if (yb<=ya) yb=ya+1;
    let ax=cx0+(cx1-cx0)*ta, az=cz0+(cz1-cz0)*ta, ah=hs0+(hs1-hs0)*ta;
    let bx=cx0+(cx1-cx0)*tb, bz=cz0+(cz1-cz0)*tb, bh=hs0+(hs1-hs0)*tb;
    let A=SGN.map(d=>[ax+d[0]*ah, az+d[1]*ah]);
    let B=SGN.map(d=>[bx+d[0]*bh, bz+d[1]*bh]);
    for (let k=0;k<4;k++){
      let n=(k+1)%4;
      line(R(A[k][0]),ya,R(A[k][1]), R(B[k][0]),yb,R(B[k][1]), post);   // corner post
      line(R(A[k][0]),ya,R(A[k][1]), R(B[n][0]),yb,R(B[n][1]), brace);  // X brace
      line(R(A[n][0]),ya,R(A[n][1]), R(B[k][0]),yb,R(B[k][1]), brace);
      line(R(B[k][0]),yb,R(B[k][1]), R(B[n][0]),yb,R(B[n][1]), brace);  // top ring
    }
    if (dens>=2){
      let FT=[];
      for (let k=0;k<4;k++){
        let n=(k+1)%4;
        let m0=mid(A[k],A[n]), m1=mid(B[k],B[n]);
        line(R(m0[0]),ya,R(m0[1]), R(m1[0]),yb,R(m1[1]), brace); // mid vertical
        FT.push(m1);
      }
      for (let k=0;k<4;k++){ let n=(k+1)%4;
        line(R(FT[k][0]),yb,R(FT[k][1]), R(FT[n][0]),yb,R(FT[n][1]), brace); // diamond ring
      }
    }
  }
}

// big decorative arch on a face below the first platform
function arch(axis,sign){
  let ys=2.5, ah=5.0;
  let span=hw(ys)-0.4;
  for (let pass=0;pass<3;pass++){
    let rr=span-pass*0.95;
    let rs=rr/span;
    for (let a=0;a<=Math.PI+0.001;a+=0.045){
      let u=rr*Math.cos(a);
      let y=ys+ah*rs*Math.sin(a);
      let w=hw(y);
      if (axis==='x') block(R(u),R(y),R(sign*w),COBBLE);
      else            block(R(sign*w),R(y),R(u),COBBLE);
    }
  }
}

// projecting platform deck band + gapped railing + corner pinnacles
function platform(y, over){
  let w=R(hw(y)+over), yy=R(y);
  for (let off=0; off<2; off++){
    let ww=w-off, b=(off===0?COBBLE:STONE);
    line(-ww,yy,-ww, ww,yy,-ww, b);
    line(-ww,yy, ww, ww,yy, ww, b);
    line(-ww,yy,-ww, -ww,yy,ww, b);
    line( ww,yy,-ww,  ww,yy,ww, b);
  }
  let yr=yy+1;
  for (let t=-w;t<=w;t+=2){
    block(t,yr,-w,STONE); block(t,yr,w,STONE);
    block(-w,yr,t,STONE); block(w,yr,t,STONE);
  }
  for (let i=0;i<4;i++){ let s=SGN[i]; cube(s[0]*w,yy+1,s[1]*w, s[0]*w,yy+2,s[1]*w, COBBLE); }
}

// ---- BUILD ----
// clear canopy in the plaza footprint (keep ground at y<=0)
cube(-11,1,-11, 11,12,11, AIR);

// foundation footings under each splayed leg
for (let i=0;i<4;i++){ let s=SGN[i];
  cube(s[0]*8-2,-1,s[1]*8-2, s[0]*8+2,0,s[1]*8+2, COBBLE);
}

// four splayed lattice legs (base corners -> first-platform corners)
for (let i=0;i<4;i++){ let s=SGN[i];
  prism(s[0]*8, s[1]*8, 1.6, 0,  s[0]*4.5, s[1]*4.5, 1.1, 8, COBBLE, STONE, 2);
}

// grand arches joining the legs on all four faces
arch('x',-1); arch('x',1); arch('z',-1); arch('z',1);

// merged shaft above the first platform, following the taper curve
let nodes=[8,11,14,16,19,22,25,28,31,33];
for (let i=0;i<nodes.length-1;i++){
  let ya=nodes[i], yb=nodes[i+1];
  prism(0,0,hw(ya),ya, 0,0,hw(yb),yb, COBBLE, STONE, (yb<=16?2:1));
}

// platforms
platform(8,1.6); platform(16,1.3); platform(25,0.9);

// spire mast + glass observation light at the very top
cube(0,28,0, 0,31,0, COBBLE);
block(0,32,0,GLASS); block(0,33,0,GLASS);
block(1,32,0,GLASS); block(-1,32,0,GLASS); block(0,32,1,GLASS); block(0,32,-1,GLASS);