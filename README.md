# 12Help! — Plataforma global de voluntariado (demonstração)

> Conectando pessoas a causas que transformam o mundo.

Demonstração interativa de uma plataforma que conecta voluntários, ONGs e projetos sociais. **Todos os dados, organizações, pessoas e transações são fictícios.** Nenhum pagamento real é processado e nenhuma verificação real é feita.

Site 100% estático (HTML, CSS e JavaScript puro), sem build, sem backend e sem dependências. As alterações feitas durante a demonstração ficam salvas no `localStorage` do navegador.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `12help`).
2. Envie **o conteúdo desta pasta** para a raiz do repositório (o `index.html` precisa ficar na raiz):
   ```bash
   git init
   git add .
   git commit -m "12Help! demo"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/12help.git
   git push -u origin main
   ```
   Ou, pelo site do GitHub: **Add file → Upload files** e arraste todos os arquivos.
3. No repositório: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, escolha `main` e a pasta `/ (root)` e clique em **Save**.
4. Em 1 a 2 minutos o site estará em `https://SEU-USUARIO.github.io/12help/`.

O arquivo `.nojekyll` já está incluído. A navegação usa rotas com `#` (ex.: `#/oportunidades`), então todos os links funcionam no GitHub Pages sem configuração extra.

## Como apresentar

Use a barra escura no topo para alternar entre **Visitante**, **Voluntária** (Lívia Moraes, Joinville) e **ONG** (Instituto Raízes Verdes). As duas experiências estão conectadas: uma inscrição feita pela voluntária em um projeto do Raízes Verdes aparece no painel da ONG para ser aceita, e a resposta volta como notificação e mensagem.

Para zerar as alterações: **Área do voluntário → Configurações → Restaurar dados da demonstração**.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Página única da aplicação |
| `styles.css` | Identidade visual (Verde Pantone 17-6153 e Azul Pantone 19-4052) |
| `data.js` | Dados fictícios: 24 ONGs em 12 países, 35 oportunidades, eventos, campanhas, voluntários |
| `app.js` | Estado, roteador, componentes e páginas públicas |
| `area.js` | Área do voluntário, painel da ONG, mensagens, doações e ações |
| `favicon.svg` | Ícone do logotipo |
