import { Deliveryman } from './deliveryman'

export class DeliverymenService {
  deliverymen: Deliveryman[] = []
  idCount = 1

  retrieveId (deliveryman: Deliveryman): void {
    if (deliveryman.id) {
      if (this.getById(deliveryman.id)) throw Error('deliveryman id in use')
      return
    }
    deliveryman.id = this.idCount++
  }

  add (deliveryman: Deliveryman): Deliveryman {
    this.retrieveId(deliveryman)
    const newDeliveryman = new Deliveryman(deliveryman)
    this.deliverymen.push(newDeliveryman)
    return newDeliveryman
  }

  get (): Deliveryman[] {
    return this.deliverymen
  }

  getFree (): Deliveryman[] {
    return this.deliverymen.filter(deliveryman => deliveryman.isFree())
  }

  getById (deliverymanId: number): Deliveryman {
    return this.deliverymen.find(({ id }) => id == deliverymanId)
  }

  auth (username: number, password: string) {
    const stored = this.getById(username).password
    if ((stored || '') != password) {
      throw Error('auth failed')
    }
  }
}
