import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';

import { Delivery } from '../../Interface/delivery';
import { DeliveriesService } from '../../Interface/deliveries.service';
import { interval } from 'rxjs';
import { Subscription } from 'rxjs';
import { DeliveryManService } from 'src/app/Interface/delivery-man.service';

@Component({
   selector: 'app-root',
   templateUrl: './deliveries.component.html',
   styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
   constructor(private deliveriesService: DeliveriesService, private deliveryManService: DeliveryManService) { }

   user: string;
   wallet: number;

   delivery: Delivery = new Delivery();
   deliveries: Delivery[] = [];

   intervalSubscription: Subscription;
   source = interval(5000);

   activeButton(): void {
      this.disableInterval();
      this.searchGet();
      this.activeInterval();
   }
   
   searchGet(): void {
      this.deliveriesService.getDeliveryX()
         .subscribe((deliveries) => this.deliveries = deliveries);

      this.deliveryManService.getUser().subscribe(value => {
         this.user = value.name;
         this.wallet = value.wallet;
      });
   }
   activeInterval(): void {
      this.intervalSubscription = this.source.subscribe(() => {
         this.searchGet();
      })
   };

   disableInterval(): void {
      this.intervalSubscription.unsubscribe();
   }

   ngOnInit(): void {
      this.searchGet();
      this.activeInterval();
   }

   ngOnDestroy() {
      this.disableInterval();
   }
}
