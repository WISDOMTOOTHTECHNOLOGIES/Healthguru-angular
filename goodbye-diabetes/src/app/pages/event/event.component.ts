import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  display='none';

  allEvents : any;
  editEvent: any;
  image_link: string;
  image: any = [];
  updateTitle: string;
  updateImage: any = [];
  updateImage_link: string;


  file: string;
  editFile: string;
  fileName: string;

  constructor(public router: Router, private sanitizer: DomSanitizer, public utils: ApilistService, private commonservice: CommonService) {
    let logged = sessionStorage.getItem('logged');
    if(logged != '1') {
      this.router.navigate(['/signin']);
    }
   }

  ngOnInit() {
    this.getAllEvents();
  }

  /***** To Capture File On Add Event ******/ 
  onAddFileChanged(event: { target: { files: any[]; }; }) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image.push(reader.result);
      };
    }
  }

  /***** To Capture File On Edit Event ******/ 
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

  /***** To Set Default For Edit Event ******/ 
  edit_event(id) {
    this.display='block';
    this.editEvent = this.allEvents.find(x =>  x.id == id);
  }

  /***** To List All Events ******/ 
  getAllEvents() {
    let servicePath = this.utils.getApiConfigs("event_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allEvents = res.data;
             console.log("all banner->>", this.allEvents)
          }
        }
      });
  }

  /***** To Update Event ******/ 
  updateEvent(){
    let payload = { "id":this.editEvent.id, "upload_1": this.updateImage, "url": this.updateImage_link }
    console.log(payload);
    let servicePath = this.utils.getApiConfigs("update_event");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.getAllEvents();
          }
        }
      });
  }

}