import 'jasmine';
import { Deliveryman } from '../src/deliveryman';
import { DeliverymenService } from '../src/deliverymen-service';

describe("O servico de entregadores", () => {
  var deliverymenService: DeliverymenService;

  beforeEach(() => deliverymenService = new DeliverymenService())

  it("é inicialmente vazio", () => {
    expect(deliverymenService.deliverymen.length).toBe(0);
  })

  it("cadastra entregadores corretamente", () => {
    const sample0 = <Deliveryman> {
      name: "Gabriel Mendes"
    }
    const sample1 = <Deliveryman> {
      name: "José Cruz"
    }
    deliverymenService.add(sample0);
    deliverymenService.add(sample1);

    expect(deliverymenService.deliverymen.length).toBe(2);
    const result = deliverymenService.getById(1);
    expect(result.id).toBe(1);
    expect(result.name).toBe(sample1.name);
    expect(result.balance).toBe(0.0);
  })

  it("atualiza saldo da carteira corretamente", () => {
    const sample0 = <Deliveryman> {
      name: "Gabriel Mendes"
    }
    const sample1 = <Deliveryman> {
      name: "José Cruz"
    }
    deliverymenService.add(sample0);
    deliverymenService.add(sample1);

    deliverymenService.getById(1).addBalance(5.0)
    deliverymenService.getById(1).addBalance(7.0)
    expect(deliverymenService.getById(1).balance).toBe(12.0);
  })
})