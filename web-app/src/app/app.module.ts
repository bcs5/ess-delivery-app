import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { DeliveriesService } from './deliveries/delivery.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DeliveriesComponent
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
      }
    ])
  ],
  providers: [DeliveriesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
