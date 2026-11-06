# B2.0 S1 — 大型工作群岛空间蓝图

> **B1 首版范围（2026-11-06）：** 当前代码仅为 `web/` 的 React / DOM / SVG 图片式 Demo。本文 3D、生产和后端内容保留为目标及历史设计依据；旧工具、模型与评审证据未随版，不可据此认定可运行或已获下一阶段授权。最新事实见 [当前状态](CURRENT_PROJECT_STATE.md)。文中“本轮 / 当前”的旧阶段记录按原记录日期理解。

> Status: ACTIVE · 2026-11-06 · S1 制作与检查完成，待主创布局验收；S2–S4 未授权、未启动

## 1. 结果与依据

以 **22 × 16 m、352 m² 连续地面**建立了真实、可编辑的 Blender 空间：九个逻辑区域、局部后侧二层、两个原始 V2 人物、四个执行终端、五个正交机位、业务站位与通道。原 M1.2 工程、事件、依赖、已批准模型和参考图片保持不变。

本次启动指令批准的是 B2.0 场景目标和 S1；随附 V0.2 提案仍保留原来的“待主创评审”文字，其未来功能不是本轮实施授权。提案的 18 × 15 m / 240–320 m² 是建议起点；本轮按明确启动要求采用 22 × 16 m，并将休息与接待分开，形成九区。A1.1 色彩、人物与材质语言继续适用，原小空间造型及固定镜头不再约束 B2.0 布局。

- [主创 B2.0 参考图](../design/references/agent-office-target.png)，原图按字节复制，未用作模型贴图。
- [主创 V0.2 原始文案](../design/references/b20-proposal-v02.txt)，未修改其原始状态和内容。
- [A1.1 视觉约束](../design/A1.2_VISUAL_LOCK.md)、[产品基线](../product/agent-office-product-direction-v0.1/AGENT_OFFICE_PRODUCT_DIRECTION_V0.1.md)、[M1 Mock 契约](../architecture/M1_MOCK_SCENARIO.md)、M1.2 实现（本地归档 / 外部参考，未随版：`docs/production/M12_SPATIAL_SEMANTICS_REPORT.md`）。

## 2. 交付入口

