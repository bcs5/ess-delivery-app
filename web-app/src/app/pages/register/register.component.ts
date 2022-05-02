import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
   
    form;
    message = "";

    constructor(private formBuilder:FormBuilder) {

        this.buildForm();

    }

    buildForm(){

        this.form = this.formBuilder.group({

            name: ['', Validators.required, Validators.name],
            cnh: ['', Validators.required],
            birthDate: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            cep: ['', Validators.required],
            street: ['', Validators.required],
            number: ['', Validators.required],
            complement: [''],
            district: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required]

        });

    }
  
    ngOnInit() {
    }

    register() {
        this.message = 'Your order has been submitted '+ this.form.get('name').value;
        console.warn('Your order has been submitted', this.form.value);
    }
  
  }