---
title: Agentic Git Sync
subtitle: Obsidian 插件
category: product
order: 4
status: 已上线
description: Obsidian 与 GitHub 双向同步插件，面向不懂 git 的笔记用户。支持 submodule，AI 自主解决冲突与 git 错误。
date: 2026-02-01
tags: [obsidian, plugin, ai]
icon: /assets/img/projects/agentic-git-sync/icon.png
cover:
obsidian: https://community.obsidian.md/plugins/agentic-git-sync
repo: https://github.com/leweii/agentic-git-sync
---

## 简介

为不懂 git 的 Obsidian 用户做的 GitHub 双向同步插件。核心是三件事：

## 核心特性

### 支持 submodule

把 vault 里任意一个文件夹映射成独立的 GitHub repo。私人笔记保持私密、`Projects/` 跟团队共享、`Blog/` 推到公开 repo，在同一个 vault 里各自有独立的远端和同步设置。加 submodule 只需一个对话框：粘 URL、输入文件夹名。

### AI 处理 GitHub 技术细节

把繁琐的 git 与 GitHub 配置交给 AI，用户几乎不需要理解底层概念。

- 连接诊断：token 有效性、repo 访问、git auth path 三层自动检测，用自然语言指出问题在哪一步
- 空 repo 自动初始化：粘 URL 即可，插件静默处理初始 commit 与首推
- AI 起草 commit message：DeepSeek 或 Gemini 读 diff 后生成语义化提交信息，可在提交前编辑
- AI 冲突解决：本地与远端分叉时自动尝试合并，仅在无法判定时弹出可视化对话框

### 无感双向同步

后台调度器周期性 pull 与 push，用户照常写笔记。Token 与本机状态留在 `.obsidian/`（不入 repo），远端配置与 submodule 列表写在 `.github-sync.json` 里随仓库走，换机器 clone 后配置自动恢复。

## 数据安全

密钥永不离开设备。Token 与本机状态写在 `<vault>/.obsidian/plugins/agentic-git-sync/data.json`，插件自带的 `.gitignore` 排除 `.obsidian/` 整个目录，token 不会进入任何 commit。

随仓库走的 `.github-sync.json` 只保存远端 URL、分支、AI 模型选择和 submodule 列表，schema 里完全没有 token 字段，结构上就没有泄露凭据的路径。

调用 AI 时只把 diff 发给所选模型，可配置路径模式排除敏感文件，避免笔记正文外泄。所有 git 操作在本地执行，除你显式配置的 GitHub 仓库与 AI provider 外，插件不向任何第三方发送数据。
