import 'jasmine'
import { Deliverer, Address } from '../src/deliverer'
import { DeliverersService } from '../src/deliverers-service'

describe('O servico de entregadores', () => {
  let deliverersService: DeliverersService

  const deliverer1 = new Deliverer ('João da Silva', 
  'js@email.com', 
  '1234', 
  '(85)8682-7970', 
  '25769318041', 
  12, 
  4, 
  1995, 
  new Address('69059-422', 
    'Rua Tanna Holanda', 
    92,
    'Jardim Arapongas', 
    'Manaus', 
    'AM')
  )

  const deliverer2 = new Deliverer ('Ágatha Santos Barbosa', 
  'AgathaSantosBarbosa@rhyta.com', 
  '4539', 
  '(11)9233-3706', 
  '59603923567',
  26, 
  10, 
  1988, 
  new Address('45810-000', 'Ladeira do Aeroporto', 317, 'Aeroporto', 'Porto Seguro', 'BA')
  )

  beforeEach(() => deliverersService = new DeliverersService())

  it('é inicialmente vazio', () => {
    expect(deliverersService.Deliverers.length).toBe(0)
  })

  // it('cadastra entregadores corretamente', () => {
  //   deliverersService.add(deliverer1)
  //   deliverersService.add(deliverer2)

  //   expect(deliverersService.Deliverers.length).toBe(2)
  //   const result = deliverersService.getById(2)
  //   expect(result.ID).toBe(2)
  //   expect(result.Name).toBe(deliverer2.Name)
  //   expect(result.Wallet).toBe(0.0)
  // })

  // it('atualiza saldo da carteira corretamente', () => {
  //   deliverersService.add(deliverer1)
  //   deliverersService.add(deliverer2)

  //   deliverersService.getById(2).addBalance(5.0)
  //   deliverersService.getById(2).addBalance(7.0)
  //   expect(deliverersService.getById(2).Wallet).toBe(12.0)
  // })
})
