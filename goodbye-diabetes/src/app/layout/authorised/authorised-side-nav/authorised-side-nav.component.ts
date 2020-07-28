import { Component, OnInit } from '@angular/core';
import { AuthorisedSideNavService } from '../services/authorised-side-nav.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { ApilistService } from 'src/app/services/apilist.service';
@Component({
  selector: 'app-authorised-side-nav',
  templateUrl: './authorised-side-nav.component.html',
  styleUrls: ['./authorised-side-nav.component.scss'],
})
export class AuthorisedSideNavComponent implements OnInit {
  public display = "none";
  selectedItem: any = "Users";
  constructor(public sideNavService: AuthorisedSideNavService,
    public commonservice: CommonService, public utils: ApilistService,
    public router: Router) { }

  ngOnInit() { } logout() { }
  listClick(item) {
    item = item.replace(/\s/g, "");
    this.selectedItem = item;
    let url = '/' + item + '';
    this.router.navigate([url])
  }

  isArray(obj : any ) {
    return Array.isArray(obj)
 }

}
