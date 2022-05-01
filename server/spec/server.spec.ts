import 'jasmine'
import request = require('request-promise')
import { Client } from '../src/client'
import { Deliverer, Address } from '../src/deliverer'
import { Order } from '../src/order'
import { Restaurant } from '../src/restaurant'

const baseUrl = 'http://localhost:3000'
const restaurantUrl = `${baseUrl}/restaurant/`
const clientUrl = `${baseUrl}/client/`
const delivererUrl = `${baseUrl}/deliverer/`
const orderUrl = `${baseUrl}/order/`
const ordersUrl = `${baseUrl}/orders/`
const processUrl = `${baseUrl}/process/`
const userUrl = `${baseUrl}/user/`

describe('O servidor', () => {
  let server: any
  const restaurant = <Restaurant> {
    id: 7,
    name: "Bob's Madalena",
    address: 'Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257'
  }

  const deliverer1 = new Deliverer ('João da Silva', 
  'js@email.com', 
  '1234', 
  8586827970, 
  25769318041, 
  12, 
  4, 
  1995, 
  new Address(69059422, 
    'Rua Tanna Holanda', 
    92,
    'Jardim Arapongas', 
    'Manaus', 
    'AM')
  )

  const deliverer2 = new Deliverer ('Ágatha Santos Barbosa', 
  'AgathaSantosBarbosa@rhyta.com', 
  '4539', 
  1192333706, 
  59603923567,
  26, 
  10, 
  1988, 
  new Address(45810000, 
    'Ladeira do Aeroporto', 
    317,
    'Aeroporto', 
    'Porto Seguro', 
    'BA')
  )

  const client = <Client> {
    id: 4,
    name: 'Bezaliel Silva',
    address: 'Rua Visconde de Barbacena, 329 - Várzea, Recife - PE, 50740-445'
  }

  const order1 = {
    id: 2,
    restaurantId: 7,
    clientId: 4,
    payment: 50.0
  }

  const order2 = {
    id: 10,
    restaurantId: 7,
    clientId: 4,
    payment: 25.0
  }

  beforeAll(() => { server = require('../server') })
  afterAll(() => { server.closeServer() })

  it('cadastra restaurante', () => {
    const options = { method: 'POST', uri: (restaurantUrl), body: restaurant, json: true }
    return request(options)
      .then(body => {
        const res = <Restaurant>(body)
        expect(res.id).toBe(restaurant.id)
        expect(res.name).toBe(restaurant.name)
        expect(res.address).toBe(restaurant.address)
      })
  })

  it('cadastra cliente', () => {
    const options = { method: 'POST', uri: (clientUrl), body: client, json: true }
    return request(options)
      .then(body => {
        const res = <Client>(body)
        expect(res.id).toBe(client.id)
        expect(res.name).toBe(client.name)
        expect(res.address).toBe(client.address)
      })
  })

  it('cadastra entregador', () => {
    const options = { method: 'POST', uri: (delivererUrl), body: deliverer1, json: true }
    return request(options)
      .then(body => {
        const res = <Deliverer>(body)
        expect(res.ID).toBe(deliverer1.ID)
        expect(res.Name).toBe(deliverer1.Name)
        expect(res.Wallet).toBe(0.0)
      })
  })
  it('checar dados entregador', () => {
    const options = {
      method: 'GET',
      uri: (userUrl),
      auth: {
        user: deliverer1.ID.toString(),
        pass: deliverer1.Password
      },
      json: true
    }
    return request(options)
      .then(body => {
        const res = body
        expect(res.name).toBe(deliverer1.Name)
        expect(res.wallet).toBe(0.0)
      })
  })

  it('cadastra pedido', () => {
    const options = { method: 'POST', uri: (orderUrl), body: order1, json: true }
    return request(options)
      .then(body => {
        const res = <Order>(body)
        expect(res.id).toBe(order1.id)
        expect(res.restaurant.name).toBe(restaurant.name)
        expect(res.client.name).toBe(client.name)
        expect(res.payment).toBe(order1.payment)
      })
  })

  it('rejeitar pedido', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order1.id + '/reject'

    const options: any = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: deliverer1.ID.toString(),
        pass: deliverer1.Password
      }
    }

    request(options)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })
  })

  it('cadastra pedido 2', () => {
    const options = { method: 'POST', uri: (orderUrl), body: order2, json: true }
    return request(options)
      .then(body => {
        const res = <Order>(body)
        expect(res.id).toBe(order2.id)
        expect(res.restaurant.name).toBe(restaurant.name)
        expect(res.client.name).toBe(client.name)
        expect(res.payment).toBe(order2.payment)
      })
  })

  it('aceitar pedido id errado', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order1.id + '/accept'
    const options = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: deliverer1.ID.toString(),
        pass: deliverer1.Password
      }
    }
    return request(options)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(500)
      })
  })

  it('aceitar pedido', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order2.id + '/accept'
    const options = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: deliverer1.ID.toString(),
        pass: deliverer1.Password
      },
      json: true
    }
    return request(options)
      .then(body => {
        expect(body.status).toBe('in_progress')
      })
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })
  })

  it('listar pedidos', () => {
    const options = {
      method: 'GET',
      uri: (ordersUrl),
      auth: {
        user: deliverer1.ID.toString(),
        pass: deliverer1.Password
      },
      json: true
    }

    return request(options).then(body => {
      expect(body[0].id).toBe(order2.id)
      expect(body[0].status).toBe('in_progress')
      expect(body[1].id).toBe(order1.id)
      expect(body[1].status).toBe('rejected')
    }).catch(({ statusCode }) => {
      expect(statusCode).toBe(200)
    })
  })

  it('coletar pedido', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order2.id + '/collect'
    const options = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: deliverer1.ID.toString(),
        pass: deliverer1.Password
      },
      json: true
    }
    return request(options)
      .then(body => {
        expect(body.status).toBe('collected')
      })
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })
  })

  it('finalizar pedido', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order2.id + '/finish'
    const options = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: deliverer1.ID.toString(),
        pass: deliverer1.Password
      },
      json: true
    }
    return request(options)
      .then(body => {
        expect(body.status).toBe('finished')
      })
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })
  })

  it('checar dados entregador', () => {
    const options = {
      method: 'GET',
      uri: (userUrl),
      auth: {
        user: deliverer1.ID.toString(),
        pass: deliverer1.Password
      },
      json: true
    }
    return request(options)
      .then(body => {
        const res = body
        expect(res.name).toBe(deliverer1.Name)
        expect(res.wallet).toBe(order2.payment)
      })
  })

  it('cadastrar entregador 2', () => {
    const options = { method: 'POST', uri: (delivererUrl), body: deliverer2, json: true }
    return request(options)
      .then(body => {
        const res = <Deliverer>(body)
        expect(res.ID).toBe(deliverer2.ID)
        expect(res.Name).toBe(deliverer2.Name)
        expect(res.Wallet).toBe(0.0)
      })
  })

  it('listar pedidos entregador 2 com senha errada', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const options = {
      method: 'GET',
      uri: (ordersUrl),
      auth: {
        user: deliverer2.ID.toString(),
        pass: 'casarao'
      },
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(401)
    })
  })

  it('entregador 2 pega pedido rejeitado', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const options = {
      method: 'GET',
      uri: (ordersUrl),
      auth: {
        user: deliverer2.ID.toString(),
        pass: deliverer2.Password
      },
      json: true
    }

    return request(options).then(body => {
      expect(body[0].id).toBe(order1.id)
      expect(body[0].status).toBe('pending')
    }).catch(({ statusCode }) => {
      expect(statusCode).toBe(200)
    })
  })

  it('listar pedido rejeitado entregador 1', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const options = {
      method: 'GET',
      uri: (orderUrl + order1.id),
      auth: {
        user: deliverer1.ID.toString(),
        pass: deliverer1.Password
      },
      json: true
    }
    return request(options).then(body => {
      expect(body.id).toBe(order1.id)
      expect(body.restaurant.name).toBe(restaurant.name)
      expect(body.status).toBe('rejected')
    }).catch(({ statusCode }) => {
      expect(statusCode).toBe(200)
    })
  })
})
