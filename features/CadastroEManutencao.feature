
Feature: Cadastro e manutenção de entregadores (inserir, remover, atualizar)
    As a: Entregador
    I want to: me cadastrar na plataforma e modificar meus dados cadastrados
    So that: seja possível fazer uso da plataforma e manter as minhas informações atualizadas

Cenários de GUI

Scenario: Cadastro De Usuário Realizado
    Given que o usuário esteja na página de Cadastro
    And não exista usuário cadastrado com número de registro da CNH  "12345678910"
    And seja escolhida a opção de entregador
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/00", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE"
    Then aparece mensagem informado o sucesso do cadastro

Scenario: Cadastro De Usuário Não Realizado (CNH já cadastrada)
    Given que o usuário esteja na página de Cadastro
    And já exista usuário cadastrado com número de registro da CNH  "12345678910"
    And seja escolhida a opção de entregador
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/00", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE"
    Then aparece mensagem informado que o cadastro não pôde ser realizado, por já haver cadastro com a CNH informada

Scenario: Cadastro De Usuário Não Realizado (Email já existente)
    Given que o usuário esteja na página de Cadastro
    And não exista usuário cadastrado com email  "gertudrinha@email.com" 
    And seja escolhida a opção de entregador
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/05", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE"
    Then aparece mensagem informado que o cadastro não pôde ser realizado, por já haver cadastro com o email informado

Scenario: Cadastro De Usuário Não Realizado (Dado ausente no cadastro)
    Given que o usuário esteja na página de Cadastro
    And todos os campos são de preenchimento obrigatório 
    And seja escolhida a opção de entregador
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/05", email: "gertudrinha@email.com" e endereço ""
    Then aparece mensagem informado que o cadastro não pôde ser realizado, por falta de preenchimento de dado cadastral obrigatório

Cenários de Serviço

Scenario: Cadastro De Usuário Realizado 
    Given dado que o usuário esteja na página de cadastro do sistema
    And não exista na memória um usuário com número de registro da CNH  "12345678910"
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/00", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE"
    Then um usuário com os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/00", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE" é armazenado na memória

Scenario: Cadastro De Usuário Não Realizado (CNH já cadastrada)
    Given dado que o usuário esteja na página de cadastro do sistema
    And já exista na memória um usuário com número de registro da CNH  "12345678910"
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/00", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE"
    Then a memória do sistema não é alterada, não havendo duplicação do usuário já cadastrado

Scenario: Cadastro De Usuário Não Realizado (CNH já cadastrada)
    Given dado que o usuário esteja na página de cadastro do sistema
    And já exista na memória um usuário com email  "gertudrinha@email.com" 
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/00", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE"
    Then a memória do sistema não é alterada, não haverá duplicação do usuário já cadastrado