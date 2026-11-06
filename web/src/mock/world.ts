import {routeLength,sampleRoute,type Point} from './path';

export type Behavior='Standby'|'Planning'|'Delivering'|'Idle'|'Working'|'Moving'|'Discussing'|'Handoff'|'Waiting Decision'|'Finished';
export const BEHAVIOR_LABEL:Record<Behavior,string>={Standby:'待命',Planning:'统筹中',Delivering:'交付中',Idle:'待执行',Working:'工作中',Moving:'移动中',Discussing:'讨论中',Handoff:'交接中','Waiting Decision':'等待决定',Finished:'已完成'};
export type EventType='goal.created'|'organization.recommended'|'department.activated'|'worker.spawned'|'worker.removed'|'task.assigned'|'task.started'|'task.finished'|'agent.movement'|'task.handoff'|'collaboration.started'|'meeting.started'|'decision.requested'|'decision.resolved'|'artifact.delivered'|'simulation.finished';
const REQUIRED:Record<EventType,string[]>={'goal.created':['title'],'organization.recommended':['summary'],'department.activated':['departmentId'],'worker.spawned':['agentId','parentAgentId'],'worker.removed':['agentId'],'task.assigned':['agentId','taskId','title'],'task.started':['agentId'],'task.finished':['agentId'],'agent.movement':['agentId','route','title'],'task.handoff':['from','to','taskId','artifactId','summary'],'collaboration.started':['topic'],'meeting.started':['topic','summary'],'decision.requested':['decisionId','title','summary'],'decision.resolved':['decisionId','resolution'],'artifact.delivered':['artifactId'],'simulation.finished':['summary']};
export interface ScenarioFixture {schemaVersion:string;source:string;scenarioId:string;events:{at:number;type:string;payload:Record<string,unknown>}[]}
function validateSchedule(input:ScenarioFixture){
if(input.schemaVersion!=='m1-mock/1'||input.source!=='mock')throw Error('Expected a marked Mock fixture');
return input.events.map((event,index)=>{
  const type=event.type as EventType,payload:Record<string,string>={};
  if(!REQUIRED[type]||type==='decision.resolved'||!Number.isFinite(event.at)||event.at<0||(index>0&&event.at<input.events[index-1].at))throw Error('Invalid scheduled simulation event');
  for(const [key,value] of Object.entries(event.payload)){if(typeof value!=='string')throw Error('Invalid mock payload');payload[key]=value;}
  if(REQUIRED[type].some(key=>!payload[key]))throw Error(`Missing mock fields for ${type}`);
  return {at:event.at,type,payload};
});}
export interface MockEvent {schemaVersion:'m1-mock/1';eventId:string;scenarioId:string;runId:string;sequence:number;occurredAt:string;at:number;source:'mock';type:EventType;payload:Record<string,string>}
export interface Agent {id:string;name:string;role:string;department:'design'|'dev'|'research';kind:'lead'|'worker';home:Point;behavior:Behavior;task:string;taskId?:string;parentAgentId?:string;motion?:{route:string;start:number}}
export interface ScenarioRoute {from:string;to:string;points:Point[];face:Point;zone:string;arrival:Behavior;duration:number}
export interface ScenarioDefinition {fixture:ScenarioFixture;agents:Record<string,Agent>;routes:Record<string,ScenarioRoute>}
export const ARTIFACTS:Record<string,{title:string;kind:string;summary:string;details:string[]}>={
  'brand-kit':{title:'品牌方向提案',kind:'品牌 / Mock',summary:'温暖、清晰、可信赖。以暖白和青绿传达让好想法开始生长的品牌主张。',details:['受众：独立创作者与小团队（预设）','色彩：暖白 #F4F0E8 / 青绿 #397D73 / 浅木色','表达：简明主张、可读层级、有温度的语气；仅为模拟提案']},
  'website-preview':{title:'品牌网站预览',kind:'网站 / Mock',summary:'单页品牌站：主张、价值介绍、联系入口。可查看下方预设页面示意。',details:['首页首屏：让好想法开始生长','内容区：把想法变成清晰、可信赖的体验','交付边界：本地静态示意，不是 Agent 生成的网站代码；没有部署']},
  'mock-checklist':{title:'模拟检查清单',kind:'检查 / Simulation',summary:'内容完整性、联系入口与视觉一致性三项预设检查结果。',details:['内容层级：模拟通过','联系入口：模拟通过','品牌一致性：模拟通过；这些不是实际网站自动测试结果']},
};
export interface World {
  time:number;status:'ready'|'playing'|'paused'|'waiting'|'finished';goal:string;recommended:boolean;
  departments:Record<string,boolean>;agents:Record<string,Agent>;events:MockEvent[];
  chapter:string;message:string;meeting?:{topic:string;summary:string};handoff?:{from:string;to:string;summary:string;artifactId:string};
  decision?:{id:string;title:string;summary:string;status:'pending'|'approved'|'rejected'};artifacts:string[];
}
export function initialWorld(scenario:ScenarioDefinition):World {
  return {time:0,status:'ready',goal:'',recommended:false,departments:Object.fromEntries([...new Set(Object.values(scenario.agents).map(a=>a.department))].map(id=>[id,false])),agents:Object.fromEntries(Object.values(scenario.agents).filter(a=>a.kind==='lead').map(a=>[a.id,{...a}])),events:[],chapter:'准备开始',message:'给出目标，看一支团队如何共同完成工作。',artifacts:[]};
}
export function routeDuration(route:ScenarioRoute){return route.duration;}
export function behaviorOf(agent:Agent,time:number,routes:Record<string,ScenarioRoute>):Behavior {
  if(agent.motion && time<agent.motion.start+routeDuration(routes[agent.motion.route])) return 'Moving';
  return agent.behavior;
}
export type TerminalState='standby'|'queued'|'working'|'waiting'|'completed';
export const TERMINAL_LABEL:Record<TerminalState,string>={standby:'待命',queued:'已分配 · 待执行',working:'执行中',waiting:'等待批准',completed:'已完成'};
export function terminalState(agent?:Agent):TerminalState {
  if(!agent?.taskId)return 'standby';
  if(agent.behavior==='Finished')return 'completed';
  if(agent.behavior==='Waiting Decision')return 'waiting';
  return agent.behavior==='Working'?'working':'queued';
}
export function poseOf(agent:Agent,time:number,routes:Record<string,ScenarioRoute>) {
  if(!agent.motion)return {position:agent.home,yaw:agent.kind==='worker'?0:Math.PI/8,moving:false,distance:0};
  const route=routes[agent.motion.route],length=routeLength(route.points),distance=Math.min(length,Math.max(0,time-agent.motion.start)*(length/route.duration));
  const p=sampleRoute(route.points,distance),moving=distance<length;
  const direction=moving?p.direction:[route.face[0]-p.position[0],route.face[1]-p.position[1]];
  return {position:p.position,yaw:Math.atan2(direction[0],direction[1]),moving,distance};
}
// Only events change business facts. Pose completion never completes a task.
export function reduceEvent(previous:World,event:MockEvent,scenario:ScenarioDefinition):World {
  if(event.source!=='mock'||event.schemaVersion!=='m1-mock/1')throw Error('Only explicitly marked simulation events are accepted');
  if(previous.events.some(e=>e.eventId===event.eventId))return previous;
  if(event.sequence!==previous.events.length+1)throw Error('Simulation event sequence gap');
  const s:World={...previous,agents:{...previous.agents},departments:{...previous.departments},events:[...previous.events,event],artifacts:[...previous.artifacts]};
  const p=event.payload;
  const roster=scenario.agents;
  const edit=(id:string,patch:Partial<Agent>)=>{if(!s.agents[id])throw Error(`Unknown active agent ${id}`);s.agents[id]={...s.agents[id],...patch};};
  switch(event.type) {
    case 'goal.created':s.goal=p.title;s.chapter='团队推荐';s.message='目标已建立 · 正在展示预设团队建议。';break;
    case 'organization.recommended':s.recommended=true;s.message=p.summary;break;
    case 'department.activated':{const lead=Object.values(roster).find(a=>a.kind==='lead'&&a.department===p.departmentId);if(!lead)throw Error('Unknown department');s.departments[p.departmentId]=true;edit(lead.id,{behavior:'Planning',task:'拆解目标，协调本部门任务'});break;}
    case 'worker.spawned':if(!roster[p.agentId]||roster[p.agentId].kind!=='worker')throw Error('Unknown worker');if(s.agents[p.parentAgentId]?.kind!=='lead'||s.agents[p.parentAgentId].department!==roster[p.agentId].department||!s.departments[roster[p.agentId].department])throw Error('Worker requires an active matching department lead');s.agents[p.agentId]={...roster[p.agentId],parentAgentId:p.parentAgentId};s.chapter='分工执行';s.message=`${s.agents[p.parentAgentId].name} 创建 ${roster[p.agentId].name}，加入固定工位。`;break;
    case 'worker.removed':if(s.agents[p.agentId]?.kind!=='worker')throw Error('Only workers retire');delete s.agents[p.agentId];break;
    case 'task.assigned':edit(p.agentId,{task:p.title,taskId:p.taskId,behavior:'Idle'});break;
    case 'task.started':edit(p.agentId,{behavior:'Working'});if(s.decision?.status==='approved'){s.chapter='继续执行';s.message='品牌方向已批准，研发与检查任务继续。';}break;
    case 'task.finished':edit(p.agentId,{behavior:'Finished'});break;
    case 'agent.movement':{
      const route=scenario.routes[p.route],agent=s.agents[p.agentId];
      if(agent?.kind!=='lead'||!route||!route.from.startsWith(agent.department))throw Error('Invalid lead route');
      const current=poseOf(agent,event.at,scenario.routes).position,first=route.points[0];
      if(Math.hypot(current[0]-first[0],current[1]-first[1])>.01)throw Error('Lead route must start at the current position');
      edit(p.agentId,{motion:{route:p.route,start:event.at},behavior:route.arrival,task:p.title});
      if(route.zone==='standby'){s.chapter='返回待命';s.message=Object.values(roster).filter(a=>a.kind==='lead').length===3?'成果保留在成果台，三位负责人返回休息区；子 Agent 已按任务完成释放。':'成果保留在成果台，两位负责人返回待命区，执行终端随后释放。';}
      else if(route.zone==='delivery'){s.chapter='前往成果台';s.message=Object.values(roster).filter(a=>a.kind==='lead').length===3?'三位负责人汇总已完成的 Mock 工作，准备交付。':'两位负责人汇总已完成的 Mock 工作，准备交付。';}
      break;
    }
    case 'task.handoff':s.chapter='跨部门交接';s.message=p.summary;s.handoff={from:p.from,to:p.to,summary:p.summary,artifactId:p.artifactId};edit(p.from,{behavior:'Handoff',task:p.summary,taskId:p.taskId});edit(p.to,{behavior:'Handoff',task:'接收品牌研究摘要并确认首页范围',taskId:p.taskId});break;
    case 'collaboration.started':s.chapter='前往讨论区';s.message=p.topic;break;
    case 'meeting.started':s.chapter='共享讨论';s.meeting={topic:p.topic,summary:p.summary};s.message=p.summary;for(const a of Object.values(s.agents).filter(a=>a.kind==='lead'))edit(a.id,{behavior:'Discussing',task:p.topic});break;
    case 'decision.requested':s.chapter='等待您的决定';s.decision={id:p.decisionId,title:p.title,summary:p.summary,status:'pending'};s.message=p.summary;for(const id of Object.keys(s.agents))if(s.agents[id].behavior!=='Finished')edit(id,{behavior:'Waiting Decision'});break;
    case 'decision.resolved':{
      if(s.decision?.status!=='pending'||s.decision.id!==p.decisionId||!['approved','rejected'].includes(p.resolution))throw Error('No matching pending decision');
      const approved=p.resolution==='approved';
      s.decision={...s.decision,status:approved?'approved':'rejected'};
      s.chapter=approved?'继续执行':'方向已退回';
      s.message=approved?'您已批准模拟品牌方向，任务继续。':'品牌方向已退回，后续执行与交付保持暂停。可重新提交预设方向供确认，或重置演示；不会自动生成修订内容。';
      if(approved)for(const a of Object.values(s.agents))if(a.behavior==='Waiting Decision')edit(a.id,{behavior:a.kind==='lead'?'Discussing':'Working'});
      break;
    }
    case 'artifact.delivered':if(s.decision?.status!=='approved')throw Error('Delivery requires human approval');if(!ARTIFACTS[p.artifactId])throw Error('Unknown mock artifact');if(!s.artifacts.includes(p.artifactId))s.artifacts.push(p.artifactId);s.chapter='成果交付';s.message='在成果台查看品牌方向、网站预览和模拟检查清单。';break;
    case 'simulation.finished':if(s.artifacts.length!==3)throw Error('Incomplete story');s.chapter='交付完成 · 团队待命';s.message=p.summary;Object.keys(s.agents).forEach(id=>edit(id,{behavior:s.agents[id].kind==='lead'?'Standby':'Finished',task:'本次目标已交付，等待新目标'}));break;
  }
  return s;
}
export class MockScenarioRunner {
  private world:World;private listeners=new Set<()=>void>();private cursor=0;private running=false;private clock=0;private snapshot:World;private schedule:ReturnType<typeof validateSchedule>;speed=1;
  constructor(private scenario:ScenarioDefinition){this.schedule=validateSchedule(scenario.fixture);this.world=initialWorld(scenario);this.snapshot=this.world;}
  readonly source='mock';
  get duration(){return this.schedule.at(-1)!.at;}
  get time(){return this.clock;}
  get playing(){return this.running;}
  subscribe=(fn:()=>void)=>{this.listeners.add(fn);return()=>{this.listeners.delete(fn);};};
  getSnapshot=()=>this.snapshot;
  private publish(){this.world={...this.world,time:this.clock};this.snapshot=this.world;this.listeners.forEach(fn=>fn());}
  private emit(type:EventType,payload:Record<string,string>,at=this.clock){const sequence=this.world.events.length+1,id=this.scenario.fixture.scenarioId;this.world=reduceEvent(this.world,{schemaVersion:'m1-mock/1',source:'mock',scenarioId:id,runId:'local-demo',eventId:`${id}:${sequence}`,sequence,occurredAt:new Date(Date.UTC(2026,10,6)+at*1000).toISOString(),at,type,payload},this.scenario);}
  start=()=>{if(this.world.status!=='ready')return;this.running=true;this.world={...this.world,status:'playing'};this.advance(0);this.publish();};
  pause=()=>{if(!this.running)return;this.running=false;this.world={...this.world,status:'paused'};this.publish();};
  play=()=>{if(this.world.status==='ready'){this.start();return;}if(this.world.status!=='paused')return;this.running=true;this.world={...this.world,status:'playing'};this.publish();};
  replay=()=>{this.running=false;this.clock=0;this.cursor=0;this.world=initialWorld(this.scenario);this.publish();};
  approve=()=>{if(this.world.decision?.status!=='pending')return;this.emit('decision.resolved',{decisionId:this.world.decision.id,resolution:'approved'});this.running=true;this.world={...this.world,status:'playing'};this.publish();};
  reject=()=>{if(this.world.decision?.status!=='pending')return;this.emit('decision.resolved',{decisionId:this.world.decision.id,resolution:'rejected'});this.running=false;this.world={...this.world,status:'waiting'};this.publish();};
  resubmit=()=>{if(this.world.decision?.status!=='rejected')return;this.emit('decision.requested',{decisionId:this.world.decision.id,title:'重新确认预设品牌方向？',summary:'这是同一份预设的暖白与青绿方案，尚未生成修订内容。批准后恢复模拟执行，或再次退回 / 重置演示。'});this.publish();};
  setSpeed=(value:number)=>{if([1,2,4].includes(value)){this.speed=value;this.publish();}};
  advance=(seconds:number)=>{
    if(!this.running||seconds<0||!Number.isFinite(seconds))return;
    const target=Math.min(this.duration,this.clock+seconds*this.speed),before=this.world.events.length,oldBucket=Math.floor(this.clock*4);
    while(this.cursor<this.schedule.length && this.schedule[this.cursor].at<=target) {
      const event=this.schedule[this.cursor++];this.clock=event.at;
      this.emit(event.type,event.payload,event.at);
      if(event.type==='decision.requested'){this.running=false;this.world={...this.world,status:'waiting'};break;}
      if(event.type==='simulation.finished'){this.running=false;this.world={...this.world,status:'finished'};break;}
    }
    if(this.running)this.clock=target;
    if(before!==this.world.events.length||oldBucket!==Math.floor(this.clock*4)||!this.running)this.publish();
  };
}
