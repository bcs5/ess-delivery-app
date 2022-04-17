import { Order } from "./order";

export class OrdersService {
  orders: Order[] = [];
  idCount: number = 0;

  add(order: Order): Order { //restaurant: Restaurant, client: Client, payment: number
    const newOrder = new Order(<Order> { id: this.idCount, ...order});
    this.orders.push(newOrder);
    this.idCount++;
    return newOrder;
  }

  get() : Order[] {
    return this.orders;
  }

  getById(orderId: number) : Order {
    return this.orders.find(({ id }) => id == orderId);
  }
}