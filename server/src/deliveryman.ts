import { Delivery } from './delivery'

export class Deliveryman {
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

  constructor (deliveryman: Deliveryman) {
    this.name = deliveryman.name
    this.email = deliveryman.email
    this.password = deliveryman.password
    this.phoneNumber = deliveryman.phoneNumber
    this.cnh = deliveryman.cnh
    this.birthDate = deliveryman.birthDate
    this.address = deliveryman.address

    this.id = deliveryman.id
  }

  addBalance (amount: number) {
    this.wallet += amount
  }

  addDelivery (delivery: Delivery) {
    this.deliveries.unshift(delivery)
  }

  isFree () {
    return !this.deliveries.length || this.deliveries[0].inactive()
  }
}
