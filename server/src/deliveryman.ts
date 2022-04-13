export class Deliveryman {
  id: number;
  name: string;
  balance: number = 0;

  constructor(client: Deliveryman) { //id: number, name: string, address: string
    this.id = client.id;
    this.name = client.name;
  }

  addBalance(amount: number) {
    this.balance += amount;
  }
}