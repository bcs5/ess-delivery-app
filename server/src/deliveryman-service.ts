import { Delivery } from "./delivery";
import { Deliveryman } from "./deliveryman";

export class DeliverymanService {
  deliverymen: Deliveryman[] = [];
  idCount: number = 0;

  add(deliveryman: Deliveryman): Deliveryman {
    /*validação */
    let x = new Deliveryman (<Deliveryman> {...deliveryman});
    this.deliverymen.push(x);
    this.idCount++;
    return x;
  }

  getHistory(email: string){
    let list = this.deliverymen.map(deliveryman => {
      if(deliveryman.email == email){
        return deliveryman.delivery;
      };
    });

    return list[0];
  }
  /*
  add(car: Car): Car {
    if (this.cars.length >= 10) return null;
    const newCar = new Car(<Car>{ id: this.idCount, ...car });
    if (newCar.price <= 0) {
      throw Error("Price can't equal or less than zero")
    }
    this.cars.push(newCar);
    this.idCount++;
    return newCar;
  }

  update(car: Car): Car {
    console.log(this.cars)
    var result: Car = this.cars.find(c => c.id == c.id);
    if (result) result.update(car);
    return result;
  }

  get(): Car[] {
    return this.cars;
  }

  getById(carId: number): Car {
    return this.cars.find(({ id }) => id == carId);
  }
  */
}