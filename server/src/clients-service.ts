import { Client } from './client'

export class ClientsService {
  clients: Client[] = []
  idCount = 1

  retrieveId (client: Client): void {
    if (client.id) {
      if (this.getById(client.id)) throw Error('client id in use')
      return
    }
    client.id = this.idCount++
  }

  add (client: Client): Client {
    this.retrieveId(client)
    const newClient = new Client(client)
    this.clients.push(newClient)
    return newClient
  }

  get (): Client[] {
    return this.clients
  }

  getById (clientId: number): Client {
    return this.clients.find(({ id }) => id == clientId)
  }

  addScore (clientId: number, value: number) {
    return this.getById(clientId).addScore(value)
  }
}
