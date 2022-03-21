Alocação de entregadores :


Responsabilidades Sistema: Alocar entregador a um pedido, baseado em loc.
Lógica:
	dist(restaurante, entregador) <= 1 km: Priority 1
    dist(restaurante, entregador) <= 2 km: Priority 2
    dist(restaurante, entregador) <= 5 km: Priority 3

Scenario: root mocka pedido e sistema aloca pro entregador mais próximo
	Given: logado como “root”
	And: existe um entregador “jose@gmail.com” a 1 km do ““Burger King - Madalena” "disponível"
	And: existe um entregador “mendes@gmail.com” a 2 km do ““Burger King - Madalena” "disponível"
	When: cadastrar pedido #6 para o restaurante “Burger King - Madalena” para o cliente “gabriel@gmail.com” com lucro de ”19” reais
	Then: existe pedido #6 para o restaurante “Burger King - Madalena” para o cliente “gabriel@gmail.com” com lucro de ”19” reais
	And: pedido #6 alocado para “jose@gmail.com”

------------------------------------------------------------------------------------------------------------------------------------

Apresentação de notificações:


Scenario: Apresentação do histórico de pedidos
	Given: Estou logado como “jose@gmail.com”
	And: Não existe pedido no histórico.
	When: insiro o pedido: #56, Restaurante “Burger King - Madalena”, Preço da Corrida “17 reais” e Status “Entregue” para “jose@gmail.com”
And: solicito histórico de pedidos:
	Then: o pedido é retornado: #56, Restaurante “Burger King - Madalena”, Preço da Corrida “17 reais” e Status “Entregue”.

Scenario: Aceitar um novo pedido
	Given: Estou logado como “jose@gmail.com”
	And: Não tenho nenhum pedido ativo
	When: O sistema aloca um pedido para “jose@gmail.com” com id : #56, Restaurante “Burger King - Madalena”, Preço da Corrida “17 reais”
And: aceito pedido #56
	Then: o pedido #56 existe para o entregador “jose@gmail.com” com status “Em andamento”

Scenario: Aceitar um novo pedido com tempo expirado
	Given: Estou logado como “jose@gmail.com”
	And: Não tenho nenhum pedido ativo
	When: O sistema aloca um pedido para “jose@gmail.com” com id : #56, Restaurante “Burger King - Madalena”, Preço da Corrida “17 reais” há 2 min
And: aceito pedido #56
	Then: solicitação rejeitada

Scenario: Rejeitar um novo pedido
	Given: Estou logado como “jose@gmail.com”
	And: Não tenho nenhum pedido ativo
	When: O sistema aloca um pedido para “jose@gmail.com” com id : #56, Restaurante “Burger King - Madalena”, Preço da Corrida “17 reais”
	And: Rejeito pedido #56
Then: o pedido #56 existe para o entregador “jose@gmail.com” com status “Rejeitado”

------------------------------------------------------------------------------------------------------------------------------------