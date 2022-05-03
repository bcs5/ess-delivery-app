import { defineSupportCode } from 'cucumber';
import { browser, by, element } from 'protractor';
import { HttpClient, Request, Response} from 'selenium-webdriver/http';
let chai = require('chai').use(require('chai-as-promised'));
let expect = chai.expect;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let serverClient = new HttpClient("http://localhost:3000/")
var lastResponse: Response

defineSupportCode(function ({ Given, When, Then }) {
  Given("server is up", async () => {
    const response = await serverClient.send(new Request("GET", "/"))
    expect(response.body).to.equal("Hello world!");
  })

  When(/^I create a client with name "([^\"]*)", address "([^\"]*)", id "(\d*)"$/, async (name, address, id) => {
    const response = await serverClient.send(new Request("POST", "/client", {
      "id": id,
      "name": name,
      "address": address
    }))
    lastResponse = response
  })

  Given(/^I'm on the page "([^\"]*)"$/, async (name) => {
    await browser.get("http://localhost:4200/"+name);
    await expect(browser.getTitle()).to.eventually.equal("Cin Delivery "+name);
  })

  When(/^I create a restaurant with name "([^\"]*)", address "([^\"]*)", id "(\d*)"$/, async (name, address, id) => {
    const response = await serverClient.send(new Request("POST", "/restaurant", {
      "id": id,
      "name": name,
      "address": address
    }))
    lastResponse = response
  })

  When(/^I create a deliveryman with name "([^\"]*)", password "([^\"]*)", id "(\d*)"$/, async (name, password, id) => {
    const response = await serverClient.send(new Request("POST", "/deliveryman", {
      "id": id,
      "name": name,
      "password": password
    }))
    lastResponse = response
  })

  When(/^I create a order from client "([^\"]*)", to restaurant "([^\"]*)", to deliveryman "([^\"]*)", payment "(\d*)", id "(\d*)"$/, async (client, restaurant, deliveryman, payment, id) => {
    const response = await serverClient.send(new Request("POST", "/order", {
      "id": id,
      "clientId": client,
      "restaurantId": restaurant,
      "payment": payment,
      "deliverymanId": deliveryman
    }))
    lastResponse = response
  })

  Then(/^I receive code "(\d*)"$/, async (statusCode) => {
    expect(lastResponse.status.toString()).to.equal(statusCode)
  })

  Then(/^deliveryman wallet has "(\d*)"$/, async (wallet) => {
    await expect(element(by.id(`deliveryman-wallet`)).getText()).to.eventually.equal(wallet);
  })

  Then(/^the order "(\d*)" appears on list with status "([^\"]*)"$/, async (orderId, status) => {
    await element(by.id("refresh")).click();
    expect((await element.all(by.id(`delivery-${orderId}-${status}`))).length).to.equal(1);
  })

  Then(/^I receive a response with field "([^\"]*)" value "([^\"]*)"$/, async (field, value) => {
    expect(JSON.parse(lastResponse.body)[field.toString()]).to.equal(value)
  })

  Then(/^I click to see details from order "(\d*)" with status "([^\"]*)"$/, async (orderId, status) => {
    await element(by.id(`delivery-${orderId}-${status}`)).click()
    await expect(browser.getTitle()).to.eventually.equal("Cin Delivery delivery " + orderId);
  })

  Then(/^I reject the order "(\d*)"$/, async (orderId) => {
    await element(by.id(`rejected-${orderId}`)).click()
  })

  Then(/^I accept the order "(\d*)"$/, async (orderId) => {
    await element(by.id(`accepted-${orderId}`)).click()
  })

  Then(/^I collect the order "(\d*)"$/, async (orderId) => {
    await element(by.id(`collected-${orderId}`)).click()
  })

  Then(/^I finish the order "(\d*)"$/, async (orderId) => {
    await element(by.id(`finished-${orderId}`)).click()
  })

  Then(/^the order has status "([^\"]*)"$/, async (status) => {
    await expect(element(by.id(`delivery-status`)).getText()).to.eventually.equal(status)
  })

  Then(/^I don't see client address$/, async () => {
    expect((await element.all(by.id(`client-address`))).length).to.equal(0)
  })
  
  Then(/^I see client address "([^\"]*)"$/, async (address) => {
    await expect(element(by.id(`client-address`)).getText()).to.eventually.equal(address)
  })
})