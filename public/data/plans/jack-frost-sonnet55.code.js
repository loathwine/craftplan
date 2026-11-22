// jack-frost-sonnet55 — prompt:
// Jack Frost...

const R = Math.round;
function thick(x1,y1,z1,x2,y2,z2,id){ const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1),1); for(let i=0;i<=n;i++){const t=i/n; const x=R(x1+(x2-x1)*t),y=R(y1+(y2-y1)*t),z=R(z1+(z2-z1)*t); cube(x,y,z,x+1,y+1,z+1,id);} }
function ring(cx,y,cz,r,id){ const n=Math.ceil(r*7); for(let i=0;i<n;i++){const a=i/n*Math.PI*2; block(R(cx+Math.cos(a)*r),y,R(cz+Math.sin(a)*r),id);} }
function icicle(x,y,z,len,id){ for(let i=0;i<len;i++) block(x,y-i,z,id); }
function crystal(x,y,z,w,h,lx,lz,id){ for(let t=0;t<h;t++){ const ww = t>=h-2?1:(t>=h-4&&w>2?w-1:w); const ox=R(t*lx/h), oz=R(t*lz/h); cube(x+ox,y+t,z+oz,x+ox+ww-1,y+t,z+oz+ww-1,id);} }
function snowflake(cx,cy,cz,L,th,id,tip){
  for(let k=0;k<6;k++){
    const a=Math.PI/2+k*Math.PI/3;
    const dx=Math.cos(a), dy=Math.sin(a);
    for(let d=0;d<th;d++){
      line(cx,cy,cz+d,R(cx+dx*L),R(cy+dy*L),cz+d,id);
      [0.45,0.75].forEach(f=>{
        const bx=cx+dx*L*f, by=cy+dy*L*f;
        [-1,1].forEach(s=>{
          const ba=a+s*Math.PI/3, bl=L*(f<0.6?0.4:0.28);
          line(R(bx),R(by),cz+d,R(bx+Math.cos(ba)*bl),R(by+Math.sin(ba)*bl),cz+d,id);
        });
      });
    }
    block(R(cx+dx*L),R(cy+dy*L),cz,tip); block(R(cx+dx*L),R(cy+dy*L),cz+th-1,tip);
  }
}
function flakeSmall(x,y,z){ block(x,y,z,WHITE); block(x+1,y,z,ICE); block(x-1,y,z,ICE); block(x,y+1,z,ICE); block(x,y-1,z,ICE); }

cube(-20,0,-16,20,10,14,AIR);

disk(0,-1,0,13,SNOW);
disk(0,0,0,9,SNOW);
disk(0,1,0,6,SNOW);
ring(0,1,0,5,LIGHT_BLUE);
const gy = r => r<=6.5?1:(r<=9.5?0:-1);
for(let k=0;k<6;k++){
  const a=(30+60*k)*Math.PI/180;
  for(let r=7;r<=13;r++){
    const x=R(Math.cos(a)*r), z=R(Math.sin(a)*r);
    block(x,gy(r),z,ICE);
    if(r===9||r===11||r===13){
      [-1,1].forEach(s=>{
        const ba=a+s*0.9;
        for(let q=1;q<=3;q++){
          const bx=R(Math.cos(a)*r+Math.cos(ba)*q), bz=R(Math.sin(a)*r+Math.sin(ba)*q);
          const rr=Math.hypot(bx,bz);
          if(rr<=13.5) block(bx,gy(rr),bz,q===3?LIGHT_BLUE:ICE);
        }
      });
    }
  }
}

line(7,1,-3,7,29,-3,OAK_LOG);
cube(6,1,-4,8,1,-2,SNOW);
for(let i=0;i<26;i++){ const a=i*0.9; block(7+R(Math.cos(a)),3+i,-3+R(Math.sin(a)),i%3===0?WHITE:ICE); }
line(7,29,-3,8,30,-3,OAK_LOG); line(8,30,-3,10,30,-3,OAK_LOG); line(10,30,-3,11,29,-3,OAK_LOG);
line(11,29,-3,11,27,-3,OAK_LOG); line(11,27,-3,10,26,-3,OAK_LOG); line(10,26,-3,9,26,-3,OAK_LOG);
sphere(9,28,-3,1,ICE); block(9,28,-3,NEON_BLUE);
block(8,29,-3,SNOW); block(9,31,-3,SNOW); block(10,31,-3,SNOW);
icicle(11,26,-3,4,ICE); icicle(10,25,-3,3,ICE); icicle(9,25,-3,2,CYAN);

