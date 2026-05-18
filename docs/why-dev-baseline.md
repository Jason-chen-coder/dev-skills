# Why Dev Baseline

`references/dev-baseline.md` 是 dev-skills 的最小行为内核。它刻意只保留四条,因为 baseline 会被每个 skill 加载;这里的文字越长,越容易把真正重要的约束淹没。

每条 baseline 都应该关闭一个真实的 LLM 编码失败模式,而不是表达偏好。

---

## 1. 不假设(Don't Assume)

**关闭的失败模式:静默选错解释。**

用户一句「加导出」可能指 self-service export、admin export、GDPR export,也可能只是在现有列表页加 CSV 按钮。Agent 如果默默选一个,通常会写出“看起来完成、方向却错”的代码。

这条规则要求:

- 多解时先列选项,不要替用户拍板。
- 代码库里出现两种模式时,显式选一种并说明原因。
- 看不懂的前提要点名,不能绕开继续。

典型信号:

- 新代码混合了两种现有模式,例如既 throw 又返回 Result。
- 新 endpoint 风格和邻居模块不一致,但输出里没有解释。
- 需求里关键名词在对话中漂移,agent 仍继续编码。

---

## 2. 最小代码(Simplicity First)

**关闭的失败模式:过度工程化。**

LLM 很容易为了“未来扩展”添加 strategy、factory、adapter、config injection,但当前任务只有一个 caller。多出来的抽象会扩大 review 面、测试面和维护面,还会让后续 agent 误以为这是团队既定架构。

这条规则要求:

- 没被要求的功能不做。
- 只有一个使用点时不抽象。
- 写完自问能否压到一半;如果能,先压。

典型信号:

- 一个小修复引入新目录、新接口、新依赖。
- 参数和配置比真实调用场景还多。
- 测试主要在验证 mock / shape,不是验证业务行为。

---

## 3. 外科手术式改动(Surgical Changes)

**关闭的失败模式:正事之外的 diff 污染。**

Agent 常在修 bug 时顺手重排 import、改注释、格式化整文件、重命名邻近变量。即使这些变化本身没错,它们也会让 review 难以看清真正行为变化,并提高误伤用户已有改动的概率。

这条规则要求:

- 只改和用户请求直接相关的行。
- 发现邻近问题先记录为 follow-up,不要夹进本次 diff。
- 每一行变更都能追溯到任务目标。

典型信号:

- diff 里行为修复只有 5 行,但格式化改了 200 行。
- commit 同时包含 feature、cleanup、rename。
- 为了“统一风格”改了未触达路径。

---

## 4. 可验证的成功标准(Verifiable Success Criteria)

**关闭的失败模式:声称完成但没有证据。**

“测试通过”不等于行为正确。一个返回常量的函数也能让 shape-only test 变绿;一个 migration 也可能在跳过部分记录后仍打印 success。

这条规则要求:

- 先把目标翻译成可验证判据。
- 测试断言行为,不是只断言存在、类型或不报错。
- 部分失败、跳过记录、截断输出、重试耗尽必须显式报告。

典型信号:

- 输出只说“已完成”,没有命令、测试名或结果。
- test 只检查 `toBeDefined()` / `status === 200`,没有检查业务结果。
- 脚本遇到失败记录继续跑,最后仍打印成功。

---

## 推论,不是新 baseline

下面这些做法来自同一类 failure mode,但目前更适合放在 skill 或团队模板里,不直接扩张 baseline:

- **冲突不平均**:两种代码模式冲突时,选一种并解释,不要两个都用。
- **长任务设 checkpoint**:多步 refactor / migration 需要中间可回退点。
- **失败必须可见**:任何 partial failure 都要进入 summary 或日志。
- **非语言逻辑写成确定性代码**:重试、路由、限流、算术、时间处理不要靠 prompt 判断。
- **调试循环有预算**:同一错误输入反复咀嚼时,停下来换 reproduction / instrumentation / hypothesis。

这些推论可以进 `CLAUDE.md.template` / `AGENTS.md.template`,也可以进具体 skill。只有当某条推论在多个 skill 中反复出现、且已经有真实 failure case 支撑时,才考虑升级为 baseline 第 5 条。

---

## 修改 baseline 的门槛

新增或修改 baseline 前,先回答三件事:

1. 这条规则关闭的具体失败模式是什么?
2. 它是否适用于所有 skill,而不是某个阶段的局部约束?
3. 如果放进 always-on 上下文,它是否比现有四条更值得占 token?

如果答不清,先放到 skill 局部规则、team policy 或 calibration case,不要急着改 baseline。
