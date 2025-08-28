---
title: "AI Agent Workshop - 实现一个 ReAct Agent"
date: 2025-08-26 00:00:00 +0000
categories: [ai, agent]
tags: [ai, agent, adk, react]
published: true
description: 手搓代码
---

## Background
在上一篇文章[AI Agent Workshop - ReAct Parttern 源码对比, Google ADK vs LangChain](https://www.jakobhe.com/posts/ai-agent-workshop-react-pattern/)里，我们对比了Google ADK 和 LangChain 两个Python 框架是如何实现ReAct Pattern的。

看完手痒痒，立刻就开始了我的手搓ReAct 代码之旅。

## 运行效果

### 运行环境

llm: gemini-2.0-flash-lite

tools: randomInt, multiply, plus, guagua

> guagua值是我编造的一个概念，因为我发现现在的模型都内置了简单的加减乘除功能，我为了确保模型能够通过调用我的tools来执行，就编造了这个对它来说是全新的概念。

```java
public static final BaseAgent ROOT_AGENT =
  LlmAgent.builder()
      .name("multi_tool_agent")
      .model("gemini-2.0-flash-lite")
      .description("Agent to answer questions about math.")
      .planner(new PlanReActPlanner())
      .instruction(
          "You are a helpful agent who can answer user questions about math. you can only use the given tools.")
      .tools(
          FunctionTool.create(CityTimeWeather.class, "randomInt"),
          FunctionTool.create(CityTimeWeather.class, "multiply"),
          FunctionTool.create(CityTimeWeather.class, "guagua"),
          FunctionTool.create(CityTimeWeather.class, "plus")
      )
      .build();
```

### 第一个问题:

`18+19 等于多少？`

这个问题下，模型并不需要进行复杂的规划，直接调用plus函数就能得到答案。

```text
You > 18+19 等于多少？

Agent > 
/*PLANNING*/
1. Use the plus tool to calculate the sum of 18 and 19.
2. Output the result.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-817ccffa-271b-4aab-9efa-5ead61672530], args=Optional[{x=18, y=19}], name=Optional[plus]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-817ccffa-271b-4aab-9efa-5ead61672530], name=Optional[plus], response=Optional[{integer=37, status=success}]}
/*FINAL_ANSWER*/
18 + 19 = 37
```

### 第二个问题：

`生成两个随机数，求和`

这个问题下，模型需要先调用random函数，再根据第一次的结果调用第二个函数plus

```text
You > 生成两个随机数，求和

Agent > 
/*PLANNING*/
1. Generate two random integers.
2. Calculate the sum of the two integers using the `plus` function.
3. Output the result.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-911b09ab-537f-4edd-bff9-827558ddb14e], args=Optional[{}], name=Optional[randomInt]}Function Call: FunctionCall{id=Optional[adk-1cc7af44-a2bf-4f9d-88f8-315cd72d7d72], args=Optional[{}], name=Optional[randomInt]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-911b09ab-537f-4edd-bff9-827558ddb14e], name=Optional[randomInt], response=Optional[{integer=65, status=success}]}Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-1cc7af44-a2bf-4f9d-88f8-315cd72d7d72], name=Optional[randomInt], response=Optional[{integer=21, status=success}]}
/*REASONING*/
I have generated two random numbers, 65 and 21. Now I will calculate their sum.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-028daec7-d5b2-4a44-b010-ebb36332d99e], args=Optional[{y=21, x=65}], name=Optional[plus]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-028daec7-d5b2-4a44-b010-ebb36332d99e], name=Optional[plus], response=Optional[{integer=86, status=success}]}
/*FINAL_ANSWER*/
The sum of the two random numbers is 86.
```

稍微观察一下，在这样的模式运行之下，模型很准确的找到了plus tool，通过plus 函数调用来解决了它的问题。

之后的试验里，我发现模型常常不使用tool来计算数字之和，令我感到不安。

于是我编造了一个guagua值的概念用于测试，运行效果：

`生成两个随机数，求guagua值`

```text
You > 生成两个随机数，求guagua值

Agent >
/*PLANNING*/
1. Generate two random integers using the `default_api.randomInt()` function.
2. Calculate the guagua value of the two random integers using the `default_api.guagua()` function.
3. Print the result.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-6b2c14cf-0dc1-491d-8c0d-0dad37e5318f], args=Optional[{}], name=Optional[randomInt]}Function Call: FunctionCall{id=Optional[adk-5d5467db-7ea5-497e-9fb7-53427e5da7e0], args=Optional[{}], name=Optional[randomInt]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-6b2c14cf-0dc1-491d-8c0d-0dad37e5318f], name=Optional[randomInt], response=Optional[{status=success, integer=35}]}Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-5d5467db-7ea5-497e-9fb7-53427e5da7e0], name=Optional[randomInt], response=Optional[{status=success, integer=38}]}
/*REASONING*/
I have generated two random integers: 35 and 38. Now I will use the `guagua` function to compute the value.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-03a50e35-2fa0-42fd-bf34-a1d6d50bd7d3], args=Optional[{y=38, x=35}], name=Optional[guagua]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-03a50e35-2fa0-42fd-bf34-a1d6d50bd7d3], name=Optional[guagua], response=Optional[{status=success, integer=-3}]}
/*FINAL_ANSWER*/
The guagua value of the two random numbers 35 and 38 is -3.
```

符合预期！

### 第三个问题(一个离谱的问题):

`生成三个随机数，x,y,z。我有一个长方形，一个正方形，长方形边长是x、y，正方形边长是z。正方形的面积大还是长方形的面积大？如果是正方形面积大，就告诉我正方形和长方形的面积之和。如果是长方形面积大，就告诉我正方形和长方形的guagua值。`

```text

You > 生成三个随机数，x,y,z。我有一个长方形，一个正方形，长方形边长是x、y，正方形边长是z。正方形的面积大还是长方形的面积大？如果是正方形面积大，就告诉我正方形和长方形的面积之和。如果是长方形面积大，就告诉我正方形和长方形的guagua值。

Agent >
/*PLANNING*/
1. Generate three random integers x, y, and z using the `default_api.randomInt()` function. Since the function does not take any arguments, call it three times.
2. Calculate the area of the rectangle using the formula x * y, using the `default_api.multiply()` function.
3. Calculate the area of the square using the formula z * z, using the `default_api.multiply()` function.
4. Compare the area of the rectangle and the area of the square.
5. If the area of the square is greater than the area of the rectangle, calculate the sum of the areas using the `default_api.plus()` function and return the sum.
6. If the area of the rectangle is greater than or equal to the area of the square, calculate the guagua value of the area of the rectangle and the area of the square using the `default_api.guagua()` function and return the guagua value.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-239886bb-3ceb-4dce-bbd2-92d4ca3987a3], args=Optional[{}], name=Optional[randomInt]}Function Call: FunctionCall{id=Optional[adk-4e234bff-81f8-4cc0-a486-8f52a7a6d57f], args=Optional[{}], name=Optional[randomInt]}Function Call: FunctionCall{id=Optional[adk-28e92776-c6c1-444f-b541-f987606bd8d4], args=Optional[{}], name=Optional[randomInt]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-239886bb-3ceb-4dce-bbd2-92d4ca3987a3], name=Optional[randomInt], response=Optional[{status=success, integer=82}]}Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-4e234bff-81f8-4cc0-a486-8f52a7a6d57f], name=Optional[randomInt], response=Optional[{status=success, integer=78}]}Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-28e92776-c6c1-444f-b541-f987606bd8d4], name=Optional[randomInt], response=Optional[{status=success, integer=73}]}
/*REASONING*/
I have generated three random integers: 82, 78, and 73. Now I need to calculate the area of the rectangle with sides 82 and 78, and the area of the square with side 73.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-df47f0b9-41f2-4729-901d-086bf419eeba], args=Optional[{y=78, x=82}], name=Optional[multiply]}Function Call: FunctionCall{id=Optional[adk-fb182783-eb24-486c-83fe-e32a3ef84c3a], args=Optional[{x=73, y=73}], name=Optional[multiply]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-df47f0b9-41f2-4729-901d-086bf419eeba], name=Optional[multiply], response=Optional[{status=success, integer=6396}]}Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-fb182783-eb24-486c-83fe-e32a3ef84c3a], name=Optional[multiply], response=Optional[{status=success, integer=5329}]}
/*REASONING*/
The area of the rectangle is 6396, and the area of the square is 5329. Since the rectangle's area (6396) is greater than the square's area (5329), I need to calculate the guagua value of the two areas.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-54402985-528c-444f-a6a8-b91f5ae7ffea], args=Optional[{x=6396, y=5329}], name=Optional[guagua]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-54402985-528c-444f-a6a8-b91f5ae7ffea], name=Optional[guagua], response=Optional[{status=success, integer=1067}]}
/*FINAL_ANSWER*/
The guagua value is 1067.

```

稍微解释一下，agent 再多次reasoning 之后，发现没有任何需要执行的function call了，于是他就自行停止了。
从效果上看，整体还是不错的。模型能够处理相对复杂的问题。

## 继续向下探索

我会逐渐注释掉ReAct的能力，并且用相同的问题向他发问。
- 没有react prompt + 没有planner 的agent
- 有react prompt + 没有replanning 的自循环

### 一个裸模型

`生成两个随机数，求和`

如果我注释掉我的planner 来执行一次我的agent 

```text
You > 生成两个随机数，求和

Agent >
Function Call: FunctionCall{id=Optional[adk-71723d9a-2b8d-4abf-ae08-ea5edba0ff71], args=Optional[{}], name=Optional[randomInt]}Function Call: FunctionCall{id=Optional[adk-07234a1b-bbab-4164-b2b1-14ce15dffb55], args=Optional[{}], name=Optional[randomInt]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-71723d9a-2b8d-4abf-ae08-ea5edba0ff71], name=Optional[randomInt], response=Optional[{integer=96, status=success}]}Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-07234a1b-bbab-4164-b2b1-14ce15dffb55], name=Optional[randomInt], response=Optional[{integer=22, status=success}]}
96 + 22 = 118
```
可以看到，模型只调用了两次randomInt，96 + 22 = 118并没通过有调用plus函数来计算。这里容易产生幻觉。

为了避免模型调用自身内置的加法函数，我换一个问题：

`生成两个随机数，求guagua值`

```text
You > 生成两个随机数，求guagua值

Agent > 
Function Call: FunctionCall{id=Optional[adk-187de5ff-96ce-4911-945e-060c944cf718], args=Optional[{}], name=Optional[randomInt]}Function Call: FunctionCall{id=Optional[adk-37fe50f7-7e78-4412-bb52-94b737edbfbc], args=Optional[{}], name=Optional[randomInt]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-187de5ff-96ce-4911-945e-060c944cf718], name=Optional[randomInt], response=Optional[{integer=9, status=success}]}Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-37fe50f7-7e78-4412-bb52-94b737edbfbc], name=Optional[randomInt], response=Optional[{integer=21, status=success}]}
9 and 21, I can't calculate the guagua value for you.  I can only call the guagua function with two integers.
```
重点：在没有支持replanning + action 的情况下，模型并不具备解决较为复杂问题的能力。给的答案也是幻觉十足，因为我的guagua函数就是给的integer 作为参数。

```java

  public static Map<String, String> guagua(
      @Schema(
          description = "guagua given integers")
      Integer x, Integer y) {
    return Map.of(
        "status", "success", "integer", "" + Math.subtractExact(x, y));
  }
  
```


### 只有react prompt 的模型

我稍微修改一下代码子，直接在PlanReActPlanner里不process 任何response:

```java

  @Override
  public Optional<List<Part>> processPlanningResponse(
      CallbackContext context, List<Part> responseParts) {
    return Optional.of(responseParts);
  }

```
发问：

`生成两个随机数，求guagua值`

效果如下：

```text
You > 生成两个随机数，求guagua值

Agent >
/*PLANNING*/
1. Generate two random integers using the `randomInt` tool.
2. Calculate the guagua value of the two random integers using the `guagua` tool.
3. Output the guagua value.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-5ddbdf13-b1e2-4f15-83fb-1903b1a2bf3b], args=Optional[{}], name=Optional[randomInt]}Function Call: FunctionCall{id=Optional[adk-050d2d72-da18-446f-9860-f18dde061d94], args=Optional[{}], name=Optional[randomInt]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-5ddbdf13-b1e2-4f15-83fb-1903b1a2bf3b], name=Optional[randomInt], response=Optional[{integer=15, status=success}]}Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-050d2d72-da18-446f-9860-f18dde061d94], name=Optional[randomInt], response=Optional[{integer=42, status=success}]}
/*REASONING*/
I have generated two random integers: 15 and 42. Now I will use the guagua tool to calculate the guagua value.

/*ACTION*/
Function Call: FunctionCall{id=Optional[adk-f2b1aa79-a471-4a7d-b791-38e55575e924], args=Optional[{x=15, y=42}], name=Optional[guagua]}
Function Response: FunctionResponse{willContinue=Optional.empty, scheduling=Optional.empty, id=Optional[adk-f2b1aa79-a471-4a7d-b791-38e55575e924], name=Optional[guagua], response=Optional[{integer=-27, status=success}]}
/*FINAL_ANSWER*/
The guagua value of the two random integers is -27.
```

效果符合预期！

这个结果让我感到有意思。看起来大部分的情况下，我们只要像langchain的实现一样，给一个prompt，模型就能很好的支持replanning。或许只有支持planning的模型由此效果。这次实验里，我用的是`gemini-2.0-flash-lite`

实验先到此暂停一下，因为我觉得绝大部分的单线任务问题，我们通过初始化的planing prompt都能支持。之后我会继续探索一些多线，更为复杂的任务来进行实验。

我认为当前我们绝大多数人对ai对依赖，不至于会100%依赖ai执行一个很复杂的任务。我不想再编造一些不靠谱，上下文不充足，又十分复杂，结果有多种可能性的任务继续我的测试了。

## 代码实现

已经给google 提了[pr](https://github.com/google/adk-java/pull/395)。

核心代码在之前的文章已经讲清楚了，基本上是尊从python的实现来写的。

1. 定义抽象的BasePlanner，在agent顶层，注入
2. 实现request 和response processor，在singleflow注入
3. 实现NLPlanning主要的planing的抽象后的逻辑都在此
4. 实现两个planner分别是build in planner和 react planner

NLPlanning 的主要职责
1. 拼接plan pattern 的prompt： append_instructions
2. 标记已经发给llm 的请求，将其标记为false：_remove_thought_from_request

PlanReActPlanner
1. 实现react prompt
2. process response时，判断是否还有function call，如果有就继续循环

## 结论

我们比较了三种递进的react pattern 的能力
1. 没有react 的prompt + 没有planner 的agent：解决问题能力完全不符合预期
2. 有react prompt 但是没有replanning + action 的agent：能解决相对复杂的问题，甚至有点超出我的预期，只要对agent的请求不是复杂到要拆解多步，比如画一个html页面，解释地心说的原理，我觉得这类方式就能解决很多基本问题。
3. 有react prompt + 有replanning + action 循环的agent：我并没测试出这个pattern的边界，敬请期待