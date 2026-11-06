import type {IconName} from './scene.config';
const paths:Record<IconName,string>={
  bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3M10 21h4M12 2v2',
  cup:'M4 7h13v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7Zm13 1h2a3 3 0 0 1 0 6h-2M8 2v2M13 2v2',
  palette:'M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4l-1-1a1 1 0 0 1 1-2h3c5 0 4-11-5-11ZM7 10h.01M9 6h.01M14 6h.01M18 9h.01',
  search:'M20 20l-5-5M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14',
  goal:'M20 10a8 8 0 1 1-6-6M16 10a4 4 0 1 1-6-2M12 12l8-9M16 3h4v4',
  team:'M8 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6M17 5a3 3 0 0 1 0 6M2 21v-4a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4M17 14a4 4 0 0 1 5 4v3',
  code:'m7 6-6 6 6 6M17 6l6 6-6 6M14 3l-4 18',
  layers:'m12 2 10 6-10 6L2 8l10-6ZM2 12l10 6 10-6M2 16l10 6 10-6',
  leaf:'M4 20C2 8 10 3 21 3c0 11-5 19-17 17Zm0 0L16 8',
  check:'m5 12 4 4L20 5M21 11a9 9 0 1 1-9-8',
  arrow:'M3 12h18m-6-6 6 6-6 6',play:'m8 4 13 8-13 8V4Z',
};
export function Icon({name,size=24}:{name:IconName;size?:number}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;}