| 内容 | 实际文件与用途 |
| --- | --- |
| **可编辑源** | b20_work_islands_s1_v005.blend（本地归档 / 外部参考，未随版：`assets/source/environments/b20_work_islands/b20_work_islands_s1_v005.blend`），最终 S1 版本；不是已批准环境母版 |
| 主正交全景 | overview_final.png（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/renders/overview_final.png`），1920 × 1080，真实 Blender Cycles 渲染 |
| 工作模式构图 | work_final.png（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/renders/work_final.png`），1920 × 1080，两位 V2 负责人尺度验证 |
| **区域与通道** | plan_final.png（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/renders/plan_final.png`），1920 × 1500，真实俯视渲染，标注与路线也是 Blender 对象 |
| 机器布局 | layout_manifest.json（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/planning/layout_manifest.json`），坐标、尺寸、源模块、相机、站位、12 条 M1 对应路线和 4 条公共支路 |
| 原资产实测 | source_inventory.json（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/validation/source_inventory.json`），逐对象尺寸、面数、材质、父子关系、贴图 |
| 技术检查 | blender_validation.json（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/validation/blender_validation.json`）、route_clearance.json（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/validation/route_clearance.json`） |

全景和工作图在 v004 渲染；v005 只补公共支路及接待入口 Empty，隐藏的规划标注不改变这两个画面。俯视图在 v005 重渲染。v001–v004 是保留的本轮检查迭代，不作为另一个有效交付入口。

打开 `.blend` 后，使用 `Camera_01_Overview` 看全景，`Camera_02_Work_Collaboration` 看讨论区；另外有设计、研发聚焦及俯视相机。`00`–`13` Collection 按建筑、区域、人物、锚点、相机组织。`90_Plan_Annotations` 默认隐藏，专用于 S1 规划标注，不是最终业务 UI。贴图已打包；拱线为可编辑 Curve，家具保留独立网格与源模块关系。

## 3. 现有资产盘点

从登记的 **OFFICE-ENV-001** 读取，未按最大版本号猜母版。其 216 个对象包括相机、灯和锚点，基础网格 107,260 triangles；当前 OFFICE-WEB-001 为 123,286 triangles、66.09 MB，仍为 WIP。V2 为 18,690 triangles、10.47 MB、无骨骼和动作。本轮只将其按 M1.2 相同的 2.12 m 身高作静态尺度检查。

| 分类 | 已有模型 / 实测依据 | B2.0 决策 |
| --- | --- | --- |
| 直接复用 | `Prop_Desk_*`、`Desk_CableTray`、`Desk_RecessedJoint`；原桌面约 2.65 × 1.19 m | 两位负责人保留原比例；尺寸适合单人统筹，不新增重复桌子 |
| 直接复用 | `Chair_*` 完整办公椅，软包、扶手、轮组独立 | 负责人及研究占位共 3 把；不将其当休闲沙发 |
| 直接复用 | `Lamp_*`、`Monitor_*`、`Screen_Main_*`、`Keyboard_*`、`Mouse` | 物理设备复用；屏幕内容换成动态前端内容。S1 仅摆必要设备，不复制整套小道具填场 |
| 直接复用 | `Plant_*`、`Planter_CeramicOpenBowl` | 小盆栽可复用；它不是成熟大型室内树。S1 12 处实例作缓冲/尺度提示，后续以大小两级替换部分实例 |
| 直接复用 | `TRIPO-G25A-WEB-V2-GLB` | 两位负责人共享原网格/贴图，保留手持平板和静态姿态；不重做脸、不自动 Rig |
| 修改复用 | `Env_ArchFrame`（原包围尺寸约 5.71 × 3.97 × 2.45 m） | 提取为两个工作舱弧框，在派生场景改变模块比例；不把整个小办公室整体放大 |
| 修改复用 | `Env_Partition_FlutedSingle`；原约 5.35 × 0.012 × 2.32 m | 作为工作舱后侧局部竖纹玻璃；Web 透射、排序和遮挡以后另验 |
| 修改复用 | `Cabinet_*`、`Env_Rug`、`Board_*` / `TaskBoard_*` | 低储物、研究板和区域软装的结构来源；柜体适配尺度，板面不保留旧业务文字 |
| 修改复用 | `Prop_BriefPod_*`、`Result_ArcRing`、`ResultCard_*` | S1 将成果台改为宽展台并保留弧环，三个卡架用空白表面；S2 精修比例与圆角，不从零丢弃品牌形态 |
| 修改复用候选，**未采用** | `assets/source/external/tripo/办公室/modern office desk 3d model.glb`；单网格 19,100 triangles、9.93 MB | 实际是含建筑、桌椅、成果台的整组小办公室，并非独立办公桌；无已登记来源/批准证据，不加入当前制作主线。见 几何实拍（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/renders/extra_desk_geometry.png`） / 检查（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/validation/extra_desk.json`） |
| 需要新增 | 大地面、后侧大拱/玻璃、局部二层、Goal Hub、接待台、讨论桌、低书架 | Blender 精确建模；S1 已建立可编辑结构或明确占位体块 |
| 需要新增 | 休息沙发、低矮讨论沙发、大型室内树 | 三种 Tripo 单件候选，先审 S1 与具体费用再生成 |
| 需要新增 | 目标、审批、终端状态、可读成果、短标签与镜头控制 | 前端动态 UI；本轮只提供锚点和映射，不另造业务状态源 |

旧 Snow/Fredy/G2 角色不进入清单。现有橡木、织物和地毯材质可继续采用；其历史来源记录见 G1.1a 素材记录（本地归档 / 外部参考，未随版：`design/visual-a1.2/g1.1a/reviews/ASSET_CREDITS.md`） 和 地毯素材记录（本地归档 / 外部参考，未随版：`design/visual-a1.2/g1.1a/rug-layout/REVIEW.md`）。本轮没有新增下载或购买。

## 4. 空间架构

坐标使用 Blender 米制 Z-up：X 向右、Y 向后，地面 z=0；未来 Three.js 映射为 `[x,z,-y]`。以下为逻辑区域包围尺寸，并非封闭房间或结构净面积。地毯/地面分色只有约 16 mm 的视觉层，主通道保持同层；家具边界用圆角、低柜和少量植物提示，不造独立高台。

| 区域 | 中心 (x,y) m | 规划宽 × 深 m | 布置与语义 |
| --- | --- | --- | --- |
| 01 Goal Hub | (0, 2) | 4.2 × 4.0 | 直径约 3.9 m 克制弧环；中央稍后，前侧敞开；一块信息屏与低底座，不用蓝色光柱 |
| 02 设计岛 | (-6.8, 1.35) | 5.7 × 4.4 | 约 25 m²；单负责人工位，局部玻璃，前侧进入 |
| 03 研发岛 | (6.8, 3.1) | 5.7 × 4.4 | 约 25 m²；比设计岛后退，形成错落；入口在 (4.7, 1.65) |
| 04 研究策划岛 | (-6.8, 5.8) | 5.7 × 2.7 | 简化桌/板/柜，保留扩展能力；不新增第三位工作中的负责人 |
| 05 执行岛 | (7, -0.5) | 5.4 × 2.6 | 两段台面、四个终端，research / visual / frontend / test；暂不扩成六个活动席位 |
| 06 讨论区 | (0, -3.65) | 5.3 × 5.04 | 约 26.7 m²；低沙发、椭圆桌、轻屏；两位负责人当前站立检查点在前侧，不伪造坐姿 |
| 07 休息待命区 | (-6.9, -3.25) | 5.7 × 4.4 | 约 25 m²；沙发、茶几、低书架，待命锚点在开敞右侧 |
| 08 接待区 | (-7.6, -6.5) | 4.6 × 1.7 | 独立前台体块，右侧进入；没有接待员工或虚构活动 |
| 09 成果区 | (6.9, -5.2) | 5.3 × 2.8 | 前右方宽成果台，三卡入口，报告内容属于 HTML |

后侧弧形边界高约 6.1 m；二层视觉平台约 7.2 × 2.45 m、顶面 z≈3.41 m，占整体平面约 5%。它位于后右侧，不覆盖当前讨论人物；不提供上层 Agent 站点、楼梯或多层导航。此为美术骨架，未作真实建筑结构/工程合规论证。

主通道围绕中枢两侧与讨论区前侧形成连续网络；局部横向开口的设计目标约 1.8–2.4 m，最终技术保证限定为已测路线上的 **1.1 m 直径通行包络**，不是所有区域的统一净宽承诺。四条公共支路分别到达 Goal Hub、研究区、执行区和接待区，具体线路直接保存在 `.blend` 与 manifest 中。

## 5. 相机与人物可读性

| 机位 | 设置 / 实测 | 用途 |
| --- | --- | --- |
| `Camera_01_Overview` | 正交 scale 37.3201；16:9；约 27° 方位偏角、35° 俯角；按实际建筑全包围范围留边 | 识别园区与主关系；两位人物真实顶点投影约 **98 / 101 px** 高（1920 × 1080） |
| `Camera_02_Work_Collaboration` | 正交 scale 12.5；16:9；保持前侧观察 | 人物约 **289 / 299 px** 高；可看姿态、脸与平板；用于讨论/关键决策 |
| `Camera_03_Design_Focus` / `04_Development_Focus` | scale 10.8 / 11.2，具体 transform 见 manifest | 已建立聚焦预设，尚未做运行时镜头动画/HTML 避让验收 |
| `Camera_05_Plan` | 真正垂直正交、scale 26；1920 × 1500 | 区域与路线验证，不是产品常用机位 |

全景人物不能承担脸部细读。桌面 16:9 产品后续为右侧面板保留约 320–360 CSS px，按**剩余 Canvas 尺寸**重新 fit；不得直接裁掉全景右边。关键交互切换到区域镜头，屏幕文字与审批留给可访问 HTML。当前图片没有把伪造的审批按钮或业务完成状态烘进场景。

当前讨论站位在两个主机位中的头部/胸部射线均未被建筑或家具遮挡。没有据此声明所有站位、所有设备、移动过程都无遮挡；设计/研发工作模式的动态人物与标签避让属于后续运行时验收。

## 6. 生产资产清单

数量是**建议最终实例数量**，不是本轮已完成数量；P0 为主闭环必需，P1 为温度/空间辨识，P2 为后置。S1 中标 PROXY 的体块只证明空间占用，不是精修家具。Tripo 数量统计的是不同单件模型各一个候选，不是场景内实例数。

| 模型 / 组件名称 | 数量 | 优先级 | 来源 | S1 / 后续处理 | Tripo 任务 |
| --- | ---: | --- | --- | --- | ---: |
| B20_Continuous_Floor + Finish | 1 套 | P0 | Blender 精确建模 | 已有连续地面；后续材质细化 | 0 |
| B20_Rear_Grand_Arc / Secondary_Rib | 2 道 | P0 | Blender 精确建模 | 可编辑弧线骨架；后续截面节点细化 | 0 |
| B20_Rear_Glass / Mullions | 6 面 + 1 套杆件 | P1 | Blender 精确建模 | 后侧大玻璃与接缝；Web 透射待验 | 0 |
| LeadPod_Arc / FlutedGlass | 2 套 | P0 | 原有 Blender 资产修改复用 | 从 OFFICE-ENV-001 派生，保留可拆卸遮挡件 | 0 |
| B20_Back_Terrace_VisualOnly | 1 套 | P2 | Blender 精确建模 | 梁板、两柱、栏杆；只作视觉层 | 0 |
| Goal_Hub_Arc / Plinth / Screen | 1 套 | P0 | Blender 精确建模 | 骨架已建，后续精修品牌截面与插槽 | 0 |
| Lead_Desk | 2 | P0 | 原有 Blender 资产复用 | 原比例复用 | 0 |
| Research_Desk | 1 | P2 | 原有 Blender 资产修改复用 | 简化缩放占位 | 0 |
| Office_Chair | 3 | P0/P2 | 原有 Blender 资产复用 | 不改为沙发 | 0 |
| Worker_Bench | 2 段 | P0 | 原有 Blender 资产修改复用 | 4 个终端槽位；台面比例精修 | 0 |
| Monitor_Terminal / Keyboard / Mouse | 6 屏，最多 6 套输入设备 | P0 | 原有 Blender 资产复用 | S1 只有 6 屏；小件按镜头决定必要数量 | 0 |
| Desk_Lamp | 2 | P1 | 原有 Blender 资产复用 | 保留现有完整台灯 | 0 |
| Research_Board | 1 | P2 | 原有 Blender 资产修改复用 | 原文字清空，独立内容表面 | 0 |
| Low_Storage / Library | 4 | P1/P2 | Blender 精确建模 + 原柜体参考 | 2 舱低柜、1 研究柜、1 休息书架；S1 体块 | 0 |
| Discussion_Oval_Table | 1 | P0 | Blender 精确建模 | 精确通行尺度，木面/底座分件 | 0 |
| Lounge_Coffee_Table | 1 | P1 | Blender 精确建模 | 后续圆角、材质与细节 | 0 |
| Reception_CurvedDesk | 1 | P2 | Blender 精确建模 | 主创品牌比例可控，无需生成 | 0 |
| Delivery_BrandConsole / CardMount | 1 台 / 3 架 | P0 | 原有 Blender 资产修改复用 | 沿用品牌弧环，后续修正拉伸与边缘比例 | 0 |
| B20_Lounge_Sofa | 1 | P1 | **Tripo 单件生成** | 3.4 × 1.05 × 0.95 m；替换休息沙发体块 | **1** |
| B20_Discussion_Sofa | 2，复用同一网格 | P0 | **Tripo 单件生成** | 单件 2.25 × 0.85 × 0.90 m，进入 Blender 后旋转摆放 | **1** |
| B20_Indoor_Ficus | 4，复用同一网格 | P1 | **Tripo 单件生成** | 2.6 m 高 / 冠幅≤1.4 m，替换选定后侧植物占位 | **1** |
| Small_Potted_Plant | 约 8 | P1 | 原有 Blender 资产复用 | 从 S1 的 12 处实例中替换 4 处为大树，避免无限复制 | 0 |
| V2_Design_Lead / V2_Dev_Lead | 2 实例 / 1 网格来源 | P0 | 现有授权素材 | 原 V2 几何和贴图；非动画就绪资产 | 0 |
| Oak / Fabric / Rug 材质 | 3 类 | P1 | 现有授权素材 | 使用已有 Poly Haven CC0 记录；本轮无下载 | 0 |
| Goal / Team / Stage / Decision UI | 1 组 | P0 | 前端动态 UI | 同一 World 投影，锚定 Goal Hub | 0 |
| Lead / Terminal 状态与详情 | 2 人 + 4 执行终端 | P0 | 前端动态 UI | 保留真实 Mock 生命周期与点击语义 | 0 |
| Approval / Artifact / Replay UI | 1 审批 + 3 成果 + 播放控件 | P0 | 前端动态 UI | 使用既有界面和数据，不重复创建审批状态 | 0 |

**建议 S2 首批合计 3 个生成任务、7 个模型实例（1 沙发 + 2 讨论沙发 + 4 树），付费重试 0 次。** 其余模型使用本地 Blender 和既有素材完成；不预先批准额外的装饰、植物种类或坐具。首批审美和技术关通过后再判断是否确有缺项，不先铺大量低质量家具。

## 7. S2 第一批提案：仅供批准，尚未生成

官方 CLI **0.11.2** 已执行三个 `--dry-run --json`，全部 `valid=true`、单步骤、单候选、无警告、无上传。输入为完整单件英文文字提示；没有上传参考图、模型或生产密钥。精确输入见 tripo_prompts.json（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/planning/tripo_prompts.json`），离线复核脚本见 plan_tripo.ps1（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/scripts/plan_tripo.ps1`）。

| 次序 | 单件模型 / 精确离线计划 | API 调用 | 参数与交付 | 预计 API 积分 |
| --- | --- | --- | --- | ---: |
| 1 | 休息区弧形三人沙发（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/planning/b20_lounge_sofa_dry_run.json`） | `POST /v3/generation/text-to-model` | CLI `tripo-v3.1` → `v3.1-20260211`；`face_limit=60000`、`texture=true`、`pbr=true`、`texture_quality=detailed`；GLB | 30 |
| 2 | 低矮双人讨论沙发（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/planning/b20_discussion_sofa_dry_run.json`） | 同上，独立单件 | 同上；一次生成后放置 2 个实例 | 30 |
| 3 | 陶盆室内榕树（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/planning/b20_indoor_ficus_dry_run.json`） | 同上，独立单件 | 同上；一次生成后放置最多 4 个实例 | 30 |
| 合计 | **3 个单件 / 3 次调用 / 0 次重试** | 无额外处理链 | 无付费 FBX 转换、分件、重拓扑、UV 或 Rig | **90** |

