# Calibration Cases

固定一组样例,**每季度全员独立跑相应 skill 一遍**,对比判定差异。漂移 > 30% 的 case 进 retro 讨论,要么收敛对 baseline 的理解,要么修 SKILL.md 的判定规则。

本文件分五部分:

- **Cases 1-6**:`dev-code-review` 的 P0 / P1 / P2 判定校准。
- **Cases 7-8**:`dev-grill-docs` / `dev-spec` 兼容入口的 ambiguity 维度评分校准。
- **Cases 9-10**:`dev-plan` 的 Critic verdict(APPROVED / REVISE / REJECT)校准。
- **Cases 11-12**:`dev-fix` 的 escalation 决策(BELOW vs continue)+ Defense-in-depth 边界判断。
- **Cases 13-14**:`dev-auto` 的 path/complexity 分类 + `--recover` 决策路径。

---

## 用法

1. 团队成员各自打开本文件,**只看 diff 段,不要先看 canonical 答案**。
2. 想象你正在跑 dev-code-review,默写 verdict + axis check + findings。
3. 全员写完再翻到答案区,对比差异。
4. 在 retro 里讨论:**和 canonical 不同的人,你的判断依据是什么**?baseline / CLAUDE.md / 个人偏好?
5. 收敛后,如有需要修 SKILL.md 或 baseline,走 CONTRIBUTING 流程。

---

## Case 1 — Secret 泄漏

**Diff(假设这是 staged 改动)**

```diff
+# config/production.env
+DATABASE_URL=postgresql://admin:Sup3rS3cret@prod-db.example.com:5432/app
+STRIPE_SECRET_KEY=sk_live_51N8x...redacted...8ZRq
+SENTRY_DSN=https://abc123@sentry.io/12345
```

**Canonical answer**:`❌ BLOCK`,P0 安全。

`Findings`:
- `[P0] config/production.env:1-3 规范 真实生产 secret 写入 git,DATABASE_URL / STRIPE_SECRET_KEY 含可用凭证 → 立即从 working tree 移除,改用 .env.example 占位 + 密钥管理服务(Vault / AWS Secrets Manager / 项目内已有方案)。本 commit 不应进入 history;若已 push 必须 rotate 全部泄漏 secret 并清理 git 历史。`

**为什么 BLOCK**:dev-baseline 第 1 条「不假设」要显式;但 secret 泄漏属于硬规则(CLAUDE.md §1),无任何「也许 OK」的解读空间。

**常见误判**:有人会判 P1(认为「config 文件嘛,等会儿删」)—— 错。一旦 commit,即使后续删除,git 历史里仍有,必须按已泄漏处理。

---

## Case 2 — 未闭环(新 service 没 caller)

**Diff**

```diff
+// lib/services/order_service.dart  (新文件,42 行)
+class OrderService {
+  Future<Order> placeOrder(Cart cart) async {
+    return await _api.post('/orders', cart.toJson());
+  }
+
+  Future<List<Order>> listOrders(String userId) async {
+    return await _api.get('/orders?user=$userId').then(...);
+  }
+}
```

**关键检查**:`git grep "OrderService" -- ':!lib/services/order_service.dart'` → 0 条匹配。
不在框架豁免清单(非 test、非 lifecycle override、非 DI 注解)。

**Canonical answer**:`❌ BLOCK`,P0 闭环。

`Findings`:
- `[P0] lib/services/order_service.dart:1 闭环 OrderService 无任何 caller(grep 0 匹配),非框架豁免 → 在 checkout flow 接入,或本次 commit 不引入该 service。`

**常见误判**:
- 判 P1(「私有未用代码」):错,public symbol 应判 P0。
- 判 ✓(「我打算下个 commit 接入」):错,**闭环是二值的**,本次 commit 不闭环就不算闭环。

---

## Case 3 — Scope creep

**用户说**:「修个 cart 计算 off-by-one。」

**Diff**

```diff
- total += items.length - 1;
+ total += items.length;

# 同一文件 line 1-12,import 全部重排
- import 'package:flutter/foundation.dart';
- import '../models/item.dart';
- import 'cart_item.dart';
+ import 'cart_item.dart';
+ import '../models/item.dart';
+ import 'package:flutter/foundation.dart';
```

**Canonical answer**:`⚠ FIX P1`,scope creep。

`Findings`:
- `[P1] lib/cart/cart.dart:1-12 规范 import 重排与 off-by-one 修复无关,违反 surgical 原则 → 本 commit 仅保留 line 84 的 off-by-one 修改;import 重排单独 chore commit。`

