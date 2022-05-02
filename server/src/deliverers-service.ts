import { Deliverer, Address } from './deliverer'

export class DeliverersService {
  private deliverers: Deliverer[] = [];
  private nextId = 1;

  private setId (deliverer: Deliverer): void {
    deliverer.ID = this.nextId;
    this.nextId += 1;
  }

  private isNew (cnh: string, email: string): boolean {
    for(let deliverer of this.deliverers) {
      if (deliverer.CNH == cnh || deliverer.Email == email) {
        return false;
      }
    }
    return true;
  }

  get Deliverers(): Deliverer[] {
    return this.deliverers;
  }

  addDeliverer (deliverer: Deliverer): boolean {
    let name = deliverer.Name;
    let email = deliverer.Email;
    let password = deliverer.Password;
    let phoneNumber = deliverer.PhoneNumber;
    let cnh = deliverer.CNH;
    let birth = deliverer.Birth;
    let address = deliverer.Address
    let zipcode = address.zipcode;
    let street = address.street;
    let number = address.number;
    let complement = address.complement;
    let neighborhood = address.neighborhood;
    let city = address.city;
    let state = address.state;

    if (this.isNew(deliverer.CNH, deliverer.Email)) {
      let deliverer = new Deliverer(name, email, password, phoneNumber, cnh, birth, address);
      
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

  updateInfos(delivererUpdate: Deliverer, loggedId: number): boolean {
    let delivererToUpdate = this.getById(loggedId);
    console.log('got deliverer');
    console.log(JSON.stringify(delivererToUpdate));
    let index = this.deliverers.indexOf(delivererToUpdate);
    console.log(`got index: ${index}`);
    console.log(JSON.stringify(this.deliverers[index]));
    if (index >= 0) {
      this.deliverers[index] = delivererUpdate;
      console.log('updated');
      console.log(JSON.stringify(this.deliverers[index]));
      return true;
    } else {
      return false;
    }
  }

  getAvailables(): Deliverer[] {
    return this.deliverers.filter(deliverer => deliverer.isAvailable());
  }

  getById(delivererId: number): Deliverer {
    return this.deliverers.find(({ ID }) => ID == delivererId);
  }

  auth(username: number, password: string) {
    const stored = this.getById(username).Password;
    if ((stored || '') != password) {
      throw Error('auth failed')
    }
  }
}
