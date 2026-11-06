import test from 'node:test';
import assert from 'node:assert/strict';
import {suggestProgression} from '../src/progression.ts';

test('increases reps only after target completion, reasonable effort, and stable trend',()=>{
 const r=suggestProgression({target:[5,5,5],actual:[5,5,5],rpe:7,sleepHours:7,soreness:2,energy:4,recentScores:[14,15]});
 assert.equal(r.action,'increase_reps'); assert.deepEqual(r.nextTarget,[6,6,6]);
});
test('holds the target when recovery is poor',()=>{
 const r=suggestProgression({target:[5,5,5],actual:[5,5,5],rpe:7,sleepHours:5,soreness:2,recentScores:[14,15]});
 assert.equal(r.action,'maintain'); assert.deepEqual(r.nextTarget,[5,5,5]);
});
test('holds the target when effort is very high',()=>{
 assert.equal(suggestProgression({target:[8,8],actual:[8,8],rpe:9}).action,'maintain');
});
test('reduces volume after repeated missed workouts',()=>{
 const r=suggestProgression({target:[10,10,10],actual:[],missedRecent:3});
 assert.equal(r.action,'reduce_volume'); assert.deepEqual(r.nextTarget,[8,8,8]);
});
test('does not progress without a recent performance trend',()=>{
 assert.equal(suggestProgression({target:[5],actual:[5],rpe:6}).action,'maintain');
});
