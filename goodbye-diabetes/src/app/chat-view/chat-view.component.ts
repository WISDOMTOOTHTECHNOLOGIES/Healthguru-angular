import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { CommonService } from '../services/common.service';
import { ApilistService } from '../services/apilist.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient,HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { ChatService } from '../chat.service';
import { ActivatedRoute } from '@angular/router';
import * as RecordRTC from 'recordrtc';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { isRootView } from '@angular/core/src/render3/util';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.scss']
})
export class ChatViewComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  user_num: any;
  userProfile: any;
  user_available: boolean;
  user_resources: any;
  sendMsg: any;
  reportList: any;
  report_avail: boolean;
  select_user: any;
  chat_message:string = "";
  uploadImage: any = [];
  uploadUrl: string;
  uploadType: any;
  healthList: any;
  allMessages: any = [];
  dateMessages: any = [];
  adminNum: string = "1234567890";
  user_name: string = "-";
  patient_id: string = "-";
  user_age: string = "-";
  user_gender: string = "-";
  user_country: string = "-";
  user_phone: string = "-";
  user_email: string = "-";
  user_image: string = "-";
  user_joiningdate = "-";
  user_patient_type: string = "-";
  healthDay: string;
  health_avail: boolean;
  chat_files_audio: any = [];
  chat_files_document: any = [];
  chat_files_images: any = [];
  notes_list: any;
  notes: boolean = false;
  subscription: any;
  capturedImage: any = [];
  capturedVoice: any = [];

  thumbnailVideo: string;

  linkTypes: string = "images";
  isImages: boolean = true;
  isDocuments: boolean = false;
  isVideos: boolean = false;
  isYoutubeVideos = false;

  allImages: any;
  allVideos: any;
  allDocuments: any;
  allYoutubes: any;


  constraints = {
    video: {
        facingMode: "environment",
        width: { ideal: 4096 },
        height: { ideal: 2160 }
      }
    };
  imageCaptured: boolean = false;
  voiceRecorded: boolean = false;
  @ViewChild('video') videoElement: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  videoWidth = 0;
  videoHeight = 0;

  //Lets initiate Record OBJ
  private record;
  //Will use this flag for detect recording
  private recording = false;
  //Url of Blob
  private url;
  private error;

  constructor(
    public router: Router,
    private sanitizer: DomSanitizer,
    public utils: ApilistService,
    public commonservice: CommonService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
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
    this.myScrollContainer.nativeElement.scrollIntoView(false);
    this.route.params.subscribe(params => {
       this.user_num = params['phone_num']; // (+) converts string 'id' to a number

       this.subscription = this.chatservice.notifyMessage().subscribe(item => this.recievedMessage(item));

       //this.subscription = this.chatservice.notifyMessage().subscribe(item => this.recievedMessage(item));
 
       // In a real app: dispatch action to load the details here.
    });

    //this.user_num = this.commonservice.showTour;
    if (this.user_num) {
      this.view_user(this.user_num);
      this.fetchMessages();
      this.get_resources();
      
    }
    setTimeout(() => {
      this.scrollToBottom();
    });
    // this.commonservice.init_load();
    this.fetchFiles();
    this.get_notes();
    this.get_health("1");
    this.fetchImageLinks();
    this.fetchDocumentLinks();
    this.fetchAppVideoLinks();
    this.fetchYoutubeVideos();
  }


  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  /***** To List All Resources Images Links ******/ 
  fetchImageLinks() {
    let payload = { "type_1": "image" };
    let servicePath = this.utils.getApiConfigs("get_links_type");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        //console.log("Image Links :"+res.data);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allImages = res.data;
            this.allImages = this.allImages.reverse();
          } 
        } 
      });
  }

  /***** To List All Resources Document Links ******/ 
  fetchDocumentLinks() {
    let payload = { "type_1": "document" };
    let servicePath = this.utils.getApiConfigs("get_links_type");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        //console.log("Document Links :"+res.data);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allDocuments = res.data;
            this.allDocuments = this.allDocuments.reverse();
          } 
        } 
      });
  }

  /***** To List All Resources Video Links ******/ 
  fetchAppVideoLinks() {
    let payload = { "type_1": "video" };
    let servicePath = this.utils.getApiConfigs("get_links_type");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        //console.log("App Videos :"+JSON.stringify(res.data));
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allVideos = res.data;
            this.allVideos = this.allVideos.reverse();
          } 
        } 
      });
  }

  /***** To List All Resources Youtube Links ******/ 
  fetchYoutubeVideos() {
    let payload = { "type_1": "youtube" };
    let servicePath = this.utils.getApiConfigs("get_links_type");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        //console.log("Youtube Links :"+JSON.stringify(res.data));
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.allYoutubes = res.data;
            this.allYoutubes = this.allYoutubes.reverse();
          } 
        } 
      });
  }

  /***** Update Chat List When User Recieves Message ******/ 
  recievedMessage(messages){
    if(messages.username == this.user_num)
    {
      this.fetchMessages();
    }
  }

  /***** To Show Resource List Based On Type Selected ******/ 
  onTypeChange(value) {
    if(value == 'images') {
      this.isImages = true;
      this.isDocuments = false;
      this.isVideos = false;
      this.isYoutubeVideos = false;
    }

    if(value == 'documents') {
      this.isDocuments = true;
      this.isImages = false;
      this.isVideos = false;
      this.isYoutubeVideos = false;
    }

    if(value == 'videos') {
      this.isVideos = true;
      this.isImages = false;
      this.isDocuments = false;
      this.isYoutubeVideos = false;
    }

    if(value == 'youtubeVideos') {
      this.isYoutubeVideos = true;
      this.isImages = false;
      this.isDocuments = false;
      this.isVideos = false;
    }
  }

  /***** To List Notes ******/ 
  get_notes() {
    const payload = new HttpParams()
      .set('phone_num', this.user_num);
      //console.log(this.healthDay);
    let servicePath = this.utils.getApiConfigs("get_notes");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        //console.log("Notes :"+res.status_code);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            //this.notes_list = true;
            this.notes= true;
            this.notes_list = res.data;
            //console.log(res.data);
            //console.log(this.userReports);
          } else {
            this.notes_list = [];
            this.notes = false;
          }
        } else {
          this.notes_list = [];
          this.notes = false;
        }
      });
      //console.log(this.notes_list);
  }

  /***** To List All Files ******/ 
  fetchFiles(){
    let payload = { "phone_num" : this.user_num }
    let servicePath = this.utils.getApiConfigs("get_message_files");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            res.data.forEach(element => {
              let type = element.mime_type.split("/");
              type = type[0];
              if(type == 'audio')
              {
                this.chat_files_audio.push(element);
              }
              else if(type == 'image')
              {
                this.chat_files_images.push(element);
              }
              else if(type == 'application')
              {
                this.chat_files_document.push(element);
              }       
            });
            //console.log("Audio  ==>  "+this.chat_files_audio);
            //console.log("all messages->>", this.allMessages)
          }
        }
      });
  }

  /***** To List All Old Messages ******/ 
  fetchMessagesold() {
    let payload = { "fromJID" : "admin_healthguru@172.105.61.17", "toJID":this.user_num+"@172.105.61.17" }
    let servicePath = this.utils.getApiConfigs("get_messages");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            let datas = res.data;
            datas.forEach(element => {
            let data =  JSON.parse(element.body);
            this.allMessages.push(data);
            });
            console.log("All messages------>"+ JSON.stringify(this.allMessages));
          }
        }
      });
  }

  /***** To Get New Message ******/ 
  fetchMessages() {
    let payload = { "fromJID" : "admin_healthguru@172.105.61.17", "toJID":this.user_num+"@172.105.61.17" }
    let servicePath = this.utils.getApiConfigs("get_messages");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
        .then((res: any) => {
           if (res.status_code == 200) {
              if (res.data.length > 0) {
                 let datas = res.data;
                    datas.forEach(element => {

                      let data =  JSON.parse(element.body);
                      //console.log('Each Message------>'+JSON.stringify(data));

                      let singleMessage = [];


                      let newDate = new Date(data.time);
                      //console.log(formatDate(data.time, 'yyyy-MM-dd', 'en-US'));
                      this.allMessages.push(data);
                    });
                    //console.log("All messages------>"+ JSON.stringify(this.allMessages));
                  }  
            }
          });
  }

  /***** To Show User Details ******/ 
  view_user(user) {
    let payload = { "phone_num": user }
    let servicePath = this.utils.getApiConfigs("user_view");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            console.log(res);
            this.userProfile = res.data[0];
            this.user_available = true;
            this.user_name = res.data[0].user_name;
            this.patient_id = res.data[0].patient_id;
            this.user_age = res.data[0].user_age;
            this.user_gender = res.data[0].user_gender;
            this.user_email = res.data[0].user_emailID;
            this.user_country = res.data[0].user_country;
            this.user_joiningdate = res.data[0].user_joiningdate;
            this.user_patient_type = res.data[0].category;
            this.user_image = res.data[0].user_image;
          }
        }
      });
  }

  /***** To Get All Resources ******/ 
  get_resources() {
    let servicePath = this.utils.getApiConfigs("get_resources");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, '')
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.user_resources = res.data;
          }
        }
      });
  }

  /***** Show User Health Detail For Selected Day ******/ 
  onHealthDayChange(value:string){
    this.get_health(value);
  }

  /***** Get User Health Detail For All Days ******/
  get_health(days: string) {
    this.healthDay = days;
    let payload = { "day": days, "phone_num": this.user_num };
    let servicePath = this.utils.getApiConfigs("get_health");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
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


  date_format(date) {
    return moment(date).format('DD-MM-YYYY')
  }
 
  /***** Get User Reports For All Days ******/
  get_report() {

    let payload = { "phone_num": this.select_user }
    let servicePath = this.utils.getApiConfigs("get_report");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.reportList = res.data;
            this.report_avail = true;
          } else {
            this.report_avail = false;
          }
        } else {
          this.report_avail = false;
        }
      });
  }

  selectFile() {
    let element : HTMLElement  = document.getElementById("inpFile");
    element.click();
  }

  /***** To Capture File For Sending ******/
  onFileChanged(event: { target: { files: any[]; }; }) {
    
    if (event.target.files && event.target.files.length > 0) {
      for(var i = 0; i < event.target.files.length; i++) {
        let reader = new FileReader();
        let file = event.target.files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.uploadImage = [];
          this.uploadImage.push(reader.result);
          this.uploadFile();
          
        };
      }
      
    }
  }

  /***** To Upload File ******/
  uploadFile(){
    let payload = { "phone_num":this.user_num, "upload_1": this.uploadImage }
    let servicePath = this.utils.getApiConfigs("upload_chat_image");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            let mime = res.data[0].mime_type;
            mime = mime.split("/");
            this.uploadType = mime[0];
            
            this.uploadUrl = res.data[0].upload_1;
            if(this.uploadType == 'image')
            {
              this.sendImage();
            }
            if(this.uploadType == 'application')
            {
              this.sendDocument();
            }
          }
        }
      });
  }

  /***** To Send Message ******/
  sendMessage() {
    if(!(this.chat_message === ''))
    {
      var message = {
      username: this.adminNum,
      message: this.chat_message,
      time: new Date(),
      type: "message",
      name: 'admin',
      image: './assets/logo.png'
    };
    this.chatservice.sendMessage(message, this.user_num);
    this.allMessages.push(message);
    this.chat_message = "";
    }
  }

  /***** To Send Link ******/
  sendLink(link: string){
    var message = {
      username: this.adminNum,
      message: link,
      time: new Date(),
      type: "link",
      name: 'admin',
      image: './assets/logo.png'
    };
    this.chatservice.sendMessage(message, this.user_num);
    this.allMessages.push(message);
    this.chat_message = "";
  }

  /***** To Send Image ******/
  sendLinkImage(link: string) {
    this.uploadUrl = link;
    this.sendImage();
  }

  /***** To Send Image ******/
  sendImage() {
    var message = {
      username: this.adminNum,
      message: this.uploadUrl,
      time: new Date(),
      type: "image",
      name: 'admin',
      image: this.user_image
    };
    this.chatservice.sendMessage(message, this.user_num);
    this.allMessages.push(message);
    this.chat_message = "";
  }

  /***** To Send Video ******/
  sendLinkVideo(thumbnail: string, link: string) {
    this.thumbnailVideo = thumbnail;
    this.uploadUrl = link;
    this.sendVideo();
  }

  /***** To Send Video ******/
  sendVideo() {
    var message = {
      username: this.adminNum,
      message: this.uploadUrl,
      time: new Date(),
      type: "videolink",
      name: 'admin',
      image: this.user_image,
      thumbnail: this.thumbnailVideo
    };
    this.chatservice.sendMessage(message, this.user_num);
    this.allMessages.push(message);
    this.chat_message = "";
  }

  /***** To Send Youtube Link ******/
  sendYoutubeLink(link: string) {
    this.uploadUrl = link;
    this.sendYoutubeVideo();
  }

  /***** To Send Youtube Video ******/
  sendYoutubeVideo() {
    var message = {
      username: this.adminNum,
      message: this.uploadUrl,
      time: new Date(),
      type: "youtubelink",
      name: 'admin',
      image: this.user_image
    };
    this.chatservice.sendMessage(message, this.user_num);
    this.allMessages.push(message);
    this.chat_message = "";
  }

  /***** To Send Document ******/
  sendLinkDocument(link: string) {
    this.uploadUrl = link;
    this.sendDocument();
  }

  /***** To Send Document ******/
  sendDocument(){
    var message = {
      username: this.adminNum,
      pdf: "./assets/logo.png",
      message: this.uploadUrl,
      time: new Date(),
      type: "pdf",
      name: 'admin',
      image: './assets/logo.png'
    };
    this.chatservice.sendMessage(message, this.user_num);
    this.allMessages.push(message);
    this.chat_message = "";
  }

  /***** To Send Audio ******/
  sendAudio(){
    var message = {
      username: this.adminNum,
      message: this.uploadUrl,
      time: new Date(),
      type: "audio",
      name: 'admin',
      image: './assets/logo.png'
    };
    this.chatservice.sendMessage(message, this.user_num);
    this.allMessages.push(message);
    this.chat_message = "";
  }

  /***** To View File ******/
  viewFile(path: string){
    window.open(path);
  }

  /***** To Open Camera ******/
  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) { 
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available.');
    }
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  /***** To Attach Video ******/
  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
        this.videoHeight = this.videoElement.nativeElement.videoHeight;
        this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  /***** To Capture Image From Camera ******/
  capture() {
    this.imageCaptured = true;
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.capturedImage = [];
    this.capturedImage.push(this.canvas.nativeElement.toDataURL("image/jpeg"));
  }

  stopCamera() {

  }

  /***** To Send Captured Image ******/
  sendCaptureImage() {
    console.log("File to upload ------------------------- : "+this.capturedImage);
    let payload = { "phone_num":this.user_num, "upload_1": this.capturedImage }
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
            this.uploadType = mime[0];
            
            console.log("Uploaded Image Url : "+res.data[0].upload_1);
            this.uploadUrl = res.data[0].upload_1;
            console.log(this.uploadType);
            if(this.uploadType == 'image')
            {
              this.sendImage();
            }
            if(this.uploadType == 'application')
            {
              this.sendDocument();
            }
            
            //this.display='none';
            //this.getAllEvents();
          }
        }
      });
  }

  /***** To Send Captured Audio ******/
  sendCapturedAudio() {
    console.log("File to upload ------------------------- : "+this.capturedImage);
    let payload = { "phone_num":this.user_num, "upload_1": this.capturedImage }
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
            this.uploadType = mime[0];
            
            console.log("Uploaded Audio Url : "+res.data[0].upload_1);
            this.uploadUrl = res.data[0].upload_1;
            console.log(this.uploadType);
            if(this.uploadType == 'image')
            {
              this.sendImage();
            }
            if(this.uploadType == 'application')
            {
              this.sendDocument();
            }
            if(this.uploadType == 'audio')
            {
              this.sendAudio();
            }
            
            //this.display='none';
            //this.getAllEvents();
          }
        }
      });
  }

  /***** To Start Recording Audio ******/
  initiateRecording() {
      
    this.recording = true;
    let mediaConstraints = {
        video: false,
        audio: true
    };
    navigator.mediaDevices
        .getUserMedia(mediaConstraints)
        .then(this.successCallback.bind(this), this.errorCallback.bind(this));
}
/**
 * Will be called automatically.
 */
