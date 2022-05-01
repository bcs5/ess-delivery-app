import 'jasmine'
import { Client } from '../src/client'
import { Deliverer, Address } from '../src/deliverer'
import { Order } from '../src/order'
import { DeliveriesService } from '../src/deliveries-service'
import { Restaurant } from '../src/restaurant'
import { OrdersService } from '../src/orders-service'
import { DeliverersService } from '../src/deliverers-service'
import { Action } from '../src/delivery-action'

describe('O servico de pedidos', () => {
  const NOW = new Date()
  const ONE_MIN_BEFORE = new Date(NOW.getTime() - 60 * 1000)
  const FIVE_MIN_BEFORE = new Date(NOW.getTime() - 5 * 60 * 1000)
  const TLED = new Date(NOW.getTime() - 61 * 1000)

  let ordersService: OrdersService
  let deliverersService: DeliverersService
  let deliveriesService: DeliveriesService

  const restaurant: Restaurant = <Restaurant> {
    id: 7,
    name: "Bob's Madalena",
    address: 'Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257'
  }
  const client: Client = <Client> {
    id: 8,
    name: 'Bezaliel Silva',
    address: 'Rua Visconde de Barbacena, 329 - Várzea, Recife - PE, 50740-445'
  }
  const deliverer1 = new Deliverer ('João da Silva', 
  'js@email.com', 
  '1234', 
  '8586827970', 
  '25769318041', 
  12, 
  4, 
  1995, 
  new Address('69059-422', 
    'Rua Tanna Holanda', 
    92,
    'Jardim Arapongas', 
    'Manaus', 
    'AM')
  )
  const deliverer2 = new Deliverer ('Ágatha Santos Barbosa', 
  'AgathaSantosBarbosa@rhyta.com', 
  '4539', 
  '1192333706', 
  '59603923567',
  26, 
  10, 
  1988, 
  new Address('45810-000', 
    'Ladeira do Aeroporto', 
    317,
    'Aeroporto', 
    'Porto Seguro', 
    'BA')
  )
  const order1 = <Order> {
    id: 3,
    restaurant: restaurant,
    client: client,
    payment: 50.0
  }
  const order2 = <Order> {
    id: 4,
    restaurant: restaurant,
    client: client,
    payment: 25.0
  }

  beforeEach(() => {
    ordersService = new OrdersService()
    deliverersService = new DeliverersService()
    deliveriesService = new DeliveriesService(ordersService, deliverersService)
    jasmine.clock().install()
  })

  afterEach(() => {
    jasmine.clock().uninstall()
  })

  it('é inicialmente vazio', () => {
    expect(deliveriesService.deliveries.length).toBe(0)
  })

  it('cadastra pedido', () => {
    const order = ordersService.add(order1)
    deliveriesService.addOrder(order.id)
    const result = deliveriesService.deliveries[0]

    expect(deliveriesService.deliveries.length).toBe(1)
    expect(result.order).toBe(order)
    expect(result.status).toBe('pending')
    expect(result.deliverer).toBeUndefined()
  })

  // it('cadastra pedido com entregador', () => {
  //   const order = ordersService.add(order1)
  //   const delivererA = deliverersService.add(deliverer1)
  //   deliveriesService.addOrderDeliverer(order.id, deliverer1.ID)
  //   const result = deliveriesService.deliveries[0]

  //   expect(deliveriesService.deliveries.length).toBe(1)
  //   expect(result.order).toBe(order)
  //   expect(result.status).toBe('pending')
  //   expect(result.deliverer).toBe(deliverer1)
  // })

  // it('buscar pedido por entregador', () => {
  //   const delivererA = deliverersService.add(deliverer1)
  //   const delivererB = deliverersService.add(deliverer2)
  //   const orderA = ordersService.add(order1)
  //   const orderB = ordersService.add(order2)
  //   deliveriesService.addOrderDeliverer(orderA.id, deliverer1.ID)
  //   deliveriesService.addOrderDeliverer(orderB.id, deliverer2.ID)

  //   const resultA = deliveriesService.byDeliverer(deliverer1.ID)
  //   const resultB = deliveriesService.byDeliverer(deliverer2.ID)

  //   expect(deliveriesService.deliveries.length).toBe(2)
  //   expect(resultA.length).toBe(1)
  //   expect(resultA[0].order).toBe(orderA)
  //   expect(resultA[0].deliverer).toBe(deliverer1)
  //   expect(resultB.length).toBe(1)
  //   expect(resultB[0].order).toBe(orderB)
  //   expect(resultB[0].deliverer).toBe(deliverer2)
  // })

  // it('pedido expirado, status expired, entregador na blocklist', () => {
  //   const order = ordersService.add(order1)
  //   const deliverer = deliverersService.add(deliverer1)
  //   jasmine.clock().mockDate(TLED)
  //   deliveriesService.addOrderDeliverer(order.id, deliverer1.ID)
  //   jasmine.clock().mockDate(NOW)
  //   deliveriesService.process()

  //   const result = deliveriesService.byDeliverer(deliverer1.ID)[0]

  //   expect(deliveriesService.deliveries.length).toBe(1)
  //   expect(result.order).toBe(order)
  //   expect(result.status).toBe('expired')
  //   expect(result.blocklist).toContain(deliverer1.ID)
  // })

  // describe('recebe resposta do entregador', () => {
  //   it('aceitar pedido, status in_progress', () => {
  //     const order = ordersService.add(order1)
  //     const deliverer = deliverersService.add(deliverer1)
  //     deliveriesService.addOrderDeliverer(order.id, deliverer1.ID)
  //     deliveriesService.takeAction(deliverer1.ID, order.id, Action.ACCEPT)

  //     const result = deliveriesService.byDeliverer(deliverer1.ID)

  //     expect(deliveriesService.deliveries.length).toBe(0)
  //     expect(result.length).toBe(1)
  //     expect(result[0].order).toBe(order)
  //     expect(result[0].status).toBe('in_progress')
  //     expect(result[0].deliverer).toBe(deliverer1)
  //   })

  //   it('rejeitar pedido, status rejected, entregador na blocklist', () => {
  //     const order = ordersService.add(order1)
  //     const deliverer = deliverersService.add(deliverer1)

  //     deliveriesService.addOrderDeliverer(order.id, deliverer1.ID)
  //     deliveriesService.takeAction(deliverer1.ID, order.id, Action.REJECT)

  //     const result = deliveriesService.byDeliverer(deliverer1.ID)[0]

  //     expect(deliveriesService.deliveries.length).toBe(1)
  //     expect(result.order).toBe(order)
  //     expect(result.status).toBe('rejected')
  //     expect(result.blocklist).toContain(deliverer1.ID)
  //   })

  //   it('coletar pedido, status collected', () => {
  //     const order = ordersService.add(order1)
  //     const deliverer = deliverersService.add(deliverer1)

  //     jasmine.clock().mockDate(FIVE_MIN_BEFORE)
  //     deliveriesService.addOrderDeliverer(order.id, deliverer1.ID)
  //     deliveriesService.takeAction(deliverer1.ID, order.id, Action.ACCEPT)
  //     jasmine.clock().mockDate(NOW)
  //     deliveriesService.takeAction(deliverer1.ID, order.id, Action.COLLECT)
  //     deliveriesService.process()
  //     const result = deliveriesService.byDeliverer(deliverer1.ID)[0]

  //     expect(deliveriesService.deliveries.length).toBe(0)
  //     expect(result.order).toBe(order)
  //     expect(result.status).toBe('collected')
  //     expect(result.createdAt.getTime()).toBe(FIVE_MIN_BEFORE.getTime())
  //     expect(result.collectedAt.getTime()).toBe(NOW.getTime())
  //   })

  //   it('finalizar pedido, status finished, adicionar payment a carteira do entregador', () => {
  //     const order = ordersService.add(order1)
  //     const deliverer = deliverersService.add(deliverer1)

  //     jasmine.clock().mockDate(FIVE_MIN_BEFORE)
  //     deliveriesService.addOrderDeliverer(order.id, deliverer1.ID)
  //     deliveriesService.takeAction(deliverer1.ID, order.id, Action.ACCEPT)
  //     jasmine.clock().mockDate(ONE_MIN_BEFORE)
  //     deliveriesService.takeAction(deliverer1.ID, order.id, Action.COLLECT)
  //     deliveriesService.process()
  //     jasmine.clock().mockDate(NOW)
  //     deliveriesService.takeAction(deliverer1.ID, order.id, Action.FINISH)
  //     const result = deliveriesService.byDeliverer(deliverer1.ID)[0]

  //     expect(deliveriesService.deliveries.length).toBe(0)
  //     expect(result.order).toBe(order)
  //     expect(result.status).toBe('finished')
  //     expect(result.createdAt.getTime()).toBe(FIVE_MIN_BEFORE.getTime())
  //     expect(result.collectedAt.getTime()).toBe(ONE_MIN_BEFORE.getTime())
  //     expect(result.finishedAt.getTime()).toBe(NOW.getTime())
  //     expect(deliverersService.getById(deliverer1.ID).Wallet).toBe(order.payment)
  //   })

  //   it('pedido assinalado para entregador', () => {
  //     const order = ordersService.add(order1)
  //     const deliverer = deliverersService.add(deliverer1)

  //     deliveriesService.addOrder(order.id)
  //     deliveriesService.process()
  //     const result = deliveriesService.byDeliverer(deliverer1.ID)[0]

  //     expect(deliveriesService.deliveries.length).toBe(1)
  //     expect(result.order).toBe(order)
  //     expect(result.status).toBe('pending')
  //     expect(result.deliverer).toBe(deliverer1)
  //   })

  //   it('pedido rejeitado por entregador, assinala proximo', () => {
  //     const order = ordersService.add(order1)
  //     const deliverer = deliverersService.add(deliverer1)
  //     deliveriesService.addOrder(order.id)
  //     deliveriesService.process()
  //     const extraDeliverer = deliverersService.add(deliverer2)
  //     deliveriesService.takeAction(deliverer1.ID, order.id, Action.REJECT)
  //     deliveriesService.process()

  //     const resultRejected = deliveriesService.byDeliverer(deliverer1.ID)[0]
  //     const resultExtra = deliveriesService.byDeliverer(deliverer2.ID)[0]

  //     expect(deliveriesService.deliveries.length).toBe(1)
  //     expect(resultRejected.order).toBe(order)
  //     expect(resultRejected.status).toBe('rejected')
  //     expect(resultRejected.deliverer).toBe(deliverer1)
  //     expect(resultRejected.blocklist).toContain(deliverer1.ID)
  //     expect(resultExtra.order).toBe(order)
  //     expect(resultExtra.status).toBe('pending')
  //     expect(resultExtra.deliverer).toBe(deliverer2)
  //     expect(resultExtra.blocklist).toContain(deliverer1.ID)
  //   })
  // })
})
