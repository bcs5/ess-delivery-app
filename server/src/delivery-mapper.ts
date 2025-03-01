import { Order } from './order'
import { Delivery } from './delivery'
import { Client } from './client'
import { Restaurant } from './restaurant'

export class DeliveryMapper {
  toJsonMinimal (delivery: Delivery) {
    return {
      id: delivery.order.id,
      restaurant: delivery.order.restaurant.name,
      restaurantScore: delivery.order.restaurant.score,
      restaurantScore_this_order: delivery.order.restaurantScore,
      client: delivery.order.client.name,
      clientScore: delivery.order.client.score,
      clientScore_this_order: delivery.order.clientScore,
      payment: delivery.order.payment,
      status: delivery.status,
      created_at: delivery.createdAt
    }
  }

  toJson (delivery: Delivery) {
    const json: any = this.orderToJson(delivery.order)
    json.created_at = delivery.createdAt
    json.status = delivery.status
    if (delivery.collectedAt) {
      json.created_at = delivery.collectedAt
    } else {
      delete json.client
    }
    return json
  }

  orderToJson (order: Order) {
    return {
      id: order.id,
      restaurant: this.restaurantToJson(order.restaurant),
      client: this.clientToJson(order.client),
      payment: order.payment
    }
  }

  restaurantToJson (restaurant: Restaurant) {
    return {
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address
    }
  }

  clientToJson (client: Client) {
    return {
      name: client.name,
      address: client.address
    }
  }
}
