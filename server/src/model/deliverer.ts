import { Delivery } from './delivery'

export class Deliverer {
  // personal information
  name: string
  email: string
  password: string
  phoneNumber: number
  cnh: number
  birthDate: [number, number, number]
  address: string

  // company information
  id: number
  wallet = 0.0
  deliveries: Delivery[] = []

  constructor (deliverer: Deliverer) {
    this.name = deliverer.name
    this.email = deliverer.email
    this.password = deliverer.password
    this.phoneNumber = deliverer.phoneNumber
    this.cnh = deliverer.cnh
    this.birthDate = deliverer.birthDate
    this.address = deliverer.address

    this.id = deliverer.id
  }

  addBalance (amount: number) {
    this.wallet += amount
  }

  addDelivery (delivery: Delivery) {
    this.deliveries.unshift(delivery)
  }

  getDeliveryById (id: number): Delivery {
    return this.deliveries.find(({ order }) => order.id == id)
  }

  isFree () {
    return !this.deliveries.length || this.deliveries[0].inactive()
  }
}
