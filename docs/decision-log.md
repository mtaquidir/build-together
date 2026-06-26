# Decision Log — GO Dr.M

> Autorizações estruturadas (§17 `docs/agent-bridge-protocol.md`). **Append-only** — não editar entradas passadas.
>
> Formato obrigatório por linha/bloco:

```json
{
  "order_id": "SH-EXAMPLE-001",
  "scope_hash": "sha256:<hash do manifest + ficheiros staged>",
  "ambiente": "local",
  "autorizado_para": ["commit"],
  "granted_at": "2026-06-26T00:00:00Z",
  "expires_at": "2026-06-27T00:00:00Z",
  "granted_by": "Dr.M",
  "notas": "opcional"
}
```

---

## Entradas

### 2026-06-26 — SH-OPS-DISCIPLINE-003 — GO commit + push

```json
{
  "order_id": "SH-OPS-DISCIPLINE-003",
  "scope_hash": "sha256:2276942dd740ac1e678b13ed79ba4c5870c8a7856ba9b60022ac40812a61f7e4",
  "ambiente": "local",
  "autorizado_para": ["commit", "push"],
  "granted_at": "2026-06-26T20:30:00Z",
  "expires_at": "2026-06-27T20:30:00Z",
  "granted_by": "Dr.M",
  "notas": "GO verbal chat — audit Claude 003 APROVAR COM RISCOS sem P0/P1"
}
```
