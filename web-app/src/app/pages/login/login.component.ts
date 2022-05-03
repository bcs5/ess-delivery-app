import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Interface/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 
  formLogin;
  message;

  constructor(private formBuilder:FormBuilder, private router: Router, private loginService: LoginService) {
      this.buildForm();
  }

  buildForm(){
      this.formLogin = this.formBuilder.group({
          email: ['', Validators.required],
          password: ['', Validators.required],
      });
  }

  login() {
    let email = this.formLogin.get('email').value;
    console.log(`here`)
    let password = this.formLogin.get('password').value;
    this.loginService.login(email, password)
    .then(res => {
      alert(res.success)
      // this.router.navigate(['/"minhaConta"'])
    })
    .catch(res => {
      alert(res)
    })
  }
  goToRegister(){
    this.router.navigate(['register'])
  }

}
