import { Delivery } from './delivery'
import { Action } from './delivery-action'
import { Status } from './delivery-status'
import { Deliveryman } from './deliveryman'
import { DeliverymenService } from './deliverymen-service'
import { OrdersService } from './orders-service'

const TIMELIMIT = 60 * 1000
export class DeliveriesService {
  ordersService: OrdersService
  deliverymenService: DeliverymenService

  deliveries: Delivery[] = []
  idCount = 0

  constructor (ordersService: OrdersService, deliverymenService: DeliverymenService  ) {
    this.ordersService = ordersService
    this.deliverymenService = deliverymenService
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

    const freeDeliverymen: Deliveryman[] = this.deliverymenService.getFree()
    for (let i = 0; i < expired.length; i++) {
      const deliveryman = freeDeliverymen.find(deliveryman => deliveryman.isFree() && !expired[i].isBlocklisted(deliveryman.id))
      if (deliveryman) {
        const order = expired[i].order
        const blocklist = expired[i].blocklist
        const delivery: Delivery = new Delivery(<Delivery>{ order: order, deliveryman: deliveryman, blocklist: blocklist, createdAt: new Date() })
        deliveryman.addDelivery(delivery)
        this.deliveries.push(delivery)
        this.removeDelivery(expired[i])
      }
    }
  }

  takeAction (deliverymanId: number, orderId: number, action: Action): Delivery {
    const deliveryman = this.deliverymenService.getById(deliverymanId)
    if (!deliveryman) {
      throw Error('no deliveryman')
    }
    if (!deliveryman.deliveries) {
      throw Error('not performed')
    }
    const delivery = deliveryman.deliveries[0]
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

  evaluateOrder (deliverymanId: number, orderId: number, rScore:number, cScore:number): Delivery {
    const deliveryman = this.deliverymenService.getById(deliverymanId)
    const delivery = deliveryman.getDeliveryById(orderId)
    if (delivery.deliveryman && delivery.deliveryman.id != deliverymanId) throw Error("invalid delivery for deliveryman")
    delivery.order.restaurant.addScore(rScore)
    delivery.order.client.addScore(cScore)
    delivery.evaluate()
    return delivery
  }

  addOrder (orderId: number) {
    const order = this.ordersService.getById(orderId)
    const delivery = new Delivery(<Delivery>{ order: order, createdAt: new Date(0) })
    this.deliveries.push(delivery)
    return delivery
  }

  addOrderDeliveryman (orderId: number, deliverymanId: number) {
    const order = this.ordersService.getById(orderId)
    const deliveryman = this.deliverymenService.getById(deliverymanId)
    const delivery = new Delivery(<Delivery>{ order: order, deliveryman: deliveryman })
    this.deliveries.push(delivery)
    deliveryman.addDelivery(delivery)
    return delivery
  }

  addDeliveryman (deliveryman: Deliveryman) {
    return this.deliverymenService.add(deliveryman)
  }

  byDeliveryman (id: number): Delivery[] {
    return this.deliverymenService.getById(id).deliveries
  }

  
}
