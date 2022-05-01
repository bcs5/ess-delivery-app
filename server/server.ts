import express = require('express')
import bodyParser = require('body-parser')

import { RestaurantsService } from './src/restaurants-service'
import { ClientsService } from './src/clients-service'
import { Deliverer } from './src/deliverer'
import { DeliverersService } from './src/deliverers-service'
import { OrdersService } from './src/orders-service'
import { Order } from './src/order'
import { DeliveriesService } from './src/deliveries-service'
import { Request, Response } from 'express-serve-static-core'
import { DeliveryMapper } from './src/delivery-mapper'
import { Action } from './src/delivery-action'
/* Status Codes
- Negativos
  400: Bad Request (erro de sintaxe na solicitação - pode ser usado quando há ausência de dados)
  401: Não autorizada
  409: Conflito (requisição não pôde ser atendida por conflito - pode ser usado na duplicação de cadastro)
  404: Página não encontrada (pode ser usado em caso de array vazio)
  500: Erro interno no servidor (mensagem genérica, quando não há mais informações sobre o erro)

  - Positivos
  200: OK (o request tá de boas - pode ser usado em casos de get talvez)
  201: Created (request OK e POST OK - é usado sempre em POST, acredito que em PUT também)
 */

import e = require('express')

const app = express()

const allowCrossDomain = function (req: Request, res: Response, next: express.NextFunction) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
}

app.use(allowCrossDomain)
app.use(bodyParser.json())

const restaurantService: RestaurantsService = new RestaurantsService()
const clientsService: ClientsService = new ClientsService()
const deliverersService: DeliverersService = new DeliverersService()
const ordersService: OrdersService = new OrdersService()
const deliveriesService: DeliveriesService = new DeliveriesService(ordersService, deliverersService)
const deliveryMapper: DeliveryMapper = new DeliveryMapper()

var delivererLogged: Deliverer = null

function extractCredentials (req: Request, res: Response): string[] {
  if (!req.headers.authorization || !req.headers.authorization.includes('Basic ')) {
    res.status(401).json({ message: 'Missing Authorization Header' }).send();
  }
  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  return credentials.split(':');
}

const server = app.listen(3000, function () {
  console.log('CinEntrega listening on port 3000!');
})

const interval = setInterval(function () {
  deliveriesService.process();
}, 1000)

app.get('/', function (req, res) {
  return res.status(200).send('Welcome to CinEntrega Server!');
})

app.post('/restaurant', function (req, res) {
  return res.status(201).send(restaurantService.add(req.body));
})

app.post('/client', function (req, res) {
  return res.status(201).send(clientsService.add(req.body));
})

app.post('/deliverer/register', function (req: express.Request, res: express.Response) {
  try { 
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let phoneNumber = req.body.phoneNumber;
    let cnh = req.body.cnh;
    let birthYear = req.body.year;
    let birthMonth = req.body.month;
    let birthDay = req.body.day;
    let zipcode = req.body.zipcode;
    let street = req.body.street;
    let number = req.body.number;
    let complement = req.body.complement;
    let neighborhood = req.body.neighborhood;
    let city = req.body.city;
    let state = req.body.state;
    
    if (name == '' || email == '' || password == '' || phoneNumber == '' || cnh == '' || birthYear == '' || birthMonth == '' || birthDay == '' || zipcode === '' || street === '' || number === '' || neighborhood === '' || city === '' || state === '') {
      res.status(400).send({
        failure: 'Ops! You forgot to fill one or more fields (just \'complemento\' is not mandatory)'
      });
    } else {
      let delivererAddress = deliverersService.createAddress(zipcode, street, number, complement, neighborhood, city, state)
      let success = deliverersService.addDeliverer(name, email, password, phoneNumber, cnh, birthDay, birthMonth, birthYear, delivererAddress)
      if (success) {
        res.status(201).send({
          success: "Welcome to CinEntregas!!"
        });
      } else {
        res.status(409).send({
          failure: "Oh no! Someone is already using this cnh or email, check if this is really your data or go to login!"
        });
      }
    }
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e);
    }
    return res.status(500).send(e);
  }
})

// app.post('/deliverer/update', function (req, res) {
  
// })

app.post('/deliverer/login', function (req, res) {
  try { 
    let email = req.body.email;
    let password = req.body.password;
    
    if(email == '' || password == '') {
      res.status(400).send({
        failure: 'Ops! You forgot to fill one or more fields!'
      });
    } else {
      let delivererIsLogged = deliverersService.validateCredentials(email, password);

      if(delivererIsLogged) {
        delivererLogged = delivererIsLogged;
        
        res.status(200).send({
          success: "Login realizado com sucesso!"
        });

        console.log(`${delivererLogged.Name} is logged!`)
      } else {
        res.status(401).send({
          failure: 'E-mail ou senha incorretos!'
        });
      }
    }
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e);
    }
    return res.status(500).send(e);
  }
})

app.post('/deliverer/logout', function (req, res) {
  try { 
    delivererLogged = null;
    
    res.status(200).send({
      success: 'Deliverer logged out!'
    });

    console.log(`${delivererLogged} is logged!`)
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e);
    }
    return res.status(500).send(e);
  }
})

app.get('/deliverers', function (req, res) {
  res.status(200).send(JSON.stringify(Array.from(deliverersService.Deliverers)));
})

app.post('/order', function (req, res) {
  try {
    const orderId = req.body.id;
    const client = clientsService.getById(req.body.clientId);
    const restaurant = restaurantService.getById(req.body.restaurantId);
    const payment = Number(req.body.payment);
    if (!client) throw Error('invalid client');
    if (!restaurant) throw Error('invalid restaurant');
    const order = ordersService.add(<Order>{ id: orderId, restaurant: restaurant, client: client, payment: payment });
    deliveriesService.addOrder(order.id);
    return res.status(201).send(order);
  } catch (e) {
    return res.status(500).send(e);
  }
})

app.get('/order/:orderId', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res);
    deliverersService.auth(Number(username), password);

    const delivery = deliveriesService.byDeliverer(Number(username)).find(({ order }) => req.params.orderId == order.id);
    return res.status(200).send(deliveryMapper.toJson(delivery));
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e);
    }
    return res.status(500).send(e);
  }
})

app.get('/order/:orderId/:action', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res)
    deliverersService.auth(Number(username), password);

    const delivery = deliveriesService.takeAction(Number(username), Number(req.params.orderId), <Action>(req.params.action));
    return res.status(200).send(deliveryMapper.toJson(delivery));
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e);
    }
    return res.status(500).send(e);
  }
})

app.get('/orders/', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res);
    deliverersService.auth(Number(username), password);

    const ans = deliveriesService.byDeliverer(Number(username)).map(delivery => deliveryMapper.toJsonMinimal(delivery));
    return res.status(200).send(ans);
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e);
    }
    console.log(e)
    return res.status(500).send(e);
  }
})

app.get('/user/', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res);
    deliverersService.auth(Number(username), password);
    const deliverer = deliverersService.getById(Number(username));
    return res.status(200).send({ name: deliverer.Name, wallet: deliverer.Wallet });
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e);
    }
    return res.status(500).send(e);
  }
})

app.get('/process', function (req, res) {
  deliveriesService.process();
  return res.status(200).send();
})

function closeServer (): void {
  clearInterval(interval);
  server.close();
}

export { app, server, closeServer }
