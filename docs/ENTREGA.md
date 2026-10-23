# Grupo Vital — duas versões no mesmo ZIP

Este pacote reúne as duas implementações completas, com as fotos reais e os logotipos oficiais preservados. Escolha uma das pastas para trabalhar; não é necessário executar as duas ao mesmo tempo.

```text
grupo-vital-premium/
  LEIA-ME.md
  html-css-javascript/       Pronta para VS Code + Live Server
  nextjs/                    Projeto original Next.js + React + TypeScript
```

## HTML, CSS e JavaScript — execução mais simples

1. Extraia o ZIP inteiro.
2. No VS Code, use **Arquivo → Abrir Pasta** e escolha **html-css-javascript**.
3. Instale a extensão **Live Server**, de Ritwick Dey, se necessário.
4. Abra `index.html`, clique com o botão direito e escolha **Open with Live Server**.

Não é necessário Node.js, npm ou build para essa versão. O CSS fica em `assets/css/styles.css`, o JavaScript em `assets/js/main.js` e os dados editáveis em `assets/js/config.js`. As três páginas individuais têm seus próprios arquivos HTML. Consulte o README dessa pasta.

## Next.js — projeto original

1. Instale Node.js 24 LTS.
2. Abra a pasta **nextjs** no VS Code.
3. No terminal dessa pasta, execute:

```sh
npm install
npm run dev
```

Abra `http://localhost:3000`. Os dados editáveis ficam em `src/config/vital.ts`. Há App Router, React, TypeScript, Tailwind CSS, GSAP, ScrollTrigger, Lucide e Next/Image. Consulte o README da pasta `nextjs`.

## Imagens e dados comerciais

As duas pastas incluem os seis originais, três fotografias otimizadas e três logotipos otimizados. Não houve reconstrução das fotos ou alteração do desenho dos logotipos. Cada versão funciona de maneira independente, por isso as imagens aparecem nas duas pastas.

Telefones, WhatsApp, endereço, horários, planos e domínio devem ser preenchidos com informações reais. Os links oficiais de Instagram já estão configurados. Nenhuma mensagem é enviada automaticamente.

As duas versões compartilham a mesma base visual, mas são projetos independentes: alterações em uma pasta não atualizam automaticamente a outra. A nova aba de horários foi adicionada à versão HTML do site final; a pasta Next.js preserva a implementação original.

## Validação

A versão HTML teve 37 testes de navegador aprovados, com galeria, navegação, menu móvel, filtros e grade de horários das atividades, dados configuráveis, acessibilidade automática e telas de 320 a 1440 px. A versão Next.js também teve 21 testes aprovados na validação da implementação original. Em cada suíte, somente o menu móvel em viewport desktop não se aplica. Os relatórios estão nos arquivos de validação de cada versão.

Este ZIP não contém `node_modules`, builds ou arquivos privados de ambiente. Não é preciso abrir a pasta inteira do pacote como projeto: abra apenas a versão que deseja executar.
