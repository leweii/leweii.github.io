---
title: ChatSurvey
subtitle: AI 驱动的问卷设计与分析平台
category: product
order: 3
status: 已上线
description: 一句话生成 21-28 道专业问卷，4 位短码分享，再用 AI 分析师对话查数据。免注册、自动多语言、可自托管。
date: 2025-11-01
tags: [ai, survey, nextjs]
icon: /assets/img/projects/chat-survey/icon.svg
cover:
link: https://ct-online-survey.vercel.app/
repo: https://github.com/leweii/ct-online-survey
---

## 一句话生成完整问卷

输入一句话需求，比如「科技公司员工满意度调研」，AI 几秒内产出一份 21-28 道题的专业问卷：自动选题型、自动分组（基本信息、使用体验、满意度、改进建议）、自动避免引导性表述。题多了删两题就行，比从零写问卷快几十倍。

## 不是看图表，而是问 AI 分析师

问卷发布后切到 AI 分析师角色，用自然语言直接问数据：

- 完成率多少？哪一题流失最多？
- 第 3 题的评分分布如何？平均分是多少？
- Q1 选「满意」的人，在 Q5 上的回答倾向是什么？
- 帮我筛出评分小于 3 且写了文字反馈的人

AI 通过 typed tools 真实查询数据库（概览、单题统计、条件筛选、交叉分析），返回的是基于实际数据的结论，不是凭空编造的数字。

## 为什么会想用它

- 一段话生成完整问卷，省掉「设计问卷」这件事
- 11 种题型覆盖几乎所有问卷场景：文本、单选、多选、下拉、量表 1-5、滑块 0-100、是非、日期、数字、邮箱、电话
- 4 位短码（如 `A7B2`）+ 直链双通道分享，可口头报、可打印、可贴二维码
- 用 Administrator Name 直接管理，免注册、免登录
- 自动检测语言：中文描述出中文问卷，英文描述出英文问卷
- 草稿到关闭的生命周期管理，一键复制链接，CSV 导出原始数据

## 自托管也很轻

Next.js 14 + Supabase + Google Gemini，MIT 协议。Vercel 部署、Supabase 免费档就能跑起来，只需要三个环境变量。

```bash
git clone https://github.com/leweii/ct-online-survey.git
npm install && npm run dev
```
