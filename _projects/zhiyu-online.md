---
title: 知鱼Online
subtitle: AI 知识伴侣
category: product
order: 2
status: 已上线
description: 浏览器扩展。读过的网页自动变成知识卡片，下次浏览相关页面时旧卡片自动浮现，还能一键注入到 ChatGPT 或 Gemini 对话框。
date: 2025-09-01
tags: [chrome-extension, ai, knowledge-management]
icon: /assets/img/projects/zhiyu-online/icon.png
cover:
chrome: https://chromewebstore.google.com/detail/eobilomakdggnhimmkokhomcphpkcnon?utm_source=item-share-cb
firefox: https://addons.mozilla.org/en-US/firefox/addon/knowing-you/
repo: https://github.com/leweii/zhiyu-online
---

## 收藏夹的问题，它来解

收藏了几十篇文章，过两周就再也想不起里面写了什么。知鱼把读过的网页自动拆成结构化知识卡片，下次你浏览相关页面时，旧卡片自己浮上来，不用你回去翻收藏夹。

## 三步闭环

1. 抓取：在任意网页点扩展，一键提取正文。规则预筛会先过滤掉登录页、搜索结果、低内容页，避免浪费 AI 调用
2. 拆解：AI Agent 输出三件东西，大纲、精炼正文、10 个关键专业概念，组成一张知识卡片
3. 浮现：浏览新页面时，TF-IDF 评分自动从你的知识库里挑出最相关的旧卡片推送到侧栏

## 与 ChatGPT 和 Gemini 联动

最常用的场景：和 ChatGPT 或 Gemini 聊天时，从知识库选几张卡片，一键注入到对话框作为上下文。等于把你过去几个月的阅读变成了私人 RAG，不用复制粘贴、不用切窗口。

## 还有这些细节

- 三家 AI 自由切换：Claude、Gemini、GPT，按用户或按系统级配置
- WebSocket 实时推送抓取完成和新的推荐结果
- Auth0 PKCE 登录，知识库跟着账号走
- 中英双语 UI

## 立刻试试

Chrome 商店或 Firefox Add-ons 一键安装。装好后正常浏览即可，扩展会在后台慢慢建立你的知识库。