successCallback(stream) {
    var options = {
        mimeType: "audio/wav",
        numberOfAudioChannels: 1
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
}
/**
 * Stop recording.
 */
stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
    this.voiceRecorded = true;
}
/**
 * processRecording Do what ever you want with blob
 * @param  {any} blob Blog
 */
processRecording(blob) {
    let base64data = null;
    this.capturedVoice = [];
    this.url = URL.createObjectURL(blob);
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onload = () => {
       this.capturedVoice.push(reader.result);
      }
}
/**
 * Process Error.
 */
errorCallback(error) {
    this.error = 'Can not play audio in your browser';
}

/***** To Send Recorded Audio ******/
sendRecordedAudio() {
  let payload = { "phone_num":this.user_num, "upload_1": this.capturedVoice }
  console.log(payload);
  let servicePath = this.utils.getApiConfigs("upload_chat_image");
  this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
    .then((res: any) => {
      console.log(res);
      if (res.status_code == 200) {
        if (res.data.length > 0) {
          let mime = res.data[0].mime_type;
          mime = mime.split("/");
          this.uploadType = mime[0];
          
          this.uploadUrl = res.data[0].upload_1;
          console.log(this.uploadType);
          if(this.uploadType == 'image')
          {
            this.sendImage();
          }
          if(this.uploadType == 'application')
          {
            this.sendDocument();
          }
          if(this.uploadType == 'audio')
          {
            this.sendAudio();
          }
        }
      }
    });
}
}