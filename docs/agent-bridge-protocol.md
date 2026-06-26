# Agent Bridge Protocol — Cursor / Claude / Kimi / Codex / Dr.M

> **SSOT** para comunicação entre agentes no ecossistema SmartRepair / SmartDiag / Smart House.
> Quando houver conflito com docs legacy ou sessões antigas, **este ficheiro prevalece**.
>
> Versão: 2026-06-26 · Docs-only (sem automação).

---

## 1. Fluxo mínimo

```
Dr.M define scope/GO
    → Cursor implementa / testa / prova
    → se trigger sensível: Cursor escreve AUDIT-REQUEST em claude-inbox
    → Claude audita em claude-audit
    → Dr.M decide GO / NO-GO / BLOQUEIO
    → Cursor executa commit / push / deploy conforme autorizado
```

**Princípio:** ponte de **estados**, não conversa livre entre agentes.

---

## 2. Quem escreve onde

| Ficheiro | Quem escreve | Conteúdo |
|----------|--------------|----------|
| `docs/COMMAND-CENTER.md` | **Cursor** | Painel SSOT — sprint activo, git, prod, pendências, próxima decisão |
| `docs/cursor-outbox.md` | **Cursor** | Entregas, gates, riscos preliminares, estado final |
| `docs/claude-inbox.md` | **Cursor** | Pedido de audit quando há trigger (append PENDING) |
| `docs/claude-audit.md` | **Claude** | Decisão, P0–P3, condições, próximo passo |
| `docs/decision-log.md` | **Cursor** (só com decisão explícita Dr.M) | GO, NO-GO, BLOQUEIO, BACKLOG |
| `docs/templates/SPRINT-MANIFEST.md` | **Cursor** (cópia por sprint) | Scope, gates, DONE — **obrigatório em sprint sensível** |
| `docs/templates/DEPLOY-CHECKLIST.md` | **Cursor** (por deploy) | Pré-checks, comandos, smoke — **obrigatório antes de deploy** |
| **Codex** | — | Não escreve por defeito; aconselha Dr.M quando chamado |
| **Kimi** | — | Consulta lateral manual; **sem ficheiro oficial** por agora |

---

## 3. Regra de trigger Claude

Cursor **pode classificar risco preliminarmente** em `cursor-outbox`. Em triggers sensíveis, Claude é **obrigatório** antes de marcar DONE ou pedir deploy.

Claude obrigatório quando tocar:

- Supabase migrations
- RLS / tenant isolation / multi-tenant
- auth / RBAC / JWT / `platform_admin`
- payments / checkout / webhooks financeiros
- uploads / PII / logs sensíveis
- Edge Functions sensíveis
- deploy produção
- mudanças de contrato API
- SmartDiag billing / features
- qualquer P0 / P1 conhecido ou suspeito

---

## 4. Quando **não** chamar Claude

- docs simples
- copy / UI text
- refactor mecânico sem contrato API
- testes locais sem risco prod
- melhorias visuais sem auth / db / prod

---

## 5. Regra «1 ID = 1 thread»

Cada ordem tem **um ID único** (ex.: `SH-OPS-DISCIPLINE-001`, `SH-SH-001b`).

O mesmo ID liga:

- entrada em `cursor-outbox`
- manifest sprint (cópia de `docs/templates/SPRINT-MANIFEST.md` ou secção equivalente)
- entrada em `claude-inbox` (se audit)
- bloco em `claude-audit` (se audit)
- checklist deploy (se deploy — `docs/templates/DEPLOY-CHECKLIST.md`)
- linha em `decision-log` (se decisão Dr.M)
- linha em `COMMAND-CENTER.md` (sprint activo / pendências)

**Proibido:** criar IDs paralelos para o mesmo trabalho.

**REOPEN:** novo ciclo com o **mesmo ID + sufixo `-REOPEN`**.

---

## 6. Formato Cursor (outbox / inbox)

```text
ID:
Tipo: IMPLEMENTAÇÃO / AUDIT-REQUEST / DEPLOY-REQUEST / DOCS / SECOND-OPINION
Escopo:
Ficheiros:
Gates:
Riscos:
Claude necessário: SIM/NÃO + motivo
Kimi necessário: SIM/NÃO + motivo (só se Dr.M pedir)
Estado final: DONE / BLOQUEADO / AGUARDA GO / STALE / REOPEN

Checklist anti-scope-creep:
- Nova fase tem GO Dr.M? SIM/NÃO
- Sprint manifest preenchido? SIM/NÃO
- Commit autorizado? SIM/NÃO
- Push autorizado? SIM/NÃO
- Deploy checklist preenchido (se deploy)? SIM/NÃO
- Deploy autorizado? SIM/NÃO
```

