import express = require('express')
import bodyParser = require('body-parser')

import { RestaurantsService } from './src/restaurants-service'
import { ClientsService } from './src/clients-service'
import { DeliverersService } from './src/deliverers-service'
import { OrdersService } from './src/orders-service'
import { Order } from './src/order'
import { DeliveriesService } from './src/deliveries-service'
import { Request, Response } from 'express-serve-static-core'
import { DeliveryMapper } from './src/delivery-mapper'
import { Action } from './src/delivery-action'

//Cadastro e Manutenção
import e = require('express')
import { Address, Deliverer } from './src/deliverer'

const app = express()

const allowCrossDomain = function (req: Request, res: Response, next: express.NextFunction) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  next()
}

app.use(allowCrossDomain)
app.use(bodyParser.json())

const restaurantService: RestaurantsService = new RestaurantsService()
const clientsService: ClientsService = new ClientsService()
const deliverersService: DeliverersService = new DeliverersService()
const ordersService: OrdersService = new OrdersService()
const deliveriesService: DeliveriesService = new DeliveriesService(ordersService, deliverersService)
const deliveryMapper: DeliveryMapper = new DeliveryMapper()

function extractCredentials (req: Request, res: Response): string[] {
  if (!req.headers.authorization || !req.headers.authorization.includes('Basic ')) {
    res.status(401).json({ message: 'Missing Authorization Header' }).send()
  }
  const base64Credentials = req.headers.authorization.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  return credentials.split(':')
}

const server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

const interval = setInterval(function () {
  deliveriesService.process()
}, 1000)

app.get('/', function (req, res) {
  return res.send('Welcome to CinEntrega Server!')
})

app.post('/restaurant', function (req, res) {
  return res.send(restaurantService.add(req.body))
})

app.post('/client', function (req, res) {
  return res.send(clientsService.add(req.body))
})

app.post('/deliverer/register', function (req: express.Request, res: express.Response) {
  try { let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let phoneNumber = req.body.phoneNumber
    let cnh = req.body.cnh
    let birthYear = req.body.year
    let birthMonth = req.body.month
    let birthDay = req.body.day
    let zipcode = req.body.zipcode
    let street = req.body.street
    let number = req.body.number
    let complement = req.body.complement
    let neighborhood = req.body.neighborhood
    let city = req.body.city
    let state = req.body.state
    

    if (name == '' || email == '' || password == '' || phoneNumber == '' || cnh == '' || birthYear == '' || birthMonth == '' || birthDay == '' || zipcode === '' || street === '' || number === '' || neighborhood === '' || city === '' || state === '') {
      res.send({
        failure: 'Ops! You forgot to fill one or more of the fields (just \'complemento\' is not mandatory' 
      })
    } else {
      let delivererAddress = deliverersService.createAddress(zipcode, street, number, complement, neighborhood, city, state)
      let success = deliverersService.addDeliverer(name, email, password, phoneNumber, cnh, birthDay, birthMonth, birthYear, delivererAddress)
      if (success) {
        res.send({
          success: "Welcome to CinEntregas!!"
        })
      } else {
        res.send({
          failure: "Oh no! Someone is already using this cnh or email, check if this is really your data or go to login!"
        })
      }
    }
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e)
    }
    return res.status(500).send(e)
  }
})

// app.post('/deliverer/update', function (req, res) {
  
// })

// app.post('/deliverer/login', function (req, res) {
  
// })

app.get('/deliverers', function (req, res) {
  console.log("here")
  console.log(`${JSON.stringify(deliverersService.Deliverers[0].Birth)} `)
  res.send(JSON.stringify(Array.from(deliverersService.Deliverers)))
})

app.post('/order', function (req, res) {
  try {
    const orderId = req.body.id
    const client = clientsService.getById(req.body.clientId)
    const restaurant = restaurantService.getById(req.body.restaurantId)
    const payment = Number(req.body.payment)
    if (!client) throw Error('invalid client')
    if (!restaurant) throw Error('invalid restaurant')
    const order = ordersService.add(<Order>{ id: orderId, restaurant: restaurant, client: client, payment: payment })
    deliveriesService.addOrder(order.id)
    return res.send(order)
  } catch (e) {
    return res.status(500).send(e)
  }
})

app.get('/order/:orderId', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res)
    deliverersService.auth(Number(username), password)

    const delivery = deliveriesService.byDeliverer(Number(username)).find(({ order }) => req.params.orderId == order.id)
    return res.send(deliveryMapper.toJson(delivery))
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e)
    }
    return res.status(500).send(e)
  }
})

app.get('/order/:orderId/:action', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res)
    deliverersService.auth(Number(username), password)

    const delivery = deliveriesService.takeAction(Number(username), Number(req.params.orderId), <Action>(req.params.action))
    return res.send(deliveryMapper.toJson(delivery))
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e)
    }
    return res.status(500).send(e)
  }
})

app.get('/orders/', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res)
    deliverersService.auth(Number(username), password)

    const ans = deliveriesService.byDeliverer(Number(username)).map(delivery => deliveryMapper.toJsonMinimal(delivery))
    return res.status(200).send(ans)
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e)
    }
    console.log(e)
    return res.status(500).send(e)
  }
})

app.get('/user/', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res)
    deliverersService.auth(Number(username), password)
    const deliverer = deliverersService.getById(Number(username))
    return res.status(200).send({ name: deliverer.Name, wallet: deliverer.Wallet })
  } catch (e) {
    if (e.message == 'auth failed') {
      return res.status(401).send(e)
    }
    return res.status(500).send(e)
  }
})

app.get('/process', function (req, res) {
  deliveriesService.process()
  return res.status(200).send()
})

function closeServer (): void {
  clearInterval(interval)
  server.close()
}

export { app, server, closeServer }
