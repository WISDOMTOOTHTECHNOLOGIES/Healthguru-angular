import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  loading: boolean = false;
  name: string;
  topic: string;
  description: string;
  doctorinfo: string;
  datetime: string;
  image: any;

  allLives: any;
  editLive: any;

  editLiveLink: any;

  editLoading: boolean = false;
  editId: string;
  editName: string;
  editTopic: string;
  editDescription: string;
  editDoctor_info: string;
  editDateTime: string;
  editImage: any;

  deleteId: string;

  @ViewChild('btnClose') btnClose: ElementRef; 
  @ViewChild('btnEditClose') btnEditClose: ElementRef;  
  @ViewChild('btnDelete') btnDelete: ElementRef; 
  @ViewChild('btnCloseDelete') btnCloseDelete: ElementRef;


  constructor(public router: Router, private sanitizer: DomSanitizer, public utils: ApilistService, private commonservice: CommonService, private httpClient: HttpClient) { }

  ngOnInit() {
    this.getAllLives();
  }

  /***** To List All Scheduled Lives ******/ 
  getAllLives() {
    let servicePath = this.utils.getApiConfigs("upcominglive_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allLives = res.data;
          }
        }
      });
  }

  /***** To Capture Thumbnail For Add Scheduled Live ******/ 
  onThumbnailFileChanged(event: { target: { files: any[]; }; }) {
    this.image = event.target.files[0];
  }

  /***** To Capture Thumbnail For Edit Scheduled Live ******/ 
  onThumbnailEditFileChanged(event: { target: { files: any[]; }; }) {
    this.editImage = event.target.files[0];
  }

  /***** To Add Scheduled Live ******/ 
  addLive() {
    this.loading = true;
    if(this.name == '' || this.name == undefined) {
      alert("Doctor Name cannot be empty");
      return;
    }
    if(this.topic == '' || this.topic == undefined) {
      alert("Topic cannot be empty");
      return;
    }
    if(this.description == '' || this.description == undefined) {
      alert("Description cannot be empty");
      return;
    }
    if(this.doctorinfo == '' || this.doctorinfo == undefined) {
      alert("Doctor Info cannot be empty");
      return;
    }
    if(this.datetime == '' || this.datetime == undefined) {
      alert("Date and Time cannot be empty");
      return;
    }
    if(this.datetime != '' && this.datetime != undefined) {
      this.datetime = this.datetime.split('T')[0]+" "+this.datetime.split('T')[1]+":00";
    }

    let formData = new FormData();
    formData.append("topic", this.topic);
    formData.append("image", this.image);
    formData.append("date_time", this.datetime);
    formData.append("doctor", this.name);
    formData.append("description", this.description);
    formData.append("doctorinfo", this.doctorinfo);

    this.httpClient.post<any>('http://172.105.61.17:3001/upcominginfo', formData).subscribe(
      (res) => {
        this.loading = false;
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

  /***** To Set Default For Edit Scheduled Live ******/ 
  edit_live(id: string) {
    this.editId = id;
    this.editLive = this.allLives.find(x => x.id == this.editId);
    this.editName = this.editLive.doctor;
    this.editTopic = this.editLive.topic;
    this.editDescription = this.editLive.description;
    this.editDoctor_info = this.editLive.doctor_info;
    this.editDateTime = this.editLive.date_time;
    
  }

  /***** To Update Scheduled Live ******/ 
  updateLive() {
    this.editLoading = true;
    if(this.editName == '' || this.editName == undefined) {
      alert("Doctor Name cannot be empty");
      return;
    }
    if(this.editTopic == '' || this.editTopic == undefined) {
      alert("Topic cannot be empty");
      return;
    }
    if(this.editDescription == '' || this.editDescription == undefined) {
      alert("Description cannot be empty");
      return;
    }
    if(this.editDoctor_info == '' || this.editDoctor_info == undefined) {
      alert("Doctor Info cannot be empty");
      return;
    }
    if(this.editDateTime == '' || this.editDateTime == undefined) {
      alert("Date and Time cannot be empty");
      return;
    }
    if(this.editDateTime != '' && this.editDateTime != undefined) {
      this.editDateTime = this.editDateTime.split('T')[0]+" "+this.editDateTime.split('T')[1]+":00";
    }

    let formData = new FormData();
    formData.append("id", this.editId);
    formData.append("topic", this.editTopic);
    formData.append("image", this.editImage);
    formData.append("date_time", this.editDateTime);
    formData.append("doctor", this.editName);
    formData.append("description", this.editDescription);
    formData.append("doctorinfo", this.editDoctor_info);

    this.httpClient.post<any>('http://172.105.61.17:3001/upcominginfo', formData).subscribe(
      (res) => {
        this.editLoading = false;
        if (res.status_code == 200) {
          this.btnEditClose.nativeElement.click();
          this.getAllLives();
        }
        console.log(res);
      },
      (err) => {
        this.editLoading = false;
        console.log(err)
      } 
    );  
  }

  /***** To Delete Scheduled Live ******/ 
  deleteLive(id: string) {
    this.deleteId = id;
    this.btnDelete.nativeElement.click();
  }

  /***** To Get Confirmation For Delete ******/ 
  confirmDeleteLive() {
    let payload = { "id": this.deleteId }
      let servicePath = this.utils.getApiConfigs("delete_upcominglive");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
        .then((res: any) => {
          if (res.status_code == 200) {
            this.btnCloseDelete.nativeElement.click();
           this.getAllLives();
          }
        });
  }
}
 