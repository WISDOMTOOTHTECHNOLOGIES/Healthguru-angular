import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './pages/users/users.component';
import { LoginComponent } from './pages/login/login.component';
import { CommonService } from './services/common.service';
import { ApilistService } from './services/apilist.service';
import { AuthorisedSideNavComponent } from './layout/authorised/authorised-side-nav/authorised-side-nav.component';
import { AuthorisedLayoutComponent } from './layout/authorised/authorised-layout/authorised-layout.component';
import { AuthorisedTopNavComponent } from './layout/authorised/authorised-top-nav/authorised-top-nav.component';
import { AuthorisedSideNavTogglerComponent } from './layout/authorised/authorised-side-nav-toggler/authorised-side-nav-toggler.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PageContentComponent } from './layout/page-content/page-content.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { BannerComponent } from './pages/banner/banner.component';
import { EventComponent } from './pages/event/event.component';
import { QuestionnaireComponent } from './pages/questionnaire/questionnaire.component';
import { ViewuserComponent } from './pages/viewuser/viewuser.component';
import { VolunteersComponent } from './pages/volunteers/volunteers.component';
import { LanguagesComponent } from './pages/languages/languages.component';
import { BroadcastComponent } from './pages/broadcast/broadcast.component';
import { CategoryComponent } from './pages/category/category.component';
import { VideosComponent } from './pages/videos/videos.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { DoctorliveComponent } from './pages/doctorlive/doctorlive.component';

@NgModule({
  declarations: [
    AppComponent,
    PageContentComponent,
    AuthorisedSideNavComponent,
    AuthorisedLayoutComponent,
    AuthorisedTopNavComponent,
    AuthorisedSideNavTogglerComponent,
    LoginComponent,
    UsersComponent,
    ChatComponent,
    ChatViewComponent,
    BannerComponent,
    EventComponent,
    QuestionnaireComponent,
    ViewuserComponent,
    VolunteersComponent,
    LanguagesComponent,
    BroadcastComponent,
    CategoryComponent,
    VideosComponent,
    DoctorComponent,
    ScheduleComponent,
    ResourcesComponent,
    DoctorliveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgSelectModule,
    AccordionModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [
    CommonService,
    ApilistService,
    AccordionModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
