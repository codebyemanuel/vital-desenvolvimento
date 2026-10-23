# Origem e conferência dos horários

A grade do site final em HTML/CSS/JavaScript foi transcrita de três imagens enviadas pelo responsável na conversa: grade de manhã/noite da Força Vital, aviso de funcional aos sábados da Vital Beach e grade de futevôlei da Vital Beach.

Os textos menores da grade de futevôlei foram apresentados ao responsável para conferência. A correção recebida foi usar Iniciante A no lugar da categoria que havia sido lida como B. A correção foi aplicada na configuração e a suíte verifica que não existe essa categoria B na apresentação da grade.

## Força Vital

29 registros: segunda 7, terça 5, quarta 8, quinta 5 e sexta 4. São 14 no período da manhã e 15 à noite. Fit Dance e Spinning permanecem simultaneamente às 19h em segunda e quarta, como na imagem. Alongamento / Pilates no solo é mantido como descrição conjunta do horário das 18h em terça e quinta.

## Vital Beach

30 registros na grade de futevôlei: seis por dia, de segunda a sexta, às 07h, 08h, 17h, 18h, 19h e 20h. Os cinco horários das 08h são explicitamente marcados como Livre. Kids aparece às 17h em terça e quinta. Categorias combinadas da mesma célula permanecem como uma descrição conjunta, sem inventar turmas ou vagas adicionais.

Seis registros de funcional: terça e quinta às 07h e 19h, e sábado das 07h às 08h e das 08h às 09h. Somente os dois registros de sábado têm horário final, porque os demais horários informam apenas o início.

A divisão de períodos segue os blocos das imagens: na Vital Beach, 17h e 18h estão no bloco da tarde, e 19h e 20h no bloco da noite. Na Força Vital, o bloco da noite começa às 18h.

## Dados não fornecidos

A grade do CT General não foi enviada e continua a confirmar. O site não transforma ausência de dados em indicação de unidade fechada. Os horários de atividades são separados de `hours`, reservado ao funcionamento geral da unidade, e não representam confirmação automática de vagas ou agendamento.

## Arquivo HTML do Instagram

O HTML salvo fornecido contém referências a imagens em uma pasta local que não acompanha o arquivo. Não foi executado nem copiado para o site. A transcrição usa as imagens visíveis fornecidas na conversa e a correção de nomenclatura do responsável.

## Manutenção

Edite `site-html/assets/js/config.js`. A interface usa `activitySchedule` e `activityScheduleNote`. Para atualizar a grade HTML inicial após editar a configuração, execute `python3 scripts/sync-schedule.py`. O site não precisa dessa ferramenta ou de Python para funcionar com seus arquivos prontos.

Testes: `tests-static/schedule.spec.ts`. Executar com a configuração `playwright.static.config.ts` na máquina de manutenção. Os pacotes incluem o novo CSS e JavaScript da grade e preservam os originais das seis fotos/logos.
