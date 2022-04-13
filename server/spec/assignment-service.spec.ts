import 'jasmine';
import { Client } from '../src/client';
import { Deliveryman } from '../src/deliveryman';
import { Order } from '../src/order';
import { AssignmentService } from '../src/assignment-service';
import { Restaurant } from '../src/restaurant';

describe("O servico de pedidos", () => {
  const NOW = new Date().getTime();
  var assignmentService: AssignmentService;
  const restaurant = <Restaurant> {
    name: "Bob's Madalena",
    address: "Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257"
  }
  const deliveryman = <Deliveryman> {
    id: 27,
    name: "Gabriel Mendes"
  }
  const deliveryman2 = <Deliveryman> {
    id: 18,
    name: "Jose Cruz"
  }
  const client = <Client> {
    name: "Bezaliel Silva",
    address: "Rua Visconde de Barbacena, 329 - Várzea, Recife - PE, 50740-445"
  }

  beforeEach(() => {
    assignmentService = new AssignmentService()
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(NOW));
  })

  afterEach(() => {
    jasmine.clock().uninstall();
  })

  it("é inicialmente vazio", () => {
    expect(assignmentService.newOrders.length).toBe(0);
    expect(assignmentService.pending.length).toBe(0);
    expect(assignmentService.inprogress.length).toBe(0);
    expect(assignmentService.finished.length).toBe(0);
  })

  it("cadastra pedido", () => {
    const order = <Order> {
      restaurant: restaurant,
      client: client,
      payment: 50.0
    }
    assignmentService.addOrder(order);

    expect(assignmentService.newOrders.length).toBe(1);
    const result = assignmentService.newOrders[0];
    expect(result.order).toBe(order);
    expect(result.status).toBe("new");
    expect(result.deliveryman).toBeUndefined();
  })

  it("cadastra pedido com entregador", () => {
    const order = <Order> {
      restaurant: restaurant,
      client: client,
      payment: 50.0
    }
    assignmentService.addOrder(order, deliveryman);
    expect(assignmentService.pending.length).toBe(1);
    const result = assignmentService.pending[0];
    expect(result.order).toBe(order);
    expect(result.status).toBe("pending");
    expect(result.created_at).toBe(NOW);
    expect(result.deliveryman).toBe(deliveryman);
  })

  it("buscar pedido por entregador", () => {
    const order = <Order> {
      id: 23,
      restaurant: restaurant,
      client: client,
      payment: 50.0
    }
    const order2 = <Order> {
      id: 25,
      restaurant: restaurant,
      client: client,
      payment: 25.0
    }

    assignmentService.addOrder(order2, deliveryman2);
    assignmentService.addOrder(order, deliveryman);

    expect(assignmentService.pending.length).toBe(2);
    const result = assignmentService.getByDeliverymanId(deliveryman.id);
    expect(result.length).toBe(1);
    expect(result[0].order).toBe(order);
    expect(result[0].deliveryman).toBe(deliveryman);
    
    const result2 = assignmentService.getByDeliverymanId(deliveryman2.id);
    expect(result2.length).toBe(1);
    expect(result2[0].order).toBe(order2);
    expect(result2[0].deliveryman).toBe(deliveryman2);
  })

  describe ("recebe resposta do entregador", () => {
    it("aceitar pedido", () => {
      const order = <Order> {
        id: 23,
        restaurant: restaurant,
        client: client,
        payment: 50.0
      }
      assignmentService.addOrder(order, deliveryman);
      assignmentService.accept(deliveryman.id, order.id);
      expect(assignmentService.pending.length).toBe(0);
      expect(assignmentService.inprogress.length).toBe(1);

      const result = assignmentService.inprogress[0];
      expect(result.order).toBe(order);
      expect(result.status).toBe("inprogress");
      expect(result.created_at).toBe(NOW);
      expect(result.accepted_at).toBe(NOW);
      expect(result.deliveryman).toBe(deliveryman);
    })

    it("rejeitar pedido", () => {
      const order = <Order> {
        id: 23,
        restaurant: restaurant,
        client: client,
        payment: 50.0
      }
      assignmentService.addOrder(order, deliveryman);
      assignmentService.reject(deliveryman.id, order.id);
      expect(assignmentService.pending.length).toBe(0);
      expect(assignmentService.finished.length).toBe(1);

      const result = assignmentService.finished[0];
      expect(result.order).toBe(order);
      expect(result.status).toBe("rejected");
      expect(result.created_at).toBe(NOW);
      expect(result.rejected_at).toBe(NOW);
      expect(result.deliveryman).toBe(deliveryman);
    })
  })
})