import {useEffect,useRef,useState} from 'react';
import {terminalState,TERMINAL_LABEL,type World,type MockScenarioRunner} from '../mock/world';
import {SCENE,REGIONS,CHARACTERS,type RegionId} from './scene.config';
import {characterPose,characterStatus,regionActive,taskRows} from './projection';
import {Icon} from './Icon';
import type {Selection} from './Dialogs';

interface Props {world:World;runner:MockScenarioRunner;selection:Selection|null;onSelect:(s:Selection)=>void;debug:boolean}
export function Scene({world:w,runner,selection,onSelect,debug}:Props){
 const [hover,setHover]=useState<RegionId|null>(null),actors=useRef<Record<string,HTMLButtonElement|null>>({});
 useEffect(()=>{
  let frame=0; const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const position=()=>{const world=runner.getSnapshot();for(const c of CHARACTERS){const element=actors.current[c.id];if(!element)continue;const p=characterPose(c,world,reducedMotion.matches?Infinity:runner.time);element.style.transform=`translate3d(${p.feet[0]}px,${p.feet[1]}px,0) translate(-50%,-98%) scale(${p.height/144})`;element.style.zIndex=String(10+Math.floor(p.feet[1]/100));}frame=requestAnimationFrame(position);};
  position();return()=>cancelAnimationFrame(frame);
 },[runner]);
 const screenState=(id:string)=>w.events.some(e=>e.type==='task.finished'&&e.payload.agentId===id)?'completed':terminalState(w.agents[id]);
 const selected=selection?.kind==='region'?selection.id:null,completed=taskRows(w).filter(t=>t.done).length;
 const handoff=[...w.events].reverse().find(e=>e.type==='task.handoff'),recommendation=w.events.find(e=>e.type==='organization.recommended');
 return <>
  <img className="architecture" src={SCENE.background} alt="玻璃穹顶下，绿植环绕的 Agent Office 办公空间" draggable={false}/>
  <svg className="ambient-layer" viewBox="0 0 1672 941" aria-hidden="true">
   <defs><linearGradient id="screen-flow"><stop stopColor="#a8ffea" stopOpacity="0"/><stop offset=".5" stopColor="#c9ffff" stopOpacity=".28"/><stop offset="1" stopColor="#a8ffea" stopOpacity="0"/></linearGradient><clipPath id="hub-clip"><rect x="723" y="260" width="269" height="109" rx="12"/></clipPath><clipPath id="water-clip"><path d="M819 777Q970 761 1063 803Q1115 854 1005 880L770 887 823 857Z"/></clipPath></defs>
   <g clipPath="url(#hub-clip)"><path className="screen-flow" d="M620 310Q750 260 850 317T1110 302" stroke="url(#screen-flow)" strokeWidth="28" fill="none"/></g>
   <g className="ambient-led" fill="none" stroke="#fff0be" strokeWidth="2"><path d="M592 413Q795 489 1108 421"/><path d="M52 737Q162 788 362 737"/><path d="M1169 745Q1395 790 1603 775"/></g>
   <g clipPath="url(#water-clip)" className="water-light" fill="none" stroke="#d9ffff" strokeWidth="1.2"><ellipse cx="938" cy="829" rx="108" ry="15"/><ellipse cx="938" cy="829" rx="170" ry="28"/><ellipse cx="938" cy="829" rx="219" ry="43"/></g>
   <g className="air-motes" fill="#fff6c6">{[[637,190],[1040,206],[675,384],[1119,291],[546,358],[1169,180]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={1.4} style={{animationDelay:`${i*-.7}s`}}/>)}</g>
  </svg>
  <svg className={`hotspot-layer ${debug?'debug':''}`} viewBox="0 0 1672 941" aria-label="办公空间区域">
   {REGIONS.map(r=><polygon key={r.id} data-region={r.id} points={r.polygon} tabIndex={0} role="button" aria-label={`区域：${r.name}`} className={`${hover===r.id?'hovered':''} ${selected===r.id?'selected':''} ${regionActive(r.id,w)?'activated':''} ${recommendation&&w.time-recommendation.at<3&&['research','design','development'].includes(r.id)?'recommended':''}`} style={{animationDelay:r.id==='development'?'1s':r.id==='design'?'.5s':'0s'}} onMouseEnter={()=>setHover(r.id)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover(r.id)} onBlur={()=>setHover(null)} onClick={()=>onSelect({kind:'region',id:r.id})} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect({kind:'region',id:r.id});}}}/>)}
  </svg>
  <svg className="event-layer" viewBox="0 0 1672 941" aria-hidden="true">
   {handoff&&w.time>=handoff.at&&w.time<handoff.at+7&&<g className={w.status==='playing'?'handoff-line':'handoff-line frozen'}><path d={handoff.payload.from==='research-lead'?'M591 322Q656 419 301 446':'M300 446Q535 397 615 455Q835 736 1126 448Q1208 386 1444 380'}/></g>}
  </svg>
  {REGIONS.map(r=><button data-region-label={r.id} className={`region-label ${r.id} ${hover===r.id?'hovered':''} ${r.id==='goal'&&w.status==='waiting'?'needs-decision':''}`} key={r.id} style={{left:r.label[0],top:r.label[1]}} onMouseEnter={()=>setHover(r.id)} onMouseLeave={()=>setHover(null)} onClick={()=>onSelect({kind:'region',id:r.id})}><Icon name={r.icon} size={29}/><span>{r.name}<small>{r.english}</small></span>{regionActive(r.id,w)&&<i className="region-state-dot"/>}</button>)}
  <button className={`hub-screen ${w.goal?'engaged':''}`} onClick={()=>onSelect({kind:'region',id:'goal'})} aria-label="查看目标与进度"><span className="hub-eyebrow">{w.goal?`${w.chapter} · MOCK`:'从一个好想法开始'}</span><strong>{w.goal?'品牌 VI 与展示网站':<>你的下一个目标，<br/>在这里生长。</>}</strong>{w.goal?<><span className="hub-progress"><i style={{transform:`scaleX(${completed/4})`}}/></span><span className="hub-steps">{completed}/4 任务 <b>·</b> {w.artifacts.length}/3 成果 <b>·</b> {w.status==='waiting'?'等待你的决定':'模拟演示'}</span></>:<span className="hub-steps">◎ 目标 <b>—</b> 团队 <b>—</b> 执行 <b>—</b> 交付</span>}</button>
  {w.meeting&&<button className="meeting-screen" onClick={()=>onSelect({kind:'region',id:'collaboration'})}><small>协作记录 · MOCK</small><strong>{w.meeting.topic}</strong><span>{w.status==='waiting'?'等待主理人确认方向':'研究 × 设计 × 研发 · 信息对齐'}</span></button>}
  <div className="worker-screens">{[['visual'],['frontend'],['test']].map((ids,i)=><button key={i} className={`worker-screen screen-${i}`} onClick={()=>onSelect({kind:'region',id:'workers'})}>{ids.map(id=><span key={id}><strong>{id==='research'?'研究':id==='visual'?'视觉':id==='frontend'?'前端开发':'测试检查'}</strong><small><i className={screenState(id)}/>{TERMINAL_LABEL[screenState(id)]}</small></span>)}</button>)}</div>
  {CHARACTERS.map(c=>{const active=w.agents[c.worldId],pose=characterPose(c,w);if(!pose.visible)return null;return <button ref={el=>{actors.current[c.id]=el;}} key={c.id} data-character={c.id} data-instance={Boolean(active)} data-pose={pose.seated?'seated':'standing'} className={`character ${c.labelSide} ${pose.seated?'seated':''} ${active?.behavior==='Working'?'working':''}`} style={{left:0,top:0,width:pose.width,height:144}} aria-label={`人物：${c.name}`} onClick={e=>{e.stopPropagation();onSelect({kind:'agent',id:c.id});}}><span className="foot-shadow"/><img src={pose.image} alt="" draggable={false}/><span className="character-tag"><i/><span>{c.english}<small>{characterStatus(c,w)}</small></span></span></button>;})}
  {w.artifacts.length>0&&<button className="delivery-beacon" onClick={()=>onSelect({kind:'region',id:'showcase'})}><Icon name="check" size={18}/>{w.artifacts.length} 份 Mock 成果可阅读 ↗</button>}
 </>;
}
