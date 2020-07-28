import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import {NgForm, FormControl} from '@angular/forms';
import { stringify } from 'querystring'

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  display='none';

  allBanners : any;
  editBanner: any;
  title: string;
  image_link: string;
  image: any = [];
  updateTitle: string;
  updateImage: any = [];
  updateImage_link: string;


  file: string;
  editFile: string;
  fileName: string;
  //filePreview: string;
  //editFileName: string;
  //editFilePreview: string;
  
  constructor(public router: Router, private sanitizer: DomSanitizer, public utils: ApilistService, private commonservice: CommonService) {
    let logged = sessionStorage.getItem('logged');
    if(logged != '1') {
      this.router.navigate(['/signin']);
    }
   }

  ngOnInit() {
    this.getAllBanners();
  }

  /***** To Capture A File On Add Banner ******/ 
  onAddFileChanged(event: { target: { files: any[]; }; }) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileName = file.name + " " + file.type;
        const base64ImgString = (reader.result as string).split(',')[1];
        this.image.push(base64ImgString);
      };
    }
  }

  /***** To Capture A File On Edit Banner ******/ 
  onEditFileChanged(event: { target: { files: any[]; }; }) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.updateImage.push(reader.result);
      };
    }
  }

  /***** To List All Banners ******/ 
  getAllBanners() {
    let servicePath = this.utils.getApiConfigs("banner_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allBanners = res.data;
          }
        }
      });
  }

  /***** To Set Default Values For Edit Banner ******/ 
  edit_banner(id) {
    this.editBanner = this.allBanners.find(x =>  x.id == id);
  }

  /***** To Update Banner ******/ 
  updateBanner(){
    let payload = { "id":this.editBanner.id, "upload_1": this.updateImage, "url": this.updateImage_link }
    console.log(payload);
    let servicePath = this.utils.getApiConfigs("update_banner");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.display='none';
            this.getAllBanners();
          }
        }
      });
  }
}