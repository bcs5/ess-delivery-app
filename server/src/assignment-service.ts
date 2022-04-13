import { Deliveryman } from "./deliveryman";
import { Order } from "./order";

class OrderDeliveryman {
  order: Order;
  deliveryman: Deliveryman;
  status: string;
  created_at: number;
  accepted_at: number;
  rejected_at: number;
  finished_at: number;
  constructor(order: Order, status: string, created_at?: number, deliveryman?: Deliveryman) {
    this.order = order;
    this.deliveryman = deliveryman;
    this.status = status;
    this.created_at = created_at ? created_at : (new Date().getTime());
  }

  updateStatus (status: string, time: number){
    this.status = status;
    if (status == "inprogress") {
      this.accepted_at = time;
    }
    if (status == "rejected") {
      this.rejected_at = time;
    }
    if (status == "finished") {
      this.finished_at = time;
    }
  }
}

interface Foo {
  [key: string]: number;
}
const TIMELIMIT = 60

export class AssignmentService {
  newOrders: OrderDeliveryman[] = [];
  pending: OrderDeliveryman[] = [];
  inprogress: OrderDeliveryman[] = [];
  finished: OrderDeliveryman[] = [];
  
  accept(deliverymanId: number, orderId: number): void {
    const now = new Date().getTime()
    const pending = this.pending.find(({ deliveryman}) => deliveryman.id == deliverymanId);
    if (pending) {
      if(pending.order.id == orderId) {
        const index = this.pending.indexOf(pending)
        this.pending.splice(index, 1)
        if (now - pending.created_at < TIMELIMIT) {
          pending.updateStatus('inprogress', now);
          this.inprogress.push(pending)
        } else {
          pending.updateStatus('finished', now); // TLE
          this.finished.push(pending)
        }
      }
    }
  }

  reject(deliverymanId: number, orderId: number): void {
    const now = new Date().getTime()
    const pending = this.pending.find(({ deliveryman}) => deliveryman.id == deliverymanId);
    if (pending) {
      if(pending.order.id == orderId) {
        const index = this.pending.indexOf(pending)
        this.pending.splice(index, 1)
        if (now - pending.created_at < TIMELIMIT) {
          pending.updateStatus('rejected', now);
        } else {
          pending.updateStatus('finished', now); // TLE
        }
        this.finished.push(pending)
      }
    }
  }

  addOrder (order: Order, deliveryman? : Deliveryman) {
    const now = new Date().getTime()
    if (deliveryman) {
      this.pending.push(new OrderDeliveryman(order, "pending", now, deliveryman));
    } else {
      this.newOrders.push(new OrderDeliveryman(order, "new"));
    }
  }

  getByDeliverymanId(deliverymanId: number): OrderDeliveryman[] {
    const now = new Date().getTime()
    const pending = this.pending.filter(({ deliveryman, created_at}) => deliveryman.id == deliverymanId && now-created_at < TIMELIMIT);
    const inprogress = this.inprogress.filter(({ deliveryman }) => deliveryman.id == deliverymanId);
    const finished = this.finished.filter(({ deliveryman }) => deliveryman.id == deliverymanId);
    return pending.concat(inprogress).concat(finished)
  }
}
