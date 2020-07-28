import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }]
})
export class UsersComponent implements OnInit {
  fileName: string;
  filePreview: string;
  allUserData: any;
  tempUserData: any;
  reportList: any;
  healthList: any;
  portalReport: any;
  noData: boolean = false;
  list: boolean = true;
  userProfile: any;
  user_available: boolean;
  display: any = 'none';
  image: any;
  img_avail: boolean;
  select_user: any;
  select_user_id: string;
  report_avail: boolean;
  health_avail: boolean;
  portal_report_avail: boolean;
  isShow: boolean;
  userReports: any;
  inpNotes: string;
  portalTable: boolean = true;
  healthDay: string;
  daysList = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13', 'Day 14', 'Day 15', 'Day 16', 'Day 17', 'Day 18', 'Day 19', 'Day 20', 'Day 21', 'Day 22', 'Day 23']
  notes_list: any;
  notes: boolean = false;
  getId: any;
  isImage: boolean = false;
  userImage: any;
  constructor(public router: Router, private sanitizer: DomSanitizer, public utils: ApilistService, private commonservice: CommonService) {
    let logged = sessionStorage.getItem('logged');
    if(logged != '1') {
      this.router.navigate(['/signin']);
    }
   }

  ngOnInit() {
    this.isShow = false;
    this.getAllUser();
  }

  /***** To Show Single User ******/ 
  viewUser(user) {
    this.isShow = true;
  }

  /***** To Capture File ******/ 
  onFileChanged(event: { target: { files: any[]; }; }) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileName = file.name + " " + file.type;
        const base64ImgString = (reader.result as string).split(',')[1];
        this.filePreview = 'data:application/pdf' + ';base64,' + base64ImgString;
      };
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  /***** To Show All Users View ******/ 
  user_list() {
    this.isShow = false;
    this.list = true;
    this.getAllUser();
  }

  date_format(date) {
    return moment(date).format('DD-MM-YYYY')
  }

  /***** To List All Users ******/ 
  getAllUser() {
    let servicePath = this.utils.getApiConfigs("user_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allUserData = res.data;
            this.allUserData = this.allUserData.reverse();
            this.tempUserData = this.allUserData;
          }
        }
      });
  }

  /***** To Search Users ******/ 
  onSearchChange(searchValue: string): void {
    searchValue = searchValue.toLocaleLowerCase();
    let tempData = this.allUserData; 
    this.tempUserData = [];
    if(searchValue != '') {
      tempData.forEach(element => {
        let username = element.user_name.toLocaleLowerCase();
        let id = element.patient_id.toLocaleLowerCase();
        let phone_num = ("+?"+element.phone_num).toLocaleLowerCase();
        if((username.indexOf(searchValue) !== -1) || (id.indexOf(searchValue) != -1) || (phone_num.indexOf(searchValue) != -1))
        {
          this.tempUserData.push(element);
        }      
      });
    } else {
      this.tempUserData = this.allUserData;
    }
  }

  /***** To Navigate Single User View ******/ 
  view_user(user) {
    this.router.navigate(['/viewuser', user]);
  }

 
}