# SecureAI Documentation

Official documentation for SecureAI powered by Mintlify.

## Local Development

Preview the documentation locally:

`ash
npx mintlify dev
`

Visit http://localhost:3000 to view the documentation with live reload and the interactive API playground.

## Deployment

Pushes to the main branch automatically trigger deployments via the Mintlify GitHub integration.

## Ramas y versiones

Mismo flujo que [Hiper-AI/secureai](https://github.com/Hiper-AI/secureai/blob/main/GIT-WORKFLOW.md):

| Rama | Rol |
|---|---|
| `features-qa` | Integración y **rama por defecto**: los PR van acá |
| `release/beta` | Beta. Se promueve a mano desde `features-qa` |
| `main` | Producción. Sólo se mueve con la promoción manual `release/beta → main`; nadie pushea directo |

Cada push a `main` crea el tag `vAA.MM.DD` (fecha de Buenos Aires; `vAA.MM.DD.N` si ese día ya hubo otro) y su
GitHub Release, con las notas de todo lo que entró desde la versión anterior. Lo hace
[.github/workflows/release-tag.yml](.github/workflows/release-tag.yml) con
[scripts/release/nextTag.mjs](scripts/release/nextTag.mjs) (copia del de secureai). `release/beta` y `features-qa`
no se versionan. Para ver qué tag saldría: `node scripts/release/nextTag.mjs` (sólo lee).
