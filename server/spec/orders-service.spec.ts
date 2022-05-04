import 'jasmine'
import { Client } from '../src/model/client'
import { Order } from '../src/model/order'
import { OrdersService } from '../src/service/orders-service'
import { Restaurant } from '../src/model/restaurant'

describe('O servico de pedidos', () => {
  let ordersService: OrdersService
  const restaurant = <Restaurant> {
    id: 7,
    name: "Bob's Madalena",
    address: 'Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257'
  }

  const client = <Client> {
    id: 26,
    name: 'Bezaliel Silva',
    address: 'Rua Visconde de Barbacena, 329 - Várzea, Recife - PE, 50740-445'
  }

  const order1 = <Order> {
    restaurant: restaurant,
    client: client,
    payment: 50.0
  }

  beforeEach(() => ordersService = new OrdersService())

  it('é inicialmente vazio', () => {
    expect(ordersService.orders.length).toBe(0)
  })

  it('cadastra pedidos corretamente', () => {
    ordersService.add(order1)

    expect(ordersService.orders.length).toBe(1)
    const result = ordersService.orders[0]
    expect(result.id).toBe(1)
    expect(result.restaurant).toBe(restaurant)
    expect(result.client).toBe(client)
    expect(result.payment).toBe(50.0)
    expect(result.deliverer).toBeUndefined()
  })
})
