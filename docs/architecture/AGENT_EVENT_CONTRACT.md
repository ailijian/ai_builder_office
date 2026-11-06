# AgentEvent v1 数据契约

> **B1 首版范围（2026-11-06）：** 当前代码仅为 `web/` 的 React / DOM / SVG 图片式 Demo。本文 3D、生产和后端内容保留为目标及历史设计依据；旧工具、模型与评审证据未随版，不可据此认定可运行或已获下一阶段授权。最新事实见 [当前状态](../production/CURRENT_PROJECT_STATE.md)。文中“本轮 / 当前”的旧阶段记录按原记录日期理解。

> Status: ACTIVE · 2026-11-05 · 当前维护；范围以项目状态和唯一流水线为准。 [当前入口](../production/CURRENT_PROJECT_STATE.md)

## 格式与定义

```ts
type TaskStatus = 'queued' | 'planning' | 'running' | 'awaiting_approval' |
  'blocked' | 'completed' | 'failed' | 'cancelled';
type Activity = 'none' | 'planning' | 'research' | 'analysis' | 'drafting' |
  'coding' | 'review' | 'handoff';

type AgentEvent = {
  schemaVersion: 1;
  eventId: string;           // 稳定唯一：幂等键
  workspaceId: string;
  taskId: string;
  agentId: string | null;    // 任务级事件可以为空
  sequence: number;          // taskId 内严格递增，起始值由后端决定
  type: string;              // 使用下面的事件类型目录
  activity?: Activity | null;
  occurredAt: string;       // ISO8601，建议 UTC
  payload: Record<string, unknown>;
};
```

## 首版事件类型

| type | 语义 | 典型业务影响 |
| --- | --- | --- |
| `task.created` | 创建任务 | queued |
| `task.assigned` | 分派给 Agent | queued / planning |
| `agent.activity.started` | 某 Agent 开始可观测的实际活动 | running + activity |
| `agent.activity.finished` | 该活动结束 | 清除或切换 activity，**不等于任务完成** |
| `approval.requested` | 后端要求人工许可 | awaiting_approval |
| `approval.resolved` | 后端已批准/拒绝 | 按审批结果恢复/取消/阻塞 |
| `task.completed` | 后端确认任务完成 | completed，附 artifact refs |
| `task.failed` | 后端确认失败 | failed |
| `task.cancelled` | 后端确认取消 | cancelled |

本样板 deliberately 不含百分比进度。以后只有真实可靠的工具/阶段信息能解释进度时才考虑添加。

## 状态投影算法的要求

1. 快照 + 事件流是单一权威；`taskId` 内 `sequence` 严格递增。
2. 对 `(eventId)` 幂等去重；序号 <= 当前快照的事件丢弃。
3. 如果发现缺失中间序号，不直接应用跳跃事件造成错误状态：先缓冲并向服务端请求缺口或新快照。
4. `activity.started` 不自动代表完成任何子任务；`task.completed` 仅由后端执行层发送。
5. 客户端 `offline` 是传输状态，不改变业务层保存的真实状态；UI 必须提示“状态可能过期”。
6. 服务端写事件和投影快照要能在失败时恢复，必要时使用事务/outbox 等模式保证一致性。
7. `payload` 仅放允许给用户阅读的摘要及安全引用，隐藏密钥、执行环境私密细节、未经授权的文档内容。

## 人工审批

- 用户点击「批准/拒绝」 → 前端调用有鉴权的服务端 API，带幂等请求 ID。
- 服务端核验用户身份、Agent/任务权限和请求有效期 → 更新审批记录 → 恢复或取消运行 → 写入 `approval.resolved` 事件。
- 前端在真正收到成功确认之前显示“正在处理”，不能直接播放“已批准”的确定性动画。

## 数据样板

请见项目 `fixtures/sample-agent-events.json`；有配套 `validate_events.py` 用于快速检查。真实开发应使用 Zod 等 schema 在 API 入口再校验，而不是把此 Python 脚本当作生产后端。
