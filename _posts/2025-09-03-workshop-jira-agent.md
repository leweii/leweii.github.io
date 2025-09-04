---
title: "AI Agent Workshop - Jira Agent，一个成熟的服务器端agent"
date: 2025-09-03 00:00:00 +0000
categories: [ai, agent]
tags: [ai, agent, adk]
published: true
description: 分析一个成熟的产品
---

## 意外的发现
今天无意点开了jira 的agent配置页面，抱着试一试的态度开始了我的配置。 配置结束之后，我意识到，Jira 已经是下一个level了。

如果有人要开发服务器端agent，我给的建议是，照着抄。

## 创建一个agent

atlassian 允许你通过简单的流程创建一个自己的agent，很妙对吧，让你的agent只拥有你需要它拥有的知识。

### 第一步：输入提示词
如果是小白开始创建自己的agent，它会给你一个简单引导：
告诉它你希望它能做什么？

看得出来，这个flow就是一个简单的agent，它能通过客户的提示词来分析意图，自动定义
- Name
- Description
- Instructions
- Conversation Starters：一些用户初始的引导

> 给人的启发是，以后我们创建任何类型的数据集，都可以以此为参考，比如我要创建一个“工单“,在接受简单的描述之后，它就能根据这些信息把对应的字段填充完毕，有些时候设置要连assign 给谁都分配好。

![Image](/2025-09-03-workshop-jira-agent/1.png)

### 第二步：定义scope

agent scope 包含
1. workspace/knowledge
2. tools

![Image](/2025-09-03-workshop-jira-agent/2.png)

### 完成

我原本以为，这样的一个agent 需要一定的发布时间，实则不然，它只是启动了一个虚拟机。几秒之后，我就能使用这个agent了。

## 开始使用

在任何jira 或者confluence 页面，点开右上角的Rovo chat，你就能操作自己定义的agent，和atlassian内置的通用agent。

自己定义的agent适合处理特定垂直领域的知识，比如我们可以让他帮忙寻找某个概念的出处，并列出所有相关的文档。

它还内置了很多企业管理所需要的模板agent，比如
- OKR Generator
- global translator
- work item planner, 自动拆分jira ticket

### 交互

1. 抽屉式
2. jira 全局统一的通用ui展示
3. 可以轻松的访问atlassian数据，比如@someone，精确的查找对应的数据
4. 其它所有agent 都有的东西，比如stop，流式输出，history

![Image](/2025-09-03-workshop-jira-agent/4.png)

## 可能的实现原理
我看不出它用了什么llm，但是看得出效果很好。

我看不出它是否有对我所定义的知识库做了向量处理，我觉得应该没有，因为atlassian里的数据是非常动态的。

它应该是通过tools 对文档进行的一系列读写总结的操作。

它一定是利用了a2a，因为我所启动的agent能力

它背后运行的agent 框架值得我们深入讨论。

## 实际使用感受

1. 10min 的创建流程
2. 检索企业文档
3. 能够溯源知识
4. 优秀的交互过程

单纯有这几点的agent，还要什么自行车？

何况atlassian集合了jira + confluence 两个产品线，这两个产品里面的数据，全是公司的垂直领域知识，能解锁巨大的实用空间。

## 问题
当然，使用过程中，我也发现几个问题
1. 权限问题，我肯定能通过这个agent 绕过我的权限，读取到一些我读取不到的文件。
2. 幻觉问题，不能全信它的结果，必须多一步factor check。
3. 边界幻觉问题，我虽然没有给它分配jira的操作权限，但是它还是认为它自己能操作jira，并且给我很多非常confuse 的回复。

当然我要故意捉弄它，使用效果肯定很差，但是实际情况是，我们的产品大爱这款agent

![Image](/2025-09-03-workshop-jira-agent/3.png)

## 对照自己的产品

我认为，jira agent rovo chat 是一个非常有参考价值的产品，它回答了一个困扰我已久的问题，我们为什么要自己开发自己的agent。

agent 开发一定要落实到每个团队，因为每个团队所需要的agent 是截然不同的。

长远的看cookbook，我们应该有一个cookbook mcp服务，允许用户注册一个自己领域范围的agent，比如：
- finance team: 在cookbook 只管理cost，attribute，那么他只需要注册编辑cost，编辑attribute tool即可。
- nutrition team: 在cookbook 关心原料数据维护，那么他就只需要注册nutrition review管理相关的tool

这个方案很好的解决了agent 边界不清晰，过多tools带来的幻觉问题。

我们迟早要经历，从一个单纯的agent 开发，需要过渡到agent 注册平台的开发。