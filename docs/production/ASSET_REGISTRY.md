# Agent Office 资产登记

> Status: ACTIVE · 2026-11-06 · [机器登记](ASSET_REGISTRY.json) 为身份、路径、哈希来源

## 本版分发边界

11 张运行 PNG 共 12,172,735 bytes；按原字节复制，没有生成或重编码。目标图与 B2 原提案作为设计资料随版，目标图不参与页面运行。四张新人物的工具、提示与输入见 [生成记录](../design/b1-character-provenance.json)，坐标见 [B1 报告](B10_LIVING_OFFICE_REPORT.md)。

`bundled: false` 仅保留此前 3D 目标的身份、原本地路径、来源与历史哈希，没有提交模型或旧实现。该字段不是质量等级。原本地路径与 archived_review 不保证新克隆可打开。

## B1.0 原始图片素材

| ID | 随版路径 | 用途 |
| --- | --- | --- |
| A12-LOCK | `docs/design/A1.2_VISUAL_LOCK.md` | visual_specification |
| B20-VISUAL-REFERENCE | `docs/design/references/agent-office-target.png` | scene_direction_reference |
| B20-PROPOSAL-V02 | `docs/design/references/b20-proposal-v02.txt` | user_design_proposal |
| B10-TARGET-REFERENCE | `docs/design/references/agent-office-target.png` | b1_layout_reference |
| B10-B00-SCENE | `web/assets/未来生态科技中庭.png` | b1_static_architecture |
| B10-B01-01 | `web/assets/ChatGPT 图像 2026年11月6日 14_39_39-1.png` | b1_character_sprite |
| B10-B01-02 | `web/assets/ChatGPT 图像 2026年11月6日 14_39_40-2.png` | b1_character_sprite |
| B10-B01-03 | `web/assets/ChatGPT 图像 2026年11月6日 14_39_41-3.png` | b1_character_sprite |
| B10-B01-04 | `web/assets/ChatGPT 图像 2026年11月6日 14_39_42-4.png` | b1_character_sprite |
| B10-B01-05 | `web/assets/ChatGPT 图像 2026年11月6日 14_39_43-5.png` | b1_character_sprite |
| B10-B01-06 | `web/assets/ChatGPT 图像 2026年11月6日 14_39_45-6.png` | b1_character_sprite |
| B10-SEATED-DESIGN-001 | `web/assets/design-lead-seated-v001.png` | b1_character_pose |
| B10-SEATED-DEV-001 | `web/assets/development-lead-seated-v001.png` | b1_character_pose |
| B10-SEATED-RESEARCH-001 | `web/assets/research-lead-seated-v001.png` | b1_character_pose |
| B10-RECEPTIONIST-001 | `web/assets/receptionist-standing-v001.png` | b1_reception_character |

## 保留的 3D 身份（文件未随版）

| ID | 历史用途 | 状态 |
| --- | --- | --- |
| TRIPO-G24-VISUAL-001 | character_visual_master | Visual Master Approved; Animation Master Not Ready |
| TRIPO-G24-FBX-SUPPORT | equivalent_support_format | Reference |
| TRIPO-G24-BLENDER-REVIEW | editable_review_derivative | Reference |
| OFFICE-ENV-001 | office_master | Approved |
| OFFICE-APPROVED-LINEAGE | approved_lineage | Reference |
| OFFICE-WEB-001 | current_office_web | WIP |
| A11-CHARACTER | approved_visual_reference | Approved |
| A11-HERO | approved_visual_reference | Approved |
| A11-MULTI | approved_visual_reference | Approved |
| A11-SPEC | visual_specification | Reference; HISTORICAL |
| A12-PRODUCTION-SPEC | visual_specification | Reference; SUPERSEDED |
| TRIPO-G25A-WEB-V2-GLB | retopology_candidate_web_export | M1.1 lead visual asset authorized; Animation Master Not Ready |
| TRIPO-G25A-WEB-V2-FBX | retopology_candidate_native_polygons | WIP; intake reviewed; not approved for animation or release |
| B20-S1-LAYOUT-001 | editable_spatial_study | WIP; S1 submitted; creator acceptance pending |

G2.4 高模外观已批准，Animation Master Not Ready；无骨骼、权重、表情或动作。V2 静态候选曾用于 M1.1 / M1.2，不能视为正式动画角色。B2 S1 待主创审阅，未进入 S2。生成参数 / task ID / 商业权利缺口保持未知，不从文件名推断。Snow、Fredy 与旧 G2 不恢复为生产母版。

原件未修改或删除；本次只复制必要 PNG、建立可移植登记与筛选 Git 范围。后续按 [流水线](AI_3D_PIPELINE.md) / [质量关卡](QUALITY_GATES.md)，最新状态取 [当前入口](CURRENT_PROJECT_STATE.md)。
