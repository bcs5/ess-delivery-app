import 'jasmine'
import { Deliveryman } from '../src/deliveryman'
import { DeliverymenService } from '../src/deliverymen-service'

describe('O servico de entregadores', () => {
  let deliverymenService: DeliverymenService
  const deliveryman1 = <Deliveryman> {
    name: 'Gabriel Mendes'
  }
  const deliveryman2 = <Deliveryman> {
    name: 'José Cruz'
  }

  beforeEach(() => deliverymenService = new DeliverymenService())

  it('é inicialmente vazio', () => {
    expect(deliverymenService.deliverymen.length).toBe(0)
  })

  it('cadastra entregadores corretamente', () => {
    deliverymenService.add(deliveryman1)
    deliverymenService.add(deliveryman2)

    expect(deliverymenService.deliverymen.length).toBe(2)
    const result = deliverymenService.getById(2)
    expect(result.id).toBe(2)
    expect(result.name).toBe(deliveryman2.name)
    expect(result.wallet).toBe(0.0)
  })

  it('atualiza saldo da carteira corretamente', () => {
    deliverymenService.add(deliveryman1)
    deliverymenService.add(deliveryman2)

    deliverymenService.getById(2).addBalance(5.0)
    deliverymenService.getById(2).addBalance(7.0)
    expect(deliverymenService.getById(2).wallet).toBe(12.0)
  })
})
