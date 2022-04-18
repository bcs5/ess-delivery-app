import 'jasmine'
import { Client } from '../src/client'
import { ClientsService } from '../src/clients-service'

describe('O servico de clientes', () => {
  let clientsService: ClientsService

  beforeEach(() => clientsService = new ClientsService())

  it('é inicialmente vazio', () => {
    expect(clientsService.clients.length).toBe(0)
  })

  it('cadastra clientes corretamente', () => {
    const sample = <Client> {
      name: 'Bezaliel Silva',
      address: 'Rua Visconde de Barbacena, 329 - Varzea, Recife - PE'
    }
    clientsService.add(sample)

    expect(clientsService.clients.length).toBe(1)
    const result = clientsService.clients[0]
    expect(result.id).toBe(0)
    expect(result.name).toBe(sample.name)
    expect(result.address).toBe(sample.address)
  })
})
