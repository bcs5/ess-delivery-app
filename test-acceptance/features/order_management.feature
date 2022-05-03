Feature: Order Management
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
  Scenario: create deliverer
    Given server is up
    When I create a deliverer with name "Jose Cruz", password "senha", id "1"
    Then I receive code "200"
    And I receive a response with field "id" value "1"
    And I receive a response with field "name" value "Jose Cruz"
  Scenario: check wallet
    Given I'm on the page "deliveries"
    Then deliverer wallet has "0"
  Scenario: create a order to deliverer
    Given I'm on the page "deliveries"
    When I create a order from client "14", to restaurant "13", to deliverer "1", payment "10", id "33"
    Then I receive code "200"
    And the order "33" appears on list with status "pending"
  Scenario: reject order
    Given I'm on the page "deliveries"
    When I click to see details from order "33" with status "pending"
    And I reject the order "33"
    Then the order has status "rejected"
  Scenario: create a second order to deliverer
    Given I'm on the page "deliveries"
    When I create a order from client "14", to restaurant "13", to deliverer "1", payment "23", id "22"
    Then I receive code "200"
    And the order "22" appears on list with status "pending"
  Scenario: accept second order
    Given I'm on the page "deliveries"
    When I click to see details from order "22" with status "pending"
    And I accept the order "22"
    Then the order has status "in_progress"
  Scenario: collect second order
    Given I'm on the page "deliveries"
    When I click to see details from order "22" with status "in_progress"
    And I collect the order "22"
    Then the order has status "collected"
  Scenario: finish second order
    Given I'm on the page "deliveries"
    When I click to see details from order "22" with status "collected"
    And I finish the order "22"
    Then the order has status "finished"
  Scenario: check wallet after finished order
    Given I'm on the page "deliveries"
    Then deliverer wallet has "23"
