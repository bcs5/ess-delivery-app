import { Deliverer } from './deliverer'
import { RegisterResponse } from './deliverer-register-response'

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

  addDeliverer (deliverer: Deliverer): RegisterResponse {
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
    let neighborhood = address.neighborhood;
    let city = address.city;
    let state = address.state;

    if (!(name && email && password && phoneNumber && cnh && birth && zipcode && street && number && neighborhood && city && state)) {
      return RegisterResponse.MISSING_DATA;
    } else {
      if (this.isNew(deliverer.CNH, deliverer.Email)) {
        let deliverer = new Deliverer(name, email, password, phoneNumber, cnh, birth, address);
        
        this.setId(deliverer);
        this.deliverers.push(deliverer);
        return RegisterResponse.REGISTERED;
      } else {
        return RegisterResponse.EXISTS;
      }
    }
  }

  validateCredentials (email: string, password: string): Deliverer {
    for(let deliverer of this.deliverers) {
      if (deliverer.Email == email && deliverer.Password == password) {
        return deliverer;
      }
    }

    return null;
  }

  updateInfos(delivererUpdate: Deliverer, loggedId: number): Deliverer {
    let delivererToUpdate = this.getById(loggedId);
    let index = this.deliverers.indexOf(delivererToUpdate);
    if (index >= 0) {
      this.deliverers[index] = delivererUpdate;
      this.deliverers[index].ID = loggedId;
      console.log('updated');
      return this.deliverers[index];
    } else {
      return null;
    }
  }

  deleteUser(loggedId: number): boolean {
    let delivererToDelete = this.getById(loggedId);
    let index = this.deliverers.indexOf(delivererToDelete);
    if (index >= 0) {
      let removed = this.deliverers.splice(index, 1);
      console.log(`${removed[0].Name} was removed with success!`)
      console.log('deleted');
      return true;
    } else {
      return false;
    }
  }

  getAvailables(): Deliverer[] {
    return this.deliverers.filter(deliverer => deliverer.isAvailable());
  }

  getById(delivererId: number): Deliverer {
    let deliverer = this.deliverers.find(({ ID }) => ID == delivererId);
    
    if (deliverer) {
      return deliverer;
    }
    return null;
  }

  auth(ID: number, password: string) {
    const stored = this.getById(ID).Password;
    if ((stored || '') != password) {
      throw Error('auth failed')
    }
  }
}