cube(-2,2,-4,-1,2,-1,MARBLE); cube(1,2,-2,2,2,1,MARBLE);
block(-2,2,-5,MARBLE); block(-1,2,-5,MARBLE);
cube(-2,3,-2,-1,5,-1,MARBLE); cube(1,3,0,2,5,1,MARBLE);
cube(-2,7,-2,-1,10,-1,BROWN); cube(1,7,0,2,10,1,BROWN);
block(-2,6,-2,BROWN); block(-1,6,-1,BROWN); block(1,6,0,BROWN); block(2,6,1,BROWN); block(1,6,1,BROWN);
block(-2,8,-3,LIGHT_GRAY); block(-1,9,-3,LIGHT_GRAY); block(2,9,0,LIGHT_GRAY);
cube(-2,11,-2,2,11,1,BROWN);
cube(-2,12,-2,2,12,1,BROWN); block(0,12,-2,IRON);

cube(-2,13,-1,2,16,1,BLUE);
cube(-3,17,-1,3,19,1,BLUE);
cube(-2,13,-2,2,14,-2,LIGHT_BLUE);
line(0,15,-2,0,18,-2,WHITE); line(0,16,-2,-2,18,-2,WHITE); line(0,16,-2,2,18,-2,WHITE);
block(-1,13,-3,WHITE); block(1,13,-3,WHITE);
block(-1,19,-2,WHITE); block(-1,18,-2,LIGHT_GRAY); block(1,19,-2,WHITE); block(1,18,-2,LIGHT_GRAY);
[-2,0,2].forEach(x=>block(x,11,-3,BLUE)); block(-1,11,2,BLUE); block(1,11,2,BLUE);
cube(-3,18,2,3,21,3,BLUE); cube(-3,21,2,3,21,3,WHITE); cube(-2,18,2,2,18,3,LIGHT_BLUE);
cube(-2,20,-2,2,20,2,WHITE);

cube(-2,22,-2,2,26,2,MARBLE); cube(-1,21,-2,1,21,2,MARBLE);
block(-1,24,-2,NEON_BLUE); block(1,24,-2,NEON_BLUE);
block(-2,25,-2,GRAY); block(-1,25,-2,GRAY); block(1,25,-2,GRAY); block(2,25,-2,GRAY);
block(0,23,-3,MARBLE);
block(-1,22,-2,PINK); block(0,22,-2,PINK); block(1,22,-2,PINK); block(2,23,-2,PINK);
block(-2,23,-2,LIGHT_BLUE);
block(-3,22,0,MARBLE); block(3,22,0,MARBLE); block(-4,23,0,MARBLE); block(4,23,0,MARBLE);
cube(-3,26,-3,3,27,3,SNOW);
cube(-3,23,-1,-3,25,2,SNOW); cube(3,23,-1,3,25,2,SNOW);
cube(-3,22,2,3,26,3,SNOW);
block(-2,25,-3,SNOW); block(0,25,-3,SNOW); block(2,24,-3,SNOW); block(-3,25,-2,SNOW); block(3,25,-2,SNOW);
cube(-2,28,-2,2,28,2,SNOW); cube(-1,29,-1,1,29,1,SNOW); block(0,30,0,WHITE);
line(-3,27,-1,-7,31,-1,WHITE); line(-3,28,1,-8,29,3,WHITE); line(-2,28,2,-4,32,4,WHITE);
line(3,27,1,6,30,3,WHITE); line(2,28,2,3,32,4,WHITE); line(0,28,2,0,31,5,WHITE);
line(-3,26,-3,-5,28,-4,SNOW); line(3,26,-3,5,28,-4,SNOW);
line(-3,24,2,-5,22,5,SNOW); line(3,24,2,5,22,5,SNOW);

thick(4,17,0,5,12,0,BLUE);
thick(5,12,0,5,14,-3,BLUE);
cube(5,14,-3,6,15,-2,WHITE);
cube(6,14,-4,8,15,-2,MARBLE); block(6,16,-3,MARBLE); block(8,16,-3,MARBLE);
thick(-5,17,0,-6,12,0,BLUE);
thick(-6,12,0,-6,13,-4,BLUE);
cube(-6,13,-4,-5,14,-3,WHITE);
cube(-7,13,-7,-5,13,-5,MARBLE);
block(-7,14,-7,MARBLE); block(-5,14,-7,MARBLE); block(-6,14,-8,MARBLE);
block(-6,15,-6,NEON_BLUE); block(-7,17,-6,ICE); block(-6,16,-7,WHITE);
snowflake(-8,21,-6,3,1,ICE,WHITE); block(-8,21,-6,NEON_BLUE);
block(-4,22,-7,ELECTRIC); block(-12,20,-5,ELECTRIC); block(-3,17,-7,ELECTRIC);

