export class Restaurant {
  id: number
  name: string
  address: string

  // company information
  score = 5.0

  constructor (restaurant: Restaurant) { // id: number, name: string, address: string
    this.id = restaurant.id
    this.name = restaurant.name
    this.address = restaurant.address
  }

  addScore (value: number): void {
    this.score = (this.score + value) / 2
  }
}
