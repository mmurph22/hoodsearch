import { DbConnectionService } from './../../services/DbConnectionService';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the BookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {
  public connection : {};
  eid: string;
  vid: string;  
  vperc: string;
  results: Array<any>;

  fname: string;
  lname: string;
  ename: string;
  vname: string;
  vaddr: string;
  estdt: string;
  eendt: string;
  esttm: string;
  eentm: string;
  vpocn: string;
  vpoce: string;
  vpocp: string;
  eppts: string;


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public dbcservice: DbConnectionService) {
    this.connection = this.dbcservice.getDbConnectionData();
    this.vid = navParams.get('vid');
    this.eid = navParams.get('eid');
    this.vperc = navParams.get('vperc');
  }

  ionViewWillEnter(){
    this.getBookingProfile(this.dbcservice.getPhpCommand('getBookingsPhp'), this.eid, this.vid, this.vperc);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingsPage');
  }

  getBookingProfile(phpCommand: string, eid: string, vid: string, vperc: string) {
    let url = phpCommand;
    url = url + "?eid=" + eid;
    url = url + "&vid=" + vid;
    url = url + "&vperc=" + vperc;

    //alert(url);
    this.http.get(url)
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null) {
          // retrieve any display info needed
          this.results = data;  
          this.fname = data[0].firstname;
          this.lname = data[0].lastname;
          this.ename = data[0].event_name;
          this.vname = data[0].venue_name;
          this.vaddr = data[0].address;
          this.estdt = data[0].startdate;
          this.eendt = data[0].enddate;
          this.esttm = data[0].daystarttime;
          this.eentm = data[0].dayendtime;
          this.vpocn = data[0].pocname;
          this.vpoce = data[0].pocemail;
          this.vpocp = data[0].pocphone;
          this.eppts = data[0].badgepoints_pp;
        }        
    });        
  }
}
