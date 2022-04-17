export class Restaurant {
  id: number;
  name: string;
  address: string;

  constructor(restaurant: Restaurant) { //id: number, name: string, address: string
    this.id = restaurant.id;
    this.name = restaurant.name;
    this.address = restaurant.address;
  }
}
