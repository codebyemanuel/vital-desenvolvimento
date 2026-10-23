# Validação da versão HTML — 23 de outubro de 2026

Foram executados testes próprios em um servidor HTTP estático local, equivalente ao uso com Live Server. O site foi servido diretamente de sua pasta, sem Next.js, React, npm, compilação ou backend de aplicação durante a execução.

## Resultado

- 37 testes de navegador passaram, sem falhas, após a inclusão da grade de atividades.
- Um caso não se aplica: menu móvel no viewport desktop. O menu foi testado e passou no viewport móvel.
- As quatro páginas carregaram HTML, CSS, JavaScript, fotos, logotipos e fontes locais.
- Nenhuma requisição externa automática, recurso local quebrado ou erro JavaScript foi detectado nas quatro páginas.
- Axe WCAG A/AA não detectou violações nas quatro páginas em desktop e simulação móvel.
- Navegação entre unidades e retorno à home funcionaram com os caminhos relativos.
- As três fotos abriram na galeria; Escape e botão fechar funcionaram, com devolução do foco.
- Menu móvel, foco inicial, Tab, Escape e navegação foram verificados.
- A configuração central foi testada com dados temporários de nome, WhatsApp, endereço, horários e planos, sem gravar dados fictícios no projeto entregue.
- Sem número de WhatsApp, o botão permanece oculto e o destino de contato é o Instagram oficial.
- A preferência por movimento reduzido manteve o conteúdo e a navegação funcionais.
- Não houve overflow horizontal nas quatro páginas em 320, 375, 768, 1024 e 1440 pixels.
- O HTML principal continuou visível e navegável com JavaScript desativado. A página `404.html` foi fornecida e testada.
- Os seis arquivos originais foram preservados; a integridade SHA-256 é verificada durante o empacotamento.

A execução usou Chromium instalado no ambiente e Playwright. A sintaxe dos scripts foi verificada por `node --check`, e o lint do repositório passou. Node.js e as ferramentas de teste são usados na manutenção, não são requisitos para executar o ZIP entregue.

## Grade de atividades

A suíte adicional conferiu integralmente os 29 registros da Força Vital e os 30 registros de futevôlei da Vital Beach, incluindo Kids, os cinco períodos livres e a nomenclatura Iniciante A. Também verificou os seis registros de funcional da Vital Beach, com os dois intervalos explícitos de sábado.

Os filtros de unidade, dia, período e modalidade foram exercitados, assim como abas por teclado, estado vazio, links de contato, acesso pela navegação móvel e grades iniciais sem JavaScript. A análise axe também passou nas três unidades da aba Horários. O CT General permanece sem horários de atividades por falta de grade fornecida.

Os testes não substituíram os horários informados por inferências de duração. Na grade da Força Vital, duas modalidades às 19h em segunda e quarta são preservadas.

## Limites

A abertura por `file://` não pôde ser validada: a política do navegador gerenciado bloqueia esse protocolo. A execução HTTP foi validada e é a recomendação no VS Code. Safari e aparelhos físicos não foram testados; houve simulação móvel no Chromium. As verificações automáticas de acessibilidade não substituem auditoria manual completa.

Nenhuma mensagem foi enviada ao atendimento das unidades. A publicação pública depende do domínio e dos dados comerciais reais. Não foi afirmada publicação do site ou restauração do ambiente em uma nova tarefa.
