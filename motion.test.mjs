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
