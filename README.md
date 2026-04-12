# Aphelio Lab Landing

Landing page estática servida por Nginx via Docker.

## EasyPanel

Use o deploy via GitHub com Dockerfile.

- Build context: raiz do repositório
- Dockerfile: `Dockerfile`
- Container port: `80`

Rotas configuradas:

- `/` serve `index.html`
- `/index.html` redireciona para `/`
- `/sucesso` serve `sucesso.html`
- `/sucesso.html` redireciona para `/sucesso`
