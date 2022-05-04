import 'jasmine'
import request = require('request-promise')
import { Client } from '../src/client'
import { Order } from '../src/order'
import { Restaurant } from '../src/restaurant'

const baseUrl = 'http://localhost:3000'
const restaurantUrl = `${baseUrl}/restaurant/`
const clientUrl = `${baseUrl}/client/`
const deliverersUrl = `${baseUrl}/deliverers/`
const delivererLoginUrl = `${baseUrl}/deliverer/login/`
const delivererLogoutUrl = `${baseUrl}/deliverer/logout/`
const delivererDeleteUrl = `${baseUrl}/deliverer/delete/`
const delivererLoggedUrl = `${baseUrl}/deliverer/logged/`
const orderUrl = `${baseUrl}/order/`
const ordersUrl = `${baseUrl}/orders/`
const processUrl = `${baseUrl}/process/`
const userUrl = `${baseUrl}/user/`

describe('O servidor', () => {
  let server: any
  const restaurant = <Restaurant>{
    id: 7,
    name: "Bob's Madalena",
    address: 'Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257'
  }

  const deliverer1 = {
    name: 'João da Silva',
    email: 'js@email.com',
    password: '1234',
    phoneNumber: '(85)8682-7970',
    cnh: '25769318041',
    birth: new Date(4, 12, 1995),
    zipcode: '69059-422',
    street: 'Rua Tanna Holanda',
    number: 92,
    neighborhood: 'Jardim Arapongas',
    city: 'Manaus',
    state: 'AM',
    complement: '342C'
  }

  const deliverer1Update = {
    name: 'João Chicó da Silva',
    email: 'jcs@email.com',
    password: 'newpassword',
    phoneNumber: '(85)8682-7970',
    cnh: '25769318041',
    birth: new Date(4, 12, 1995),
    zipcode: '69059-422',
    street: 'Rua Tanna Holanda',
    number: 92,
    neighborhood: 'Jardim Arapongas',
    city: 'Manaus',
    state: 'AM',
    complement: ''
  }

  const deliverer2 = {
    name: 'Ágatha Santos Barbosa',
    email: 'AgathaSantosBarbosa@rhyta.com',
    password: '4539',
    phoneNumber: '(11)9233-3706',
    cnh: '59603923567',
    birth: new Date(10, 26, 1988),
    zipcode: '45810-000',
    street: 'Ladeira do Aeroporto',
    number: 317,
    neighborhood: 'Aeroporto',
    city: 'Porto Seguro',
    state: 'BA',
    complement: ''
  }

  const deliverer3 = {
    name: 'João da Silva',
    email: 'js@email.com',
    password: '1234',
    phoneNumber: '(85)8682-7970',
    cnh: '',
    birth: new Date(4, 12, 1995),
    zipcode: '69059-422',
    street: 'Rua Tanna Holanda',
    number: 92,
    neighborhood: 'Jardim Arapongas',
    city: 'Manaus',
    state: 'AM',
    complement: '342C'
  }

  const client = <Client>{
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
    const options = {
      method: 'POST',
      uri: (clientUrl),
      body: client,
      json: true
    }
    return request(options)
      .then(body => {
        const res = <Client>(body)
        expect(res.id).toBe(client.id)
        expect(res.name).toBe(client.name)
        expect(res.address).toBe(client.address)
      })
  })

  it('Cadastra Entregador 1 com Sucesso', () => {
    const options = {
      method: 'POST',
      uri: (deliverersUrl),
      body: deliverer1,
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(201)
    })
  })

  it('Cadastra Entregador 2 com Sucesso', () => {
    const options = {
      method: 'POST',
      uri: (deliverersUrl),
      body: deliverer2,
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(201)
    })
  })

  it('Nao Cadastra Entregador 1 Novamente', () => {
    const options = {
      method: 'POST',
      uri: (deliverersUrl),
      body: deliverer2,
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(409)
    })
  })

  it('Nao Cadastra Entregador Com Dados Obrigatórios Ausentes', () => {
    const options = {
      method: 'POST',
      uri: (deliverersUrl),
      body: deliverer3,
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(400)
    })
  })

  it('Requisita entregadores cadastrados', () => {
    const options = {
      method: 'GET',
      uri: (deliverersUrl)
    }
    return request(options)
      .then(body => {
        const res: string = body

        expect(res.includes(deliverer1.name))
        expect(res.includes(deliverer2.name))
        expect(!res.includes(deliverer3.name))
      })
  })

  it('Nao Realiza Login do Entregador: Ausência de Email ou Senha', () => {
    const options = {
      method: 'POST',
      uri: (delivererLoginUrl),
      body: {
        email: deliverer1.email,
        password: ''
      },
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(400)
    })
  })

  it('Nao Realiza Login do Entregador: Email ou Senha Incorretos', () => {
    const options = {
      method: 'POST',
      uri: (delivererLoginUrl),
      body: {
        email: deliverer1.email,
        password: 'senhaincorreta'
      },
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(401)
    })
  })

  it('Realiza Login do Entregador 1 Com Sucesso', () => {
    const options = {
      method: 'POST',
      uri: (delivererLoginUrl),
      body: {
        email: deliverer1.email,
        password: deliverer1.password
      },
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(200)
    })
  })

  it('Atualiza dados do entregador', () => {
    const options = {
      method: 'PUT',
      uri: delivererLoggedUrl,
      body: deliverer1Update,
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(201)
    })
  })

  it('checa dados entregador', () => {
    const options = {
      method: 'GET',
      uri: (userUrl),
      auth: {
        user: String(1),
        pass: deliverer1Update.password
      },
      json: true
    }
    return request(options)
      .then(body => {
        const res = body
        expect(res.name).toBe(deliverer1Update.name)
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

  it('rejeita pedido', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order1.id + '/reject'

    const options: any = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: String(1),
        pass: deliverer1Update.password
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

  it('aceita pedido id errado', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order1.id + '/accept'
    const options = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: String(1),
        pass: deliverer1Update.password
      }
    }
    return request(options)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(500)
      })
  })

  it('aceita pedido', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order2.id + '/accept'
    const options = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: String(1),
        pass: deliverer1Update.password
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

  it('lista pedidos', () => {
    const options = {
      method: 'GET',
      uri: (ordersUrl),
      auth: {
        user: String(1),
        pass: deliverer1Update.password
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

  it('coleta pedido', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order2.id + '/collect'
    const options = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: String(1),
        pass: deliverer1Update.password
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

  it('finaliza pedido', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const uri = orderUrl + order2.id + '/finish'
    const options = {
      method: 'GET',
      uri: (uri),
      auth: {
        user: String(1),
        pass: deliverer1Update.password
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

  it('checa dados entregador', () => {
    const options = {
      method: 'GET',
      uri: (userUrl),
      auth: {
        user: String(1),
        pass: deliverer1Update.password
      },
      json: true
    }
    return request(options)
      .then(body => {
        const res = body
        expect(res.name).toBe(deliverer1Update.name)
        expect(res.wallet).toBe(order2.payment)
      })
  })

  it('lista pedidos entregador 2 com senha errada', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const options = {
      method: 'GET',
      uri: (ordersUrl),
      auth: {
        user: String(2),
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
        user: String(2),
        pass: deliverer2.password
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

  it('lista pedido rejeitado entregador 1', () => {
    request.get(processUrl)
      .catch(({ statusCode }) => {
        expect(statusCode).toBe(200)
      })

    const options = {
      method: 'GET',
      uri: (orderUrl + order1.id),
      auth: {
        user: String(1),
        pass: deliverer1Update.password
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

  it('Realiza Logout do Entregador Com Sucesso', () => {
    const options = {
      method: 'POST',
      uri: (delivererLogoutUrl)
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(200)
    })
  })

  it('Realiza Login do Entregador 2 Com Sucesso', () => {
    const options = {
      method: 'POST',
      uri: (delivererLoginUrl),
      body: {
        email: deliverer2.email,
        password: deliverer2.password
      },
      json: true
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(200)
    })
  })

  it('Deleta Conta do Entregador 2 Com Sucesso', () => {
    const options = {
      method: 'PUT',
      uri: (delivererDeleteUrl)
    }

    return request(options).catch(({ statusCode }) => {
      expect(statusCode).toBe(200)
    })
  })
})
