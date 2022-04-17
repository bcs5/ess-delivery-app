import 'jasmine';
import { Restaurant } from '../src/restaurant';
import { RestaurantsService } from '../src/restaurants-service';

describe("O servico de restaurantes", () => {
  var restaurantsService: RestaurantsService;

  beforeEach(() => restaurantsService = new RestaurantsService())

  it("é inicialmente vazio", () => {
    expect(restaurantsService.restaurants.length).toBe(0);
  })

  it("cadastra restaurantes corretamente", () => {
    const sample = <Restaurant> {
      name: "Bob's Madalena",
      address: "Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257"
    }
    restaurantsService.add(sample);

    expect(restaurantsService.restaurants.length).toBe(1);
    const result = restaurantsService.restaurants[0];
    expect(result.id).toBe(0);
    expect(result.name).toBe(sample.name);
    expect(result.address).toBe(sample.address);
  })
})
