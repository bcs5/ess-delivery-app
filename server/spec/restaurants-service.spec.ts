import 'jasmine'
import { Restaurant } from '../src/model/restaurant'
import { RestaurantsService } from '../src/service/restaurants-service'

describe('O servico de restaurantes', () => {
  let restaurantsService: RestaurantsService
  const restaurant1 = <Restaurant> {
    name: "Bob's Madalena",
    address: 'Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257'
  }

  beforeEach(() => restaurantsService = new RestaurantsService())

  it('é inicialmente vazio', () => {
    expect(restaurantsService.restaurants.length).toBe(0)
  })

  it('cadastra restaurantes corretamente', () => {
    restaurantsService.add(restaurant1)

    expect(restaurantsService.restaurants.length).toBe(1)
    const result = restaurantsService.getById(1)
    expect(result.id).toBe(1)
    expect(result.name).toBe(restaurant1.name)
    expect(result.address).toBe(restaurant1.address)
  })
})
