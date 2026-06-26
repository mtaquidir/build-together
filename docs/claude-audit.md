# Claude Audit

> Decisões de audit. Entrada mais recente no topo.

---

## AUDIT — ID: SH-OPS-DISCIPLINE-003-AUDIT — 2026-06-26T22:15:00Z

**Decisão:** APROVAR COM RISCOS

**P0/P1:** Nenhum P0. Nenhum P1.

**P2 (residual, não bloqueante):** secret-scan cobertura estreita (inalterada); §17 GO sem enforcement mecânico (decision-log stub); gates manuais (sem pre-commit hook).

**P3:** glob `**/*.pem` na raiz; containment over-strict em prefixo `..` — fail-closed.

**Pode avançar:** **SIM** commit + push (sem P0/P1; gates verdes no staged).

**Condições:** GO §17 registado; push só ficheiros staged; remote confirmado por Dr.M.

**Próximo passo:** DONE_VERIFIED para fixes P2 · Cursor executa commit + push.

### Respostas

1. **P2 bloqueantes resolvidos** — scope-lint operacional, template alinhado, decision-log criado.
2. **Sem novos P0/P1.**
3. **Gates fiáveis quando corridos** — scope-lint PASS/FAIL correcto; execução manual.
4. **APROVAR COM RISCOS**
5. **Commit+push: SIM** após GO §17

### Evidência

- `SCOPE LINT PASS (8 files)` staged; FAIL em `app/**`, `frontend/**` fora do scope.
- `SECRET SCAN PASS` staged.
- Ver diff `tools/bridge-scope-lint.mjs`, `SPRINT-MANIFEST.md`, `decision-log.md`.

---

## AUDIT — ID: SH-OPS-DISCIPLINE-002-AUDIT — 2026-06-26T21:30:00Z

**Decisão:** APROVAR COM RISCOS

**P0/P1:** Nenhum P0. Nenhum P1 (defeitos abaixo falham-fechado e são aditivos; nada em prod, secrets ou migrations).

**P2:**
- **scope-lint mis-wired contra o próprio template.** Script procura `## Ficheiros Permitidos` / `## Ficheiros Proibidos` (h2, capitalizado); o template entrega `### Ficheiros permitidos` / `### Ficheiros proibidos` (h3, minúscula). A regex é *não-ancorada* + flag `i`, por isso casa por substring com o `###`, mas a lookahead `(?=\n## |$)` **não pára** num `### ` seguinte → captura atravessa secções (permitidos+proibidos+fora-de-scope ficam fundidos). Combinado com os bullets do template serem *placeholders* em itálico/backticks (ex.: `- _paths exactos…_`) e os proibidos serem **um único bullet em prosa** (`.env`, `supabase/migrations/*`, `app/**`… tudo numa linha), o resultado prático é: `npm run bridge:scope-lint` (que aponta ao template) marca **todo** ficheiro real como "outside allowed scope" → **sempre FAIL**, e a deteção de proibidos é **inoperante**. O gate "automático" anunciado no banner não funciona como descrito.
- **secret-scan cobertura estreita / contornável.** Só apanha JWT `eyJ…`, atribuições `api_key`/`secret`/`token`/`password`, BEGIN PRIVATE KEY, var `SUPABASE_SERVICE_ROLE_KEY`, prefixos `sk-ant`/`sk-proj`. Não cobre AWS (`AKIA…`), Google (`AIza…`), GitHub (`ghp_/gho_`), Stripe (`sk_live_`), Slack, base64/entropia. Contornável trivialmente (renomear var, valor curto, multilinha, binário, ficheiro fora do diff). Aditivo e falha-fechado, mas não dá garantia.
- **§17 GO não é mecanicamente aplicável.** Não há ferramenta que valide order_id/scope_hash/expires_at antes de commit/push; `scope_hash` não tem algoritmo canónico definido ("manifest+lista OU git diff acordado" = ambíguo, não-reproduzível); e **`docs/decision-log.md` nem existe** no repo. É política, não controlo — depende 100% da auto-disciplina do Cursor.
- **scope-lint: sem `-z`/`core.quotepath=false` e sem containment do `--manifest`.** Nomes de ficheiro não-ASCII saem citados por git → podem escapar ao match; `path.resolve(root, manifestArg)` aceita absolutos/`../` (sem verificação dentro do root). Baixa severidade (ferramenta auto-executada), mas é fraqueza real.

**P3:**
- Inconsistência de estados: §8 declara `DONE` sem qualificador = inválido, mas §13 (linha 205) e o template (linhas 66/75) ainda usam `DONE` puro. O commit actualizou o protocolo §8 mas não o §13 nem o template.
- Diagrama usa nomes em inglês (`PENDING/IN_PROGRESS/AWAITING_GO`) não usados no resto do protocolo (PT: `AGUARDA GO/BLOQUEADO`).
- `bridge-secret-scan` faz `execFileSync` com `maxBuffer 20MB`: diff maior → exceção não tratada (crash, não FAIL limpo).

**Pode avançar:** SIM — sem P0/P1; commit (ops/docs+tooling) é seguro em conteúdo. Mas ver Condições para o push e para confiar nos gates.

**Condições:**
1. **Não tratar os gates como "enforced"** até corrigir o scope-lint: alinhar headings script↔template (preferir match ancorado `^###? `), ou converter placeholders em bullets-path reais e separar proibidos em bullets individuais. Caso a equipa já dependa do gate como bloqueio efetivo, **escalar para P1**.
2. **Push só com GO `autorizado_para: push` explícito** (§17) — o GO de exemplo cobre apenas `commit`; `commit ≠ push`. Criar `docs/decision-log.md` antes (§17 referencia-o e ele não existe).
3. **Confirmar o remote antes de push** — `origin` é `markoinla/build-together` (repo de terceiros); estes commits são scaffolding ops interno SmartRepair. Validar que é o destino pretendido.

