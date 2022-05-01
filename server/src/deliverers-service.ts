import { Deliverer } from './deliverer'

export class DeliverersService {
  private deliverers: Deliverer[] = [];
  private nextId = 1;

  private setId (deliverer: Deliverer): void {
    deliverer.ID = this.nextId;
    this.nextId += 1;
  }

  get Deliverers(): Deliverer[] {
    return this.deliverers
  }

  add (deliverer: Deliverer): boolean {
    if (this.isNew(deliverer.CNH)) {
      this.setId;
      this.deliverers.push(deliverer);
      return true;
    } else {
      return false;
    }
  }

  private isNew (cnh: number): boolean {
    for(let deliverer of this.deliverers) {
      if (deliverer.CNH == cnh) {
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
