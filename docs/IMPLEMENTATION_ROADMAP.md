# 实施路线与阶段边界

> **B1 首版范围（2026-11-06）：** 当前代码仅为 `web/` 的 React / DOM / SVG 图片式 Demo。本文 3D、生产和后端内容保留为目标及历史设计依据；旧工具、模型与评审证据未随版，不可据此认定可运行或已获下一阶段授权。最新事实见 [当前状态](production/CURRENT_PROJECT_STATE.md)。文中“本轮 / 当前”的旧阶段记录按原记录日期理解。

> Status: ACTIVE · 2026-11-06 · 工程演进参考，不构成执行授权

当前阶段、资产批准范围与本轮停止点只在 [CURRENT_PROJECT_STATE.md](production/CURRENT_PROJECT_STATE.md) 维护。旧“P0 尚未开始/重新选风格”已失效；现有视觉资产和评审工程保留。

产品定位、M1 Mock 演示目标和 M2–M4 里程碑在 [产品方向 V0.1](product/agent-office-product-direction-v0.1/AGENT_OFFICE_PRODUCT_DIRECTION_V0.1.md) 维护，状态为 Working Draft。下表仅保留资产制作与系统接入的工程条件，不作为 M1–M4 的产品阶段顺序；其中真实 Agent 接入和真实用户闭环不是 M1 Mock 演示的前置条件。

| 后续工作 | 进入条件 | 结果 |
| --- | --- | --- |
| 低模路线小样 | 主创确认 G2.5a 唯一任务提案（本地归档 / 外部参考，未随版：`docs/production/G25_ONE_CALL_PROPOSAL.md`），明确输入、参数、次数、费用与授权 | G2.4 保真、局部拓扑可行性的证据；不自动制作动画 |
| 可编辑动画母版 | 适用的外观/拓扑关通过，获准分件/骨架/表情工作包 | Blender 实际变形及约定动作、GLB 与 Web 播放证据 |
| 一人最小交互 | 人物与环境资源适合接入，明确演示范围 | 3D 点选/状态与可访问 HTML 联动，明确 mock |
| 真实 Agent 接入 | 框架/API/权限与数据契约已明确 | 任务、事件、成果、审批由后端事实驱动；重复/乱序/断线恢复测试 |
| 用户闭环与扩展 | 一人工作流真实可用，获准扩大范围 | 任务委派到交付、多角色独立状态及目标设备性能验收 |

资产制作与验收只遵循 [AI_3D_PIPELINE.md](production/AI_3D_PIPELINE.md) 和 [QUALITY_GATES.md](production/QUALITY_GATES.md)，不再在路线图复制另一套 G/P/Q 关卡或强制 Clip 列表。后续业务架构见 [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)，不是本轮待实现清单。
