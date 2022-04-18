import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';

import {  Delivery } from './delivery';
import { DeliveriesService } from './deliveries.service';

@Component({
  selector: 'app-root',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
   constructor(private deliveriesService: DeliveriesService) {}

   delivery: Delivery = new Delivery();
   deliveries: Delivery[] = [];

   ngOnInit(): void {
      this.deliveriesService.getDeliveries()
         .then(deliveries => this.deliveries = deliveries)
         .catch(erro => alert(erro));
   }

}