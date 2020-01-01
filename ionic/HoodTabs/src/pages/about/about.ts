import { GlobalProvider } from './../../providers/global/global';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public loggedIn: string;

  constructor(public navCtrl: NavController, public globalProvider: GlobalProvider) {

  }

  ionViewDidEnter(){
   this.loggedIn = this.globalProvider.getUserPublicName();
  }

}
