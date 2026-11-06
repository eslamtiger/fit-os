import {test} from 'node:test';
import assert from 'node:assert/strict';
import {api} from '../src/api.ts';
Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
test('history uses the latest completed session and orders sets by number',async()=>{
const rows:any={workout_plans:[{plan_id:'plan',active:true}],workout_plan_exercises:[{exercise_id:'ex',target_sets:2,target_reps:8}],exercises:[{exercise_id:'ex',name_ar:'test'}],workout_sessions:[{session_id:'new',status:'completed',started_at:'2026-11-05'},{session_id:'old',status:'completed',started_at:'2026-11-01'},{session_id:'active',status:'in_progress',started_at:'2026-11-06'}],workout_sets:[{session_id:'new',exercise_id:'ex',set_number:2,actual_reps:7,completed:true,rpe:7},{session_id:'active',exercise_id:'ex',set_number:1,actual_reps:100,completed:true,rpe:9},{session_id:'old',exercise_id:'ex',set_number:1,actual_reps:4,completed:true,rpe:7},{session_id:'new',exercise_id:'ex',set_number:1,actual_reps:8,completed:true,rpe:7}],recovery_logs:[]};
const old=globalThis.fetch;globalThis.fetch=async(_url:any,init:any)=>{const body=JSON.parse(init.body);if(!['exercises'].includes(body.table))assert.equal(body.filters.profile_id,'profile-A');return new Response(JSON.stringify({data:rows[body.table]||[]}),{status:200})};try{const plan:any=await api.call('workout.plan',{profile_id:'profile-A'});assert.equal(plan.exercises[0].previous,'8 / 7')}finally{globalThis.fetch=old}
});
test('weekly review excludes future records and leaves missing sleep unknown',async()=>{
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo'}).format(new Date());
const rows:any={workout_sessions:[{workout_date:today,status:'completed'},{workout_date:'2999-01-01',status:'completed'}],food_logs:[{date:today,protein_g:30,calories:400},{date:'2999-01-01',protein_g:200,calories:3000}],recovery_logs:[],body_measurements:[]};
const old=globalThis.fetch;globalThis.fetch=async(_url:any,init:any)=>new Response(JSON.stringify({data:rows[JSON.parse(init.body).table]||[]}),{status:200});try{const week:any=await api.call('dashboard.week',{profile_id:'profile-A'});assert.equal(week.completed_sessions,1);assert.equal(week.average_protein,30);assert.equal(week.average_sleep,null)}finally{globalThis.fetch=old}
});
