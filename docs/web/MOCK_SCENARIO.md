# Living Office Mock 场景与状态约定

> Status: ACTIVE · 2026-11-06 · 当前 B1 Demo，沿用 M1 模拟契约

产品方向由 [产品正文](../product/DIRECTION.md) 维护。本文不替代未来真实业务 [AgentEvent v1](../reference/AGENT_EVENT_CONTRACT.md)。

## 执行与表现分离

1. [B1 fixture](../../web/fixtures/b1-brand-website.json) 是固定 Mock 时间线。
2. [world.ts](../../web/src/mock/world.ts) 从 M1 提取同一 runner / reducer，是唯一事件与业务状态源。参数必须显式传入，不含旧 M1 默认名册。
3. [scenario.ts](../../web/src/office/scenario.ts) 声明三负责人、三执行角色与 B00 路线；[path.ts](../../web/src/mock/path.ts) 只计算二维路径长度与采样。
4. [Scene.tsx](../../web/src/office/Scene.tsx) / [projection.ts](../../web/src/office/projection.ts) 投影到 DOM / SVG。动画结束不产生成功事件。
5. [main.tsx](../../web/src/office/main.tsx) 订阅同一 World；接待是 UI 角色，不建立执行实例。

## M1 事件格式

命名空间为 `schemaVersion: "m1-mock/1"`，每个事件明确 `source: "mock"`。它不是既有 AgentEvent v1 的无提示扩展，也不接收真实 Provider 的事件。

```ts
interface MockEvent {
  schemaVersion: 'm1-mock/1';
  source: 'mock';
  scenarioId: string;
  runId: string;          // 当前为 local-demo，重播重置全部状态
  eventId: string;        // scenarioId + 连续 sequence
  sequence: number;      // 全场景顺序；从 1 开始
  occurredAt: string;     // 固定基准 + 模拟时间；不是实际 Agent 执行时间
  at: number;            // 模拟秒
  type: EventType;
  payload: Record<string, string>;
}
```

已实现用户要求的 11 类事件，并增加 `worker.removed`、`task.finished`、`agent.movement`、`meeting.started`、`simulation.finished`。完整类型和所需字段只在 `world.ts` 维护，预设时间线内容只在 fixture 维护；用户决定及重新提交由同一 runner 发出，不允许 fixture 预写批准。

`worker.spawned` 必须指定 `agentId` 和 `parentAgentId`；所属部门须已激活，创建者须是同部门的在场 Lead。人员、逻辑部门、任务和 Avatar 是分别关联的对象，不把一个模型当成一个执行器。

fixture 加载时检查 Mock 标识、已知类型、所需字符串字段及非递减时间。纯 reducer 对事件 ID 去重，对 sequence 缺口报错；这些检查用于确定性的本地脚本，不是生产系统的鉴权或完整安全校验器。

## 审批与重播

- 第 40 秒的 `decision.requested` 立即停住模拟时钟，即使单次 advance 超过该点也不会执行后续事件。播放按钮不能绕过审批。
- 用户点击批准或退回时，发出匹配当前 `decisionId` 的 `decision.resolved`，`resolution` 仅接受 `approved / rejected`。只有 pending 决定可以被解决；重复点击不重复产生事件。批准分支与原 M1 一致。
- B1.0 新增 `reject()`：决定变为 rejected，模拟状态保持 waiting，时钟与后续任务在 40 秒阻断。`play()` / `approve()` 无法越过已退回决定。`resubmit()` 仅接受 rejected，发出新的 `decision.requested` 并保持 waiting，文案明确仍为原预设方案，没有真实修改。此后仍需用户重新批准。
- `artifact.delivered` 要求存在已批准决定；三份成果齐全才允许 `simulation.finished`。
- 暂停冻结模拟时钟与路线距离。1× / 2× / 4× 仅调整演示速度；模拟时长不代表真实工作效率。
- 重播回到 ready、0 秒、三名待命负责人，清除子 Agent、决定、成果、会议和事件日志。重新启动后，在同一批准操作下得到相同 World 和事件日志。
- 刷新也回到初始状态；没有持久化、后台运行、真实审批 API、真实 Agent Adapter 或 SDK。未来接入须另行设计和授权。

## B1 人物、空间与成果

B1 后续用户要求映射为研究策划、品牌设计、网站研发三负责人；原研究 PNG 成为 `research-lead`，直接承担原研究任务。三子 Agent 为 `visual / frontend / test`，保留原任务时点，改为 `task.finished` 同时 `worker.removed`（41 / 55 / 60 秒）。研究部门在 3 秒激活，13 秒补充研究 → 设计交接，25 / 42 / 61 / 75 秒参与讨论、回岗位、交付、回待命。目标、决定、成果与这三类子 Agent 的任务 payload / 时点均保留。接待员属于常驻 UI 导览角色，不进入执行 World。

展示规则：ready / reset 时三负责人使用坐姿 PNG；开始即站立，暂停不改变姿态，返回待命位置后再入座。子 Agent 只在已分配任务且行为为 Working / Waiting Decision 时显示；spawn 后未 started 不显示，完成释放后不显示。任务历史仍来自事件。三块物理屏幕对应视觉、前端、测试，释放后仍能显示完成事实。七角色随时可从导览了解，名册不等于当前执行实例。

B1 路线持续时间与 B00 像素点一并声明，仍经共享起点连续性校验；动画只投影业务状态，reduced-motion 下省略连续转场。成果交付前标记样例预览，交付后仍标记 Mock。本地草稿 `b1-practice-draft/1` 包含三团队 / 六执行角色（不含接待），固定 `source: mock`、`verified: false`。开发模式 `window.__b1` 只提供复制快照和配置，生产不暴露；不实现 M2 持久化或复用。

## 复现与验证

命令见 [README](../../README.md)。状态测试覆盖精确时点、审批与重播；浏览器通过真实 UI 完成退回 / 重新提交 / 批准和两次回放，将完整 World 与拆分前验证快照逐字段比较。基线是已有实现证据，不是未来产品要求。

旧 M1 / M1.2 的 design 工程已清理，其模拟引擎和完整 B1 基线保存在当前 `web/` 中；旧入口不可再启动。本版没有 R3F、旧布局或第二套业务引擎。结果见 [B1 交付报告](ACCEPTANCE.md)。
