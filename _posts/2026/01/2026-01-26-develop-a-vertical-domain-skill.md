---
title: "Develop a vertical domain skill"
description:
create_time: 2026-01-26 00:00
tags:
  - skill
  - claude-code
published: true
---

## 知识库要达到的效果

1. 能够很好地检索到关键的业务知识
2. 能够很好地控制它的内容，比如更新、rollback
3. 知识库必须能够溯源，这是避免出现幻觉的唯一出路

---

## 我有的信息

1. **数据**：数据可以结合 Google Cloud Dataplex 的服务，对现有的数据进行一定的分析
2. **业务**：业务知识文档
3. **代码**：代码是最实时的当前逻辑，如果 Claude 能非常准确地读取翻译代码为业务，我就能很好地管理我的 skill
4. **开发 skill 的 skill 们**（这个是技能，不必多说）

> 从粗到细分别是：**数据 -> 业务 -> 代码**

我们开发任何东西，都是从粗到细的。所以顺序也很好说了。

至于粒度，我要研究一下 skill 的粒度可以定义到什么程度。那么这个问题就是：

> **如果要将一个庞大的业务模型开发成 skill，那么 skill 粒度应该是怎样的？**

经过调研，我们必须很好地利用 skill 的 reference 功能，把每个模块拆分清楚。

---

## 步骤

### Step 1: 找到一个切入点——数据库

遍历所有 cookbook 领域的 tables。

```
list all tables in wonder-recipe-prod.recipe_v2
put them in a md, called cookbook_bq_tables.md
```

### Step 2: 划分领域

根据主要的数据节点和主要的数据表，进行领域划分。

```
⏺ Cookbook Domain
  ├── Item (item_versions) ─────────── Core entity, all food-related data
  ├── BOM (Bill of Materials) ──────── Components and quantities to produce an item
  ├── Line Build ───────────────────── Cooking/assembly instructions
  ├── Customization ────────────────── Customer choice options
  ├── Units of Measure ─────────────── Multiple UOMs for different contexts
  ├── Cost & Pricing ───────────────── Item costs and menu prices
  ├── Shelf Life & Food Science ────── Shelf life and food science parameters
  ├── Inventory & Storage ──────────── Inventory tracking and storage
  ├── Concepts & Routes ────────────── Restaurant brands and delivery routes
  ├── Nutrition & Allergens ────────── Nutrition info and allergen data
  └── Related Datasets ─────────────── BigQuery datasets
```

### Step 3: 知识库结构

于是我们有这样的一个知识库结构：

```
⏺ .claude/skills/wonder-cookbook/
  ├── SKILL.md                          # Main entry point - index & quick start
  ├── common-pitfalls.md                # ❌/✅ Wrong/right patterns
  ├── schema-reference.md               # Complete table schemas
  │
  ├── core/                             # Core concepts
  │   ├── bom-components.md             # BOM structure, nested JSON pattern
  │   ├── item-master.md                # item_versions, prefixes, essential filter
  │   └── service-windows.md            # Recipe versioning
  │
  ├── domains/                          # Functional domains
  │   ├── assembly-instructions.md      # Assembly after cooking
  │   ├── cost-pricing.md               # ✨ NEW - Costs, prices, margins
  │   ├── customization.md              # ✨ NEW - MANDATORY_CHOICE, OPTIONAL_ADDITION
  │   ├── food-science.md               # Shelf life, storage
  │   ├── line-build.md                 # Kitchen prep, activity types
  │   ├── nutrition.md                  # Nutrition facts, allergens
  │   ├── recipes-procedures.md         # Cooking instructions
  │   └── units-of-measure.md           # ✨ NEW - UOM conversions
  │
  ├── cross-system/                     # Integration with other systems
  │   ├── orders-integration.md         # Cookbook → Orders/Sales
  │   └── pantry-integration.md         # Cookbook → Inventory
  │
  └── reference/                        # ✨ NEW folder
      └── datasets-overview.md          # ✨ NEW - 4 datasets, 70+ tables
```

### Step 4: 验证——Review 你的知识库

- 把你收集的各式各样的 case，复杂的、简单的，都扔到知识库下跑一跑
- 让你的产品用对谈、面试的方式，验证一下这个知识库是否有幻觉
- 找到你的**产品经理**，让他一行一行 review，这些知识是否合理？
- 找到你的**技术 leader**，让他看一看数据结构是不是跟真实情况一致？

### Step 5: 按 Domain Cross Check 文档验证阶段

这个步骤取决于你有什么文档。

我有一个大而全的业务文档，于是我就这么问了一下：

```
/superpowers:write-plan 按 domain 遍历，检查这个页面下的所有文档，cross check skill 的准确性
  https://your-confluence.atlassian.net/wiki/spaces/YOUR_SPACE
```

我有一个收集了许久的用例文档，收集了许多疑难杂症的 SQL。于是我把他们都统一加入到了 example 里：

```
这个文档下有许多平时收集到的 SQL example
https://your-confluence.atlassian.net/wiki/spaces/YOUR_SPACE/pages/xxx/Useful+Query
学习、归纳、总结，把有价值的 SQL 加入你的 skill 里，作为 example。如果有业务不符合的部分，highlight to me for review。
```

### Step 6: 代码阶段

是的，数据库并非是最实时的数据体现。比如我删了一个字段，我并不想立刻从数据库里删除，真正最新的东西永远是在代码里的。

我最后就是要利用代码，利用各种代码中的使用情况、标注情况，对 skill 再进行一次 cross check。

### Step 7: 持续迭代你的知识库

当某个任务完成之后（发布之后），我们必须将对应任务的知识 summarize 并且上传到这个集中管理的知识库之中。

这是一个很值得一直讨论的问题，或许需要单开一个博客来讨论。Maybe in the future。

### Step 8: 评估 Token

```
评估这个 skill 的 token
```

---

## 思考（Q&A）

### Q1: For different purpose, we should have different skill?

我不觉得是如此。每维护一个知识库，带来的是巨大的维护工作，即便不是真人在维护，也是需要 token 来烧的。

**结论**：从企业的角度看，应该是**一个知识库**。

### Q2: 那么，什么样的工作模式是我们将来可能的工作模式呢？

无论完整的模式是如何，我认为，工作开始的第一步一定是**检索、挑选**你需要的领域知识。实际工作中，就是挑选 domain 到你的临时工作空间（分支），然后进行特定领域的工作。

我从来就不应该拿着全部互联网的知识来做一件简单的事情，而是拿着能够解决问题的**最小量知识**来解决问题。

> 举个例子，当你徒步、当你出兵打仗的时候，你都会根据地形、根据环境，挑选你的装备、你的背包、你的鞋子，以应对你可能遇到的问题。

在这个虚拟的世界里，你就算临时加入一些 domain 也完全不影响你的工作。与其一开始就加载一个大而全的知识库，不如合理地挑选要跟你一起出征的 **skill 伙伴**。

### Q3: 这么一个知识库，如何更新迭代？迭代的过程中，引用了并未上线的知识，会怎样？

如果知识库引用了未上线的知识，Claude 可能会基于"未来状态"给出错误的答案——比如查询一个还不存在的字段，或者使用一个还未部署的 API。

为了避免这样的事情发生，一定要 **cross check 代码和知识**。知识库的更新应该跟随代码发布节奏，而不是提前。
