import {useState} from 'react';
import {Play,ExternalLink,Footprints,Dumbbell} from 'lucide-react';
const media:Record<string,{photo?:string;video?:string;source:string;url:string}>={
 squat:{photo:'Bodyweight_Squat',source:'Free Exercise DB · Public Domain',url:'https://github.com/yuhonas/free-exercise-db'},
 bridge:{photo:'Butt_Lift_Bridge',source:'Free Exercise DB · Public Domain',url:'https://github.com/yuhonas/free-exercise-db'},
 calf:{photo:'Calf_Stretch_Hands_Against_Wall',source:'Free Exercise DB · Public Domain',url:'https://github.com/yuhonas/free-exercise-db'},
 hip:{photo:'Kneeling_Hip_Flexor',source:'Free Exercise DB · Public Domain',url:'https://github.com/yuhonas/free-exercise-db'},
 hamstring:{photo:'Seated_Floor_Hamstring_Stretch',source:'Free Exercise DB · Public Domain',url:'https://github.com/yuhonas/free-exercise-db'},
 'wall-push':{video:'QpMTk21EmaM',source:'HASfit',url:'https://www.youtube.com/watch?v=QpMTk21EmaM'},
 'bird-dog':{video:'egKWoMZ6cXM',source:'E3 Rehab Exercise Library',url:'https://www.youtube.com/watch?v=egKWoMZ6cXM'},
 'dead-bug':{video:'BZYaCzbP09M',source:'E3 Rehab Exercise Library',url:'https://www.youtube.com/watch?v=BZYaCzbP09M'},
 'prone-w':{video:'_i36cFWfgTw',source:'Riser Physical Medicine',url:'https://www.riserpc.com/exercise-library'}
};
export function motionKey(e:any){return [...Object.keys(media),'quad','chest','walk'].find(k=>String(e?.exercise_id||'').endsWith('-'+k))||'unknown'}
export default function ExerciseMotion({kind='squat',compact=false,title='شرح الحركة'}:{kind?:string;compact?:boolean;title?:string}){
 const[end,setEnd]=useState(false),[play,setPlay]=useState(false);const item=media[kind];
 if(!item)return <div className={'reference-media reference-empty '+(compact?'compact':'')}>{kind==='walk'?<Footprints size={42}/>:<Dumbbell size={38}/>}<b>{kind==='walk'?'حركة على قدّك':title}</b>{!compact&&<p>{kind==='walk'?'مشي مريح مع خطوات ثابتة ونَفَس منتظم.':'اتبع التعليمات المكتوبة أسفل البطاقة. المرجع المصوّر لهذا التمرين غير متاح حاليًا.'}</p>}</div>;
 const src=item.photo?`/media/exercises/${item.photo}-${end?1:0}.jpg`:`https://i.ytimg.com/vi/${item.video}/hqdefault.jpg`;
 return <div className={'reference-media '+(compact?'compact':'')}>
 <div className="reference-frame">{play&&item.video&&!compact?<iframe title={'فيديو '+title} src={`https://www.youtube-nocookie.com/embed/${item.video}?autoplay=1&rel=0`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/>:<img src={src} alt={title+(item.photo?(end?' — وضع النهاية':' — وضع البداية'):' — معاينة فيديو')} loading="lazy"/>}{!compact&&item.video&&!play&&<button className="reference-play" onClick={()=>setPlay(true)}><Play size={20}/>شاهد الحركة بالفيديو</button>}{compact&&<span className="reference-tag">{item.video?'فيديو الأداء':'صورتان للأداء'}</span>}</div>
 {!compact&&<div className="reference-caption">{item.photo?<div className="pose-switch"><button aria-pressed={!end} onClick={()=>setEnd(false)}>01 · البداية</button><button aria-pressed={end} onClick={()=>setEnd(true)}>02 · النهاية</button></div>:<small>الفيديو يحتاج إنترنت · لو تعذّر تشغيله افتح المصدر</small>}<a href={item.url} target="_blank" rel="noreferrer">{item.source}<ExternalLink size={12}/></a></div>}
 </div>
}
