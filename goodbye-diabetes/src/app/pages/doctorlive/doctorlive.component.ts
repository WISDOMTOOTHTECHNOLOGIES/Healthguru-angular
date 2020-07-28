import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-doctorlive',
  templateUrl: './doctorlive.component.html',
  styleUrls: ['./doctorlive.component.scss']
})
export class DoctorliveComponent implements OnInit {

  loading: boolean;
  name: string;
  qualification: string;
  description: string;
  image: any;
  url: string;

  editLive: any;

  editLoading: boolean;
  editId: string;
  editName: string;
  editQualification: string;
  editDescription: string;
  editImage: any;
  editUrl: string;

  isLive: boolean = false;

  allLives: any;
  allOngoingLive: any;

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

  /***** To List All Doctor Live ******/ 
  getAllLives() {
    this.allLives = [];
    this.allOngoingLive = [];
    this.isLive = false;
    let servicePath = this.utils.getApiConfigs("doctorlive_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            res.data.forEach(element => {
              if(element.type == 1) {
                this.allLives.push(element);
              } else {
                this.isLive = true;
                this.allOngoingLive.push(element);
              }
            });
            //this.allLives = res.data;
          }
        }
      });
  }

  /***** To Capture File On Add Live ******/ 
  onThumbnailFileChanged(event: { target: { files: any[]; }; }) {
    this.image = event.target.files[0];
  }

  /***** To Capture File On Edit Live ******/ 
  onThumbnailEditFileChanged(event: { target: { files: any[]; }; }) {
    this.editImage = event.target.files[0];
  }

  /***** To Add Live ******/ 
  addLive() {
    this.loading = true;
    if(this.name == '' || this.name == undefined) {
      alert("Please enter Doctor name");
      return;
    }
    if(this.qualification == '' || this.qualification == undefined) {
      alert("Please enter qualification");
      return;
    }
    if(this.description == '' || this.description == undefined) {
      alert("Please enter description");
      return;
    }
    if(this.url == '' || this.url == undefined) {
      alert("Please enter url");
      return;
    }

    
    if(this.url != "" && this.url != undefined) {
      var parts = this.url.split("/");
      this.url = parts[parts.length - 1];
      this.url = 'http://www.youtube.com/embed/'+this.url;
    }

    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("qualification", this.qualification);
    formData.append("description", this.description);
    formData.append("image", this.image);
    formData.append("url", this.url);

    this.httpClient.post<any>('http://172.105.61.17:3001/liveinfo', formData).subscribe(
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

  /***** To Set Default Value For Edit Live ******/ 
  edit_live(id: string) {
    this.editId = id;
    this.editLive = this.allLives.find(x => x.id == this.editId);
    this.editName = this.editLive.name;
    this.editQualification = this.editLive.qualification;
    this.editDescription = this.editLive.description;
    this.editUrl = this.editLive.url;
    
  }

  /***** To Update Completed Live ******/ 
  setLiveCompleted(id: string) {
    let formData = new FormData();
    formData.append("id", id);

    this.httpClient.post<any>('http://172.105.61.17:3001/liveinfo', formData).subscribe(
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

  /***** To Update Live ******/ 
  updateLive() {
    this.editLoading = true;
    if(this.editName == '' || this.editName == undefined) {
      alert("Please enter Doctor name");
      return;
    }
    if(this.editQualification == '' || this.editQualification == undefined) {
      alert("Please enter qualification");
      return;
    }
    if(this.editDescription == '' || this.editDescription == undefined) {
      alert("Please enter description");
      return;
    }
    if(this.editUrl == '' || this.editUrl == undefined) {
      alert("Please enter url");
      return;
    }

    if(this.editUrl != "" && this.editUrl != undefined) {
      var parts = this.editUrl.split("=");
      let subpart: string = parts[parts.length - 1];

      if(!subpart.includes("embed")) {
        this.editUrl = parts[parts.length - 1];
        this.editUrl = 'http://www.youtube.com/embed/'+this.editUrl;
      }
      
    }

    let formData = new FormData();
    formData.append("id", this.editId);
    formData.append("name", this.editName);
    formData.append("qualification", this.editQualification);
    formData.append("description", this.editDescription);
    formData.append("image", this.editImage);
    formData.append("url", this.editUrl);

    this.httpClient.post<any>('http://172.105.61.17:3001/liveinfo', formData).subscribe(
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

  /***** To Delete Live ******/ 
  deleteDoctorLive(id: string) {
    this.deleteId = id;
    this.btnDelete.nativeElement.click();
  }

  /***** To Get Confirmation For Delete Live ******/ 
  confirmDeleteLive() {
    let payload = { "id": this.deleteId }
      let servicePath = this.utils.getApiConfigs("delete_doctorlive");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
        .then((res: any) => {
          if (res.status_code == 200) {
            this.btnCloseDelete.nativeElement.click();
            this.getAllLives();
          }
        });
  }
}
