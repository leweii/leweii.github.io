---
title: "Claude 使用技巧 - sub agent"
date: 2025-09-30 00:00:00 +0000
categories: [ai, agent]
tags: [ai, agent]
published: true
description: 又来用工程的方式解决问题了！
---

如我们一直讨论的，当我们引入过多的tools，或者过渡依赖某**一个**通用的，泛化的agent，就会遇到许多注意力不集中，tools相互干扰的问题。

与其使用**一个**agent，不如预设多个垂直领域的agent，让各自的agent只处理某个垂直领域的问题，这样，我们能够很好的控制边界，让自己最经常使用的业务场景变得可控。

其额外的好处是，
1. 节约token，只有在特定的agent下会引用特定的tools。
2. 预设，也就是保存好自己常用的agent prompt。

这篇文章，就分享一个在claude里，预设sub-agent的过程。

## lets go!

应用场景：
假设，我希望我有一个agent，能够帮我处理一些每天需要重复的事情，比如，拉去最新的代码，打开我所需要的工作网页，并且summarize 我jira里的todo list。

在此期间，我可以惬意从容的拿起我的杯子，走到公司的茶水间，跟同事问一个早安，而我的agent还在我的工位上，默默的做着以前我凭着肌肉记忆在做的事情。

我可以定义：
1. github pull agent
2. jira agent
但是这样设定就过于低估llm的能力了，一个2025年发布的主流llm，完全能够区分什么时机需要执行git pull，什么时候要执行mkdir。所以，过于细粒度的agent划分，也是没有必要的。

基于这个需求，我的sub-agent会划分为：
1. command line execute agent
2. browser agent

### step 1, new a agent
在claude coding cli 里，输入`/agent`

![Image](/2025-09-30-claude-sub-agent/1.jpg)

![Image](/2025-09-30-claude-sub-agent/2.jpg)

创建agent，下一步、下一步

- command line execute agent，赋予bash 的执行能力。
- browser agent，赋予google 最新发布的chrome-devtools-mcp tools 权限, https://github.com/ChromeDevTools/chrome-devtools-mcp

![Image](/2025-09-30-claude-sub-agent/3.jpg)

### step 2, define context & tasks
既然是一个regular task，又有一些regular 的背景和上下文，这样的个人助理类的agent 可以把每天重复的内容保存成一个md。我定义了两个md

- `knowledge.md`

```java
Knowledge Base
- my name is Jakob He
- I am a software developer
- I like to drink coffee
- I like my agent being kind and smart
- the folder ~/Chancetop, ~/github have multiple sub-folders, each folder is a project that cloned from github
```

- `daily_tasks.md`

```java
Daily Tasks
Today's Tasks
- [ ] git pull all my code in ~/Chancetop and ~/Github folder
- [ ] open below links in browser:
		- https://wonder.atlassian.net/jira/software/c/projects/MD/boards/10/backlog
		- https://github.com/
- [ ] open slack
- [ ] summarize my jira tickets and list all todos in a new file, naming after date
Completed Tasks
- [x] Example completed task
Notes
Add any additional notes or reminders here.
```

### step 3, run

每天，早上，给它问个早，输入这样的prompt:
```text
> good morning, I like you to get all knowledge in knowledge.md and run all tasks in daily_tasks.md
```

以下就是执行效果和结果：

注意红色高亮部分，调用的是`browser-assistant` agent，粉色高亮的部分，调用的是`pc-command-executor` agent.

![Image](/2025-09-30-claude-sub-agent/6.jpg)

像这样output token很少的应用，cost 并不高。我调试了好几次，也只有0.0002 us刀乐。

![Image](/2025-09-30-claude-sub-agent/7.jpg)

可惜的是，执行速度真是令人堪忧，但是我觉得问题在于我，我没有告诉它对应代码库的目录结构，它只好不停的尝试和试错，所以影响了执行速度。

### 最后：我们投入了什么，得到了什么？

以前：

创建一个这样的workflow，我们需要专业的软件开发人员，在理解用户需求之后，写一段shell 脚本，并且经过一定的调试之后，才能运行。

现在：

我只是集成了一些tools，agent就能有机的排列组合这些tools，十分钟的过程，我就能实现一个这样的工具，和解锁无数种可能的用法。甚至没有敲一行代码。

我不禁的焦虑起来。

## 关于agent 开发的思考

在这个例子里，我发现，一个小的workflow应用，已经完全不需要任何的程序开发，只要利用好现成的agent集成不同的tools，就能举一反三，搞出无数的小助手。

现成的agent 客户端有，Claude coding，cursor，Codex，每一个都比你自己从零开始开发的体验要好一百倍。

那么究竟什么情况下，我们才需要做agent开发呢？

### 留给开发者开发的空间不多了
如果说，传统软件，从用户界面，用户体验，到功能实现，是一个软件开发的完整集合，软件开发人员，需要百分百的介入和开发这部分的实现。

那么在ai时代，这个空间就被llm压缩的快没有了！

做个不恰当的比喻，简单的业务逻辑的开发，已经能够被自然语言和llm覆盖了。前端的交互，被这些llm大厂开发的agent 客户端给覆盖了。那么留给软件开发人员的空间，完全完全就是tools 的开发。😭

而且曾经属于软件人员开发的空间，还会随着llm能力的增强，而被逐渐蚕食。

而且而且，曾经不属于软件专业人员的业务人员(software outsider)，也能开始利用ai，来做软件开发。

那么曾经市场需求如此之大的软件开发人员的需求量，会急剧下滑，变成这样一个局势。真正留给开发者开发的空间不多了。

![Image](/2025-09-30-claude-sub-agent/5.jpg)

当然软件并不是受到ai冲击最大的行业，内容行业，才是。比如自媒体运营，广告，设计，云云。

### 公司老板角度呢？

老板眼中，一旦，我们有一个能够将业务接入llm的平台，那么意味着，公司可以缩减，I mean 大量缩减业务层面的开发人员数量。

且不说是否能够通过vibe coding 的形式稳定产出成果，只要ai能在公司内部应用到处理业务场景的程度，公司就能开始考虑停止招聘业务开发人员。

而留下的开发人员更大的价值就是，处理复杂的业务。

所以那些，业务简单易懂的开发人员，可以开始慌张了，那些还在寻找软件开发工作的人，也可以开始慌张了，还有正在软件行业从业的人，都可以开始慌张了。因为市场需求急剧下降，这是必然的趋势。

### 或许，将来，不再有所谓小而美的软件

类似小程序抽奖的软件，曾经在每年的年底也能吊打各个应用平台，但是现在开发一个这样的软件，就是分分钟的事情。

当llm能力到达一定的程度后，dynamic ui，dynamic app，都不在话下，以后的所谓小程序平台，很可能都能做到**现场生成**。

或许下一个微信小程序平台应用商店，没有开发者，没有部署在后台的应用。只有llm + prompt + running env。当开发，编译，运行一个全新应用的速度，只在1min以内时，消耗的资源远比维护它的资源小时，任何开发人员的投入，任何维持它运行的资源，都是多余的。这个应用只不过是一段持久化的prompt + 一个临时运行起来的内存空间而已。

越想越夸张了，但是为什么不呢？
