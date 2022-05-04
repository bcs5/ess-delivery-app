Feature: Order Management
  Scenario: create client
    Given server is up
    When I create a client with name "Bezaliel Silva", address "Rua Visconde de Barbacena, 329 - Varzea, Recife - PE"
    Then I receive code "201"
    And I receive a response with number field "id" value "1"
    And I receive a response with number field "score" value "5"
    And I receive a response with field "name" value "Bezaliel Silva"
    And I receive a response with field "address" value "Rua Visconde de Barbacena, 329 - Varzea, Recife - PE"
  Scenario: create restaurant
    Given server is up
    When I create a restaurant with name "Bob's Madalena", address "Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257"
    Then I receive code "201"
    And I receive a response with number field "id" value "1"
    And I receive a response with number field "score" value "5"
    And I receive a response with field "name" value "Bob's Madalena"
    And I receive a response with field "address" value "Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257"
  Scenario: create deliverer
    Given server is up
    When I create a deliverer with name "luis", email "luis@gmail.com", password "senha", phoneNumber "1234567", cnh "213214", birthDate "26-4-1996", zipcode "50740170", street "Rua 5", number "210", complement "ap 401 C", neighborhood "condominio", city"Recife", state "Pernambuco"
    Then I receive code "201"
    And I receive a response with field "success" value "Welcome to CinEntregas!!"
  Scenario: check wallet
    Given I'm on the page "deliveries"
    Then deliverer wallet has "0"
  Scenario: create a order to deliverer
    Given I'm on the page "deliveries"
    When I create a order from client "1", to restaurant "1", to deliverer "1", payment "10", id "33"
    Then I receive code "200"
    And the order "33" appears on list with status "pending"
  Scenario: reject order
    Given I'm on the page "deliveries"
    When I click to see details from order "33" with status "pending"
    And I reject the order "33"
    Then the order has status "rejected"
  Scenario: create a second order to deliverer
    Given I'm on the page "deliveries"
    When I create a order from client "1", to restaurant "1", to deliverer "1", payment "23", id "22"
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
  Scenario: evaluate second order
    Given I'm on the page "deliveries"
    When I click to see details from order "22" with status "finished"
    And I evaluate the order "22" with value "0" to client and "0" to restarant
    Then the order has status "evaluated"
  Scenario: check wallet after finished order
    Given I'm on the page "deliveries"
    Then deliverer wallet has "23"
  Scenario: create a third order to deliverer
    Given I'm on the page "deliveries"
    When I create a order from client "1", to restaurant "1", to deliverer "1", payment "12", id "29"
    Then I receive code "200"
    And the order "29" appears on list with status "pending"
  Scenario: accept third order
    Given I'm on the page "deliveries"
    When I click to see details from order "29" with status "pending"
    And I accept the order "29"
    Then the order has status "in_progress"
  Scenario: collect third order
    Given I'm on the page "deliveries"
    When I click to see details from order "29" with status "in_progress"
    And I collect the order "29"
    Then the order has status "collected"
  Scenario: finish third order
    Given I'm on the page "deliveries"
    When I click to see details from order "29" with status "collected"
    And I finish the order "29"
    Then the order has status "finished"
  Scenario: evaluate third order on review page
    Given I'm on the page "reviews"
    When I click to evaluate order "29" with status "finished"
    And I evaluate the order "29" with value "0" to client and "0" to restarant
    Then the order has status "evaluated"
