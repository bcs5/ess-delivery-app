import 'jasmine'
import { Deliverer } from '../src/deliverer'
import { DeliverersService } from '../src/deliverers-service'

describe('O servico de entregadores', () => {
  let deliverersService: DeliverersService
  const deliverer1 = <Deliverer> {
    name: 'Gabriel Mendes'
  }
  const deliverer2 = <Deliverer> {
    name: 'José Cruz'
  }

  beforeEach(() => deliverersService = new DeliverersService())

  it('é inicialmente vazio', () => {
    expect(deliverersService.deliverers.length).toBe(0)
  })

  it('cadastra entregadores corretamente', () => {
    deliverersService.add(deliverer1)
    deliverersService.add(deliverer2)

    expect(deliverersService.deliverers.length).toBe(2)
    const result = deliverersService.getById(2)
    expect(result.id).toBe(2)
    expect(result.name).toBe(deliverer2.name)
    expect(result.wallet).toBe(0.0)
  })

  it('atualiza saldo da carteira corretamente', () => {
    deliverersService.add(deliverer1)
    deliverersService.add(deliverer2)

    deliverersService.getById(2).addBalance(5.0)
    deliverersService.getById(2).addBalance(7.0)
    expect(deliverersService.getById(2).wallet).toBe(12.0)
  })
})
