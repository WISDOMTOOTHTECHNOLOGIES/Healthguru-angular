import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApilistService {

  /**
   * list of all API links
   */
  apiService: any = [{
    'key': 'login',
    'path': 'login',
    'method': 'POST'
  },
  {
    'key': 'user_list',
    'path': 'userService',
    'method': 'GET'
  },
  {
    'key': 'user_view',
    'path': 'patientdetails',
    'method': 'POST'
  },
  {
    'key': 'get_health',
    'path': 'patientreport1',
    'method': 'POST'
  },
  {
    'key': 'get_notes',
    'path': 'notes',
    'method': 'GET'
  },
  {
    'key': 'add_notes',
    'path': 'notes',
    'method': 'POST'
  },
  {
    'key': 'get_reports',
    'path': 'allreports',
    'method': 'GET'
  },
  {
    'key': 'get_portal_report',
    'path': 'testresults',
    'method': 'GET'
  },
  {
    'key': 'get_questionnaire',
    'path': 'questionnarie',
    'method': 'GET'
  },
  {
    'key': 'banner_list',
    'path': 'dashboard',
    'method': 'GET'
  },
  {
    'key': 'update_banner',
    'path': 'updatedashboard',
    'method': 'POST'
  },
  {
    'key': 'event_list',
    'path': 'dashboard1',
    'method': 'GET'
  },
  {
    'key': 'update_event',
    'path': 'updatedashboard1',
    'method': 'POST'
  },
  {
    'key': 'get_report',
    'path': 'getuploadresults',
    'method': 'POST'
  },
  {
    'key': 'get_resources',
    'path': 'links',
    'method': 'GET'
  },
  {
    'key': 'chat_users',
    'path': 'chatuserlist',
    'method': 'GET'
  },
  {
    'key': 'get_message_count',
    'path': 'msgcount',
    'method': 'GET'
  },
  {
    'key': 'update_message_count',
    'path': 'msgcount',
    'method': 'POST'
  },
  {
    'key': 'upload_chat_image',
    'path': 'chatdoctorddata',
    'method': 'POST'
  },
  {
    'key': 'get_messages',
    'path': 'chat',
    'method': 'POST'
  },
  {
    'key': 'get_message_files',
    'path': 'chatgetdata',
    'method': 'POST'
  },
  {
    'key': 'add_volunteer',
    'path': 'volunteer',
    'method': 'POST'
  },
  {
    'key': 'get_volunteers',
    'path': 'allvolunteer',
    'method': 'GET'
  },
  {
    'key': 'delete_volunteer',
    'path': 'deletevolunteer',
    'method': 'POST'
  },
  {
    'key': 'get_languages',
    'path': 'language',
    'method': 'GET'
  },
  {
    'key': 'add_language',
    'path': 'language',
    'method': 'POST'
  },
  {
    'key': 'delete_language',
    'path': 'deletelanguage',
    'method': 'POST'
  },
  {
    'key': 'broadcast_list',
    'path': 'allbroadcast',
    'method': 'GET'
  },
  {
    'key': 'category_list',
    'path': 'category',
    'method': 'GET'
  },
  {
    'key': 'add_category',
    'path': 'category',
    'method': 'POST'
  },
  {
    'key': 'delete_category',
    'path': 'deletecategory',
    'method': 'POST'
  },
  {
    'key': 'videos_list',
    'path': 'subvideo',
    'method': 'GET'
  },
  {
    'key': 'add_video',
    'path': 'subvideo',
    'method': 'POST'
  },
  {
    'key': 'delete_video',
    'path': 'deletevideo',
    'method': 'POST'
  },
  {
    'key': 'get_links',
    'path': 'links',
    'method': 'GET'
  },
  {
    'key': 'get_links_type',
    'path': 'getlinks',
    'method': 'POST'
  },
  {
    'key': 'links',
    'path': 'links',
    'method': 'POST'
  },
  {
    'key': 'delete_link',
    'path': 'deletelinks',
    'method': 'POST'
  },
  {
    'key': 'add_doctor',
    'path': 'doctorinfo',
    'method': 'POST'
  },
  {
    'key': 'doctorinfo_list',
    'path': 'doctorinfo',
    'method': 'GET'
  },
  {
    'key': 'delete_doctor',
    'path': 'deletedoctor',
    'method': 'POST'
  },
  {
    'key': 'doctorlive_list',
    'path': 'liveinfoweb',
    'method': 'GET'
  },
  {
    'key': 'delete_doctorlive',
    'path': 'deleteliveinfo',
    'method': 'POST'
  },
  {
    'key': 'upcominglive_list',
    'path': 'upcominginfo',
    'method': 'GET'
  },
  {
    'key': 'delete_upcominglive',
    'path': 'deleteupcominglive',
    'method': 'POST'
  }
];

  constructor() { }
  /**
   * find and call API path from the component
   * @param key
   */
  getApiConfigs(key: string) {
    return this.apiService.filter((item) => {
      if (item.key == key) {
        return item;
      }
    });
  }
}