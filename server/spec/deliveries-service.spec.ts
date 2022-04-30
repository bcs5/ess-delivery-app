import 'jasmine'
import { Client } from '../src/client'
import { Deliveryman } from '../src/deliveryman'
import { Order } from '../src/order'
import { DeliveriesService } from '../src/deliveries-service'
import { ClientsService } from '../src/clients-service'
import { RestaurantsService } from '../src/restaurants-service'
import { Restaurant } from '../src/restaurant'
import { OrdersService } from '../src/orders-service'
import { DeliverymenService } from '../src/deliverymen-service'
import { Action } from '../src/delivery-action'

describe('O servico de pedidos', () => {
  const NOW = new Date()
  const ONE_MIN_BEFORE = new Date(NOW.getTime() - 60 * 1000)
  const FIVE_MIN_BEFORE = new Date(NOW.getTime() - 5 * 60 * 1000)
  const TLED = new Date(NOW.getTime() - 61 * 1000)

  let ordersService: OrdersService
  let deliverymenService: DeliverymenService
  let deliveriesService: DeliveriesService
  let clientService: ClientsService
  let restaurantService: RestaurantsService

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
  const deliveryman1 = <Deliveryman> {
    id: 1,
    name: 'Jose Cruz'
  }
  const deliveryman2 = <Deliveryman> {
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
    deliverymenService = new DeliverymenService()
    clientService = new ClientsService()
    restaurantService = new RestaurantsService()
    deliveriesService = new DeliveriesService(ordersService, deliverymenService, clientService, restaurantService)
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
    expect(result.deliveryman).toBeUndefined()
  })

  it('cadastra pedido com entregador', () => {
    const order = ordersService.add(order1)
    const deliverymanA = deliverymenService.add(deliveryman1)
    deliveriesService.addOrderDeliveryman(order.id, deliverymanA.id)
    const result = deliveriesService.deliveries[0]

    expect(deliveriesService.deliveries.length).toBe(1)
    expect(result.order).toBe(order)
    expect(result.status).toBe('pending')
    expect(result.deliveryman).toBe(deliverymanA)
  })

  it('buscar pedido por entregador', () => {
    const deliverymanA = deliverymenService.add(deliveryman1)
    const deliverymanB = deliverymenService.add(deliveryman2)
    const orderA = ordersService.add(order1)
    const orderB = ordersService.add(order2)
    deliveriesService.addOrderDeliveryman(orderA.id, deliverymanA.id)
    deliveriesService.addOrderDeliveryman(orderB.id, deliverymanB.id)

    const resultA = deliveriesService.byDeliveryman(deliverymanA.id)
    const resultB = deliveriesService.byDeliveryman(deliverymanB.id)

    expect(deliveriesService.deliveries.length).toBe(2)
    expect(resultA.length).toBe(1)
    expect(resultA[0].order).toBe(orderA)
    expect(resultA[0].deliveryman).toBe(deliverymanA)
    expect(resultB.length).toBe(1)
    expect(resultB[0].order).toBe(orderB)
    expect(resultB[0].deliveryman).toBe(deliverymanB)
  })

  it('pedido expirado, status expired, entregador na blocklist', () => {
    const order = ordersService.add(order1)
    const deliveryman = deliverymenService.add(deliveryman1)
    jasmine.clock().mockDate(TLED)
    deliveriesService.addOrderDeliveryman(order.id, deliveryman.id)
    jasmine.clock().mockDate(NOW)
    deliveriesService.process()

    const result = deliveriesService.byDeliveryman(deliveryman.id)[0]

    expect(deliveriesService.deliveries.length).toBe(1)
    expect(result.order).toBe(order)
    expect(result.status).toBe('expired')
    expect(result.blocklist).toContain(deliveryman.id)
  })

  describe('recebe resposta do entregador', () => {
    it('aceitar pedido, status in_progress', () => {
      const order = ordersService.add(order1)
      const deliveryman = deliverymenService.add(deliveryman1)
      deliveriesService.addOrderDeliveryman(order.id, deliveryman.id)
      deliveriesService.takeAction(deliveryman.id, order.id, Action.ACCEPT)

      const result = deliveriesService.byDeliveryman(deliveryman.id)

      expect(deliveriesService.deliveries.length).toBe(0)
      expect(result.length).toBe(1)
      expect(result[0].order).toBe(order)
      expect(result[0].status).toBe('in_progress')
      expect(result[0].deliveryman).toBe(deliveryman)
    })

    it('rejeitar pedido, status rejected, entregador na blocklist', () => {
      const order = ordersService.add(order1)
      const deliveryman = deliverymenService.add(deliveryman1)

      deliveriesService.addOrderDeliveryman(order.id, deliveryman.id)
      deliveriesService.takeAction(deliveryman.id, order.id, Action.REJECT)

      const result = deliveriesService.byDeliveryman(deliveryman.id)[0]

      expect(deliveriesService.deliveries.length).toBe(1)
      expect(result.order).toBe(order)
      expect(result.status).toBe('rejected')
      expect(result.blocklist).toContain(deliveryman.id)
    })

    it('coletar pedido, status collected', () => {
      const order = ordersService.add(order1)
      const deliveryman = deliverymenService.add(deliveryman1)

      jasmine.clock().mockDate(FIVE_MIN_BEFORE)
      deliveriesService.addOrderDeliveryman(order.id, deliveryman.id)
      deliveriesService.takeAction(deliveryman.id, order.id, Action.ACCEPT)
      jasmine.clock().mockDate(NOW)
      deliveriesService.takeAction(deliveryman.id, order.id, Action.COLLECT)
      deliveriesService.process()
      const result = deliveriesService.byDeliveryman(deliveryman.id)[0]

      expect(deliveriesService.deliveries.length).toBe(0)
      expect(result.order).toBe(order)
      expect(result.status).toBe('collected')
      expect(result.createdAt.getTime()).toBe(FIVE_MIN_BEFORE.getTime())
      expect(result.collectedAt.getTime()).toBe(NOW.getTime())
    })

    it('finalizar pedido, status finished, adicionar payment a carteira do entregador', () => {
      const order = ordersService.add(order1)
      const deliveryman = deliverymenService.add(deliveryman1)

      jasmine.clock().mockDate(FIVE_MIN_BEFORE)
      deliveriesService.addOrderDeliveryman(order.id, deliveryman.id)
      deliveriesService.takeAction(deliveryman.id, order.id, Action.ACCEPT)
      jasmine.clock().mockDate(ONE_MIN_BEFORE)
      deliveriesService.takeAction(deliveryman.id, order.id, Action.COLLECT)
      deliveriesService.process()
      jasmine.clock().mockDate(NOW)
      deliveriesService.takeAction(deliveryman.id, order.id, Action.FINISH)
      const result = deliveriesService.byDeliveryman(deliveryman.id)[0]

      expect(deliveriesService.deliveries.length).toBe(0)
      expect(result.order).toBe(order)
      expect(result.status).toBe('finished')
      expect(result.createdAt.getTime()).toBe(FIVE_MIN_BEFORE.getTime())
      expect(result.collectedAt.getTime()).toBe(ONE_MIN_BEFORE.getTime())
      expect(result.finishedAt.getTime()).toBe(NOW.getTime())
      expect(deliverymenService.getById(deliveryman.id).wallet).toBe(order.payment)
    })

    it('pedido assinalado para entregador', () => {
      const order = ordersService.add(order1)
      const deliveryman = deliverymenService.add(deliveryman1)

      deliveriesService.addOrder(order.id)
      deliveriesService.process()
      const result = deliveriesService.byDeliveryman(deliveryman.id)[0]

      expect(deliveriesService.deliveries.length).toBe(1)
      expect(result.order).toBe(order)
      expect(result.status).toBe('pending')
      expect(result.deliveryman).toBe(deliveryman)
    })

    it('pedido rejeitado por entregador, assinala proximo', () => {
      const order = ordersService.add(order1)
      const deliveryman = deliverymenService.add(deliveryman1)
      deliveriesService.addOrder(order.id)
      deliveriesService.process()
      const extraDeliveryman = deliverymenService.add(deliveryman2)
      deliveriesService.takeAction(deliveryman.id, order.id, Action.REJECT)
      deliveriesService.process()

      const resultRejected = deliveriesService.byDeliveryman(deliveryman.id)[0]
      const resultExtra = deliveriesService.byDeliveryman(extraDeliveryman.id)[0]

      expect(deliveriesService.deliveries.length).toBe(1)
      expect(resultRejected.order).toBe(order)
      expect(resultRejected.status).toBe('rejected')
      expect(resultRejected.deliveryman).toBe(deliveryman)
      expect(resultRejected.blocklist).toContain(deliveryman.id)
      expect(resultExtra.order).toBe(order)
      expect(resultExtra.status).toBe('pending')
      expect(resultExtra.deliveryman).toBe(extraDeliveryman)
      expect(resultExtra.blocklist).toContain(deliveryman.id)
    })
  })
})
