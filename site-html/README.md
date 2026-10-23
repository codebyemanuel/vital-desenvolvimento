# Grupo Vital — HTML, CSS e JavaScript

Site completo para abrir e editar no Visual Studio Code. Home, Força Vital, CT General, Vital Beach e página 404. A identidade, as fotos reais, os logotipos oficiais, os cards interativos, a galeria, o menu mobile e as animações foram mantidos da base do projeto.

**Não é preciso instalar Node.js, usar npm ou compilar o site.** Todos os estilos, scripts, GSAP/ScrollTrigger, ícones e fontes são locais. Não há chamadas automáticas para APIs ou CDNs. Os links de Instagram e WhatsApp, quando configurado, precisam de internet para abrir os respectivos serviços.

## Abrir no VS Code

1. Extraia o ZIP inteiro.
2. No VS Code, use **Arquivo → Abrir Pasta** e selecione a pasta `grupo-vital-premium` que contém `index.html`.
3. Instale a extensão **Live Server**, de Ritwick Dey, recomendada pelo projeto.
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**, ou use **Go Live** na barra inferior.
5. O navegador abrirá o site. Salvar alterações no VS Code atualiza a página.

O Live Server é a forma de execução validada. O site usa caminhos relativos, scripts clássicos e não depende de `fetch`, módulos JavaScript ou serviços de servidor. Também pode ser aberto por `index.html` em navegadores que permitam arquivos locais; esse modo não foi testado no navegador gerenciado do ambiente, que bloqueia `file://`.

Como alternativa ao Live Server, se Python já estiver instalado, execute na pasta do site:

```sh
python -m http.server 5500
```

Depois abra `http://localhost:5500`. Em sistemas em que o comando é `python3`, use `python3 -m http.server 5500`.

## Estrutura

```text
index.html                       Home completa
forca-vital/index.html            Página da academia
ct-general/index.html             Página do centro de treinamento
vital-beach/index.html            Página dos esportes de areia
404.html                         Página para rota não encontrada
assets/
  css/styles.css                 CSS nativo, organizado e responsivo
  js/config.js                   Configuração central editável
  js/main.js                     Menu, galeria, dados e animações
  vendor/                        GSAP e ScrollTrigger locais
  fonts/                         Fontes Barlow Condensed e Manrope locais
public/
  images/originals/               Seis originais recebidos, sem alterações
  images/optimized/               Três fotos em WebP
  images/asset-records.json       Registro SHA-256 dos originais
  logos/                         Três logotipos otimizados sem perdas
licenses/                        Licenças das fontes, ícones e animações
.vscode/                         Recomendação e configuração do Live Server
```

As páginas contêm o HTML completo; a navegação principal e o conteúdo inicial continuam disponíveis sem JavaScript. O JavaScript adiciona configurações editáveis, animações, menu móvel e galeria ampliável.

## Editar conteúdo e contatos

Abra `assets/js/config.js`. Os campos de cada unidade permitem alterar nome, descrições, Instagram, telefone, WhatsApp, endereço, modalidades, estrutura, horários, planos, fotografias, logotipos e galeria. `null` e listas vazias representam informações não fornecidas.

- **WhatsApp:** preencha `whatsapp` com o número real, somente dígitos, incluindo país e DDD. O botão aparece automaticamente quando houver um número válido.
- **Funcionamento da unidade (opcional):** preencha `hours` com objetos contendo `days` e `time`. Para horários das aulas, use `activitySchedule`, descrito abaixo.
- **Planos:** preencha `plans` com objetos contendo `name` e `price`.
- **Fotos da galeria:** adicione objetos `{ "src": "public/images/optimized/unidade/nova-foto.webp", "alt": "Descrição real da fotografia" }` em `gallery`. Coloque o arquivo no caminho indicado.
- **Identificadores:** mantenha os valores `slug`, pois correspondem às pastas das páginas.

A configuração aplica os dados ao navegador. Para alterar textos institucionais da home ou a estrutura das páginas, edite também os arquivos HTML. Para SEO e compartilhamento em redes sociais, mantenha os textos de `<title>` e `<meta>` dos HTMLs consistentes com o conteúdo configurado.

O destino de contato atual é o Instagram oficial de cada unidade. Não são inventados números, endereços, horários, planos ou preços. O contato combina a visita com a equipe, sem confirmar um agendamento automaticamente.

