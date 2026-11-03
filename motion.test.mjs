import test from 'node:test';
import assert from 'node:assert/strict';
import {moves,strikeEnvelope,stickVector} from './motion.js';
test('all attacks reach full extension on their damage frame, then return to rest',()=>{
 for(const move of Object.values(moves)){
  assert.deepEqual(strikeEnvelope(0,move),{wind:0,strike:0,recover:0});
  assert.deepEqual(strikeEnvelope(move.hit,move),{wind:1,strike:1,recover:0});
  assert.equal(strikeEnvelope(move.duration,move).recover,1);
  assert.ok(move.hit>0&&move.hit<move.duration);
 }
});
test('thumbstick preserves analog movement and clamps diagonal drags',()=>{
 assert.deepEqual(stickVector(0,0),{x:0,y:0});
 assert.deepEqual(stickVector(21,0),{x:.5,y:0});
 for(const [x,y] of [[300,400],[-200,50],[10,-900]]){
  const v=stickVector(x,y);assert.ok(Math.abs(Math.hypot(v.x,v.y)-1)<1e-10);
  assert.equal(Math.sign(v.x),Math.sign(x));assert.equal(Math.sign(v.y),Math.sign(y));
 }
});

import {combatPose,plantedLeg} from './pose.js';
test('a kick chambers its knee and extends at contact',()=>{
 const m=moves.kick,wind=combatPose('kick',m.hit*.68,m),contact=combatPose('kick',m.hit,m);
 assert.ok(wind.knees[1]>1.8);assert.ok(Math.abs(contact.knees[1])<.001);
 assert.ok(contact.legs[1][0]<-1.5);
});
test('alternating punches mirror the torso and extend the chosen elbow',()=>{
 for(const hand of [0,1]){const p=combatPose('punch',moves.punch.hit,moves.punch,hand);assert.equal(p.elbows[hand],0);assert.ok(p.elbows[1-hand]<-1);assert.equal(Math.sign(p.chest[1]),hand===1?1:-1);}
});
test('leg solver plants an ankle at the requested stride and lift',()=>{
 for(const z of [-.2,0,.2])for(const lift of [0,.1]){const p=plantedLeg(z,lift);const resultZ=-.34*Math.sin(p.hip)-.34*Math.sin(p.hip+p.knee),down=.34*Math.cos(p.hip)+.34*Math.cos(p.hip+p.knee);assert.ok(Math.abs(resultZ-z)<1e-8);assert.ok(Math.abs(down-(.64-lift))<1e-8);}
});
