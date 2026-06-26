# Cursor Outbox

> Entregas e estados Cursor. Entrada mais recente no topo.
> Painel operacional: `docs/COMMAND-CENTER.md`

---

## SH-OPS-DISCIPLINE-001 — base operacional docs-only — 2026-06-26

**De:** Cursor · **Para:** Dr.M + Codex · **Estado:** **AGUARDA GO** commit

| Campo | Valor |
|-------|-------|
| **ID** | `SH-OPS-DISCIPLINE-001` |
| **Tipo** | DOCS |
| **Objectivo** | Disciplina operacional — evitar confusão entre agentes, scopes, deploys e DONE falso |
| **Manifest** | Sprint docs-only (ver exemplo em `docs/templates/SPRINT-MANIFEST.md`) |

### Ficheiros criados / alterados (scope)

| Ficheiro | Acção |
|----------|-------|
| `docs/COMMAND-CENTER.md` | **criado** — painel SSOT operacional |
| `docs/templates/SPRINT-MANIFEST.md` | **criado** — template sprint sensível |
| `docs/templates/DEPLOY-CHECKLIST.md` | **criado** — template deploy produção |
| `docs/agent-bridge-protocol.md` | **criado** — protocolo ponte + §15 docs operacionais |
| `docs/cursor-outbox.md` | **criado** — esta entrada |

### Scope respeitado

- ✅ Apenas `docs/`
- ❌ Sem código · migrations · `.env` · secrets · deploy · db push · Edge Functions

### Gates

| Gate | Resultado |
|------|-----------|
| `typecheck` | **N/A** (docs-only) |
| Testes | **N/A** |
| Build | **N/A** |
| `git diff --stat` só docs | ✅ (ver abaixo) |

### Riscos

- Nenhum runtime. P2 histórico documentado no COMMAND-CENTER (deploy pré-audit).

### Claude necessário

**NÃO** — docs simples sem trigger (protocolo §4).

### Kimi necessário

**NÃO** — não pedido por Dr.M.

### Working tree (fora deste sprint — não stage)

- `app/static/css/tailwind.css` — modificado
- `frontend/package.json`, `frontend/input.css` — locais
- Scripts PS1, `.cursor/` — locais / setup
- `~/.cursor/mcp.json` — config pessoal

### Estado git (referência)

- Local HEAD: `b267471` · origin/main: `4f74c94` · **+1 ahead**

### Próximo passo

1. Dr.M / Codex: **GO commit** selectivo dos 5 ficheiros docs acima
2. Sem push nesta acção (salvo GO separado)

**Estado final:** **AGUARDA GO** commit
