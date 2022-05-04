export class Client {
  id: number
  name: string
  address: string

  // company information
  score = 5.0

  constructor (client: Client) { // id: number, name: string, address: string
    this.id = client.id
    this.name = client.name
    this.address = client.address
  }

  addScore (value: number): void {
    this.score = (this.score + value) / 2
  }
}
