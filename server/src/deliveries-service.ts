import { Delivery } from "./delivery";
import { Deliveryman } from "./deliveryman";
import { DeliverymenService } from "./deliverymen-service";
import { OrdersService } from "./orders-service";

const TIMELIMIT = 60*1000;
export class DeliveriesService {
  ordersService: OrdersService;
  deliverymenService: DeliverymenService;
  
  deliveries: Delivery[] = [];
  idCount: number = 0;

  constructor(ordersService: OrdersService, deliverymenService: DeliverymenService) {
    this.ordersService = ordersService;
    this.deliverymenService = deliverymenService;
  }

  removeDelivery(delivery: Delivery) {
    const index = this.deliveries.indexOf(delivery);
    if (index >= 0) {
      this.deliveries.splice(index, 1);
    }
  }

  process() {
    const now = new Date().getTime()
    var expired = this.deliveries.filter(({status, created_at}) => status == "pending" && now - created_at.getTime() > TIMELIMIT );
    expired.forEach(delivery => {
      delivery.expire();
    });
    expired = this.deliveries.filter(delivery => delivery.incomplete())
    
    var freeDeliverymen: Deliveryman[] = this.deliverymenService.getFree();
    for (let i = 0; i < expired.length; i++) {
      var deliveryman = freeDeliverymen.find(deliveryman => deliveryman.isFree() && !expired[i].isBlocklisted(deliveryman.id));
      if (deliveryman) {
        var order = expired[i].order;
        var blocklist = expired[i].blocklist;
        var delivery: Delivery = new Delivery(<Delivery>{order: order, deliveryman: deliveryman, blocklist: blocklist, created_at: new Date()});
        deliveryman.addDelivery(delivery);
        this.deliveries.push(delivery);
        this.removeDelivery(expired[i]);
      }
    }
  }
  

  accept(deliverymanId: number, orderId: number) {
    var deliveryman = this.deliverymenService.getById(deliverymanId);
    if (!deliveryman) {
      throw "No deliveryman";
    }
    if (deliveryman.deliveries) {
      var delivery = deliveryman.deliveries[0];
      if (delivery.order.id == orderId && delivery.status == "pending") {
        delivery.accept()
        this.removeDelivery(delivery);
        return delivery;
      } else {
        throw "No delivery found.";
      }
    }
  }

  reject(deliverymanId: number, orderId: number) {
    var deliveryman = this.deliverymenService.getById(deliverymanId);
    if (deliveryman.deliveries) {
      var delivery = deliveryman.deliveries[0];
      if (delivery.order.id == orderId && delivery.status == "pending") {
        delivery.reject()
        return;
      }
    }
    throw 'not performed';
  }

  collect(deliverymanId: number, orderId: number) {
    var deliveryman = this.deliverymenService.getById(deliverymanId);
    if (deliveryman.deliveries) {
      var delivery = deliveryman.deliveries[0];
      if (delivery.order.id == orderId && delivery.status == "inprogress") {
        delivery.collect()
      }
    }
  }

  finish(deliverymanId: number, orderId: number) {
    var deliveryman = this.deliverymenService.getById(deliverymanId);
    if (deliveryman.deliveries) {
      var delivery = deliveryman.deliveries[0];
      if (delivery.order.id == orderId && delivery.status == "collected") {
        delivery.finish()
      }
    }
  }

  addOrder(orderId: number) {
    var order = this.ordersService.getById(orderId);
    var delivery = new Delivery(<Delivery>{order: order, created_at: new Date(0)});
    this.deliveries.push(delivery);
    return delivery;
  }

  addOrderDeliveryman(orderId: number, deliverymanId: number) {
    var order = this.ordersService.getById(orderId);
    var deliveryman = this.deliverymenService.getById(deliverymanId);
    var delivery = new Delivery(<Delivery>{order: order, deliveryman: deliveryman});
    this.deliveries.push(delivery);
    deliveryman.addDelivery(delivery);
    return delivery;
  }

  addDeliveryman(deliveryman: Deliveryman) {
    return this.deliverymenService.add(deliveryman);
  }

  byDeliveryman (id: number): Delivery[] {
    return this.deliverymenService.getById(id).deliveries;
  }
}