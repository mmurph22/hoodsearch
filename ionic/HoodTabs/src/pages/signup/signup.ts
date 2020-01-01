import { DbConnectionService } from './../../services/DbConnectionService';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { OpportunitiesPage } from '../opportunities/opportunities';
import { BookingsPage } from '../bookings/bookings';


/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formg: FormGroup;
  showForm: boolean = true;
  pageMessage: string = "Sign Up"
  canVolunteer: boolean= true;

  public eventdata: Array<any>;
  public vpercent: Number = 100;
  public connection : {};
  eventid: string;
  vid: string;
  
  evenue: string;
  eevent: string;
  edescription: string;
  estartdate: string;
  estarttime: string;
  eenddate: string;
  eendtime: string;
  epoints: Number;
  evolsreq: Number;
  eperctime: Number;


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public dbcservice: DbConnectionService, public formBuilder:FormBuilder) {
    this.connection = this.dbcservice.getDbConnectionData();
    this.eventid = navParams.get('eventid');
    this.vid = navParams.get('vid');

    //alert("E="+this.eventid+" V="+this.vid);

    this.formg = formBuilder.group({
      "evenue": [""],
      "eevent": [""],
      "edescription": [""],
      "estartdate": [""],
      "eenddate": [""],
      "epoints": [""],
      "evolsreq": [""],
      "eperctime": ["100", Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    this.getSignupData(this.dbcservice.getPhpCommand('getEventSignupPhp'), this.eventid);
  }

  ionViewWillEnter() {
    
    this.initializeFields();
  }

  getSignupData(phpCommand: string, eventid: string){
    let url = phpCommand + "?eid=" + eventid;
    //alert(url);
    this.http.get(url)
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null) {
          this.showForm = true;
          this.eventdata = data;
          this.canVolunteer = (data[0].vols_required > 0);
          this.evenue = data[0].venue_name;
          this.eevent = data[0].event_name;
          this.edescription = data[0].event_description;
          this.estartdate = data[0].startdate;
          this.estarttime  = data[0].daystarttime;
          this.eenddate = data[0].enddate;
          this.eendtime = data[0].dayendtime;
          this.epoints = data[0].badgepoints_pp;
          this.evolsreq = data[0].vols_required;
        }        
    }); 
  }

  initializeFields() {
    this.showForm = true;

    // set field values
    this.formg.controls.eperctime.setValue(100);
  }

  volunteer() {
    this.vpercent = this.formg.controls.eperctime.value;
    this.insertBooking(this.dbcservice.getPhpCommand('setEventSignupPhp'), this.eventid, this.vid, this.vpercent);
  }

  insertBooking_get(phpCommand: string, eventid: string, vid:string, vpercent:Number) {
    var stat: boolean = false;
    var err:string;
    
    let url = phpCommand;
    url = url + "?eid=" + eventid;
    url = url + "&vid=" + vid;
    url = url + "&vperc=" + vpercent;

    //alert(url);
    this.http.get(url)
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null) {
          if (data.code == 0) {
            // insertion success
            this.showForm = false;
            stat = true;
          } else {
            err = data.desc;
          }
        }        
    }); 
    this.pageMessage = (stat) ? "Volunteer Signup successful." : ("Volunteer Signup Error: " + err);
    //if (stat)
      //alert("Here we move to Booking completion page");
      //this.goToBookingsPage(eventid, vid, vpercent); //not yet
  }

  insertBooking(phpCommand: string, eventid: string, vid:string, vpercent:Number) {
    var stat: boolean = false;
    var err:string;

    var url = phpCommand;
    var params = new FormData();

    params.append('eid', this.eventid);
    params.append('vid', this.vid);
    params.append('vperc', this.formg.controls.eperctime.value);
    
    console.log(params);
    console.log(url);
    this.http.post(url, params)
      .map(response => response.json())
        .subscribe(data => {
          if (data.code == 0) {
            // insertion success
            this.showForm = false;
            stat = true;
          }
          this.pageMessage = (stat) ? "Volunteer Signup successful." : ("Signup Error: " + data.desc);
          if (stat)
            this.goToBookingsPage(eventid, vid, vpercent);
    });
  }

  goToBookingsPage(eventid: string, vid:string, vpercent:Number) {
   this.navCtrl.push(BookingsPage, {
     eid: eventid,
     vid: vid,
     vperc: vpercent
   });
  }

}
