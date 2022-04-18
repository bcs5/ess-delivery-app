import { Order } from "./order";
import { Deliveryman } from "./deliveryman";

export class Delivery {
  order: Order;
  deliveryman: Deliveryman;
  blocklist: Set<number>;
  created_at: Date;
  collected_at: Date;
  finished_at: Date;
  status: String;

  constructor(delivery: Delivery) {
    this.order = delivery.order;
    this.deliveryman = delivery.deliveryman;
    this.created_at = delivery.created_at ? delivery.created_at : new Date();
    this.blocklist = delivery.blocklist ? delivery.blocklist : new Set<number>();
    this.status = "pending";
  }

  accept() {
    this.status = "inprogress";
  }

  reject() {
    this.status = "rejected";
    this.blocklist.add(this.deliveryman.id);
  }

  isBlocklisted (deliverymanId: number): boolean {
    return this.blocklist.has(deliverymanId);
  }

  expire() {
    this.status = "expired";
    if (this.deliveryman) {
      this.blocklist.add(this.deliveryman.id);
    }
  }

  collect() {
    this.status = "collected";
    this.collected_at = new Date();
  }

  finish() {
    this.status = "finished";
    this.finished_at = new Date();
  }

  inactive() {
    return this.incomplete() || this.status == "finished";
  }

  incomplete() {
    return this.hasExpired() || this.status == "rejected";
  }

  hasExpired(): boolean {
    return this.status == "expired";
  }
}
