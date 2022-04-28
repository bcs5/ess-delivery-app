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

  wallet: number = 0;
  deliveries: Delivery[] = []
  idCount = 0

  constructor (ordersService: OrdersService, deliverymenService: DeliverymenService) {
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
    let expired = this.deliveries.filter(({ status, created_at }) => status == 'pending' && now - created_at.getTime() > TIMELIMIT)
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
        const delivery: Delivery = new Delivery(<Delivery>{ order: order, deliveryman: deliveryman, blocklist: blocklist, created_at: new Date() })
        deliveryman.addDelivery(delivery)
        this.deliveries.push(delivery)
        this.removeDelivery(expired[i])
      }
    }
  }

  takeAction (deliverymanId: number, orderId: number, action: Action): Delivery {
    const deliveryman = this.deliverymenService.getById(deliverymanId)
    if (!deliveryman) {
      throw 'no deliveryman'
    }
    if (!deliveryman.deliveries) {
      throw 'not performed'
    }
    const delivery = deliveryman.deliveries[0]
    if (delivery.order.id != orderId) {
      throw 'not performed'
    }

    switch (action) {
      case Action.ACCEPT:
        if (delivery.status != Status.PENDING) {
          throw 'invalid state'
        }
        delivery.accept()
        this.removeDelivery(delivery)
        break
      case Action.REJECT:
        if (delivery.status != Status.PENDING) {
          throw 'invalid state'
        }
        delivery.reject()
        break
      case Action.COLLECT:
        if (delivery.status != Status.IN_PROGRESS) {
          throw 'invalid state'
        }
        delivery.collect()
        break
      case Action.FINISH:
        if (delivery.status != Status.COLLECTED) {
          throw 'invalid state'
        }
        delivery.finish()
        break
      default:
        throw 'invalid action'
    }
    return delivery
  }

  addOrder (orderId: number) {
    const order = this.ordersService.getById(orderId)
    const delivery = new Delivery(<Delivery>{ order: order, created_at: new Date(0) })
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

  nameDelivery (id: number): string {
    return this.deliverymenService.getById(id).name
  }

  walletDelivery (id: number): number {
    this.wallet = 0;
    this.deliverymenService.getById(id).deliveries.map(delivery => {
      if(delivery.status == Status.FINISHED) {
        this.wallet += delivery.order.payment;
      }
    })
    return this.wallet;
  }
}
