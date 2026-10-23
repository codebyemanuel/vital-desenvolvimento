# Grupo Vital

## Baixar o projeto completo

[Baixar grupo-vital-premium.zip](https://github.com/codebyemanuel/vital-desenvolvimento/raw/refs/heads/main/downloads/grupo-vital-premium.zip)

O ZIP inclui o código-fonte, as três fotografias originais, cópias otimizadas e os três logotipos oficiais. Também é possível baixar o repositório por **Code → Download ZIP** no GitHub.

Portal institucional com páginas individuais para Força Vital, CT General e Vital Beach. Next.js App Router, React, TypeScript, Tailwind CSS, GSAP/ScrollTrigger, Lucide e Next/Image. Fontes locais: Barlow Condensed e Manrope; o build não precisa acessar Google Fonts.

**Situação da entrega:** projeto implementado com as três fotografias reais, as cópias otimizadas e os três logotipos oficiais recebidos em `fotos acad.zip`. Os originais estão preservados e vinculados às respectivas unidades. Consulte [docs/ASSETS.md](docs/ASSETS.md) para a correspondência e [docs/VALIDATION.md](docs/VALIDATION.md) para os testes executados.

## Abrir no Visual Studio Code

1. Extraia `grupo-vital-premium.zip`.
2. No VS Code, escolha **Arquivo → Abrir Pasta** e selecione a pasta `grupo-vital-premium` que contém `package.json`.
3. Instale Node.js 24 LTS (mínimo suportado pelo Next.js: 20.9) e npm.
4. Abra **Terminal → Novo Terminal** e execute:

```sh
npm install
npm run dev
```

Abra `http://localhost:3000`. Para reproduzir exatamente o lockfile, prefira `npm ci` em vez de `npm install`.

## Rotas

| Caminho | Conteúdo |
| --- | --- |
| `/` | Portal do Grupo Vital, cards de unidades, apresentação e galeria |
| `/forca-vital` | Musculação e fitness |
| `/ct-general` | CrossFit e treinamento funcional |
| `/vital-beach` | Futevôlei e esportes de areia |
| `/robots.txt` | Política de indexação conforme domínio configurado |
| `/sitemap.xml` | URLs públicas quando o domínio estiver configurado |

## Dados e contatos

Edite `src/config/vital.ts`: nomes, descrições, modalidades, estrutura, Instagram, telefone, WhatsApp, endereço, horários, planos, fotos e logos. Dados desconhecidos são `null` ou listas vazias. Não há preços, horários ou endereços inventados.

O botão para combinar uma visita abre o Instagram oficial da unidade. Não promete agendamento confirmado. Quando `whatsapp` receber um número real com código do país e DDD, um botão adicional será exibido. Use somente dígitos, incluindo código do país e DDD. Não é preciso API ou chave paga. A disponibilidade de aula experimental deve ser confirmada com a unidade.

## Fotografias e logotipos

Os seis arquivos oficiais já estão incluídos; não é necessário importá-los para executar o projeto. Para verificar sua integridade, use `npm run assets:check`. Para uma futura importação, siga [docs/ASSETS.md](docs/ASSETS.md):

```sh
npm run assets:import -- /caminho/manifesto.json
npm run assets:check
```

Estrutura:

```text
public/
  images/
    originals/<unidade>/       # originais de foto e logo, intactos
    optimized/<unidade>/       # foto WebP proporcional
    asset-records.json         # integridade SHA-256 dos originais
  logos/<unidade>/             # logo WebP sem perdas
src/
  app/                        # rotas, SEO, erro e 404
  components/                 # navegação, animações, mídia e galeria
  config/vital.ts              # dados editáveis
scripts/                      # importação, verificação e empacotamento
tests/                        # navegação e acessibilidade em navegador
```

Os seis arquivos estão presentes e as páginas são pré-renderizadas. Refazer o build após substituir imagens ou alterar dados. A galeria usa fotos reais existentes; novas fotos podem ser adicionadas à propriedade `gallery` de cada unidade. A baixa resolução do logo da Vital Beach visto no chat é preservada, sem ampliação artificial.

## Produção e SEO

Copie `.env.example` para `.env.local` e defina `NEXT_PUBLIC_SITE_URL` com o domínio real HTTPS, sem credenciais. Essa variável é pública. Sem domínio configurado, a indexação permanece bloqueada e o sitemap não inventa URLs. Metadados por unidade e Open Graph usam a foto oficial após a importação e configuração do domínio. Configure o domínio antes do build de publicação.

```sh
npm run build
npm run start
```

Pode ser publicado em uma plataforma compatível com Next.js/Node. Nenhum banco de dados ou serviço pago é necessário. O servidor está configurado para ouvir em todas as interfaces, como exigido por ambientes na nuvem.

## Validação

```sh
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
npm run assets:check
```

Os testes de navegador iniciam um servidor de produção automaticamente; é necessário fazer o build antes. Testam as quatro rotas, erros de recursos e JavaScript, WCAG A/AA com axe, navegação, menu móvel e foco, Escape, movimento reduzido, contatos, 404 e larguras de 320 a 1440 pixels. Simulação móvel usa Chromium; não substitui testes em aparelhos físicos ou Safari. Automação de acessibilidade complementa, mas não substitui, uma auditoria manual.

Em uma máquina que já tenha Chromium, é possível evitar outro download. No Linux:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

No ambiente de nuvem atual, utilize `npm ci --cache /workspace/.npm-cache` para manter o cache em um local gravável. O download do navegador pelo CDN foi negado pela política de rede; o Chromium já instalado permite executar os testes com verificação de TLS preservada.

Os testes exigem as fotos e os logos oficiais, sem áreas pendentes, e abrem as três fotografias na galeria em desktop e celular. `assets:check` verifica a integridade dos seis originais e a validade das cópias para web. Apenas o teste de menu móvel no viewport desktop é marcado como não aplicável.

## Gerar o ZIP

Com Python 3 disponível:

```sh
npm run package:zip
```

Saída: `dist/grupo-vital-premium.zip`. Inclui fonte, lockfile, documentação, configurações e todos os arquivos oficiais em `public/`. Exclui `node_modules`, builds, Git, relatórios de testes e arquivos `.env` privados. `.env.example` é incluído.

O ZIP inclui os seis originais, três fotografias otimizadas e três logos otimizados. Para publicar o site, configure os dados comerciais reais e o domínio; nenhum endereço, horário, preço ou telefone foi inventado.
