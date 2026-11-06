# 当前项目状态

> Status: ACTIVE · 2026-11-06 · 当前阶段与允许范围的唯一入口

用户已确认将 B1.0 网页 Demo 拆为独立第一版并提交推送，在此基础上迭代，同时保留此前的 3D 目标。**唯一发布代码为 `web/`**：React / TypeScript、DOM / SVG 与 PNG；默认 `/` 打开 Living Office。旧 M1 / M1.2、3D 评审和资产工具留在本机原目录，不随版发布。拆分前文档备份于本机忽略的 `local-archive/pre-b1-v1/`，新克隆不依赖这些归档。

## B1.0 当前交付

B00 使用完整 1672 × 941 坐标；桌面等比例呈现，手机支持触摸平移、缩放与区域导航。十区热点、七角色独立 Mock 对话、三类成果阅读和本地 Team / Practice 草稿导出已实现。

三负责人为研究策划、品牌设计、网站研发。待命均坐在休息区，两位聊天、一位阅读；开始后站立，按事件预设路线协作，返回后入座。视觉、前端、测试三子 Agent 仅在任务执行 / 等待审批期间显示，完成即释放。女性接待常驻，不是执行实例。

从原 M1 提取同一 `MockScenarioRunner` / reducer 与二维路径计算，移除旧默认配置、3D 区域助手及 Three.js / R3F 依赖。B1 显式 fixture、完整事件与最终 World 用既有验收快照比对；播放、暂停、重置、审批、退回、重新提交、成果及确定性回放保留。动画只投影事件。

全部任务、对话和成果均为 **Mock / Simulation**。40 秒审批必须点击；退回阻断后续，重新提交沿用预设方案，不伪称生成修改。配置草稿 `verified: false`；无真实 Agent、SDK、后端、部署或 M2 编排。

十一张运行 PNG 按原字节保留，来源见 [资产登记](ASSET_REGISTRY.md)。映射、截图、实际检查与限制见 [B1 报告](B10_LIVING_OFFICE_REPORT.md)。用户认可既有其他效果并要求建立首版基线；工程验证不代替未来版本的主创审美验收。

## 保留的 3D 目标与阶段边界

- Web 优先：React + R3F + Three.js 正交相机、精致 2.5D 微缩办公室、可访问 HTML 业务 UI。执行 / 事件 / 渲染分离持续有效。
- A1.1 温暖奶油白、木色、青绿的方向和批准的人物 / 办公室身份保持，不因图片路线重新选型。
- Tripo G2.4 为已批准外观母版，**Animation Master Not Ready**。V2 曾用于 M1.1 / M1.2 静态负责人，尚无正式 Idle / Walk 骨骼动画；结构与发布权利记录缺口仍待核实。
- B2.0 S1 为独立可编辑空间蓝图（`B20-S1-LAYOUT-001`，v005，22 × 16 m）；静态检查曾完成，主创布局 / 家具验收待进行。S2–S4 未启动，不提交生成或消费积分。
- M1.1 视觉与功能已有主创批准。旧 M1.2、B2 与原模型保持在本地；`bundled: false` 仅为历史身份记录，不能当作新克隆中的模型。

3D 目标见 [技术架构](../TECHNICAL_ARCHITECTURE.md)、[视觉锁定](../design/A1.2_VISUAL_LOCK.md)、[B2 S1 蓝图](B20_S1_SPATIAL_BLUEPRINT.md)、[AI 3D 流水线](AI_3D_PIPELINE.md) 和 [质量关卡](QUALITY_GATES.md)。Git 提交推送授权不等于部署、真实 SDK、付费生成或下一资产阶段授权。

## 维护职责

当前阶段取本文件；产品取 [产品方向](../product/agent-office-product-direction-v0.1/AGENT_OFFICE_PRODUCT_DIRECTION_V0.1.md)；资产取机器登记；Mock 取 [状态约定](../architecture/M1_MOCK_SCENARIO.md)。ACTIVE 不代表实现或授权，历史计划不自动恢复。最新用户决定优先，实质冲突应报告并同步正确入口。
