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
  id: number;

<<<<<<< HEAD
   constructor(private route: ActivatedRoute, private deliveryService: DeliveriesService, private router: Router) {}
=======
  constructor(private route: ActivatedRoute, private deliveryService: DeliveriesService) { }
>>>>>>> f58ef51 (Correção de bugs da interface deliveries)

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = +params.get('id');
      this.find();
    });
  }

  find() {
    this.deliveryService.getDelivery(this.id)
      .then(delivery => { 
        this.delivery = delivery;
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
<<<<<<< HEAD
  evaluation(cScore: number, rScore:number){
    this.deliveryService.evaluation(this.id,rScore,cScore)
    .then(delivery => this.delivery = delivery)
    .catch(erro => alert(erro));
  }
  btnClick () {
    this.router.navigateByUrl('/deliveries');
  }
  isPending () {
=======
  isPending() {
>>>>>>> f58ef51 (Correção de bugs da interface deliveries)
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
