# Command Center — Painel SSOT Operacional

> **Única fonte de verdade** para estado activo do ecossistema SmartRepair / SmartDiag / Smart House.
> Agentes (Cursor, Claude, Kimi, Codex) leem **antes** de agir. Cursor actualiza após cada entrega relevante.
>
> Última actualização: **2026-06-26** · Responsável: **Cursor**

---

## Sprint activo

| Campo | Valor |
|-------|-------|
| **ID** | `SH-OPS-DISCIPLINE-001` |
| **Objectivo** | Base operacional docs-only — Command Center, Sprint Manifest, Deploy Checklist |
| **Tipo** | docs |
| **Manifest** | `docs/templates/SPRINT-MANIFEST.md` (preencher por sprint) |
| **Estado** | **AGUARDA GO** commit |

---

## Estado git

| Campo | Valor | Como verificar |
|-------|-------|----------------|
| **Repo** | `build-together` | `git remote -v` |
| **Branch** | `main` | `git branch --show-current` |
| **Local HEAD** | `b267471` — `docs: runbook de orquestração de agentes SmartRepair/SmartDiag` | `git rev-parse --short HEAD` |
| **origin/main** | `4f74c94` — `updated readme` | `git rev-parse --short origin/main` |
| **Ahead / behind** | **+1 ahead** · 0 behind | `git status -sb` |
| **Working tree** | Alterações locais fora deste sprint (tailwind, package.json, scripts PS1) — **não incluir no commit SH-OPS-DISCIPLINE-001** | `git status` |

> Outros repos do ecossistema (ex.: `build-create-together`, `smartdiag`) têm HEAD próprio — registar linha separada quando relevante.

---

## Estado produção

| Target | HEAD / versão | Última verificação | Notas |
|--------|---------------|-------------------|-------|
| **VPS** | _não aplicável a este repo_ | — | Ver `docs/deploy-smarthouse-vps.md` no repo Smart House |
| **Supabase EF** | _ver outbox canónico_ | 2026-06-26 | `ai-analysis` v8 · `ai-sentiment-analysis` v9 · `ai-repair-summary` v9 (repo `build-create-together`) |
| **Supabase DB / migrations** | _sem alteração neste sprint_ | — | Sem db push autorizado |
| **Site / app** | _n/a neste sprint_ | — | — |

---

## Tarefas activas (máximo 3)

| # | Área | Tarefa | Owner | Estado |
|---|------|--------|-------|--------|
| 1 | **Código** | _nenhuma_ — sprint docs-only | — | — |
| 2 | **Ops** | Stage docs SH-OPS-DISCIPLINE-001 · aguardar GO commit Dr.M | Cursor | **AGUARDA GO** |
| 3 | **Docs / audit** | Criar COMMAND-CENTER + templates + ponte protocolo | Cursor | **entregue** |

---

## Pendências por severidade

| ID | Sev | Descrição | Owner | Estado |
|----|-----|-----------|-------|--------|
| — | **P0** | _nenhuma aberta neste sprint_ | — | — |
| — | **P1** | _nenhuma aberta neste sprint_ | — | — |
| — | **P2** | Processo: deploy antes de audit (lição `ai-repair-summary` — ver outbox canónico) | Dr.M | documentado |
| — | **P3** | — | — | — |

---

## Últimos registos de agentes

| Agente | ID / referência | Data | Resumo |
|--------|-----------------|------|--------|
| **Claude audit** | _n/a — sprint docs-only, sem trigger_ | — | Claude **não obrigatório** (secção 4 do protocolo) |
| **Kimi second opinion** | _n/a — não pedido por Dr.M_ | — | — |
| **Último GO Dr.M** | `SH-OPS-DISCIPLINE-001` scope docs-only | 2026-06-26 | Autorizado criar docs; **commit aguarda GO separado** |

---

## Próxima decisão necessária

**Dr.M / Codex:** GO para **commit selectivo** dos ficheiros docs deste sprint (`SH-OPS-DISCIPLINE-001`).

- Sem push · sem deploy · sem db push · sem secrets.

---

## NÃO FAZER SEM GO

As acções abaixo exigem **GO explícito Dr.M** registado em `docs/decision-log.md` (quando existir) e, quando aplicável, manifest + checklist preenchidos.

| Acção | Pré-requisitos |
|-------|----------------|
| **Deploy** (VPS / EF / site) | `docs/templates/DEPLOY-CHECKLIST.md` preenchido · audit Claude se trigger · commit + push quando sensível |
| **db push / migrations** | Audit Claude obrigatório · backup · rollback documentado |
| **Secrets** (.env, Supabase, VPS) | GO Dr.M · nunca em commit |
| **Payments / checkout / webhooks** | Audit Claude · manifest sprint · deploy checklist |
| **Migrations Supabase** | Audit Claude · DEPLOY-CHECKLIST · evidência em outbox |

---

## Referências

- Protocolo ponte: `docs/agent-bridge-protocol.md`
- Template sprint: `docs/templates/SPRINT-MANIFEST.md`
- Template deploy: `docs/templates/DEPLOY-CHECKLIST.md`
- Entregas Cursor: `docs/cursor-outbox.md`
- DoD 10/10: `.cursor/rules/dod-10-10.mdc`
- Runbook orquestração: `docs/agent-orchestration-runbook.md`
