import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { LoginService } from './Interface/login.service'
import { HomeComponent } from './pages/home/home.component';
import { DelivererService } from './Interface/deliverer.service';
import { RegisterComponent } from './pages/register/register.component';
import { TopPageComponent } from './pages/top-page/top-page.component';
import { AboutComponent } from './pages/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DeliveriesComponent,
    DeliveryComponent,
    HomeComponent,
    ReviewComponent,
    LoginComponent,
    RegisterComponent,
    TopPageComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
        path: "about",
        component: AboutComponent
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
  providers: [DeliveriesService, DelivererService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
