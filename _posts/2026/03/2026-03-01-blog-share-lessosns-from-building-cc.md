---
title: "博客分享：构建Claude Code的经验和教训"
description:
create_time: 2026-03-01 00:00
tags:
  - ai
  - claude
published: true
---

博客原文：
1. (https://x.com/trq212/article/2027463795355095314)[https://x.com/trq212/article/2027463795355095314]
2. (https://x.com/trq212/article/2014480496013803643)[https://x.com/trq212/article/2014480496013803643]
3. (https://x.com/trq212/status/2024574133011673516)[https://x.com/trq212/status/2024574133011673516]

## 我的总结

文章介绍了四个claude code 开发过程中遇到的四个feature。讲述了当时的问题，和解决思路，很值得一读。
- Improving Elicitation & the AskUserQuestion tool，让用户引导更为有效
- Tasks & Todos，从todo向task 演进
- Search Interface，claude code 查询的演进
- The Claude Code Guide Agent，一个管理自身配置和渐进式搜索自我能力的agent

理解这些能够有助于我们自己设计agent，有助于我们了解claude code，提高对cc使用的效率。

## 博客正文
### Improving Elicitation & the AskUserQuestion tool
这是一个有关用户交互的设计，翻译翻译就是，给用户做问答题，还是选择题？

长话短说，cc排除了两个过于死板和过于自由的形式，选择了一个可以在cli里做选择的interface来实现。

在一些网页作为interface的agnet里，大家都有一些前后端的协议，把一些是否转换成按钮，把一些选项转换成表单的设计，这就是一个思路，不做过多赘述。

### Tasks & Todos
作者提到，一开始他们就意识到，要给模型一个todo list，为了让他能够保持专注。为此他们实现了一个TodoWrite tool。

但是即便如此，claude 还是经常忘记自己在做什么，以至于有一段时间里，claude code 每5回合对话，就会强调一次todo list。这也是manus的做法:(Lessons from Building Manus)[https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus]。

模型能力提升之后，现在就不需要再对模型进行强调，而且有时候todo 甚至过于苛刻，以至于模型不会去更新todo。

在这样的前提下，claude code引入了另一个概念，task。它支持多subagent 的协作模式，模型还能对task 进行编辑，而且前后task 支持依赖关系。

### Search Interface
一开始，claude 用的是RAG vector database。这样的做法有很多劣势，比如indexing，不同环境不稳定，最重要的是，这些数据是给予claude的，而不是Claude自己去搜索的。

之后团队给予Claude grep 的能力，解决查询的问题，支持了skill，目前已经成为各种 agentic tool 的主流解决方案。

太多地方都讲到这个点了。我也不多做赘述。

### The Claude Code Guide Agent
claude 现在有20个tool，实际上，你每给claude 一个tool 就是给claude 多一个解决问题的思路。团队一直不停的再问自己，是否需要给claude这么多的tools，每给模型新增一个tool 都要带来额外的成本，比如在prompt里提及它的用途。

如果把这些tool的信息都放在prompt里，实际上会干扰calude真正的用途，coding。

作者指出，为了解决用户问一些有关claude 设置方面的问题，他们开发了一个Claude Code Guide Agent，这个agent 就会对claude 配置信息进行渐进式搜索。

这种方式会让claude 通过文件引用的方式，逐步挖掘更多所需要的信息。skill 的设计里，也是这个逻辑。

### 作者总结
作者最后还自夸了一下，自己是艺术家，而不是工程师。:)

## 我的感受
最近正在经历从claude code 转换到gemini cli的痛苦，我遇到的一个很大的问题是，gemini 无法解决自己的配置问题，比如我让他给自己配置一个mcp 服务，这种任务gemini 都无法很好的完成。 很明显gemini cli没有实现一个像claude 这样的Claude Code Guide Agent。

每一个感受上的区别，背后都是更加合理的agent设计，让我想起互联网早期的故事，无论是qq，今日头条，在刚起步的时候，它们都有无数的竞争对手，就是用户体验上那一点点的细微差距，让他们能够一直站到今天。
