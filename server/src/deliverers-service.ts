import { Deliverer, Address } from './deliverer'

export class DeliverersService {
  private deliverers: Deliverer[] = [];
  private nextId = 1;

  private setId (deliverer: Deliverer): void {
    deliverer.ID = this.nextId;
    this.nextId += 1;
  }

  get Deliverers(): Deliverer[] {
    return this.deliverers;
  }

  addDeliverer (name: string, email: string, password: string, phoneNumber: string, cnh: string, day: number, month: number, year: number, address: Address): boolean {
    if (this.isNew(cnh, email)) {
      let deliverer = new Deliverer(name, email, password, phoneNumber, cnh, day, month, year, address);
      
      this.setId(deliverer);
      this.deliverers.push(deliverer);
      return true;
    } else {
      return false;
    }
  }

  createAddress(zipcode: string, street: string, number: number, complement: string, neighborhood: string, city: string, state: string): Address {
    let address = new Address(zipcode, street, number, neighborhood, city, state, complement)
    return address
  }

  validateCredentials (email: string, password: string): Deliverer {
    for(let deliverer of this.deliverers) {
      if (deliverer.Email == email && deliverer.Password == password) {
        return deliverer;
      }
    }

    return null;
  }

  private isNew (cnh: string, email: string): boolean {
    for(let deliverer of this.deliverers) {
      if (deliverer.CNH == cnh || deliverer.Email == email) {
        return false;
      }
    }

    return true;
  }

  getAvailables (): Deliverer[] {
    return this.deliverers.filter(deliverer => deliverer.isAvailable())
  }

  getById (delivererId: number): Deliverer {
    return this.deliverers.find(({ ID }) => ID == delivererId)
  }

  auth (username: number, password: string) {
    const stored = this.getById(username).Password
    if ((stored || '') != password) {
      throw Error('auth failed')
    }
  }
}
