import {strikeEnvelope} from './motion.js?v=character3';
// Local joint rotations: negative shoulder/hip X points a limb forward.
export function combatPose(kind,t,move,hand=1){
 const e=strikeEnvelope(t,move),w=e.wind*(1-e.recover),s=e.strike*(1-e.recover);
 const p={chest:[0,0,0],offset:[0,0,0],arms:[[-.45,0,.1],[-.45,0,-.1]],elbows:[-1.25,-1.25],legs:[[0,0,0],[0,0,0]],knees:[.12,.12],head:[0,0,0]};
 if(kind==='punch'){
  const sign=hand===1?1:-1;p.chest=[.08*s,sign*(-.38*w+.85*s),-sign*.06*s];p.offset=[0,-.04*w,.2*s];
  p.arms[hand]=[-.3-.9*w-.42*s,-sign*.16*s,-sign*.1];p.elbows[hand]=-1.8*w+1.8*s;
  p.arms[1-hand]=[-.8,0,sign*.12];p.elbows[1-hand]=-1.1;p.head=[-.08*s,-p.chest[1]*.4,0];
  p.legs[1-hand][0]=-.12*s;p.knees[hand]=.18*w;
 }else if(kind==='kick'){
  p.chest=[-.25*s,-.18*w+.65*s,-.12*s];p.offset=[-.08*s,.02*s,.12*s];
  p.legs[1]=[-1.1*w-.48*s,.2*s,-.06*s];p.knees[1]=1.9*w-1.9*s;
  p.legs[0]=[-.07,0,.1*s];p.knees[0]=.18;p.arms=[[-.85,0,.35*s],[-.5,0,-.6*s]];p.head=[.1*s,-.2*s,0];
 }else{
  p.chest=[-.17*w+.35*s,-.6*w+1.2*s,-.12*s];p.offset=[0,-.14*s,.25*s];
  p.arms=[[-2.1*w+.75*s,0,.15],[-2.9*w+1.5*s,-.18*w,-.2]];
  p.elbows=[-.75*w,-.8*w+.7*s];p.knees=[.18+.2*s,.18+.2*s];p.legs[0][0]=-.1*s;p.head=[-.12*w+.15*s,-p.chest[1]*.4,0];
 }
 return p;
}
export function plantedLeg(z,lift=0){
 const length=.34,down=.64-lift,d=Math.min(length*2-.001,Math.hypot(down,z));
 const knee=Math.acos(Math.max(-1,Math.min(1,(d*d-2*length*length)/(2*length*length))));
 return {hip:-Math.atan2(z,down)-knee/2,knee};
}
