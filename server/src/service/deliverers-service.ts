import { Deliverer } from '../model/deliverer'

export class DeliverersService {
  deliverers: Deliverer[] = []
  idCount = 1

  retrieveId (deliverer: Deliverer): void {
    if (deliverer.id) {
      if (this.getById(deliverer.id)) throw Error('deliveryman id in use')
      return
    }
    deliverer.id = this.idCount++
  }

  add (deliverer: Deliverer): Deliverer {
    this.retrieveId(deliverer)
    const newDeliverer = new Deliverer(deliverer)
    this.deliverers.push(newDeliverer)
    return newDeliverer
  }

  get (): Deliverer[] {
    return this.deliverers
  }

  getFree (): Deliverer[] {
    return this.deliverers.filter(deliverer => deliverer.isFree())
  }

  getById (deliverer: number): Deliverer {
    return this.deliverers.find(({ id }) => id == deliverer)
  }

  auth (username: number, password: string) {
    const stored = this.getById(username).password
    if ((stored || '') != password) {
      throw Error('auth failed')
    }
  }
}
