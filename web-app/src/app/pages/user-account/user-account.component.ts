import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {

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
            passwordConfirmation: ['', Validators.required],
            cep: ['', Validators.required],
            street: ['', Validators.required],
            number: ['', Validators.required],
            complement: [''],
            district: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required]

        });

    }

    update() {
      if(this.verifyPassword()){
        this.message = 'Alteração realizada '+ this.form.get('name').value;
        alert(this.message)
        this.router.navigate(['/'])
      } else {
        this.message = 'As senhas informadas não coincidem';
        alert(this.message)
      }
        
    }

    goToHome() {
        this.router.navigate(['/'])
    }

    deleteAccount() {

    }

    verifyPassword() {
      if (this.form.get('password').value == this.form.get('passwordConfirmation').value){
        return true
      } else {
        return false
      }
    }

}
