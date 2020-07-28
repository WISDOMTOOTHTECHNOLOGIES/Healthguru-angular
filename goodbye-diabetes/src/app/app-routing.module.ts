import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthorisedLayoutComponent } from './layout/authorised/authorised-layout/authorised-layout.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatViewComponent } from './chat-view/chat-view.component';
import { BannerComponent } from './pages/banner/banner.component'
import { EventComponent } from './pages/event/event.component'
import { QuestionnaireComponent } from './pages/questionnaire/questionnaire.component'
import { ViewuserComponent } from './pages/viewuser/viewuser.component';
import { VolunteersComponent } from './pages/volunteers/volunteers.component';
import { LanguagesComponent } from './pages/languages/languages.component';
import { BroadcastComponent } from './pages/broadcast/broadcast.component'; 
import { CategoryComponent } from './pages/category/category.component';
import { VideosComponent } from './pages/videos/videos.component';
import { DoctorComponent } from './pages/doctor/doctor.component';
import { DoctorliveComponent } from './pages/doctorlive/doctorlive.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { ResourcesComponent } from './pages/resources/resources.component';
import { from } from 'rxjs';


const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signin', component: LoginComponent },
  { path: 'Logout', component: LoginComponent },
  {
    path: '',
    component: AuthorisedLayoutComponent,
    children: [
      { path: 'Users', component: UsersComponent },
      { path: 'Banner', component: BannerComponent },
      { path: 'Event', component: EventComponent },
      { path: 'Chat', component: ChatComponent },
      { path: 'Chat_view/:phone_num', component: ChatViewComponent },
      { path: 'questionnaire/:phone_num', component: QuestionnaireComponent },
      { path: 'viewuser/:phone_num', component: ViewuserComponent },
      { path: 'Volunteers', component: VolunteersComponent },
      { path: 'Languages', component: LanguagesComponent },
      { path: 'Broadcast', component: BroadcastComponent },
      { path: 'Category', component: CategoryComponent },
      { path: 'Videos', component: VideosComponent },
      { path: 'Doctors', component: DoctorComponent },
      { path: 'Live', component: DoctorliveComponent },
      { path: 'ScheduledUpcomingLive', component: ScheduleComponent },
      { path: 'Resources', component: ResourcesComponent }
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