snowflake(0,20,10,11,2,ICE,CYAN);
cube(-1,19,10,1,21,11,LIGHT_BLUE); block(0,20,10,NEON_BLUE);
(function(){ const r=13; const n=Math.ceil(r*8); for(let i=0;i<n;i++){const a=i/n*Math.PI*2; const x=R(Math.cos(a)*r), y=R(20+Math.sin(a)*r); if(y<=33){ block(x,y,12,GLASS); } } })();

[[14,-1,6,3,16,2,1,ICE],[11,-1,10,3,20,-2,0,GLASS],[16,-1,2,2,9,2,-1,ICE],
 [13,-1,13,3,23,-1,-1,ICE],[14,-1,-6,2,6,1,0,CYAN],
 [-12,-1,4,3,15,-2,1,ICE],[-9,-1,12,2,12,0,1,LIGHT_BLUE],[-20,-1,-9,2,8,-2,0,ICE]
].forEach(c=>crystal(...c));
block(14,12,6,NEON_BLUE); block(-12,10,4,NEON_BLUE);

cylinder(-17,-1,8,1,11,OAK_LOG);
function br(a,b,c,d,e,f){ line(a,b,c,d,e,f,OAK_LOG); line(a,b+1,c,d,e+1,f,SNOW); }
br(-17,10,8,-21,15,7); br(-19,12,7,-17,18,9); br(-17,11,8,-14,16,9); br(-15,13,9,-13,19,9);
br(-17,12,8,-18,19,10); br(-18,16,9,-16,23,10); br(-17,9,8,-21,11,12); br(-20,10,10,-21,14,13);
icicle(-21,14,7,4,ICE); icicle(-14,15,9,3,ICE); icicle(-21,10,12,3,ICE); icicle(-13,18,9,3,GLASS); icicle(-21,13,13,3,ICE);
icicle(-17,17,9,3,ICE);
cube(-18,-1,6,-16,-1,10,SNOW);

sphere(-12,2,-9,3,SNOW); sphere(-12,6,-9,2,SNOW); sphere(-12,9,-9,2,SNOW);
disk(-12,12,-9,2,BLACK); cylinder(-12,13,-9,1,3,BLACK); ring(-12,13,-9,1,RED);
block(-13,10,-11,BLACK); block(-11,10,-11,BLACK); block(-12,9,-12,ORANGE); block(-12,9,-13,ORANGE);
block(-13,8,-11,BLACK); block(-12,8,-11,BLACK); block(-11,8,-11,BLACK);
block(-12,6,-11,BLACK); block(-12,4,-11,BLACK);
ring(-12,7,-9,2,RED); line(-11,7,-11,-11,3,-12,RED);
line(-14,6,-9,-17,9,-9,OAK_LOG); line(-10,6,-9,-7,8,-10,OAK_LOG);
line(-16,8,-9,-16,10,-9,OAK_LOG);

disk(11,-1,-10,4,ICE);
[[13,0,-9,2,6,1,0,ICE],[10,0,-12,2,4,-1,0,LIGHT_BLUE],[15,0,-11,2,8,2,-1,GLASS],[8,0,-9,1,3,0,0,ICE],[17,0,-8,2,5,1,0,CYAN]]
 .forEach(c=>crystal(...c));
disk(-4,-1,-11,2,ICE); block(2,0,-8,SNOW); block(-3,0,-6,SNOW);

for(let i=0;i<85;i++){ const a=i*0.45; const r=10+(i%5)*0.5; const y=3+i*0.32;
  const x=R(Math.cos(a)*r), z=R(Math.sin(a)*r-1);
  block(x,R(y),z,i%3===0?WHITE:(i%3===1?ICE:LIGHT_BLUE)); }
[[-14,22,-8],[14,26,-6],[-4,30,-10],[10,16,-12],[-16,14,-14],[17,20,-10],[3,32,-3],[-9,27,-2],[20,14,-4]].forEach(p=>flakeSmall(...p));