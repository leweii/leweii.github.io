---
title: ChatSurvey
subtitle: AI 驱动的问卷设计与分析平台
category: product
order: 3
status: 已上线
description: 用自然语言对话生成专业问卷，分享链接收集答案，再用 AI 助手分析数据。
date: 2025-11-01
tags: [ai, survey, nextjs]
icon: /assets/img/projects/chat-survey/icon.svg
cover:
link: https://ct-online-survey.vercel.app/
repo: https://github.com/leweii/ct-online-survey
---

## 简介

用一段自然语言描述你的问卷需求，AI 助手就能生成一份 21-28 道题的完整专业问卷，自动选择合适的题型并安排逻辑流转。问卷分发后再换一个 AI 分析师角色，用对话方式回答你关于数据的问题。

## 功能亮点

- **AI 出题** — 自然语言描述需求，自动生成完整问卷
- **11 种题型** — 文本、单选、多选、下拉、量表、滑块、是非、日期、数字、邮箱、电话
- **轻量分发** — 4 位短码（如 `A7B2`）+ 直链分享，移动端友好
- **管理后台** — 问卷生命周期（草稿 → 发布 → 关闭）+ 一键复制链接 + CSV 导出
- **AI 分析助手** — 自然语言提问，如「完成率多少？」「第 3 题的评分分布如何？」「Q1 和 Q2 的回答之间有什么相关性？」
- **中英双语** — 自动检测浏览器语言

## 技术栈

Next.js 14 + TypeScript 5 + Tailwind + Supabase + SST，Vercel 部署。