## Horários das atividades

A aba **Horários** aparece no menu da home e das páginas das unidades. Mantém o estilo escuro e dourado, com filtros por unidade, dia da semana, período e, na Vital Beach, modalidade. As abas funcionam por teclado e a grade inicial também está presente no HTML.

Os horários foram transcritos das imagens fornecidas pelo responsável:

- **Força Vital:** 29 opções na semana, de segunda a sexta. Fit Dance e Spinning permanecem às 19h nas segundas e quartas, conforme a imagem.
- **Vital Beach:** 30 registros de futevôlei, incluindo os cinco períodos marcados como Livre, e seis de funcional. Há Kids às terças e quintas, às 17h. A nomenclatura usa Iniciante A, conforme a correção do responsável.
- **Funcional da Vital Beach:** terça e quinta às 07h e 19h; sábado das 07h às 08h e das 08h às 09h.
- **CT General:** programação a confirmar; não foram fornecidos horários dessa unidade.

Edite `activitySchedule` de cada unidade em `assets/js/config.js`. Cada registro contém `day` (segunda, terca, quarta, quinta, sexta, sabado, domingo), `start`, `end` (somente quando informado), `activity`, `period` (manha, tarde, noite) e, quando aplicável, `modality` (futevolei ou funcional). Os períodos livres têm `kind: "livre"`.

Os horários das fotos, em geral, indicam apenas o início. Não foi presumida a duração das aulas. Os registros de sábado têm início e fim porque a imagem os informa explicitamente. A divisão manhã/tarde/noite segue a grade de cada unidade; na Vital Beach, as aulas das 18h pertencem ao bloco da tarde mostrado na imagem.

Alterações na configuração aparecem ao recarregar a página, sem build. Na manutenção do repositório, `python3 scripts/sync-schedule.py` atualiza também a grade HTML inicial para acesso sem JavaScript; não é necessário executar essa ferramenta para abrir o site.

## Preservação das fotos e dos logotipos

Os seis arquivos recebidos no ZIP original estão em `public/images/originals/<unidade>/`, incluindo fotos e logos. Os hashes estão em `asset-records.json`.

As fotos foram somente orientadas conforme EXIF, redimensionadas proporcionalmente quando necessário e comprimidas. Não houve alteração de paredes, equipamentos, quadras, redes, objetos, murais ou arquitetura. Os logos mantêm desenho, cores, proporções e fundos originais. Cards e heros usam recortes de apresentação; a ampliação da galeria exibe a fotografia inteira.

O logo Vital Beach fornecido tem 150 × 150 pixels. Sua resolução original foi preservada.

## Animações e acessibilidade

GSAP e ScrollTrigger estão em `assets/vendor/`. Revelações, parallax moderado e animação do menu respeitam `prefers-reduced-motion`. Há navegação por teclado, foco visível, link para pular ao conteúdo, ciclo de foco no menu e diálogo da galeria com fechamento por Escape.

## Publicar em hospedagem estática

Envie o conteúdo desta pasta mantendo a estrutura, incluindo `assets` e `public`. As pastas das unidades contêm `index.html`, permitindo caminhos como `/forca-vital/` em servidores estáticos comuns. Não é necessário backend.

Antes de indexar publicamente:

1. Configure o domínio real em `site.url` no arquivo `config.js`.
2. Atualize o `<head>` dos HTMLs com canonical, URLs e imagem Open Graph absolutos do domínio real. O SEO inicial já contém títulos e descrições por página; metadados de robôs de redes sociais devem estar no HTML, não somente no JavaScript.
3. Troque `noindex, nofollow` por `index, follow` nas páginas que devem ser indexadas.
4. Edite `robots.txt`, permitindo indexação e indicando o sitemap com o domínio real.
5. Preencha `sitemap.xml` com a home e as três páginas, usando URLs reais.
6. Configure a hospedagem para servir `404.html` nas rotas inexistentes. O servidor simples do Live Server/Python pode usar sua própria página 404.

A configuração inicial bloqueia indexação enquanto o domínio não tiver sido informado, para não publicar URLs fictícias.

## Validação

Confira `VALIDACAO.md`. A versão HTML foi testada separadamente da versão Next.js original; os resultados anteriores do projeto não foram usados como substitutos dos testes desta entrega.
