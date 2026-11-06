/// <reference types="vite/client" />
import {useCallback,useEffect,useRef,useState,useSyncExternalStore} from 'react';
import {createRoot} from 'react-dom/client';
import {MockScenarioRunner,type World} from '../mock/world';
import {SCENE,REGIONS,REGION_BY_ID,CHARACTERS,type RegionId} from './scene.config';
import {Icon} from './Icon';
import {Scene} from './Scene';
import {B1_SCENARIO} from './scenario';
import {OfficeDialog,type Selection} from './Dialogs';
import './style.css';

const runner=new MockScenarioRunner(B1_SCENARIO);
declare global{interface Window{__b1?:{snapshot:()=>World;scene:{width:number;height:number};characters:typeof CHARACTERS;regions:typeof REGIONS}}}
// Diagnostics are snapshots only; no advance / approval / state injection interface.
if(import.meta.env.DEV)window.__b1={snapshot:()=>structuredClone(runner.getSnapshot()),scene:{width:SCENE.width,height:SCENE.height},characters:structuredClone(CHARACTERS),regions:structuredClone(REGIONS)};
function App(){
 const world=useSyncExternalStore(runner.subscribe,runner.getSnapshot);
 const [selection,setSelection]=useState<Selection|null>(null),[debug,setDebug]=useState(import.meta.env.DEV&&new URLSearchParams(location.search).get('debug')==='1');
 const [size,setSize]=useState({w:innerWidth,h:innerHeight}),[zoom,setZoom]=useState(.85),[mobileRegion,setMobileRegion]=useState<RegionId>('goal');
 const [ready,setReady]=useState(false),[loadError,setLoadError]=useState(false),viewport=useRef<HTMLDivElement>(null);
 const mobile=size.w<760,scale=mobile?zoom:Math.min(size.w/SCENE.width,size.h/SCENE.height);
 useEffect(()=>{const resize=()=>setSize({w:innerWidth,h:innerHeight});addEventListener('resize',resize);return()=>removeEventListener('resize',resize);},[]);
 useEffect(()=>{let alive=true;Promise.all([SCENE.background,...CHARACTERS.flatMap(c=>c.seated?[c.image,c.seated.image]:[c.image])].map(src=>new Promise<void>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve();img.onerror=reject;img.src=src;}))).then(()=>{if(alive)setReady(true);}).catch(()=>{if(alive)setLoadError(true);});return()=>{alive=false;};},[]);
 useEffect(()=>{let frame=0,last=performance.now();const tick=(now:number)=>{runner.advance(Math.min(.1,(now-last)/1000));last=now;frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);},[]);
 const focusRegion=useCallback((id:RegionId)=>{const r=REGION_BY_ID[id],el=viewport.current;if(el)el.scrollTo({left:r.center[0]*scale-el.clientWidth/2,top:r.center[1]*scale-el.clientHeight/2,behavior:'instant'});},[scale]);
 useEffect(()=>{if(mobile)focusRegion(mobileRegion);},[mobile,scale,mobileRegion,focusRegion]);
 const opener=useRef<HTMLElement|null>(null);
 const open=useCallback((s:Selection)=>{if(!document.querySelector('.office-dialog'))opener.current=document.activeElement as HTMLElement;setSelection(s);},[]);
 const close=useCallback(()=>{setSelection(null);requestAnimationFrame(()=>{if(opener.current?.isConnected)opener.current.focus();});},[]);
 const replay=()=>{runner.replay();setSelection(null);};
 const play=()=>world.status==='playing'?runner.pause():runner.play();
 const journey=[{icon:'goal',title:'提出目标',desc:'定义你的工作目标',selection:{kind:'region',id:'reception'}},{icon:'team',title:'组织团队',desc:'推荐并激活所需能力',selection:{kind:'directory'}},{icon:'code',title:'协同执行',desc:'多 Agent 分工完成任务',selection:{kind:'region',id:'workers'}},{icon:'check',title:'交付成果',desc:'阅读成果与验证范围',selection:{kind:'region',id:'showcase'}},{icon:'layers',title:'沉淀方法',desc:'保存团队与方法草稿',selection:{kind:'practice'}}] as const;
 const controls=<><button className="transport-play" aria-label={world.status==='playing'?'暂停演示':world.status==='ready'?'播放演示':'继续演示'} disabled={!ready||world.status==='waiting'||world.status==='finished'} onClick={play}>{world.status==='playing'?'Ⅱ 暂停':world.status==='ready'?'▶ 播放演示':world.status==='finished'?'✓ 已完成':'▶ 继续'}</button><button onClick={replay} aria-label="重置演示" title="回到初始状态">↺</button><select aria-label="播放速度" value={runner.speed} onChange={e=>runner.setSpeed(Number(e.target.value))}><option value={1}>1×</option><option value={2}>2×</option><option value={4}>4×</option></select><span className="transport-time">{Math.floor(world.time).toString().padStart(2,'0')}<small> / {runner.duration}s</small></span><button onClick={()=>{runner.pause();open({kind:'directory'});}} aria-label="自由探索">自由探索 ↗</button></>;
 return <main className="living-office">
  <div className="office-surface" inert={!!selection}>
   <header className="mobile-header"><span className="brand-glyph">a<span>o</span></span><div><strong>Agent Office</strong><small>B1.0 · Living Workspace</small></div><span className="mobile-mock">MOCK</span><button onClick={()=>open({kind:'directory'})} aria-label="打开空间导览"><Icon name="layers"/></button></header>
   <div ref={viewport} className="scene-viewport" aria-label="可探索的办公空间"><div className="scene-frame" style={{width:SCENE.width*scale,height:SCENE.height*scale}}><div className="scene-plane" style={{transform:`scale(${scale})`}}>
    <Scene world={world} runner={runner} selection={selection} onSelect={open} debug={debug}/>
    <header className="scene-brand"><span className="brand-glyph">a<span>o</span></span><div><h1>Agent Office</h1><p>AI-Native Living Workspace</p></div><span className="edition">B1.0 · 会生长的 AI 工作群岛</span><p className="brand-intro">让 AI 团队围绕你的目标，<br/>自动组织、协作与交付。</p></header>
    <div className="scene-meta"><span><i/> Mock / Simulation</span><button onClick={()=>open({kind:'directory'})}>空间导览 ↗</button></div>
    <div className="scene-transport">{controls}</div>
    {world.status==='waiting'&&<button className="decision-toast" data-testid="decision-notice" onClick={()=>open({kind:'region',id:'goal'})}><span>◈</span><div><strong>{world.decision?.status==='rejected'?'方向已退回':'有一个决定，正在等你'}</strong><small>{world.decision?.status==='rejected'?'查看退回记录与重新提交':'确认品牌方向，让团队继续前行'}</small></div><span>→</span></button>}
    <nav className="journey" aria-label="工作流程"><div className="journey-title"><Icon name="team" size={38}/><span><strong>Goal → Team → Practice</strong><small>从目标到团队、执行与沉淀的 AI 工作流</small></span></div>{journey.map(j=><button key={j.title} onClick={()=>open(j.selection)}><Icon name={j.icon} size={31}/><span><strong>{j.title}</strong><small>{j.desc}</small></span></button>)}</nav>
   </div></div></div>
   <div className="mobile-navigation"><div className="mobile-pan-hint">拖动探索空间 · 人物与区域均可点击</div><div className="mobile-region-controls"><select aria-label="移动端区域导航" value={mobileRegion} onChange={e=>setMobileRegion(e.target.value as RegionId)}>{REGIONS.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select><button onClick={()=>open({kind:'region',id:mobileRegion})}>进入 ↗</button><select aria-label="场景缩放" value={zoom} onChange={e=>setZoom(Number(e.target.value))}><option value={.65}>65%</option><option value={.85}>85%</option><option value={1}>100%</option></select></div>{world.status==='waiting'&&<button className="mobile-decision" onClick={()=>open({kind:'region',id:'goal'})}>{world.decision?.status==='rejected'?'方向已退回 · 查看':'需要你的决定 · 确认品牌方向'} →</button>}<div className="mobile-transport">{controls}</div><nav>{journey.map(j=><button key={j.title} onClick={()=>open(j.selection)}><Icon name={j.icon} size={18}/><span>{j.title}</span></button>)}</nav></div>
   {import.meta.env.DEV&&<button className={`debug-toggle ${debug?'on':''}`} onClick={()=>setDebug(v=>!v)} aria-pressed={debug}>热点{debug?'开':'关'}</button>}
   {!ready&&<div className="scene-loading" role={loadError?'alert':'status'}>{loadError?<><strong>素材未能加载</strong><p>请确认使用本地服务，并刷新重试。</p><button onClick={()=>location.reload()}>重新加载</button></>:<><Icon name="leaf" size={42}/><p>正在打开你的工作群岛…</p></>}</div>}
   <span className="sr-only" role="status">{world.chapter}。{world.status==='waiting'?world.message:''}</span>
  </div>
  {selection&&<OfficeDialog selection={selection} world={world} runner={runner} onClose={close} onSelect={open}/>}
 </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
