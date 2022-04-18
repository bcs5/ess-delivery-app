import { Restaurant } from './restaurant'
import { Client } from './client'
import { Deliveryman } from './deliveryman'

export class Order {
  id: number
  restaurant: Restaurant
  client: Client
  payment: number
  deliveryman: Deliveryman

  constructor (order: Order) { // id: number, restaurant: Restaurant, client: Client
    this.id = order.id
    this.restaurant = order.restaurant
    this.client = order.client
    this.payment = order.payment
    this.deliveryman = order.deliveryman
  }

  setDeliveryman (deliveryman: Deliveryman): void {
    this.deliveryman = deliveryman
  }
}
