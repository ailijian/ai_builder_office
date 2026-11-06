import designSeated from '../../assets/design-lead-seated-v001.png';
import devSeated from '../../assets/development-lead-seated-v001.png';
import researchSeated from '../../assets/research-lead-seated-v001.png';
import receptionist from '../../assets/receptionist-standing-v001.png';
import background from '../../assets/未来生态科技中庭.png';
import designLead from '../../assets/ChatGPT 图像 2026年11月6日 14_39_39-1.png';
import developmentLead from '../../assets/ChatGPT 图像 2026年11月6日 14_39_40-2.png';
import researchWorker from '../../assets/ChatGPT 图像 2026年11月6日 14_39_41-3.png';
import visualWorker from '../../assets/ChatGPT 图像 2026年11月6日 14_39_42-4.png';
import frontendWorker from '../../assets/ChatGPT 图像 2026年11月6日 14_39_43-5.png';
import qaWorker from '../../assets/ChatGPT 图像 2026年11月6日 14_39_45-6.png';

// B00 original image pixels. All geometry, feet, labels and light masks share this plane.
export const SCENE = {width:1672,height:941,background};
export type Pixel = readonly [number,number];
export type RegionId = 'reception'|'lounge'|'design'|'research'|'goal'|'collaboration'|'development'|'workers'|'showcase'|'mezzanine';
export type IconName = 'bell'|'cup'|'palette'|'search'|'goal'|'team'|'code'|'layers'|'leaf'|'check'|'arrow'|'play';
export interface Region {id:RegionId;name:string;english:string;icon:IconName;label:Pixel;center:Pixel;polygon:string}
// Traced against B00 roof / platform edges, not percentage estimates. Debug overlay: ?debug=1.
export const REGIONS:Region[] = [
  {id:'mezzanine',name:'云端休息室',english:'The Green Retreat',icon:'leaf',label:[1193,119],center:[1290,130],polygon:'969,102 1110,61 1433,35 1604,77 1640,173 1593,224 1476,195 1228,181 968,184'},
  {id:'research',name:'研究策划部',english:'Research & Planning',icon:'search',label:[487,161],center:[464,250],polygon:'279,166 346,130 531,143 624,181 650,291 617,313 441,326 344,260 282,253'},
  {id:'design',name:'品牌设计部',english:'Design Studio',icon:'palette',label:[267,262],center:[265,360],polygon:'14,315 64,275 226,250 381,263 452,298 480,391 519,425 483,453 264,466 87,448 17,412'},
  {id:'lounge',name:'休息与待命区',english:'Lounge & Standby',icon:'cup',label:[432,447],center:[358,554],polygon:'58,484 204,455 402,472 537,499 587,558 591,610 504,638 311,646 201,607 54,575'},
  {id:'reception',name:'接待入口',english:'Reception',icon:'bell',label:[207,625],center:[211,697],polygon:'60,639 159,623 313,629 366,646 371,735 341,765 112,779 54,735'},
  {id:'goal',name:'目标中枢',english:'Goal Hub',icon:'goal',label:[845,225],center:[853,320],polygon:'698,243 738,219 966,222 1009,241 1018,340 1094,368 1119,406 1090,438 938,453 725,452 592,426 584,396 635,366 691,349'},
  {id:'collaboration',name:'协作讨论区',english:'Collaboration',icon:'team',label:[867,461],center:[880,598],polygon:'683,492 748,451 998,452 1054,486 1081,563 1150,620 1154,668 1078,698 816,711 623,683 550,652 565,614 640,573'},
  {id:'development',name:'研发工作岛',english:'Development Studio',icon:'code',label:[1326,218],center:[1353,305],polygon:'1121,268 1178,220 1355,207 1497,222 1567,272 1600,348 1622,382 1490,394 1264,382 1100,357'},
  {id:'workers',name:'子 Agent 执行岛',english:'Agent Workers',icon:'layers',label:[1433,395],center:[1407,480],polygon:'1217,408 1273,387 1569,398 1636,427 1666,503 1667,577 1504,586 1308,559 1179,524 1151,483'},
  {id:'showcase',name:'成果展示区',english:'Delivery & Showcase',icon:'layers',label:[1431,582],center:[1435,681],polygon:'1235,605 1296,582 1546,590 1602,621 1624,698 1636,783 1452,787 1263,774 1160,746 1160,703 1196,687'},
];

