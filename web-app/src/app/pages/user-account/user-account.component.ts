import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { UserAccountService } from '../../Interface/user-account.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {

  form;
  message = "";
  infos;
  constructor(private formBuilder: FormBuilder, private router: Router, private userAccountService: UserAccountService) {
    this.getInfos();
  }

  buildForm() {
    this.form = this.formBuilder.group({

      name: [this.infos.name, Validators.required],
      cnh: [this.infos.cnh, Validators.required],
      birthDate: [this.infos.birth, Validators.required],
      phone: [this.infos.phoneNumber, Validators.required],
      email: [this.infos.email, Validators.required],
      password: [''],
      passwordConfirmation: [''],
      cep: [this.infos.zipcode, Validators.required],
      street: [this.infos.street, Validators.required],
      number: [this.infos.number, Validators.required],
      complement: [''],
      district: [this.infos.neighborhood, Validators.required],
      city: [this.infos.city, Validators.required],
      state: [this.infos.state, Validators.required]

    });

  }

  update() {
    if (this.verifyPassword()) {
      let name = this.form.get('name').value;
      let cnh = this.form.get('cnh').value;
      let birthDate = this.form.get('birthDate').value;
      let phone = this.form.get('phone').value;
      let email = this.form.get('email').value;
      var password = this.form.get('password').value;
      let cep = this.form.get('cep').value;
      let street = this.form.get('street').value;
      let number = this.form.get('number').value;
      let complement = this.form.get('complement').value;
      let district = this.form.get('district').value;
      let city = this.form.get('city').value;
      let state = this.form.get('state').value;

      if (password == '') {
        password = this.infos.password
      }

      this.userAccountService.updateInfos(name, email, password, phone, cnh, birthDate, cep, street, number, district, city, state, complement)
      .then(res => {
        alert(res.success)
        this.goToHome()
      })
      .catch(res => {
        alert(res)
        if (res === 'You need to be logged to update this data!') {
          this.router.navigate(['/login'])
        }
      });
    } else {
      this.message = 'As senhas informadas não coincidem';
      alert(this.message)
    }

  }

  goToHome() {
    this.router.navigate(['/'])
  }

  deleteAccount() {
    this.userAccountService.deleteInfos()
    .then(res => {
      alert(res.success)
      this.router.navigate(['/'])
    })
    .catch(res => {
      alert(res)
    });
  }

  logout() {
    this.userAccountService.logout()
    .then(res => {
      this.router.navigate(['/login'])
    })
    .catch(res => {
      alert(res)
    });
  }

  verifyPassword() {
    if (this.form.get('password').value == this.form.get('passwordConfirmation').value) {
      return true
    } else {
      return false
    }
  }

  getInfos() {
    this.userAccountService.getInfos()
      .then(res => {
        let birth: string = res.birth.substring(0,10)
        
        this.infos = {
          'name': res.name,
          'email': res.email,
          'password': res.password,
          'phoneNumber': res.phoneNumber,
          'cnh': res.cnh,
          'birth': birth,
          'zipcode': res.address.zipcode,
          'street': res.address.street,
          'number': res.address.number,
          'neighborhood': res.address.neighborhood,
          'city': res.address.city,
          'state': res.address.state,
          'complement': res.address.complement
        };
        this.buildForm();
      })
      .catch(res => {
        alert(res)
      });
  }
}
