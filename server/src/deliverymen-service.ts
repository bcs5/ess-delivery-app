import { Deliveryman } from './deliveryman'

export class DeliverymenService {
  deliverymen: Deliveryman[] = []
  idCount = 0

  add (deliveryman: Deliveryman): Deliveryman {
    const newDeliveryman = new Deliveryman(<Deliveryman> { id: this.idCount, ...deliveryman })
    this.deliverymen.push(newDeliveryman)
    this.idCount++
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
      throw 'auth failed'
    }
  }
}
