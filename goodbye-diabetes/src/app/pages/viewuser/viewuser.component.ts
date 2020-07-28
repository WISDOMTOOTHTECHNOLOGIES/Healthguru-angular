import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient,HttpParams } from '@angular/common/http';
import { CommonService } from 'src/app/services/common.service';
import { ApilistService } from 'src/app/services/apilist.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.scss']
})
export class ViewuserComponent implements OnInit {

  select_user: any;

  fileName: string;
  filePreview: string;
  allUserData: any;
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
  select_user_id: string;
  report_avail: boolean;
  health_avail: boolean;
  portal_report_avail: boolean;
  isShow: boolean;
  userReports: any;
  inpNotes: string;
  portalTable: boolean = true;
  healthDay: string;
  //healthSelectDays = ['1Day', '2Day', '3Day', '4Day', '5Day', '6Day', '7Day', '8Day', '9Day', '10Day', '11Day', '12Day', '13Day', '14Day', '15Day', '16Day', '17Day', '18Day', '19Day', '20Day', '21Day', '22Day', '23Day', '24Day', '25Day', '26Day', '27Day', '28Day', '29Day', '30Day', '31Day', '32Day', '33Day', '34Day', '35Day', '36Day', '37Day', '38Day', '39Day', '40Day', '41Day', '42Day', '43Day', '44Day', '45Day', '46Day', '47Day', '48Day', '49Day', '50Day', '51Day', '52Day', '53Day', '54Day', '55Day', '56Day', '57Day', '58Day', '59Day', '60Day', '61Day', '62Day', '63Day', '64Day', '65Day', '66Day', '67Day', '68Day', '69Day', '70Day', '71Day', '72Day', '73Day', '74Day', '75Day', '76Day', '77Day', '78Day', '79Day', '80Day', '81Day', '82Day', '83Day', '84Day', '85Day', '86Day', '87Day', '88Day', '89Day', '90Day'];
  daysList = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10', 'Day 11', 'Day 12', 'Day 13', 'Day 14', 'Day 15', 'Day 16', 'Day 17', 'Day 18', 'Day 19', 'Day 20', 'Day 21', 'Day 22', 'Day 23']
  notes_list: any;
  notes: boolean = false;
  getId: any;
  isImage: boolean = false;
  userImage: any;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
     public utils: ApilistService,
      private commonservice: CommonService,
      public router: Router
    ) {
      let logged = sessionStorage.getItem('logged');
      if(logged != '1') {
        this.router.navigate(['/signin']);
      }
     }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.select_user = params['phone_num']; // (+) converts string 'id' to a number
   });
   this.getAllUser();
  }

  /***** To List User Details ******/ 
  getAllUser() {
    let servicePath = this.utils.getApiConfigs("user_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allUserData = res.data;
             this.getUser();
          }
        }
      });
      
    
  }

  /***** To Navigate To All Users ******/ 
  user_list(){
    this.router.navigate(['/Users']);
  }

  /***** To Get Single User Details ******/ 
  getUser(){
    this.list = false;
    this.isShow = true;
    this.select_user_id = this.allUserData.find(x => x.phone_num == this.select_user).patient_id;
    let payload = { "phone_num": this.select_user }
    let servicePath = this.utils.getApiConfigs("user_view");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.userProfile = res.data[0];
            this.user_available = true;
            this.userImage = res.data[0].user_image.split("/");
            if(!(this.userImage[this.userImage.length - 1] == 'null'))
            {
              console.log("Image available");
              this.isImage = true;
            }
            else{
              this.isImage = false;
            }
            //console.log(this.isImage);
            //console.log(res.data[0].user_image);
            this.get_health("1");
            this.get_user_reports();
            this.get_portal_report("0");
             //console.log("Single user->>", this.userProfile)
          }
        }
      });
  }

  /***** To Get Health Details Of User ******/ 
  get_health(days: string) {
    this.healthDay = days;
    this.get_notes();
    let payload = { "day": days, "phone_num": this.select_user };
    let servicePath = this.utils.getApiConfigs("get_health");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            console.log(res.data);
            this.healthList = res.data;
            this.health_avail = true;
          } else {
            this.health_avail = false;
            this.healthList = [];
          }
        } else {
          this.health_avail = false;
          this.healthList = [];
        }
      });
  }

  /***** To Get Notes ******/ 
  get_notes() {
    const payload = new HttpParams()
      .set('phone_num', this.select_user);
      //console.log(this.healthDay);
    let servicePath = this.utils.getApiConfigs("get_notes");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.notes= true;
            this.notes_list = res.data;
          } else {
            this.notes_list = [];
            this.notes = false;
          }
        } else {
          this.notes_list = [];
          this.notes = false;
        }
      });
  }

  /***** To Get User Reports ******/ 
  get_user_reports() {
    const payload = new HttpParams()
      .set('phone_num', this.select_user);
    let servicePath = this.utils.getApiConfigs("get_reports");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            //console.log(res.data);
            this.report_avail = true;
            this.userReports = res.data;
            //console.log(res.data);
            //console.log(this.userReports);
          } else {
            this.userReports = false;
            this.userReports = [];
          }
        } else {
          this.userReports = false;
          this.userReports = [];
        }
      });
  }

  /***** To Show Health For Selected Day ******/ 
  onHealthDayChange(value:string){
    this.get_health(value);
  }

  /***** To Show Report For Selected Day ******/ 
  onPortalReportDayChange(value:string) {
    this.get_portal_report(value);
  }

  /***** To Get User Report For All Days ******/ 
  get_report() {
    const payload = new HttpParams()
      .set('phone_num', this.select_user);
    let servicePath = this.utils.getApiConfigs("get_reports");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.report_avail = true;
            this.userReports = res.data;
          } else {
            this.report_avail = false;
            this.userReports = [];
          }
        } else {
          this.report_avail = false;
          this.userReports = [];
        }
      });
  }

  /***** To Show Report For Particular Day ******/ 
  get_portal_report(days: string) {
    const payload = new HttpParams()
      .set('phone_num', this.select_user)
      .set('day', days);
    let servicePath = this.utils.getApiConfigs("get_portal_report");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        //console.log("Portal Report :"+res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            console.log(res.data);
            this.portalReport = res.data;
            this.portal_report_avail = true;
          } else {
            console.log("No portal");
            this.portal_report_avail = false;
            this.portalReport = [];
          }
        } else {
          console.log("No portal 2");
          this.portal_report_avail = false;
          this.portalReport = [];
        }
      });
  }

  /***** To View File ******/ 
  open_file(file) {
    window.open(file);
  }

  onCloseHandled() {
    this.display = 'none';
  }
  
  openNoteModal() {
    this.inpNotes = "";
  }

  /***** To Open A Note ******/ 
  open_note(num) {
    if (this.getId == num) {
      this.getId = num + 100;
    } else {
      this.getId = num;
    }
  }

  /***** To Save Notes For The User ******/ 
  saveNotes() {
    let payload = { "id": this.select_user_id, "phone_num": this.select_user, "day": this.healthDay, "notes": this.inpNotes };
    let servicePath = this.utils.getApiConfigs("add_notes");
    console.log("id"+this.select_user_id+"phone"+this.select_user+"days"+this.healthDay+"notes"+this.inpNotes);
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          this.get_notes();
        } else {
          
        }
      });
  }

}
