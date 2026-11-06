import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {MockScenarioRunner,reduceEvent}=await server.ssrLoadModule('/src/mock/world.ts');
 const {CHARACTERS,REGIONS}=await server.ssrLoadModule('/src/office/scene.config.ts');
 const {B1_SCENARIO,B1_ROUTES}=await server.ssrLoadModule('/src/office/scenario.ts');
 const {characterPose,characterStatus,taskRows}=await server.ssrLoadModule('/src/office/projection.ts');
 assert.equal(CHARACTERS.length,7);assert.equal(new Set(CHARACTERS.map(c=>c.worldId)).size,7);
 const leads=CHARACTERS.filter(c=>c.kind==='lead'),workers=CHARACTERS.filter(c=>c.kind==='worker');
 assert.equal(leads.length,3);assert.equal(workers.length,3);assert.equal(REGIONS.length,10);assert.equal(new Set(REGIONS.map(r=>r.id)).size,10);
 const anchors=new Map();
 for(const route of Object.values(B1_ROUTES)){
  for(const [anchor,point] of [[route.from,route.points[0]],[route.to,route.points.at(-1)]]){
   if(anchors.has(anchor))assert.deepEqual(point,anchors.get(anchor));else anchors.set(anchor,point);
  }
  for(const [x,y] of route.points)assert.ok(x>0&&x<1672&&y>0&&y<941);
 }
 const visibleWorkers=w=>workers.filter(c=>characterPose(c,w).visible).map(c=>c.worldId);
 const run=()=>{
  const r=new MockScenarioRunner(B1_SCENARIO);r.reject();r.resubmit();assert.equal(r.getSnapshot().events.length,0);
  assert.equal(Object.keys(r.getSnapshot().agents).length,3);
  assert.ok(leads.every(c=>characterPose(c,r.getSnapshot()).seated));assert.deepEqual(visibleWorkers(r.getSnapshot()),[]);
  assert.equal(r.getSnapshot().agents.receptionist,undefined);assert.ok(characterPose(CHARACTERS.at(-1),r.getSnapshot()).visible);
  r.start();assert.ok(leads.every(c=>!characterPose(c,r.getSnapshot()).seated));
  r.advance(7);assert.deepEqual(visibleWorkers(r.getSnapshot()),[],'spawn alone does not show a working sprite');
  r.advance(1);assert.deepEqual(visibleWorkers(r.getSnapshot()),['visual']);
  assert.equal(r.getSnapshot().departments.research,true);
  r.advance(3);assert.deepEqual(visibleWorkers(r.getSnapshot()),['visual','frontend']);
  r.advance(1000);assert.equal(r.time,40);assert.equal(r.getSnapshot().status,'waiting');
  assert.equal(r.getSnapshot().agents['research-lead'].kind,'lead');
  assert.deepEqual(visibleWorkers(r.getSnapshot()),['visual','frontend'],'waiting decision retains ongoing work');
  r.reject();const rejected=structuredClone(r.getSnapshot());assert.equal(rejected.decision.status,'rejected');
  r.play();r.advance(1000);r.reject();r.approve();assert.deepEqual(r.getSnapshot(),rejected);
  assert.equal(rejected.artifacts.length,0);
  const event={...rejected.events.at(-1),sequence:rejected.events.length+1,eventId:'blocked-delivery',type:'artifact.delivered',payload:{artifactId:'brand-kit'}};
  assert.throws(()=>reduceEvent(rejected,event,B1_SCENARIO),/human approval/);
  r.resubmit();assert.equal(r.getSnapshot().decision.status,'pending');assert.equal(r.getSnapshot().status,'waiting');
  const count=r.getSnapshot().events.length;r.resubmit();assert.equal(r.getSnapshot().events.length,count);
  r.approve();r.advance(1);assert.deepEqual(visibleWorkers(r.getSnapshot()),['frontend']);assert.equal(r.getSnapshot().agents.visual,undefined);
  r.advance(9);assert.deepEqual(visibleWorkers(r.getSnapshot()),['frontend']);
  r.advance(1);assert.deepEqual(visibleWorkers(r.getSnapshot()),['frontend','test']);
  r.advance(4);assert.deepEqual(visibleWorkers(r.getSnapshot()),['test']);assert.equal(r.getSnapshot().agents.frontend,undefined);
  r.advance(5);assert.deepEqual(visibleWorkers(r.getSnapshot()),[]);assert.equal(r.getSnapshot().agents.test,undefined);
  r.advance(24);assert.ok(leads.every(c=>characterPose(c,r.getSnapshot()).seated));
  r.advance(1000);const done=r.getSnapshot();assert.equal(done.status,'finished');assert.equal(done.artifacts.length,3);assert.ok(taskRows(done).every(t=>t.done));
  assert.equal(Object.keys(done.agents).length,3);assert.match(characterStatus(workers[0],done),/已释放/);
  for(const c of leads)assert.deepEqual(characterPose(c,done).feet,c.seated.feet);
  const saved=structuredClone(done);r.replay();assert.ok(leads.every(c=>characterPose(c,r.getSnapshot()).seated));assert.deepEqual(visibleWorkers(r.getSnapshot()),[]);
  return saved;
 };
 assert.deepEqual(run(),run(),'Reject, resubmit and approve replay deterministically');
 console.log('PASS: seven identities; three seated leads + reception at rest; standing on start; three task-scoped worker lifecycles; 10 regions; continuous event routes; human decision gate; exact deterministic replay; retained task history.');
}finally{await server.close();}
