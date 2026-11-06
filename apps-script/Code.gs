/**
 * FIT OS Google Apps Script API
 * Bind this script to "FIT OS Database", set DB_ID in Script Properties,
 * run setupDatabase(), then deploy as a Web App.
 */
const FIT = {
  TABLES: {
    PROFILES: 'profile_id name gender date_of_birth height_cm current_weight_kg avatar created_at updated_at active',
    GOALS: 'goal_id profile_id goal_type title description target_value unit start_value start_date target_date status created_at updated_at',
    EXERCISES: 'exercise_id name_ar name_en category muscle_group equipment exercise_type instructions active',
    WORKOUT_PLANS: 'plan_id profile_id plan_name description start_date end_date active created_at updated_at',
    WORKOUT_PLAN_EXERCISES: 'plan_exercise_id profile_id plan_id day_identifier exercise_id exercise_order target_sets target_reps target_duration target_distance target_rest_seconds target_rpe notes',
    WORKOUT_SESSIONS: 'session_id profile_id plan_id workout_date started_at finished_at duration_minutes session_rpe energy_level notes status',
    WORKOUT_SETS: 'set_id session_id profile_id exercise_id set_number target_reps actual_reps weight_kg duration_seconds distance rpe completed notes',
    NUTRITION_TARGETS: 'nutrition_target_id profile_id effective_date calorie_target protein_target_g carb_target_g fat_target_g water_target_ml notes',
    FOOD_LOGS: 'food_log_id profile_id date meal_type food_name quantity unit calories protein_g carbs_g fat_g water_ml notes created_at',
    BODY_MEASUREMENTS: 'measurement_id profile_id date weight_kg waist_cm navel_cm chest_cm hips_cm neck_cm shoulders_cm left_arm_cm right_arm_cm left_thigh_cm right_thigh_cm left_calf_cm right_calf_cm body_fat_percent notes',
    RECOVERY_LOGS: 'recovery_id profile_id date sleep_hours sleep_quality energy_level soreness stress_level resting_heart_rate notes',
    WEEKLY_REVIEWS: 'review_id profile_id week_start week_end workout_completion_percent average_weight weight_change average_calories average_protein average_sleep progress_summary recommendation created_at',
    APP_SETTINGS: 'setting_key setting_value updated_at'
  },
  IDS: {
    PROFILES:'profile_id', GOALS:'goal_id', EXERCISES:'exercise_id', WORKOUT_PLANS:'plan_id',
    WORKOUT_PLAN_EXERCISES:'plan_exercise_id', WORKOUT_SESSIONS:'session_id', WORKOUT_SETS:'set_id',
    NUTRITION_TARGETS:'nutrition_target_id', FOOD_LOGS:'food_log_id', BODY_MEASUREMENTS:'measurement_id',
    RECOVERY_LOGS:'recovery_id', WEEKLY_REVIEWS:'review_id', APP_SETTINGS:'setting_key'
  },
  PROFILE_TABLES: ['PROFILES','GOALS','WORKOUT_PLANS','WORKOUT_PLAN_EXERCISES','WORKOUT_SESSIONS','WORKOUT_SETS','NUTRITION_TARGETS','FOOD_LOGS','BODY_MEASUREMENTS','RECOVERY_LOGS','WEEKLY_REVIEWS']
};
function spreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('DB_ID');
  if (!id) throw new Error('Set DB_ID in Apps Script Project Settings > Script Properties.');
  return SpreadsheetApp.openById(id);
}

function setupDatabase() {
  const ss = spreadsheet_();
  ss.setSpreadsheetTimeZone('Africa/Cairo');
  Object.keys(FIT.TABLES).forEach((name, index) => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    const expected = FIT.TABLES[name].split(' ');
    const lastCol = Math.max(sh.getLastColumn(), expected.length);
    const current = lastCol ? sh.getRange(1, 1, 1, lastCol).getValues()[0].map(String) : [];
    const missing = expected.filter(h => !current.includes(h));
    if (sh.getLastRow() === 0 || current.every(x => !x)) {
      sh.getRange(1, 1, 1, expected.length).setValues([expected]);
    } else if (missing.length) {
      sh.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
    }
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, sh.getLastColumn()).setFontWeight('bold').setBackground('#173021').setFontColor('#e2f4c5');
  });
  return json_({ok:true,data:{spreadsheetId:ss.getId(),sheets:Object.keys(FIT.TABLES)}});
}

