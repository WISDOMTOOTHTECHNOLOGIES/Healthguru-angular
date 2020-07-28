import { environment } from './../../environments/environment.prod';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApilistService } from './apilist.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class CommonService {
  authToken: any;
  apiUrl: string = environment.serverUrl;
  _showTour: any;
  // img_ip: string = environment.imgUrl;
  screenWidth: number = window.screen.width;
  mobileWidth: any;
  notify_count: number;
  message: any;
  chat_list: any = [];
  
  /**
   * set global value and return to the component
   * @param _showTour
   */
  set showTour(value: any) {
    this._showTour = value;
  }
  get showTour(): any {
    return this._showTour;
  }
  /**
   * Getting server url from production environment file
   * url's sholud be configured in production env file before taking production build
  */

  constructor(public http: HttpClient, public utils: ApilistService, public router: Router, private spinner: NgxSpinnerService) {
   
  }

  buildHeaders() {
    let headers;
    (localStorage.getItem("userDetails")) ? this.authToken = JSON.parse(localStorage.getItem("userDetails")) : this.authToken = "";
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authToken
    }; return headers;
  }

  /**
   * call invoke servce method from components
   * @param methodType 
   * @param path 
   * @param payload 
   */
  invokeService(methodType, path, payload) {
    if (methodType == 'GET') {
      return this.getMethod(path, payload);
    } else if (methodType == 'POST') {
      return this.postMethod(path, payload);
    } else if (methodType == 'PUT') {
      return this.putMethod(path, payload);
    } else if (methodType == 'DELETE') {
      return this.deleteMethod(path, payload);
    }
  }

  /**
   * call get method from the component
   * @param path 
   * @param payload 
   */
  getMethod(path, payload) {
    let payData = (payload) ? '?' + payload : '';
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/' + path + payData, { headers: this.buildHeaders() })
        .map((res) => res).subscribe((data) => {
          resolve(data);
        }, (err) => {
          console.log(err)
          this.spinner.hide();
        });
    });
  }

  /**
   * call post method from the component
   * @param path 
   * @param payload 
   */
  postMethod(path, payload) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + '/' + path, payload, { headers: this.buildHeaders() })
        .map((res: any) => res).subscribe((res) => {
          resolve(res);
        }, (err) => {
          console.log(err);
          this.spinner.hide();
        });
    });
  }

  /**
   * call put method from the component
   * @param path 
   * @param payload 
   */
  putMethod(path, payload) {
    return new Promise((resolve, reject) => {
      this.http.put(this.apiUrl + '/' + path, payload, { headers: this.buildHeaders() })
        .map((res: any) => res).subscribe((res) => {
          resolve(res);
        }, (err) => {
          this.spinner.hide();
        });
    });
  }
  /**
   * call delete method from the component
   * @param path 
   * @param payload 
   */
  deleteMethod(path, payload) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiUrl + '/' + path, { headers: this.buildHeaders() })
        .map((res: any) => res).subscribe((res) => {
          resolve(res);
        }, (err) => {
          this.spinner.hide();
        });
    });
  }

  /**
   * remove duplicate name from product JSON data
   * @param filtervalue 
   */
  removeDuplicate(filtervalue) {
    let unique = {};
    filtervalue.forEach(function (i) {
      if (!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }

  // Static Data Declaration
  public menuListItems = ["Users","Banner","Event", "Chat", ["CV19", "Volunteers", "Languages", "Broadcast"], "Videos", "Resources", "Doctors", ["Doctor Live", "Live", "Scheduled Upcoming Live"], "Settings", "Logout"]
}