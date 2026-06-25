# Runbook — Orquestração de Agentes (SmartRepair / SmartDiag)

> Processo operacional. Referência DoD completa: `.cursor/rules/dod-10-10.mdc`

## 1. Hierarquia

| Papel | Função |
|-------|--------|
| **Dr.M** | Prioridade, visão, **GO final** (commit/deploy/fases) |
| **Cursor** | Comandante operacional — planeia, implementa, testa, prova DONE |
| **Claude** | Auditor **condicional** — riscos P0–P3, segurança, deploy |
| **Codex** | Conselheiro/observador — interpreta relatórios, prompts, ambiguidade |
| **Gemini / DeepSeek / Qwen / Kimi** | Especialistas laterais — **nunca** no caminho crítico de deploy sem GO explícito Dr.M |

## 2. Fluxo padrão

```
Dr.M define scope + GO
  → Cursor implementa + gates locais
  → Claude audita (se trigger)
  → Cursor corrige P0/P1
  → Dr.M GO commit/deploy
  → Cursor executa
  → Cursor reporta DoD 10/10
```

## 3. Triggers — chamar Claude (obrigatório antes de commit/deploy)

- Supabase migrations
- RLS / tenant isolation / multi-tenant
- Auth / RBAC / JWT / `platform_admin`
- Payments / checkout / webhooks financeiros
- Uploads / PII / logs sensíveis
- Edge Functions sensíveis (ex.: `sql-console`)
- Deploy produção
- Mudanças em contratos API
- Mudanças em SmartDiag billing/features
- Qualquer **P0/P1** ou risco de segurança

## 4. Quando **não** chamar Claude

- Docs simples, copy/UI, refactor mecânico sem contrato
- Testes locais sem risco prod
- Melhorias visuais sem auth/db/prod
- Commits de documentação sem impacto runtime

## 5. Quando chamar Codex

- Interpretar relatórios Cursor/Claude
- Conflito Cursor ↔ Claude
- Ordem de sprints / scope creep
- Criar prompt seguro para Cursor ou Claude
- Avaliação independente do estado (Dr.M pede)

## 6. Anti-scope-creep

- Nova fase **só** com GO explícito Dr.M
- «Posso fazer X?» ≠ autorização — backlog até aprovação
- Commit, push e deploy são **acções separadas** com risco
- Deploy produção exige **GO Dr.M separado**

## 7. DoD 10/10 (resumo)

Cursor reporta antes de DONE final (detalhe em `.cursor/rules/dod-10-10.mdc`):

1. Código/commits selectivos · 2. Gates · 3. Prod/deploy/smoke · 4. Segurança/RLS/RBAC/secrets/PII · 5. Infra/rollback · 6. Ponte/HANDOFF/outbox/Claude · 7. Working tree · 8. **DONE / BLOQUEADO / AGUARDA GO**

## 8. Regra final

**Sem P0/P1 abertos + gates verdes + working tree explicado + GO Dr.M** → não há deploy.
