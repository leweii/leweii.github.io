---
title: "AI Agent 专题 - 自建一个MCP服务"
date: 2025-08-11 00:00:00 +0000
categories: [ai, agent]
tags: [ai, agent, mcp, adk]
published: true
description: 或许有一天，你也要搭建一个自己的MCP服务。
---

## Background

作为上一篇文章[个人代理](https://www.jakobhe.com/posts/personal-agent/)的延续，今天我们来build 一个自定义的MCP 服务。

### 为什么要自建？
当我有某个基础服务，需要给多个agent 提供能力时，或者有些服务是业务垂直的，仅仅在我的公司里有许多用处，我就需要一个MCP服务来统一管理这些能力。

### 一个MCP服务需要什么？

Must have:
- 定义tools上下文的能力：能够定义符合Model Context Protocol规范的tools
- 具备tools的执行能力：能够与tools集成
- 会话状态管理的能力

Better to have:
- 支持多种不同的连接方式，比如websocket, http, grpc等
- 支持不同的认证方式，比如token, oauth等

### MCP服务不需要什么？
MCP 服务是一个很简单的执行层，它并不需要任何llm的能力。

## 咸盐少许，我们开始
这个例子里，我们还是使用ADK来搭建我们都MCP 服务。

实现一个MCP 需要实现list tools 和call tools的方法

在adk里，就是通过这两个注解来告诉框架，调用哪个方法。
- @app.list_tools()
- @app.call_tool()


### @app.list_tools()
list tools 能够允许你列出，你希望agent知道的tools。例子里我们用现成的tool，来自googl的tool库。

https://google.github.io/adk-docs/api-reference/python/google-adk.html#module-google.adk.tools

> load_web_page tool：Fetches the content in the url and returns the text in it.

根据文档描述，load_web_page tool是以文字方式获取网页内容的一个功能。

```python
adk_tool_to_expose = FunctionTool(load_web_page)

# Implement the MCP server's handler to list available tools
@app.list_tools()
async def list_mcp_tools() -> list[mcp_types.Tool]:
    """MCP handler to list tools this server exposes."""
    print("MCP Server: Received list_tools request.")
    # Convert the ADK tool's definition to the MCP Tool schema format
    mcp_tool_schema = adk_to_mcp_tool_type(adk_tool_to_expose)
    print(f"MCP Server: Advertising tool: {mcp_tool_schema.name}")
    return [mcp_tool_schema]
```

### @app.call_tool()
这是执行的实现

```python
# Implement the MCP server's handler to execute a tool call
@app.call_tool()
async def call_mcp_tool(
    name: str, arguments: dict
) -> list[mcp_types.Content]:
# ...
```
### 启动MCP 服务
MCP本质是个服务， ADK提供了多这个服务的种连接方式
- sse
- streamable_http
- websocket.py
例子里我们还是使用sse 来创建连接。sse 需要实现的是`Route("/sse", endpoint=handle_sse, methods=["GET"]),`

```python
# Define handler functions
async def handle_sse(request):
    async with sse.connect_sse(
        request.scope, request.receive, request._send
    ) as streams:
        await app.run(
            streams[0], streams[1], app.create_initialization_options()
        )
    # Return empty response to avoid NoneType error
    return Response()

# Create an SSE transport at an endpoint
sse = mcp.server.sse.SseServerTransport("/messages/")

# Create Starlette routes for SSE and message handling
routes = [
    Route("/sse", endpoint=handle_sse, methods=["GET"]),
    Mount("/messages/", app=sse.handle_post_message),
]

if __name__ == "__main__":
    # Create and run Starlette app
    starlette_app = Starlette(routes=routes)
    uvicorn.run(starlette_app, host="127.0.0.1")

```

run python
```shell
python3 mcp_server/my_adk_mcp_server.py
```

![Image](/2025-08-11-build-you-own-mcp/1.jpg)

### 调试

我们能通过postman调试mcp。只需要创建新请求的时候选择mcp

![Image](/2025-08-11-build-you-own-mcp/2.jpg)

请求我们的mcp 服务之后，就能拉到所有的tools。点击tool就能执行tool。

![Image](/2025-08-11-build-you-own-mcp/3.jpg)

![Image](/2025-08-11-build-you-own-mcp/4.jpg)

结果是糟糕的，页面元素之复杂，导致返回的文字基本不可读。但是流程是通顺的。接下来的事情就是不停的优化这个tool的执行效果。

## 一些想法

我们常常使用的是所谓的通用大模型，它适合用于处理一些通用和共识的问题，比如mysql，java这类技术问题，全世界的java 都有一样的knowledge base。

但是当我们要在垂直行业里，使用通用大模型时，企业就显得捉襟见肘了。

MCP恰恰就是提供这类垂直行业的执行能力的服务。比如我们公司有我们公司的特定开发流程，先从jira开始，到产品，到开发，到测试。但是在餐饮行业，这个流程很可能是一个完完全全不一样的流程。 假设是：竞品调研，内部讨论，产品设计，开发，测试，发布。

恰好我们公司特地为了竞品调研开发了一个系统，那么竞品调研就可以是一个tools深度的集成在许多agent里，比如menu R&D，市场策略定制，等等。根据不同workflow和工作需求，这个tool被agent们不停的调用着。