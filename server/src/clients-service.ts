import { Client } from "./client";

export class ClientsService {
  clients: Client[] = [];
  idCount: number = 0;

  add(client: Client): Client {
    const newClient = new Client(<Client> { id: this.idCount, ...client });
    this.clients.push(newClient);
    this.idCount++;
    return newClient;
  }

  get() : Client[] {
    return this.clients;
  }

  getById(clientId: number) : Client {
    return this.clients.find(({ id }) => id == clientId);
  }
}
