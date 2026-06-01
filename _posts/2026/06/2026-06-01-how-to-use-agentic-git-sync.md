---
title: "如何使用 Agentic Git Sync"
description: 一个让非工程人员也能享用 Git 同步与协作能力的 Obsidian 插件，支持个人多设备同步和团队 PR 协作两种模式。
create_time: 2026-06-01 10:00
tags:
  - tech
  - workflow
  - obsidian
published: true
---

## Agentic Git Sync 是什么？
Agentic Git Sync 是一个 Obsidian 插件，它的出现是为了降低非工程人员使用 Git 的门槛。Git 一定是 2026 年文本同步、协作最好用、最全面的工具之一，但是唯一的缺点就是过于面向工程人员，有一定的上手门槛。
Agentic Git Sync 就是能够利用模型的能力，对 Git 使用流程中遇到的问题进行决策。
### 个人模式
个人模式下，整个插件只关心云端多设备同步功能，对于没有团队协作需求的小伙伴，可以开启个人模式。
个人模式下，整个插件会相对干净整洁，没有多分支管理，没有创建 PR 等复杂功能。使用也极其简单，如果配置合理，用户甚至感受不到插件的存在。

### 团队模式
团队模式包含个人模式的所有功能，同时还支持创建 PR、多分支支持（最多支持两个分支）个人分支和团队 upstream 分支，多分支 merge（merge from 团队 upstream 分支到本地个人分支）。

团队模式下的一些基本概念（basic concept）是：

1. 个人知识库，永远保持 private，永远从 default 分支同步。
2. 团队 upstream 分支作为知识库的基线，一直由对应的负责人管理，利用 merge PR 和负责人 push 往前更新知识。
3. 个人保持一个分支，任何在此分支的改动，都只影响个人知识库，遇到有需要同步个人知识库到团队的情况下，利用 PR 进行 review 和 merge。
4. 不同知识库以 submodule 的形式 checkout 到本地。
5. 个人无论是用什么方式对文档进行索引——比如利用图数据库创建索引，还是用各种第三方工具创建索引——都只在本地进行，无需同步这部分索引数据到团队知识库里。

团队协作势必要遵守一定的合作公约，比如：
1. 只有知识库的负责人，才允许直接 push 文档到 default 分支
2. 非负责人，在本地，只允许 checkout 个人分支
3. 如果非负责人需要更新知识库的基线，需要通过 PR 的方式来提交

## 设置

### Step 1: 准备 Git Token
创建 GitHub 账号（不做赘述）

进入 GitHub → profile（右上角头像）→ Settings → Developer Settings → Personal access tokens

![Image](/2026-06-01-how-to-use-agentic-git-sync/1.png)

