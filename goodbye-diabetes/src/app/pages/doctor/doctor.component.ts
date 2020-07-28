import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {

  loading: boolean = false;
  name: string;
  qualifiaction: string;
  speciality: string;
  institution: string;
  image: any;

  allDoctors: any;
  editDoctor: any;

  editLoading: boolean = false;
  editId: string;
  editName: string;
  editQualification: string;
  editSpeciality: string;
  editInstitution: string;
  editImage: any;

  deleteId: string;

  @ViewChild('btnClose') btnClose: ElementRef; 
  @ViewChild('btnEditClose') btnEditClose: ElementRef;  
  @ViewChild('btnDelete') btnDelete: ElementRef; 
  @ViewChild('btnCloseDelete') btnCloseDelete: ElementRef;
  
  constructor(public router: Router, private sanitizer: DomSanitizer, public utils: ApilistService, private commonservice: CommonService, private httpClient: HttpClient) {
    let logged = sessionStorage.getItem('logged');
    if(logged != '1') {
      this.router.navigate(['/signin']);
    }
   }

  ngOnInit() {
    this.getAllLives();
  }

  /***** To List All Doctors  ******/ 
  getAllLives() {
    let servicePath = this.utils.getApiConfigs("doctorinfo_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allDoctors = res.data;
          }
        }
      });
  }

  /***** To Capture File On Add Doctor ******/ 
  onThumbnailFileChanged(event: { target: { files: any[]; }; }) {
    this.image = event.target.files[0];
  }

  /***** To Capture File On Edit Doctor ******/ 
  onThumbnailEditFileChanged(event: { target: { files: any[]; }; }) {
    this.editImage = event.target.files[0];
  }

  /***** To Add Doctor ******/ 
  addDoctor() {
    this.loading = true;
    if(this.name == '' || this.name == undefined) {
      alert("Please enter doctor name");
      return;
    }
    if(this.qualifiaction == '' || this.qualifiaction == undefined) {
      alert("Please enter qualification");
      return;
    }
    if(this.speciality == '' || this.speciality == undefined) {
      alert("Please enter speciality");
      return;
    }
    if(this.institution == '' || this.institution == undefined) {
      alert("Please enter institution");
      return;
    }

    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("qualification", this.qualifiaction);
    formData.append("specality", this.speciality);
    formData.append("institution", this.institution);
    formData.append("image", this.image);

    this.httpClient.post<any>('http://172.105.61.17:3001/doctorinfo', formData).subscribe(
      (res) => {
        this.editLoading = false;
        if (res.status_code == 200) {
          this.btnClose.nativeElement.click();
          this.getAllLives();
        }
        console.log(res);
      },
      (err) => {
        this.loading = false;
        console.log(err)
      } 
    );  

  }

  /***** To Set Default Values For Edit Doctor ******/ 
  edit_doctor(id: string) {
    this.editId = id;
    this.editDoctor = this.allDoctors.find(x => x.id == this.editId);
    this.editName = this.editDoctor.name;
    this.editImage = this.editDoctor.image;
    this.editQualification = this.editDoctor.qualification;
    this.editSpeciality = this.editDoctor.specality;
    this.editInstitution = this.editDoctor.institution;
    
  }

  /***** To Update Doctor Details ******/ 
  updateDoctor() {
    this.editLoading = true;
    if(this.editName == '' || this.editName == undefined) {
      alert("Please enter doctor name");
      return;
    }
    if(this.editQualification == '' || this.editQualification == undefined) {
      alert("Please enter qualification");
      return;
    }
    if(this.editSpeciality == '' || this.editSpeciality == undefined) {
      alert("Please enter speciality");
      return;
    }
    if(this.editInstitution == '' || this.editInstitution == undefined) {
      alert("Please enter institution");
      return;
    }

    let formData = new FormData();
    formData.append("id", this.editId);
    formData.append("name", this.editName);
    formData.append("qualification", this.editQualification);
    formData.append("specality", this.editSpeciality);
    formData.append("institution", this.editInstitution);
    formData.append("image", this.editImage);

    this.httpClient.post<any>('http://172.105.61.17:3001/doctorinfo', formData).subscribe(
      (res) => {
        this.editLoading = false;
        if (res.status_code == 200) {
          this.btnEditClose.nativeElement.click();
          this.getAllLives();
        }
      },
      (err) => {
        this.editLoading = false;
      } 
    );  
  }

  /***** To Delete Doctor ******/ 
  deleteDoctor(id: string) {
    this.deleteId = id;
    this.btnDelete.nativeElement.click();
  }

  /***** To Get Confirmation For Delete ******/ 
  confirmDeleteDoctor() {
    let payload = { "id": this.deleteId }
      let servicePath = this.utils.getApiConfigs("delete_doctor");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
        .then((res: any) => {
          if (res.status_code == 200) {
           this.getAllLives();
           this.btnCloseDelete.nativeElement.click();
          }
        });
  }

}
