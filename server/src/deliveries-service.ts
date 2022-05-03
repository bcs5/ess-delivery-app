import { Delivery } from './delivery'
import { Action } from './delivery-action'
import { Status } from './delivery-status'
import { Deliverer } from './deliverer'
import { DeliverersService } from './deliverers-service'
import { OrdersService } from './orders-service'

const TIMELIMIT = 60 * 1000
export class DeliveriesService {
  ordersService: OrdersService
  deliverersService: DeliverersService

  deliveries: Delivery[] = []
  idCount = 1

  constructor (ordersService: OrdersService, deliverersService: DeliverersService) {
    this.ordersService = ordersService
    this.deliverersService = deliverersService
  }

  removeDelivery (delivery: Delivery) {
    const index = this.deliveries.indexOf(delivery)
    if (index >= 0) {
      this.deliveries.splice(index, 1)
    }
  }

  process () {
    const now = new Date().getTime()
    let expired = this.deliveries.filter(({ status, createdAt }) => status == 'pending' && now - createdAt.getTime() > TIMELIMIT)
    expired.forEach(delivery => {
      delivery.expire()
    })
    expired = this.deliveries.filter(delivery => delivery.incomplete())

    const freeDeliverers: Deliverer[] = this.deliverersService.getAvailables()
    for (let i = 0; i < expired.length; i++) {
      const deliverer = freeDeliverers.find(deliverer => deliverer.isAvailable() && !expired[i].isBlocklisted(deliverer.ID))
      if (deliverer) {
        const order = expired[i].order
        const blocklist = expired[i].blocklist
        const delivery: Delivery = new Delivery(<Delivery>{ order: order, deliverer: deliverer, blocklist: blocklist, createdAt: new Date() })
        deliverer.addDelivery(delivery)
        this.deliveries.push(delivery)
        this.removeDelivery(expired[i])
      }
    }
  }

  takeAction (delivererId: number, orderId: number, action: Action): Delivery {
    const deliverer = this.deliverersService.getById(delivererId)
    if (!deliverer) {
      throw Error('no deliverer')
    }
    if (!deliverer.Deliveries) {
      throw Error('not performed')
    }
    const delivery = deliverer.Deliveries[0]
    if (delivery.order.id != orderId) {
      throw Error('not performed')
    }

    switch (action) {
      case Action.ACCEPT:
        if (delivery.status != Status.PENDING) {
          throw Error('invalid state')
        }
        delivery.accept()
        this.removeDelivery(delivery)
        break
      case Action.REJECT:
        if (delivery.status != Status.PENDING) {
          throw Error('invalid state')
        }
        delivery.reject()
        break
      case Action.COLLECT:
        if (delivery.status != Status.IN_PROGRESS) {
          throw Error('invalid state')
        }
        delivery.collect()
        break
      case Action.FINISH:
        if (delivery.status != Status.COLLECTED) {
          throw Error('invalid state')
        }
        delivery.finish()
        break
      default:
        throw Error('invalid action')
    }
    return delivery
  }

  evaluateOrder (delivererId: number, orderId: number, rScore: number, cScore: number): Delivery {
    const deliverer = this.deliverersService.getById(delivererId)
    const delivery = deliverer.getDeliveryById(orderId)
    if (delivery.deliverer && delivery.deliverer.ID != delivererId) throw Error('invalid delivery for deliverer')
    delivery.order.restaurant.addScore(rScore)
    delivery.order.client.addScore(cScore)
    delivery.evaluate()
    return delivery
  }

  addOrder (orderId: number, delivererId?: number) {
    const order = this.ordersService.getById(orderId)
    const delivery = new Delivery(<Delivery>{ order: order, createdAt: new Date(0) })
    if (delivererId) {
      const deliverer = this.deliverersService.getById(delivererId)
      if (deliverer?.isAvailable()) {
        delivery.deliverer = deliverer
        delivery.createdAt = new Date()
        deliverer.addDelivery(delivery)
      }
    }
    this.deliveries.push(delivery)
    return delivery
  }

  // addDeliverer (deliverer: Deliverer) {
  //   return this.deliverersService.add(deliverer)
  // }

  byDeliverer (id: number): Delivery[] {
    return this.deliverersService.getById(id).Deliveries
  }
}