也可以直接登录之后[点击这里](https://github.com/settings/apps)。

值得注意的是，如果你要使用个人模式，无论是 Fine-grained tokens 还是 Tokens (classic)，都能用。

但是如果你要用团队模式，建议使用 Tokens (classic)，因为两种 token 管理 repo 的 scope 设置不同，Fine-grained tokens 管理的 scope 只作用于同一个 GitHub organization，如果我们的不同 submodule 在不同的 organization 下，一个 Fine-grained tokens 是不够用的，目前我没有支持 per submodule token 的计划，所以建议要使用团队模式的朋友直接申请 Tokens (classic) 的 token。

所以，这里我们选择 Generate new token (classic)

![Image](/2026-06-01-how-to-use-agentic-git-sync/2.png)

填写必要的信息

![Image](/2026-06-01-how-to-use-agentic-git-sync/3.png)

生成 token

![Image](/2026-06-01-how-to-use-agentic-git-sync/4.png)

拷贝 token，保存好（待会设置 Agentic Git Sync 的时候，需要用到）

![Image](/2026-06-01-how-to-use-agentic-git-sync/5.png)

### Step 2: 创建 Git Repo

Git repo 是知识库远程代码托管的基本单位，常常以项目为维度进行管理，软件工程发展这么多年，已经衍生出了无数种管理流程，GitHub Flow、Git Flow、Trunk-based Flow，有关这些 Flow，感兴趣的同学可以自行了解。

我的看法是，在一个小团队（10 人以下）里，我们只需要使用最简单、最基础的管理方式，就能覆盖我们 90% 以上的同步场景。就是一个主分支 + 个人分支。

从这里开始，我们介绍个人（private repo）知识库，不同设备间同步的设置方式：

只需要在 GitHub 的个人首页点击 New 即可创建：

![Image](/2026-06-01-how-to-use-agentic-git-sync/6.png)

Owner 定义了这是一个个人，还是一个团队知识库，个人的选择自己，团队的选择对应的团队即可：

![Image](/2026-06-01-how-to-use-agentic-git-sync/7.png)

- Repository name 是这个知识库的名字，简单理解就是你知识库的文件夹名字。
- Choose visibility：是否公开，个人的情况要选择 private，团队默认是公开给组织里的用户，对公众 private 的。
- 剩下的设置可以根据需求自行选择。

创建好了之后，进入对应的 repo 详情页，获取同步地址。git repo 是一个允许你同步文件的服务地址，它的格式类似
`https://github.com/demo/myknowledge.git`
这个就是一个知识库远程 Git 的唯一地址。

![Image](/2026-06-01-how-to-use-agentic-git-sync/8.png)

### Step 3: 安装设置 Agentic Git Sync

在 Obsidian 里，输入 `cmd + ,`（Mac）、`Ctrl + ,`（Windows），打开设置。

开启第三方插件。

浏览搜索 Agentic Git Sync，点击下一步下一步，安装它！

![Image](/2026-06-01-how-to-use-agentic-git-sync/9.png)

把 Git token 粘贴到 Obsidian 设置页面：

![Image](/2026-06-01-how-to-use-agentic-git-sync/10.png)

把 repo 地址粘贴到 Obsidian 设置页面：

![Image](/2026-06-01-how-to-use-agentic-git-sync/11.png)

### Step 4: 设置模型 Key
提供模型 token，能够让 Agentic Git Sync 插件拥有 Agent 的能力，其中包括：
1. 自动解决冲突
2. 自动生成 commit title + commit message
3. 自动解决 pull/push 中遇到的任何问题，比如 Git 规定每个分支需要 fast-forward

设置对应的 key，目前不支持自定义模型类型，均使用对应 provider 的最强模型，毕竟这个插件并不会用到很多 token。

![Image](/2026-06-01-how-to-use-agentic-git-sync/12.png)

### Step 5: 设置 Submodule
当我要引入更多知识库（比如别人维护的知识库），我就需要添加 submodule。submodule 允许我们以独立的 repo 进行管理，而且在文件路径上，它是在当前 Obsidian vault 里的。

点击加入子模块，填入对应数据。

![Image](/2026-06-01-how-to-use-agentic-git-sync/13.png)

团队模式下，我们需要填入一个本地分支和一个基线分支。
- 本地分支：本地 checkout 的数据
- 基线分支：作为 source of truth，也就是 git repo 里的 default branch

在我的管理框架下，只有负责人能够直接给基线分支提供知识，其他人都需要通过创建 PR 的模式来提交对基线的修改。PR 都需要通过负责人的 review。

所以负责人的视角看：
1. 本地分支设置为 default 分支，比如 main
2. 基线分支不必设置

从非直接维护本知识库的人员视角来看：
1. 本地分支设置为个人分支，比如 jakob
2. 基线分支设置为 default 分支，比如 main

提交保存之后，插件会自动开始拉取最新的数据。

## 使用

### 基本功能

插件支持静默式同步，对于个人来说，静默式（定时同步）是最佳使用方案。在设置页面，设置一个默认同步的时间，定时同步。

除了同步以外，插件还提供了一些别的能力，点击 Agentic Git Sync 按钮，就能在右边的 panel 里打开插件主界面。

#### 追踪文件历史

每次选中某个文件，右侧都会显示所有同步过的历史，插件还提供了比较的界面，方便用户查看不同时间的区别：

![Image](/2026-06-01-how-to-use-agentic-git-sync/14.png)

#### 多个设备之间的同步
对于有多个设备同步需求的同学，需要在不同设备上，设置一下 repo 地址和 token 即可。

对于同时使用 iCloud 同步的同学，设置也会自动同步，只需要安装对应插件，一旦 iCloud sync 完成，插件会自动把所有设置同步到不同设备之间。

或许你会问，我都用 iCloud 了，为什么还要用 git sync？我的回答是：
1. Git 能追踪历史
2. Git 能提供一个重要的个人私有备份
3. Git 免费

这些都是 iCloud 不具备的能力。

对于个人用户，所有介绍到此就完结了。

### 团队进阶功能
#### 自动同步
系统的自动同步功能，会定期拉取基线分支的信息，包括主知识库和所有 submodule 的基线知识。

#### 自动 Merge
同步的动作，会自动把基线的知识，作为 source of truth merge 到个人的本地知识库里。这里遵循的原则是，负责人提供最重要的需要全团队同步的信息，所有人都"被迫"更新到最新的知识。

#### 修改意见（Pull Request）
如果任何成员，发现某些知识不再准确，他们都可以在个人的本地知识库里进行修改。但是如果要把自己的修改意见同步到知识库的基线，也就是同步到所有同事的本地知识库里，他们需要创建一个修改意见（Pull Request）。

![Image](/2026-06-01-how-to-use-agentic-git-sync/15.png)

知识库的负责人可以通过 Git 提供的分支对比页面进行 review，并且最终决定 reject 还是 approve。

## 完

这个插件 Agentic Git Sync 的初衷是让非工程人员完全远离 Git 相关的技术术语，又能享有 Git 所带来的便利。如果你作为非工程人员，在使用过程中遇到了难以理解的概念，请在此留言，提交改进意见。
