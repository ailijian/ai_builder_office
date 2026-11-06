import {useEffect,useRef,useState,type ReactNode} from 'react';
import {ARTIFACTS,type MockScenarioRunner,type World} from '../mock/world';
import {CHARACTERS,TEAM_LABEL,REGIONS,REGION_BY_ID,type Character,type RegionId} from './scene.config';
import {characterStatus,taskRows} from './projection';
import {Icon} from './Icon';
import {B1_AGENTS} from './scenario';

export type Selection={kind:'region';id:RegionId}|{kind:'agent';id:string}|{kind:'practice'}|{kind:'directory'}|{kind:'events'};
interface Props {selection:Selection;world:World;runner:MockScenarioRunner;onClose:()=>void;onSelect:(selection:Selection)=>void}
export function OfficeDialog({selection,world,runner,onClose,onSelect}:Props){
 const ref=useRef<HTMLElement>(null),closeRef=useRef<HTMLButtonElement>(null),close=useRef(onClose);close.current=onClose;
 useEffect(()=>{
  closeRef.current?.focus();
  const keyboard=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();close.current();}
   if(e.key==='Tab'){
    const nodes=[...ref.current!.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input,select,[tabindex="0"]')].filter(n=>n.getClientRects().length);
    const first=nodes[0],last=nodes.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
   }
  };document.addEventListener('keydown',keyboard);
  return()=>document.removeEventListener('keydown',keyboard);
 },[]);
 useEffect(()=>{closeRef.current?.focus();ref.current?.scrollTo(0,0);},[selection]);
 const c=selection.kind==='agent'?CHARACTERS.find(c=>c.id===selection.id):undefined;
 const title=c?.name??(selection.kind==='region'?REGION_BY_ID[selection.id].name:selection.kind==='practice'?'让好的工作方法留下来':selection.kind==='events'?'工作记录':'探索你的工作群岛');
 return <div className="dialog-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><section ref={ref} className={`office-dialog ${selection.kind==='region'&&selection.id==='showcase'?'showcase-dialog':''}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <header className="dialog-header"><div><span className="eyebrow">AGENT OFFICE <span>／ MOCK · SIMULATION</span></span><h2 id="dialog-title">{title}</h2></div><button ref={closeRef} className="close-button" aria-label="关闭窗口" onClick={onClose}>×</button></header>
  {c?<AgentConversation key={c.id} character={c} world={world} onSelect={onSelect}/>:selection.kind==='region'?<RegionContent id={selection.id} world={world} runner={runner} onSelect={onSelect} onClose={onClose}/>:selection.kind==='practice'?<Practice world={world}/>:selection.kind==='events'?<EventLog world={world}/>:<><p className="dialog-intro">从一个空间，认识一支团队。点击区域或人物，查看他们负责的工作。</p><div className="directory-regions">{REGIONS.map(r=><button key={r.id} onClick={()=>onSelect({kind:'region',id:r.id})}><Icon name={r.icon}/><span>{r.name}<small>{r.english}</small></span><span>↗</span></button>)}</div><h3>认识七位角色</h3><div className="people-grid">{CHARACTERS.map(c=><PersonButton key={c.id} c={c} world={world} onSelect={onSelect}/>)}</div></>}
 </section></div>;
}
function PersonButton({c,world,onSelect}:{c:Character;world:World;onSelect:Props['onSelect']}){return <button className="person-button" onClick={()=>onSelect({kind:'agent',id:c.id})}><span className="portrait"><img src={c.image} alt=""/></span><span><strong>{c.name}</strong><small>{characterStatus(c,world)}</small></span><span>↗</span></button>;}
function AgentConversation({character:c,world:w,onSelect}:{character:Character;world:World;onSelect:Props['onSelect']}){
 const [messages,setMessages]=useState<{question:string;answer:string}[]>([]),[input,setInput]=useState('');
 const active=w.agents[c.worldId],lastAssignment=[...w.events].reverse().find(e=>e.type==='task.assigned'&&e.payload.agentId===c.worldId);
 const ask=(question:string,index?:number)=>{
  const answer=index!==undefined?c.answers[index]:`我负责${c.responsibility} ${active?.taskId?`当前模拟任务是「${active.task}」。`:'当前任务以事件状态栏为准。'}这是预设回复；你可以用下方示例问题查看具体的${c.english}工作说明。`;
  setMessages(previous=>[...previous,{question,answer}]);setInput('');
 };
 return <div className="agent-content"><div className="agent-profile"><div className="portrait large"><img src={c.image} alt={c.name}/></div><div><span className="eyebrow">{c.english}</span><h3>{TEAM_LABEL[c.team]}</h3><p>{c.responsibility}</p><span className="pill">{characterStatus(c,w)}</span></div></div>
  <div className="current-task"><span className="eyebrow">当前任务 · 事件记录</span><p>{c.kind==='reception'?'常驻接待与空间导览；不承担模拟执行任务。':active?.task??(lastAssignment?`${lastAssignment.payload.title}（历史任务；当前实例已释放）`:'尚未调用。任务开始时才会在执行岛出现，完成后释放。')}</p>{active?.taskId&&<small>任务 {active.taskId} · {active.parentAgentId?`负责人 ${B1_AGENTS[active.parentAgentId].role}`:'组织与协作'}</small>}</div>
  <h3 className="section-label">和 {c.english} 聊聊</h3><p className="muted">所有对话均为本地预设的模拟消息，不调用真实 Agent。</p>
  <div className="conversation" aria-live="polite"><div className="message assistant"><small>{c.english} · 模拟消息</small>你好，我是{c.name}。{c.responsibility}</div>{messages.map((m,i)=><div key={i}><div className="message user"><small>你</small>{m.question}</div><div className="message assistant"><small>{c.english} · 预设模拟回复</small>{m.answer}</div></div>)}</div>
  <div className="question-chips">{c.questions.map((q,i)=><button key={q} onClick={()=>ask(q,i)}>{q} ↗</button>)}</div>
  <form className="chat-form" onSubmit={e=>{e.preventDefault();if(input.trim())ask(input.trim());}}><input aria-label={`向${c.name}提问`} placeholder="输入问题，体验模拟对话…" value={input} maxLength={500} onChange={e=>setInput(e.target.value)}/><button className="primary" disabled={!input.trim()}>发送</button></form>
  <div className="inline-actions"><button className="text-button" onClick={()=>onSelect({kind:'region',id:c.team==='dev'?'development':c.team==='reception'?'reception':c.team})}>查看团队与任务 ↗</button><button className="text-button" onClick={()=>onSelect({kind:'region',id:'showcase'})}>查看成果 ↗</button><button className="text-button" onClick={()=>onSelect({kind:'region',id:'collaboration'})}>协作记录 ↗</button></div>
 </div>;
}
export function Decision({world:w,runner}:{world:World;runner:MockScenarioRunner}){
 const d=w.decision;if(!d)return null;
 return <section className="decision-detail" data-testid="decision-detail"><span className="eyebrow">HUMAN DECISION · 人类决定</span><h3>{d.status==='rejected'?'方向已退回，交付保持暂停':d.title}</h3><p>{d.status==='rejected'?w.message:d.summary}</p>
  {d.status==='pending'?<div className="button-row"><button className="primary" onClick={runner.approve}>批准方向并继续</button><button className="secondary" onClick={runner.reject}>退回方向</button></div>:d.status==='rejected'?<button className="primary" onClick={runner.resubmit}>重新提交预设方向</button>:<span className="pill">已批准 · Mock 决策记录</span>}
  {d.status!=='approved'&&<small>等待和播放均不会绕过决定。退回不会自动生成新的品牌方案。</small>}
 </section>;
}
function TaskList({world,team}:{world:World;team?:'design'|'dev'|'research'}){return <div className="task-list">{taskRows(world).filter(t=>!team||t.character.team===team).map(t=><div key={t.character.id}><span className={`task-dot ${t.done?'complete':''}`}>{t.done?'✓':'·'}</span><div><strong>{t.character.name}</strong><p>{t.title}</p></div><small>{t.status}</small></div>)}</div>;}
function RegionContent({id,world:w,runner,onSelect,onClose}:{id:RegionId;world:World;runner:MockScenarioRunner;onSelect:Props['onSelect'];onClose:()=>void}){
 if(id==='showcase')return <ArtifactViewer world={w} onSelect={onSelect}/>;
 const people=(team?:'design'|'dev'|'research')=><div className="people-grid">{CHARACTERS.filter(c=>!team||c.team===team).map(c=><PersonButton key={c.id} c={c} world={w} onSelect={onSelect}/>)}</div>;
 const content:Record<Exclude<RegionId,'showcase'>,ReactNode>={
 reception:<><p className="dialog-intro">一个目标，一支团队。让好想法在这里开始生长。</p><div className="goal-brief"><span className="eyebrow">本次演示目标</span><h3>为一个新品牌制作品牌 VI，<br/>并开发一个品牌展示网站。</h3><p>你是品牌主理人，保留创意方向与最终结果判断。研究策划、品牌设计和网站研发三位负责人组织模拟工作，在关键时刻请你决定。</p><button className="primary" onClick={()=>{runner.play();onClose();}} disabled={w.status==='waiting'||w.status==='finished'}>{w.status==='ready'?'开始目标演示 →':w.status==='paused'?'继续演示 →':'返回办公空间 →'}</button></div><p className="muted">88 个模拟秒，可暂停、重置与回放。所有任务、对话和成果都是 Mock；模拟时长不代表真实执行效率。</p></>,
 lounge:<><p className="dialog-intro">留出一点呼吸的空间，也为下一个目标做好准备。</p><div className="stat-strip"><span><strong>{Object.values(w.agents).filter(a=>a.kind==='lead').length}</strong>常驻负责人</span><span><strong>{Object.values(w.agents).filter(a=>a.kind==='worker').length}</strong>当前 Mock 执行实例</span><span><strong>{w.status==='ready'?'待命':w.chapter}</strong>工作室状态</span></div><div className="people-grid">{CHARACTERS.filter(c=>c.kind==='lead').map(c=><PersonButton key={c.id} c={c} world={w} onSelect={onSelect}/>)}</div><p className="muted">三位负责人待命时在此休息：设计与研发面对面交流，研究策划负责人阅读。开始演示后起身工作，交付后回到休息区。子 Agent 未运行时不出现在场景中。</p></>,
 design:<><p className="dialog-intro">把品牌的想法，变成清晰、可信赖的视觉表达。</p><div className="department-summary"><Icon name="palette" size={40}/><div><h3>品牌设计 · {w.departments.design?'已激活':w.recommended?'已推荐':'待命'}</h3><p>接收研究摘要 → 品牌定位 → VI 方向 → 人类确认</p></div></div>{people('design')}<h3>品牌工作清单</h3><TaskList world={w} team="design"/><button className="text-button" onClick={()=>onSelect({kind:'region',id:'showcase'})}>阅读品牌 VI 样例与交付状态 ↗</button></>,
 research:<><p className="dialog-intro">先理解人和问题，再决定品牌如何表达。</p><div className="reading-note"><span className="eyebrow">研究计划 · 预设样例</span><h3>面向独立创作者与小团队</h3><ol><li>整理受众：希望把想法转化为可信赖展示的小团队。</li><li>提炼需求：主张清晰、内容易读、联系路径明确。</li><li>形成摘要：以「温暖、清晰、可信赖」进入品牌方向讨论。</li></ol><p className="muted">未进行真实访谈或外部研究。以上是可回放剧情中的预设输入。</p></div><PersonButton c={CHARACTERS[2]} world={w} onSelect={onSelect}/><TaskList world={w} team="research"/></>,
 goal:<><p className="dialog-intro">{w.goal||'为一个新品牌制作品牌 VI，并开发一个品牌展示网站。'}</p><div className="stat-strip"><span><strong>{w.chapter}</strong>当前阶段</span><span><strong>{taskRows(w).filter(t=>t.done).length} / 4</strong>完成的模拟任务</span><span><strong>{w.artifacts.length} / 3</strong>已交付 Mock 成果</span></div>{w.status==='ready'&&<button className="primary" onClick={()=>{runner.start();onClose();}}>开始目标演示 →</button>}<p>{w.message}</p><Decision world={w} runner={runner}/><h3>围绕目标组织团队</h3><p>研究策划：受众与品牌研究；品牌设计：定位与 VI；网站研发：页面实现与检查。推荐来自预设场景。</p><TaskList world={w}/><button className="text-button" onClick={()=>onSelect({kind:'events'})}>查看可回放事件记录 ↗</button></>,
 collaboration:<><p className="dialog-intro">让研究、设计与研发在同一张桌前，对齐同一个目标。</p><div className="reading-note"><span className="eyebrow">跨部门交接</span><h3>{w.handoff?'品牌研究摘要已交接':'等待品牌研究摘要'}</h3><p>{w.handoff?.summary??'研究任务完成后，设计负责人将摘要交给研发负责人，明确首页范围。'}</p>{w.handoff&&<small>关联产物 {w.handoff.artifactId} · 来源 task.handoff · Mock</small>}</div><div className="reading-note"><span className="eyebrow">讨论记录</span><h3>{w.meeting?.topic??'品牌方向与首页首屏如何保持一致？'}</h3><p>{w.meeting?.summary??'会议尚未开始。到达剧情节点后，这里会显示来自 meeting.started 的实际模拟纪要。'}</p></div><Decision world={w} runner={runner}/></>,
 development:<><p className="dialog-intro">让品牌的表达，成为可以被看见的页面体验。</p><div className="department-summary"><Icon name="code" size={40}/><div><h3>网站研发 · {w.departments.dev?'已激活':w.recommended?'已推荐':'待命'}</h3><p>首页结构 → 品牌交接 → 前端实现 → 模拟检查</p></div></div>{people('dev')}<h3>研发工作清单</h3><TaskList world={w} team="dev"/><button className="text-button" onClick={()=>onSelect({kind:'region',id:'showcase'})}>阅读网站示意与检查报告 ↗</button></>,
 workers:<><p className="dialog-intro">按工作需要加入，完成后释放。每个实例都有自己的任务。</p><TaskList world={w}/><div className="people-grid">{CHARACTERS.filter(c=>c.kind==='worker').map(c=><PersonButton key={c.id} c={c} world={w} onSelect={onSelect}/>)}</div><p className="muted">三块物理屏幕分别对应视觉、前端和测试。任务启动时人物出现，等待审批时保留，任务完成后消失。研究由常驻的研究策划负责人承担。</p></>,
 mezzanine:<><p className="dialog-intro">在工作的间隙，抬头看一看树与天空。</p><div className="retreat-art"><Icon name="leaf" size={64}/><p>Room to think.<br/><strong>留一点空间，让想法生长。</strong></p></div><h3>关于这个工作室</h3><p>玻璃穹顶、开放式夹层与大量绿植来自你提供的 B00 场景。这里承载工作室说明与休息氛围，不产生业务活动或虚构效率指标。</p><p className="muted">环境光、屏幕与水面仅为轻微网页叠加；建筑保持原始图像。系统减少动态效果设置会关闭常态动画。</p></>,
 };
 return content[id];
}
function ArtifactViewer({world:w,onSelect}:{world:World;onSelect:Props['onSelect']}){
 const [tab,setTab]=useState<'brand-kit'|'website-preview'|'mock-checklist'>('brand-kit');
 const data=ARTIFACTS[tab],delivered=w.artifacts.includes(tab),tested=w.events.some(e=>e.type==='task.finished'&&e.payload.agentId==='test');
 return <><div className="artifact-topline"><p>从方向到成果，每一份交付都可以打开阅读。</p><span className="pill">{delivered?'已交付 · Mock':'样例预览 · 尚未交付'}</span></div>
  <div className="artifact-tabs" role="tablist" aria-label="成果类型">{([['brand-kit','品牌 VI'],['website-preview','品牌网站'],['mock-checklist','交付报告']] as const).map(([id,label],i)=><button key={id} id={`tab-${id}`} role="tab" tabIndex={tab===id?0:-1} aria-selected={tab===id} aria-controls={`panel-${id}`} onClick={()=>setTab(id)} onKeyDown={e=>{const ids=['brand-kit','website-preview','mock-checklist'] as const;let next=i;if(e.key==='ArrowRight')next=(i+1)%3;else if(e.key==='ArrowLeft')next=(i+2)%3;else if(e.key==='Home')next=0;else if(e.key==='End')next=2;else return;e.preventDefault();setTab(ids[next]);document.getElementById(`tab-${ids[next]}`)?.focus();}}>{label}<span>0{i+1}</span></button>)}</div>
  <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="artifact-panel">
  {tab==='brand-kit'?<div className="brand-delivery"><div className="brand-specimen"><span className="eyebrow">BRAND CONCEPT / 01</span><div className="seed-mark"><Icon name="leaf" size={80}/><span>SEED<small>STUDIO</small></span></div><h3>让好想法开始生长。</h3><p>一个温暖、清晰、可信赖的品牌方向</p><small>Logo 构图示意 · 非已验收品牌资产</small></div><div className="brand-rules"><h3>颜色与视觉规范</h3><div className="swatches">{[['#397D73','青绿'],['#F4F0E8','暖白'],['#B99A76','浅木色']].map(([color,name])=><div key={color}><i style={{background:color}}/><strong>{name}</strong><small>{color}</small></div>)}</div><p>暖白建立留白，青绿承担主要识别，木色表达温度。保持标题清晰、正文易读、语气简明。</p><p className="muted">字标与叶片为网页绘制的样例构图，未导出真实品牌源文件，也未进行商标验证。</p></div></div>:tab==='website-preview'?<div className="website-sample"><div className="sample-nav"><span>◒ SEED STUDIO</span><small>品牌主张　／　核心价值　／　联系入口</small></div><div className="sample-hero"><span className="eyebrow">A LITTLE IDEA. A BIG BEGINNING.</span><h3>让好想法<br/><em>开始生长。</em></h3><p>用清晰的表达，连接值得被看见的价值。</p><span className="sample-cta">一起创造新的可能 ↗</span><div className="sample-orbit"><Icon name="leaf" size={120}/></div></div><div className="sample-values"><span>01 清晰的品牌主张</span><span>02 有温度的体验</span><span>03 可信赖的表达</span></div><small className="sample-note">内置静态页面示意 · 联系入口为构图示例 · 无外部部署</small></div>:<div className="delivery-report"><div className="report-title"><Icon name="check" size={44}/><div><span className="eyebrow">DELIVERY REPORT · SIMULATION</span><h3>{w.artifacts.length===3?'三份模拟成果已交付':'目标仍在准备或执行中'}</h3></div></div><TaskList world={w}/><h3>预设检查结果</h3><div className="report-checks">{['内容完整性','联系入口','品牌一致性'].map(label=><div key={label}><span>{label}</span><strong>{tested?'模拟通过':'尚未执行'}</strong><small>{tested?'来自 Mock 测试任务完成事件':'等待测试任务完成事件'}</small></div>)}</div><p>品牌决定：{w.decision?.status==='approved'?'用户已批准':w.decision?.status==='rejected'?'用户已退回':'尚未批准'}。真实项目验收：未进行。</p><p className="evidence-note">证据范围：本地预设剧情与事件记录。模拟通过不代表真实网站、链接、性能或部署通过测试。</p><button className="text-button" onClick={()=>onSelect({kind:'events'})}>查看任务与决定的事件依据 ↗</button></div>}
  <div className="artifact-description"><h3>{data.title}</h3><p>{data.summary}</p><ul>{data.details.map(detail=><li key={detail}>{detail}</li>)}</ul></div></div>
  <footer className="artifact-footer"><span>MOCK / 无真实 Agent 生成、外部发布或生产验收</span><button className="text-button" onClick={()=>onSelect({kind:'practice'})}>沉淀 Team / Practice 草稿 →</button></footer>
 </>;
}
function EventLog({world:w}:{world:World}){return <><p className="dialog-intro">事件先确认状态，空间再表达状态。以下记录来自当前演示的唯一事件源。</p><div className="event-log">{w.events.length===0?<p>尚无事件。开始演示后可查看完整记录。</p>:w.events.map(e=><article key={e.eventId}><time>{e.at.toFixed(1)}s</time><div><strong>{e.type}</strong><p>{Object.entries(e.payload).map(([key,value])=>`${key}: ${value}`).join(' · ')}</p><small>#{e.sequence} · {e.eventId} · source: mock</small></div></article>)}</div></>;}
function Practice({world:w}:{world:World}){
 const [saved,setSaved]=useState(false);
 const download=()=>{const draft={schemaVersion:'b1-practice-draft/1',source:'mock',verified:false,goal:w.goal,teams:['研究策划','品牌设计','网站研发'],roles:CHARACTERS.filter(c=>c.kind!=='reception').map(c=>({id:c.worldId,role:c.name,team:c.team,kind:c.kind})),steps:['Goal','Team','Execution','Decision','Outcome','Practice'],decision:w.decision,artifacts:w.artifacts,evidenceEventIds:w.events.map(e=>e.eventId)};const url=URL.createObjectURL(new Blob([JSON.stringify(draft,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='agent-office-team-practice-draft.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setSaved(true);};
 return <><p className="dialog-intro">把这一次协作，整理成下一次的起点。</p><div className="reading-note"><span className="eyebrow">TEAM + PRACTICE · 配置草稿</span><h3>品牌网站工作团队</h3><p>研究策划 × 品牌设计 × 网站研发 · 三位负责人、三位子 Agent</p><ol><li>定义品牌与网站目标</li><li>组织能力与分工，交接研究摘要</li><li>由人类确认品牌方向</li><li>完成模拟交付，保留可追溯的工作记录</li></ol></div><p className="evidence-note">这是未验证的 Mock 配置草稿，不是已经证明有效的工作方法。真实保存、复用和编排系统不在本阶段。</p><button className="primary" disabled={w.artifacts.length!==3} onClick={download}>下载 Team / Practice 草稿</button><p className="muted" role="status">{saved?'已发起本地 JSON 下载。草稿明确标记 source: mock、verified: false。':w.artifacts.length===3?'三份模拟成果已交付，可以导出本地草稿。':'完成三份模拟成果交付后，可下载配置草稿。'}</p></>;
}
