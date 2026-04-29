# Calibration Cases

固定一组样例,**每季度全员独立跑相应 skill 一遍**,对比判定差异。漂移 > 30% 的 case 进 retro 讨论,要么收敛对 baseline 的理解,要么修 SKILL.md 的判定规则。

本文件分三部分:

- **Cases 1-6**:`dev-commit-review` 的 P0 / P1 / P2 判定校准。
- **Cases 7-8**:`dev-spec` 的 ambiguity 维度评分校准。
- **Cases 9-10**:`dev-plan` 的 Critic verdict(APPROVED / REVISE / REJECT)校准。

---

## 用法

1. 团队成员各自打开本文件,**只看 diff 段,不要先看 canonical 答案**。
2. 想象你正在跑 dev-commit-review,默写 verdict + axis check + findings。
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

## Case 7 — dev-spec ambiguity 评分(完整需求 → 应低分)

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

## Case 8 — dev-spec ambiguity 评分(模糊需求 → 应高分,Goal 最弱)

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

## Calibration session 流程(每季度)

1. **独立答题**(各 skill 分开计时):
   - dev-commit-review 6 个 case:30 分钟,默写 verdict + axis check + findings
   - dev-spec 2 个 case:15 分钟,默写 dimension 打分 + 下一目标
   - dev-plan 2 个 case:15 分钟,默写 Critic verdict + 拒收/通过依据
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
