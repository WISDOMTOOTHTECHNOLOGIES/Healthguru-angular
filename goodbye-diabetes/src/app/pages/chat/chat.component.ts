import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient,HttpParams } from '@angular/common/http';
import { CommonService } from 'src/app/services/common.service';
import { ApilistService } from 'src/app/services/apilist.service';
import { ChatService } from 'src/app/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  allUserData: any;
  allChatData: any;
  searchUserData: any = [];
  searchAllUserData: any = [];
  chatUsers: any = [];
  listUsers: any = [];
  subscription: any;

  chatUsersList: boolean = true;
  allUsersList: boolean = false;

  constructor(public router: Router, public utils: ApilistService, private commonservice: CommonService,
    public chatservice: ChatService) {
      let logged = sessionStorage.getItem('logged');
      if(logged != '1') {
        this.router.navigate(['/signin']);
      }
       this.chatservice.login();
     }

  ngOnInit() {
    this.subscription = this.chatservice.notifyMessage().subscribe(item => this.recievedMessage(item));
    this.getAllUser(); 
  }

  /***** To Capture A Message Recieved ******/ 
  recievedMessage(messages) {
    let tempData: any = [];
    let servicePath = this.utils.getApiConfigs("chat_users");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            res.data.forEach(element => {
              let phone = element.sender;
              phone = phone.split("@");
              phone = phone[0];
              let date = element.date;
              
              let totalCount = 0;
              totalCount = element.count;
              let readCount = 0;

              const payload = new HttpParams()
              .set('phone_num', phone);
              let servicePath = this.utils.getApiConfigs("get_message_count");
              this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
              .then((res: any) => {
                 if (res.status_code == 200) {
                   if (res.data.length > 0) {
                      readCount = res.data[0].message_count;
                    }
                    let unreadmsg = totalCount - readCount;
                    let type = element.type;
                    let message = element.message[0];
                    let userdetail = this.allUserData.find(x => x.phone_num == phone);
                    var user = {
                      user_name: userdetail.user_name,
                      image_path: userdetail.image_path,
                      user_image: userdetail.user_image,
                      phone_num: phone,
                      type: type,
                      count: totalCount,
                      unread_msg: unreadmsg,
                      message: message
                    }
                    console.log("Sender---------------->"+user.phone_num);
                    tempData.push(user);
                  }
                });
            });
            this.searchUserData = tempData;
            this.allChatData = this.searchUserData;
          }
        }
      });
  }

  /***** To List All Users List ******/ 
  getAllUser() {
    let servicePath = this.utils.getApiConfigs("user_list");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allUserData = res.data;
            this.searchAllUserData = this.allUserData;
            this.getChatUsers();
          }
        }
      });
  }

  /***** To List All chat Users ******/ 
  getChatUsers() {
    let servicePath = this.utils.getApiConfigs("chat_users");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, "")
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            res.data.forEach(element => {
              let phone = element.sender;
              phone = phone.split("@");
              phone = phone[0];
              let date = element.date;
              let totalCount = 0;
              totalCount = element.count;
              let readCount = 0;

              const payload = new HttpParams()
              .set('phone_num', phone);
              let servicePath = this.utils.getApiConfigs("get_message_count");
              this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
              .then((res: any) => {
                 if (res.status_code == 200) {
                   if (res.data.length > 0) {
                      readCount = res.data[0].message_count;
                    }
                    let unreadmsg = totalCount - readCount;
                    let type = element.type;
                    let message = element.message[0];
                    let userdetail = this.allUserData.find(x => x.phone_num == phone);
                    var user = {
                      user_name: userdetail.user_name,
                      image_path: userdetail.image_path,
                      user_image: userdetail.user_image,
                      phone_num: phone,
                      type: type,
                      count: totalCount,
                      unread_msg: unreadmsg,
                      message: message
                    }
                    this.searchUserData.push(user); 
                  }
                });
              });
              this.allChatData = this.searchUserData;
            }
          }
        });
  }

  /***** To Navigate Particular User Chat ******/ 
  user_chat(userPhone, count) {
    let payload = { "phone_num":userPhone, "message_count": count }
    let servicePath = this.utils.getApiConfigs("update_message_count");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          this.router.navigate(['/Chat_view', userPhone]);
        }
      });
  }

  /***** To Search User ******/ 
  onSearchChange(searchValue: string): void {  
    searchValue = searchValue.toLocaleLowerCase();
    let tempData = this.allChatData;
    this.searchUserData = [];
    if(searchValue != '') {
      tempData.forEach(element => {
        let elementValue = element.user_name.toLocaleLowerCase();
        if(elementValue.indexOf(searchValue) !== -1)
        {
          this.searchUserData.push(element);
        }      
      });
    } else {
      this.searchUserData = this.allChatData;
    }
    
  }

  /***** To Search User ******/ 
  onSearchAllUsersChange(searchValue: string): void {  
    searchValue = searchValue.toLocaleLowerCase();
    let tempData = this.allUserData;
    this.searchAllUserData = [];
    if(searchValue != '') {
      tempData.forEach(element => {
        let elementValue = element.user_name.toLocaleLowerCase();
        if(elementValue.indexOf(searchValue) !== -1)
        {
          this.searchAllUserData.push(element);
        }      
      });
    } else {
      this.searchAllUserData = this.allChatData;
    }
    
  }

  /***** To Show All User Screen  ******/ 
  showAllUsers() {
    this.chatUsersList = false;
    this.allUsersList = true;
  }

  /***** To Show Chat User Screen  ******/ 
  showChatUsers() {
    this.allUsersList = false;
    this.chatUsersList = true;
  }

}
