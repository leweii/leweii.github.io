---
title: "agent workshop 1: 用ADK 运行一个简单的agent"
date: 2025-07-30 00:00:00 +0000
categories: [ai]
tags: [ai]
published: true
description: 拥有个人小秘书的第一步, 运行一个agent
---

## ADK

官网：https://adk.wiki/

ADK 是google 的agent 开发套件，Agent Development Kit，可以让你轻松搭建自己的agent，它包含了一些基本的能力，比如
- Sequential、Parallel、Loop to support workflows
- Tools support
- Session, State, and Memory support
- Events support
- Callback support

先列举这些，简单的agent 逃不出这些套路。至于A2A，Multi-Agent Architecture，则是当你发布了一个对公的agent时需要考虑的内容。

ADK之所以简单，易用，是因为他抽象了许多开发过程中需要反复使用的模式，ADK与模型无关，单纯让你focus on 开发，这件事上。

## 一个基于java 的agent项目

像你开始任何java 项目一样，先新建一个项目，在依赖文件里定义

```kotlin
dependencies {
    implementation 'com.google.adk:google-adk:0.1.0'
    implementation 'com.google.adk:google-adk-dev:0.1.0'
}
```

编译之后，新建一个package和java class

agents.multitool.MultiToolAgent.java

使用ADK 的lib init 一个agent，定义model，写好上下文，让agent 知道自己是干什么的。

```java
LlmAgent.builder()
    .name(NAME)
    .model("gemini-2.0-flash")
    .description("Agent to answer questions about the time and weather in a city.")
    .instruction(
        "You are a helpful agent who can answer user questions about the time and weather"
            + " in a city.")
    .tools(
        FunctionTool.create(MultiToolAgent.class, "getCurrentTime"),
        FunctionTool.create(MultiToolAgent.class, "getWeather"))
    .build();
```
这里我们定义两个方法，分别是获取当前时间和获取天气。当然，记得用·@Schema· 来描述清楚输入字段的上下文。
Agent 会分析方法定义和输入参数的上下文，根据用户的输入来决定调用哪个方法，决定传入的参数。

```java
public static Map<String, String> getCurrentTime(@Schema(name = "city",
            description = "The name of the city for which to retrieve the current time") String city) {
...
}
```

当然，我们肯定还有一些别的复杂场景，比如，我需要根据今天的天气，决定通勤方式，这时候我需要获取第一个方法的返回值，作为第二个方法的输入参数。
不过今天先不讨论，这是workflow的内容。

## 本地调试

截止以上，我们都没有过多的依赖任何llm模型，这就是ADK的特性，它抽象了agent的开发过程，和模型无关。

如果要调试，我们需要先注册一个google cloud，配置对应的vertex ai 和本地auth，参考这里
https://cloud.google.com/docs/authentication/provide-credentials-adc

生成本地调试auth json之后，就可以配置对应的运行时参数：
```java
GOOGLE_CLOUD_LOCATION=us-central1;
GOOGLE_CLOUD_PROJECT=project-id;
GOOGLE_GENAI_USE_VERTEXAI=TRUE
```
本地执行起来吧，请见下图：

![Image](/2025-07-30-agent-workshop-1/1.jpg)

## 直观感受
以前，我们要写很多逻辑呢，用程序语言实现的一些判断，现在可以直接写在prompt里了额。当然它也有误解你的文字的时候，这就是ai agent 和用户之间的相互适应过程，如果你摸透了自己正在用的agent 遇到过许多它不那么靠谱的场景，你自然会用结果更为明确的话语来与之沟通。

### 开发变简单了
越是严谨的语言，越多条框，现在只要是一个有语言组织能力的人，没有任何技术背景，都能开发出一个像样的产品，开发的门槛大大降低了。
这是我们pm Brandon做的一个小产品，感受一下来自耶鲁大学的自学能力和对技术专研的激情！作为产品，他能迅速的实现自己的POC，迅速precent给用户，作为开发，我只能默默的觉得，自己的作用好像又小了一点点🤏。

![Image](/2025-07-30-agent-workshop-1/2.JPG)

### 调试测试变难了
当然，用自然语言运行的程序，缺少了很多确定性。那么当我调试一个长流程的程序时，我要如何debug，如何找到问题所在呢？难☹️

## 除了ADK，还有什么？
市面上还有很多agent 开发框架，比如LangChain、Haystack、LlamaIndex、SpringAI等，它们各有特点，但ADK的优势在于它真正的做到了面向开发者，足够抽象，足够易用，与模型无关的、部署无关的

## 原理

agent 纯粹是一个工程化的产物，它尝试用工程能力，来解决科学无法做到的事情。

假设我的llm 是一个活秘书，她对我的指令能够百分百理解，也能自行执行一些事，甚至有时候能超出我的预期，那么我还需要开发这个agent干啥？

在当下，llm只能处理明确的事情，所以这个简单的demo里，我们的agent 做了几件很明确的事情：
1. agent启动时，我们明确的告诉了它，你能查询，天气，你能查询时间。
2. 当用户的问题进来的时候，我们先让agent 做了一次意图分析：用户问了什么问题？是否跟查询天气和时间相关？如果用户问了超纲的问题，请你回答他你不知道，不要做过多其它事情！
3. 分析完了之后，agent开始调用方法，并且将执行的结果收集起来。
4. 最后，agent把执行的结果，梳理成了通顺的语句，告诉了用户。

人类很聪明，把任务切小来，一点点的让一个有幻觉的实体执行明确的任务，就能避免过于发散的结果。