Feature: As system manager
         I want to mock/create some entities
         So I can interact with them later
  Scenario: create client
    Given server is up
    When I create a client with name "Bezaliel Silva", address "Rua Visconde de Barbacena, 329 - Varzea, Recife - PE", id "14"
    Then I receive code "200"
    And I receive a response with field "id" value "14"
    And I receive a response with field "name" value "Bezaliel Silva"
    And I receive a response with field "address" value "Rua Visconde de Barbacena, 329 - Varzea, Recife - PE"
  Scenario: create restaurant
    Given server is up
    When I create a restaurant with name "Bob's Madalena", address "Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257", id "13"
    Then I receive code "200"
    And I receive a response with field "id" value "13"
    And I receive a response with field "name" value "Bob's Madalena"
    And I receive a response with field "address" value "Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257"
  Scenario: create deliveryman
    Given server is up
    When I create a deliveryman with name "Jose Cruz", password "senha", id "1"
    Then I receive code "200"
    And I receive a response with field "id" value "1"
    And I receive a response with field "name" value "Jose Cruz"
  Scenario: create a order to deliveryman
    Given server is up
    Given I'm on the page "deliveries"
    When I create a order from client "14", to restaurant "13", to deliveryman "1", payment "10", id "33"
    Then I receive code "200"
    And the order "33" appears on list with status "pending"