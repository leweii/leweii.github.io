---
title: Skill Viewer
subtitle: Claude Code 技能浏览器扩展
category: product
order: 1
status: 已上线
description: 在 GitHub 仓库页面侧栏自动识别 Claude Code 技能，并用 AI 给出 2-3 句话摘要。
date: 2025-10-01
tags: [chrome-extension, claude-code, ai]
icon: /assets/img/projects/skill-viewer/icon.png
cover:
chrome: https://chromewebstore.google.com/detail/skill-viewer/cbmmcokkchdobijpdgppphlknfceokhb
repo: https://github.com/leweii/skill-viewer
---

## 简介

Skill Viewer 是一个 Chrome 扩展，在任意包含 Claude Code skills 的 GitHub 仓库页面上自动注入右侧栏。它会扫描 `.claude/skills/` 或 `skills/` 目录下的技能定义，调用 LLM 生成简洁摘要，让浏览者无需进入源码就能理解每个 skill 在做什么。

## 功能亮点

- **自动检测** — 自动发现 `.claude/skills/` 或 `skills/` 目录下的技能
- **AI 摘要** — 每个 skill 2-3 句话的功能概览
- **云端服务** — 内置云端 API，无需自带 API key
- **多 LLM 提供商** — 也可接入自己的 Gemini / OpenAI / Claude key
- **可拖拽侧栏** — 250-600px 宽度自定义
- **8 种语言** — 英文、简中、繁中、日文、韩文、西、法、德
- **暗色模式** — 跟随浏览器偏好
- **SPA 支持** — 适配 GitHub 单页导航

## 技术栈

Chrome MV3 + Node.js API（Vercel 部署）+ 多 LLM provider 抽象。
