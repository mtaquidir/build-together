# Deploy Checklist — Template

> Preencher **antes** de qualquer deploy produção (VPS, Supabase EF, DB, site, app).
> Referência: `docs/agent-bridge-protocol.md` §16 · `docs/COMMAND-CENTER.md` (estado prod).

**Regra de ouro:** em deploy **sensível**, nunca executar antes de **audit Claude (se trigger) + commit + push** — salvo excepção documentada e aprovada por Dr.M.

---

## Identificação

| Campo | Valor |
|-------|-------|
| **ID deploy** | _ex.: `SH-SH-001b-DEPLOY-EF`_ |
| **Sprint / manifest** | _ID do `SPRINT-MANIFEST` ligado_ |
| **Quem autorizou** | Dr.M — _data + referência decision-log / GO chat_ |
| **Executor** | Cursor (ou quem Dr.M designar) |
| **Data / hora (UTC)** | _YYYY-MM-DDTHH:MMZ_ |

---

## Target

Marcar um ou mais:

| Target | ☐ | Detalhe |
|--------|---|---------|
| **VPS** | | _host, serviço, path_ |
| **Supabase Edge Functions** | | _nome(s) EF, project-ref_ |
| **Supabase DB** | | _migration id / ficheiro_ |
| **Site** | | _URL, CDN_ |
| **App** | | _build artefacto_ |

---

## Commit exacto

| Campo | Valor |
|-------|-------|
| **Hash** | _ex.: `a1dea2c1`_ |
| **Mensagem** | _subject do commit_ |
| **Branch** | _ex.: `main`_ |
| **origin/main após push** | _hash ou «ainda não pushed»_ |

---

## Comandos exactos

```powershell
# Copiar comandos literais — sem improviso em produção
# ex.:
# supabase functions deploy ai-analysis --project-ref <ref>
# ssh user@vps 'cd /app && git pull && systemctl restart ...'
```

| # | Comando | Executado? | Hora UTC |
|---|---------|------------|----------|
| 1 | | ☐ | |
| 2 | | ☐ | |

---

## Pré-checks

| Check | PASS / FAIL / N/A | Evidência |
|-------|-------------------|-----------|
| GO Dr.M explícito para **este** deploy | | |
| Claude audit **APROVAR** (se trigger) | | |
| Commit contém apenas scope autorizado | | |
| Push feito (se sensível) | | |
| Backup / snapshot se DB | | |
| Rollback path documentado | | |
| Secrets **não** alterados sem GO separado | | |
| `COMMAND-CENTER.md` lido — sem conflito de estado | | |

---

## Backup / rollback

| Campo | Valor |
|-------|-------|
| **Backup antes** | _o quê, onde, comando_ |
| **Rollback** | _comando / commit anterior / revert migration_ |
| **Tempo estimado rollback** | _minutos_ |

---

## Smoke pós-deploy

| Probe | Esperado | Actual | PASS/FAIL |
|-------|----------|--------|-----------|
| _ex.: EF anon probe_ | _401 invalid_token_ | | |
| _ex.: health HTTPS_ | _200_ | | |
| _ex.: fluxo crítico UI_ | _sem erro console_ | | |

**Smoke prod HTTPS:** ☐ confirmado

---

## Logs esperados

| Serviço | O que procurar | Onde |
|---------|----------------|------|
| _EF / VPS / app_ | _ex.: deploy success, version bump_ | _Supabase dashboard / ssh journal_ |

---

## Resultado

| Campo | Valor |
|-------|-------|
| **Veredicto global** | **PASS** / **FAIL** |
| **Versões pós-deploy** | _EF VERSION, VPS HEAD, etc._ |
| **Incidentes** | _nenhum / descrição_ |

### Como marcar PASS / FAIL

- **PASS:** todos os pré-checks aplicáveis + smoke + logs conforme esperado
- **FAIL:** qualquer smoke FAIL, comando erro, ou versão prod ≠ commit autorizado → parar, rollback se P0, registar outbox **BLOQUEADO**

---

## Registo no outbox

Após deploy, append em `docs/cursor-outbox.md`:

```text
ID: <deploy-id>
Tipo: DEPLOY-REQUEST / DEPLOY DONE
Target: ...
Commit: <hash>
Comandos: (lista)
Smoke: PASS/FAIL (tabela)
Estado final: DONE / BLOQUEADO
```

Actualizar também `docs/COMMAND-CENTER.md` → secção **Estado produção**.

---

## Regra sensível (não negociável)

```
NUNCA deploy antes de audit + commit + push
```

Quando **sensível** (migrations, auth, payments, EF críticas, RLS, P0/P1):

1. Claude audit → **APROVAR** (sem P0/P1)
2. Commit selectivo no repo correcto
3. Push para `origin/main` (ou branch acordada)
4. GO Dr.M **específico para deploy**
5. Preencher **este checklist**
6. Executar comandos literais
7. Smoke + outbox + Command Center

Excepção histórica (`ai-repair-summary` deploy pré-commit) → **P2 processo** — não repetir sem GO Dr.M.
