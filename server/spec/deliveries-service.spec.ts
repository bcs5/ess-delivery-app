import 'jasmine'
import { Client } from '../src/model/client'
import { Deliverer } from '../src/model/deliverer'
import { Order } from '../src/model/order'
import { DeliveriesService } from '../src/service/deliveries-service'
import { Restaurant } from '../src/model/restaurant'
import { OrdersService } from '../src/service/orders-service'
import { DeliverersService } from '../src/service/deliverers-service'
import { Action } from '../src/model/delivery-action'

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
  const deliverer1 = <Deliverer> {
    id: 1,
    name: 'Jose Cruz'
  }
  const deliverer2 = <Deliverer> {
    id: 2,
    name: 'Gabriel Mendes'
  }
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

  it('cadastra pedido com entregador', () => {
    const order = ordersService.add(order1)
    const delivererA = deliverersService.add(deliverer1)
    deliveriesService.addOrder(order.id, delivererA.id)
    const result = deliveriesService.deliveries[0]

    expect(deliveriesService.deliveries.length).toBe(1)
    expect(result.order).toBe(order)
    expect(result.status).toBe('pending')
    expect(result.deliverer).toBe(delivererA)
  })

  it('buscar pedido por entregador', () => {
    const delivererA = deliverersService.add(deliverer1)
    const delivererB = deliverersService.add(deliverer2)
    const orderA = ordersService.add(order1)
    const orderB = ordersService.add(order2)
    deliveriesService.addOrder(orderA.id, delivererA.id)
    deliveriesService.addOrder(orderB.id, delivererB.id)

    const resultA = deliveriesService.byDeliverer(delivererA.id)
    const resultB = deliveriesService.byDeliverer(delivererB.id)

    expect(deliveriesService.deliveries.length).toBe(2)
    expect(resultA.length).toBe(1)
    expect(resultA[0].order).toBe(orderA)
    expect(resultA[0].deliverer).toBe(delivererA)
    expect(resultB.length).toBe(1)
    expect(resultB[0].order).toBe(orderB)
    expect(resultB[0].deliverer).toBe(delivererB)
  })

  it('pedido expirado, status expired, entregador na blocklist', () => {
    const order = ordersService.add(order1)
    const deliverer = deliverersService.add(deliverer1)
    jasmine.clock().mockDate(TLED)
    deliveriesService.addOrder(order.id, deliverer.id)
    jasmine.clock().mockDate(NOW)
    deliveriesService.process()

    const result = deliveriesService.byDeliverer(deliverer.id)[0]

    expect(deliveriesService.deliveries.length).toBe(1)
    expect(result.order).toBe(order)
    expect(result.status).toBe('expired')
    expect(result.blocklist).toContain(deliverer.id)
  })

  describe('recebe resposta do entregador', () => {
    it('aceitar pedido, status in_progress', () => {
      const order = ordersService.add(order1)
      const deliverer = deliverersService.add(deliverer1)
      deliveriesService.addOrder(order.id, deliverer.id)
      deliveriesService.takeAction(deliverer.id, order.id, Action.ACCEPT)

      const result = deliveriesService.byDeliverer(deliverer.id)

      expect(deliveriesService.deliveries.length).toBe(0)
      expect(result.length).toBe(1)
      expect(result[0].order).toBe(order)
      expect(result[0].status).toBe('in_progress')
      expect(result[0].deliverer).toBe(deliverer)
    })

    it('rejeitar pedido, status rejected, entregador na blocklist', () => {
      const order = ordersService.add(order1)
      const deliverer = deliverersService.add(deliverer1)

      deliveriesService.addOrder(order.id, deliverer.id)
      deliveriesService.takeAction(deliverer.id, order.id, Action.REJECT)

      const result = deliveriesService.byDeliverer(deliverer.id)[0]

      expect(deliveriesService.deliveries.length).toBe(1)
      expect(result.order).toBe(order)
      expect(result.status).toBe('rejected')
      expect(result.blocklist).toContain(deliverer.id)
    })

    it('coletar pedido, status collected', () => {
      const order = ordersService.add(order1)
      const deliverer = deliverersService.add(deliverer1)

      jasmine.clock().mockDate(FIVE_MIN_BEFORE)
      deliveriesService.addOrder(order.id, deliverer.id)
      deliveriesService.takeAction(deliverer.id, order.id, Action.ACCEPT)
      jasmine.clock().mockDate(NOW)
      deliveriesService.takeAction(deliverer.id, order.id, Action.COLLECT)
      deliveriesService.process()
      const result = deliveriesService.byDeliverer(deliverer.id)[0]

      expect(deliveriesService.deliveries.length).toBe(0)
      expect(result.order).toBe(order)
      expect(result.status).toBe('collected')
      expect(result.createdAt.getTime()).toBe(FIVE_MIN_BEFORE.getTime())
      expect(result.collectedAt.getTime()).toBe(NOW.getTime())
    })

    it('finalizar pedido, status finished, adicionar payment a carteira do entregador', () => {
      const order = ordersService.add(order1)
      const deliverer = deliverersService.add(deliverer1)

      jasmine.clock().mockDate(FIVE_MIN_BEFORE)
      deliveriesService.addOrder(order.id, deliverer.id)
      deliveriesService.takeAction(deliverer.id, order.id, Action.ACCEPT)
      jasmine.clock().mockDate(ONE_MIN_BEFORE)
      deliveriesService.takeAction(deliverer.id, order.id, Action.COLLECT)
      deliveriesService.process()
      jasmine.clock().mockDate(NOW)
      deliveriesService.takeAction(deliverer.id, order.id, Action.FINISH)
      const result = deliveriesService.byDeliverer(deliverer.id)[0]

      expect(deliveriesService.deliveries.length).toBe(0)
      expect(result.order).toBe(order)
      expect(result.status).toBe('finished')
      expect(result.createdAt.getTime()).toBe(FIVE_MIN_BEFORE.getTime())
      expect(result.collectedAt.getTime()).toBe(ONE_MIN_BEFORE.getTime())
      expect(result.finishedAt.getTime()).toBe(NOW.getTime())
      expect(deliverersService.getById(deliverer.id).wallet).toBe(order.payment)
    })

    it('pedido assinalado para entregador', () => {
      const order = ordersService.add(order1)
      const deliverer = deliverersService.add(deliverer1)

      deliveriesService.addOrder(order.id)
      deliveriesService.process()
      const result = deliveriesService.byDeliverer(deliverer.id)[0]

      expect(deliveriesService.deliveries.length).toBe(1)
      expect(result.order).toBe(order)
      expect(result.status).toBe('pending')
      expect(result.deliverer).toBe(deliverer)
    })

    it('pedido rejeitado por entregador, assinala proximo', () => {
      const order = ordersService.add(order1)
      const deliverer = deliverersService.add(deliverer1)
      deliveriesService.addOrder(order.id)
      deliveriesService.process()
      const extradeliverer = deliverersService.add(deliverer2)
      deliveriesService.takeAction(deliverer.id, order.id, Action.REJECT)
      deliveriesService.process()

      const resultRejected = deliveriesService.byDeliverer(deliverer.id)[0]
      const resultExtra = deliveriesService.byDeliverer(extradeliverer.id)[0]

      expect(deliveriesService.deliveries.length).toBe(1)
      expect(resultRejected.order).toBe(order)
      expect(resultRejected.status).toBe('rejected')
      expect(resultRejected.deliverer).toBe(deliverer)
      expect(resultRejected.blocklist).toContain(deliverer.id)
      expect(resultExtra.order).toBe(order)
      expect(resultExtra.status).toBe('pending')
      expect(resultExtra.deliverer).toBe(extradeliverer)
      expect(resultExtra.blocklist).toContain(deliverer.id)
    })
  })
})
