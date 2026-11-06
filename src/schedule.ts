export const cairoDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo'}).format(new Date());
export function weekDates(date=cairoDay()){const today=new Date(date+'T12:00:00Z');const offset=(today.getUTCDay()+1)%7;today.setUTCDate(today.getUTCDate()-offset);return Array.from({length:7},(_,i)=>{const x=new Date(today);x.setUTCDate(x.getUTCDate()+i);return {date:x.toISOString().slice(0,10),day:x.getUTCDay()}})}
export const stretchKinds=['calf','quad','hip','hamstring','chest'];
export const tempoFor=(e:any)=>String(e?.exercise_id).endsWith('bird-dog')||String(e?.exercise_id).endsWith('dead-bug')?'2–1–2':String(e?.exercise_id).endsWith('prone-w')?'2–2–2':'3–1–1';
