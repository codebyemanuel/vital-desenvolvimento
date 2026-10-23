# Arquivos oficiais

Os seis arquivos oficiais foram recebidos em `fotos acad.zip`, conferidos visualmente e importados no projeto. Não há fotografias de terceiros ou logos recriados. Os originais estão preservados byte a byte em `public/images/originals/`, com registro SHA-256 em `public/images/asset-records.json`. Não é preciso executar o importador para abrir esta entrega.

Correspondência confirmada pelo proprietário:

| Unidade | Foto | Logotipo |
| --- | --- | --- |
| Força Vital | Mural de mulher flexionando o braço, piso amadeirado e equipamento | Fundo escuro, haltere, símbolo FV, dourado e prata |
| CT General | Espaço de treino com barras, argolas, cordas e remos | Estrela e asas, nome CT General, verde e dourado |
| Vital Beach | Quadra de areia ao entardecer, mural esportivo e palmeira | Nome Vital Beach em amarelo e preto, bola e rede |

## Reimportação ou novas cópias

Guarde os seis arquivos em uma pasta fora do repositório e crie ali um `manifesto.json`, com os caminhos corretos relativos ao manifesto:

```json
{
  "forca-vital": { "photo": "forca-foto.jpg", "logo": "forca-logo.jpg" },
  "ct-general": { "photo": "ct-foto.jpg", "logo": "ct-logo.jpg" },
  "vital-beach": { "photo": "beach-foto.jpg", "logo": "beach-logo.jpg" }
}
```

Execute na raiz do projeto:

```sh
npm run assets:import -- /caminho/manifesto.json
npm run assets:check
npm run build
```

O importador valida todos os arquivos antes de gravar. Mantém cópias byte a byte em `public/images/originals/<unidade>/`, incluindo os logos originais. Gera fotos WebP de até 1920 px em `public/images/optimized/<unidade>/espaco.webp` e logos WebP sem perdas em `public/logos/<unidade>/logo.webp`. Não amplia imagens pequenas, não recorta, não faz tratamento generativo, não remove fundos e não redesenha marcas. A foto recebe somente orientação EXIF, redimensionamento proporcional e compressão. Os logos mantêm dimensões, cores, fundo e transparência do arquivo recebido.

Reexecutar com os mesmos arquivos é seguro. Arquivos existentes diferentes bloqueiam a importação; preserve-os antes de substituí-los conscientemente. O registro `public/images/asset-records.json` permite verificar a integridade dos originais por SHA-256. Confirme visualmente a correspondência após importar: checksums não identificam a unidade da foto.

Depois, adicione fotos reais à lista `gallery` de cada unidade em `src/config/vital.ts`. Os caminhos devem ser locais, dentro de `public/`. Reinicie o desenvolvimento ou refaça o build para refletir novos arquivos em páginas estáticas.

O logo oficial da Vital Beach recebido no ZIP tem 150 × 150 pixels. Não o amplie artificialmente. Para usos maiores e melhor nitidez, prefira um original de maior resolução, se disponível.

## Arquivos recebidos e associação

| Unidade | Arquivo da foto | Arquivo do logo | Dimensões originais (foto / logo) |
| --- | --- | --- | --- |
| Força Vital | `academia força vital.jpg` | `logo força vital.jpg` | 2268 × 4032 / 1080 × 1080 |
| CT General | `Academia CrossFit.png` | `logo ct general.jpg` | 1122 × 1402 / 1080 × 1080 |
| Vital Beach | `foto futvolei.png` | `logo futvolei.jpg` | 941 × 1672 / 150 × 150 |

As fotografias são apresentadas com recortes responsivos em cards e heros. A galeria ampliada mostra a composição integral com `object-fit: contain`. Os arquivos otimizados preservam a proporção completa, sem recorte gravado, reconstrução ou alteração dos ambientes. Os fundos dos logos recebidos foram preservados.
