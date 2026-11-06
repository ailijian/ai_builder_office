# Agent Office — 项目约定

> Status: ACTIVE · 2026-11-06

首版代码入口为 `web/` 的 B1.0 图片式 Living Office Demo。原 3D 产品目标和设计文档保留；旧实现、资产生产工具和模型仅在本地归档，不属于本版代码。

## 当前入口

- 开始任务先读 [当前状态](docs/production/CURRENT_PROJECT_STATE.md)，再按 [知识索引](docs/README.md) 定位资料。
- 启动和验证取 [README](README.md)。默认在 `web/` 迭代，不重新引入旧多入口工程。
- 资产身份、来源、哈希取 [机器登记](docs/production/ASSET_REGISTRY.json)；`bundled: false` 是本地历史记录，不是仓库现有文件。
- 未来 3D 制作遵循 [AI 3D 流水线](docs/production/AI_3D_PIPELINE.md)、[质量关卡](docs/production/QUALITY_GATES.md) 与 [视觉锁定](docs/design/A1.2_VISUAL_LOCK.md)。文档存在不等于实施授权。
- 系统与事件边界取 [技术架构](docs/TECHNICAL_ARCHITECTURE.md) 及 [Mock 状态约定](docs/architecture/M1_MOCK_SCENARIO.md)。

## 永久约束

1. 当前 Demo 使用 React + TypeScript、DOM / SVG、B00 / B01 PNG。未来目标仍是 R3F + Three.js 正交相机的 2.5D 微缩办公室，3D 与可访问 HTML 业务 UI 分离。未经授权不把本版替换成 3D 引擎或普通管理后台。
2. 执行、事件、渲染层解耦。MockScenarioRunner / reducer 是唯一业务状态源；动画不能推断完成或审批成功。Mock 必须明确标记，渲染层不调用大模型 API、不持有生产密钥。契约变更同步 fixture、校验、文档和测试。
3. 保留确认的视觉、人物和空间；未经授权不重开选型、不恢复历史角色为生产母版。外观批准不等于动画或发布就绪。
4. 不覆盖、删除或重建原资产与已批准资产。派生素材使用独立版本，保存来源和证据；截图不替代模型，自动检查不替代主创美术验收。
5. 生成和付费处理仅按明确授权的输入、操作、次数和费用执行；未知任务状态先核实。不因此修改全局工具配置、使用生产密钥或执行不可信脚本。
6. 完成授权范围内的制作、验证与交接；验收结论不可代签，不能自动推进下一阶段。历史计划、工具可用与技术检查通过均不扩大授权。

## Git、文档与验证

- `.gitignore` 限制为根治理文件、`web/` 和选定文档。必要 PNG 与三张验收截图随版；依赖、构建、日志、密钥、本机状态、模型和旧实现不提交。新文档加入索引及白名单，不用强制添加绕过范围。
- 变更请求允许必要局部修改与验证；只有明确授权才提交、推送、发布或部署。不得顺带删除本地历史资料。
- 按风险运行类型检查、状态测试、构建及浏览器测试。提交前运行 `test:repository`、审阅暂存清单和 diff。构建成功不等于美术验收或真实 Agent 执行成功。
- 同一事实更新现有来源；索引只导航，摘要从属正文。ACTIVE 不表示已实现；HISTORICAL / SUPERSEDED 不构成当前执行授权。
- 仅在明确授权治理调整时修改本文件。未来需要资产 Skill 时先确认本机可用版本；本版不发布这些工具代码。
