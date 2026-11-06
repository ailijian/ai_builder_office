# 资产说明

> Status: ACTIVE · 2026-11-07 · 从属机器登记的阅读入口

[registry.json](registry.json) 是资产 ID、路径、大小、SHA-256、来源和批准范围的唯一登记。不要从目录名或版本号推断母版，也不要把旧路径当可用输入。

## 三类资料

| 类别 | 用途与分发 |
| --- | --- |
| Web 运行图片 | 11 张 PNG 位于 `web/assets/`，随版发布；建筑底图、六张站姿、三张坐姿和女性接待 |
| 本地 3D 保留包 | `assets/retained-3d/` 中 21 个文件：7 模型、9 贴图、5 参考；保留 M1.1 人物与办公室两个家族，不随 Git 发布 |
| 文档参考 | [目标效果图](references/agent-office-target.png)、[视觉方向](../reference/VISUAL_DIRECTION.md)；目标图不参与页面加载 |

机器字段：`bundled` 表示是否随 Git 发布；`storage: repository` 表示仓库文件，`storage: local-retained` 表示本机保留。`assets` 只列现存资产；`retired_assets` 记录已删除、合并或先前缺失的身份，不能被加载为输入。

## Web 映射与来源

实际区域坐标、polygon、人物脚底、姿态和角色映射只在 [scene.config.ts](../../web/src/office/scene.config.ts) 维护；首版审查快照和视觉差异见 [验收记录](../web/ACCEPTANCE.md)。

原 B00 / B01 图片来自用户附件；新增三坐姿与女性接待的生成提示、参考图和原字节哈希保留于 [character-provenance.json](character-provenance.json)。不生成第二份素材清单或修改原提示。

## M1.1 保留身份

| 资产 ID | 角色 |
| --- | --- |
| TRIPO-G24-VISUAL-001 | 已批准人物外观高模来源 |
| TRIPO-G24-FBX-SUPPORT | 高模的配套 FBX 与贴图 |
| TRIPO-G25A-WEB-V2-GLB / TRIPO-G25A-WEB-V2-FBX | M1.1 使用的静态低模及可编辑来源 |
| OFFICE-ENV-001 | 办公室环境母版 |
| OFFICE-APPROVED-LINEAGE | 批准来源 Blender 文件 |
| OFFICE-WEB-001 | M1.1 实际使用的 portable GLB |

批准来源、V2 缺陷和临时刚体转场边界见 [M1.1 历史依据](../history/M11_ASSET_REVIEW.md)。外观批准不等于动画、格式、目标设备性能或发布通过；生成 task ID / 参数及商业权利仍有未知项。

## 清理与维护

2026-11-06 的模型清理统计、保留哈希及复验记录维护在 registry 的 `cleanup` 中，仅针对本项目；项目外旧归档未处理。2026-11-07 文档清理见 [审计记录](../history/DOCUMENTATION_AUDIT.md)。

新增或迁移资产时更新机器登记及受影响引用，再核对字节和 SHA-256。Web 素材由仓库检查核验；本地模型不应成为新克隆运行 Demo 的依赖。后续 3D 制作遵循 [参考工作流](../reference/3D_WORKFLOW.md)，不覆盖原件。
