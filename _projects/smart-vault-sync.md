---
title: Smart Vault Sync
subtitle: Obsidian 插件
category: product
order: 4
status: 进行中
description: AI 辅助的 Obsidian 与 GitHub 双向同步插件，支持嵌套文件夹作为独立 repo（submodule），全程零终端命令。
date: 2026-02-01
tags: [obsidian, plugin, ai]
icon: /assets/img/projects/smart-vault-sync/icon.png
cover:
obsidian: https://obsidian.md/plugins?id=smart-vault-sync
repo: https://github.com/leweii/obsidian-github-sync
---

## 简介

大多数基于 git 的 Obsidian 同步插件默认你懂 git。这个不。三件事让它不一样：

### 🧩 真正的 submodule 支持，不只是单 repo

把 vault 里任意一个文件夹映射成它自己的 GitHub repo。私人笔记保持私密、`Projects/` 跟团队共享、`Blog/` 推到公开 repo——都在同一个 vault 里，各自有独立的同步设置。加 submodule 就一个对话框：粘 URL，输入文件夹名，搞定。

### 🤖 AI 起草的 commit message

内置且可选。让 DeepSeek 或 Gemini 读你的 diff，提一条干净的语义化 commit message（`feat: …` / `fix: …` / `docs: …`）。你可以在提交前编辑。Token 留在本地，只把 diff 发给 LLM，并且可以排除任意路径模式。

### 👶 为不懂 git 的用户而设计

- **Setup wizard** 一步步引导：token → 身份 → 第一个 repo 连接
- **token 输入框旁边的 `?` 图标** 直接打开 GitHub 创建 PAT 的页面——不用知道什么是 personal access token
- **空 repo 自动初始化** — 在 github.com 新建 repo、粘 URL、点 Add，插件会静默种入一个 README，避免「branch yet to be born」错误
- **Test connection** 三层诊断（token 有效性、repo 访问、实际 git auth path），用人话告诉你哪一步在卡
- **Conflict UI** — 本地与远端分叉时给三栏可视化解决对话框，而不是磁盘上一坨半合并的 repo

## 数据存储

| 文件 | 位置 | 内容 | 是否随 repo |
| --- | --- | --- | --- |
| `data.json` | `<vault>/.obsidian/plugins/smart-vault-sync/` | Token、同步历史、本机状态 | ❌ 仅本地 |
| `.github-sync.json` | `<vault>/` | 远端 URL、分支、AI 模型选择、submodule 列表 | ✅ 提交（换机器 clone 后自动恢复配置） |

**密钥永不离开设备。** 插件自带的 `.gitignore` 排除 `.obsidian/`，并且 `.github-sync.json` 的 schema 里完全没有 token 字段——结构上就没有泄露凭据到 commit 的路径。
