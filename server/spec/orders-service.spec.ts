import 'jasmine';
import { Client } from '../src/client';
import { Deliveryman } from '../src/deliveryman';
import { Order } from '../src/order';
import { OrdersService } from '../src/orders-service';
import { Restaurant } from '../src/restaurant';

describe("O servico de pedidos", () => {
  var ordersService: OrdersService;
  const restaurant = <Restaurant> {
    name: "Bob's Madalena",
    address: "Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257"
  }
  const deliveryman = <Deliveryman> {
    name: "Gabriel Mendes"
  }
  const client = <Client> {
    name: "Bezaliel Silva",
    address: "Rua Visconde de Barbacena, 329 - Várzea, Recife - PE, 50740-445"
  }

  beforeEach(() => ordersService = new OrdersService())

  it("é inicialmente vazio", () => {
    expect(ordersService.orders.length).toBe(0);
  })

  it("cadastra pedidos corretamente", () => {
    const sample = <Order> {
      restaurant: restaurant,
      client: client,
      payment: 50.0
    }
    ordersService.add(sample);

    expect(ordersService.orders.length).toBe(1);
    const result = ordersService.orders[0];
    expect(result.id).toBe(0);
    expect(result.restaurant).toBe(restaurant);
    expect(result.client).toBe(client);
    expect(result.payment).toBe(50.0);
    expect(result.deliveryman).toBeUndefined();
  })
})
