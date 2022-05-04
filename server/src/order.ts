import { Restaurant } from './restaurant'
import { Client } from './client'
import { Deliverer } from './deliverer'

export class Order {
  id: number
  restaurant: Restaurant
  client: Client
  payment: number
  deliverer: Deliverer
  
  // company information
  restaurantScore : number
  clientScore : number

  constructor (order: Order) { // id: number, restaurant: Restaurant, client: Client
    this.id = order.id
    this.restaurant = order.restaurant
    this.client = order.client
    this.payment = order.payment
    this.deliverer = order.deliverer
    this.restaurantScore = order.restaurantScore
    this.clientScore = order.clientScore
  }

  setDeliverer (deliverer: Deliverer): void {
    this.deliverer = deliverer
  }

  addScore (clientScore: number, restaurantScore:number){
    console.log(clientScore)
    this.clientScore = clientScore;
    this.restaurantScore = restaurantScore;
  }
}
