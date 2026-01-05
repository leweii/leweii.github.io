---
title: "Agentic Coding Tool Tip (Based on Claude Code)"
description:
create_time: 2026-01-05 00:00
tags:
  - tech
published: false
---

咸盐少许，直奔主题

### 配置

#### 尽量使用性能最好/最贵的模型

虽然 Claude Sonnet 4 计费是 Opus 的 1/5，但在处理极高难度的逻辑时，Claude Opus 4.5 依然是目前最强大的选择。有条件的朋友，建议直接用最贵的模型。节约的是自己的时间。

#### 跳过授权，--dangerously-skip-permissions

频繁的权限确认动作会打断思路（会很烦）。启动时添加 `--dangerously-skip-permissions` 参数，可以让 Claude 无需询问直接执行操作。

#### activate deep thinking

关键词 think、think hard 或者 ultrathink 可以增加 Claude 的思考预算。当然 token 消耗也会越多。

### 环境

#### 理解和配置好你的 CLAUDE.md

**加载机制**：

Claude Code 会分级加载你的 CLAUDE.md，从当前目录往上加载，直到根目录。

依据此特性，我们可以分级配置，全局 -> 项目级 -> 模块/目录级 CLAUDE.md

**Best Practices**：
- 保持小而精
- 内容：
  - 常用的 Bash 命令
  - 核心文件、工具函数及其用途
  - 代码风格指南（如 PEP 8、ESLint 等）
  - 测试说明和开发环境设置

#### 记忆

管理好每个 session 的记忆，在适当的时候 resume，在适当的时候使用
- `/clear`：重置会话
- `Double-tap Escape`：拉取历史消息
- `/resume`：恢复会话

利用文件系统，管理好长期记忆。
- CLAUDE.md
  - 可利用 claude 引用，获取多级系统配置信息
  - 可配置框架、规范、工作流、工作要求，详见 `Spec driven development`
  - 全局配置，比如你希望它全程使用中文，只需在（`~/.claude/CLAUDE.md`）中加入「每次请用中文回答我」

利用 `/memory` 命令，修改添加 memory

#### 自定义cmd/skills

- 将高频的简单流程保存成可重复使用的 prompt 文件
- 将高频的工作流、复杂任务，开发成 skill

不停地根据业务的变化和需求的变化，迭代你的 prompt 和 skills

### 工程

#### Spec driven development

利用 SDD 框架工具，开发复杂程序。

使用 spec driven development 实践，可以解决团队协作、规范不统一的问题，还能解决长任务执行、注意力发散的问题。

**superpowers**

如果是简单的需求，可以用 `/superpowers:brainstorm` + write-plan + execute-plan。

我很喜欢 brainstorm，就像有一群人在为你出谋划策一样。

**openspec**

如果是相对复杂的需求，可以用 openspec。

**spec-kit**

如果是一个从 0 到 1 的项目，并且希望能够对项目有完全的掌控，可以尝试 spec-kit。（我尝试过，但是由于需要定义的文档内容过多放弃了）

#### 利用 Git Worktrees 并行任务（待论证）

#### Test-Driven Development

用 AI 写代码，一定要让它自论证，TDD 就显得格外适应 AI 时代的编程模式，这写在 superpowers 的哲学里。所以只要你是用 superpowers 的 implementation，它一定都会交付测试通过的结果给你。

如果没有用 superpowers，那就可以自己告诉 LLM。

### 其它

#### 截图调试

遇到 UI 错误时，直接将截图粘贴到终端，Claude 可以结合视觉信息定位问题。

#### CLI > MCP

Claude 处理成熟 CLI 工具的能力极强。尽量不要去依赖不稳定的 MCP 服务器。
- gh：管理 GitHub repo
- kubectl：管理 k8s 资源
- az：管理 Azure Cloud 资源
