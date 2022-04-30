import { Restaurant } from './restaurant'

export class RestaurantsService {
  restaurants: Restaurant[] = []
  idCount = 1

  retrieveId (restaurant: Restaurant): number {
    if (restaurant.id) {
      if (this.getById(restaurant.id)) throw Error('restaurant id in use')
      return
    }
    restaurant.id = this.idCount++
  }

  add (restaurant: Restaurant): Restaurant {
    this.retrieveId(restaurant)
    const newRestaurant = new Restaurant(restaurant)
    this.restaurants.push(newRestaurant)
    return newRestaurant
  }

  get (): Restaurant[] {
    return this.restaurants
  }

  getById (restaurantId: number): Restaurant {
    return this.restaurants.find(({ id }) => id == restaurantId)
  }

  addScore (clientId: number, value: number) {
    return this.getById(clientId).addScore(value)
  }
}