**常见误判**:
- 判 ✓(「都是改进」):错,违反 baseline 第 3 条「外科手术式改动」。
- 判 P2(「小事」):错,这是 P1 因为它会污染 git blame。

---

## Case 4 — TypeScript 缺边界 case

**Diff**

```diff
+ export function parseUserId(input: string): number {
+   return parseInt(input);
+ }
```

**调用上下文**:`parseUserId(req.query.userId)` —— 来自 HTTP query,可能为 `undefined` / `''` / 非数字。

**Canonical answer**:`⚠ FIX P1`,功能。

`Findings`:
- `[P1] src/utils/parse.ts:1 功能 parseInt 对 undefined / '' / 'abc' 返回 NaN,调用方未防护 → 改为 parseInt(input, 10),空值返回 null/undefined,在调用方显式校验或抛 ValidationError。`
- `[P1] src/utils/parse.ts:1 规范 parseInt 缺第二参数 radix → 加 radix=10。`

**常见误判**:
- 判 ✓(「parseInt 能跑」):错。能跑 ≠ 闭环 ≠ 正确;baseline 第 4 条要求可验证成功标准。
- 判 P0(「线上肯定崩」):一般不到 P0,因为 NaN 不会立刻 crash —— 取决于下游怎么处理。如果下游有 `if (!userId)` 检查,P1 就够;如果下游直接 `db.find({id: NaN})` 会爆,升 P0。**这种边界判断本身就是 calibration 要讨论的**。

---

## Case 5 — 残留调试 + 注释

**Diff**

```diff
+ export function formatCurrency(n: number): string {
+   console.log('[formatCurrency]', n);   // 测试用
+   // TODO: 想想要不要支持其他货币
+   // 这个函数把数字转成美元字符串
+   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
+ }
```

**Canonical answer**:`⚠ FIX P1`。

`Findings`:
- `[P1] src/utils/format.ts:2 规范 残留 console.log 调试输出 → 删除。`
- `[P2] src/utils/format.ts:3 注释 TODO 无 owner / ticket → 删除或改为 TODO(jason, #123): ...`
- `[P2] src/utils/format.ts:4 注释 「把数字转成美元字符串」是复述代码,无信息量 → 删除;若想说明 why,改为 invariant / 业务原因。`

**常见误判**:
- TODO 判 P1:不到 P1,P2 即可。
- 注释判 P0:严重夸大;注释问题最高 P1(stale 误导才到 P1)。

---

## Case 6 — 干净的小改(应判 ✅ READY)

**用户说**:「修个 README typo,加一条单测覆盖空 cart 的边界。」

**Diff(节选)**

```diff
- # Welcom to MyApp
+ # Welcome to MyApp

+ test('checkout with empty cart returns ZERO_ITEMS error', () => {
+   const result = checkout([]);
+   expect(result).toEqual({ ok: false, code: 'ZERO_ITEMS' });
+ });
```

**Canonical answer**:`✅ READY`。所有轴 ✓,Findings: none,出 commit message。

```
Commit
  docs: fix README typo and add empty-cart coverage
```

**常见误判**:
- 一定要找 P2 凑数(「测试 description 太长」「README 排版」):错。**baseline 第 1 条要求不假设、不夸大**;没问题就是没问题。

---

## Case 7 — dev-grill-docs ambiguity 评分(完整需求 → 应低分)

**用户原始请求**

> --default 给后台管理员加一个 CSV 导出按钮,导出当前用户列表(id / 邮箱 / 注册日期 / 状态)。同步导出,< 1000 行用户,失败返回 500。

**关键检查**:Wave 1 / Wave 2 应该如何打分?

**Canonical answer**(Wave 2 起打分):

```
| 维度 | 分数 | 权重 | 加权 | gap |
|---|---|---|---|---|
| Goal | 0.9 | 0.43 | 0.387 | clear |
| Scope | 0.85 | 0.28 | 0.238 | 仅缺鉴权细节(谁能用) |
| AC | 0.8 | 0.29 | 0.232 | clear,但缺数字目标(P95 时延) |
| **Ambiguity** | | | **14.3%** | ≤ 30% ✓ |
```

应该 Wave 1 完后**立刻达标**(`--default` 阈值 0.30)→ 直接进 Step 2,不应继续多 wave。

**常见误判**:
- 给 Goal 0.6(「我觉得还不够清楚」)→ 错。用户已显式说了字段、量级、错误返回。Goal 0.9 合理。
- 强行多问几轮凑「认真感」→ 错。违反 baseline「最小流程」,简单需求 wave 1 即达标是预期行为。

