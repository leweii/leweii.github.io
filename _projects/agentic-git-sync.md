---
title: Agentic Git Sync
subtitle: Obsidian 插件
category: product
order: 1
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

### AI Agent 处理 Git 技术细节

把繁琐的 Git 操作全权交给 AI。

- AI 冲突解决：本地与远端分叉时自动尝试合并，仅在无法判定时弹出可视化对话框
- Git 操作诊断：不是fast forward？需要git merge before push？这些git使用规范你都不需要了解，Agentic 驾驭一切。
- AI 起草 commit message：DeepSeek 或 Gemini 读 diff 后生成语义化提交信息，可在提交前编辑
- 空 repo 自动初始化：粘 URL 即可，插件静默处理初始 commit 与首推

### 适配个人数据同步/团队协作的场景
既保护了个人隐私，又能高效的适配团队协作，相互独立，互不干扰。

- 个人的知识永远保持私有
- 与团队共享的知识课通过submodule维护
- 用户友好冲突管理界面
- 简单易懂的个人分支与团队主分支管理机制

### 无感双向同步

后台调度器周期性 pull 与 push，用户照常写笔记。Token 与本机状态留在 `.obsidian/`（不入 repo），远端配置与 submodule 列表写在 `.github-sync.json` 里随仓库走，换机器 clone 后配置自动恢复。

## 数据安全

密钥永不离开设备。