---

## 7. Formato Claude (audit)

```text
ID:
Decisão: APROVAR / APROVAR COM RISCOS / BLOQUEAR
P0/P1:
P2:
P3:
Pode avançar?: SIM/NÃO
Condições:
Próximo passo:
```

---

## 8. Tabela de tradução de estados

| Estado | Significado |
|--------|-------------|
| **Cursor DONE** | Trabalho entregue e provado conforme DoD 10/10 |
| **Claude APROVAR** | Sem P0/P1; pode ainda precisar GO Dr.M para commit/deploy |
| **Claude APROVAR COM RISCOS** | Sem bloqueio; P2/P3 documentados |
| **Claude BLOQUEAR** | P0/P1 ou risco que impede avanço |
| **Dr.M GO** | Autorização explícita (commit, push, deploy ou nova fase) |
| **Dr.M NO-GO** | Não avançar |
| **AGUARDA GO** | Pronto; espera decisão Dr.M |
| **STALE** | AGUARDA GO há >24h; **não é erro técnico** — Dr.M ocupado |
| **REOPEN** | Item fechado reaberto por P0/P1/P2 relevante |

---

## 9. Regra TTL

- `AGUARDA GO` há **mais de 24h** → passa a **STALE** (não BLOQUEADO).
- **STALE** só avança quando Dr.M responder.
- STALE **não** implica falha de implementação nem rollback automático.

---

## 10. Regra REOPEN

- **Claude** pode reabrir DONE se encontrar P0/P1.
- **Kimi** pode *sugerir* REOPEN; só **Dr.M ou Claude** converte em REOPEN formal.
- **Cursor** trata REOPEN como novo ciclo: mesmo ID + sufixo `-REOPEN`.

---

## 11. Kimi

- Consulta lateral **manual**.
- Só entra quando **Dr.M pedir**.
- **Nunca** emite DONE.
- **Nunca** decide deploy.

---

## 12. Codex

- Observa e **aconselha Dr.M quando chamado**.
- Não comanda Cursor.
- Não substitui Claude.

---

## 13. DoD 10/10 — mapeamento

| Secção DoD | Responsável |
|------------|-------------|
| 1. Código | Cursor |
| 2. Gates | Cursor |
| 3. Produção / operação | Cursor prova; Dr.M GO deploy |
| 4. Segurança | Cursor auto-review; Claude em trigger |
| 5. Infra | Cursor documenta; DEPLOY-CHECKLIST se deploy |
| 6. Ponte | COMMAND-CENTER + outbox + inbox/audit + decision-log |
| 7. Working tree | Cursor explica `git status` |
| 8. Próximo passo | DONE / BLOQUEADO / AGUARDA GO / STALE |

Referência: `.cursor/rules/dod-10-10.mdc`

---

## 14. O que **não** fazer (anti-scope-creep)

- Não commit / push / deploy sem GO Dr.M explícito.
- Não deploy sem `docs/templates/DEPLOY-CHECKLIST.md` preenchido.
- Não sprint sensível sem manifest (`docs/templates/SPRINT-MANIFEST.md`).
- Não duplicar decisões: decisão Dr.M → `decision-log`; evidência → `outbox` / COMMAND-CENTER.

---

## 15. Documentos operacionais (SSOT)

| Documento | Função |
|-----------|--------|
| **`docs/COMMAND-CENTER.md`** | **Painel SSOT operacional** — estado actual: sprint, git, prod, tarefas (máx. 3), pendências P0–P3, últimos audits, próxima decisão, regras «NÃO FAZER SEM GO» |
| **`docs/templates/SPRINT-MANIFEST.md`** | Template obrigatório para **cada sprint sensível** — scope, ficheiros permitidos/proibidos, gates, audit Kimi/Claude, critério DONE |
| **`docs/templates/DEPLOY-CHECKLIST.md`** | Template obrigatório para **cada deploy** — autorização, target, commit exacto, comandos, smoke, PASS/FAIL, registo outbox |

**Fluxo:** Dr.M define sprint → Cursor preenche manifest → implementa → audit se trigger → preenche deploy checklist se deploy → actualiza COMMAND-CENTER + outbox → AGUARDA GO ou DONE.

Ver também: `docs/agent-orchestration-runbook.md`
