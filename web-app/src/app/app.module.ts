import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { DeliveriesService } from './deliveries/deliveries.service';
import { DeliveryComponent } from './delivery/delivery.component';
import { DeliveryService } from './delivery/delivery.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DeliveriesComponent,
    DeliveryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: 'deliveries',
        component: DeliveriesComponent
      },
      {
        path: 'delivery/:id',
        component: DeliveryComponent
      }
    ])
  ],
  providers: [DeliveriesService, DeliveryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
