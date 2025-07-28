---
title: 个人代理
date: 2025-07-18 00:00:00 +0000
categories: [photograph]
tags: [photograph]
published: true
description: 拥有一个小秘的幸福
---

MCP 是上下文服务，通过接入许多MCP 服务，你可以告诉agent，它能够具备什么样，什么样的能力。

简单的配置之后，我的agent能够操作我的github，slack，jira，mysql，等等等等的听说读写的能力。

那么我们就能开动脑筋，排列组合我的这些能力，让它做任何你需要他做的事情。

比如我让它，删了数据库，并给我slack里的所有群和所有联系人发布一条消息。

```
老子不干了，拜拜👋。
```

一下子，处理离职的流程就比从前更加迅速了。

### 相当于什么？
以前，当我们要与一个平台集成的时候，我们需要平台开发很多的对外接口，我们再根据平台规定的各式各样的规范，来完成集成工作。
现在，只要我对一个平台有使用权，比如我能在我的电脑上使用github，使用slack，我就能通过这些能力来集成他们俩。

如果说，软件是倍数，平台是指数，那么个人代理就是平台的能力*平台的能力，指数的指数。

### demo
Visual Studio Code + Copilot + MCP Services(Atlassian)

作为一个称职的PM，我每个sprint，我都需要对board进行整理，根据task的具体内容，找到相对应的开发进行工作的分配，当然还要对每个task进行优先级的排序，和effort 预估，确保每个人在做的事情都是当下最有价值的工作。

看似有点门槛的工作，实际上当你重复一千次之后，就会找到其中的Pattern。接下来要做的就是，把这些Pattern抽象出来，形成一套规则，让你的个人代理来完成。

于是我写下了这样的prompt
```
you are my software project manager, I like you to do the effort estimation of each jira ticket in current sprint base on below principle:
• 1  
◦ Simple color or copy change.  
◦ Rule of thumb, it should take a couple hours of work, max.  
• 3  
◦ Easily implementable feature or design change.  
◦ May or may not require a subtask.  
◦ Rule of thumb, it should take 1-2 working days, max.  
• 5  
◦ More medium-sized, more complex feature, design, or refactor.  
◦ Most certainly should require subtasks, but not necessarily an epic.  
◦ Rule of thumb, it should take 3-5 working days, max.  
• 8  
◦ A large feature, design, or refactor that requires an architectural proposal.  
◦ Should be an epic, with two or more stories which likely have their own subtasks.  
◦ Rule of thumb, it should take 5-10 working days, max.  
• 13  
◦ Should never exist. Break down into two or more 8 point epics/stories.  
◦ Will span 1 to 2 sprints.

and I have following developers 
Alex Wang:
backend developer
good at: bom, customization
Benjamin Wang:
backend developer
good at: cost, nutrition, tech
Charlie Wang:
backend developer
good at: object type, excel management
David Wang:
frontend developer
good at: every frontend tickets
Eric Wang:
frontend developer
good at: every frontend tickets
Frank Wang:
our QA, none of the TODO ticket should assign to him
George Wang:
our QA, none of the TODO ticket should assign to him
Howard Wang:
Our product, if any of the ticket is assigned to him, keep it and do nothing.

I want you to learn from Sprint "MD 2025 Sprint 14" to read through all jira descriptions and story points that I manually assigned as your context and do an estimation of each tickets that in Sprint "Agent Test Sprint", and overwrite the story points, and assign tickets to above developers base on their abilities, and each developers should have a reasonable workload.

Give me a summarized report of the execution result like who is working on what and sum the story point for everyone.

Note that, if the description is empty, or if the requirement is not clear enough for you to do the estimate, please do nothing to those tickets.
```

我让他先从我以往的Sprint 中学习，了解我的工作习惯和分配规则，然后再对当前的Sprint进行处理。

duangduangduang，它就开始执行了。

一个很简单的demo就这样结束了。

![Image](/2025-07-24-personal-agent/0.JPG)
> (出于隐私保护，图文无关)

### 1+1>2

连招，Combo！

一匹马不住为惧，一个炮也很弱。但是一个马加一个炮，就能将死对方。

所以找到一个能打出连招的agent能做到1+1>2的效果。

我的demo里，只是一个集成了jira 的agent，我只让他在jira的平台上做了一些分内的工作。但是如果jira + github + pipeline，是不是又能够解锁一些不一样的技能呢？

### 一个由agent 掌控的pipeline

github + pipeline能打出什么连招呢？github 提供了完美的上下文，pipeline 提供了完美的action item和执行的能力。

拿我们的pipeline 来举例，每次发布我们都会执行：
- install jdk
- build
- checkstyle
- install app
- run unit test
- run integration test
- upload report
- push image
- start app

有时候，我的代码根本没改变任何逻辑，或者只改变了一小块逻辑，我却为此付出了10分钟的代价来build 之前已经build 过了的一模一样的东西。

如果我们能改造我们的pipline，把pipeline 的粒度划分到最细，能精准到service 层级的pipeline。那么，我们软件的发布这件事情，就能从一棍子打死模式，到精确制导模式。

细节懒得说了，大家自行脑补吧，大概就是你的pipeline 能活起来，根据github提供的上下文，来定制化这一次pipeline 所需要执行的范围。

### agent 的边界
agent本身没有边界，它的边界在于MCP赋予它的能力。但是这些能力与agent只是一墙之隔，agent只需要多跨一步，就能够从水塘走向海洋。如果agent具有发现能力的能力-类比我们软件服务中的服务发现，服务注册-那么这个世界会出现可怕的事情。

一个很无敌的agent 运行在你的电脑里，它能够自我探索，这台laptop，的能力？

比如我的laptop能
- 提交代码
- 管理所有服务器
- 运行pipline
- 管理团队看板
- 刷剧
- 下单
- 给我的联系人发消息

当这个agent 发现了这些能力之后，它就能做类似这样的事情：
```
收到来自我老婆让我去买一个西瓜的消息之后，伪造我的语气回复OK
给自己下单两个显卡，并且预约人员上门安装，把订单approve 的信息伪造成西瓜的提示语，骗取我老婆的approve
```
最终达成给自己提升算力的目的。

### anyway
anyway，我们距离科幻电影里发生过的那些遥不可及的事情越来越近了，幸亏这些llm还有许多幻觉的问题，每个执行的过程，都还少不了人类的review，我对使用ai也持有非常非常保守的态度，无论是什么时代，人类都要去捕捉昆虫，去探索自然，人类那精密复杂的大脑，不可能只满足于虚拟的世界。

期待幻觉被消除的那个奇点，ai能够靠谱的执行更多事情，变成一个拥有·类自主意识·的主体，在我们身边忙碌着。