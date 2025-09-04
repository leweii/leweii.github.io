---
title: "AI Agent Workshop - Atlassian Rovo Chat，一个成熟的服务器端Agent"
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

这个流程，很好的帮助用户明确了agent 的scope

### 第一步：输入提示词
如果是小白开始创建自己的agent，它会给你一个简单引导：
告诉它你希望它能做什么？

看得出来，这个flow就是一个简单的agent，它能通过客户的提示词来分析意图，自动定义
- Name
- Description
- Instructions
- Conversation Starters：一些用户初始的引导

> 给人的启发是，以后我们创建任何类型的数据集，都可以以此为参考，比如我要创建一个“工单“,在接受简单的描述之后，它就能根据这些信息把对应的字段填充完毕，有些时候设置要连assign 给谁都分配好。

![Image](/2025-09-03-atlassian-rovo-chat/1.png)

### 第二步：定义scope

agent scope 包含
1. workspace/knowledge
2. tools

![Image](/2025-09-03-atlassian-rovo-chat/2.png)

### 完成

我原本以为，这样的一个agent 需要一定的发布时间，实则不然，它只是保存了一系列agent运行所需要的配置。

当用户第一次连接上agent时，这个agent作为一个线程，启动在后台。从配置到完成配置不到10分钟，从保存到开始使用，不到20s。

> 给我们的启示是multiple agent，一个服务应该运行无限多个agent，Alex 创建了一个a agent，Bob创建了一个b agent，他们只在有人启动聊天的时候才运行，在没人聊天的时候销毁。

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

![Image](/2025-09-03-atlassian-rovo-chat/4.png)

还有一个很有意思的点，值得所有平台式的agent 学习，他能搜索指定的用户，以类似mention @ 的形式来与agent 沟通关于人的具体事项。

我们在开发agent的过程中，常常遇到幻觉，公司单单叫felix的人就有20+，每次我们都要不停的与agent 强调，一定要根据用户tool来获取用户信息。

有了jira @ someone 的功能，只要用户习惯养成，就能很好的规避这个方面可能造成的幻觉问题。

## 可能的实现原理
我看不出它用了什么llm，但是看得出效果很好，盲猜chatGPT-5。

感觉没有对数据做向量处理，因为atlassian里的数据是非常动态的。

如果是我，我会用serverless，第一次用户请求的时候创建agent，最后一个用户断开的时候销毁agent

看到一篇热乎的aws blog [Effectively building AI agents on AWS Serverless](https://aws.amazon.com/blogs/compute/effectively-building-ai-agents-on-aws-serverless/)

![Image](/2025-09-03-atlassian-rovo-chat/5.png)

## 实际使用感受

1. 10min 的定制流程
2. 检索垂直领域知识
3. 能够溯源
4. 优秀的交互过程

有一个能做到这么几点的agent，还要什么自行车？

何况atlassian集合了jira + confluence 两个产品线，这两个产品里面的数据，全是公司的垂直领域知识，能解锁巨大的实用空间。

## 问题
当然，使用过程中，我也发现几个问题
1. 权限问题，我肯定能通过这个agent 绕过我的权限，读取到一些我读取不到的文件。
2. 幻觉问题，不能全信它的结果，必须多一步factor check。
3. 边界幻觉问题，我虽然没有给它分配jira的操作权限，但是它还是认为它自己能操作jira，并且给我很多非常confuse 的回复。

当然我要故意捉弄它，使用效果肯定很差，但是实际情况是，我们的产品大爱这款agent

![Image](/2025-09-03-atlassian-rovo-chat/3.png)

## 对照自己的产品

我认为，jira agent rovo chat 是一个非常有参考价值的产品，它回答了一个困扰我已久的问题，我们为什么要自己开发自己的agent。

agent 开发一定要落实到每个团队，因为每个团队所需要的agent 是截然不同的。

长远的看cookbook，我们应该有一个cookbook mcp服务，允许用户注册一个自己领域范围的agent，比如：
- finance team: 在cookbook 只管理cost，attribute，那么他只需要注册编辑cost，编辑attribute tool即可。
- nutrition team: 在cookbook 关心原料数据维护，那么他就只需要注册nutrition review管理相关的tool

这个方案很好的解决了agent 边界不清晰，过多tools带来的幻觉问题。

我们迟早要经历，从一个单纯的agent 开发，需要过渡到agent 注册平台的开发。

#### references
- [Self-hosting AI agents on AWS with Serverless Container Framework v2](https://www.serverless.com/blog/self-hosting-ai-agents-on-aws-with-serverless-container-framework-v2)
- [Serverless AI Agents on AWS: A Small Team’s Quiet Revolution (2025)](https://aws.plainenglish.io/serverless-ai-agents-on-aws-a-small-teams-quiet-revolution-2025-58fb9a68f311)
