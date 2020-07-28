import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  loading: boolean = false;
  title: string;
  category: string = "";
  age: string;
  indianPrice: string;
  internationalPrice: string;
  subscriptionDays: string;
  type: string = "";
  thumbnail: any;
  video: any;

  editVideo: any;

  editId: string;
  editTitle: string;
  editCategory: string;
  editAge: string;
  editIndianPrice: string;
  editInternationalPrice: string;
  editSubscriptionDays: string;
  editType: string;
  editThumbnail: any;
  editVideoFile: any;
  allCategories: any;
  allVideos: any;

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
    this.getAllCategories();
    this.getAllVideos();
  }

  /***** To List All Categories ******/ 
  getAllCategories() {
    let servicePath = this.utils.getApiConfigs("category_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allCategories = res.data;
          }
        }
      });
  }

  /***** To Navigate To Categories ******/ 
  openCategory() {
    this.router.navigate(['/Category']);
  }

  /***** To List All Videos ******/ 
  getAllVideos() {
    let servicePath = this.utils.getApiConfigs("videos_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allVideos = res.data;
            this.allVideos = this.allVideos.reverse();
          }
        }
      });
  }

  /***** To Delete Videoo ******/ 
  deleteVideo(id: string) {
    this.deleteId = id;
    this.btnDelete.nativeElement.click();
  }

  /***** To Delete Video ******/ 
  confirmDeleteVideo() {
    let payload = { "id": this.deleteId }
      let servicePath = this.utils.getApiConfigs("delete_video");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
        .then((res: any) => {
          console.log(res);
          if (res.status_code == 200) {
           this.getAllVideos();
           this.btnCloseDelete.nativeElement.click();
          }
        });
  }

  /***** To Capture Thumbnail For Add Video ******/ 
  onThumbnailFileChanged(event: { target: { files: any[]; }; }) {
    this.thumbnail = event.target.files[0];
  }

  /***** To Capture Thumbnail For Edit Video ******/ 
  onThumbnailEditFileChanged(event: { target: { files: any[]; }; }) {
    this.editThumbnail = event.target.files[0];
  }

  /***** To Capture Video For Add Video ******/ 
  onVideoFileChanged(event: { target: { files: any[]; }; }) {
    this.video = event.target.files[0];
  }

  /***** To Capture Video For Edit Video ******/ 
  onVideoEditFileChanged(event: { target: { files: any[]; }; }) {
    this.editVideoFile = event.target.files[0];
  }

  /***** To Add Video ******/ 
  addVideo() {
    this.loading = true;
    if(!this.title) {
      this.title = "";
    }
    if(!this.age) {
      this.age = "0";
    }
    if(!this.indianPrice) {
      this.indianPrice = "0.00";
    }
    if(!this.internationalPrice) {
      this.internationalPrice = "0.00";
    }
    if(!this.subscriptionDays) {
      this.subscriptionDays = "0";
    }
    let formData = new FormData();
    formData.append("id", "");
    formData.append("filename", this.title);
    formData.append("category", this.category);
    formData.append("sub_days", this.subscriptionDays);
    formData.append("age", this.age);
    formData.append("price", this.indianPrice);
    formData.append("price_other", this.internationalPrice);
    formData.append("type", this.type);
    formData.append("image", this.thumbnail);
    formData.append("video", this.video);

    this.httpClient.post<any>('http://172.105.61.17:3001/subvideo', formData).subscribe(
      (res) => {
        this.loading = false;
        if (res.status_code == 200) {
          this.btnClose.nativeElement.click();
          this.getAllVideos();
        }
        console.log(res);
      },
      (err) => {
        this.loading = false;
        console.log(err)
      } 
    );    
  }

  /***** To Set Default Values For Edit Video ******/ 
  edit_video(id: string) {
    this.editId = id;
    this.editVideo = this.allVideos.find(x => x.id == this.editId);
    this.editTitle = this.editVideo.filename;
    this.editCategory = this.editVideo.category;
    this.editAge = this.editVideo.age;
    this.editType = this.editVideo.type;
    this.editIndianPrice = this.editVideo.price;
    this.editInternationalPrice = this.editVideo.price_other;
    this.editSubscriptionDays = this.editVideo.subscription_days;
  }

  /***** To Update Video ******/ 
  updateVideo() {
    this.loading = true;
    if(this.editTitle == "undefined") {
      this.editTitle = "0";
    }
    if(this.editAge == 'undefined') {
      this.editAge = "0";
    }
    if(this.editIndianPrice == 'undefined') {
      this.editIndianPrice = "0.00";
    }
    if(this.editInternationalPrice == "undefined") {
      this.editInternationalPrice = "0.00";
    }
    if(this.editSubscriptionDays == "undefined") {
      this.editSubscriptionDays = "0";
    }
    let formData = new FormData();
    formData.append("id", this.editId);
    formData.append("filename", this.editTitle);
    formData.append("category", this.editCategory);
    formData.append("sub_days", this.editSubscriptionDays);
    formData.append("age", this.editAge);
    formData.append("price", this.editIndianPrice);
    formData.append("price_other", this.editInternationalPrice);
    formData.append("type", this.editType);
    formData.append("image", this.editThumbnail);
    formData.append("video", this.editVideo);

    this.httpClient.post<any>('http://172.105.61.17:3001/subvideo', formData).subscribe(
      (res) => {
        this.loading = false;
        if (res.status_code == 200) {
          this.btnEditClose.nativeElement.click();
          this.getAllVideos();
        }
        console.log(res);
      },
      (err) => {
        this.loading = false;
        console.log(err)
      } 
    );
  }

  closeAddModal() {
    //this.modalService.close("addVideoModal");
  }
}