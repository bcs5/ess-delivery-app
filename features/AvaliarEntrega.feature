Feature: Avaliar entrega

Scenario: Avaliar entrega após o usuário receber a confirmação dsa entrega
    Given: entrega foi confirmada
    When: usuário recebe a confirmação da entrega na tela
    And: a lista de entregas é mostrada na tela com os trabalhos não avaliados
    And: avaliação do remetente do ultimo trabalho surge com a possibilidade da escolha entre 0 à 5 estrelas
    And: avaliação da coleta do ultimo trabalho surge com a possibilidade da escolha entre 0 à 5 estrelas
    And: usuário escolhe um valor para coleta
    And: usuário escolhe um valor para entrega
    Then: Avaliação da entrega é somada ao total de avaliações e dividida pelo número de avaliações e é armazenado no perfil 
    And: Avaliação da coleta é somada ao total de avaliações e dividida pelo número de avaliações e é armazenado no perfil 

Scenario: Entregador não quer avaliar a entrega
    Given: entrega foi confirmada
    When: usuário recebe a confirmação da entrega na tela
    And: a lista de entregas é mostrada na tela com os trabalhos não avaliados
    And: usuário clica no 'X' da avaliação
    Or: Usuário clica em não avaliar
    Or: usuário clica em voltar
    Then: Avaliação é cancelada
    And: trabalho aparece na lista como não avaliada, com o simbolo ? 

Scenario: Entregador quer avaliar entregas que ignorou antes
    Given: usuário vai até a lista de entregas
    When: usuário clica em uma entrega não avaliada
    And: avaliação do remetente do ultimo trabalho surge com a possibilidade da escolha entre 0 à 5 estrelas
    And: avaliação da coleta do ultimo trabalho surge com a possibilidade da escolha entre 0 à 5 estrelas
    And: usuário escolhe um valor para coleta
    And: usuário escolhe um valor para entrega
    Then: Avaliação da entrega é somada ao total de avaliações e dividida pelo número de avaliações e é armazenado no perfil 
    And: Avaliação da coleta é somada ao total de avaliações e dividida pelo número de avaliações e é armazenado no perfil 

Scenario: Entregador quer reavaliar entregas já avaliadas
    Given: usuário vai até a lista de entregas
    When: usuário clica em uma entrega já avaliada
    Then: Os valores das avaliações aparecem na tela
    And: Não é permitido editar

Scenario: Usuário avalia apenas uma das opções
    Given: entrega foi confirmada
    When: usuário recebe a confirmação da entrega na tela
    And: a lista de entregas é mostrada na tela com os trabalhos não avaliado
    And: avaliação do remetente do ultimo trabalho surge com a possibilidade da escolha entre 0 à 5 estrelas
    And: avaliação da coleta do ultimo trabalho surge com a possibilidade da escolha entre 0 à 5 estrelas
    Or: Usuário escolhe o trabalho não avaliado anteriormente
    And: usuário escolhe um valor para apenas uma das opções
    Then: A avaliação é somada ao total de avaliações e dividida pelo número de avaliações e é armazenado no perfil do escolhido

Scenario: Entregador quer apagar avaliações já feitas
    Given: usuário vai até a lista de entregas
    When: usuário clica em uma entrega já avaliada
    Then: Os valores das avaliações aparecem na tela
    And: Não é permitido editar

Scenario: Entregador quer enviar a avaliação para amigos
    Given: usuário vai até a lista de entregas
    When: usuário clica em uma entrega já avaliada
    Then: Os valores das avaliações aparecem na tela
    And: Não é permitido editar
