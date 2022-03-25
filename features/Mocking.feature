Feature: Mocking
  Scenario: restaurant mocking
    Given logged as "root"
    And there isnt restaurants
    When register restaurant with name "Burger King - Madalena", address "Av Caxanga, 78", location "-8.062183802918367, -34.89799885200182", id "1"
    Then there is a restaurant with id "1", "Burger King - Madalena" , address "Av Caxanga, 78", location "-8.062183802918367, -34.89799885200182"

  Scenario: client mocking
    Given logged as "root"
    And there isnt clients
    When register client with email "gabriel@gmail.com", name "Gabriel Pessoa", address "Rua altinho, 41"
    Then there is a client with email "gabriel@gmail.com", name "Gabriel Pessoa", address "Rua altinho, 41"
