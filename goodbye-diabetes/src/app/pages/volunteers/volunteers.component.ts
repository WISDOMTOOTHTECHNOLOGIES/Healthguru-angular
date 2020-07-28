import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.scss']
})
export class VolunteersComponent implements OnInit {

  noVolunteers: boolean = true;
  allVolunteers: any;
  allLanguages: any;
  phone_num: string = "";
  name: string;
  age: string;
  gender: string = "1";
  emailId: string;
  languages: string = "1";
  servicesOffered: string;
  selectVolunteer: any;

  editPhone_num: string;
  editName: string;
  editAge: string;
  editGender: string;
  editEmailId: string;
  editLanguages: string;
  editServicesOffered: string;

  deleteId: string;

  @ViewChild('btnDelete') btnDelete: ElementRef; 
  @ViewChild('btnCloseDelete') btnCloseDelete: ElementRef; 

  constructor(private sanitizer: DomSanitizer, public utils: ApilistService, private commonservice: CommonService, public router: Router) {
    let logged = sessionStorage.getItem('logged');
    if(logged != '1') {
      this.router.navigate(['/signin']);
    }
   }

  ngOnInit() {
    this.noVolunteers = false;
    this.fetchVolunteers();
    this.fetchLanguages();
  }

  /***** To List All Volunteers ******/ 
  fetchVolunteers() {
    this.allVolunteers = [];
    let servicePath = this.utils.getApiConfigs("get_volunteers");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
             this.allVolunteers = res.data;
             console.log("all volunteers->>", this.allVolunteers);
          }
        }
      });
  }

  /***** To List All Languages ******/ 
  fetchLanguages() {
    let servicePath = this.utils.getApiConfigs("get_languages");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
             this.allLanguages = res.data;
             console.log("all languages->>", this.allLanguages);
          }
        }
      });
  }

  /***** To Add Volunteer ******/ 
  addVolunteers() {
    if(this.phone_num != "") {
      let payload = { "phone_num":this.phone_num, "name": this.name, "age": this.age, "gender": this.gender, "emailID": this.emailId, "language": this.languages, "servicre_offered": this.servicesOffered }
      let servicePath = this.utils.getApiConfigs("add_volunteer");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res); 
        if (res.status_code == 200) {
          this.fetchVolunteers();
        }
      });
    } else {
      alert("Phone number cannot be empty");
    }
    
  }

  /***** To Edit Volunteer ******/ 
  editVolunteer(phone_num: string) {
    this.selectVolunteer = this.allVolunteers.find(x => x.phone_num == phone_num);
    this.editPhone_num = this.selectVolunteer.phone_num;
    this.editName = this.selectVolunteer.name;
    this.editAge = this.selectVolunteer.age;
    this.editGender = this.selectVolunteer.gender;
    this.editEmailId = this.selectVolunteer.emailID;
    this.editLanguages = this.selectVolunteer.language;
    this.editServicesOffered = this.selectVolunteer.servicre_offered;
  }

  /***** To Update Volunteer ******/ 
  updateVolunteer() {
    if(this.editPhone_num != "") {
      let payload = { "phone_num":this.editPhone_num, "name": this.editName, "age": this.editAge, "gender": this.editGender, "emailID": this.editEmailId, "language": this.editLanguages, "servicre_offered": this.editServicesOffered }
      let servicePath = this.utils.getApiConfigs("add_volunteer");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res); 
        if (res.status_code == 200) {
          this.fetchVolunteers();
        }
      });
    } else {
      alert("Phone number cannot be empty");
    }
    
  }

  /***** To Delete Volunteer ******/ 
  deleteVolunteer(phone_num: string) {
    this.deleteId = phone_num;
    this.btnDelete.nativeElement.click();
  }

  /***** To Get Confirmation For Delete ******/ 
  confirmDeleteVolunteer() {
    let payload = { "phone_num": this.deleteId }
    let servicePath = this.utils.getApiConfigs("delete_volunteer");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.btnCloseDelete.nativeElement.click();
            this.fetchVolunteers();
          }
        }
      });
  }

}
