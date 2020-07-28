import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApilistService } from '../../services/apilist.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient,HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { ChatService } from '../../chat.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})

export class BroadcastComponent implements OnInit {

  allMessages: any = [];
  adminNum: string = "1234567890"; 
  allUsers: any = [];
  message: string = '';
  link: string = '';
  file: string = '';
  fileType: string = '';
  uploadImage: any = [];

  constructor(
    public router: Router,
    private sanitizer: DomSanitizer,
    public utils: ApilistService,
    public commonservice: CommonService,
    private route: ActivatedRoute,
    public chatservice: ChatService) { 
      let logged = sessionStorage.getItem('logged');
      if(logged != '1') {
        this.router.navigate(['/signin']);
      }
    this.chatservice.login();

  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  ngOnInit() {
    this.fetchUsers();
    this.fetchBroadcasts();
  }

  /***** To Fetch All Users List ******/ 
  fetchUsers() {
    let servicePath = this.utils.getApiConfigs("user_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            res.data.forEach(element => {
              this.allUsers.push(element.phone_num);
            });
          }
        }
      });
  }

  /***** To Fetch All Broadcast Messages ******/ 
  fetchBroadcasts() {
    let servicePath = this.utils.getApiConfigs("broadcast_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            let datas = res.data;
            datas.forEach(element => {
              let data =  JSON.parse(element.message);
              let content = data.message;
              var message = {
                message: content.message,
                file: content.file,
                file_type: content.file_type,
                link: content.link,
                date: data.time
              }
              this.allMessages.push(message);
            });
            this.allMessages = this.allMessages.reverse();
            console.log("all messages->>", this.allMessages)
          }
        }
      });
  }

  /***** To Open A Broadcast Modal ******/ 
  openBroadcast() {
    this.message = "";
    this.link = "";
    this.file = "";
    this.fileType = "";
  }

  /***** To Select A Broadcast File ******/ 
  selectFile() {
    let element : HTMLElement  = document.getElementById("inpFile");
    element.click();
  }

  /***** To Capture A File Selected ******/ 
  onFileChanged(event: { target: { files: any[]; }; }) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        //console.log("File Selected :"+reader.result);
        //this.updateImage.push(reader.result);
        this.uploadImage = [];
        this.uploadImage.push(reader.result);
        this.uploadFile();
        //this.uploadFile(reader.result);
        
      };
    }
  }

  /***** To Upload A File To Server ******/ 
  uploadFile(){
    let payload = { "phone_num":this.adminNum, "upload_1": this.uploadImage }
    console.log(payload);
    let servicePath = this.utils.getApiConfigs("upload_chat_image");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            console.log(res.data[0].mime_type);
            let mime = res.data[0].mime_type;
            mime = mime.split("/");
            this.fileType = mime[0];
            if(mime[0] == 'application') {
              this.fileType = 'pdf';
            }

            console.log("file_type--------------------"+this.fileType);
            this.file = res.data[0].upload_1;
            console.log("file---------------------"+this.file);
          }
        }
      });
  }

  /***** To Send Broadcast Message ******/ 
  sendMessage() {
    if(this.fileType == '') {
      this.fileType = 'message';
    }

    var content = {
      message: this.message,
      link: this.link,
      file: this.file,
      file_type: this.fileType
    }
    var message = {
      username: this.adminNum,
      message: content,
      time: new Date(),
      type: "broadcast",
      name: 'admin',
      image: './assets/logo.png'
    };
    
    if(this.fileType == 'message' && this.message == '') {
      return;
    }
    
    this.allUsers.forEach(element => {
      this.chatservice.sendMessage(message, element);
    });
    
    this.message = '';
    this.link = '';
    this.file = '';
    this.fileType = '';
    this.uploadImage = [];

    var broadcast = {
      message: content.message,
      file: content.file,
      file_type: content.file_type,
      link: content.link,
      date: new Date()
    }

    this.allMessages.unshift(broadcast);
      
    
  }

  /***** To Open A File On A New Window ******/ 
  viewFile(path: string){
    window.open(path);
  }

}
