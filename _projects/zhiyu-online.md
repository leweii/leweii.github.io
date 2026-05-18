---
title: 知鱼Online
subtitle: AI 知识伴侣
category: product
order: 2
status: 已上线
description: Chrome 扩展 + Serverless 后端，把被动的网页浏览转化为主动的个人知识库。AI 自动提取、组织、在浏览时主动浮现相关知识。
date: 2025-09-01
tags: [chrome-extension, ai, knowledge-management]
icon: /assets/img/projects/zhiyu-online/icon.png
cover:
chrome: https://chromewebstore.google.com/detail/eobilomakdggnhimmkokhomcphpkcnon?utm_source=item-share-cb
firefox: https://addons.mozilla.org/en-US/firefox/addon/knowing-you/
repo: https://github.com/leweii/zhiyu-online
---

## 简介

知识工作者每天收藏几十篇文章，却很少重新打开或真正应用。ZhiyuOnline 用三段流水线闭合这个缺口：

1. **Capture** — Chrome 扩展一键提取页面内容
2. **Decompose** — AI Agent 生成结构化知识卡片（大纲、精炼文本、关键概念）
3. **Match** — TF-IDF 评分在浏览新页面时主动浮现相关卡片

## 技术栈

| 层 | 技术 |
| --- | --- |
| Extension | React 18, Vite, CRXJS, Tailwind CSS 4, Chrome MV3 |
| Backend | Hono, Vercel AI SDK, Zod, tsup |
| AI Providers | Anthropic (Claude), Google (Gemini), OpenAI (GPT) |
| Infrastructure | AWS CDK, Lambda (Node 20), DynamoDB, API Gateway, S3 |
| Auth | Auth0 (PKCE flow for Chrome extension) |
| Monorepo | npm workspaces (`server`, `plugin`, `infra`) |

## 项目结构

`server/` Hono API + Lambda、`plugin/` Chrome 扩展、`infra/` AWS CDK 基础设施、`docs/` 静态落地页（中英双语）。
