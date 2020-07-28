import { Injectable, EventEmitter, Output } from '@angular/core';
import { Strophe } from 'strophe.js';
import { ChatViewComponent } from './chat-view/chat-view.component';
declare let Strophe: any;
declare const $msg: any;
declare const $pres: any;
declare const $: any;
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private BOSH_SERVICE: string = "http://172.105.61.17:7070/http-bind/";
  private CONFERENCE_SERVICE: string = "conference.localhost";
  private connection: Strophe.Connection;
  recievedMessage: any;

  @Output() open: EventEmitter<any> = new EventEmitter();

  constructor() { }
  /***** To Login Into Chat Api ******/ 
  login() {
    let jid = "admin_healthguru"
    let pass = "healthguru@123";
    let host = '172.105.61.17';
    this.connection = new Strophe.Connection(this.BOSH_SERVICE, { 'keepalive': true });
    this.connection.connect(jid + '@' + host, pass, (status) => {
      this.onConnect(status);
    });
  }

  /***** On User Connected To Chat ******/ 
  onConnect(status) {
    let self = this;

    switch (status) {
        case Strophe.Status.CONNECTED:
            this.connection.send($pres());
            this.connection.addHandler(function(msg){ self.onMessage(msg); return true; }, null, 'message', 'chat');
            this.connection.addHandler(function(msg){ self.onSubscriptionRequest(msg); return true;}, null, "subscribe", "subscribe");
            this.connection.addHandler(function(msg){ self.onPresence(msg); return true;}, null, "presence","presence");
            //console.log(this.connection);
            //console.log('presence',Strophe.$pres());
            break;
        case Strophe.Status.ATTACHED:
            console.log('[Connection] Strophe is Attached');
            break;

        case Strophe.Status.DISCONNECTED:
            console.log('[Connection] Strophe is Disconnected');
            // this.dismissObserver.next("logout");
            break;

        case Strophe.Status.AUTHFAIL:
            console.log('[Connection] Strophe is Authentication failed');
            break;

        case Strophe.Status.CONNECTING:
            console.log('[Connection] Strophe is Connecting');
            break;

        case Strophe.Status.DISCONNECTING:
            console.log('[Connection] Strophe is Disconnecting');
            break;

        case Strophe.Status.AUTHENTICATING:
            console.log('[Connection] Strophe is Authenticating');
            break;

        case Strophe.Status.ERROR:
        case Strophe.Status.CONNFAIL:
            console.log('[Connection] Failed (' + status + ')');
            break;

        default:
            console.log('[Connection] Unknown status received:', status);
            break;
    }
  };
 
  /***** On User Sends Message ******/ 
  onMessage(msg) {
    let to = msg.getAttribute('to');
    let from = msg.getAttribute('from');
    let type = msg.getAttribute('type');
    let elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
      let body = elems[0];
      let mymg = Strophe.getText(body);
      let sample = mymg.replace(/(&quot\;)/g,"\"");
      sample = JSON.parse(sample);
      var message = {
        username: sample.username,
        message: sample.message,
        time: sample.time,
        type: sample.type,
        name: sample.name,
        image:sample.image,
        pdf:sample.pdf
      };
      this.open.emit(message);
      this.notifyMessage();
      console.log('received---------------------message------------------------', message.message);
      //this.events.publish('message', message);
    }
    return true;
  }
 
  /***** To Notify User On Message Recieved ******/ 
  notifyMessage() {
    return this.open;
  }

  onPresence(presence) {
    console.log('onPresence:');
    let presence_type = $(presence).attr('type'); // unavailable, subscribed, etc...
    let from = $(presence).attr('from'); // the jabber_id of the contact
    if (!presence_type) presence_type = "online";
    console.log('	>' + from + ' --> ' + presence_type);
    if (presence_type != 'error') {
      if (presence_type === 'unavailable') {
        // Mark contact as offline
      } else {
        let show = $(presence).find("show").text(); // this is what gives away, dnd, etc.
        if (show === 'chat' || show === '') {
          // Mark contact as online
        } else {
          // etc...
        }
      }
    }
    return true;
  }

  onSubscriptionRequest(stanza) {
    if (stanza.getAttribute("type") == "subscribe") {
      let from = $(stanza).attr('from');
      console.log('onSubscriptionRequest: from=' + from);
      this.connection.send($pres({
        to: from,
        type: "subscribed"
      }));
    }
    return true;
  }

  /***** On User Send A Message ******/ 
  sendMessage(message, tonum) {
    let to_user = tonum+'@172.105.61.17';
    let from_user = 'admin_healthguru@172.105.61.17';
    let msg = message;
    msg = JSON.stringify(msg);
    let m = $msg({
      //  to: 'test4@skeinlab',
      //  from:'test3@skeinlab',
      to: to_user,
      from: from_user,
      type: 'chat'
    }).c("body").t(msg);
    console.log('message', m);

    this.connection.send(m);
    console.log('status', this.connection);
  }
}
