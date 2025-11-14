---
title: "Code Execution"
date: 2025-11-14 00:00:00 +0000
categories: [ai, agent]
tags: [ai, agent]
published: true
description: 又又来用工程的方式解决问题了！
---

### Background: Why code execution matters?

之前我们讨论过，agent在本地运行和服务器端运行，有很不一样的限制和优势，这导致我们在设计agent时，也有很不一样的解题思路。
比如我现在有一个题目：我需要从一个特定格式数据里，捞取特定的数据，并且以另一个格式输出。

From:
```json
labels: [
    {
      name: 'Amberjack',
      abbreviation: 'Amberjack',
      is_visible_in_label: true
    },
    {
      name: 'Anchovy',
      abbreviation: 'Anchovy',
      is_visible_in_label: true
    },
    {
      name: 'Bonito',
      abbreviation: 'Bonito',
      is_visible_in_label: true
    },
    {
      name: 'Bream',
      abbreviation: 'Bream',
      is_visible_in_label: true
    },
    {
      name: 'Capelin',
      abbreviation: 'Capelin',
      is_visible_in_label: true
    }
  ]
```

To:

```
Amberjack
Anchovy
Bonito
Bream
Capelin
```

我可以这样问：
1. `write a code to get abbreviations in x.json`
   也可以这样问：
2. `get the abbreviations from x.json`

两种问法的区别是
第一种问法，需要code execution 环境，第二种不需要
第一种问法巧妙的绕开了llm 幻觉问题，llm确保代码是正确的，从而确保结果是正确的。
第二种问法可能存在幻觉问题。

所以，通过code execution 我们能够绕开，或者解决一些llm的局限。这是一个典型的用工程问题，解决科学问题的方案。

甚至在这篇博客里，claude code 表示，利用code execution，转换MCP的使用方法，能够将他们的token消耗量减少98%。这是一个什么可怕的区别。

https://www.anthropic.com/engineering/code-execution-with-mcp

code execution 简单说，是一种调用方法的能力。要在本地的agent里，写code 并且利用使用者的本地运行环境执行方法，并不难，只要你有装java，python的编译器，就很容易的能够让agent 在本地执行方法，甚至是javascript，shell脚本这类脚本语言，又能进一步降低对本地环境的要求。

但是，如何在服务器端的agent里，我们也想要赋予agent这个能力呢？这就是这篇博客想讨论和实践的。

### Code execution 的可行方案

假设服务器端的agent，动态生成了一段代码，并且要某个地方去运行这段代码。
显然，llm 的云厂商，也意识到了这个问题，纷纷推出了自己的支持方式，比如google就有Vertex Code Interpreter Extension，专门解决这个代码执行的问题，另外Gemini 2.0+ models原生就有执行代码的能力。顺着这个思路，我们也可以用aws lambda 来临时的启动一个serverless 服务来执行这部分代码。
除了在其它服务器上来动态的执行代码，我们也可以在本地服务里，以sandbox或者是container的形式来执行代码。

这个给agent 写代码和执行代码的能力的解题思路，和把所有的tools作为上下文给到agent 的解题思路上，存在非常本质区别。前者是赋予agent能力，让他去以现有的资源来解决问题。后者更希望是告诉他，你最好这样这样这样做，就能解决xxx问题。

- 前者是把agent 当作一个员工，然后授权。
- 后者是把agent 当作学生，让他模仿。

### Lets' Practice！

我们今天的practice 就让运行的agent，让它能够到指定的container运行自己生成的代码，做一次简单的接口调用。
拿出我们的老朋友代码，CityTimeWeather agent，稍微修改一下，
1. 加入code execute 能力
2. 删除所有引用的tool
3. 修改prompt 把tool call 改为谢一段代码，再进行tool call

```java
public static final BaseAgent ROOT_AGENT =  
      LlmAgent.builder()  
          .name("multi_tool_agent")  
          .model("gemini-2.0-flash")  
          .description("Agent to answer questions about the time and weather in a city.\n" +  
              "use Python code to call api http://host.docker.internal:9090/weather to get weather.\n" +  
              "The requests library is already installed and available for use.")  
//              "use Python code to mock a weather result.\n")  
          .instruction(  
              "You are a helpful agent who can answer user questions about the time and weather in a city.")  
          .tools(  
//              FunctionTool.create(CityTimeWeather.class, "getCurrentTime"),  
//              FunctionTool.create(CityTimeWeather.class, "getWeather")  
          )  
          .codeExecutor(new ContainerCodeExecutor(Optional.empty(), Optional.of("python:3.13"), Optional.empty()))  
          .build();
```

第一次执行，失败

![Image](/2025-11-14-code-execution/1.jpg)

我们的container环境，没有request library！是的，它只写了一段代码，但是这段代码的运行，对环境是有额外要求的。

我的解决思路是，在启动agent 前，对container得环境，链接进行一系列的验证，并且能够注册对应的python libiary！

