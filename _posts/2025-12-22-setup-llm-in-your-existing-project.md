---
title: "Openspec 实操，十分钟搭建slack to llm集成"
date: 2025-12-08 00:00:00 +0000
categories: [ai, openspec, gemini]
tags: [ai, openspec, gemini]
published: true
---

当前，vibe coding 或者sdd 很适合做小项目。今天就上手做一个。项目叫·just-ask·

## 开始claude coding 吧

`claude --dangerously-skip-permissions`

```shell
╭─── Claude Code v2.0.76 ─────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                 │ Tips for getting started                                              │
│               Welcome back Jakob!               │ Run /init to create a CLAUDE.md file with instructions for Claude     │
│                                                 │ Note: You have launched claude in your home directory. For the best … │
│                   * ▐▛███▜▌ *                   │ ───────────────────────────────────────────────────────────────────── │
│                  * ▝▜█████▛▘ *                  │ Recent activity                                                       │
│                   *  ▘▘ ▝▝  *                   │ No recent activity                                                    │
│                                                 │                                                                       │
│   Opus 4.5 · API Usage Billing · Wonder Group   │                                                                       │
│                 /Users/JakobHe                  │                                                                       │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
>
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  ⏵⏵ bypass permissions on (shift+tab to cycle)
  
```

### 第一步: openspec 安装+初始化

安装:
`npm install -g @fission-ai/openspec@latest`

初始化项目:

```shell
mkdir 5-just-ask
cd 5-just-ask
openspec init
```

选择claud code

![Image](/2025-12-22-setup-llm-in-your-existing-project/1.jpg)

创建之后，会看到一组项目树被创建出来，其中定义了技术栈，需求，测试用例，代码规范等。这样的内容能够一直被claude 通过agnet.md 指向，被claude作为上下文。

![Image](/2025-12-22-setup-llm-in-your-existing-project/2.jpg)

AGENTS.md

```text
<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->
```

openspec 文件夹目录树:

```
openspec/
├── project.md              # Project conventions
├── specs/                  # Current truth - what IS built
│   └── [capability]/       # Single focused capability
│       ├── spec.md         # Requirements and scenarios
│       └── design.md       # Technical patterns
├── changes/                # Proposals - what SHOULD change
│   ├── [change-name]/
│   │   ├── proposal.md     # Why, what, impact
│   │   ├── tasks.md        # Implementation checklist
│   │   ├── design.md       # Technical decisions (optional; see criteria)
│   │   └── specs/          # Delta changes
│   │       └── [capability]/
│   │           └── spec.md # ADDED/MODIFIED/REMOVED
│   └── archive/            # Completed changes
```

### 第二步: openspec 需求定义（需求变更）

进入claude code，开始定义你的项目吧，我今天要做的是把gemini 3 集成到slack bot 的工作，于是我输入了一下信息。

```text
I like to develop an integration app that I can connect google gemini 3 llm into my slack chat bot
I have slack app OAuth Tokens and gemini api key

complete the openspec doc base on this requirement
```

这个时候，Claude code 开始巴拉巴拉的工作了，它这个时候不会实现任何代码，而是开始修改一系列的文档，其中project.md 开始定义

```text
# Project Context

## Purpose
A Slack integration application that connects Google Gemini LLM to Slack chatbot, enabling AI-powered conversations directly within Slack channels and direct messages.

## Tech Stack
...

## Project Conventions

### Code Style
...
### Architecture Patterns
...

### Testing Strategy
...

### Git Workflow
...

## Domain Context
...

## Important Constraints
...

## External Dependencies

```

changes 文件夹也新建了一个文件，放入了proposal.md 和 design.md

- design.md: 是一整个推理过程，让每个决策都有源可寻。
- proposal.md: 是一个task 清单，用于记录拆解的任务和实现任务的状态。

我们这一步要做的一件很重要的事情就是，review 所有的文档，确保项目使用了你期待使用的技术栈，确保一切都符合你的逻辑，是否还有需求遗留等等等等。

![Image](/2025-12-22-setup-llm-in-your-existing-project/3.jpg)

### 第三步: 实现需求

只需要给claude code 发送：

`开始实现需求吧`

它就又开始一顿布拉布拉的操作。

结束之后，它会更新proposal.md文档

![Image](/2025-12-22-setup-llm-in-your-existing-project/4.jpg)

我们也可以通过一些openspec的命令查询剩余的任务

`openspec list`

### 第四步: 测试，循环反复proposal + implementation

这时候就可以运行看看它的实现，是否符合你的需求呢？

如果有什么不符合的地方，让它给你fix，如果有什么需求不够符合你需求的，复杂的情况就用proposal + implement 步骤，如果简单的话，一句话就能修复了。

### 第四.1步: 如果有问题，我会让它打日志，让它修复

![Image](/2025-12-22-setup-llm-in-your-existing-project/5.jpg)

### 第五步: archive 变更

如果一个项目执行过久，你会发现太多change 清单，你可以通过简单的命令归档它们：
`openspec archive xxx`

## 看看成果

我的项目很简单，大概不到二十分钟就调试畅通，花了一些时间配置slack app

大致效果就是，安装app的 slack workspace 可以跟我的应用对话，获得ai聊天的终极体验。

### 1. run

`npm run dev`

![Image](/2025-12-22-setup-llm-in-your-existing-project/6.jpg)

### 2. chat

![Image](/2025-12-22-setup-llm-in-your-existing-project/7.jpg)


## 我的感受

现在的llm 编程工具，结合一些好的实践，是能够开发出较为复杂的的项目的。

比如我们在模块划分上动点脑筋，在需求拆分上动点脑筋，在文档管理上动点脑筋，llm的那些token 窗口问题，幻觉问题，都不再是什么大问题。

我用类似的方法开发了一个模块化的，相对复杂的自动化测试工具，在这个类似postman 的软件体量下，llm coding works will！不过这件事烧了我（公司）500刀🤫。下次有机会着重介绍给大家玩玩。

![Image](/2025-12-22-setup-llm-in-your-existing-project/8.jpg)