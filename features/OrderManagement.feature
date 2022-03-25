Feature: Order data Management
  Scenario: entregador aceita pedido e mas não ver informações do cliente
    Given logado como "jose@gmail.com"
    And tenho um pedido "alocado" com id "#89" para o restaurante "Burger King - Madalena" para o cliente "gabriel@gmail.com"
    When informar pedido "#89" "aceito"
    Then detalhes pedido "#89" não possui infos do cliente "gabriel@gmail.com"
    And detalhes pedido "#89" possui infos do restaurante "Burger King - Madalena"

  Scenario: entregador informa coleta do pedido e ver informações do cliente
    Given logado como "jose@gmail.com"
    And tenho um pedido "aceito" com id "#89" para o restaurante "Burger King - Madalena" para o cliente "gabriel@gmail.com"
    When informar pedido "#89" "coletado"
    Then detalhes pedido "#89" possui infos do cliente "gabriel@gmail.com"
    And detalhes pedido "#89" possui infos do restaurante "Burger King - Madalena"

  Scenario: entregador checa saldo após entrega realizada
    Given logado como "jose@gmail.com"
    And tenho "30" reais de saldo
    And tenho um pedido "coletado" com id "#89" para o restaurante "Burger King - Madalena" para o cliente "gabriel@gmail.com" com lucro de "19" reais
    When informar pedido "#89" "entregue"
    Then saldo de "49" reais

  Scenario: pedido entregue e entregador não ver informações do cliente após 15 min
    Given logado como "jose@gmail.com"
    And tenho um pedido "entregue" com id "#89" para o restaurante "Burger King - Madalena" para o cliente "gabriel@gmail.com"
    And pedido "entregue" há 16 min
    Then detalhes pedido "#89" não possui infos do cliente "gabriel@gmail.com"
    And detalhes pedido "#89" possui infos do restaurante "Burger King - Madalena"
