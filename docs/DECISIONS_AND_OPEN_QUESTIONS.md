# 技术决策与待验证事项

> **B1 首版范围（2026-11-06）：** 当前代码仅为 `web/` 的 React / DOM / SVG 图片式 Demo。本文 3D、生产和后端内容保留为目标及历史设计依据；旧工具、模型与评审证据未随版，不可据此认定可运行或已获下一阶段授权。最新事实见 [当前状态](production/CURRENT_PROJECT_STATE.md)。文中“本轮 / 当前”的旧阶段记录按原记录日期理解。

> Status: ACTIVE · 2026-11-05

本轮主创明确决策取代旧“风格未定、尚无资产、P0 未开始”的记录。阶段见 [当前状态](production/CURRENT_PROJECT_STATE.md)，流程见 [AI_3D_PIPELINE.md](production/AI_3D_PIPELINE.md)。

| 决策 | 当前标准 |
| --- | --- |
| 产品 | Web 优先；React + TypeScript + R3F + Three.js；正交 2.5D 等距办公室 |
| 状态与 UI | Agent 执行层、事件层、视觉层解耦；3D 表达空间与动作，HTML 承担任务/报告/审批；不编造执行结果 |
| 视觉 | A1.1 Warm Intelligent Workspace 已锁定；温暖、专业、轻 Q 人物，暖白/浅木/青绿/弧形空间；不再 A/B/C 比较 |
| 人物 | 已批准 Tripo G2.4 为外观高模；正式动画资产需保真重拓扑、可编辑分件、骨架/蒙皮/表情；禁止直接发布高模 |
| 空间 | 保留 G1 已批准 Blender 模块结构；Tripo 可供局部家具，不替换可编辑布局 |
| 工具 | 官方 Tripo 插件负责服务；Blender MCP 交互，CLI/bpy 可复现；glTF Transform/Validator 检查优化；R3F 实跑，Playwright 验证 |
| 资产治理 | 登记唯一有效版本；原件冻结、派生版本不覆盖；格式/运行/人工审美分别验收 |
| 费用 | 生成与付费处理必须有明确授权；不把插件自动加载当许可 |
| 系统扩展 | REST + SSE 为后续建议；WebGL 为当前渲染基线；后端框架/数据库尚非实际实现 |

## 尚待验证

- P2 或 Blender 重拓扑能否保持 G2.4 身份；眼睑、嘴角、手部/平板及中性绑定姿态的真实可制作性。
- 目标设备、角色并存数、资源预算、实时灯光/玻璃/动态阴影及动画性能。
- Tripo 原始生成 task ID/参数/模型版本和可核验发布许可；当前均不得猜测。
- 真实 Agent 框架、事件/快照/授权接口、数据保存期限与部署范围。
- 现有事件 fixture 校验器的分类型 payload 和错误字段类型处理不足；接入真实事件时修复并补覆盖。本轮不扩展业务功能。

## 环境证据

2026-11-05 只读确认 Blender MCP 在线：Blender 5.2.3 LTS、addon 1.8、协议 15 匹配；生成 providers 全关闭。Figma 连接读取成功。Tripo 插件 0.2.7 的两个 Skill 存在且在本聊天可见；初次扫描时 CLI 尚不可见，随后主创完成安装，本轮确认 `tripo-cli` 0.7.2；没有登录或提交任务。

具体配置路径、版本、可发现性与本轮构建/测试结果统一见 WORKFLOW_AUDIT_REPORT.md（本地归档 / 外部参考，未随版：`docs/production/WORKFLOW_AUDIT_REPORT.md`）。工具在线不等于资产通过验收。

主创报告 API 侧 1000 积分、网页专业会员 3000 积分；API 积分用尽后改为主创网页生成、Codex 接收检查。余额未远程核验，不假定两个渠道共享。具体 使用说明（本地归档 / 外部参考，未随版：`docs/WINDOWS_INSTALL.md`） 保留授权边界。