```java
  
private void verifyPythonInstallation() {  
  ExecCreateCmdResponse execCreateCmdResponse =  
      dockerClient.execCreateCmd(container.getId()).withCmd("which", "python3").exec();  
  ByteArrayOutputStream stdout = new ByteArrayOutputStream();  
  ByteArrayOutputStream stderr = new ByteArrayOutputStream();  
  try (ExecStartResultCallback callback = new ExecStartResultCallback(stdout, stderr)) {  
    dockerClient.execStartCmd(execCreateCmdResponse.getId()).exec(callback).awaitCompletion();  
  } catch (InterruptedException e) {  
    Thread.currentThread().interrupt();  
    throw new RuntimeException("Python verification was interrupted.", e);  
  } catch (IOException e) {  
    throw new UncheckedIOException(e);  
  }  
}  
  
private void installPythonPackages() {  
  logger.info("Installing Python packages (requests)...");  
  ExecCreateCmdResponse execCreateCmdResponse =  
      dockerClient  
          .execCreateCmd(container.getId())  
          .withCmd("pip", "install", "requests")  
          .withAttachStdout(true)  
          .withAttachStderr(true)  
          .exec();  
  ByteArrayOutputStream stdout = new ByteArrayOutputStream();  
  ByteArrayOutputStream stderr = new ByteArrayOutputStream();  
  try (ExecStartResultCallback callback = new ExecStartResultCallback(stdout, stderr)) {  
    dockerClient.execStartCmd(execCreateCmdResponse.getId()).exec(callback).awaitCompletion();  
    logger.info("Python packages installed successfully.");  
  } catch (InterruptedException e) {  
    Thread.currentThread().interrupt();  
    throw new RuntimeException("Package installation was interrupted.", e);  
  } catch (IOException e) {  
    throw new UncheckedIOException(e);  
  }  
}
```

重新运行agent，成功。

![Image](/2025-11-14-code-execution/2.jpg)

它访问了远程的container, 在container 里执行了一段python 代码，以此接口返回作为回复用户天气的依据。

Practice 的部分到一段路了，但是我觉得把agent 当作员工的事情还是很值得拿出来再聊一聊的。

### 作为人的尊严在哪里？

最近有一些观察，有些工程师，在接触了ai之后，能力大幅下降，问他为什么这样去实现，他说大家都这样实现；问他原理是什么？就开始顾左右而言他了～。。。

我最近也有同感，我都懒得自己push 代码了，简单的`git commit -m "xxx"` + `git push` 我都懒得自己写。不禁警惕起来，反问自己，如果ai什么都能做，还要我们工程师做什么？

人在逐渐增加对ai依赖的同时，也同时的在逐渐失去自主思考能力。
搜索引擎时代，人只是失去了文档索引能力，ai时代，逐渐失去的就是总结归纳，学习，以至于最基本的思考能力。

#### 所以，人的尊严在哪里？观点1：不要让ai代替你思考。

如果说，ai替代了你的所有思考工作，那么，你就约等于是它，那么你就加速了自己被替代的过程。 显然，思考，梳理思绪的过程，是没有人能替代你做的。就像我在高中的时候，竟然傻到去抄别人的课堂笔记，那是千千万万件不能让别人替你做的一件事之一。 显然如果这类事情都交给了ai，那么经过你的思考，所输出的结果一定是劣质的，充满了幻觉的。而且这种惰性会随着时间而加剧。

所以所谓的“善用”ai，出现了多个维度的区别。

1. 维度一：不假思索的用ai，这样后果就是，让幻觉泛滥，横行，再经过人传人的加工后，将幻觉再次放大，最后虚拟反噬现实，假象变成真理。
2. 维度二：了解模型，让它照着你的预想来准确，可控的“用”模型
    1. 利用模型的特性，扬长避短，从而达到善用ai的目的
        1. claude code 如何在上下文工程中，添加，删除，总结上下文，截取上下文，这是我们值得学习的，因为这是基于模型的特性做的一系列双向奔赴的工作。
        2. 利用文件系统，作为索引，通过code execution来调用mcp，从而节约token，这是值得学习的，因为它有效的绕开了token，和tools 定义的矛盾，同样是利用模型的特性（优点）避开了模型的缺陷。
        3. 还有一系列为了减少幻觉而做的许多事，这些事是人类的智慧
    2. 双向/三向验证的用ai
        1. 在调研某些议题的时候，同时，用人，用另一个模型，用不一样的解题思路，论证自己的论点，这样用ai的过程是合适的，因为ai的只是你的一个员工，是你的一个工具，是你的手，它在执行层面帮助你，但是千万别让它变成你思维懒惰的借口，千万别把它当作头脑，在思想层面替代你。

#### 所以，人的尊严在哪里？观点2：做比"正确"的事情更进一步的事。

AI总能做出最“正确”的回答，它能以不得罪任何人都口吻回答一个种族主义的问题，但是不见得一定有建设性。所以人的尊严在哪里？我认为那就是，人性督促你，要，必须做的比“正确”再多一点！

社会里，正确和平庸已经够泛滥了，那么人，艺术家，kol，存在的意义又是什么？我认为是他们能比“正确”多走深入一步。这一步是ai，目前为止，不能替代人做的部分！

多走一步，不一定是完全正确的一步，但是必须是突破边界的一步。比如姆巴佩在世界杯决赛中场休息时说的一系列话，感染，鼓舞全队，去拼搏。这是人性的光辉时刻。


