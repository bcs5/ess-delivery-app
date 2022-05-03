import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
   
    form;
    message = "";

    constructor(private formBuilder:FormBuilder, private router:Router) {

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
  
    ngOnInit() {
    }

    register() {
        this.message = 'Cadastro realizado '+ this.form.get('name').value + ', faça login para continuar';
        alert(this.message)
        this.router.navigate(['/login'])
    }

    goToLogin() {
        this.router.navigate(['/login'])
    }
  
  }