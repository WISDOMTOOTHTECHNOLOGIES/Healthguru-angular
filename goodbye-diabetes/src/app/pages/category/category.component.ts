import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  allCategories: any;
  category: string = "";

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
    this.getAllCategories();
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

  /***** To Add A New Category ******/ 
  addCategory() {
    if(this.category != "") {
      let payload = { "category":this.category }
      let servicePath = this.utils.getApiConfigs("add_category");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
        .then((res: any) => {
          console.log(res);
          if (res.status_code == 200) {
            if (res.data.length > 0) {
              this.getAllCategories();
            }
          }
        });
    } else {
      alert("Name cannot be empty");
    }
  }

  /***** To Delete A Category ******/ 
  deleteCategory(id: string) {
    this.deleteId = id;
    this.btnDelete.nativeElement.click();
  }

  /***** To Get Confirmation For Delete ******/ 
  confirmDeleteCategory() {
    let payload = { "id": this.deleteId }
      let servicePath = this.utils.getApiConfigs("delete_category");
      this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
        .then((res: any) => {
          console.log(res);
          if (res.status_code == 200) {
            this.btnCloseDelete.nativeElement.click();
           this.getAllCategories();
          }
        });
  }

  /***** Navigate Back ******/ 
  onBack() {
    this.router.navigate(['/Videos']);
  }

}
