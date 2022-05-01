import { Order } from './order'
import { Deliveryman } from './deliveryman'
import { Status } from './delivery-status'

export class Delivery {
  order: Order
  deliveryman: Deliveryman
  blocklist: Set<number>
  createdAt: Date
  collectedAt: Date
  finishedAt: Date
  evaluatedAt: Date
  status: Status

  constructor (delivery: Delivery) {
    this.order = delivery.order
    this.deliveryman = delivery.deliveryman
    this.createdAt = delivery.createdAt ? delivery.createdAt : new Date()
    this.blocklist = delivery.blocklist ? delivery.blocklist : new Set<number>()
    this.status = Status.PENDING
  }

  accept () {
    this.status = Status.IN_PROGRESS
  }

  collect () {
    this.status = Status.COLLECTED
    this.collectedAt = new Date()
  }

  finish () {
    this.status = Status.FINISHED
    this.finishedAt = new Date()
    this.deliveryman.addBalance(this.order.payment)
  }

  evaluate () {
    this.status = Status.EVALUATED
    this.evaluatedAt = new Date()
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
    return this.incomplete() || this.status == Status.FINISHED || this.status == Status.EVALUATED
  }

  incomplete () {
    return this.hasExpired() || this.status == Status.REJECTED
  }

  hasExpired (): boolean {
    return this.status == Status.EXPIRED
  }
}
