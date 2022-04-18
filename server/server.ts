import express = require('express');
import bodyParser = require("body-parser");
import { RestaurantsService } from './src/restaurants-service';
import { ClientsService } from './src/clients-service';
import { DeliverymenService } from './src/deliverymen-service';
import { OrdersService } from './src/orders-service';
import { Order } from './src/order';
import { DeliveriesService } from './src/deliveries-service';
import { Request, Response } from 'express-serve-static-core';
import { Delivery } from './src/delivery';
import { DeliveryMapper } from './src/delivery-mapper';

let app = express();


var allowCrossDomain = function(req: any, res: any, next: any) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json());

let restaurantService: RestaurantsService = new RestaurantsService();
let clientsService: ClientsService = new ClientsService();
let deliverymenService: DeliverymenService = new DeliverymenService();
let ordersService: OrdersService = new OrdersService();
let deliveriesService: DeliveriesService = new DeliveriesService(ordersService, deliverymenService);
let deliveryMapper: DeliveryMapper = new DeliveryMapper();

function extractCredentials (req: Request, res: Response): string[] {
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    res.status(401).json({ message: 'Missing Authorization Header' }).send();
  }
  const base64Credentials =  req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  return credentials.split(':');
}

var server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var interval = setInterval(function() {
  deliveriesService.process();
}, 1000);

app.get('/', function (req, res) {
  return res.send("Hello world!");
});

app.post('/restaurant', function (req, res) {
  return res.send(restaurantService.add(req.body));
});

app.post('/client', function (req, res) {
  return res.send(clientsService.add(req.body));
});

app.post('/deliveryman', function (req, res) {
  return res.send(deliverymenService.add(req.body));
});

app.post('/order', function (req, res) {
  let client = clientsService.getById(req.body.clientId);
  let restaurant = restaurantService.getById(req.body.restaurantId);
  let payment = Number(req.body.payment);
  let order = ordersService.add(<Order> {restaurant: restaurant, client: client, payment: payment});
  deliveriesService.addOrder(order.id);
  return res.send(order);
});

app.get('/order/:orderId/accept', function(req, res) {
  try {
    const [username, password] = extractCredentials(req, res);
    deliverymenService.auth(Number(username), password);

    var delivery = deliveriesService.accept(Number(username), Number(req.params.orderId));
    return res.send(delivery.status);
  } catch (e) {
    if (e == "auth failed") {
      return res.status(401).send(e);
    }
    return res.status(500).send(e);
  }
});

app.get('/order/:orderId/reject', function(req, res) {
  try {
    const [username, password] = extractCredentials(req, res);
    deliverymenService.auth(Number(username), password);

    deliveriesService.reject(Number(username), Number(req.params.orderId));
    return res.sendStatus(200);
  } catch (e) {
    if (e == "auth failed") {
      return res.status(401).send(e);
    }
    return res.status(500).send(e);
  }
});

app.get('/orders/', function(req, res) {
  try {
    const [username, password] = extractCredentials(req, res);
    deliverymenService.auth(Number(username), password);

    let ans = deliveriesService.byDeliveryman(Number(username)).map(delivery => deliveryMapper.toJsonMinimal(delivery))
    return res.status(200).send(ans);
  } catch (e) {
    if (e == "auth failed") {
      return res.status(401).send(e);
    }
    return res.status(500).send(e);
  }
});

app.get('/process', function(req, res) {
  deliveriesService.process();
  return res.status(200).send();
});

function closeServer(): void {
  clearInterval(interval);
  server.close();
}

export { app, server, closeServer }