export interface Character {id:string;worldId:string;name:string;english:string;team:'design'|'dev'|'research'|'reception';kind:'lead'|'worker'|'reception';image:string;feet:Pixel;height:number;seated?:{image:string;feet:Pixel;height:number};labelSide?:'left'|'right';responsibility:string;questions:readonly [string,string,string];answers:readonly [string,string,string]}
export const CHARACTERS:Character[] = [
  {id:'design-lead',worldId:'design-lead',name:'品牌设计负责人',english:'Design Lead',team:'design',kind:'lead',image:designLead,feet:[298,617],height:140,seated:{image:designSeated,feet:[304,610],height:134},labelSide:'left',responsibility:'统筹品牌定位、视觉方向与跨部门交接；由你决定最终创意方向。',questions:['品牌方向是什么？','现在需要我决定什么？','如何与研发协作？'],answers:['预设方向是「温暖、清晰、可信赖」。品牌 VI 使用暖白、青绿和浅木色，面向独立创作者与小团队。','关键决定是是否采用当前品牌方向。审批出现时，你可以批准继续，或退回让团队重新确认。','研究摘要先交给研发负责人，再围绕品牌主张与首页层级讨论；只有批准方向后才继续模拟交付。']},
  {id:'development-lead',worldId:'dev-lead',name:'研发负责人',english:'Dev Lead',team:'dev',kind:'lead',image:developmentLead,feet:[541,625],height:140,seated:{image:devSeated,feet:[512,610],height:136},labelSide:'right',responsibility:'组织网站结构、前端实现与质量检查，接收品牌设计交付。',questions:['网站准备怎么做？','技术工作如何分工？','目前有什么依赖？'],answers:['预设为单页品牌展示站：品牌主张 → 核心价值 → 联系入口。成果区提供可阅读的页面示意。','前端 Agent 负责页面结构与表现，测试 Agent 在后半程启动，检查内容、联系入口和品牌一致性。','品牌方向是后续交付的门槛。待决策或退回时，时钟与交付都会保持阻断。']},
  {id:'research-lead',worldId:'research-lead',name:'研究策划负责人',english:'Research Lead',team:'research',kind:'lead',image:researchWorker,feet:[380,620],height:138,seated:{image:researchSeated,feet:[366,593],height:118},labelSide:'left',responsibility:'整理目标用户、品牌定位与参考方向，向设计负责人交付摘要。',questions:['研究任务是什么？','研究摘要有哪些？','这些结论来自哪里？'],answers:['整理独立创作者与小团队的表达需求，形成品牌定位与风格参考摘要。','样例摘要：用户希望快速表达价值、获得信任，并用清晰的联系入口促成沟通。','这是场景预设的 Mock 研究材料，没有开展真实访谈、网络调研或外部数据验证。']},
  {id:'visual-worker',worldId:'visual',name:'视觉设计 Agent',english:'Visual',team:'design',kind:'worker',image:visualWorker,feet:[1278,574],height:124,labelSide:'left',responsibility:'将品牌方向整理成 Logo 示意、颜色规范与界面风格。',questions:['颜色如何搭配？','Logo 方案是什么？','界面风格是什么？'],answers:['暖白 #F4F0E8 为底色，青绿 #397D73 为主要识别色，浅木色作为温暖的辅助色。','成果查看器里用可缩放的叶片与字标展示样例构图；它是本地示意，不是已验收的品牌资产。','温暖留白、清晰文字层级、柔和圆角；视觉方向通过人类确认后，再用于网站的模拟交付。']},
  {id:'frontend-worker',worldId:'frontend',name:'前端开发 Agent',english:'Frontend',team:'dev',kind:'worker',image:frontendWorker,feet:[1404,580],height:125,labelSide:'right',responsibility:'规划与实现品牌页面，连接品牌主张、内容结构与联系入口。',questions:['页面结构有哪些？','实现进展如何？','可以打开网站吗？'],answers:['首页包含一句品牌主张、三项核心价值与联系入口。保持清晰层级，并兼顾小屏阅读。','当前任务与进度显示在上方，完全由 Mock 事件更新。此对话不会创建任务或改变执行状态。','成果区可打开内置页面示意。没有外部部署链接，也没有真实 Agent 生成的网站仓库。']},
  {id:'qa-worker',worldId:'test',name:'测试 Agent',english:'QA',team:'dev',kind:'worker',image:qaWorker,feet:[1538,585],height:126,labelSide:'right',responsibility:'检查内容完整性、联系入口与品牌一致性，说明验证范围与风险。',questions:['检查哪些内容？','检查结果是什么？','还有什么风险？'],answers:['模拟检查三项：内容层级是否完整、联系入口是否存在、品牌视觉是否一致。','交付报告列出预设的模拟结果。它们不等于真实网站自动化测试通过。','真实部署、链接可用性、目标设备性能和内容真实性仍需要单独验证；Mock 演示不能替代这些证据。']},
  {id:'receptionist',worldId:'receptionist',name:'接待员',english:'Reception',team:'reception',kind:'reception',image:receptionist,feet:[402,725],height:151,labelSide:'right',responsibility:'欢迎来到 Agent Office，介绍办公区域并引导你开始目标、探索团队与查看成果。',questions:['如何开始一个目标？','这里有哪些团队？','去哪里查看成果？'],answers:['点击目标中枢或播放演示，即可开始品牌 VI 与展示网站的 Mock 目标。三位负责人会起身，各自组织工作。','研究策划、品牌设计和网站研发各有一位常驻负责人；视觉、前端和测试是按任务启动的临时子 Agent。','右下方成果展示区可以阅读品牌 VI、网站示意与交付报告；未交付时标记为样例预览。']},
];

export const TEAM_LABEL={design:'品牌设计团队',dev:'网站研发团队',research:'研究策划团队',reception:'接待与导览'};
export const REGION_BY_ID = Object.fromEntries(REGIONS.map(r=>[r.id,r])) as Record<RegionId,Region>;
