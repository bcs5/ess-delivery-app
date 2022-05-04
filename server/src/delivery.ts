import { Order } from './order'
import { Deliverer } from './deliverer'
import { Status } from './delivery-status'

export class Delivery {
  order: Order
  deliverer: Deliverer
  blocklist: Set<number>
  createdAt: Date
  collectedAt: Date
  finishedAt: Date
  evaluatedAt: Date
  status: Status

  constructor (delivery: Delivery) {
    this.order = delivery.order
    this.deliverer = delivery.deliverer
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
    this.deliverer.addBalance(this.order.payment)
  }

  evaluate () {
    this.status = Status.EVALUATED
    this.evaluatedAt = new Date()
  }

  reject () {
    this.status = Status.REJECTED
    this.blocklist.add(this.deliverer.id)
  }

  expire () {
    this.status = Status.EXPIRED
    if (this.deliverer) {
      this.blocklist.add(this.deliverer.id)
    }
  }

  isBlocklisted (delivererId: number): boolean {
    return this.blocklist.has(delivererId)
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
