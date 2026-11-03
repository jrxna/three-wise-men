import * as T from './vendor/three.module.js';
import {moves, strikeEnvelope, stickVector} from './motion.js?v=character3';
import {combatPose,plantedLeg} from './pose.js?v=character3';
const $=id=>document.getElementById(id);
const roster=[{name:'Adarsh',color:0x9d9bff,css:'#aaa7ff',skin:0xdba987,height:1.17,width:.86,special:'Guitar smash',desc:'Tall riffs. Heavy hits.',hair:0x241c1b,glasses:true,beard:true},{name:'Gabriel',color:0xff856f,css:'#ff856f',skin:0x79503b,height:.94,width:1.35,special:'Beer bash',desc:'Big energy. Bigger combos.',hair:0x171719},{name:'Joel',color:0xbbf67b,css:'#bbf67b',skin:0xba8866,height:1.04,width:1,special:'Laptop smash',desc:'Ship code. Throw hands.',hair:0x211d20,glasses:true}];
let renderer;
try{renderer=new T.WebGLRenderer({canvas:$('arena'),antialias:true});}catch(e){$('error').hidden=false;throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0x0c1019);renderer.outputColorSpace=T.SRGBColorSpace;
const scene=new T.Scene();scene.fog=new T.FogExp2(0x101624,.022);
const camera=new T.PerspectiveCamera(42,1,.1,150);
scene.add(new T.HemisphereLight(0xc4d9ff,0x292437,2));const sun=new T.DirectionalLight(0xffd6b2,3);sun.position.set(4,12,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12});scene.add(sun);
const blue=new T.PointLight(0x729dff,25,22);blue.position.set(-6,4,-3);scene.add(blue);
const mats=new Map();function mat(c,metalness=0){let k=c+':'+metalness;if(!mats.has(k))mats.set(k,new T.MeshStandardMaterial({color:c,roughness:.65,metalness}));return mats.get(k);}
function box(parent,x,y,z,w,h,d,c){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function ball(parent,x,y,z,r,c){const m=new T.Mesh(new T.SphereGeometry(r,16,12),mat(c));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
const world=new T.Group();scene.add(world);box(world,0,-.2,0,17,.4,11,0x252b3c);box(world,0,-.45,0,18,.15,12,0x111725);
for(let x=-8;x<9;x+=2)box(world,x,.004,0,.018,.008,10,0x3b4358);for(let z=-5;z<6;z+=2)box(world,0,.006,z,16,.008,.018,0x3b4358);
for(const z of [-4.8,4.8]){box(world,0,.13,z,16,.25,.18,0x3a4256);box(world,0,.28,z,16,.025,.055,0xbbf67b);}for(const x of [-8,8])box(world,x,.13,0,.18,.25,9.6,0x3a4256);
box(world,-6,1,-3,2.5,2,2.3,0x424958);box(world,-6,2.07,-3,2.8,.14,2.6,0x697282);const tank=new T.Mesh(new T.CylinderGeometry(.8,.8,1.8,24),mat(0x242a32));tank.position.set(5.7,.9,-3);tank.castShadow=true;world.add(tank);for(const y of [.3,.6,.9,1.2,1.5]){const band=new T.Mesh(new T.TorusGeometry(.805,.025,6,32),mat(0x4b5361));band.rotation.x=Math.PI/2;band.position.set(5.7,y,-3);world.add(band);}
const ring=new T.Mesh(new T.RingGeometry(4.7,4.73,80),new T.MeshBasicMaterial({color:0x8c9cb9,transparent:true,opacity:.3,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.012;scene.add(ring);
let seed=42;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(let i=0;i<65;i++){const a=rand()*Math.PI*2,r=22+rand()*35,x=Math.cos(a)*r,z=Math.sin(a)*r,h=3+rand()*20;box(world,x,h/2-6,z,2+rand()*4,h,2+rand()*4,0x192234);if(i%2===0)for(let y=0;y<h-2;y+=2)box(world,x,h/2-6+y-h/2+2,z+2,1.2,.12,.04,0x4c637f);}
const moon=ball(scene,-17,21,-32,2.6,0xe1dfd1);moon.material=new T.MeshBasicMaterial({color:0xc5cddd});
function capsule(parent,x,y,z,r,length,color){const m=new T.Mesh(new T.CapsuleGeometry(r,length,8,16),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function fighter(data){const g=new T.Group();scene.add(g);const body=new T.Group();g.add(body);body.scale.set(data.width,data.height,1);
const chest=new T.Group();body.add(chest);const hips=new T.Group();body.add(hips);
const torso=ball(chest,0,1.27,0,data.name==='Gabriel'?.49:.4,data.color);torso.scale.set(data.name==='Gabriel'?1.08:.94,data.name==='Gabriel'?1.12:1.24,.66);
ball(hips,0,.81,0,.35,0x202532).scale.set(1,.55,.65);capsule(chest,0,1.79,0,.11,.12,data.skin);
// Face details and hair follow a separate head joint instead of the entire body.
const head=new T.Group();head.position.set(0,2.08,0);chest.add(head);
ball(head,0,0,0,.3,data.skin).scale.set(.88,1.12,.86);
for(const side of [-1,1]){ball(head,side*.265,-.015,0,.065,data.skin).scale.set(.6,1,.8);ball(head,side*.105,.025,.25,.05,0xf5eddd).scale.set(1,.8,.45);ball(head,side*.105,.025,.273,.024,0x161b24);const brow=box(head,side*.108,.105,.254,.105,.025,.025,data.hair);brow.rotation.z=side*-.12;}
ball(head,0,-.05,.27,.06,data.skin).scale.set(.65,1,1.2);const mouth=box(head,0,-.16,.236,.11,.018,.015,0x694839);mouth.rotation.z=.025;
ball(head,0,.17,-.045,.285,data.hair).scale.set(.99,.65,.94);
for(let i=0;i<5;i++)ball(head,(i-2)*.085,.205+Math.sin(i)*.025,.025,.105,data.hair).scale.set(.9,1.1,1.5);
if(data.glasses){for(const x of [-.112,.112]){const lens=new T.Mesh(new T.TorusGeometry(.09,.013,6,20),mat(0x101622));lens.position.set(x,.032,.285);head.add(lens);}box(head,0,.035,.287,.055,.018,.02,0x101622);}
if(data.beard){const beard=ball(head,0,-.15,.065,.235,data.hair);beard.scale.set(.92,.61,.88);ball(head,0,-.075,.245,.08,data.skin).scale.set(1.15,.5,.3);}
const arms=[],legs=[],elbows=[],knees=[],hands=[],feet=[];
for(const side of [-1,1]){
 const shoulder=new T.Group();shoulder.position.set(side*.47,1.57,0);chest.add(shoulder);
 const sleeve=new T.Mesh(new T.CapsuleGeometry(.125,.12,6,12),mat(data.color));sleeve.position.y=-.17;shoulder.add(sleeve);
 const elbow=new T.Group();elbow.position.y=-.32;shoulder.add(elbow);ball(elbow,0,0,0,.12,data.skin);
 const forearm=new T.Mesh(new T.CapsuleGeometry(.105,.12,6,12),mat(data.skin));forearm.position.y=-.13;elbow.add(forearm);
 const hand=new T.Group();hand.position.y=-.3;elbow.add(hand);ball(hand,0,0,0,.15,data.skin);
 arms.push(shoulder);elbows.push(elbow);hands.push(hand);
 const hip=new T.Group();hip.position.set(side*.21,.76,0);hips.add(hip);capsule(hip,0,-.17,0,.13,.12,0x252a38);
 const knee=new T.Group();knee.position.y=-.34;hip.add(knee);ball(knee,0,0,0,.125,0x252a38);capsule(knee,0,-.16,0,.115,.13,0x252a38);const foot=new T.Group();foot.position.y=-.34;knee.add(foot);ball(foot,0,-.005,.085,.16,0x161d2a).scale.set(.85,.55,1.55);ball(foot,0,-.045,.09,.16,0xe1e6df).scale.set(.86,.18,1.53);feet.push(foot);legs.push(hip);knees.push(knee);
}
const prop=new T.Group();hands[1].add(prop);prop.visible=false;prop.position.set(0,-.03,.12);
let lid=null;
if(data.name==='Adarsh'){
 ball(prop,0,-.62,0,.3,0xbc7647).scale.set(1,1.25,.35);box(prop,0,-.12,0,.12,.8,.08,0x51352b);box(prop,0,.32,0,.18,.18,.09,0x51352b);ball(prop,0,-.6,.11,.09,0x25202a);
 for(let i=0;i<4;i++)box(prop,(i-1.5)*.016,-.23,.061,.004,1.05,.004,0xd8d6bc);
}else if(data.name==='Joel'){
 box(prop,0,0,0,.68,.05,.46,0xb4c3c9);for(let row=0;row<3;row++)for(let col=0;col<7;col++)box(prop,(col-3)*.065,.029,(row-1)*.07,.045,.006,.045,0x343c4b);
 lid=new T.Group();lid.position.z=-.22;prop.add(lid);box(lid,0,.22,0,.68,.44,.045,0x202830);box(lid,0,.23,.026,.55,.32,.012,0xbbf67b);
 for(let i=0;i<3;i++)box(lid,-.06,.29-i*.055,.035,.27-i*.04,.014,.006,0x325b36);
}else{
 const mug=new T.Mesh(new T.CylinderGeometry(.18,.16,.48,20),new T.MeshPhysicalMaterial({color:0xe7c584,transparent:true,opacity:.82,roughness:.12,metalness:.05}));prop.add(mug);const beer=new T.Mesh(new T.CylinderGeometry(.145,.13,.35,16),mat(0xdca438));beer.position.y=-.035;prop.add(beer);ball(prop,0,.26,0,.18,0xf3e7cc).scale.y=.35;const handle=new T.Mesh(new T.TorusGeometry(.15,.04,8,16),mat(0xf3d18a));handle.position.x=.22;prop.add(handle);
}
const trail=new T.Mesh(new T.TorusGeometry(.32,.012,6,24,Math.PI*1.1),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.4}));hands[1].add(trail);trail.visible=false;
const shield=new T.Mesh(new T.SphereGeometry(.65,20,12),new T.MeshBasicMaterial({color:data.color,transparent:true,opacity:.1,wireframe:false}));shield.position.set(0,1.4,.35);shield.scale.set(1,1,.35);g.add(shield);shield.visible=false;
for(const part of chest.children)part.position.y-=1;chest.position.y=1;
return {data,g,body,chest,hips,head,arms,legs,elbows,knees,hands,feet,shield,prop,lid,trail,hp:100,energy:100,cool:0,stun:0,attack:null,block:false,wins:0,velocity:new T.Vector3(),lastPosition:new T.Vector3(),gait:0,speed:0,punchHand:0,guard:0,ai:0};}
let previews=roster.map(fighter),player,enemy,selected=2,state='selection',previous='fight',round=1,time=90,phase=0,clock=0,sound=true,audio,shake=0,hitstop=0,calloutTimer=0;
const keys=new Set(),fx=[];const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function select(i){selected=i;$('fighters').innerHTML=roster.map((r,j)=>`<button class="fighter-card" aria-pressed="${j===i}" style="--accent:${r.css}" data-fighter="${j}"><span class="fighter-number">0${j+1}</span><strong>${r.name}</strong><small>${r.special}</small></button>`).join('');$('opponent').innerHTML=roster.map((r,j)=>j!==i?`<option value="${j}">${r.name}</option>`:'').join('');document.querySelectorAll('[data-fighter]').forEach(b=>b.onclick=()=>select(+b.dataset.fighter));}
select(selected);
function beep(freq=160,duration=.1){if(!sound)return;try{audio??=new AudioContext();audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.type='triangle';osc.frequency.setValueAtTime(freq,audio.currentTime);osc.frequency.exponentialRampToValueAtTime(50,audio.currentTime+duration);gain.gain.setValueAtTime(.08,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+duration);}catch{}}
document.addEventListener('pointerdown',()=>{beep(260,.025);},{once:true});
function announce(text){$('announcement').textContent=text;$('announcement').classList.add('show');}
function removeFighters(){for(const f of previews)f.g.visible=false;for(const f of [player,enemy])if(f){scene.remove(f.g);f.g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&![...mats.values()].includes(o.material))o.material.dispose();});}}
function start(){if(!touchDevice())return;beep(400,.15);removeFighters();player=fighter(roster[selected]);enemy=fighter(roster[+$('opponent').value]);round=1;document.querySelector('[data-action=special]').textContent=player.data.special;document.body.classList.add('playing');$('selection').hidden=true;$('result').hidden=true;$('paused').hidden=true;for(const id of ['hud','pause','fight-help','touch'])$(id).hidden=false;$('player-name').textContent=player.data.name;$('enemy-name').textContent=enemy.data.name;newRound();}
function newRound(){for(const [f,x] of [[player,-1.5],[enemy,1.5]]){f.hp=100;f.energy=100;f.cool=0;f.stun=0;f.attack=null;f.g.position.set(x,0,0);f.body.rotation.z=0;f.lastPosition.copy(f.g.position);f.speed=0;f.recoil=0;}time=90;state='countdown';phase=2.5;resetControls();announce(`Round ${round}`);updateHUD();}
$('start').onclick=start;$('rematch').onclick=start;
function selection(){state='selection';removeFighters();previews.forEach(f=>f.g.visible=true);document.body.classList.remove('playing');$('selection').hidden=false;for(const id of ['result','paused','hud','pause','fight-help','touch'])$(id).hidden=true;$('announcement').classList.remove('show');resetControls();}
$('quit').onclick=selection;$('reselect').onclick=selection;
function pause(){if(state==='paused'&&!touchDevice())return;if(state==='fight'||state==='countdown'){previous=state;state='paused';$('paused').hidden=false;resetControls();}else if(state==='paused'){state=previous;$('paused').hidden=true;}}
$('pause').onclick=pause;$('resume').onclick=pause;document.addEventListener('visibilitychange',()=>{if(document.hidden&&(state==='fight'||state==='countdown'))pause();});window.addEventListener('blur',()=>{resetControls();if(state==='fight')pause();});
const attacks=moves;
function showMove(f){const el=$('move-callout');el.style.setProperty('--move-color',f.data.css);el.replaceChildren();const small=document.createElement('small');small.textContent=f.data.name;const name=document.createElement('strong');name.textContent=f.data.special;el.append(small,name);el.classList.remove('fire');void el.offsetWidth;el.classList.add('fire');clearTimeout(calloutTimer);calloutTimer=setTimeout(()=>el.classList.remove('fire'),1050);}
function attack(f,kind){if(!f||state!=='fight'||f.attack||f.stun>0||f.cool>0||(f===player&&keys.has(' ')))return;const a=attacks[kind];if(f.energy<a.cost)return;f.energy-=a.cost;f.attack={...a,kind,t:0,hitDone:false,hand:kind==='punch'?(f.punchHand=1-f.punchHand):1};f.block=false;if(kind==='special')showMove(f);beep(kind==='special'?500:220,.06);}
const stick={x:0,y:0,pointer:null},heldActions=new Map();
function resetControls(){keys.clear();heldActions.clear();stick.x=stick.y=0;stick.pointer=null;const knob=$('stick-knob');if(knob)knob.style.transform='translate(-50%,-50%)';document.querySelectorAll('.pressed').forEach(b=>b.classList.remove('pressed'));}
window.addEventListener('keydown',e=>{if(e.key==='Escape')pause();});
const joystick=$('joystick');
function moveStick(e){if(e.pointerId!==stick.pointer)return;const rect=joystick.getBoundingClientRect(),v=stickVector(e.clientX-rect.left-rect.width/2,e.clientY-rect.top-rect.height/2);stick.x=v.x;stick.y=v.y;$('stick-knob').style.transform=`translate(calc(-50% + ${v.x*42}px),calc(-50% + ${v.y*42}px))`;}
joystick.onpointerdown=e=>{e.preventDefault();if(stick.pointer!==null)return;stick.pointer=e.pointerId;joystick.setPointerCapture(e.pointerId);moveStick(e);};joystick.onpointermove=moveStick;
joystick.onpointerup=joystick.onpointercancel=joystick.onlostpointercapture=e=>{if(e.pointerId===stick.pointer){stick.pointer=null;stick.x=stick.y=0;$('stick-knob').style.transform='translate(-50%,-50%)';}};
document.querySelectorAll('[data-hold]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.hold);b.classList.add('pressed');};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>{keys.delete(b.dataset.hold);b.classList.remove('pressed');};});
document.querySelectorAll('[data-action]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);b.classList.add('pressed');if(b.dataset.action!=='special')heldActions.set(e.pointerId,b.dataset.action);attack(player,b.dataset.action);};b.onpointerup=b.onpointercancel=b.onlostpointercapture=e=>{heldActions.delete(e.pointerId);b.classList.remove('pressed');};});
function burst(pos,color,count=12){for(let i=0;i<count;i++){const m=ball(scene,pos.x,pos.y,pos.z,.045+Math.random()*.06,color);fx.push({m,v:new T.Vector3((Math.random()-.5)*5,Math.random()*4,(Math.random()-.5)*5),life:.45,max:.45});}}
function impact(f,target,a){const d=f.g.position.distanceTo(target.g.position);if(d>a.range)return;const blocked=target.block;target.hp=Math.max(0,target.hp-a.damage*(blocked?.18:1));target.stun=blocked?.08:.22;const dir=target.g.position.clone().sub(f.g.position).normalize();target.g.position.addScaledVector(dir,blocked?.08:.3);burst(target.g.position.clone().add(new T.Vector3(0,1.4,0)),blocked?0x97b5c7:f.data.color,a.kind==='special'?25:10);if(a.kind==='special'){
 const at=target.g.position.clone().add(new T.Vector3(0,2.05*target.data.height,0));
 if(f.data.name==='Gabriel'){a.shattered=true;for(let i=0;i<18;i++){const shard=new T.Mesh(new T.TetrahedronGeometry(.05+Math.random()*.045),new T.MeshStandardMaterial({color:i%3?0xd9e9e6:0xf6e8c7,transparent:true,opacity:.65,roughness:.2}));shard.position.copy(at);scene.add(shard);fx.push({m:shard,v:new T.Vector3((Math.random()-.5)*5,Math.random()*3,(Math.random()-.5)*5),life:.65,max:.65,shard:true});}burst(at,0xf3d797,16);beep(1300,.08);}
 else if(f.data.name==='Joel'){for(let i=0;i<14;i++){const cube=box(scene,at.x,at.y,at.z,.07,.07,.07,i%2?0xbbf67b:0xf1f5ed);fx.push({m:cube,v:new T.Vector3((Math.random()-.5)*4,Math.random()*3,(Math.random()-.5)*4),life:.55,max:.55});}beep(880,.14);}
 else{burst(at,0xe6bc85,18);beep(330,.2);beep(495,.22);beep(660,.18);}
 }shake=reduced?0:(a.kind==='special'?.22:.1);hitstop=blocked?.025:.055;target.recoil=blocked?.12:.28;if(a.kind==='special'){const ring=new T.Mesh(new T.RingGeometry(.3,.39,36),new T.MeshBasicMaterial({color:f.data.color,side:T.DoubleSide,transparent:true,opacity:.8}));ring.position.copy(target.g.position).add(new T.Vector3(0,1.4,0));ring.lookAt(camera.position);scene.add(ring);fx.push({m:ring,v:new T.Vector3(),life:.35,max:.35,ring:true});}beep(blocked?90:kindTone(a.kind),.13);$('hit-label').textContent=blocked?'BLOCK':a.kind==='special'?f.data.special.toUpperCase():'';setTimeout(()=>$('hit-label').textContent='',500);}
function kindTone(k){return k==='special'?360:130;}
function updateFighter(f,target,dt,moving){f.energy=Math.min(100,f.energy+dt*(f.block?3:12));f.cool=Math.max(0,f.cool-dt);f.stun=Math.max(0,f.stun-dt);f.g.position.x=T.MathUtils.clamp(f.g.position.x,-1.85,1.85);f.g.position.z=T.MathUtils.clamp(f.g.position.z,-2.8,2.8);const facing=Math.atan2(target.g.position.x-f.g.position.x,target.g.position.z-f.g.position.z);const angle=Math.atan2(Math.sin(facing-f.g.rotation.y),Math.cos(facing-f.g.rotation.y));f.g.rotation.y+=angle*(1-Math.exp(-dt*14));
const displacement=f.g.position.clone().sub(f.lastPosition);f.lastPosition.copy(f.g.position);const speed=dt>0?Math.min(3.6,displacement.length()/dt):f.speed;f.speed=T.MathUtils.damp(f.speed,moving?speed:0,10,dt);f.gait+=dt*f.speed*4.3;
const forward=dt>0?(displacement.x*Math.sin(f.g.rotation.y)+displacement.z*Math.cos(f.g.rotation.y))/dt:0;
const sideways=dt>0?(displacement.x*Math.cos(f.g.rotation.y)-displacement.z*Math.sin(f.g.rotation.y))/dt:0;
const walk=Math.min(1,f.speed/2.7),stride=.19*walk,breath=Math.sin(clock*2.8)*.012;
const pose={chest:[.025,Math.sin(f.gait)*.06*walk,Math.sin(f.gait)*.035*walk],offset:[Math.sin(f.gait)*.025*walk,breath+Math.abs(Math.sin(f.gait))*.035*walk,0],arms:[[-.55,0,.12],[-.55,0,-.12]],elbows:[-1.2,-1.2],legs:[[0,0,0],[0,0,0]],knees:[0,0],head:[0,0,0]};
for(let i=0;i<2;i++){const phase=f.gait+i*Math.PI,z=Math.cos(phase)*stride*Math.sign(forward||1)+(i?-.05:.05),lift=Math.max(0,Math.sin(phase))*.11*walk,ik=plantedLeg(z,lift);pose.legs[i]=[ik.hip,0,-Math.cos(phase)*.12*walk*Math.sign(sideways)];pose.knees[i]=ik.knee;pose.arms[i][0]+=Math.cos(phase)*.25*walk;}
f.prop.visible=!!f.attack&&f.attack.kind==='special'&&!f.attack.shattered;f.trail.visible=!!f.attack&&f.attack.t>f.attack.hit*.68&&f.attack.t<f.attack.hit+.09;if(f.trail.visible){f.trail.parent.remove(f.trail);(f.attack.kind==='kick'?f.feet[1]:f.hands[f.attack.hand]).add(f.trail);f.trail.rotation.y=clock*12;}f.guard=T.MathUtils.damp(f.guard,f.block?1:0,22,dt);f.shield.visible=f.guard>.1;f.shield.material.opacity=.06*f.guard+f.recoil*.25;
if(f.block){pose.chest=[.18,-.2,0];pose.offset=[0,-.11,-.04];pose.arms=[[-1.05,-.25,-.1],[-1.05,.25,.1]];pose.elbows=[-1.5,-1.5];pose.head=[.14,.1,0];pose.legs=[[-.25,0,.06],[-.15,0,-.06]];pose.knees=[.55,.4];}
if(f.attack){const a=f.attack;a.t+=dt;Object.assign(pose,combatPose(a.kind,a.t,a,a.hand));
 if(a.kind==='special'){const swing=strikeEnvelope(a.t,a),arc=swing.strike*(1-swing.recover);f.prop.rotation.set(-.7*swing.wind+2.1*arc,0,-.12);if(f.lid)f.lid.rotation.x=-.15+arc*.9;if(f.data.name==='Gabriel'){const e=strikeEnvelope(a.t,a),w=e.wind*(1-e.recover),s=e.strike*(1-e.recover);pose.arms[1]=[-.65*w-.9*s,-.8*w+1.6*s,-.1];pose.elbows[1]=-1.25*w+1.15*s;pose.chest[1]=-.7*w+1.35*s;f.prop.rotation.x=-.3;}}
 if(a.t>=a.hit&&!a.hitDone){a.hitDone=true;impact(f,target,a);}
 if(a.t>=a.duration){f.attack=null;f.cool=.09;}
}
f.recoil=Math.max(0,(f.recoil||0)-dt*1.8);pose.chest[0]-=f.recoil*.9;pose.offset[2]-=f.recoil*.4;pose.head[0]-=f.recoil*.6;
const blend=1-Math.exp(-dt*(f.attack?38:18));
function rotate(joint,angles){['x','y','z'].forEach((axis,i)=>joint.rotation[axis]=T.MathUtils.lerp(joint.rotation[axis],angles[i],blend));}
rotate(f.chest,pose.chest);rotate(f.head,pose.head);f.body.position.lerp(new T.Vector3(...pose.offset),blend);f.hips.rotation.y=T.MathUtils.lerp(f.hips.rotation.y,pose.chest[1]*.22,blend);
for(let i=0;i<2;i++){rotate(f.arms[i],pose.arms[i]);f.elbows[i].rotation.x=T.MathUtils.lerp(f.elbows[i].rotation.x,pose.elbows[i],blend);rotate(f.legs[i],pose.legs[i]);f.knees[i].rotation.x=T.MathUtils.lerp(f.knees[i].rotation.x,pose.knees[i],blend);f.feet[i].rotation.x=-f.legs[i].rotation.x-f.knees[i].rotation.x;f.feet[i].rotation.z=-f.legs[i].rotation.z;}
}
function updateHUD(){for(const [prefix,f]of[['player',player],['enemy',enemy]]){$(prefix+'-health').style.width=f.hp+'%';$(prefix+'-energy').style.width=f.energy+'%';$(prefix+'-rounds').textContent=Array.from({length:2},(_,i)=>i<f.wins?'●':'○').join(' ');$(prefix+'-special').textContent=f.data.special+(f.energy>=42?' · Ready':' · Charging');}$('timer').textContent=Math.ceil(time);$('round-label').textContent='Round '+round;}
function endRound(){resetControls();state='roundEnd';phase=2.7;const winner=player.hp===enemy.hp?null:player.hp>enemy.hp?player:enemy;if(winner)winner.wins++;announce(winner?winner.data.name+' takes the round':'Draw. Run it back.');updateHUD();}
function animate(dt){clock+=dt;if(state==='selection'){previews.forEach((f,i)=>{f.g.position.set(i*2.1+1,0,0);f.g.rotation.y=-.25;f.body.position.y=Math.sin(clock*2+i)*.04;f.arms.forEach((a,j)=>a.rotation.z=Math.sin(clock*1.5+i+j)*.06);});}
if(state==='countdown'){phase-=dt;if(phase<.8)announce('FIGHT');if(phase<=0){state='fight';$('announcement').classList.remove('show');}}
if(state==='fight'){time=Math.max(0,time-dt);player.block=keys.has(' ')&&!player.attack&&player.stun<=0;let dx=stick.x,dz=stick.y;const strength=Math.hypot(dx,dz),moving=strength>.12;if(moving&&!player.attack&&player.stun<=0){player.g.position.x+=dx*dt*(player.block?1.4:3.6);player.g.position.z+=dz*dt*(player.block?1.4:3.6);}for(const kind of heldActions.values())attack(player,kind);
const diff=$('difficulty').value,rate=diff==='casual'?.65:diff==='hard'?1.4:1;const delta=player.g.position.clone().sub(enemy.g.position),dist=delta.length();enemy.ai-=dt;let em=false;enemy.block=(enemy.guardUntil||0)>clock&&!enemy.attack;if(enemy.stun<=0&&!enemy.attack){if(dist>1.45){enemy.g.position.addScaledVector(delta.normalize(),dt*2.4*rate);em=true;}if(enemy.ai<=0){enemy.ai=(.3+Math.random()*.65)/rate;if(dist<3.1&&Math.random()<.76)attack(enemy,enemy.energy>45&&Math.random()<.28?'special':dist<1.65&&Math.random()<.6?'punch':'kick');}if(player.attack&&dist<2&&clock>(enemy.guardDecision||0)){enemy.guardDecision=clock+.45;if(Math.random()<.35*rate)enemy.guardUntil=clock+.55;}}
const separation=player.g.position.clone().sub(enemy.g.position);if(separation.length()<.85){separation.normalize().multiplyScalar((.85-player.g.position.distanceTo(enemy.g.position))*.5);player.g.position.add(separation);enemy.g.position.sub(separation);}
updateFighter(player,enemy,dt,moving);updateFighter(enemy,player,dt,em);updateHUD();if(player.hp<=0||enemy.hp<=0||time<=0)endRound();}
if(state==='roundEnd'){phase-=dt;const loser=player.hp<enemy.hp?player:enemy;if(loser.hp<=0)loser.body.rotation.z=T.MathUtils.lerp(loser.body.rotation.z,1.25,dt*3);if(phase<=0){if(player.wins>=2||enemy.wins>=2){state='matchEnd';$('announcement').classList.remove('show');$('result').hidden=false;const won=player.wins>=2;$('result-title').textContent=won?'Well played, '+player.data.name+'.':enemy.data.name+' wins this one.';$('result-copy').textContent=`${player.wins} – ${enemy.wins}. Same friends. Slightly bruised egos. Fancy a rematch?`;}else{round++;newRound();}}}
for(let i=fx.length-1;i>=0;i--){const p=fx[i];p.life-=dt;p.m.position.addScaledVector(p.v,dt);if(p.shard){p.m.rotation.x+=dt*8;p.m.rotation.z+=dt*6;p.m.material.opacity=.65*p.life/p.max;}if(p.ring){p.m.scale.setScalar(1+(1-p.life/p.max)*4);p.m.material.opacity=p.life/p.max;}else{p.v.y-=dt*6;p.m.scale.setScalar(Math.max(0,p.life/p.max));}if(p.life<=0){scene.remove(p.m);p.m.geometry.dispose();if(p.ring||p.shard)p.m.material.dispose();fx.splice(i,1);}}
const mobile=true;const target=state==='selection'?new T.Vector3(3.1,1,0):new T.Vector3((player?.g.position.x+enemy?.g.position.x)/2||0,1.15,((player?.g.position.z+enemy?.g.position.z)/2||0)*.4);const desired=state==='selection'?new T.Vector3(5,5,17):new T.Vector3(target.x*.45,7.8,target.z+13.5);camera.position.lerp(desired,.08);camera.lookAt(target);if(shake>0){camera.position.x+=(Math.random()-.5)*shake;shake=Math.max(0,shake-dt*.6);}renderer.render(scene,camera);}
function hasTouch(){return navigator.maxTouchPoints>0&&matchMedia('(pointer: coarse)').matches;}
function touchDevice(){return hasTouch()&&innerWidth<=600&&innerHeight>innerWidth;}
function updateTouchGate(){const rotate=hasTouch()&&innerWidth>=innerHeight;$('rotate').hidden=!rotate;if(!touchDevice()&&(state==='fight'||state==='countdown'))pause();$('start').disabled=!touchDevice();$('start').innerHTML=touchDevice()?'Enter Paripoorna <span>↗</span>':'Open on a touchscreen phone';}
function resize(){const rect=$('game').getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);updateTouchGate();camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();}window.addEventListener('resize',resize);new ResizeObserver(resize).observe($('game'));camera.position.set(10,6.5,15);resize();let last=performance.now();renderer.setAnimationLoop(now=>{const dt=Math.min((now-last)/1000,.04);last=now;if(hitstop>0){hitstop-=dt;animate(0);}else animate(dt);});
