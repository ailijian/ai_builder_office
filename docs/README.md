# 文档索引

> Status: ACTIVE · 2026-11-07 · 只维护导航和文档职责

从 [当前状态](STATUS.md) 开始；启动、依赖和验证命令只在 [根 README](../README.md) 维护。每次改动按下表定位事实来源，不从历史任务书恢复工作队列。

| 分类 | 入口 | 唯一维护职责 |
| --- | --- | --- |
| 当前 | [STATUS](STATUS.md) | 当前基线、迭代方向、范围边界 |
| 产品 | [产品方向](product/DIRECTION.md) | 用户、价值、领域概念、交互原则、待验证假设 |
| 产品 | [路线与开放事项](product/ROADMAP.md) | 阶段先后、未决定事项及每轮验收要求 |
| Web | [技术架构](web/ARCHITECTURE.md) | 已实现的数据流、模块责任、渲染边界 |
| Web | [Mock 契约](web/MOCK_SCENARIO.md) | 模拟事件、审批、实例生命周期、回放语义 |
| Web | [验收记录](web/ACCEPTANCE.md) | 首版截图、实际检查、坐标映射快照、视觉差异 |
| 资产 | [资产说明](assets/README.md) / [机器登记](assets/registry.json) | 可用资产身份、路径、来源、哈希及批准范围；说明从属登记 |
| 资产 | [人物生成记录](assets/character-provenance.json) / [目标图](assets/references/agent-office-target.png) | 原始提示、素材关系和视觉对照 |
| 未来参考 | [视觉方向](reference/VISUAL_DIRECTION.md) | A1.1 审美与后续 3D 表达约束 |
| 未来参考 | [3D 工作流](reference/3D_WORKFLOW.md) | 将来获授权资产工作的步骤、质量关卡、测量口径和评审字段 |
| 未来参考 | [AgentEvent 草案](reference/AGENT_EVENT_CONTRACT.md) | 未来真实事件的拟议契约；不是当前 Mock API |
| 历史 | [M1.1 资产依据](history/M11_ASSET_REVIEW.md) | 保留模型的批准来源、已知缺陷和实验经验 |
| 历史 | [文档审计记录](history/DOCUMENTATION_AUDIT.md) | 本次迁移、合并、删除与验证范围 |

## 维护规则

- **ACTIVE**：持续维护；产品方向的成熟度仍是 Working Draft，不能据此宣称已实现。
- **REFERENCE**：保留的未来设计；只有对应任务明确授权后才进入实施。
- **HISTORICAL**：当时的事实与证据；不维护当前状态，不包含可重放的授权。
- 同一事实在职责所属文档修改，其他页面通过链接引用。当前功能取 Web 文档，产品愿景取产品文档，模型身份取机器登记。
- 文件名使用稳定职责名，不在目录叠加“最新版”、日期副本、续聊副本。实际验收证据可以按版本保留。
- 新增或移动随版文档须同步本索引、引用、资产登记（涉及资产时）、Git 白名单和仓库检查。临时日志、整包备份、执行脚本和重复图片不放入文档目录。
