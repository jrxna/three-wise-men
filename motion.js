// Shared normalized attack timing keeps the contact pose and damage frame together.
export const moves = {
  punch: {duration:.46, hit:.18, range:1.6, damage:9, cost:4},
  kick: {duration:.7, hit:.31, range:2, damage:14, cost:11},
  special: {duration:1.15, hit:.52, range:2.7, damage:25, cost:42}
};
const smooth = x => { x=Math.max(0,Math.min(1,x));return x*x*(3-2*x); };
export function strikeEnvelope(t, move) {
  const windup=move.hit*.68;
  if(t<windup)return {wind:smooth(t/windup),strike:0,recover:0};
  if(t<move.hit)return {wind:1,strike:smooth((t-windup)/(move.hit-windup)),recover:0};
  return {wind:1,strike:1,recover:smooth((t-move.hit)/(move.duration-move.hit))};
}
export function stickVector(x,y,radius=42){const length=Math.hypot(x,y),scale=length>radius?radius/length:1;return {x:x*scale/radius,y:y*scale/radius};}
