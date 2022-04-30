import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { DeliveriesComponent } from './pages/deliveries/deliveries.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { DeliveriesService } from './Interface/deliveries.service';
import { ReviewComponent } from './pages/review/review.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DeliveryManService } from './Interface/delivery-man.service';
import { RegisterComponent } from './pages/register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DeliveriesComponent,
    DeliveryComponent,
    HomeComponent,
    ReviewComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "reviews",
        component: ReviewComponent
      },
      {
        path: 'deliveries',
        component: DeliveriesComponent
      },
      {
        path: 'delivery/:id',
        component: DeliveryComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ])
  ],
  providers: [DeliveriesService, DeliveryManService],
  bootstrap: [AppComponent]
})
export class AppModule { }
