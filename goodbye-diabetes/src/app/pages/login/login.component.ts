import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { ApilistService } from 'src/app/services/apilist.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoginError: boolean = false;
  errMsg: boolean = false;
  showError: any;
  displayVersion: any;
  userForm: FormGroup;
  display: string = "none";
  contact: boolean = false;

  constructor(
    public commonservice: CommonService, public router: Router, public utils: ApilistService, public http: HttpClient, private spinner: NgxSpinnerService, private formData: FormBuilder) {
    this.initFormBuilder();
  }
  initFormBuilder() {
    this.userForm = this.formData.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  /**
   * component initial method
   */
  ngOnInit() {
    localStorage.clear();
    window.sessionStorage.clear();
    if (this.commonservice.apiUrl == "http://192.168.1.63:3000") {
      this.displayVersion = "UAT Version 0.1";
    } else {
      this.displayVersion = "Production Version 0.1";
    }
  }

  /**
   * login by valid credential
   */
  /***** To Check Login ******/ 
  login() {
    this.errMsg = false;
    let servicePath = this.utils.getApiConfigs("login");
    let payload = { "email_id": this.userForm.get("email").value.trim(), "password": this.userForm.get("password").value.trim() };
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
    .then((data: any) => {
         this.spinner.hide();
         if (data.status_code == 200) {
           sessionStorage.setItem('logged', "1");
           this.router.navigate(['/Users']);
         } else {
           this.errMsg = true;
           this.showError = "You have entered an invalid Email ID or Password";
         }
       })
  }
  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  forgot() {
    this.contact = true;
  }
}