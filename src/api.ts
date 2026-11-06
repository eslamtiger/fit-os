export type Profile={profile_id:string;name:string;gender?:string;height_cm?:number;current_weight_kg?:number;avatar?:string;active?:boolean};
const endpoint=()=>localStorage.getItem('fit-api-url')||import.meta.env.VITE_FIT_OS_API_URL as string|undefined;
export const api={
 get configured(){return !!endpoint()},
 setEndpoint:(url:string)=>localStorage.setItem('fit-api-url',url),
 async call<T>(action:string,payload:Record<string,unknown>={}):Promise<T>{const API_URL=endpoint();if(!API_URL)throw new Error('لم يتم ربط Google Apps Script بعد');const url=new URL(API_URL);url.searchParams.set('action',action);Object.entries(payload).forEach(([k,v])=>url.searchParams.set(k,typeof v==='string'?v:JSON.stringify(v)));const res=await fetch(url.toString(),{method:'GET'});const data=await res.json();if(!res.ok||!data.ok)throw new Error(data.error||'تعذر الاتصال بالخدمة');return data.data as T;},
 listProfiles:()=>api.call<Profile[]>('profiles.list'),
 createProfile:(profile:Record<string,unknown>)=>api.call<Profile>('profiles.create',{profile}),
 dashboard:(profile_id:string)=>api.call<any>('dashboard.today',{profile_id}),
 list:(table:string,profile_id:string,filters:Record<string,unknown>={})=>api.call<any[]>('records.list',{table,profile_id,filters}),
 create:(table:string,record:Record<string,unknown>)=>api.call<any>('records.create',{table,record}),
 update:(table:string,id:string,record:Record<string,unknown>)=>api.call<any>('records.update',{table,id,record}),
 remove:(table:string,id:string,profile_id:string)=>api.call<any>('records.delete',{table,id,profile_id})
};
