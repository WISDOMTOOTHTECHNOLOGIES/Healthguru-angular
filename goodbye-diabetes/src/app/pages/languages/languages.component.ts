import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  noLanguage: boolean = true;
  allLanguages: any;

  language: string = "";
  editLanguage: string;

  deleteId: string;

  @ViewChild('btnDelete') btnDelete: ElementRef; 
  @ViewChild('btnCloseDelete') btnCloseDelete: ElementRef; 

  constructor(public router: Router, private sanitizer: DomSanitizer, public utils: ApilistService, private commonservice: CommonService) {
    let logged = sessionStorage.getItem('logged');
    if(logged != '1') {
      this.router.navigate(['/signin']);
    }
   }

  ngOnInit() {
    this.noLanguage = false;
    this.fetchLanguages();
  }

  /***** To List All Languages ******/ 
  fetchLanguages() {
    this.allLanguages = [];
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

  /***** To Add Language ******/ 
  addLanguages() {
    if(this.language != "") {
      let payload = { "language":this.language }
      let servicePath = this.utils.getApiConfigs("add_language");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res); 
        if (res.status_code == 200) {
          this.fetchLanguages();
        }
      });
    } else {
      alert("Language cannot be empty");
    }
  }

  /***** To Delete Language ******/ 
  deleteLanguage(language: string) {
    this.deleteId = language;
    this.btnDelete.nativeElement.click();
  }

  /***** To Get Confirm For Delete ******/ 
  confirmDeleteLanguage() {
    let payload = { "language": this.deleteId }
    let servicePath = this.utils.getApiConfigs("delete_language");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res); 
        if (res.status_code == 200) {
          this.btnCloseDelete.nativeElement.click();
          this.fetchLanguages();
        }
      });
  }

}
