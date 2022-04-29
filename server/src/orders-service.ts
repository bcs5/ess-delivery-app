import { Order } from './order'

export class OrdersService {
  orders: Order[] = []
  idCount = 1

  retrieveId (order: Order): void {
    if (order.id) {
      if (this.getById(order.id)) throw Error('order id in use')
      return
    }
    order.id = this.idCount++
  }

  add (order: Order): Order {
    this.retrieveId(order)
    const newOrder = new Order(order)
    this.orders.push(newOrder)
    return newOrder
  }

  get (): Order[] {
    return this.orders
  }

  getById (orderId: number): Order {
    return this.orders.find(({ id }) => id == orderId)
  }
}
