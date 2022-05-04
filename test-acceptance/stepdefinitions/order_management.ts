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
    expect(response.body).to.equal("Welcome to CinEntrega Server!");
  })

  When(/^I create a client with name "([^\"]*)", address "([^\"]*)"$/, async (name, address) => {
    const response = await serverClient.send(new Request("POST", "/client", {
      "name": name,
      "address": address
    }))
    lastResponse = response
  })

  Given(/^I'm on the page "([^\"]*)"$/, async (name) => {
    await browser.get("http://localhost:4200/"+name);
    await expect(browser.getTitle()).to.eventually.equal("Cin Delivery deliveries");
  })

  When(/^I create a restaurant with name "([^\"]*)", address "([^\"]*)"$/, async (name, address) => {
    const response = await serverClient.send(new Request("POST", "/restaurant", {
      "name": name,
      "address": address
    }))
    lastResponse = response
  })

  When(/^I create a deliverer with name "([^\"]*)", email "([^\"]*)", password "([^\"]*)", phoneNumber "(\d*)", cnh "(\d*)", birthDate "([^\"]*)", zipcode "([^\"]*)", street "([^\"]*)", number "(\d*)", complement "([^\"]*)", neighborhood "([^\"]*)", city"([^\"]*)", state "([^\"]*)"$/, async (name, email, password, phoneNumber, cnh, birthDate, zipcode, street, number, complement, neighborhood, city, state ) => {
    const response = await serverClient.send(new Request("POST", "/deliverers", {
      "name": name,
      "email": email,
      "password": password,
      "phoneNumber": phoneNumber,
      "cnh": cnh,
      "birthDate": birthDate,
      "zipcode": zipcode,
      "street": street,
      "number":number,
      "complement": complement,
      "neighborhood": neighborhood,
      "city": city,
      "state":state
    }))
    lastResponse = response
  })

  When(/^I create a order from client "([^\"]*)", to restaurant "([^\"]*)", to deliverer "([^\"]*)", payment "(\d*)", id "(\d*)"$/, async (client, restaurant, deliverer, payment, id) => {
    const response = await serverClient.send(new Request("POST", "/order", {
      "id": id,
      "clientId": client,
      "restaurantId": restaurant,
      "payment": payment,
      "delivererId": deliverer
    }))
    lastResponse = response
  })

  Then(/^I receive code "(\d*)"$/, async (statusCode) => {
    expect(lastResponse.status.toString()).to.equal(statusCode)
  })

  Then(/^deliverer wallet has "(\d*)"$/, async (wallet) => {
    await expect(element(by.id(`deliverer-wallet`)).getText()).to.eventually.equal(wallet);
  })

  Then(/^the order "(\d*)" appears on list with status "([^\"]*)"$/, async (orderId, status) => {
    await element(by.id("refresh")).click();
    expect((await element.all(by.id(`delivery-${orderId}-${status}`))).length).to.equal(1);
  })

  Then(/^I receive a response with field "([^\"]*)" value "([^\"]*)"$/, async (field, value) => {
    expect(JSON.parse(lastResponse.body)[field.toString()]).to.equal(value)
  })

  Then(/^I receive a response with number field "([^\"]*)" value "([^\"]*)"$/, async (field, value) => {
    expect(JSON.parse(lastResponse.body)[field.toString()]).to.equal(Number(value))
  })

  Then(/^I click to see details from order "(\d*)" with status "([^\"]*)"$/, async (orderId, status) => {
    await element(by.id(`delivery-${orderId}-${status}`)).click()
    await expect(browser.getTitle()).to.eventually.equal("Cin Delivery delivery " + orderId);
  })

  Then(/^I click to evaluate order "(\d*)" with status "([^\"]*)"$/, async (orderId, status) => {
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

  Then(/^I evaluate the order "(\d*)" with value "(\d*)" to client and "(\d*)" to restarant$/, async (orderId, clientGrade, restarantGrade) => {
    await element(by.id(`cScore`)).sendKeys("value", clientGrade.toString())
    await element(by.id(`rScore`)).sendKeys("value", restarantGrade.toString())
    await element(by.id(`evaluated-${orderId}`)).click()
  })

  Then(/^the order has status "([^\"]*)"$/, async (status) => {
    await expect(element(by.id(`delivery-status`)).getText()).to.eventually.equal(status)
  })
})