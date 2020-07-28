import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {

  allResources: any;

  isTypeImage: boolean = false;
  isTypeDocument: boolean = false;
  isTypeVideo: boolean = false;
  isEditTypeImage: boolean = false;
  isEditTypeDocument: boolean = false;
  isEditTypeVideo: boolean = false;

  loading: boolean = false;
  editLoading: boolean = false;

  title: string = "";
  type: string = "";
  file: any;
  url: string = "";
  thumbnail: any;

  editResource: any;

  editId: string = "";
  editTitle: string = "";
  editType: string = "";
  editFile: any;
  editUrl: string = "";
  editThumbnail: any;

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
    this.getAllResources();
  }

  /***** To List All Resources ******/ 
  getAllResources() {
    let servicePath = this.utils.getApiConfigs("get_links");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allResources = res.data;
            this.allResources = this.allResources.reverse();
            //console.log(this.allResources);
          }
        }
      });
  }

  /***** To Show Type Of File For Add Resources ******/ 
  onTypeChange(value) {
    if(value == 'image') {
      this.isTypeImage = true;
      this.isTypeVideo = false;
      this.isTypeDocument = false;
    }
    if(value == 'document') {
      this.isTypeDocument = true;
      this.isTypeImage = false;
      this.isTypeVideo = false;
    }
    if(value == 'youtube') {
      this.isTypeVideo = true;
      this.isTypeImage = false;
      this.isTypeDocument = false;
    }
  }

  /***** To Show File Type For Edit Resource ******/ 
  onEditTypeChange(value) {
    if(value == 'image') {
      this.isEditTypeImage = true;
      this.isEditTypeVideo = false;
      this.isEditTypeDocument = false;
    }
    if(value == 'document') {
      this.isEditTypeDocument = true;
      this.isEditTypeImage = false;
      this.isEditTypeVideo = false;
    }
    if(value == 'youtube') {
      this.isEditTypeVideo = true;
      this.isEditTypeImage = false;
      this.isEditTypeDocument = false;
    }
  }

  /***** To Capture Video On Add Resource ******/ 
  onVideoFileChanged(event: { target: { files: any[]; }; }) {
    this.file = event.target.files[0];
  }

  /***** To Capture Video On Edit Resource ******/ 
  onEditVideoFileChanged(event: { target: { files: any[]; }; }) {
    this.editFile = event.target.files[0];
  }

  /***** To Capture Image On Add Resource ******/ 
  onImageFileChanged(event: { target: { files: any[]; }; }) {
    this.file = event.target.files[0];
  }

  /***** To Capture Thumbnail On Add Resource ******/ 
  onThumbnailFileChanged(event: { target: { files: any[]; }; }) {
    this.thumbnail = event.target.files[0];
  }

  /***** To Capture Thumbnail On Edit Resource ******/ 
  onEditThumbnailFileChanged(event: { target: { files: any[]; }; }) {
    this.editThumbnail = event.target.files[0];
  }

  /***** To Add Resource ******/ 
  addResource() {
    this.loading = true;
    if(this.type != 'youtube') {
      let formData = new FormData();
      formData.append("id", "");
      formData.append("title", this.title);
      formData.append("type_1", this.type);
      formData.append("files", this.file);

      this.httpClient.post<any>('http://172.105.61.17:3001/links', formData).subscribe(
         (res) => {
           console.log(res);
           this.loading = false;
           if (res.status_code == 200) {
              this.btnClose.nativeElement.click();
              this.getAllResources();
           }
         },
         (err) => {
            this.loading = false;
            console.log(err)
         } 
      );    
    } else {
      let formData = new FormData();
      formData.append("id", "");
      formData.append("title", this.title);
      formData.append("type_1", this.type);
      formData.append("url", this.url);
      formData.append("thumbnail", this.thumbnail);

      this.httpClient.post<any>('http://172.105.61.17:3001/links', formData).subscribe(
         (res) => {
           console.log(res);
           this.loading = false;
           if (res.status_code == 200) {
              this.btnClose.nativeElement.click();
              this.getAllResources();
           }
           console.log(res);
         },
         (err) => {
            this.loading = false;
            console.log(err)
         } 
      );    
    }
  }

  /***** To Set Default For Edit Resource ******/ 
  edit_resource(id: string) {
    this.editId = id;
    this.editResource = this.allResources.find(x => x.id == this.editId);
    this.editTitle = this.editResource.title;
    this.editType = this.editResource.type_1;
    if(this.editType != 'youtube') {
      this.editUrl = this.editResource.links;
    } else {
      this.editUrl = this.editResource.url;
    }
    

    if(this.editType == 'image') {
      this.isEditTypeImage = true;
      this.isEditTypeVideo = false;
      this.isEditTypeDocument = false;
    }
    if(this.editType == 'document') {
      this.isEditTypeDocument = true;
      this.isEditTypeImage = false;
      this.isEditTypeVideo = false;
    }
    if(this.editType == 'youtube') {
      this.isEditTypeVideo = true;
      this.isEditTypeImage = false;
      this.isEditTypeDocument = false;
    }
  }

  /***** To Update Resource ******/ 
  updateResource() {
    this.editLoading = true;
    if(this.editType != 'youtube') {
      let formData = new FormData();
      formData.append("id", this.editId);
      formData.append("title", this.editTitle);
      formData.append("type_1", this.editType);
      formData.append("files", this.editFile);

      this.httpClient.post<any>('http://172.105.61.17:3001/links', formData).subscribe(
         (res) => {
           this.editLoading = false;
           console.log(res);
           this.loading = false;
           if (res.status_code == 200) {
              this.btnEditClose.nativeElement.click();
              this.getAllResources();
           }
         },
         (err) => {
           this.editLoading = false;
            this.loading = false;
            console.log(err)
         } 
      );    
    } else {
      let formData = new FormData();
      formData.append("id", this.editId);
      formData.append("title", this.editTitle);
      formData.append("type_1", this.editType);
      formData.append("url", this.editUrl);
      formData.append("thumbnail", this.editThumbnail);

      this.httpClient.post<any>('http://172.105.61.17:3001/links', formData).subscribe(
         (res) => {
           console.log(res);
           this.loading = false;
           if (res.status_code == 200) {
              this.btnEditClose.nativeElement.click();
              this.getAllResources();
           }
           console.log(res);
         },
         (err) => {
            this.loading = false;
            console.log(err)
         } 
      );    
    }
  }

  /***** To Delete Resource ******/ 
  deleteResource(id: string) {
    this.deleteId = id;
    this.btnDelete.nativeElement.click();
  }

  /***** To Get Confirmation For Delete ******/ 
  confirmDeleteResource() {
    let payload = { "id": this.deleteId }
      let servicePath = this.utils.getApiConfigs("delete_link");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
        .then((res: any) => {
          console.log(res);
          if (res.status_code == 200) {
           this.getAllResources();
           this.btnCloseDelete.nativeElement.click();
          }
        });
  }
}