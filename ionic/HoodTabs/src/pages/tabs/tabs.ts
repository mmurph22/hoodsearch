import { ContactPage } from './../contact/contact';
import { GlobalProvider } from './../../providers/global/global';
import { VenueEventsPage } from './../events/events';
import { DbConnectionService } from './../../services/DbConnectionService';


import { Component } from '@angular/core';


import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { ScenariosPage } from '../scenarios/scenarios';
import { SurveysPage } from '../surveys/surveys';
import { ResultsPage } from '../results/results';
//import { OpportunitiesPage } from '../opportunities/opportunities';
import { VenuePage } from '../venue/venue';

import { Events } from 'ionic-angular';
import { RegisterPage } from './../register/register';

//import { HomePage } from '../home/home';
//mport { HomePage } from '../home-page/home-page';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  private LOGOUT:string = "Logout";

  // default setup
  tabs_searcher = [
    {root:ScenariosPage, tabTitle:"My Surveys",tabIcon:"calendar"},
    {root:SurveysPage, tabTitle:"New Survey",tabIcon:"ribbon"},
    {root:ResultsPage, tabTitle:"Results",tabIcon:"images"},
    {root:LoginPage, tabTitle:this.LOGOUT,tabIcon:"log-out"},
    //{root:ContactPage, tabTitle:"",tabIcon:""}, // for login name
  ];

  tabs_coordinator = [
    {root:AboutPage, tabTitle:"About",tabIcon:"information-circle"},
    {root:VenuePage, tabTitle:"Venue Profile",tabIcon:"home"},    
    {root:VenueEventsPage, tabTitle:"Add Event",tabIcon:"microphone"},
    {root:LoginPage, tabTitle:this.LOGOUT,tabIcon:"log-out"},
    //{root:ContactPage, tabTitle:"",tabIcon:""} // for login name
  ];

  public tab_config: Array<any>;
  public loginId: Number = 1;
  public loginRole: Number = 2;
  public loginname: string = "none";
  public loginpublicname: string = "none";
  public btnsEnabled: Boolean = true;

 

  constructor(private globalProvider: GlobalProvider) {
    this.configureBtns(true);
  }

  ionViewWillEnter(){
    this.configureBtns(true);
  }

  configureBtns(enable: boolean = false) {
    // set setup by role
    this.loginRole = this.globalProvider.getLoginRole();
    this.loginId = this.globalProvider.getLoginId();
    this.loginname = this.globalProvider.getLoginName();
    this.loginpublicname = this.globalProvider.getUserPublicName();
    /*
    alert("ENABLE:" + enable + "\n"+
          "LNID:"+this.loginId+"\n"+
          "LNNM:"+this.loginname+"\n"+
          "NAME:"+this.loginpublicname+"\n"+
          "ROLE:"+this.loginRole);
    */    

    if (this.loginRole == 2) {
      // Volunteer
      this.tab_config = this.tabs_searcher;
    }
    else if (this.loginRole == 3) {
      // Coordinator
      this.tab_config = this.tabs_coordinator;
    }

    // set visible name
    this.tab_config[3].tabTitle = this.LOGOUT + " " + this.loginpublicname;

    // if loginid = 0, disable
    this.btnsEnabled = enable;
  }

}
