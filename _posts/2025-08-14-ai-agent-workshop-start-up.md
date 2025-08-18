---
title: "AI Agent Workshop - 开始"
date: 2025-08-14 00:00:00 +0000
categories: [ai, agent]
tags: [ai, agent, adk, spring-ai, langChain]
published: true
description: finding these resources is very helpful
---

百闻不如一练，今天我就开始我的ai agent workshop。本篇文章着重分享我的想法。

## purpose

- 探索和比较市面各种agent的能力和实现效果。
- 探索ai agent可落地性和可用性的边界。
- 借助workshop开发的契机与参与者共同交流，保持与ai行业上的联系。
- 探索如何测试基于ai开发的项目。

## principle

- 三个月内可落地。
- 不排除使用任何可接触到的技术。
- 尽量多的尝试，从广度上覆盖跟多agent框架的实现。
- 不计cost成本。

## idea
DevOps Agent需要支持两部分功能。能够覆盖公司日常工作。

Operation feature
- 通过自然语言，对低环境进行发布操作
- 根据代码改动，对module进行编译和发布
- 自动根据公司的规则，提交interface version 递增pr
- 自动升级所依赖的其它interface

Development feature
- NPE时，自动提交代码修复pr，并自动merge+自动build

Setup workflow
- 用户友好的设置流程，通过对话形式收集tools配置信息


## 初步分析
### llm 支持
因为涉及一些编程的工作，编程部分的llm 可以使用Claude Sonnet 4 or some others（截止2025 aug）
可尝试multiple llm agent

### tools开发
至少需要支持以下tools
- Monitoring alert tools
- Github tools
- Pipeline tools

Workflow/ Human in the loop 开发
- 需要支持简单的workflow 支持Human in the loop

至于memory 和planning pattern，我们需要具体实现的时候依情况而定。
一点点私货是，这样的一个agent跟UI无关，或者关系不大，我作为一个后端开发，有效的避开了自己的短处。

## 先盐少许
后面的话题我也已经想好啦
- 技术栈选型的思考
- ReAct 源码对比

感觉自己在做tiktok产品agent 框架评测呢哈哈哈。