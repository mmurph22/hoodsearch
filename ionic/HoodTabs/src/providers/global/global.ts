import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalProvider {

  // Id for login
  private login_id:Number = 0; //  0 = not logged in
  setLoginId(value) {
    this.login_id = value;
  }
  getLoginId() {
    return this.login_id;
  }


  // role of logged in user
  private login_role:Number = 2;
  setLoginRole(value) {
    this.login_role = value;
  }
  getLoginRole() {
    return this.login_role;
  }

  // Visible name of logged in user
  private vis_name:string;
  setUserPublicName(value) {
    this.vis_name = value;
  }
  getUserPublicName() {
    return this.vis_name;
  }

  // login username of logged in user
  private login_name:string;
  setLoginName(value) {
    this.login_name = value;
  }
  getLoginName() {
    return this.login_name;
  }


  constructor(public http: HttpClient) {
    console.log('Hello GlobalProvider Provider');
    this.login_id = 0;
    this.login_role = 2;
  }

}
