# Sprint Manifest — Template

> Preencher **uma cópia por sprint** (ou secção dedicada no outbox com o mesmo ID).
> Sprints sensíveis **exigem** manifest antes de implementação. Referência: `docs/agent-bridge-protocol.md` §16.
>
> **Scope-lint:** as secções `## Ficheiros Permitidos` e `## Ficheiros Proibidos` abaixo são lidas por `tools/bridge-scope-lint.mjs` — usar globs reais, um path por bullet.

---

## Identificação

| Campo | Valor |
|-------|-------|
| **ID** | _ex.: `SH-OPS-DISCIPLINE-001`_ |
| **Data início** | _YYYY-MM-DD_ |
| **Objectivo** | _uma frase — o que muda e porquê_ |
| **Tipo** | `code` / `ops` / `docs` / `audit` / `deploy` |

---

## Ficheiros Permitidos

> Defaults para sprints docs/ops — **substituir** por sprint com globs exactos.

- docs/**
- tools/**
- package.json

---

## Ficheiros Proibidos

- .env
- .env.*
- app/**
- frontend/**
- supabase/**
- migrations/**
- **/.playwright/**
- **/*.key
- **/*.pem

---

## Scope

### Permitido

- _lista concreta do que o agente pode fazer_
- _ex.: criar ficheiros em `docs/` apenas_

### Fora de scope (não fazer)

- _deploy, db push, refactor não pedido, nova fase sem GO_

---

## Gates obrigatórios

| Gate | Aplicável? | Comando / evidência |
|------|------------|---------------------|
| `bridge:scope-lint` | SIM | `npm run bridge:scope-lint` (ou `--manifest` cópia do sprint) |
| `bridge:secret-scan` | SIM | `npm run bridge:secret-scan` |
| `typecheck` | SIM / NÃO / N/A | _ex.: `pnpm typecheck`_ |
| Testes scope | SIM / NÃO / N/A | _ex.: `pnpm test --filter=...`_ |
| Build scope | SIM / NÃO / N/A | _ex.: `pnpm build`_ |
| Smoke local | SIM / NÃO / N/A | _URL / passos_ |
| `git diff --stat` só scope | SIM | _confirmar antes de stage_ |

---

## Auditorias e deploy

| Pergunta | Resposta |
|----------|----------|
| **Claude audit necessário?** | **SIM** / **NÃO** + motivo (triggers em `agent-bridge-protocol.md` §3) |
| **Kimi second opinion necessário?** | **SIM** / **NÃO** — só se **Dr.M pedir** |
| **Deploy necessário?** | **SIM** / **NÃO** |
| **Rollback se aplicável** | _comando / commit anterior / nota «n/a»_ |

---

## Critério DONE

Marcar **DONE_CLAIMED** apenas quando **todos** forem verdade:

1. Objectivo do manifest cumprido
2. Gates aplicáveis verdes (ou N/A documentado)
3. Sem P0/P1 abertos introduzidos pelo sprint
4. `docs/cursor-outbox.md` actualizado com ID do sprint
5. `docs/COMMAND-CENTER.md` reflecte estado actual
6. Working tree explicado (secção abaixo)
7. Claude audit concluído se **SIM** acima
8. Estado final explícito: **DONE_CLAIMED** / **BLOQUEADO** / **AGUARDA GO**

**DONE_VERIFIED** só após validação independente (Claude/Kimi quando sensível). `DONE` sem qualificador = inválido.

---

## Working tree esperado

| Classificação | Ficheiros |
|---------------|-----------|
| **Commit** (neste sprint) | _lista_ |
| **Ignorar / não stage** | _lista de ruído local_ |
| **Manter local** | _configs pessoais, etc._ |

---

## Próximo passo

| Campo | Valor |
|-------|-------|
| **Acção** | _ex.: aguardar GO Dr.M para commit_ |
| **Quem decide** | Dr.M / Codex / Claude |
| **Bloqueadores** | _se houver_ |

---

## Exemplo mínimo (docs-only)

```text
ID: SH-OPS-DISCIPLINE-001
Tipo: docs
Ficheiros Permitidos: docs/**, tools/**, package.json
Ficheiros Proibidos: .env, app/**, supabase/**
Gates: bridge:scope-lint + bridge:secret-scan — typecheck N/A
Claude: NÃO
Kimi: NÃO
Deploy: NÃO
Estado: DONE_CLAIMED + AGUARDA GO commit
```