每项 30 = 带标准纹理的文生 20 + detailed 纹理 10；按 [Tripo H3.1 官方模型价格](https://developers.tripo3d.ai/en/models/v3-1) 与 [API 价目](https://developers.tripo3d.ai/en/pricing)，2026-11-06 核对。该估算是 API 口径，不等于网页会员扣费；实际执行仍以获批渠道和当时参数为准，失败任务按服务规则释放冻结积分，实际收费以返回账目为准。

拟议下载父目录 `assets/source/external/tripo/b20_s2_proposed/`，CLI 下层为 `tripo-out/<name>-<id8>/`，包含 `model.glb`、预览和 task 记录。**该目录本轮未创建，任务 ID 为 null，消费为 0。** `face_limit=60000` 是源候选上限，不是 Web 发布预算；实例复用、材质、贴图、轮廓、底部、叶片结构和后续预算仍需接收检查。若主创希望图生，应先准备单件参考并重新提交输入/步骤/费用方案，不把本次全文生提案静默换成图生。

## 8. M1 保留与后续接口

本轮没有编辑 `src/m1`、fixture、package/lock 或既有场景。`m1-mock/1` 事件源、40 秒硬审批、子 Agent 生命周期、交接/会议、三份成果、暂停/重播和详情点击保留；核心测试通过。研究岛与接待模块没有对应新增业务事件，不表现为真实已激活部门。

| 既有语义 | B2.0 空间对应 | 后续实施注意 |
| --- | --- | --- |
| `standby` | 休息区 2 个锚点 | 无任务时终端息屏；不增加“休息行为”业务事实 |
| `design-office` / `dev-office` | 两个工作岛 | 同一 V2、同一 Agent ID，不靠复制新角色制造活跃度 |
| `design-workers` / `dev-workers` | 同一执行岛内两组槽位 | 保留原站点 ID、归属、状态和详情 |
| `collaboration` | 讨论区前侧站位 + 轻屏 | 人类审批仍在 HTML；动画不决定审批结果 |
| `delivery` | 品牌成果台 + 3 卡锚点 | 继续打开既有三份 Mock 成果 |
| Goal Hub | 读取现有 Goal、团队、决定与成果摘要 | 只增加投影，不建立第二个 World |

**转场时长是已识别的集成约束。** B2 路线最长 18.9 m，原 `SPEED=1.15` 对应约 16.4 秒；不能直接把新坐标代入原短场景。后续建议使用明确标为临时调度的、有时长约束的视觉转场，保留业务事件与审批门；对两名负责人同时移动、到站时点、暂停、重播及事件边界重新测试。这是交接建议，本轮没有改速度、改事件时点或宣称新布局已完成运行时兼容。

## 9. 实际验证、限制与停止点

- **源文件保护：** protected_before.json（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/validation/protected_before.json`） 与最终保护报告逐文件比较批准资产、A1.1 资料、M1 源码/脚本/fixture、依赖与 AGENTS，31 项全部未变；结果见 protected_after.json（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/validation/protected_after.json`）。
- **重新打开源：** Blender 5.2.3 LTS 在隔离进程、禁用嵌入脚本后重新读取 v005。839 场景对象、185 个唯一 Mesh datablock；求值后三角形含实例、人物、规划标注及展示地面共 284,356。没有将此统计认定为 Web draw calls 或性能合格。
- **几何通路：** 12 条 M1 对应路线 + 4 条公共支路，3,586 个中心采样，沿线间隔≤0.04 m，每点中心+16 周向采样、半径 0.55 m、检查高度 0.04–2.12 m；实际求值网格与家具 AABB 均无检测碰撞。非连续碰撞检测，不覆盖动态双人交错、自由导航或未来精修家具。
- **相机：** 全景完整取景，工作模式可读；两人头/胸在两个机位无遮挡。真实顶点投影记录见验证 JSON。尚未执行 B2 WebGL、响应式 HTML 避让或目标 GPU 帧率测试。
- **渲染：** 三张正式图来自 Blender Cycles CPU，32 samples，真实几何与材质，无 AI 修图。OptiX 内核编译失败保留在 `validation/render.log`，改用 CPU 完成；未改系统驱动或安装依赖。
- **检查中发现并修正：** 地面共面、全景裁切、讨论沙发净空，以及研发入口两侧框架。原失败图/日志保留；最终入口按两个边界网格的可行区间求得 y=1.65 m，并重新检查整场景。没有靠隐藏碰撞物件获得通过。
- **M1 核心：** `npm run test:m1 --prefix design/visual-a1.2/viewer` 通过。没有修改 M1，故本轮没有重跑已有浏览器全剧情；原工程的交互证据取 M1.2 报告，新 B2 动态联动尚未实施。
- **文档与登记：** 现有 `audit_workflow.mjs` 使用本机已安装的 Tripo CLI 依赖中的 YAML 解析器执行，无安装；workflow-check.json（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/validation/workflow-check.json`） 为 0 errors / 0 warnings。修改前文档文本快照及 文档差异（本地归档 / 外部参考，未随版：`design/b2-work-islands/s1-v001/validation/document_changes.patch`）保留，原工作树全为未跟踪文件，本轮不依赖空 `git diff` 证明保护。
- **质量关卡：** QG-0 本地输入/授权/保护有证据；S1 的源可编辑、尺度、空间与静态镜头已检查。QG-1/QG-6 主创审美与布局验收待定；QG-3 动画、QG-4 新场景 GLB 导出、QG-5 Web/性能不属本轮交付，未验证。V2 原有动画/拓扑/格式限制保持。

本轮提交到此停止。主创需审阅空间开阔程度、九区关系、主镜头与人物尺度，再决定是否批准上述三件 S2 生成任务。S1 的技术检查和 Tripo 离线计划均不代表美术验收，也不自动授权 S2–S4。
