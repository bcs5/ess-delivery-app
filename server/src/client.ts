export class Client {
  id: number;
  name: string;
  address: string;

  constructor(client: Client) { //id: number, name: string, address: string
    this.id = client.id;
    this.name = client.name;
    this.address = client.address;
  }
}