---

## Case 8 — dev-grill-docs ambiguity 评分(模糊需求 → 应高分,Goal 最弱)

**用户原始请求**

> --default 把搜索做快一点。

**Canonical answer**(Wave 2 起):

```
| 维度 | 分数 | 权重 | 加权 | gap |
|---|---|---|---|---|
| Goal | 0.2 | 0.43 | 0.086 | 「快」是 latency / throughput / 感知 都不明 |
| Scope | 0.3 | 0.28 | 0.084 | 影响面未定(后端 / 前端 / 索引) |
| AC | 0.1 | 0.29 | 0.029 | 完全没数字目标 |
| Context | 0.4 | 0.10 | 0.040 | 不知道现状基线 |
| **Ambiguity** | | | **76.1%** | (brownfield)远高于阈值 |

下一目标: AC (0.1) — 因为没有数字目标,后续没法判定「做完没」。
```

**常见误判**:
- Goal 给 0.5(「至少知道是优化搜索」)→ 错。Goal 不只是「知道在改什么」,是「成功具体长什么样」。「快」三义,Goal 必须 ≤ 0.3。
- 不打 Context(因为以为是 greenfield)→ 错。「现有搜索」就是 brownfield 信号,Context 必打。

---

## Case 9 — dev-plan Critic 应 APPROVED

**Plan 摘要**(Planner v1 + Architect challenge v1 后)

```
### Viable options
**Option A: 加索引 + LRU 缓存**(favored)
- 改动:src/search/indexer.py:42(新加 idx_email),src/search/cache.py(新文件)
- Pros: 改动小,P95 应能从 800ms 降到 < 200ms
- Cons: 缓存一致性需注意

**Option B: 接 Elasticsearch**
- Pros: 可扩展性最强
- Cons: 新基础设施,运维成本,1.5 月窗口赶不上
- Verdict: rejected — 上线时间约束

### Implementation steps
1. src/search/indexer.py:42-58 — 新增 idx_email 索引
2. src/search/cache.py — 新文件,LRU 1000 entry,TTL 60s
3. tests/search_cache_test.py — 新测试覆盖 cache hit/miss/expire

### Risks
- 缓存一致性:用户改邮箱后旧缓存仍有效 → 在 user.update() hook 里 invalidate
- LRU 规模估算偏差:1000 entry 不够 → 加 metric,monitor 后调整

### Verification
- AC-1: pytest tests/search_cache_test.py 全绿
- AC-2: 压测 search by email 100 QPS,P95 < 200ms(对比基线 800ms)
```

**Canonical answer**: Critic verdict **APPROVED**,允许进 Step 7。

理由:
- ✓ Principle-option consistency(simplicity → 选 A 而非 B 一致)
- ✓ Alternative exploration(B 有真 invalidation rationale)
- ✓ Risk mitigation clarity(每条 risk 对应一行 mitigation)
- ✓ AC testability(具体 P95 数字)
- ✓ Verification concreteness(给具体命令 / 测试名)
- ✓ File/line coverage(3 步全 cite)

**常见误判**:
- 强行找问题给 REVISE(「LRU 可能不够」)→ 错。Critic 不是无限挑刺,7 维度都过就该 APPROVED。Risks 段已经显式提到 LRU 规模估算偏差并给 mitigation。
- 升 deliberate 模式要求 pre-mortem → 错。本 plan 是默认模式,deliberate 才需要 pre-mortem。

---

## Case 10 — dev-plan Critic 应 REJECT(典型坏 plan)

**Plan 摘要**

```
### Viable options
**Option A: 重构搜索模块**(favored)
- Pros: 更好
- Cons: 工作量大

### Implementation steps
1. 重构 search 模块,提取通用组件
2. 加缓存层
3. 优化查询性能

### Risks
- 可能影响线上(加 feature flag)
- 性能可能不达预期

### Verification
- 跑测试看看
```

**Canonical answer**: Critic verdict **REJECT**(多维度失败)。

理由:
- ✗ Alternative exploration:只有 1 个 option,且无 invalidation rationale 解释为什么不考虑其他方案
- ✗ AC testability:没有 AC,「更好」「优化」都不可验证
- ✗ Verification concreteness:「跑测试看看」是空话,没具体命令 / 数字
- ✗ File/line coverage:0% cite —— 「重构搜索模块」是抽象目标,不是 implementation step
- ✗ Risk mitigation clarity:「可能影响线上」+「加 feature flag」太粗,没说怎么用 flag、回滚标准是什么

