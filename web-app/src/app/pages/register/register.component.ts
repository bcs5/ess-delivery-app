import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { RegisterService } from '../../Interface/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
   
    form;
    message = "";

    constructor(private formBuilder:FormBuilder, private router:Router, private registerService: RegisterService) {
        this.buildForm();
    }

    buildForm(){

        this.form = this.formBuilder.group({

            name: ['', Validators.required],
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

    register() {
        let name = this.form.get('name').value;
        let cnh = this.form.get('cnh').value;
        let birthDate = this.form.get('birthDate').value;
        let phone = this.form.get('phone').value;
        let email = this.form.get('email').value;
        let password = this.form.get('password').value;
        let cep = this.form.get('cep').value;
        let street = this.form.get('street').value;
        let number = this.form.get('number').value;
        let complement = this.form.get('complement').value;
        let district = this.form.get('district').value;
        let city = this.form.get('city').value;
        let state = this.form.get('state').value;

        this.registerService.register(name, email, password, phone, cnh, birthDate, cep, street, number, district, city, state, complement)
        .then(res => {
            alert(res.success)
            this.goToLogin()
        })
        .catch(res => {
            alert(res)
        });
    }

    goToLogin() {
        this.router.navigate(['/login'])
    }
  
  }