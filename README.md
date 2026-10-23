# Grupo Vital — site final pronto

[**Baixar o site pronto**](https://github.com/codebyemanuel/vital-desenvolvimento/raw/refs/heads/main/downloads/grupo-vital-site-pronto.zip)

A entrega principal agora é um único site pronto, com `index.html` na raiz do ZIP. Inclui a home, as três páginas das unidades, CSS, JavaScript, fontes, fotos reais, logotipos oficiais, animações, galeria e menu mobile. Não precisa de Node.js, npm ou build.

## Abrir no VS Code

1. Extraia o ZIP inteiro.
2. Abra a pasta extraída, que já contém `index.html` na raiz.
3. Instale a extensão **Live Server**, de Ritwick Dey.
4. Clique com o botão direito em `index.html` → **Open with Live Server**.

Se baixar o repositório por **Code → Download ZIP**, abra a pasta `site-html/` dentro dele.

## Arquivos editáveis

- `site-html/index.html` e páginas das unidades: conteúdo e estrutura HTML.
- `site-html/assets/css/styles.css`: aparência e responsividade.
- `site-html/assets/js/config.js`: nomes, descrições, contatos, horários, planos, fotos e logotipos.
- `site-html/assets/js/main.js`: menu, galeria, configuração e animações.

Fotos, fontes, ícones, GSAP e ScrollTrigger estão locais. O site mantém a direção visual e as interações do projeto original e respeita movimento reduzido. Não há dados comerciais inventados.

Leia o [README da versão HTML](site-html/README.md) e a [validação própria dessa versão](site-html/VALIDACAO.md).

## Manutenção no repositório

Para recriar a entrega principal, execute `python3 scripts/package-ready.py`. O resultado é `dist/grupo-vital-site-pronto.zip`. O pacote com as duas bases permanece separado em `downloads/grupo-vital-premium.zip`; não é necessário para abrir o site pronto.

A base original em Next.js permanece na raiz; suas instruções estão em [docs/NEXTJS.md](docs/NEXTJS.md). Ela não é uma dependência da versão HTML entregue.

Para executar os testes da versão HTML na máquina de desenvolvimento, com as dependências de teste instaladas:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test -c playwright.static.config.ts
```

O teste inicia um servidor HTTP estático, sem Next.js. Em outras máquinas, instale o navegador do Playwright ou indique o Chromium existente.

Para gerar o ZIP HTML novamente:

```sh
python3 scripts/package-complete.py
```

A saída fica em `dist/grupo-vital-premium.zip`, com as duas versões em pastas independentes e um `LEIA-ME.md` na raiz. Para disponibilizá-la no GitHub, copie para `downloads/grupo-vital-premium.zip` e envie o commit. Nenhuma versão inclui dependências instaladas ou builds.

Para empacotar somente HTML/CSS/JS, use `python3 scripts/package-static.py`: gera `dist/grupo-vital-html-css-javascript.zip`. A base original em Next.js também mantém seu empacotador em `scripts/package.py`.
