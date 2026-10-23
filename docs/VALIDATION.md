# Validação — 23 de outubro de 2026

Estado: projeto executável com as três fotografias reais e os três logotipos oficiais recebidos em `fotos acad.zip`, associados às unidades corretas. Originais preservados, cópias para web importadas e build refeito com os arquivos reais.

## Verificações concluídas

| Verificação | Resultado observado |
| --- | --- |
| Instalação pelo lockfile | `npm ci --cache /workspace/.npm-cache`: passou na preparação; dependências e lockfile mantidos na integração dos arquivos |
| TypeScript | `npm run typecheck`: passou após a integração |
| Lint | `npm run lint`: passou, zero avisos |
| Build de produção | `npm run build`: passou com os seis arquivos oficiais; home e três páginas individuais pré-renderizadas |
| Navegador em produção | `CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`: 21 testes passaram, zero falhas, 1 não aplicável |
| Acessibilidade automática | axe WCAG A/AA: zero violações detectadas nas quatro páginas em desktop e simulação móvel |
| Responsividade | Sem overflow horizontal nas quatro páginas em 320, 375, 768, 1024 e 1440 px |
| Imagens no navegador | Fotos e logos carregaram nas quatro rotas; nenhum placeholder de mídia presente |
| Galeria | As três fotos foram abertas, carregadas e associadas às respectivas unidades em desktop e celular; Escape fechou o diálogo e devolveu o foco ao botão |
| Identidade | Conferência visual dos seis arquivos recebidos e dos heros renderizados; sem mistura entre unidades |
| Originais | `npm run assets:check`: seis originais íntegros por SHA-256; seis cópias para web válidas |
| Repetibilidade da importação | Importador executado duas vezes com os mesmos arquivos, sem alteração dos originais ou conflito |
| Rotas e contatos | Navegação entre unidades, retorno à home e links de Instagram passaram; WhatsApp oculto sem número configurado |
| Menu móvel | Abertura, foco inicial, ciclo de Tab, Escape e navegação passaram |
| Preferência de movimento | Conteúdo e navegação funcionaram com movimento reduzido |
| Recursos e erros | Nenhum erro JavaScript ou recurso local HTTP >=400 nas quatro rotas testadas; 404 personalizada retornou status 404 |
| SEO de desenvolvimento | robots e sitemap responderam; indexação bloqueada sem domínio real |

A execução final usou Chromium 154 instalado no sistema e Playwright 1.64.1. O único teste marcado como não executado foi o menu móvel no viewport desktop, onde esse menu não existe. O menu móvel foi testado com sucesso no projeto de celular. Os testes de galeria foram executados integralmente com as fotografias oficiais.

A primeira execução após a importação encontrou uma verificação de imagem anterior ao término do carregamento lazy. O teste foi corrigido para levar cada imagem à área visível e aguardar carregamento e dimensões reais, mantendo a falha para imagens quebradas. A suíte completa final passou com essa verificação. Não foram removidas as verificações de carregamento, recursos ou acessibilidade.

## Preservação dos arquivos oficiais

Os originais estão em `public/images/originals/<unidade>/`. O registro `public/images/asset-records.json` contém caminhos, dimensões e hashes SHA-256. As fotos foram somente orientadas conforme EXIF, redimensionadas proporcionalmente quando necessário e comprimidas para WebP; não houve reconstrução, alteração de cenário ou edição generativa. Os logos receberam cópias WebP sem perdas, preservando desenho, cores, proporções e fundos.

Cards e heros usam recortes responsivos de apresentação. O diálogo da galeria mostra a fotografia inteira com `object-fit: contain`. A revisão visual incluiu a home, os três heros individuais em desktop e a home e o hero Vital Beach em largura móvel.

## Configuração antes da publicação pública

- Definir o domínio real em `NEXT_PUBLIC_SITE_URL` e refazer o build para habilitar sitemap, URLs absolutas e indexação.
- Fornecer telefone, WhatsApp, endereço, horários e planos reais em `src/config/vital.ts` quando disponíveis. Esses dados não foram inventados e não impedem executar o site.
- O logo Vital Beach fornecido tem 150 × 150 px; sua resolução original foi preservada.

## Limites da validação

Safari e aparelhos iPhone/Android físicos não foram executados: houve simulação móvel no Chromium. As análises automáticas de acessibilidade complementam a revisão manual e não constituem auditoria completa. Nenhuma mensagem foi enviada aos canais de atendimento. Publicação do site, publicação do ambiente e restauração em uma nova tarefa não foram realizadas.

O ZIP final inclui código-fonte, lockfile, documentação, seis originais, três fotografias WebP e três logos WebP. Não inclui dependências instaladas ou arquivos de build.
