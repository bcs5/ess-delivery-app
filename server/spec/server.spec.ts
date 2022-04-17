import 'jasmine';
import request = require("request-promise");
import { closeServer } from '../server';
import { Client } from '../src/client';
import { Deliveryman } from '../src/deliveryman';
import { Order } from '../src/order';
import { Restaurant } from '../src/restaurant';

const baseUrl = "http://localhost:3000";
const restaurantUrl = `${baseUrl}/restaurant/`
const clientUrl = `${baseUrl}/client/`
const deliverymanUrl = `${baseUrl}/deliveryman/`
const orderUrl = `${baseUrl}/order/`
const ordersUrl = `${baseUrl}/orders/`
const processUrl = `${baseUrl}/process/`

describe("O servidor", () => {
  var server:any;
  const restaurant = <Restaurant> {
    name: "Bob's Madalena",
    address: "Av. Eng. Abdias de Carvalho, 365 - Ilha do Retiro, Recife - PE, 50750-257"
  }
  const deliveryman = <Deliveryman> {
    name: "Gabriel Mendes"
  }
  
  const deliveryman1 = <Deliveryman> {
    name: "Jose Cruz"
  }

  const client = <Client> {
    name: "Bezaliel Silva",
    address: "Rua Visconde de Barbacena, 329 - Várzea, Recife - PE, 50740-445"
  }

  const order = {
    restaurantId: 0,
    clientId: 0,
    payment: 50.0
  }

  const order1 = {
    restaurantId: 0,
    clientId: 0,
    payment: 25.0
  }

  beforeAll(() => {server = require('../server')});
  afterAll(() => {server.closeServer()});

  it("cadastra restaurante", () => {
    const options:any = {method: 'POST', uri: (restaurantUrl), body: restaurant, json: true};
    return request(options)
    .then(body => {
      var res = <Restaurant>(body);
      expect(res.name).toBe(restaurant.name);
      expect(res.address).toBe(restaurant.address);
    });
  })

  it("cadastra cliente", () => {
    const options:any = {method: 'POST', uri: (clientUrl), body: client, json: true};
    return request(options)
    .then(body => {
      var res = <Client>(body);
      expect(res.name).toBe(client.name);
      expect(res.address).toBe(client.address);
    });
  })

  it("cadastra entregador", () => {
    const options:any = {method: 'POST', uri: (deliverymanUrl), body: deliveryman, json: true};
    return request(options)
    .then(body => {
      var res = <Deliveryman>(body);
      expect(res.name).toBe(deliveryman.name);
      expect(res.wallet).toBe(0.0);
    });
  })

  it("cadastra pedido", () => {
    const options:any = {method: 'POST', uri: (orderUrl), body: order, json: true};
    return request(options)
    .then(body => {
      var res = <Order>(body);
      expect(res.restaurant.name).toBe(restaurant.name);
      expect(res.client.name).toBe(client.name);
      expect(res.payment).toBe(order.payment);
    });
  })

  it("rejeitar pedido", () => {
    request.get(processUrl)
    .catch(({ statusCode }) => {
      expect(statusCode).toBe(200);
    });

    let uri = orderUrl + 0 + '/reject'

    const options:any = {method: 'GET', uri: (uri), auth: {
      'user': "0",
      'pass': ""
    }};
    
    request(options)
    .catch(({ statusCode }) => {
      expect(statusCode).toBe(200);
    })

    request.get(processUrl)
    .catch(({ statusCode }) => {
      expect(statusCode).toBe(200);
    });
  })

  it("cadastra pedido 2", () => {
    const options:any = {method: 'POST', uri: (orderUrl), body: order1, json: true};
    return request(options)
    .then(body => {
      var res = <Order>(body);
      expect(res.restaurant.name).toBe(restaurant.name);
      expect(res.client.name).toBe(client.name);
      expect(res.payment).toBe(order1.payment);
    });
  })

  it("aceitar pedido id errado", () => {
    request.get(processUrl)
    .catch(({ statusCode }) => {
      expect(statusCode).toBe(200);
    });

    let uri = orderUrl + 0 + '/accept'
    const options:any = {method: 'GET', uri: (uri), auth: {
      'user': "0",
      'pass': ""
    }};
    return request(options)
    .catch(({ statusCode }) => {
      expect(statusCode).toBe(500);
    })
  })

  it("aceitar pedido", () => {
    request.get(processUrl)
    .catch(({ statusCode }) => {
      expect(statusCode).toBe(200);
    });

    let uri = orderUrl + 1 + '/accept'
    const options:any = {method: 'GET', uri: (uri), auth: {
      'user': "0",
      'pass': ""
    }};
    return request(options)
    .then(body => {
      expect(body).toBe("inprogress");
    })
    .catch(({ statusCode }) => {
      expect(statusCode).toBe(200);
    })
  })

  it("listar pedidos", () => {
    const options:any = {method: 'GET', uri: (ordersUrl), auth: {
      'user': "0",
      'pass': ""
    }, json: true};
    
    return request(options).then(body => {
      expect(body[0]).toBe("inprogress");
      expect(body[1]).toBe("rejected");
    }).catch(({ statusCode }) => {
      expect(statusCode).toBe(200);
    });
  })
  
  it("cadastrar entregador 2", () => {
    const options:any = {method: 'POST', uri: (deliverymanUrl), body: deliveryman1, json: true};
    return request(options)
    .then(body => {
      var res = <Deliveryman>(body);
      expect(res.name).toBe(deliveryman1.name);
      expect(res.wallet).toBe(0.0);
    });
  })

  it("entregador 2 pega pedido rejeitado", () => {
    request.get(processUrl)
    .catch(({ statusCode }) => {
      expect(statusCode).toBe(200);
    });

    const options:any = {method: 'GET', uri: (ordersUrl), auth: {
      'user': "1",
      'pass': ""
    }, json: true};
    
    return request(options).then(body => {
      expect(body[0]).toBe("pending");
    }).catch(({ statusCode }) => {
      expect(statusCode).toBe(200);
    });
  })

})
