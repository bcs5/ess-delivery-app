
Feature: Cadastro e manutenção de entregadores (inserir, remover, atualizar)
    As a: Entregador
    I want to: me cadastrar na plataforma e modificar meus dados cadastrados
    So that: seja possível fazer uso da plataforma e manter as minhas informações atualizadas

Cenários de GUI

Scenario: Cadastro De Usuário Realizado
    Given que o usuário esteja na página de Cadastro
    And não exista usuário cadastrado com número de registro da CNH  "12345678910"
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/00", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE"
    Then aparece mensagem informando o sucesso do cadastro

Scenario: Cadastro De Usuário Não Realizado (CNH já cadastrada)
    Given que o usuário esteja na página de Cadastro
    And já exista usuário cadastrado com número de registro da CNH  "12345678910"
    And seja escolhida a opção de entregador
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/00", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE"
    Then aparece mensagem informando que o cadastro não pôde ser realizado, por já haver cadastro com a CNH informada

Scenario: Cadastro De Usuário Não Realizado (Email já existente)
    Given que o usuário esteja na página de Cadastro
    And já exista usuário cadastrado com email  "gertudrinha@email.com" 
    And seja escolhida a opção de entregador
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/05", email: "gertudrinha@email.com" e endereço "Rua do Sol, 123, 55.555-000, Recife-PE"
    Then aparece mensagem informando que o cadastro não pôde ser realizado, por já haver cadastro com o email informado

Scenario: Cadastro De Usuário Não Realizado (Dado ausente no cadastro)
    Given que o usuário esteja na página de Cadastro
    And todos os campos são de preenchimento obrigatório 
    And seja escolhida a opção de entregador
    When o usuário preenche os dados CNH "12345678910", Nome completo: "Maria José Gertrudes", telefone "(99)99999-9999", data de nascimento "12/12/05", email: "gertudrinha@email.com" e endereço ""
    Then aparece mensagem informando que o cadastro não pôde ser realizado, por falta de preenchimento de dado cadastral obrigatório

Scenario: Alteração de Dados De Usuario Realizada
   Given que o usuário esteja na página de Alteração de Dados da Conta
   When o usuário altera o campo de e-mail de "gertudres@email.com" para "gertudrinha123@email.com"
   And o usuario confima a senha "123gzinha"
   Then aparece mensagem informando o sucesso da alteração

Scenario: Alteração de Dados De Usuario Não Realizada (senha incorreta)
   Given que o usuário esteja na página de Alteração de Dados da Conta
   And a senha do usuário é "123gzinha"
   When o usuário altera o campo de e-mail de "gertudres@email.com" para "gertudrinha123@email.com"
   And o usuario confima a senha "123gznh"
   Then aparece mensagem informando que a alteração não pode ser realizada pois a senha digitada está incorreta

Scenario: Alteração de Dados De Usuário Não Realizado (e-mail já existente)
    Given que o usuário esteja na página de Alteração de Dados da Conta
    And já exista usuário cadastrado com email  "gertudrinha@email.com" 
    When o usuário altera o campo de e-mail de "gertudres@email.com" para "gertudrinha@email.com"
    And salva a alteração
    Then aparece mensagem informando que a alteração de dados não pôde ser realizada, por já haver cadastro com o email informado

Scenario: Alteração de Informações Pessoais Realizada
   Given que o usuário esteja na página de Alteração de Dados do Usuário
   When o usuário altera o campo de telefone de "(99)99999-9999" para "(81)99999-9999"
   And o usuario confima a senha "123gzinha"
   Then aparece mensagem informando o sucesso da alteração

Scenario: Alteração de Informações Pessoais Não Realizada (senha incorreta)
   Given que o usuário esteja na página de Alteração de Dados do Usuário
   And a senha do usuário é "123gzinha"
   When o usuário altera o campo de telefone de "(99)99999-9999" para "(81)99999-9999"
   And o usuario confima a senha "123gznh"
   Then aparece mensagem informando que a alteração não pode ser realizada pois a senha digitada está incorreta

Scenario: Alteração de Informações Pessoais Não Realizada (CNH já existente)
    Given que o usuário esteja na página de Alteração de Informações Pessoais
    And já exista usuário cadastrado com número de registro da CNH  "12345678910"
    When o usuário altera o campo de CNH de "12345678911" para "12345678910"
    And salva a alteração
    Then aparece mensagem informando que a alteração de informações não pôde ser realizada, por já haver cadastro com a CNH informada

Scenario: Login Bem-Sucedido
    Given que o usuário esteja na página de Login
    And exista um usuário cadastrado com email "gertudrinha@email.com" e senha "123gzinha"
    When o usuário preenche os dados email: "gertudrinha@email.com" e senha "123gzinha"
    And confirma o login
    Then o usuário é direcionado para a página inicial do sistema

Scenario: Login Mal-Sucedido (Senha incorreta)
    Given que o usuário esteja na página de Login
    And exista um usuário cadastrado com email "gertudrinha@email.com" e senha "123gzinha"
    When o usuário preenche os dados email: "gertudrinha@email.com" e senha "123gzi"
    And confirma o login
    Then aparece uma mensagem informando que o login não pôde ser realizado pois a senha digitada está incorreta

Scenario: Login Mal-Sucedido (Email não cadastrado)
    Given que o usuário esteja na página de Login
    And não exista um usuário cadastrado com email "gertudrinha@email.com"
    When o usuário preenche os dados email: "gertudrinha@email.com" e senha "123gzi"
    And confirma o login
    Then aparece uma mensagem informando que o login não pôde ser realizado pois o email digitado não está cadastrado

Scenario: Login indisponível (Ausência de dado)
    Given que o usuário esteja na página de Login
    And exista um usuário cadastrado com email "gertudrinha@email.com" e senha "123gzi"
    When o usuário preenche o dado email "gertudrinha@email.com" 
    And não digita a senha
    Then o usuário não consegue confirmar o login
    
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
