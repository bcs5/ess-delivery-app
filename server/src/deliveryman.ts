import { Delivery } from './delivery'

export class Deliveryman {
  // personal information
  name: string
  email: string
  password: string
  phoneNumber: number
  cnh: number
  birth: Date
  address: string

  // company information
  id: number
  wallet = 0.0
  deliveries: Delivery[] = []

  constructor (id: number, name: string, email: string, password: string, phoneNumber: number, cnh: number, day: number, month: number, year: number, address: string) {
    this.name = name
    this.email = email
    this.password = password
    this.phoneNumber = phoneNumber
    this.cnh = cnh
    this.birth = new Date(year, (month-1), day)
    this.address = address

    this.id = id
  }

  get Name() {
    return this.Name;
  }

  set Name(name: string) {
    this.name = name;
  }

  get Email() {
    return this.email;
  }

  set Email(email: string) {
    this.Email = email;
  }

  get Password() {
    return this.password;
  }

  set Password(password: string) {
    this.password = password;
  }

  get PhoneNumber() {
    return this.phoneNumber;
  }

  set PhoneNumber(phoneNumber: number) {
    this.phoneNumber = phoneNumber;
  }

  get CNH() {
    return this.cnh;
  }

  set CNH(cnh: number) {
    this.cnh = cnh;
  }

  get Birth() {
    return this.birth;
  }

  set Birth(birth: Date) {
    this.birth = birth;
  }

  get Address() {
    return this.address;
  }

  set Address(address: string) {
    this.address = address;
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
