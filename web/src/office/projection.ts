import {BEHAVIOR_LABEL,behaviorOf,poseOf,terminalState,TERMINAL_LABEL,type World} from '../mock/world';
import {CHARACTERS,type Character,type RegionId} from './scene.config';
import {B1_ROUTES} from './scenario';

export function characterPose(c:Character,w:World,time=w.time){
 const agent=w.agents[c.worldId];
 const visible=c.kind!=='worker'||Boolean(agent?.taskId&&['Working','Waiting Decision'].includes(agent.behavior));
 // Pausing preserves the current pose; only a lead's standby state selects the seated asset.
 const seated=Boolean(c.seated&&(w.status==='ready'||agent?.behavior==='Standby'&&agent.motion&&behaviorOf(agent,time,B1_ROUTES)==='Standby'));
 if(seated&&c.seated)return {visible,seated,image:c.seated.image,feet:c.seated.feet,height:c.seated.height,width:c.id==='design-lead'?144*1141/1378:108,moving:false};
 const pose=agent?poseOf(agent,time,B1_ROUTES):undefined;
 const feet=pose?.position??c.feet;
 return {visible,seated,image:c.image,feet,height:agent?.motion?104+(feet[1]-320)*.105:c.height,width:108,moving:pose?.moving??false};
}
export function characterStatus(c:Character,w:World){
 if(c.kind==='reception')return '接待与导览 · 常驻';
 const agent=w.agents[c.worldId];
 if(!agent){const retired=w.events.some(e=>e.type==='worker.removed'&&e.payload.agentId===c.worldId);return retired?'任务已完成 · 实例已释放':'未调用 · 尚无执行实例';}
 if(agent.kind==='worker')return `${TERMINAL_LABEL[terminalState(agent)]} · Mock 实例`;
 return `${BEHAVIOR_LABEL[behaviorOf(agent,w.time,B1_ROUTES)]} · 负责人`;
}
export function taskRows(w:World){
 return CHARACTERS.filter(c=>c.worldId==='research-lead'||c.kind==='worker').map(c=>{
  const assigned=w.events.find(e=>e.type==='task.assigned'&&e.payload.agentId===c.worldId);
  const done=w.events.some(e=>e.type==='task.finished'&&e.payload.agentId===c.worldId);
  return {character:c,title:assigned?.payload.title??'尚未创建任务',status:done?'已完成 · Mock':characterStatus(c,w),done};
 });
}
export function regionActive(id:RegionId,w:World){
 if(id==='goal')return Boolean(w.goal);
 if(id==='design'||id==='research')return w.departments[id];
 if(id==='development')return w.departments.dev;
 if(id==='workers')return Object.values(w.agents).some(a=>a.kind==='worker'&&a.behavior==='Working');
 if(id==='showcase')return w.artifacts.length>0;
 if(id==='collaboration')return Boolean(w.meeting)&&w.time<42;
 return false;
}
