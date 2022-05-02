import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { ActivatedRoute, ParamMap , Router} from '@angular/router';
import { DeliveriesService } from 'src/app/Interface/deliveries.service';
import { Delivery } from 'src/app/Interface/delivery';

@Component({
  selector: 'app-root',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  delivery: Delivery = new Delivery();
  
  creationTime: Date;
  start: any;
  id: number;
  seconds: number;

   constructor(private route: ActivatedRoute, private deliveryService: DeliveriesService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id');
      this.find();
    });
  }

  createTimer() {
    this.pause();
    this.start = setInterval(() => {this.timerCall(); }, 1000);
  }

  pause() {
    clearInterval(this.start);
  }

  timerCall() {
    let endSeconds = this.creationTime.getSeconds();
    let endMinutes = this.creationTime.getMinutes() + 1;

    let currentSeconds = new Date().getSeconds();
    let currentMinutes = new Date().getMinutes();

    if(currentMinutes < endMinutes || (currentMinutes == endMinutes && currentSeconds <= endSeconds)){
      this.seconds = (endMinutes - currentMinutes) * 60 + endSeconds - currentSeconds;
    } else {
      this.pause();
    }
  }

  find() {
    this.deliveryService.getDelivery(this.id)
      .then(delivery => { 
        this.delivery = delivery;
        this.creationTime = new Date(delivery.created_at);
        this.createTimer();
      })
      .catch(erro => alert(erro));
  }
  accept() {
    this.deliveryService.accept(this.id)
      .then(delivery => this.delivery = delivery)
      .catch(erro => alert(erro));
  }
  reject() {
    this.deliveryService.reject(this.id)
      .then(delivery => this.delivery = delivery)
      .catch(erro => alert(erro));
  }
  collect() {
    this.deliveryService.collect(this.id)
      .then(delivery => this.delivery = delivery)
      .catch(erro => alert(erro));
  }
  finish() {
    this.deliveryService.finish(this.id)
      .then(delivery => this.delivery = delivery)
      .catch(erro => alert(erro));
  }
  evaluation(cScore: number, rScore:number){
    this.deliveryService.evaluation(this.id,rScore,cScore)
    .then(delivery => this.delivery = delivery)
    .catch(erro => alert(erro));
  }
  btnClick () {
    this.router.navigateByUrl('/deliveries');
  }
  isPending () {
    return this.delivery.status == "pending";
  }
  isInProgress() {
    return this.delivery.status == "in_progress";
  }
  isCollected() {
    return this.delivery.status == "collected";
  }
  isFinished() {
    return this.delivery.status == "finished";
  }
  isEvaluated () {
    return this.delivery.status == "evaluated";
  }
}
