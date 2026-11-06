# Agent Office — 当前 Web 技术架构

> Status: ACTIVE · 2026-11-07 · 描述现有实现，不把目标架构写成已接入能力

## 入口与依赖

唯一应用在 `web/`，`index.html` 加载 `src/office/main.tsx`。React + TypeScript + Vite；场景采用 PNG、CSS、DOM 与 SVG。没有 Three.js / R3F 依赖、3D Canvas、GLB 加载、Agent SDK、服务端或数据库。命令与版本要求见 [README](../../README.md)。

## 业务状态流

`B1 fixture → MockScenarioRunner → reduceEvent / World → React 订阅与场景投影 → 人工决定回到 runner`。

| 文件 | 职责 |
| --- | --- |
| [剧情](../../web/fixtures/b1-brand-website.json) | 固定模拟事件；不预写用户批准 |
| [world.ts](../../web/src/mock/world.ts) | 从 M1 提取的唯一 runner / reducer、模拟时钟、审批和结果 |
| [scenario.ts](../../web/src/office/scenario.ts) / [path.ts](../../web/src/mock/path.ts) | 三负责人 / 三执行角色、显式路线与二维路径采样 |
| [projection.ts](../../web/src/office/projection.ts) | 业务状态到人物姿态、显隐、区域高亮和任务历史 |
| [scene.config.ts](../../web/src/office/scene.config.ts) | 图片、B00 像素锚点、十区热点、七角色身份及预设回复 |
| [Scene.tsx](../../web/src/office/Scene.tsx) | 建筑底图、Ambient / Event 层、SVG 热点与人物 DOM |
| [main.tsx](../../web/src/office/main.tsx) | 同一 World 订阅、播放控制、等比例缩放、手机导航和模态选择 |
| [Dialogs.tsx](../../web/src/office/Dialogs.tsx) | 独立角色对话、区域内容、审批、成果查看与配置草稿 |
| [style.css](../../web/src/office/style.css) | 布局、玻璃感标签、克制动效、响应式与 reduced-motion |

`useSyncExternalStore` 订阅同一 World；选择、缩放、对话输入属于本地 UI 状态，不建立第二个任务状态源。动画读取模拟时间，不依据移动或呼吸动画结束推断任务成功。

## 空间与角色

唯一建筑底图使用 1672 × 941 设计坐标。桌面按短边比例完整显示；手机提供平移、缩放和区域导航。所有热点、标签和脚底同源，人物命中优先于区域。坐标与实际截图在 [B1 报告](ACCEPTANCE.md)。

七个展示身份中，三位负责人常驻，三类子 Agent 是任务驱动实例，接待只做空间导览。初始显示三坐姿负责人和接待；演示开始站立，执行角色在 task.started 后显示、完成释放后消失；暂停不改变姿态。任务释放后的阅读来自事件历史。

## 模拟、决定与成果

当前采用明确标记的本地 Mock 事件与人工决定；具体命名空间、审批阻断、实例显隐及回放语义只在 [Mock 契约](MOCK_SCENARIO.md)。

对话没有外部模型调用；三类成果是内置样例。Team / Practice 下载为本地、未验证 JSON，不是 M2 持久复用。开发诊断只返回复制快照，生产构建不暴露这些接口。

## 验证与后续边界

类型、状态回归、真实浏览器操作、生产构建检查分别验证不同层。浏览器测试比较完整事件和最终 World，验证审批、显隐、焦点及手机仿真；仓库检查验证依赖、文档链接和随版 PNG 哈希。

3D 只保留已验收人物与办公室的本地包，路径取 [资产登记](../assets/README.md)。未来可采用 R3F / Three.js 正交相机、可编辑 Blender / GLB 与 HTML 详情，但不影响当前 Web 的迭代前提。真实执行器与 [AgentEvent v1 草案](../reference/AGENT_EVENT_CONTRACT.md) 的适配、授权、幂等、恢复和成果证据均需新的设计与授权，不由此文自动启动。
