import 'jasmine'
import { Client } from '../src/client'
import { Deliverer, Address } from '../src/deliverer'
import { DeliveriesService } from '../src/deliveries-service'
import { Order } from '../src/order'
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

  const deliverer1 = new Deliverer('João da Silva',
    'js@email.com',
    '1234',
    '(85)8682-7970',
    '25769318041',
    new Date(4, 12, 1995),
    new Address('69059-422',
      'Rua Tanna Holanda',
      92,
      'Jardim Arapongas',
      'Manaus',
      'AM')
  )

  const deliverer2 = new Deliverer('Ágatha Santos Barbosa',
    'AgathaSantosBarbosa@rhyta.com',
    '4539',
    '(11)9233-3706',
    '59603923567',
    new Date(10, 26, 1988),
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

  it('cadastra pedido com entregador', () => {
    const order = ordersService.add(order1)
    deliverersService.addDeliverer(deliverer1)
    const delivererID = deliverersService.Deliverers[0].ID
    const result = deliveriesService.addOrder(order.id, delivererID)

    expect(deliveriesService.deliveries.length).toBe(1)
    expect(deliveriesService.deliveries[0]).toBe(result)
    expect(result.order).toBe(order)
    expect(result.status).toBe('pending')
    expect(result.deliverer).toBe(deliverersService.Deliverers[0])
  })

  it('busca pedido por entregador', () => {
    deliverersService.addDeliverer(deliverer1)
    deliverersService.addDeliverer(deliverer2)
    const orderA = ordersService.add(order1)
    const orderB = ordersService.add(order2)

    const fstDeliverer = deliverersService.Deliverers[0]
    const sndDeliverer = deliverersService.Deliverers[1]

    deliveriesService.addOrder(orderA.id, fstDeliverer.ID)
    deliveriesService.addOrder(orderB.id, sndDeliverer.ID)

    const resultA = deliveriesService.byDeliverer(fstDeliverer.ID)
    const resultB = deliveriesService.byDeliverer(sndDeliverer.ID)

    expect(deliveriesService.deliveries.length).toBe(2)
    expect(resultA.length).toBe(1)
    expect(resultA[0].order).toBe(orderA)
    expect(resultA[0].deliverer).toBe(fstDeliverer)
    expect(resultB.length).toBe(1)
    expect(resultB[0].order).toBe(orderB)
    expect(resultB[0].deliverer).toBe(sndDeliverer)
  })

  it('pedido expirado, status expired, entregador na blocklist', () => {
    const order = ordersService.add(order1)
    deliverersService.addDeliverer(deliverer1)
    const deliverer = deliverersService.Deliverers[0]
    jasmine.clock().mockDate(TLED)
    deliveriesService.addOrder(order.id, deliverer.ID)
    jasmine.clock().mockDate(NOW)
    deliveriesService.process()

    const result = deliveriesService.byDeliverer(deliverer.ID)[0]

    expect(deliveriesService.deliveries.length).toBe(1)
    expect(result.order).toBe(order)
    expect(result.status).toBe('expired')
    expect(result.blocklist).toContain(deliverer.ID)
  })

  describe('recebe resposta do entregador', () => {
    it('aceita pedido, status in_progress', () => {
      const order = ordersService.add(order1)
      deliverersService.addDeliverer(deliverer1)
      const deliverer = deliverersService.Deliverers[0]
      deliveriesService.addOrder(order.id, deliverer.ID)
      deliveriesService.takeAction(deliverer.ID, order.id, Action.ACCEPT)

      const result = deliveriesService.byDeliverer(deliverer.ID)

      expect(deliveriesService.deliveries.length).toBe(0)
      expect(result.length).toBe(1)
      expect(result[0].order).toBe(order)
      expect(result[0].status).toBe('in_progress')
      expect(result[0].deliverer).toBe(deliverer)
    })

    it('rejeita pedido, status rejected, entregador na blocklist', () => {
      const order = ordersService.add(order1)
      deliverersService.addDeliverer(deliverer1)
      const deliverer = deliverersService.Deliverers[0]

      deliveriesService.addOrder(order.id, deliverer.ID)
      deliveriesService.takeAction(deliverer.ID, order.id, Action.REJECT)

      const result = deliveriesService.byDeliverer(deliverer.ID)[0]

      expect(deliveriesService.deliveries.length).toBe(1)
      expect(result.order).toBe(order)
      expect(result.status).toBe('rejected')
      expect(result.blocklist).toContain(deliverer.ID)
    })

    it('coleta pedido, status collected', () => {
      const order = ordersService.add(order1)
      deliverersService.addDeliverer(deliverer1)
      const deliverer = deliverersService.Deliverers[0]

      jasmine.clock().mockDate(FIVE_MIN_BEFORE)
      deliveriesService.addOrder(order.id, deliverer.ID)
      deliveriesService.takeAction(deliverer.ID, order.id, Action.ACCEPT)
      jasmine.clock().mockDate(NOW)
      deliveriesService.takeAction(deliverer.ID, order.id, Action.COLLECT)
      deliveriesService.process()
      const result = deliveriesService.byDeliverer(deliverer.ID)[0]

      expect(deliveriesService.deliveries.length).toBe(0)
      expect(result.order).toBe(order)
      expect(result.status).toBe('collected')
      expect(result.createdAt.getTime()).toBe(FIVE_MIN_BEFORE.getTime())
      expect(result.collectedAt.getTime()).toBe(NOW.getTime())
    })

    it('finaliza pedido, status finished, adicionar payment a carteira do entregador', () => {
      const order = ordersService.add(order1)
      deliverersService.addDeliverer(deliverer1)
      const deliverer = deliverersService.Deliverers[0]

      jasmine.clock().mockDate(FIVE_MIN_BEFORE)
      deliveriesService.addOrder(order.id, deliverer.ID)
      deliveriesService.takeAction(deliverer.ID, order.id, Action.ACCEPT)
      jasmine.clock().mockDate(ONE_MIN_BEFORE)
      deliveriesService.takeAction(deliverer.ID, order.id, Action.COLLECT)
      deliveriesService.process()
      jasmine.clock().mockDate(NOW)
      deliveriesService.takeAction(deliverer.ID, order.id, Action.FINISH)
      const result = deliveriesService.byDeliverer(deliverer.ID)[0]

      expect(deliveriesService.deliveries.length).toBe(0)
      expect(result.order).toBe(order)
      expect(result.status).toBe('finished')
      expect(result.createdAt.getTime()).toBe(FIVE_MIN_BEFORE.getTime())
      expect(result.collectedAt.getTime()).toBe(ONE_MIN_BEFORE.getTime())
      expect(result.finishedAt.getTime()).toBe(NOW.getTime())
      expect(deliverersService.getById(deliverer.ID).Wallet).toBe(order.payment)
    })

    it('pedido assinalado para entregador', () => {
      const order = ordersService.add(order1)
      deliverersService.addDeliverer(deliverer1)
      const deliverer = deliverersService.Deliverers[0]

      deliveriesService.addOrder(order.id)
      deliveriesService.process()
      const result = deliveriesService.byDeliverer(deliverer.ID)[0]

      expect(deliveriesService.deliveries.length).toBe(1)
      expect(result.order).toBe(order)
      expect(result.status).toBe('pending')
      expect(result.deliverer).toBe(deliverer)
    })

    it('pedido rejeitado por entregador, assinala proximo', () => {
      const order = ordersService.add(order1)
      deliverersService.addDeliverer(deliverer1)
      const fstDeliverer = deliverersService.Deliverers[0]
      deliveriesService.addOrder(order.id)
      deliveriesService.process()
      deliverersService.addDeliverer(deliverer2)
      const sndDeliverer = deliverersService.Deliverers[1]
      deliveriesService.takeAction(fstDeliverer.ID, order.id, Action.REJECT)
      deliveriesService.process()

      const resultRejected = deliveriesService.byDeliverer(fstDeliverer.ID)[0]
      const resultExtra = deliveriesService.byDeliverer(sndDeliverer.ID)[0]

      expect(deliveriesService.deliveries.length).toBe(1)
      expect(resultRejected.order).toBe(order)
      expect(resultRejected.status).toBe('rejected')
      expect(resultRejected.deliverer).toBe(fstDeliverer)
      expect(resultRejected.blocklist).toContain(fstDeliverer.ID)
      expect(resultExtra.order).toBe(order)
      expect(resultExtra.status).toBe('pending')
      expect(resultExtra.deliverer).toBe(sndDeliverer)
      expect(resultExtra.blocklist).toContain(fstDeliverer.ID)
    })
  })
})
