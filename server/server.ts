import express = require('express')
import bodyParser = require('body-parser')
import { RestaurantsService } from './src/restaurants-service'
import { ClientsService } from './src/clients-service'
import { DeliverymenService } from './src/deliverymen-service'
import { OrdersService } from './src/orders-service'
import { Order } from './src/order'
import { DeliveriesService } from './src/deliveries-service'
import { Request, Response } from 'express-serve-static-core'
import { DeliveryMapper } from './src/delivery-mapper'
import { Action } from './src/delivery-action'

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
const deliverymenService: DeliverymenService = new DeliverymenService()
const ordersService: OrdersService = new OrdersService()
const deliveriesService: DeliveriesService = new DeliveriesService(ordersService, deliverymenService)
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
  return res.send('Hello world!')
})

app.post('/restaurant', function (req, res) {
  return res.send(restaurantService.add(req.body))
})

app.post('/client', function (req, res) {
  return res.send(clientsService.add(req.body))
})

app.post('/deliveryman', function (req, res) {
  return res.send(deliverymenService.add(req.body))
})

app.post('/order', function (req, res) {
  const client = clientsService.getById(req.body.clientId)
  const restaurant = restaurantService.getById(req.body.restaurantId)
  const payment = Number(req.body.payment)
  const order = ordersService.add(<Order> { restaurant: restaurant, client: client, payment: payment })
  deliveriesService.addOrder(order.id)
  return res.send(order)
})

app.get('/order/:orderId', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res)
    deliverymenService.auth(Number(username), password)

    const delivery = deliveriesService.byDeliveryman(Number(username)).find(({ order }) => req.params.orderId == order.id)
    return res.send(deliveryMapper.toJson(delivery))
  } catch (e) {
    if (e == 'auth failed') {
      return res.status(401).send(e)
    }
    return res.status(500).send(e)
  }
})

app.get('/order/:orderId/:action', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res)
    deliverymenService.auth(Number(username), password)

    const delivery = deliveriesService.takeAction(Number(username), Number(req.params.orderId), <Action>(req.params.action))
    return res.send(deliveryMapper.toJson(delivery))
  } catch (e) {
    if (e == 'auth failed') {
      return res.status(401).send(e)
    }
    return res.status(500).send(e)
  }
})

app.get('/orders/', function (req, res) {
  try {
    const [username, password] = extractCredentials(req, res)
    deliverymenService.auth(Number(username), password)

    const ans = deliveriesService.byDeliveryman(Number(username)).map(delivery => deliveryMapper.toJsonMinimal(delivery))
    return res.status(200).send(ans)
  } catch (e) {
    if (e == 'auth failed') {
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
