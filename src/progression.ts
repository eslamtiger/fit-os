export type ProgressInput={target:number[];actual:number[];rpe?:number|null;sleepHours?:number|null;soreness?:number|null;energy?:number|null;missedRecent?:number;recentScores?:number[]};
export type ProgressResult={action:'increase_reps'|'increase_weight'|'maintain'|'reduce_volume'|'deload'|'repeat_target';nextTarget:number[];reason:string};
export function suggestProgression(x:ProgressInput):ProgressResult{
 const target=x.target.length?x.target:[0],actual=x.actual;
 const recoveryPoor=(x.sleepHours!=null&&x.sleepHours<6)||(x.soreness!=null&&x.soreness>=4)||(x.energy!=null&&x.energy<=2);
 if((x.missedRecent||0)>=3)return{action:'reduce_volume',nextTarget:target.map(v=>Math.max(1,Math.ceil(v*.8))),reason:'تكررت حصص فائتة مؤخرًا؛ خفّض الحجم مؤقتًا للعودة بالتدريج.'};
 if(recoveryPoor||(x.rpe!=null&&x.rpe>=9))return{action:'maintain',nextTarget:target,reason:'الأداء أو التعافي يشير إلى تثبيت الهدف الحالي.'};
 const complete=actual.length>=target.length&&target.every((v,i)=>actual[i]>=v);
 const trend=x.recentScores||[];
 if(complete&&(x.rpe==null||x.rpe<=7)&&trend.length>=2&&trend.slice(-3).filter((n,i,a)=>i===0||n>=a[i-1]).length>=2)
   return{action:'increase_reps',nextTarget:target.map(v=>v+1),reason:'أكملت الهدف مع مجهود مناسب وتعافٍ جيد؛ جرّب زيادة تكرار واحد.'};
 if(x.rpe!=null&&x.rpe>=8)return{action:'repeat_target',nextTarget:target,reason:'المجهود كان مرتفعًا؛ كرر الهدف نفسه في الحصة القادمة.'};
 return{action:'maintain',nextTarget:target,reason:'استمر على الهدف الحالي حتى تتوفر بيانات أداء وتعافٍ كافية.'};
}
