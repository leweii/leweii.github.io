---
title: "Agentic Coding Tool Tip (Based on Claude Code)"
description: "Claude Code 实用技巧：从配置优化、记忆管理到 Spec-driven 开发工作流"
create_time: 2026-01-05 00:00
tags:
  - tech
published: true
---

咸盐少许，直奔主题

## 配置

### 尽量使用性能最好/预算内，最贵的模型

虽然 Claude Sonnet 4 计费是 Opus 的 1/5，但在处理极高难度的逻辑时，Claude Opus 4.5 依然是目前最强大的选择。有条件的朋友，建议直接用最贵的模型。节约的是自己的时间。

### 跳过授权，--dangerously-skip-permissions

频繁的权限确认动作会打断思路（会很烦）。启动时添加 `--dangerously-skip-permissions` 参数，可以让 Claude 无需询问直接执行操作。

### 常用快捷键

| 快捷键 | 功能 |
|--------|------|
| `!` 前缀 | 直接执行 bash 命令（如 `! git status`） |
| `Esc` 双击 | 回退到上一个检查点 |
| `Ctrl+R` | 反向搜索历史 prompt |
| `Ctrl+S` | 暂存当前输入 |
| `Shift+Tab` 双击 | 进入 Plan Mode |
| `Tab` / `Enter` | 接受建议 |

### activate deep thinking

关键词 think、think hard 或者 ultrathink 可以增加 Claude 的思考预算。当然 token 消耗也会越多。

### Plan Mode

按两次 `Shift+Tab` 进入 Plan Mode。在此模式下，Claude 可以读取文件、搜索代码、分析架构，但不会执行任何修改操作。它会生成一份实施计划供你审阅，只有在你批准后才会开始执行。

适用场景：重构、架构变更、复杂功能开发前的规划。

## 环境

### 管理好你的 CLAUDE.md

**加载机制**：

Claude Code 会分级加载你的 CLAUDE.md，从当前目录往上加载，直到根目录。

依据此特性，我们可以分级配置，全局 -> 项目级 -> 模块/目录级 CLAUDE.md

**Best Practices**：[https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices](https://platform.claude.com/docs/zh-CN/agents-and-tools/agent-skills/best-practices)

**保持小而精**

默认假设：Claude 已经非常聪明

只添加 Claude 没有的上下文。质疑每一条信息：

- "Claude 真的需要这个解释吗？"
- "我能假设 Claude 知道这个吗？"
- "这段落值得它的令牌成本吗？"

**设置适当的自由度**(不要过度抽象，也不要过度具象你的任务)

将具体程度与任务的脆弱性和可变性相匹配。

**命名约定**

使用一致的命名方式。

好的命名示例：动名词形式
* processing-pdfs
* analyzing-spreadsheets
* managing-databases
* testing-code
* writing-documentation

等等等等，我会另起一个blog 来讨论skill 的维护。

**利用好`/init`**
当你开始在某个项目工作，可以用此命令生成对应的Claude.md文件。

### 记忆/会话

**会话管理命令**

| 命令/操作 | 功能 |
|-----------|------|
| `/clear` | 重置当前会话 |
| `/resume` | 恢复历史会话 |
| `/rename` | 命名当前 session |
| `/export` | 导出整个会话为 markdown |
| `/memory` | 修改或添加 memory |
| `Esc` 双击 | 拉取历史消息 |
| `@Mentions` | 直接引用文件作为上下文 |

**长期记忆（文件系统）**

通过 CLAUDE.md 管理长期记忆：
- 可利用 claude 引用，获取多级系统配置信息
- 可配置框架、规范、工作流、工作要求，详见 `Spec driven development`
- 全局配置：在 `~/.claude/CLAUDE.md` 中添加通用指令（如「每次请用中文回答我」）

### 自定义cmd/skills

- 将高频的简单流程保存成可重复使用的 prompt 文件
- 将高频的工作流、复杂任务，开发成 skill 
- 不停地根据业务的变化和需求的变化，迭代你的 prompt 和 skills
- 在github上维护你的prompt 和skill

## 工程

### Spec driven development

利用 SDD 框架工具，开发复杂程序。

使用 spec driven development 实践，可以解决团队协作、规范不统一的问题，还能解决长任务执行、注意力发散的问题。

**superpowers**

如果是简单的需求，可以用 `/superpowers:brainstorm` + write-plan + execute-plan。

我很喜欢 brainstorm，就像有一群人在为你出谋划策一样。

**openspec**

如果是相对复杂的需求，可以用 openspec。

**spec-kit**

如果是一个从 0 到 1 的项目，并且希望能够对项目有完全的掌控，可以尝试 spec-kit。（我尝试过，但是由于需要定义的文档内容过多放弃了）

### 利用 Git Worktrees 并行任务

Git Worktrees 允许你在同一个 repo 下创建多个独立的工作目录，每个目录可以 checkout 不同的分支。

```bash
git worktree add ../feature-auth feature/auth
git worktree add ../feature-api feature/api
```

结合 Claude Code，可以在不同的 worktree 中启动独立的 session，让多个任务并行推进，互不干扰。适合需要同时开发多个独立功能的场景。

### Test-Driven Development

用 AI 写代码，一定要让它自论证，TDD 就显得格外适应 AI 时代的编程模式，这写在 superpowers 的哲学里。所以只要你是用 superpowers 的 implementation，它一定都会交付测试通过的结果给你。

如果没有用 superpowers，那就可以自己告诉 LLM。

## 其它

### 关注用量
- `/stats`
- `/usage`

### CLI better than MCP

Claude 处理成熟 CLI 工具的能力极强。尽量不要去依赖不稳定的 MCP 服务器。
- gh：管理 GitHub repo
- kubectl：管理 k8s 资源
- az：管理 Azure Cloud 资源

### 更多！

以下是一些更高级的功能，后续会单独撰文介绍：

| 主题 | 说明 |
|------|------|
| Sub-agent | 专门化的子代理，拥有独立的 200k context，可并行执行 |
| Skill | 将复杂工作流封装成可复用的技能包 |
| Plugin | 打包 commands、skills、hooks、MCP servers 的完整解决方案 |
| Headless mode | 非交互模式，适合 CI/CD 集成（`claude -p "..."`） |
| Hooks | 生命周期事件处理，如 PreToolUse、PostToolUse |

---

#### ref
[https://adocomplete.com/advent-of-claude-2025/](https://adocomplete.com/advent-of-claude-2025/)