---
title: Skill Viewer
subtitle: Claude Code 技能浏览器扩展
category: product
order: 2
status: 已上线
description: 打开任意带 Claude Code skills 的 GitHub 仓库，右侧栏自动列出所有 skill 并给出 AI 摘要。免登录免 key 即可用，支持 8 种语言。
date: 2025-10-01
tags: [chrome-extension, claude-code, ai]
icon: /assets/img/projects/skill-viewer/icon.png
cover:
chrome: https://chromewebstore.google.com/detail/skill-viewer/cbmmcokkchdobijpdgppphlknfceokhb
repo: https://github.com/leweii/skill-viewer
---

## 不点进源码就能看懂每个 skill 在干嘛

Claude Code 的 skill 越来越多，但 GitHub 上看到一个 skills 仓库，往往要点进每个 `SKILL.md` 才知道它能做什么。Skill Viewer 把这一步省掉：打开任意 GitHub 仓库，自动扫描 `.claude/skills/` 或 `skills/`，在右侧栏列出所有 skill，每个配 2-3 句话的 AI 摘要。点一下展开看详情，决定要不要装。

## 装上就能用，不用配 API key

- 内置云端服务：登录 GitHub 或 Google 账号即可使用，免费档每天 5 次摘要，Pro 一次性 9.99 美元换终身 50 次/天
- 命中缓存不计配额，同一 skill 在同一语言下 7 天内只算一次
- 也可以填自己的 key：Gemini、OpenAI、Claude 任选一家，云端配额用完会自动回落到你的本地 key

## 浏览体验细节

- 自动识别 GitHub SPA 跳转，切换仓库不用刷新
- 侧栏宽度 250-600px 拖拽自适应
- 暗色模式跟随系统
- UI 与摘要语言分别可配：界面用英文、摘要看中文，或反过来都行
- 支持 8 种语言：英文、简中、繁中、日文、韩文、西、法、德

## 适合谁

经常在 GitHub 上找 Claude Code skill、想快速判断一个仓库里的 skill 值不值得装、或者维护自己的 skill 仓库想给访客一个清晰入口的人。Chrome 商店一键装，MIT 开源。
