---
title: "mcp 客户端实操"
date: 2025-08-10 00:00:00 +0000
categories: [ai]
tags: [ai]
published: true
description: MCP 是什么，为什么要用MCP，以及在客户端怎么用？
---

在[个人代理](https://www.jakobhe.com/posts/personal-agent/)的文章里，我们利用vs code插件链接了一个atlassian本地MCP服务，并且连接上，能够自用的使用里面的所有tools。

## 为什么要用MCP服务？

MCP是一个简单的抽象和复用，只需要服务（能力）提供商，一次定义好能力的上下文，就能够給所有的服务使用者快速接入ai的能力。如果没有MCP，每个服务的使用方，都在对不同的tools定义自己的prompt，不厌其烦的重复告诉ai一样的事情，而且由于每个人表达能力和侧重不一样，导致一样的tools 使用的真实效果也千差万别。

## 什么时候需要定义自己的MCP服务

- 有多余1个的agent 需要接入你提供的tools时
- 你想规范tools 的定义时

我们的项目，一开始计划只开放1-2个tools，并且调用方法的agent 目前也就只有一个。但是在真正实现tool的上下文时，我们发现tools的定义和开发也非常的没有规范科研，可复杂，可简单。于是我们决定，即使只有一个agent，我们也要用MCP来定义tools。

ai的规范化是目前阶段的一个大趋势，无论是MCP，还是AG-UI，A2A，A2C，大家都是在尝试让ai更加的规范化，减少幻觉，减少重复劳动。

## 实操吧

今天的实操中，我们会
1. 利用docker 和现成的mcp 镜像，在本地启动一个mcp 服务（也可看成是一个远程MCP 服务）
2. 把mcp 服务，注册到agent里
3. 启动我们的agent，试用对应的tools

### 开始之前
我们需要先回答几个问题，

#### running in client side or server side?

- 运行在client side 的优点是权限控制，和读取更多本地运行环境的能力。
- 运行在server side 的优点是，能够减少用户所需要配置的信息，如果你的客户是非软件开发人员，你就需要一个远程的MCP服务和一个已经高度集成好的agent客户端。

除了以上的区别外，还需要注意的是，在你设计的agent里所注册的tools里，要如何处理好授权和数据安全问题？

| # | Agent 读写能力？ | remote or local？ |
|---|-------------|------------------|
| 1 | 只读          | remote           |
| 2 | 只读          | local            |
| 3 | 读写          | remote              |
| 4 | 读写          | local              |

这里有四个case，在只读case下，无论是本地和远程，都不太需要关注授权问题（绝大部分场景），除非上市公司，需要对读取和写都有严格的audit log。

那么在local的mcp服务，也就是运行在客户端一侧的MCP服务，可以给每个客户都启动一个MCP链接，每个MCP链接也只有一个用户token信息的管理，它就能很轻松的知道所有操作对应的用户信息。

运行在remote的mcp服务，在设计的比较好的情况下是，服务记录好每个用户的登陆信息，再根据客户端的请求来区分用户，再用对应的用户信息来操作tools。

设计的一般的MCP remote 服务，则是用一个通用账号，比如某project 账号，来通用的操作所有的“读”case，忽略所有的audit log 需求。

设计的最糟的MCP remote 服务，则是忽略任何用户“读写”权限，只用通用账号来进行所有操作。

在今天的实操里，我们启动一个docker 镜像，用一个通用账户来操作所有的读操作。


### 开始！第一步：定义，启动我们的MCP 服务

今天我们用这个镜像：
https://hub.docker.com/r/mcp/atlassian

多说一点，MCP镜像最近层出不穷，最好使用官方提供的镜像，或者是纯自己开发的镜像，否则会有一些问题，比如：
1. tools 上下文描述和定义不够准确
2. 安全问题，比如有人恶意注入一些不安全的上下文，乱操作你的服务

```bash
docker run -i --rm -p 8000:8000 \
  -e JIRA_URL="https://meme.atlassian.net" \
  -e JIRA_USERNAME="svc.dev.atlassian@meme.com" \
  -e JIRA_API_TOKEN="your_api_token_here" \
  mcp/atlassian:latest \
  --transport sse -vv
```

from 文档：
> 👥 HTTP Transport Configuration
> Instead of using stdio, you can run the server as a persistent HTTP service using either:
> 
> - sse (Server-Sent Events) transport at /sse endpoint
> - streamable-http transport at /mcp endpoint

![Image](/2025-08-10-mcp-client/1.jpg)

运行好之后，可以用postman 验证一下启动情况：

![Image](/2025-08-10-mcp-client/2.jpg)

### 第二步：定义一个agent

我们还是用ADK来，先按[用ADK运行一个agent](https://www.jakobhe.com/posts/agent-workshop-1/)里写的框架来创建一个agent，专门用来处理jira summarize。

```java
public static List<BaseTool> integrateJiraMCP() {
    SseServerParameters serverParameters = SseServerParameters.builder().url("http://127.0.0.1:8000/sse")
        .timeout(Duration.ofMinutes(1)).sseReadTimeout(Duration.ofMinutes(1))
        .build();
    McpToolset.McpToolsAndToolsetResult toolsAndToolsetResult;
    try {
        toolsAndToolsetResult = McpToolset.fromServer(serverParameters).get();
    } catch (Exception e) {
        throw new RuntimeException("Connect JIRA MCP server failed", e);
    }
    Set<String> supportTools = Set.of("jira_get_issue", "jira_search");
    return toolsAndToolsetResult.getTools().stream().filter(mcpTool -> supportTools.contains(mcpTool.name())).map(mcpTool -> (BaseTool) mcpTool).toList();
}
```

注册你的MCP 服务
```java
public static BaseAgent initAgent() {
    return LlmAgent.builder()
        .name(NAME)
        .model("gemini-2.0-flash")
        .description("Agent to summarize, organize jira tickets. There is a jira board to manage all tasks for MasterData team.")
        .instruction(
            "You are a helpful agent who can answer user questions about the jira tickets.")
        .tools(integrateJiraMCP())
        .build();
}
```

验证一下:
![Image](/2025-08-10-mcp-client/3.JPG)

### 好了！接下来集成everything吧。

接下来，我们就能用agent“有机”的把各种服务集成在一起了，曾经的集成是比较“死”的，没有智能可言。

拿经典的ifttt 来说，基本上就是一个trigger+ 做很多很多的事情。比如收到一封邮件，带有post twitter的关键字，就发布twitter，youtube，ins。

什么是活的integration呢？那就是由agent来决策所需要做的事情，比如：
收到一份命令邮件，则继续操作发布社交媒体，但是依据邮件内容的不同情况，做不同的操作：
1. 文字少的时候发twitter
2. 文字多的时候生成缩略图后再发twitter
3. 带有多图片的时候发ins+twitter
4. 带视频链接的时候，下载下来发youtube

## 有那么一个小小的缺点，也有对应的解决方案。
当然MCP 如此方便，带来了一些代价，硕大的工具库冗余了非常多的tools 动辄几十个，上百个。这对token的消耗是无感且恐怖的，不知不觉预算就上去了。

而且实际情况是，我在一个任务的执行时，并不需要用到如此之多的tools，甚至许多tools 的能力会对agent 的判断形成干扰，做出没必要执行的动作。 虽然未来一定是token便宜的时代，这些巨量的tools干扰也成为了一个agent不稳定的因素。

所以呢，在这样的缺点面前，我们还有另外两个解决方案

1. 出门执行任务前，先挑选你的装备: 比如我今天是去猎杀恐龙，那么我带的装备一定是和去滑雪不一样的。但是这层判断就显得AI不是那么“智能”了！
2. distributed agent(A2A): 先由一个总管agent 决定调用的agent 库，甚至这个决策agent 可以是多层的决策，从粗到细，层层往下，最终到执行tool的agent，我们可以说这层具备执行能力的agent 叫“基层”。哈哈哈

## 公司的老总们，很快就能像管人一样管agent了

公司的老总们，站在A2A的思考框架下，就能像思考维服务一样，把一个一个的基层agent作为出发点，当基层agent 达到一定数量之后，再对业务进行一定的抽象，在数量总多的基层agent之上开发一个manager agent做更大的事情。

AI的微服务来的如此之快，我估计这里面的原因跟ai“像”人是有关的，将来公司的软件部门的管理，能够很容易的把软件当作“人”来看，当作“人”来管。
