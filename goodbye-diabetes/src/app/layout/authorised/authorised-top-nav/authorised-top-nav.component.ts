import { Component, OnInit, NgZone } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ApilistService } from 'src/app/services/apilist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorised-top-nav',
  templateUrl: './authorised-top-nav.component.html',
  styleUrls: ['./authorised-top-nav.component.scss']
})
export class AuthorisedTopNavComponent implements OnInit {
  topImage: any;
  isDataAvailable: boolean = false;
  admin_name: any;

  constructor(public utils: ApilistService, public commonservice: CommonService, private ngzone: NgZone, public router: Router) { }

  /**
   * component load initial method
   * display user name on top of the page
   */
  ngOnInit() { 
    this.navadminData();
   }
  navadminData() {
    this.ngzone.run(() => {
      this.isDataAvailable = true;
    })
    // let servicePath = this.utils.getApiConfigs("getUser");
    // this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
    //   .then((data: any) => {
    //     if (data.payload.status = 200) {
    //       this.admin_name = data.payload.message[0].name;
    //       this.isDataAvailable = true;
    //     }
    //   });
  }
}