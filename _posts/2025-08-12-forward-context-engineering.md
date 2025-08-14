---
title: "AI Agent 专题 - (转载)上下文工程Context Engineering"
date: 2025-08-12 00:00:00 +0000
categories: [ai, agent]
tags: [ai, agent, mcp, adk]
published: true
description: finding these resources is very helpful
---

转载一篇应该给更多人看到的文章，来自 [AI代理的上下文工程：构建Manus的经验教训](https://manus.im/zh-cn/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)

通过这篇文章，我第一次意识到，很多认知，在agent 开发过程中是反直觉的。

文章的开头，提到了遥远的时代，当模型要适配一个新的任务时，通常需要进行微调（fine-tuning），而这样的方案带来的惨痛的教训是，漫长的开发周期，无法适应市场迅速的变化。

于是，经历了这一切之后，Manus 决定押注上下文工程（Context Engineering）。

接下来作者Yichao 'Peak' Ji 分享了几点非常非常具有启发性的经验。

## 巧用你的上下文缓存Context Caching
绝大多数的llm 都支持上下文缓存：https://cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-overview

缓存命中的最大优点就是更快的响应速度和更低的价格。

Peak提出，如果他只定义一个指标的话，那么他会选择上下文缓存的命中率来做为这唯一的指标。

随着会话的进行，每一步都会带上前一步的上下文，

为了提高你的缓存命中率，作者提出三个key practice：
1. 保持prompt的前缀稳定，即使对上下文是很小的改动，也会导致缓存失效。
2. 只叠加上下文，不修改已经发生的事件
3. 在必要的时候标记缓存断点

后面有机会我们可以写一个demo来深刻的体会缓存命中和失效之间的区别。

## 不要删除你的tool，而是遮盖它

作者提出，避免在迭代过程中动态添加或移除tool，这一点与我的认知完全是相反的。

随着MCP的流行，agent的使用者会往agent插入各式各样的tools来满足业务。但是随着tools的增多，llm也自然会非常容易给各式各样的tools给弄混淆。

自然，会有人考虑到动态的分配tools，比如第一次我要用xx tool我只告诉llm这个tool，下一个阶段的对话要使用到别的tool时，则去修改tool集合达到节约token的目的。我在[AI Agent 专题 - 集成一个现成的MCP服务](https://www.jakobhe.com/posts/mcp-client/#%E6%9C%89%E9%82%A3%E4%B9%88%EF%B8%8F%E4%B8%80%E4%B8%AA%E5%B0%8F%E5%B0%8F%E7%9A%84%E7%BC%BA%E7%82%B9%E4%B9%9F%E6%9C%89%E5%AF%B9%E5%BA%94%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88)里提到过这样取巧的办法。

但是作者不建议这样的使用方法。
1. 绝大多数的agent设计都会在一开始（上下文的头部）就告诉llm tool集合，如果动态分配tools会导致缓存失效，详见上个标题【巧用你的上下文缓存Context Caching】。
2. 动态分配的tool会导致更多的幻觉。从人类的理解层面来看这个问题也很好理解，我曾经干过xxx事情，并且成功了，但是今天忽然发现我不被允许干这样的事情了的时候，我还会幻想中，驱使自己去执行这件事。

那么我们该怎么办？

作者提出，可以用一个状态码来标记工具的状态，类似掩码的设计，让某些tools还存在上下文中，但是状态告诉llm不要去使用它。

## 利用文件系统作为上下文
上下文长度限制现在是一个llm的核心问题，为了解决这个问题，大家穷尽一生所学。
有人压缩上下文，有人则直接截断，但是这都会使得llm逐渐偏离和误解任务。

作者认为，文件系统是终极上下文。将文件系统作为外部记忆，在需要的时候llm会自然从外部调取这部分记忆。

> 将文件系统视为终极上下文：大小不受限制，天然持久化，并且代理可以直接操作。模型学会按需写入和读取文件——不仅将文件系统用作存储，还用作结构化的外部记忆。

说的有点吓人，但是make sense。类似人类的大脑，所有知识并不都在我们的大脑里，我们的大脑里只会记忆知识的索引。比如遇到法律知识，就去问我的律师朋友，遇到骨科问题，先去找我的院长朋友，再让他介绍他们院里的骨科专家。

## 还有几点
- 通过复述操控注意力
- 保留错误的内容
- 不要被少样本示例所困

这些点作者写的很清晰，也非常容易理解，我不做复述。

## 感受

当上下文成了一种工程的时候，说明人类已经在尝试适应ai了。就像被ai打破了套路的围棋领域一样，许多看似符合我们认知的事情，在ai层面并不成立。或许ai正在反噬我们的语言结构，和学习思维路径。

anyway 上下文工程看似简单，但是确确实实正在成为ai开发的门槛之一。

#### ref
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [A Survey on In-context Learning](https://arxiv.org/abs/2301.00234)
- [KV Caching Explained](https://medium.com/@joaolages/kv-caching-explained-276520203249)
- [Prefix Caching](https://docs.vllm.ai/en/stable/design/v1/prefix_caching.html)
