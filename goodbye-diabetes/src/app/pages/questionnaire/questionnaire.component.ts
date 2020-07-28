import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApilistService } from 'src/app/services/apilist.service';
import { CommonService } from 'src/app/services/common.service';
import { HttpClient,HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {

  phone_num: string;
  questionnarieAns: any;
  isAvailable: boolean;

  constructor(public router: Router, private sanitizer: DomSanitizer, public utils: ApilistService, private commonservice: CommonService, private route: ActivatedRoute,) {
    let logged = sessionStorage.getItem('logged');
    if(logged != '1') {
      this.router.navigate(['/signin']);
    }
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.phone_num = params['phone_num']; // (+) converts string 'id' to a number

      // In a real app: dispatch action to load the details here.
   });
    this.isAvailable = false;
    this.get_questionnaries();
  }

  /***** To List Questionnaries ******/ 
  get_questionnaries(){
    const payload = new HttpParams()
    .set('phone_num', this.phone_num);
    let servicePath = this.utils.getApiConfigs("get_questionnaire");
    this.commonservice.invokeService(servicePath[0].method, servicePath[0].path, payload)
      .then((res: any) => {
        console.log(res);
        if (res.status_code == 200) {
          if (res.data.length > 0) {
            this.isAvailable = true;
            this.questionnarieAns = res.data;
            console.log(res.data);
          }
        }
      });
  }
}
