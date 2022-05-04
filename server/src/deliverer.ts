import { Delivery } from './delivery'

export class Address {
  zipcode: string
  street: string
  number: number
  complement: string = ''
  neighborhood: string
  city: string
  state: string

  constructor (zipcode: string, street: string, number: number, neighborhood: string, city: string, state: string, complement: string = '') {
    this.zipcode = zipcode
    this.street = street
    this.number = number
    this.complement = complement
    this.neighborhood = neighborhood
    this.city = city
    this.state = state
  }
}

export class Deliverer {
  // personal information
  private name: string
  private readonly email: string
  private password: string
  private phoneNumber: string
  private cnh: string
  private birth: Date
  private address: Address

  // company information
  private id: number
  private wallet = 0.0
  private readonly deliveries: Delivery[] = []

  constructor (name: string, email: string, password: string, phoneNumber: string, cnh: string, birth: Date, address: Address) {
    this.name = name
    this.email = email
    this.password = password
    this.phoneNumber = phoneNumber
    this.cnh = cnh
    this.birth = birth
    this.address = address
  }

  get Name () {
    return this.name
  }

  set Name (name: string) {
    this.name = name
  }

  get Email () {
    return this.email
  }

  set Email (email: string) {
    this.Email = email
  }

  get Password () {
    return this.password
  }

  set Password (password: string) {
    this.password = password
  }

  get PhoneNumber () {
    return this.phoneNumber
  }

  set PhoneNumber (phoneNumber: string) {
    this.phoneNumber = phoneNumber
  }

  get CNH () {
    return this.cnh
  }

  set CNH (cnh: string) {
    this.cnh = cnh
  }

  get Birth () {
    return this.birth
  }

  set Birth (birth: Date) {
    this.birth = birth
  }

  get Address () {
    return this.address
  }

  set Address (address: Address) {
    this.address = address
  }

  get ID () {
    return this.id
  }

  set ID (id: number) {
    this.id = id
  }

  get Wallet () {
    return this.wallet
  }

  addBalance (amount: number) {
    this.wallet += amount
  }

  get Deliveries () {
    return this.deliveries
  }

  addDelivery (delivery: Delivery) {
    this.deliveries.unshift(delivery)
  }

  getDeliveryById (id: number): Delivery {
    return this.deliveries.find(({ order }) => order.id == id)
  }

  isAvailable (): boolean {
    return (this.deliveries.length == 0) || this.deliveries[0].inactive()
  }
}