**常见误判**:
- 给 REVISE(「让 Planner 补补就行」)→ 错。这种 plan 不是「补几个细节」,是**根本性失败**(单 option / 抽象步骤 / 无 AC)。Critic 必须 REJECT 让 Planner 回去**重写**,而不是补丁式修。
- 给 APPROVED with notes → 严重错误。Critic 软通过等于让 baseline 失效。

---

## Case 11 — dev-fix escalation 决策(BELOW vs continue)

**场景**:用户跑 `dev-fix --deep` 修一个 race bug。已列 5 个 hypothesis,前 3 个高置信(H)的全被 evidence 证伪,后 2 个置信度 M/L 还没测。

**关键问**:此时该升级标 BELOW_CONFIDENCE_THRESHOLD,还是继续测后 2 个?

**Canonical answer**:**升级,标 BELOW_CONFIDENCE_THRESHOLD,STOP**。

依据 dev-fix Step 5 escalation 规则:**3 个高置信 hypothesis 都被 evidence 证伪 → 升 dev-plan --deliberate 评估架构改动**。后 2 个 M/L 假设已经不大可能命中(否则会先标 H);继续测大概率浪费时间,且这是**架构问题信号**而非 implementation bug。

**常见误判**:
- 「再试 H4 / H5」→ 错。escalation rule 是 **3 高置信 fail**,后续低置信测了也是徒劳的概率高。
- 「再列第 6 个 hypothesis」→ 错,违反 deep 模式上限 5 个。
- 「换 default 模式重跑」→ 错,deep 已是最大投入,降模式只会更弱。

正解是**承认是架构卡点**,出 BELOW_CONFIDENCE_THRESHOLD artifact + 转 dev-plan。

---

## Case 12 — dev-fix Defense-in-depth 边界判断(`--deep` mode)

**场景**:Root cause 是 `getUserById()` SQL 漏 select email 列,fix 后想加 defense-in-depth。考虑 4 种加法:

(a) 在 getUserById 调用方加 `if (!user.email) throw` 校验
(b) 在 DB 层把 email 列加 `NOT NULL` constraint
(c) 把整个 user repository 重写为 Repository 模式
(d) 在 getUserById 函数本身加 dataclass schema 校验返回值

**关键问**:哪些算 defense-in-depth 该加,哪些算 refactor 不该加?

**Canonical answer**:

| 选项 | 该加吗 | 依据 |
|---|---|---|
| (a) 调用方校验 | ✓ defense | 直接关联「防止 root cause 类型问题再现」(下次还有别的字段漏,调用方有兜底) |
| (b) DB NOT NULL | ✓ defense | 同上,DB 层兜底防止类似 schema 漏字段 |
| (c) Repository 重写 | ✗ refactor | 与本次 root cause 无直接关联,是「整体设计改进」 |
| (d) 函数返回 schema 校验 | ✓ defense(边界) | 与 root cause 直接关联(防止下次 select 漏字段时出 NaN/undefined) |

加 (a) + (b) + (d) 是合理 defense-in-depth(选 1-3 层,这里 3 层都关联紧密)。
加 (c) 是 refactor,**违反 baseline 第 3 条「外科手术式」,直接拒**。

**常见误判**:
- 4 个全加:错。(c) 是 refactor。
- 4 个全不加:也错(过度保守)—— defense-in-depth 是 deep 模式的合法工具,blocker bug 强烈建议加。
- 只加 (b):合理但不够 —— 单层兜底防御深度不足。

---

## Case 13 — dev-auto path/complexity 分类

**场景**:用户说「帮我做用户头像上传功能,要支持 jpg/png,自动压缩,存 S3,前端进度条。」

**关键问**:dev-auto 应判定为什么 path / 什么 complexity?推荐链是什么?

**Canonical answer**:

- **Path:feature**(「做」「功能」)
- **Complexity:moderate**(2-3 个模块:前端上传组件 / 后端 API / S3 wrapper;不涉及鉴权/支付/迁移/PII 这些 complex 信号)
- **Slug 推断**:`user-avatar-upload`(propose 让用户确认)

**推荐链**:`dev-grill-docs user-avatar-upload → 写代码 → dev-code-review`

**关键判断**:**moderate feature 不强制 dev-plan**(plan 可选,但 moderate 一般不需要 Critic 共识)。

