import fixture from '../../fixtures/b1-brand-website.json';
import {type Agent,type ScenarioDefinition,type ScenarioRoute} from '../mock/world';
import {CHARACTERS,type Pixel} from './scene.config';

// One explicit B1 roster and fixture, run by the existing MockScenarioRunner.
// Reception is a persistent UI guide, not an execution agent or a department.
export const B1_AGENTS:Record<string,Agent>=Object.fromEntries(CHARACTERS.filter(c=>c.kind!=='reception').map(c=>[c.worldId,{
 id:c.worldId,name:c.english,role:c.name,department:c.team as Agent['department'],kind:c.kind as Agent['kind'],home:c.feet,
 behavior:c.kind==='lead'?'Standby':'Idle',task:c.kind==='lead'?'在休息区待命，等待品牌网站目标':'等待任务',
}]));
const homes=Object.fromEntries(CHARACTERS.filter(c=>c.kind==='lead').map(c=>[c.worldId,c.feet]));
const a={
 designStandby:homes['design-lead'],devStandby:homes['dev-lead'],researchStandby:homes['research-lead'],
 designWork:[301,454],devWork:[1444,380],researchWork:[591,322],
 designHandoff:[727,706],devHandoff:[1051,706],designMeeting:[777,710],devMeeting:[996,710],researchMeeting:[625,704],
 designDelivery:[1233,799],devDelivery:[1514,808],researchDelivery:[1161,741],
} satisfies Record<string,Pixel>;
type Anchor=keyof typeof a;
function route(from:Anchor,to:Anchor,via:Pixel[],zone:string,arrival:ScenarioRoute['arrival'],duration:number):ScenarioRoute{
 return {from,to,points:[a[from],...via,a[to]],face:[840,570],zone,arrival,duration};
}
// Durations fit the retained 0–88 s story. Coordinates are B00 pixels throughout.
export const B1_ROUTES:Record<string,ScenarioRoute>={
 'design-office':route('designStandby','designWork',[[580,647],[591,456],[524,460],[420,465]],'design','Planning',4),
 'dev-office':route('devStandby','devWork',[[626,735],[1149,735],[1170,592],[1118,434],[1165,377]],'development','Planning',7),
 'research-office':route('researchStandby','researchWork',[[603,640],[592,456],[650,333]],'research','Planning',4),
 handoff:route('designWork','designHandoff',[[523,466],[592,456],[603,640],[631,720]],'collaboration','Handoff',5),
 'dev-handoff':route('devWork','devHandoff',[[1165,377],[1118,434],[1170,590],[1156,717]],'collaboration','Handoff',6),
 'design-meeting':route('designHandoff','designMeeting',[],'collaboration','Discussing',2),
 'dev-meeting':route('devHandoff','devMeeting',[],'collaboration','Discussing',2),
 'research-meeting':route('researchWork','researchMeeting',[[650,333],[592,456],[603,640]],'collaboration','Discussing',7),
 'design-home':route('designMeeting','designWork',[[630,725],[603,640],[592,456],[523,466]],'design','Working',6),
 'dev-home':route('devMeeting','devWork',[[1156,717],[1170,590],[1118,434],[1165,377]],'development','Working',7),
 'research-home':route('researchMeeting','researchWork',[[603,640],[592,456],[650,333]],'research','Working',7),
 'design-delivery':route('designWork','designDelivery',[[523,466],[592,456],[603,640],[631,733],[1149,739],[1161,794]],'delivery','Delivering',8),
 'dev-delivery':route('devWork','devDelivery',[[1165,377],[1118,434],[1170,590],[1149,739],[1161,794]],'delivery','Delivering',8),
 'research-delivery':route('researchWork','researchDelivery',[[650,333],[592,456],[603,640],[631,733]],'delivery','Delivering',9),
 'design-standby':route('designDelivery','designStandby',[[1161,794],[1149,739],[631,733],[600,650],[298,640]],'standby','Standby',9),
 'dev-standby':route('devDelivery','devStandby',[[1161,814],[1149,756],[661,746],[600,655]],'standby','Standby',9),
 'research-standby':route('researchDelivery','researchStandby',[[631,748],[610,681]],'standby','Standby',9),
};
export const B1_SCENARIO:ScenarioDefinition={fixture,agents:B1_AGENTS,routes:B1_ROUTES};
