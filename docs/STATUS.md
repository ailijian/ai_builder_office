# 当前项目状态

> Status: ACTIVE · 2026-11-07 · 当前方向与范围入口

**当前迭代基线是 `web/` 的 B1.0 Living Office Demo，首版提交 `c9ae39d`。** 后续继续在现有 React / TypeScript / DOM / SVG 与图片素材上迭代。启动见 [README](../README.md)，模块和能力取 [Web 架构](web/ARCHITECTURE.md)，真实检查及限制取 [验收记录](web/ACCEPTANCE.md)。

## 当前范围

- 业务仍为明确标记的 Mock / Simulation，唯一 runner / reducer 管理状态；没有真实 Agent SDK、服务端或持久编排。
- 三位负责人坐姿待命，开始后站立；三类子 Agent 按任务显隐；女性接待常驻。具体生命周期只在 [Mock 契约](web/MOCK_SCENARIO.md) 维护。
- 原 M1 / M1.2 viewer、B2 S1 布局与旧 design 工程已清理，不再有可运行入口。原事件机制已保留在当前 Web 中。
- 3D 仅保留已验收到 M1.1 的人物、办公室及必要支持文件，留在本机，不随 Git 发布。身份、路径、哈希、清理记录见 [资产登记](assets/registry.json)；批准范围和未通过项见 [历史依据](history/M11_ASSET_REVIEW.md)。
- 此前确定的正交 2.5D / R3F / Three.js、Blender / GLB 和 HTML 业务 UI 目标继续保留为 [未来参考](reference/3D_WORKFLOW.md)。当前不恢复旧制作队列，也不推进 M2、真实 SDK 或部署。

## 最近维护

2026-11-06 旧资产清理完成并核验。2026-11-07 文档按产品、Web、资产、未来参考和必要历史归类，合并重复说明；205 个过时 / 临时文件已由用户执行删除，并核验全部清理目标消失、受保护文件哈希一致；迁移与验证范围见 [文档审计](history/DOCUMENTATION_AUDIT.md)。本次整理不改变 Web 运行行为或保留模型。用户于 2026-11-07 明确授权提交并推送本次文档整理与相应仓库检查改动。

产品目标取 [产品方向](product/DIRECTION.md)，后续阶段和开放问题取 [路线](product/ROADMAP.md)。文档目录、历史阶段或工具可用不构成新的实施授权。
