# base-harness

A minimal, reliable, **provider-agnostic AI agent harness** in TypeScript.

The language model is just the "brain". Everything that makes it useful — memory,
tools, permissions and a verification loop that doesn't call anything _done_ until
the tests pass — is the **harness** you build around it. This repo is a small,
readable, didactic implementation of exactly that, meant to be read end to end.

It runs against the **Anthropic API** or a **local, free model via Ollama** by
editing a single file. It ships with the local (Ollama) option active, so you can
try it with no API key and no cost.

> Didactic base, not a production tool. See [Limitations](#limitations).

## What's inside

- **The agentic loop** (`runAgent`) — the ReAct cycle: send context + tools →
  the model decides → the harness runs the tool → observe → repeat until the
  model is done. An agent is just _model + harness_.
- **Tool registry** — one place where every tool registers its schema (what the
  model sees) and its handler (what runs). Importing the barrel wires them up.
- **File and terminal tools** — read / write / edit files, and run shell commands.
- **Guardrails** — a workspace path guard (the agent can't escape `./workspace`)
  and a permission guard that blocks destructive commands and asks a human to
  confirm. Whatever the agent reads is treated as data, never as instructions.
- **Memory** — working memory trimmed to fit the context window, plus
  cross-session progress persisted to disk (`PROGRESS.md`).
- **System prompt from the repo** — the agent's rules live in `AGENTS.md`, not in
  a buried constant.
- **Verification** — the source of truth is running the tests, not the model's
  word. A layered ladder (unit → integration → E2E) stops at the first red layer.
- **Feature list (WIP=1)**, **maker-checker graph**, **observability** (a JSONL
  event stream) and a **clean session handoff**.

## Requirements

- **Node.js 20+** (uses the built-in test runner and `tsx`).
- Optional: **[Ollama](https://ollama.com)** for a local, free model.

## Quickstart

```bash
git clone https://github.com/pedrovelasquez9/base-harness.git
cd base-harness
npm install
```

Pick a provider in `src/config.ts` (see below), then start the CLI:

```bash
npm start
```

You'll get an interactive prompt. You can:

- type a **task** in plain language — the agent works on it inside `./workspace`;
- `/next` — work the next pending feature from `features.json` (WIP=1);
- `/features` — list the registered features and their state;
- `/checker <task>` — maker-checker: one agent implements, an independent one reviews;
- `/check` — run the full verification ladder (unit → integration → E2E).

## Choosing a provider

Everything that changes between providers lives in `src/config.ts`: uncomment
**one** block, comment out the rest. Nothing else in the project changes — the
rest of the code depends only on the `LlmProvider` interface (Dependency Inversion).

- **Ollama (local, free)** — active by default:
  ```bash
  ollama pull qwen2.5-coder
  ollama serve
  ```
- **Anthropic (cloud)** — uncomment its block in `src/config.ts` and set the key:
  ```bash
  export ANTHROPIC_API_KEY=sk-ant-...
  ```
- **OpenRouter (cloud, incl. free models)** — uncomment its block and set
  `OPENROUTER_API_KEY`.

A small local model follows instructions and chains tools less reliably than a
frontier model; that's exactly why the verification loop matters.

## Scripts

| Script                                  | What it does                                     |
| --------------------------------------- | ------------------------------------------------ |
| `npm start`                             | Run the interactive CLI (`src/main.ts`).         |
| `npm run check`                         | The quality gate: types + lint + format + tests. |
| `npm test`                              | Unit tests (deterministic).                      |
| `npm run test:integration`              | Integration tests (call the model).              |
| `npm run typecheck` / `lint` / `format` | Individual steps.                                |

## Project structure

```
src/
├─ config.ts            # provider, model, keys — the ONLY file you edit to switch LLM
├─ types.ts             # data shapes + the LlmProvider interface
├─ util.ts              # pure helpers (textOf, toolResult)
├─ llm/                 # the provider adapter (anthropic, openai, translate, registry, index)
├─ harness/             # the library: loop, tools/, guards/, verify, memory, prompt, registry, index
├─ session.ts           # cross-session progress
├─ features.ts          # the WIP=1 feature list
├─ graph.ts             # maker-checker as an explicit graph
├─ verify.ts            # unit → integration → E2E ladder
├─ observability.ts     # JSONL event stream
├─ handoff.ts           # clean session close
└─ main.ts              # entry point (CLI); the only file with side effects
tests/                  # unit (deterministic) and integration (call the model)
```

## Limitations

This is a base to learn from and build on, not a hardened product:

- The dangerous-command filter is a **bypassable denylist**, not an allowlist.
- `run_command` runs **on the host**; there is no real sandbox or VM isolation.
- No per-call token/cost budget (only a turn cap).
- Model output is non-deterministic, so tests assert behavior, not exact text.

## Step-by-step guide

A full, piece-by-piece written guide (theory + code) is available at
**[codex-barba.com](https://codex-barba.com/harness-paso-a-paso)**, from the
[Programación en español](https://programacion-es.dev/redes/) community.

## License

[MIT](LICENSE) © Pedro Plasencia
