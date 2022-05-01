import { Restaurant } from './restaurant'
import { Client } from './client'
import { Deliverer } from './deliverer'

export class Order {
  id: number
  restaurant: Restaurant
  client: Client
  payment: number
  deliverer: Deliverer

  constructor (order: Order) { // id: number, restaurant: Restaurant, client: Client
    this.id = order.id
    this.restaurant = order.restaurant
    this.client = order.client
    this.payment = order.payment
    this.deliverer = order.deliverer
  }

  setDeliverer (deliverer: Deliverer): void {
    this.deliverer = deliverer
  }
}
