---
title: "AI Agent 专题 - 自建一个MCP服务"
date: 2025-08-11 00:00:00 +0000
categories: [ai, agent]
tags: [ai, agent, mcp, adk]
published: false
description: 
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

它不需要，llm的调用权利。

## 先盐少许，我们开始
这个例子里，我们还是使用ADK来搭建我们都MCP 服务。

