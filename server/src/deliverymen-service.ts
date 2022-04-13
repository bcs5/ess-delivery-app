import { Deliveryman } from "./deliveryman";

export class DeliverymenService {
  deliverymen: Deliveryman[] = [];
  idCount: number = 0;
  
  add(deliveryman: Deliveryman): Deliveryman {
    const newDeliveryman = new Deliveryman(<Deliveryman> { id: this.idCount, ...deliveryman });
    this.deliverymen.push(newDeliveryman);
    this.idCount++;
    return newDeliveryman;
  }

  get() : Deliveryman[] {
    return this.deliverymen;
  }
  
  getById(deliverymanId: number) : Deliveryman {
    return this.deliverymen.find(({ id }) => id == deliverymanId);
  }
}
