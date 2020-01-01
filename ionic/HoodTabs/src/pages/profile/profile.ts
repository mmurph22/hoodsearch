import { GlobalProvider } from './../../providers/global/global';
import { DbConnectionService } from './../../services/DbConnectionService';
import { Component } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [
    DbConnectionService
  ]
})
export class ProfilePage {
  events: any = [];
  /*events = [
    {event_name:'Fish Fry Event', venue_name: 'St Margarets Church', daystarttime: '10-23-18', dayendtime: '10-28-18', points:'200'},
    {event_name:'Services and Supplies', venue_name: 'Young Mens Youth Association', daystarttime: '09-16-18', dayendtime: '09-20-18', points:'150'},
    {event_name:'Kilsgarok Festival', venue_name: 'Theater of Living Arts', daystarttime: '08-10-18', dayendtime: '08-11-18', points:'320'},
    {event_name:'Heilung', venue_name: 'Castlefest 2017', daystarttime: '07-10-17', dayendtime: '07-12-17', points:'175'}
  ];*/
  //levels = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  
  public vid: Number;
  public firstname: string = "Jacob";
  public lastname: string = "Marley";
  public email: string = "jm@bigchains.org";
  public level: string = "4";
  public points: Number = 625.75;
  public imgcard: string = "2_of_hearts.png";
  public imgtable: string = "pokertable.jpg";

  public connection : {};
  private retrieveScript: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public dbcservice: DbConnectionService, public globalProvider: GlobalProvider) {
    // defaults 
    this.connection = this.dbcservice.getDbConnectionData();
    this.imgcard = this.connection['ImageCardPath'] + "2_of_hearts.png";
    this.imgtable = this.connection['ImagePokerPath'] + "poker_table_icon.png";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter(){
    this.vid = this.queryUserId(this.globalProvider.getLoginId());
  }

  queryUserId(loginid: Number): Number {
    var ret: Number;
    var url = this.dbcservice.getPhpCommand('getUserInfoPhp');
    //url = url + "?loginid=" + loginid;
    var params = new FormData();
    params.append('loginid', loginid.toString());
    
    console.log(url);
    //this.http.get(url)
    this.http.post(url, params)
      .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          if (data!=null && data.length>0) {
            this.vid = data[0].vid;
            this.getMainProfile(this.dbcservice.getPhpCommand('getProfilePhp'), this.vid);
            
          }
    });
    return this.vid;
  }


  getMainProfile(phpCommand: string, vid: Number) {
    let url = phpCommand + "?q=" + vid; //this.retrieveScript;
    console.log(url);
    
    this.http.get(url)
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null && data.length>0) {
          this.firstname = data[0].firstname;
          this.lastname = data[0].lastname;
          this.email = data[0].email;
          this.level = data[0].s_level;
          this.points = data[0].s_score;
          this.imgcard = this.connection['ImageCardPath'] + data[0].s_card;
          this.getHistoryList(this.dbcservice.getPhpCommand('getProfileHistoryPhp'), vid);
        }        
    });        
  }

  getHistoryList(phpCommand: string, vid: Number){
    let url = phpCommand + "?q=" + vid; 
    this.http.get(url)
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null && data.length>0) {
          this.events = data;
        }        
    }); 
  }

}
