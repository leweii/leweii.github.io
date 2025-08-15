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

- 探索市面上的agent框架，深入探索各自的优缺点。
- 继续探索ai agent可落地性和可用性的边界，ai模糊了很多边界，现在投资人觉得什么都能做，开发人觉得到处都是坑，我特别好奇，一个ai agent的想法，究竟有多少内容是可以落地的，落地还是第一步，我也特别好奇，有多少ai项目能持续在生产上给公司带来价值？
- 借workshop开发的契机与参与者共同交流。

## principle

- 不排除使用任何可接触到的技术。
- 尽量多的尝试，从广度上覆盖跟多agent框架的实现。
- 不计cost成本。
- 三个月内可落地。

## idea

一个 devops agent，初步想法如下
pipeline 部分：
- 自动识别module，根据module对项目pipeline 进行编译和发布
- 自动根据运行中的job，优化pipeline资源分配，比如同一个pipeline在运行多个的时候，自动停止正在进行中的，代码分支较旧的pipeline run
- 自动根据公司的规则，提交interface version increase pr
- 自动升级依赖的其它module

运维部分：
- monitoring发现oom alert时，自动提交资源升级pr，并自动apply
- NPE时，自动提交代码修复pr，并自动merge+自动build

## 初步分析
### llm
因为涉及一些编程的工作，至少编程部分的llm 我们可以使用Claude Sonnet 4 or some others（截止2025 aug）

### tools
- monitoring
- github
- pipeline
- k8s

至于memory 和planning pattern，我们需要具体实现的时候依情况而定。

一点点私货是，这样的一个agent跟UI无关，或者关系不大，我作为一个后端开发，有效的避开了自己的短处。

## 先盐少许
后面的话题我也已经想好啦
- 技术栈选型的思考
- ReAct 源码对比

感觉自己在做tiktok产品agent 框架评测呢哈哈哈。