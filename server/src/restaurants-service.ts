import { Restaurant } from "./restaurant";

export class RestaurantsService {
  restaurants: Restaurant[] = [];
  idCount: number = 0;

  add(restaurant: Restaurant): Restaurant {
    const newRestaurant = new Restaurant(<Restaurant> { id: this.idCount, ...restaurant });
    this.restaurants.push(newRestaurant);
    this.idCount++;
    return newRestaurant;
  }

  get() : Restaurant[] {
    return this.restaurants;
  }

  getById(restaurantId: number) : Restaurant {
    return this.restaurants.find(({ id }) => id == restaurantId);
  }
}
