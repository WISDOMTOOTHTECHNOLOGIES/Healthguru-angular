import { Injectable, NgZone } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorisedSideNavService {
  hideSideNav: boolean = true;

  constructor(private commonservice: CommonService, public ngzone: NgZone) { }

  toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
  }
  leaveSideNav(): void {
    this.hideSideNav = true;
  }
}
