# Team Conventions

团队**对具体语言 / 工具的偏好**,在 lang-conventions 通用规范之上做覆盖。

加载顺序(skill 在执行规范检查时遵循):

```
项目本地 lint config (.eslintrc / analysis_options.yaml / pyproject.toml)
        ↓ 优先级最高
team-conventions.md(本文件)
        ↓
lang-conventions.md(语言通用)
        ↓
dev-baseline.md(LLM 通用)
```

**本文件大部分是模板**,带 `<!-- team:fill -->` 的段落需要团队 leader 落实具体偏好。

---

## 通用约定(全语言)

<!-- team:fill -->

- **行尾**:LF(不要 CRLF)。.gitattributes 里强约束。
- **缩进**:`<2 spaces / 4 spaces / tab,选一种>`
- **行宽**:`<80 / 100 / 120,选一种>`
- **文件末尾**:必须有空行。
- **注释语言**:`<中文 / 英文 / 双语,选一种>`(影响 dev-code-review 的注释轴判定)
- **commit message 语言**:`<中文 / 英文,选一种>`

---

## Dart / Flutter
<!-- team:fill -->

举例(请按团队真实情况替换):

- 状态管理:`<Riverpod / Bloc / Provider 选一>`,新模块**禁止**混用其他。
- 数据类:`<freezed / dart_mappable / 手写 equatable 选一>`
- 网络层:`<dio + retrofit / http 包装层>`
- StatefulWidget vs HookWidget:`<默认偏好>`
- 路由:`<go_router / auto_route / 自研>`
- 国际化:`<intl / easy_localization / 自研>`

---

## TypeScript / JavaScript
<!-- team:fill -->

- 包管理:`<npm / pnpm / yarn 选一>` —— **不允许**混用,锁文件冲突时以本节定义的为准。
- React state:`<useState only / Zustand / Redux Toolkit / Jotai>`
- 数据校验:`<Zod / Yup / 自研>` —— 所有 API 边界必须校验。
- 错误模型:`<Result type / 异常 / 混合,见 CLAUDE.md>`
- 时间处理:`<date-fns / dayjs / 原生 Intl>` —— **禁止** moment.js(已 deprecated)。

---

## Python
<!-- team:fill -->

- 包管理 / venv:`<uv / poetry / pip + venv>`
- 类型检查:`<mypy strict / pyright / pylance>`
- 数据模型:`<Pydantic v2 / dataclass / attrs>` —— v1 / v2 不许混。
- HTTP client:`<httpx / requests + retry>`
- 测试框架:`<pytest 默认>`,**禁止** unittest 风格混入新代码。

---

## Go
<!-- team:fill -->

- error 包:`<errors / pkg/errors / 自研>` —— 不要混用。
- HTTP framework:`<标准库 net/http / chi / gin>`
- 日志:`<slog / zap / zerolog>`
- 依赖注入:`<wire / 自研>` 或 `<禁止 DI 框架,手写构造>`

---

## 其他语言
<!-- team:fill - 列出团队实际使用的语言 -->

如果团队使用 Rust / Java / Kotlin / Swift / etc.,在此追加小节。模式参考上面。

---

## 反规范白名单(允许偏离的场景)

<!-- team:fill -->

下列场景**允许**违反上面的约定,无需在 PR 里特别说明:

- `*_test.*` / `*.spec.*` 文件:测试 helper 可以用 `any` / 简化错误处理。
- `scripts/` 下的一次性脚本:不强制完整类型 / 错误处理。
- 调试日志(commit 前必须删):`console.log` 等暂时存在。

其他场景违反约定的,必须在 PR 描述里写明原因(`Why deviate:`)。

---

## 维护

- 本文件由团队 leader 维护,任何修改需要在 CHANGELOG 留条目。
- 加新条目时回答:**「这一条违反时我会让 PR 退回吗?」** 答「不」就别加 —— 没有约束力的约定是噪音。
