import { Order } from './order'
import { Deliveryman } from './deliveryman'
import { Status } from './delivery-status'

export class Delivery {
  order: Order
  deliveryman: Deliveryman
  blocklist: Set<number>
  created_at: Date
  collected_at: Date
  finished_at: Date
  status: Status

  constructor (delivery: Delivery) {
    this.order = delivery.order
    this.deliveryman = delivery.deliveryman
    this.created_at = delivery.created_at ? delivery.created_at : new Date()
    this.blocklist = delivery.blocklist ? delivery.blocklist : new Set<number>()
    this.status = Status.PENDING
  }

  accept () {
    this.status = Status.IN_PROGRESS
  }

  collect () {
    this.status = Status.COLLECTED
    this.collected_at = new Date()
  }

  finish () {
    this.status = Status.FINISHED
    this.finished_at = new Date()
    this.deliveryman.addBalance(this.order.payment)
  }

  reject () {
    this.status = Status.REJECTED
    this.blocklist.add(this.deliveryman.id)
  }

  expire () {
    this.status = Status.EXPIRED
    if (this.deliveryman) {
      this.blocklist.add(this.deliveryman.id)
    }
  }

  isBlocklisted (deliverymanId: number): boolean {
    return this.blocklist.has(deliverymanId)
  }

  inactive () {
    return this.incomplete() || this.status == Status.FINISHED
  }

  incomplete () {
    return this.hasExpired() || this.status == Status.REJECTED
  }

  hasExpired (): boolean {
    return this.status == Status.EXPIRED
  }
}