**常见误判**:
- 判 complex(强推 dev-plan --deliberate):错。涉及 S3 / 前端 / 后端听起来多,但都在团队熟悉栈内,无 bridge / 无新基础设施,moderate 即可。
- 判 simple(`--quick` 跳过 spec):错。multi-component(前端 + 后端 + S3)且有 UI 反馈逻辑,需要 spec 拆 AC(图片大小限制?压缩参数?进度条 throttle?失败重试?)。
- Slug 不确认直接用 `avatar-upload`:错,**必须 propose 让用户确认**(可能用户想叫 `profile-photo-upload` 或别的)。

---

## Case 14 — dev-auto `--recover` 决策(BLOCK vs FIX P1)

**场景 A**:用户跑 dev-code-review,Verdict = ❌ **BLOCK**,理由 = 「P0:secret 泄漏,生产 .env 入了 git」。

**场景 B**:用户跑 dev-code-review,Verdict = ⚠ **FIX P1**,理由 = 「P1:console.log 残留(2 处),P1:边界 case 未处理(1 处)」。

**关键问**:两种场景 dev-auto `--recover` 推荐路径**有何不同**?

**Canonical answer**:

**场景 A(BLOCK)**:

```
推荐恢复:
  → 立刻 STOP,不要 commit
  原因:P0 secret 泄漏一旦 commit 进入 git history,即使后续删除也已泄漏,需要 rotate 全部 secret
  操作建议:
    1. git status 看暴露范围
    2. 立刻把 .env 从 git index 移除(git rm --cached)
    3. 加进 .gitignore
    4. **立刻 rotate 所有暴露的 secret**(不论是否 push,只要本地 commit 过就视作已泄漏)
    5. 改完重跑 dev-code-review,期望 Verdict = ✅ READY
```

**场景 B(FIX P1)**:

```
推荐恢复:
  → 回写代码 step 处理 P1
  原因:FIX P1 是「应修」级别,不阻塞 commit 但建议处理。当前不该硬 commit。
  操作建议:
    1. 删除 console.log
    2. 边界 case 加守卫 + 写 unit test 覆盖
    3. 改完重跑 dev-code-review,期望 Verdict = ✅ READY
  
  如果你认为 P1 是误报,在 commit message body 显式覆盖 + 解释,
  并 issue 反馈给 calibration session 重新校准。
```

**关键差异**:
- **BLOCK = 不允许任何方式 commit**(包括「我自己解释一下就 commit」)。secret 泄漏是绝对硬规则。
- **FIX P1 = 不该硬 commit,但允许显式覆盖路径**(写明原因,后续 calibration 决定是否调整 SKILL.md 判定)。

**常见误判**:
- 场景 A 推荐「commit message 里说明就行」→ **严重错**。secret 泄漏不可被「说明」绕过。
- 场景 B 推荐「再跑一次 dev-code-review 看看」→ 错。代码没改,跑 100 次结果一样。
- 两个场景给同样的恢复建议(都说「修 P0/P1」)→ 错,**严重度差一个量级**,处理方式必须区分。

---

## Calibration session 流程(每季度)

1. **独立答题**(各 skill 分开计时):
   - dev-code-review 6 个 case:30 分钟,默写 verdict + axis check + findings
   - dev-grill-docs 2 个 case:15 分钟,默写 dimension 打分 + 下一目标
   - dev-plan 2 个 case:15 分钟,默写 Critic verdict + 拒收/通过依据
   - dev-fix 2 个 case:15 分钟,默写 escalation 决策 + defense 边界判断
   - dev-auto 2 个 case:15 分钟,默写 path/complexity 分类 + recover 路径
   **不许互相讨论。**
2. **15 分钟对答案**:打印或共享,看每人答案对比。
3. **30 分钟讨论分歧**:
   - 哪些 case 全员一致?(说明 baseline 内化了)
   - 哪些 case 分歧大?(讨论各自依据,看是不是 baseline / SKILL.md 不够明确)
4. **产出**:
   - 是否需要修 baseline / SKILL.md?(走 CONTRIBUTING 流程)
   - 是否需要新增 calibration case?(覆盖讨论中暴露的边界)
   - 在 CHANGELOG 加一条 `### Changed - Calibration session YYYY-Qn,共 N 处分歧已收敛`。

---

## 维护

- 每次 baseline / SKILL.md 改动后,**重新审视本文件的 canonical answer 是否仍正确**。
- 团队 leader 每季度负责组织一次 calibration session。
- 新加 case 时遵循:**真实场景** > 教科书例子;**有过分歧** > 显然的题。
