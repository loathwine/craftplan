// sugar-skull-fable — prompt:
// a Day of the Dead sugar skull...

// Day of the Dead sugar skull — faces north (-Z)
const M = new Map();
function put(x,y,z,id){ M.set(x+','+y+','+z,[x,y,z,id]); }

// clear trees in the footprint and the camera path to the north
cube(-12,0,-13,12,8,10,AIR);
cube(-22,0,-22,22,9,-13,AIR);

// ---- skull volume ----
function ell(x,y,z,cx,cy,cz,rx,ry,rz){const a=(x-cx)/rx,b=(y-cy)/ry,c=(z-cz)/rz;return a*a+b*b+c*c<=1;}
function inside(x,y,z){
  return ell(x,y,z,0,17,1,9,8.5,8) ||   // cranium
         ell(x,y,z,0,10,1,6.5,5,6)  ||   // maxilla / cheeks
         ell(x,y,z,0,4,0,5.5,3,5);       // mandible
}
function exposed(x,y,z){
  return !inside(x+1,y,z)||!inside(x-1,y,z)||!inside(x,y+1,z)||!inside(x,y-1,z)||!inside(x,y,z+1)||!inside(x,y,z-1);
}

// ---- front-projection decoration ----
function decor(x,y){
  // eyes with petal rings
  for (const ex of [-4,4]) {
    const dx=x-ex, dy=y-17, d=Math.sqrt(dx*dx+dy*dy);
    if (d<=2.7) return 'EYE';
    if (d<=3.9) { const a=Math.atan2(dy,dx); const p=Math.floor((a+Math.PI)/(Math.PI/4)); return p%2 ? MAGENTA : PINK; }
  }
  // nose (inverted heart)
  if (y===12 && (Math.abs(x)===1||Math.abs(x)===2)) return BLACK;
  if (y===11 && Math.abs(x)<=2) return BLACK;
  if (y===10 && Math.abs(x)<=1) return BLACK;
  if (y===9 && x===0) return BLACK;
  // teeth
  if (y>=4 && y<=7 && Math.abs(x)<=5) {
    if (y===7 || y===4) return BLACK;
    return (Math.abs(x)%2===1) ? BLACK : WHITE;
  }
  // forehead flower
  { const d=Math.sqrt(x*x+(y-22)*(y-22));
    if (d<=0.9) return YELLOW;
    if (d<=2.5) { const a=Math.atan2(y-22,x); const p=Math.floor((a+Math.PI)/(Math.PI/3)); return p%2 ? ORANGE : RED; } }
  // cheek swirls
  for (const cx of [-5.5,5.5]) {
    const dx=x-cx, dy=y-11, d=Math.sqrt(dx*dx+dy*dy);
    if (d<1) return PURPLE;
    if (d>=1.5 && d<=2.4) return CYAN;
  }
  // temple diamonds
  for (const tx of [-8,8]) if (Math.abs(x-tx)+Math.abs(y-19)<=1) return LIGHT_BLUE;
  // chin
  if ((y===2||y===3) && Math.abs(x)<=1) return CYAN;
  if (y===2 && Math.abs(x)===3) return PURPLE;
  // brow dots
  if (y===20 && (Math.abs(x)===6)) return LIME;
  return null;
}

const eyeHoles = [];
for (let x=-10;x<=10;x++) for (let y=0;y<=27;y++) for (let z=-9;z<=10;z++) {
  if (!inside(x,y,z) || !exposed(x,y,z)) continue;
  const front = !inside(x,y,z-1);
  let id = WHITE;
  if (front) {
    const d = decor(x,y);
    if (d==='EYE') { eyeHoles.push([x,y,z]); continue; }
    if (d) id = d;
  } else if (Math.abs(x)>=8 && !inside(x+Math.sign(x),y,z)) {
    // side-of-skull dot lattice
    if (((y%3)+3)%3===0 && ((z%3)+3)%3===0) id = CYAN;
    else if (((y%3)+3)%3===1 && ((z%3)+3)%3===1) id = MAGENTA;
  }
  put(x,y,z,id);
}
// recessed black eye sockets with a small flower dot
for (const [x,y,z] of eyeHoles) {
  const ex = x<0 ? -4 : 4;
  const d = Math.sqrt((x-ex)*(x-ex)+(y-17)*(y-17));
  put(x,y,z+1,BLACK);
  put(x,y,z+2,BLACK);
  if (d<=0.8) put(x,y,z+1,YELLOW);
  else if (d<=1.6) put(x,y,z+1,PURPLE);
}
for (const v of M.values()) block(v[0],v[1],v[2],v[3]);

// ---- ofrenda altar ----
for (let x=-12;x<=12;x++) for (let z=-9;z<=10;z++) {
  const border = (Math.abs(x)===12 || z===-9 || z===10);
  const stripe = ((x+z)%6+6)%6===0;
  block(x,0,z, border ? ORANGE : (stripe ? MAGENTA : PURPLE));
}

// marigolds (cempasúchil) along the altar edges
let k=0;
for (let x=-12;x<=12;x+=3) { sphere(x,2,-8,1,(k++%2)?YELLOW:ORANGE); block(x,1,-8,GREEN); }
for (let z=-5;z<=7;z+=3) {
  sphere(-12,2,z,1,(k++%2)?YELLOW:ORANGE); block(-12,1,z,GREEN);
  sphere(12,2,z,1,(k++%2)?YELLOW:ORANGE); block(12,1,z,GREEN);
}

// small sugar skulls flanking the big one
for (const sx of [-9,9]) {
  hollowSphere(sx,3,-2,2,WHITE);
  block(sx-1,3,-4,BLACK); block(sx+1,3,-4,BLACK);
  block(sx,2,-4,BLACK);
  block(sx,5,-2,PINK);
}

// candles
for (const cx of [-11,11]) {
  cube(cx,1,-6,cx,3,-6,WHITE);
  block(cx,4,-6,FIRE);
  cube(cx,1,4,cx,2,4,WHITE);
  block(cx,3,4,FIRE);
}

// papel picado banner behind
cube(-20,0,11,-20,28,11,OAK_LOG);
cube(20,0,11,20,28,11,OAK_LOG);
line(-20,28,11,20,28,11,BLACK);
const flagColors=[MAGENTA,CYAN,YELLOW,PINK,ORANGE,LIME,PURPLE,RED,LIGHT_BLUE,MAGENTA];
let fi=0;
for (let x=-18;x<=18;x+=4) {
  const c=flagColors[fi++%flagColors.length];
  cube(x-1,26,11,x+1,27,11,c);
  block(x,25,11,c);
  block(x,26,11,WHITE);
}