**Próximo passo:** AGUARDA GO Dr.M. Estado correcto = **DONE_CLAIMED** (não DONE_VERIFIED — esta auditoria confirma defeitos P2). Antes de push: GO push explícito + confirmação do remote.

### Respostas por pergunta

**1) scope-lint — bypass/path traversal:** Sim, vários. (a) Mismatch de heading h2/h3 + regex não-ancorada → over-capture entre secções, fundindo allowed/forbidden. (b) `globToRe` traduz `**`→`.*`: um padrão `**` no allowed deixa passar tudo. (c) Sem `-z`/`quotepath=false` → nomes não-ASCII citados podem escapar aos padrões. (d) `--manifest` aceita caminho absoluto/`../` sem containment → pode apontar a um manifest permissivo. Severidade limitada porque é ferramenta auto-executada (não é fronteira contra executor malicioso — basta não correr ou editar). FAIL-fechado mitiga o pior caso de exfiltração de scope.

**2) secret-scan — cobertura/bypass:** Cobertura estreita (Supabase/Anthropic/OpenAI + genérico keyword=valor). Lacunas: AWS/GCP/GitHub/Stripe/Slack, base64, entropia, segredos multilinha ou em binário. Bypass trivial (renomear var, valor curto, fora do diff). Só inspeciona linhas `+` (correcto para adições). Útil como primeira-linha, não como garantia.

**3) GO §17 enforceable?** Não mecanicamente. É documentação/convenção; nenhum hook/tool valida order_id, recomputa `scope_hash` sobre o diff, nem checa `expires_at`. `scope_hash` sem definição canónica. `decision-log.md` (onde o GO viveria) não existe. Aplicável apenas socialmente — risco de falsa sensação de controlo.

**4) DONE_CLAIMED/DONE_VERIFIED ok?** Conceito **sim, bom** — separa auto-declaração do executor da verificação independente e proíbe auto-atribuição de VERIFIED. Transições bem definidas. Defeito: o commit não propagou a regra "DONE puro = inválido" ao §13 nem ao template (ainda dizem `DONE`). Corrigir para consistência (P3).

**5) manifest header mismatch — impacto:** **Material.** Script espera `## Ficheiros Permitidos/Proibidos`; template tem `### …permitidos/proibidos`. Casa por acidente (substring + `i`) mas over-captura através das secções → allowed e forbidden ficam fundidos; com os placeholders do template o gate **sempre FAIL** e os proibidos (um bullet em prosa) **nunca** fazem match. É o achado-chave que torna o "gate automático" não-funcional tal como entregue. Mesmo num manifest preenchido correctamente, a over-capture continua a poluir o allowed com entradas proibidas/fora-de-scope.

**6) Decisão + P0–P3:** APROVAR COM RISCOS. P0: 0. P1: 0. P2: scope-lint mis-wired/inoperante; secret-scan estreito; §17 não-aplicável + decision-log ausente; scope-lint sem quotepath/containment. P3: `DONE` inconsistente §8 vs §13/template; nomes de estado em inglês no diagrama; crash por `maxBuffer`. Escolhi P2 (não P1) porque os defeitos falham-fechado, são puramente aditivos e nada dependia destes gates antes; escala a P1 se a equipa os declarar bloqueio efetivo.

**7) Push ok?** Conteúdo: seguro (sem secrets/prod/migrations). Processo: **Não sem GO de push explícito** — branch está `ahead 3`, o GO de exemplo cobre só `commit`, e `decision-log.md` não existe. Além disso o remote é `markoinla/build-together` (terceiros): confirmar destino antes de empurrar scaffolding ops interno. Recomendação: NÃO push até (a) GO `autorizado_para: push`, (b) remote confirmado.

### Evidência

- `git show 7ccfa87`: +175 linhas; cria `package.json`, `tools/bridge-scope-lint.mjs`, `tools/bridge-secret-scan.mjs`; edita `docs/agent-bridge-protocol.md` (banner → "Gates automáticos", §8 DONE_CLAIMED/VERIFIED, §16, §17).
- `tools/bridge-scope-lint.mjs:21` regex `## ${title}` não-ancorada + `i`; `:36` `globToRe` (`**`→`.*`); `:33` `git diff --name-only` sem `-z`/`quotepath`; `:14` `path.resolve(root, manifestArg)` sem containment.
- `docs/templates/SPRINT-MANIFEST.md:26,31` headings `### Ficheiros permitidos/proibidos` (h3, minúscula) vs script h2/capitalizado; `:28-29,33` bullets são placeholders em itálico/prosa; proibidos = 1 bullet único.
- `package.json:6` `bridge:scope-lint` aponta ao **template** (`docs/templates/SPRINT-MANIFEST.md`) → sempre FAIL na prática.
- `tools/bridge-secret-scan.mjs:8-14` 5 padrões (cobertura estreita); `:7` `maxBuffer 20MB` sem try/catch.
- `docs/agent-bridge-protocol.md:205` (§13) e `templates/SPRINT-MANIFEST.md:66,75` ainda usam `DONE` puro, contra §8:157.
- Git: branch `main` **ahead 3** de `origin/main`; remote `origin = https://github.com/markoinla/build-together.git`; `docs/decision-log.md` **não existe** apesar de §17/§2 o referenciarem.
