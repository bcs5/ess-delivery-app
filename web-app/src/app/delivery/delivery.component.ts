import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import {  Delivery } from './delivery';
import { DeliveryService } from './delivery.service';

@Component({
  selector: 'app-root',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  delivery: Delivery = new Delivery();
   id: number;

   constructor(private route: ActivatedRoute, private deliveryService: DeliveryService) {}

   ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id');
      this.find();
    });
   }

  find() {
    this.deliveryService.getDelivery(this.id)
    .then(delivery => this.delivery = delivery)
    .catch(erro => alert(erro));
  }
  accept () {
    this.deliveryService.accept(this.id)
    .then(delivery => this.delivery = delivery)
    .catch(erro => alert(erro));
  }
  reject () {
    this.deliveryService.reject(this.id)
    .then(delivery => this.delivery = delivery)
    .catch(erro => alert(erro));
  }
  collect () {
    this.deliveryService.collect(this.id)
    .then(delivery => this.delivery = delivery)
    .catch(erro => alert(erro));
  }
  finish () {
    this.deliveryService.finish(this.id)
    .then(delivery => this.delivery = delivery)
    .catch(erro => alert(erro));
  }
  isPending () {
    return this.delivery.status == "pending";
  }
  isInProgress () {
    return this.delivery.status == "inprogress";
  }
  isCollected () {
    return this.delivery.status == "collected";
  }
  isFinished () {
    return this.delivery.status == "finished";
  }
}