import { MyApp } from './../../app/app.component';
import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DbConnectionService } from './../../services/DbConnectionService';
import { LoginService } from '../../services/login-service';
import { ToastService } from '../../services/toast-service';
import { NewCoordinatorPage } from '../newcoordinator/newcoordinator';
import { NewVolunteerPage} from '../newvolunteer/newvolunteer';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'login-page',
  templateUrl: 'login.html',
  providers: [
    LoginService, ToastService
  ]
})
export class LoginPage {

  public pageMessage: string;
  formg: FormGroup;
  opComplete: boolean = false;

  /*  Necessary data and events
      ================================*/
  data : {};
  events: {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalProvider: GlobalProvider,
    public http: Http, public service: LoginService, private toastCtrl: ToastService, 
    private dbcservice: DbConnectionService, private formBuilder:FormBuilder) {
    
    this.data = this.service.getDataForLoginFlat();
    this.events =  {
      "onLogin" : this.onLogin,
      "onLogout" : this.onLogout,
      "onRegister" : this.onRegister
    }
    this.pageMessage = this.data['txtHaveAccount'];

    this.formg = formBuilder.group({
      "uname": ["", Validators.required],
      "pwd": ["", Validators.required],
    });
    
  }
  
  ionViewWillEnter(){
   //this.globalProvider.setLoginId(0); // equivalent to logout
   this.onLogout(0);
   this.opComplete = true;
  }


  onRegister = (params): void => {
    this.toastCtrl.presentToast('Register User NOT USED. use other buttons.');
  }

  onSignupCoordinator = (params): void => {
    this.toastCtrl.presentToast('Gather login info for Coordinators.');

    this.navCtrl.push(NewCoordinatorPage, {});
    
  }

  onSignupVolunteer = (params): void => {
    this.toastCtrl.presentToast('Gather login info for Researcher.');

    this.navCtrl.push(NewVolunteerPage, {});
  } 
  
  /*  Todo override this function with your logic
  =================================================*/
  onLogin = (params): void => {
      this.getLoginInfo(this.formg.controls.uname.value, this.formg.controls.pwd.value, 1); //1=login 
  }

  onLogout = (params): void => {
    this.getLogoutInfo(this.globalProvider.getLoginName()); //0=logout 
  }

  getLoginInfo(credential: string, pwd: string, state:Number) {
    
    var stat: boolean = false;
    var desc: string;
    var url = this.dbcservice.getPhpCommand('getLoginPhp');

    // to use GET, comment this
    var params = new FormData();
    params.append('uname', credential);
    params.append('pwd', pwd);
    params.append('state', state.toString());

    let preuname = (state == 0) ? this.globalProvider.getUserPublicName() : "";
    
    console.log(url);
    this.http.post(url, params)

    /*
    // to use POST, comment this
    url = url + "?uname=" + credential;
    url = url + "&pwd=" + pwd;   
    url = url + "&state=" + state;     
    console.log(url);
    this.http.get(url)
    */
      .map(response => response.json())
        .subscribe(data => {
          if (data!=null) {
            console.log(data);
            if (data.code == 0) {
              // login/logout successful, now get credentials
              if (state > 0)  {
                this.getUserInfo(credential, true);
              }
              stat = true;
              
            } else {
              // get error message
              desc = data.desc;
            }
          }
          let msgtype = (state>0) ? "Login" : "Logout"; 
          this.pageMessage = (stat) ? (msgtype + " successful for " + (state>0) ? this.globalProvider.getUserPublicName(): preuname) : (msgtype + " Error: " + desc);
          if (stat) {
            //alert( this.globalProvider.getUserPublicName() + " " + this.globalProvider.getLoginRole());
            this.navCtrl.push(TabsPage, {loginid: this.globalProvider.getLoginId(), loginrole: this.globalProvider.getLoginRole()});
          }    
          this.toastCtrl.presentToast(this.pageMessage);
    });
  }

  getUserInfo(uname: string, asLogin: boolean) {
    var stat: boolean = false;
    var url = this.dbcservice.getPhpCommand('getUserInfoPhp');

    // to use GET, comment this
    var params = new FormData();
    params.append('uname', uname);
    
    console.log(url);
    this.http.post(url, params)

    // to use POST, comment this out
    /*url = url + "?uname=" + uname;    
    console.log(url);
    this.http.get(url)
    */
      .map(response => response.json())
        .subscribe(data => {
          if (data!=null && data.length>0) {
            // user found, now get credentials
            let pname = (data[0].roleid == 2) ? (data[0].firstname + " " + data[0].lastname) : (data[0].pocname);
            this.globalProvider.setLoginId(data[0].loginid);
            this.globalProvider.setLoginRole(data[0].roleid);
            this.globalProvider.setLoginName(uname);
            this.globalProvider.setUserPublicName(pname);
            stat = true;
          }
          
    });
    return stat;
  }

  getLogoutInfo(credential: string) {
    
    var stat: boolean = false;
    var desc: string;
    var url = this.dbcservice.getPhpCommand('getLoginPhp');

    // if already logged out, do nothing
    if (this.globalProvider.getLoginId() == 0) return;


    // to use GET, comment this
    var params = new FormData();
    params.append('uname', credential);
    params.append('state', "0");

    let preuname = this.globalProvider.getUserPublicName();
    
    console.log(url);
    this.http.post(url, params)

    /*
    // to use POST, comment this
    url = url + "?uname=" + credential;
    url = url + "&pwd=" + pwd;   
    url = url + "&state=" + state;     
    console.log(url);
    this.http.get(url)
    */
      .map(response => response.json())
        .subscribe(data => {
          if (data!=null) {
            console.log(data);
            if (data.code == 0) {
              // logout successful
              stat = true;
              
            } else {
              // get error message
              desc = data.desc;
            }
          }
          this.pageMessage = (stat) ?("Logout successful for " + preuname) : (" Error in logout: " + desc);
          console.log(this.pageMessage);
          this.toastCtrl.presentToast(this.pageMessage); 
    });
  }

}