function doGet(e) {
  try { return json_(route_(e && e.parameter ? e.parameter : {})); }
  catch (err) { return json_({ok:false,error:String(err && err.message || err)}); }
}
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    return json_(route_(body));
  } catch (err) { return json_({ok:false,error:String(err && err.message || err)}); }
}
function route_(p) {
  const action = String(p.action || '');
  if (action === 'profiles.list') return {ok:true,data:list_('PROFILES',null,{})};
  if (action === 'profiles.get') return {ok:true,data:one_('PROFILES',p.profile_id,null)};
  if (action === 'profiles.create') return {ok:true,data:create_('PROFILES',parse_(p.profile))};
  if (action === 'profiles.update') return {ok:true,data:update_('PROFILES',p.profile_id,parse_(p.profile),null)};
  if (action === 'records.list') {
    const table=table_(p.table), pid=String(p.profile_id||'');
    if (FIT.PROFILE_TABLES.includes(table) && !pid) throw new Error('profile_id مطلوب');
    return {ok:true,data:list_(table,pid,parse_(p.filters)||{})};
  }
  if (action === 'records.create') {
    const rec=parse_(p.record)||{}, table=table_(p.table);
    if (FIT.PROFILE_TABLES.includes(table) && !rec.profile_id) throw new Error('profile_id مطلوب لكل سجل');
    if (rec.profile_id) requireProfile_(rec.profile_id);
    return {ok:true,data:create_(table,rec)};
  }
  if (action === 'records.update') {
    const table=table_(p.table), rec=parse_(p.record)||{};
    if (FIT.PROFILE_TABLES.includes(table) && !p.profile_id && !rec.profile_id) throw new Error('profile_id مطلوب');
    return {ok:true,data:update_(table,p.id,rec,p.profile_id||rec.profile_id)};
  }
  if (action === 'records.delete') return {ok:true,data:delete_(table_(p.table),p.id,p.profile_id)};
  if (action === 'workout.plan') return {ok:true,data:workoutPlan_(p.profile_id)};
  if (action === 'workout.today') return {ok:true,data:workoutToday_(p.profile_id)};
  if (action === 'workout.start') return {ok:true,data:create_('WORKOUT_SESSIONS',{...(parse_(p.session)||{}),profile_id:p.profile_id,status:'in_progress',started_at:new Date().toISOString()})};
  if (action === 'workout.logSet') return {ok:true,data:create_('WORKOUT_SETS',{...(parse_(p.set)||{}),profile_id:p.profile_id})};
  if (action === 'workout.updateSet') return {ok:true,data:update_('WORKOUT_SETS',p.set_id,parse_(p.set)||{},p.profile_id)};
  if (action === 'workout.complete') return {ok:true,data:completeWorkout_(p)};
  if (action === 'workout.exerciseHistory') return {ok:true,data:exerciseHistory_(p.profile_id,p.exercise_id)};
  if (action === 'workout.progression') return {ok:true,data:progression_(p.profile_id,p.exercise_id)};
  if (action === 'workout.history') return {ok:true,data:list_('WORKOUT_SESSIONS',p.profile_id,{})};
  if (action === 'nutrition.target') return {ok:true,data:nutritionTarget_(p.profile_id,p.date)};
  if (action === 'nutrition.logFood') return {ok:true,data:create_('FOOD_LOGS',{...(parse_(p.food)||{}),profile_id:p.profile_id})};
  if (action === 'nutrition.updateFood') return {ok:true,data:update_('FOOD_LOGS',p.food_log_id,parse_(p.food)||{},p.profile_id)};
  if (action === 'nutrition.deleteFood') return {ok:true,data:delete_('FOOD_LOGS',p.food_log_id,p.profile_id)};
  if (action === 'nutrition.totals') return {ok:true,data:nutritionTotals_(p.profile_id,p.date)};
  if (action === 'progress.measurement') return {ok:true,data:create_('BODY_MEASUREMENTS',{...(parse_(p.measurement)||{}),profile_id:p.profile_id})};
  if (action === 'progress.history') return {ok:true,data:list_('BODY_MEASUREMENTS',p.profile_id,{})};
  if (action === 'recovery.save') return {ok:true,data:saveRecovery_(p)};
  if (action === 'recovery.history') return {ok:true,data:list_('RECOVERY_LOGS',p.profile_id,{})};
  if (action === 'dashboard.today') return {ok:true,data:todaySummary_(p.profile_id)};
  if (action === 'dashboard.week') return {ok:true,data:weeklyReview_(p.profile_id,p.week_start)};
  throw new Error('عملية غير معروفة: '+action);
}
function table_(name){const t=String(name||'').toUpperCase();if(!FIT.TABLES[t])throw new Error('جدول غير مسموح');return t;}
function parse_(v){if(typeof v==='string'){try{return JSON.parse(v)}catch(_){return {}}}return v||{};}
function json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);}
function sheet_(name){const s=spreadsheet_().getSheetByName(table_(name));if(!s)throw new Error('شيت غير موجود');return s;}
function rows_(name){const s=sheet_(name), v=s.getDataRange().getValues();if(v.length<2)return [];const h=v[0].map(String);return v.slice(1).map((r,i)=>{const o={_row:i+2};h.forEach((k,j)=>{if(k)o[k]=r[j]});return o}).filter(o=>Object.keys(o).length>1);}
function list_(name,profileId,filters){const t=table_(name);let data=rows_(t);if(profileId&&FIT.PROFILE_TABLES.includes(t))data=data.filter(r=>String(r.profile_id)===String(profileId));if(filters)Object.keys(filters).forEach(k=>{if(filters[k]!==''&&filters[k]!=null)data=data.filter(r=>String(r[k])===String(filters[k]))});return data.map(({_row,...r})=>r);}
function one_(table,id,pid){return list_(table,pid||null,{}).find(r=>String(r[FIT.IDS[table_(table)]])===String(id))||null;}
function requireProfile_(id){if(!rows_('PROFILES').some(r=>String(r.profile_id)===String(id)&&String(r.active)!=='false'))throw new Error('الملف الشخصي غير موجود أو غير نشط');}
function create_(name,record){const t=table_(name), rec={...record};if(FIT.PROFILE_TABLES.includes(t)){if(!rec.profile_id)throw new Error('profile_id مطلوب');requireProfile_(rec.profile_id)}validateRecord_(t,rec,rec.profile_id);const idKey=FIT.IDS[t];if(!rec[idKey])rec[idKey]=Utilities.getUuid();if(t==='PROFILES'&&rec.active===undefined)rec.active=true;if(!rec.created_at&&FIT.TABLES[t].split(' ').includes('created_at'))rec.created_at=new Date().toISOString();if(FIT.TABLES[t].split(' ').includes('updated_at'))rec.updated_at=new Date().toISOString();const lock=LockService.getScriptLock();lock.waitLock(15000);try{const s=sheet_(t),headers=s.getRange(1,1,1,s.getLastColumn()).getValues()[0].map(String);const row=headers.map(h=>rec[h]===undefined?'':rec[h]);s.appendRow(row);return Object.fromEntries(headers.map((h,i)=>[h,row[i]]))}finally{lock.releaseLock()}}
function validateRecord_(t,r,pid){if(t==='PROFILES'&&!String(r.name||'').trim())throw new Error('اسم الملف الشخصي مطلوب');if(t==='GOALS'&&!String(r.title||'').trim())throw new Error('عنوان الهدف مطلوب');if(t==='WORKOUT_PLANS'&&!String(r.plan_name||'').trim())throw new Error('اسم الخطة مطلوب');if(t==='WORKOUT_PLAN_EXERCISES'){const plan=one_('WORKOUT_PLANS',r.plan_id,pid);if(!plan)throw new Error('الخطة لا تخص هذا الملف الشخصي');if(!one_('EXERCISES',r.exercise_id,null))throw new Error('التمرين غير موجود')}if(t==='WORKOUT_SESSIONS'&&r.plan_id&&!one_('WORKOUT_PLANS',r.plan_id,pid))throw new Error('الخطة لا تخص هذا الملف الشخصي');if(t==='WORKOUT_SETS'){if(!one_('WORKOUT_SESSIONS',r.session_id,pid))throw new Error('الجلسة لا تخص هذا الملف الشخصي');if(!one_('EXERCISES',r.exercise_id,null))throw new Error('التمرين غير موجود');if(Number(r.set_number)<1)throw new Error('رقم المجموعة غير صحيح')}if(t==='FOOD_LOGS'&&!String(r.food_name||'').trim())throw new Error('اسم الطعام مطلوب');if(t==='NUTRITION_TARGETS'&&!r.effective_date)throw new Error('تاريخ بداية الهدف مطلوب');if(t==='RECOVERY_LOGS'&&!r.date)throw new Error('تاريخ التعافي مطلوب');if(t==='BODY_MEASUREMENTS'&&!['weight_kg','waist_cm','navel_cm','chest_cm','hips_cm','neck_cm','shoulders_cm','left_arm_cm','right_arm_cm','left_thigh_cm','right_thigh_cm','left_calf_cm','right_calf_cm','body_fat_percent'].some(k=>r[k]!==''&&r[k]!==null&&r[k]!==undefined))throw new Error('أدخل قياسًا واحدًا على الأقل')}
function update_(name,id,patch,pid){const t=table_(name), idKey=FIT.IDS[t];const lock=LockService.getScriptLock();lock.waitLock(15000);try{const s=sheet_(t),all=s.getDataRange().getValues(),h=all[0].map(String),idCol=h.indexOf(idKey),pidCol=h.indexOf('profile_id');if(idCol<0)throw new Error('معرف السجل غير متاح');for(let i=1;i<all.length;i++){if(String(all[i][idCol])===String(id)){if(pid&&pidCol>=0&&String(all[i][pidCol])!==String(pid))throw new Error('السجل لا ينتمي لهذا الملف الشخصي');const current=Object.fromEntries(h.map((k,j)=>[k,all[i][j]]));validateRecord_(t,{...current,...patch},pid||current.profile_id);Object.keys(patch).forEach(k=>{const c=h.indexOf(k);if(c>=0&&k!==idKey&&k!=='profile_id')s.getRange(i+1,c+1).setValue(patch[k])});const u=h.indexOf('updated_at');if(u>=0)s.getRange(i+1,u+1).setValue(new Date().toISOString());return Object.fromEntries(h.map((k,j)=>[k,s.getRange(i+1,j+1).getValue()]))}}throw new Error('السجل غير موجود')}finally{lock.releaseLock()}}
function delete_(name,id,pid){const t=table_(name),lock=LockService.getScriptLock();lock.waitLock(15000);try{const s=sheet_(t),a=s.getDataRange().getValues(),h=a[0].map(String),ic=h.indexOf(FIT.IDS[t]),pc=h.indexOf('profile_id');for(let i=1;i<a.length;i++)if(String(a[i][ic])===String(id)){if(pid&&pc>=0&&String(a[i][pc])!==String(pid))throw new Error('السجل لا ينتمي لهذا الملف الشخصي');s.deleteRow(i+1);return {deleted:true}}throw new Error('السجل غير موجود')}finally{lock.releaseLock()}}
function workoutPlan_(pid){requireProfile_(pid);const plans=list_('WORKOUT_PLANS',pid,{active:true});if(!plans.length)return null;const plan=plans[0],library={};list_('EXERCISES',null,{}).forEach(e=>library[e.exercise_id]=e);const exercises=list_('WORKOUT_PLAN_EXERCISES',pid,{plan_id:plan.plan_id}).sort((a,b)=>Number(a.exercise_order)-Number(b.exercise_order)).map(row=>{const history=exerciseHistory_(pid,row.exercise_id),last=history.length?history[history.length-1]:null,previous=last?history.filter(s=>s.session_id===last.session_id).map(s=>s.actual_reps).join(' / '):'—';return {...row,...(library[row.exercise_id]||{}),previous,progression:progression_(pid,row.exercise_id)}});return {...plan,exercises}}
function workoutToday_(pid){return workoutPlan_(pid)}
function completeWorkout_(p){const session=one_('WORKOUT_SESSIONS',p.session_id,p.profile_id);if(!session)throw new Error('الجلسة غير موجودة');return update_('WORKOUT_SESSIONS',p.session_id,{...(parse_(p.session)||{}),finished_at:new Date().toISOString(),status:'completed'},p.profile_id)}
function exerciseHistory_(pid,eid){const sessions=list_('WORKOUT_SESSIONS',pid,{}),byId={};sessions.forEach(s=>byId[s.session_id]=s);return list_('WORKOUT_SETS',pid,{}).filter(r=>String(r.exercise_id)===String(eid)).map(r=>({...r,workout_date:byId[r.session_id]?.workout_date||'',session_rpe:byId[r.session_id]?.session_rpe||r.rpe||null})).sort((a,b)=>String(a.workout_date).localeCompare(String(b.workout_date)))}
function progression_(pid,eid){requireProfile_(pid);const history=exerciseHistory_(pid,eid);const sessions={};history.forEach(r=>(sessions[r.session_id]||(sessions[r.session_id]=[])).push(r));const recent=Object.keys(sessions).map(id=>({session:history.find(x=>x.session_id===id),sets:sessions[id].sort((a,b)=>Number(a.set_number)-Number(b.set_number))})).sort((a,b)=>String(a.session.workout_date).localeCompare(String(b.session.workout_date))).slice(-3);const latestRecovery=list_('RECOVERY_LOGS',pid,{}).sort((a,b)=>String(b.date).localeCompare(String(a.date)))[0]||{};if(!recent.length)return {action:'repeat_target',reason:'لا توجد سجلات كافية لاقتراح تغيير.',next_target:null};const last=recent[recent.length-1],prior=recent.length>1?recent[recent.length-2]:null,target=last.sets.map(s=>Number(s.target_reps||0)),actual=last.sets.map(s=>Number(s.actual_reps||0)),rpe=Number(last.session.session_rpe||0)||null;const poor=(Number(latestRecovery.sleep_hours||99)<6)||(Number(latestRecovery.soreness||0)>=4)||(Number(latestRecovery.energy_level||5)<=2);if(poor||(rpe&&rpe>=9))return{action:'maintain',reason:'التعافي أو المجهود يدعم تثبيت الهدف الحالي.',next_target:target};const complete=target.length>0&&target.every((n,i)=>actual[i]>=n);const priorGood=prior&&prior.sets.length>0&&prior.sets.every(s=>Number(s.actual_reps||0)>=Number(s.target_reps||0))&&Number(prior.session.session_rpe||0)<=7;if(complete&&(!rpe||rpe<=7)&&priorGood){return{action:'increase_reps',reason:'أكملت الهدف في آخر حصتين مسجلتين مع مجهود مناسب؛ جرّب تكرارًا إضافيًا.',next_target:target.map(n=>n+1)}}return{action:'repeat_target',reason:'كرر الهدف الحالي حتى يتحسن الأداء المسجل.',next_target:target}}
function dateCairo_(){return Utilities.formatDate(new Date(),'Africa/Cairo','yyyy-MM-dd')}
function nutritionTarget_(pid,date){const rows=list_('NUTRITION_TARGETS',pid,{}).filter(r=>!date||String(r.effective_date)<=String(date)).sort((a,b)=>String(b.effective_date).localeCompare(String(a.effective_date)));return rows[0]||null}
function nutritionTotals_(pid,date){const day=date||dateCairo_(), foods=list_('FOOD_LOGS',pid,{date:day});return foods.reduce((a,r)=>({calories:a.calories+Number(r.calories||0),protein_g:a.protein_g+Number(r.protein_g||0),carbs_g:a.carbs_g+Number(r.carbs_g||0),fat_g:a.fat_g+Number(r.fat_g||0),water_ml:a.water_ml+Number(r.water_ml||0)}),{date:day,calories:0,protein_g:0,carbs_g:0,fat_g:0,water_ml:0})}
function saveRecovery_(p){const pid=String(p.profile_id||''),rec=parse_(p.recovery)||{},date=rec.date||dateCairo_();if(!pid)throw new Error('profile_id مطلوب');const old=list_('RECOVERY_LOGS',pid,{date})[0];return old?update_('RECOVERY_LOGS',old.recovery_id,{...rec},pid):create_('RECOVERY_LOGS',{...rec,profile_id:pid,date})}
function todaySummary_(pid){requireProfile_(pid);const date=dateCairo_(),target=nutritionTarget_(pid,date)||{};const foods=list_('FOOD_LOGS',pid,{date});const totals=nutritionTotals_(pid,date);const recovery=list_('RECOVERY_LOGS',pid,{date})[0]||null;const measurements=list_('BODY_MEASUREMENTS',pid,{}).sort((a,b)=>String(b.date).localeCompare(String(a.date)));const sessions=list_('WORKOUT_SESSIONS',pid,{workout_date:date});return {date,profile_id:pid,current_weight_kg:measurements[0]?.weight_kg||one_('PROFILES',pid,null)?.current_weight_kg||null,workout_status:sessions.some(s=>s.status==='completed')?'completed':sessions.length?'in_progress':workoutPlan_(pid)?'planned':'rest',nutrition:{...totals},calorie_target:Number(target.calorie_target||0),protein_target_g:Number(target.protein_target_g||0),water_target_ml:Number(target.water_target_ml||0),food_count:foods.length,recovery,goals:list_('GOALS',pid,{status:'active'}),measurements_latest:measurements[0]||null}}
function weeklySummary_(pid,start){requireProfile_(pid);const today=new Date(dateCairo_()+'T12:00:00Z'),monday=new Date(today);monday.setUTCDate(today.getUTCDate()-((today.getUTCDay()+6)%7));const from=start||monday.toISOString().slice(0,10),to=new Date(new Date(from+'T12:00:00Z').getTime()+6*86400000).toISOString().slice(0,10);const inWeek=(r,k)=>String(r[k]||'')>=from&&String(r[k]||'')<=to;const sessions=list_('WORKOUT_SESSIONS',pid,{}).filter(r=>inWeek(r,'workout_date'));const done=sessions.filter(r=>r.status==='completed');const foods=list_('FOOD_LOGS',pid,{}).filter(r=>inWeek(r,'date'));const recovery=list_('RECOVERY_LOGS',pid,{}).filter(r=>inWeek(r,'date'));const weights=list_('BODY_MEASUREMENTS',pid,{}).filter(r=>inWeek(r,'date')&&Number(r.weight_kg)>0).sort((a,b)=>String(a.date).localeCompare(String(b.date)));return {profile_id:pid,week_start:from,week_end:to,completed_sessions:done.length,planned_sessions:sessions.length,workout_completion_percent:sessions.length?Math.round(done.length/sessions.length*100):null,average_calories:foods.length?Math.round(foods.reduce((s,r)=>s+Number(r.calories||0),0)/new Set(foods.map(x=>x.date)).size):null,average_protein:foods.length?Math.round(foods.reduce((s,r)=>s+Number(r.protein_g||0),0)/new Set(foods.map(x=>x.date)).size):null,average_sleep:recovery.length?Math.round(recovery.reduce((s,r)=>s+Number(r.sleep_hours||0),0)/recovery.length*10)/10:null,weight_change:weights.length>1?Number(weights.at(-1).weight_kg)-Number(weights[0].weight_kg):null}}
function weeklySummary_(pid,start){requireProfile_(pid);const today=new Date(dateCairo_()+'T12:00:00Z'),monday=new Date(today);monday.setUTCDate(today.getUTCDate()-((today.getUTCDay()+6)%7));const from=start||monday.toISOString().slice(0,10),to=new Date(new Date(from+'T12:00:00Z').getTime()+6*86400000).toISOString().slice(0,10);const inWeek=(r,k)=>String(r[k]||'')>=from&&String(r[k]||'')<=to;const sessions=list_('WORKOUT_SESSIONS',pid,{}).filter(r=>inWeek(r,'workout_date'));const done=sessions.filter(r=>r.status==='completed');const foods=list_('FOOD_LOGS',pid,{}).filter(r=>inWeek(r,'date'));const recovery=list_('RECOVERY_LOGS',pid,{}).filter(r=>inWeek(r,'date'));const weights=list_('BODY_MEASUREMENTS',pid,{}).filter(r=>inWeek(r,'date')&&Number(r.weight_kg)>0).sort((a,b)=>String(a.date).localeCompare(String(b.date)));return {profile_id:pid,week_start:from,week_end:to,completed_sessions:done.length,planned_sessions:sessions.length,workout_completion_percent:sessions.length?Math.round(done.length/sessions.length*100):null,average_calories:foods.length?Math.round(foods.reduce((s,r)=>s+Number(r.calories||0),0)/new Set(foods.map(x=>x.date)).size):null,average_protein:foods.length?Math.round(foods.reduce((s,r)=>s+Number(r.protein_g||0),0)/new Set(foods.map(x=>x.date)).size):null,average_sleep:recovery.length?Math.round(recovery.reduce((s,r)=>s+Number(r.sleep_hours||0),0)/recovery.length*10)/10:null,average_weight:weights.length?Math.round(weights.reduce((s,r)=>s+Number(r.weight_kg),0)/weights.length*10)/10:null,weight_change:weights.length>1?Number(weights[weights.length-1].weight_kg)-Number(weights[0].weight_kg):null}}
function weeklyReview_(pid,start){const data=weeklySummary_(pid,start),parts=[];if(data.planned_sessions)parts.push('اكتملت '+data.completed_sessions+' من '+data.planned_sessions+' جلسة مسجلة');if(data.weight_change!==null)parts.push('تغير الوزن المسجل '+(data.weight_change>0?'+':'')+data.weight_change.toFixed(1)+' كجم');if(data.average_sleep!==null)parts.push('متوسط النوم '+data.average_sleep+' ساعات');if(data.average_protein!==null)parts.push('متوسط البروتين في الأيام المسجلة '+data.average_protein+' جم');data.progress_summary=parts.length?parts.join('، '):'لا توجد بيانات كافية لهذا الأسبوع.';data.recommendation=data.average_sleep!==null&&data.average_sleep<6?'سجّل النوم خلال الأسبوع القادم وراجع توزيع التمرين حسب شعورك بالتعافي.':data.planned_sessions&&data.workout_completion_percent<70?'اختر عدد جلسات أقل قابلًا للالتزام وسجّل المواعيد التي تخطط لها.':'استمر في تسجيل البيانات؛ التوصية تعتمد على السجلات المتاحة فقط.';const existing=list_('WEEKLY_REVIEWS',pid,{week_start:data.week_start})[0];const row={...data,created_at:new Date().toISOString()};if(existing)update_('WEEKLY_REVIEWS',existing.review_id,row,pid);else create_('WEEKLY_REVIEWS',row);return row}
