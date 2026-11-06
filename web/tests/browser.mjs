import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
const out=fileURLToPath(new URL('../test-results/',import.meta.url));
fs.mkdirSync(path.join(out,'screenshots'),{recursive:true});fs.mkdirSync(path.join(out,'validation'),{recursive:true});
const server=process.env.B1_URL?null:await createServer({server:{host:'127.0.0.1',port:0,strictPort:true}});
if(server)await server.listen();
const url=process.env.B1_URL??`http://127.0.0.1:${server.httpServer.address().port}/`;
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1672,height:941},deviceScaleFactor:1});
const errors=[],requests=[],checks=[],viewports=[];
function observe(p){p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('requestfailed',r=>errors.push(`${r.url()} ${r.failure()?.errorText}`));p.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()} ${r.url()}`);});p.on('request',r=>requests.push(r.url()));}
observe(page);
const state=()=>page.evaluate(()=>window.__b1.snapshot());
const capture=async(name,p=page)=>{await p.getByRole('dialog').count().then(async n=>{if(n)await p.waitForTimeout(220);});await p.screenshot({path:path.join(out,`screenshots/${name}.png`),animations:'disabled'});};
const close=async(p=page)=>{await p.keyboard.press('Escape');await p.getByRole('dialog').waitFor({state:'detached'});};
const pauseAt=async t=>{
 await page.waitForFunction(t=>window.__b1.snapshot().time>=t,t,{timeout:30000});
 await page.locator('.scene-transport').getByRole('button',{name:'暂停演示',exact:true}).click();
 assert.equal((await state()).status,'paused');
};
let failure,performanceSample;
try{
 await page.goto(url);await page.locator('.scene-loading').waitFor({state:'detached'});
 const {characters,regions}=await page.evaluate(()=>window.__b1);
 for(const [width,height] of [[1672,941],[1920,1080],[1440,900]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(150);
  const geometry=await page.evaluate(()=>{const image=document.querySelector('.architecture').getBoundingClientRect();return {image:image.toJSON(),scroll:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],images:[...document.images].every(i=>i.complete&&i.naturalWidth>0)};});
  assert.ok(geometry.images);assert.ok(geometry.image.left>=-.5&&geometry.image.top>=-.5&&geometry.image.right<=width+.5&&geometry.image.bottom<=height+.5);
  assert.ok(Math.abs(geometry.image.width/geometry.image.height-1672/941)<.001);assert.deepEqual(geometry.scroll,[width,height]);
  await capture(`first-screen-${width}x${height}`);viewports.push({width,height,...geometry});
 }
 assert.equal(await page.locator('.character').count(),4);assert.equal(await page.locator('[data-pose="seated"]').count(),3);assert.equal(await page.locator('[data-character="receptionist"]').count(),1);
 checks.push('Three desktop sizes: full undistorted B00, no page scroll; three seated leads + female reception; no idle worker sprites');
 await page.setViewportSize({width:1672,height:941});
 for(const r of regions){
  const box=await page.locator('.scene-plane').boundingBox();
  const point=r.id==='lounge'?[578,600]:r.center;
  await page.mouse.click(box.x+point[0]*box.width/1672,box.y+point[1]*box.height/941);
  await page.getByRole('dialog').getByRole('heading',{name:r.name,exact:true}).waitFor();await close();
 }
 checks.push('Ten actual polygon/screen hit areas open their corresponding distinct region details');
 for(const c of characters){
  if(c.kind==='worker'){assert.equal(await page.locator(`[data-character="${c.id}"]`).count(),0);await page.getByRole('button',{name:'自由探索',exact:true}).click();await page.locator('.people-grid').getByRole('button',{name:new RegExp(c.name)}).click();}
  else await page.locator(`[data-character="${c.id}"]`).click();
  await page.getByRole('dialog').getByRole('heading',{name:c.name,exact:true}).waitFor();
  await page.getByRole('button',{name:c.questions[0]}).click();
  assert.ok((await page.locator('.conversation').innerText()).includes(c.answers[0]));
  assert.equal((await state()).events.length,0,'Mock chat must not mutate business state');
  if(c.id==='receptionist')await capture('receptionist-dialog');
  if(c.id==='design-lead'){await capture('agent-dialog');await page.getByRole('textbox').fill('请说明你当前的职责');await page.getByRole('button',{name:'发送',exact:true}).click();assert.equal(await page.locator('.message.user').count(),2);}
  await page.getByRole('button',{name:'关闭窗口'}).focus();await page.keyboard.press('Shift+Tab');assert.ok(await page.getByRole('dialog').evaluate(e=>e.contains(document.activeElement)));
  await close();if(c.kind!=='worker')await page.waitForFunction(id=>document.activeElement?.getAttribute('data-character')===id,c.id);
 }
 checks.push('Four resting sprites receive pointer clicks; seven roster dialogs have distinct identities and Mock replies; focus restoration and typed chat work');
 await page.locator('[data-region="research"]').focus();await page.keyboard.press('Enter');await page.getByRole('dialog').waitFor();
 for(let i=0;i<20;i++){await page.keyboard.press('Tab');assert.ok(await page.getByRole('dialog').evaluate(e=>e.contains(document.activeElement)));}
 await page.mouse.click(8,8);await page.getByRole('dialog').waitFor({state:'detached'});checks.push('SVG keyboard activation, focus trap, Escape, close button and blank backdrop exit');
 await page.locator('[data-region-label="showcase"]').click();await capture('artifact-brand');
 await page.getByRole('tab',{name:'品牌网站'}).click();await capture('artifact-website');assert.ok((await page.getByRole('tabpanel').innerText()).includes('无外部部署'));
 await page.getByRole('tab',{name:'交付报告'}).click();assert.ok((await page.getByRole('tabpanel').innerText()).includes('尚未执行'));await close();
 checks.push('Three readable artifact tabs; sample vs delivered distinction; report cannot claim tests before task event');
 await page.locator('.scene-transport').getByLabel('播放速度').selectOption('4');
 await page.getByRole('button',{name:'播放演示',exact:true}).click();assert.equal(await page.locator('[data-pose="seated"]').count(),0);await pauseAt(8.2);assert.equal(await page.locator('[data-character="visual-worker"]').count(),1);assert.equal(await page.locator('[data-character="frontend-worker"]').count(),0);await page.getByRole('button',{name:'继续演示',exact:true}).click();await pauseAt(11.2);
 assert.equal(Object.keys((await state()).agents).length,5);const frozen=await state();
 const actorBox=await page.locator('[data-character="design-lead"]').boundingBox();await page.waitForTimeout(400);assert.deepEqual(await state(),frozen);assert.deepEqual(await page.locator('[data-character="design-lead"]').boundingBox(),actorBox);
 for(const id of ['visual-worker','frontend-worker']){await page.locator(`[data-character="${id}"]`).click();await page.getByRole('dialog').waitFor();await close();}
 await capture('active-workers');checks.push('Existing worker.spawned instances, event task feedback, pause freezes both world clock and 2D travel');
 await page.getByRole('button',{name:'继续演示',exact:true}).click();await pauseAt(26);await capture('handoff');
 await page.getByRole('button',{name:'继续演示',exact:true}).click();await page.waitForFunction(()=>window.__b1.snapshot().status==='waiting');assert.equal((await state()).time,40);
 await capture('decision-scene');await page.getByTestId('decision-notice').click();await capture('decision-dialog');
 await page.getByRole('button',{name:'退回方向',exact:true}).click();assert.equal((await state()).decision.status,'rejected');
 await close();const rejected=await state();await page.waitForTimeout(600);assert.deepEqual(await state(),rejected);assert.equal(rejected.artifacts.length,0);assert.ok(await page.getByRole('button',{name:'继续演示',exact:true}).isDisabled());
 await page.getByTestId('decision-notice').click();await page.getByRole('button',{name:'重新提交预设方向'}).click();assert.equal((await state()).decision.status,'pending');
 await page.getByRole('button',{name:'批准方向并继续'}).click();await close();
 await pauseAt(41.3);assert.equal(await page.locator('[data-character="visual-worker"]').count(),0);assert.equal(await page.locator('[data-character="frontend-worker"]').count(),1);
 await page.getByRole('button',{name:'继续演示',exact:true}).click();await pauseAt(51.2);await page.locator('[data-character="qa-worker"]').click();await page.getByRole('heading',{name:'测试 Agent',exact:true}).waitFor();await close();await capture('qa-running');
 await page.getByRole('button',{name:'继续演示',exact:true}).click();await pauseAt(55.2);assert.equal(await page.locator('[data-character="frontend-worker"]').count(),0);assert.equal(await page.locator('[data-character="qa-worker"]').count(),1);
 await page.getByRole('button',{name:'继续演示',exact:true}).click();await pauseAt(60.2);assert.equal(await page.locator('.character').count(),4);await capture('workers-released');
 checks.push('Task start shows visual / frontend / QA; pending decision retains active sprites; each task finish removes its worker; all three active workers are clickable');
 await page.getByRole('button',{name:'继续演示',exact:true}).click();await pauseAt(72);assert.equal((await state()).artifacts.length,3);await capture('delivered-scene');await page.getByRole('button',{name:'继续演示',exact:true}).click();
 await page.waitForFunction(()=>window.__b1.snapshot().status==='finished');const rejectedDone=await state();assert.equal(Object.keys(rejectedDone.agents).length,3);assert.equal(await page.locator('[data-pose="seated"]').count(),3);await page.mouse.move(1620,800);await capture('returned-to-lounge');
 fs.writeFileSync(path.join(out,'validation/rejected-branch-world.json'),JSON.stringify(rejectedDone,null,2));
 checks.push('Human rejection blocks clock and delivery; explicit resubmit then actual approval continues the original event story');
 await page.locator('[data-region-label="showcase"]').click();await page.getByRole('tab',{name:'交付报告'}).click();await capture('artifact-report');assert.equal(await page.getByRole('tabpanel').getByText('模拟通过',{exact:true}).count(),3);
 await page.getByRole('button',{name:/沉淀 Team/}).click();const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'下载 Team / Practice 草稿'}).click();const download=await downloadPromise;const draftPath=path.join(out,'validation/practice-draft.json');await download.saveAs(draftPath);const draft=JSON.parse(fs.readFileSync(draftPath,'utf8'));assert.equal(draft.verified,false);assert.equal(draft.source,'mock');assert.equal(draft.roles.length,6);assert.equal(draft.teams.length,3);assert.ok(!draft.roles.some(r=>r.id==='receptionist'));await close();
 checks.push('Delivered reports show only Mock checks; local Team/Practice JSON explicitly unverified');
 const completeRun=async()=>{await page.getByRole('button',{name:'重置演示',exact:true}).click();assert.equal((await state()).events.length,0);assert.equal(await page.locator('[data-pose="seated"]').count(),3);assert.equal(await page.locator('.character').count(),4);await page.getByRole('button',{name:'播放演示',exact:true}).click();await page.waitForFunction(()=>window.__b1.snapshot().status==='waiting');await page.getByTestId('decision-notice').click();await page.getByRole('button',{name:'批准方向并继续'}).click();await close();await page.waitForFunction(()=>window.__b1.snapshot().status==='finished');return state();};
 const completed=await completeRun();assert.deepEqual(await completeRun(),completed);
 const baseline=JSON.parse(fs.readFileSync(new URL('./fixtures/completed-world.json',import.meta.url),'utf8'));
 assert.deepEqual(completed,baseline,'Extracted demo preserves the reviewed B1 world and every event');
 fs.writeFileSync(path.join(out,'validation/completed-world.json'),JSON.stringify(completed,null,2));checks.push('Two real UI replays produce identical final World; every event and final state match the reviewed B1 baseline');
 await page.getByRole('button',{name:'重置演示',exact:true}).click();await page.getByRole('button',{name:'播放演示',exact:true}).click();await page.getByRole('button',{name:'自由探索',exact:true}).click();assert.equal((await state()).status,'paused');await page.locator('.people-grid').getByRole('button',{name:/测试 Agent/}).click();await close();assert.equal(await page.locator('[data-character="qa-worker"]').count(),0);checks.push('Exit to free exploration pauses simulation while region and character interaction remains available');
 await page.getByRole('button',{name:'重置演示',exact:true}).click();await page.getByRole('button',{name:'热点关'}).click();assert.ok(await page.locator('.hotspot-layer').evaluate(e=>e.classList.contains('debug')));await capture('hotspot-calibration');await page.getByRole('button',{name:'热点开'}).click();
 await page.emulateMedia({reducedMotion:'reduce'});assert.ok(await page.locator('.character img').evaluateAll(es=>es.every(e=>getComputedStyle(e).animationName==='none')));await page.emulateMedia({reducedMotion:'no-preference'});checks.push('Development hotspot overlay and reduced-motion CSS supported');
 performanceSample=await page.evaluate(()=>new Promise(resolve=>{let last=performance.now(),samples=[];function tick(now){samples.push(now-last);last=now;if(samples.length<120)requestAnimationFrame(tick);else{samples.sort((a,b)=>a-b);resolve({frames:120,medianMs:samples[60],p95Ms:samples[114],over50Ms:samples.filter(n=>n>50).length});}}requestAnimationFrame(tick);}));
 const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});observe(mobile);await mobile.goto(url);await mobile.locator('.scene-loading').waitFor({state:'detached'});await capture('first-screen-390x844',mobile);
 assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth),390);
 const scroll0=await mobile.locator('.scene-viewport').evaluate(e=>e.scrollLeft);
 const cdp=await mobile.context().newCDPSession(mobile);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:280,y:250}]});for(let x=260;x>=120;x-=20){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:250}]});await mobile.waitForTimeout(25);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await mobile.waitForTimeout(300);
 assert.ok(await mobile.locator('.scene-viewport').evaluate((e,n)=>e.scrollLeft>n,scroll0));
 for(const r of regions){await mobile.getByLabel('移动端区域导航').selectOption(r.id);await mobile.getByRole('button',{name:'进入 ↗',exact:true}).click();await mobile.getByRole('dialog').getByRole('heading',{name:r.name,exact:true}).waitFor();await mobile.getByRole('button',{name:'关闭窗口'}).click();}
 await mobile.getByLabel('移动端区域导航').selectOption('lounge');await capture('lounge-mobile',mobile);
 await mobile.getByLabel('场景缩放').selectOption('1');assert.equal(await mobile.locator('.scene-plane').evaluate(e=>getComputedStyle(e).transform),'matrix(1, 0, 0, 1, 0, 0)');await mobile.getByLabel('场景缩放').selectOption('0.85');
 for(const c of characters){await mobile.getByRole('button',{name:'打开空间导览'}).click();await mobile.locator('.people-grid').getByRole('button',{name:new RegExp(c.name)}).click();await mobile.getByRole('heading',{name:c.name,exact:true}).waitFor();if(c.id==='design-lead')await capture('agent-dialog-mobile',mobile);assert.equal(await mobile.getByRole('dialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1),true);await mobile.getByRole('button',{name:'关闭窗口'}).click();}
 await mobile.getByLabel('移动端区域导航').selectOption('showcase');await mobile.getByRole('button',{name:'进入 ↗',exact:true}).click();await mobile.getByRole('tab',{name:'品牌网站'}).click();await capture('artifact-mobile',mobile);await mobile.getByRole('button',{name:'关闭窗口'}).click();
 await mobile.getByLabel('移动端区域导航').selectOption('goal');await mobile.getByRole('button',{name:'播放演示',exact:true}).click();await mobile.getByRole('button',{name:'暂停演示',exact:true}).click();assert.equal(await mobile.evaluate(()=>window.__b1.snapshot().status),'paused');await mobile.getByRole('button',{name:'重置演示',exact:true}).click();assert.equal(await mobile.evaluate(()=>window.__b1.snapshot().status),'ready');
 checks.push('390×844 touch panning, explicit zoom, all ten navigation destinations, seven role dialogs, readable artifact tabs and playback controls');await mobile.close();
 assert.deepEqual(errors,[]);assert.ok(requests.every(u=>u.startsWith('http://127.0.0.1:')||u.startsWith('data:')||u.startsWith('blob:')));assert.ok(!requests.some(u=>/\.glb(?:\?|$)|three\.module/.test(u)));assert.equal(await page.locator('canvas').count(),0);checks.push('No browser errors, failed resources, external execution requests, 3D canvas or GLB loads');
}catch(error){failure=String(error.stack??error);await capture('failure').catch(()=>{});process.exitCode=1;}
finally{fs.writeFileSync(path.join(out,'validation/browser.json'),JSON.stringify({url,passed:!failure,checks,errors,viewports,performanceSample,failure,requests:[...new Set(requests)],scope:'Headless Chromium, local desktop. Mobile is emulated; no physical-device or cross-browser certification.'},null,2));await browser.close();if(server)await server.close();}
console.log(JSON.stringify({passed:!failure,checks,errors,performanceSample,failure},null,2));
