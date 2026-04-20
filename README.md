# Aphelio Lab - Future Theme

Landing page estática da Aphelio Lab inspirada na estrutura visual e narrativa da referência Future Marketing, usando conteúdo e informações da landing atual.

## Arquivos principais

- `index.html` - landing principal
- `styles.css` - identidade visual e responsividade
- `script.js` - animações, máscara do WhatsApp e envio do formulário
- `sucesso.html` - página de confirmação com redirecionamento para WhatsApp em 10 segundos
- `Dockerfile` e `nginx.conf` - deploy em EasyPanel/Docker

## Formulário

O webhook atual está definido direto no `action` do formulário em `index.html`:

```html
https://aphelio-n8n.6pecl2.easypanel.host/webhook/form
```

O campo `whatsapp` é enviado no formato internacional limpo, por exemplo:

```txt
5535992496959
```
