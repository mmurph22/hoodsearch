import { GlobalProvider } from './../../providers/global/global';
import { DbConnectionService } from './../../services/DbConnectionService';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ToastService } from '../../services/toast-service';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


/**
 * Generated class for the RatingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ratings',
  templateUrl: 'ratings.html',
})
export class RatingsPage {
  formg: FormGroup;
  items: FormArray;

  private connection = {};
  private pageMessage: string;

  public events: Array<any>;
  public volid: Number;
  public eventid: Number;
  public eventname: string;

  private DEF_RATING: Number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public dbcservice: DbConnectionService, public globalProvider: GlobalProvider, 
    public formBuilder:FormBuilder, public toastCtrl:ToastService) {
    // defaults 
    this.connection = this.dbcservice.getDbConnectionData();
    this.eventid = this.navParams.get("eventid");
    this.eventname = this.navParams.get("eventname");
  }

  ngOnInit() {
    this.formg = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
  }    

  createItem(): FormGroup {
    return this.formBuilder.group({
      firstname: '',
      lastname: '',
      percent: '',
      rating: ''
    });
  }

  addItem(): void {
    this.items = this.formg.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  updateRatingData(i:number) {
    if (this.events.length > i) {
      let r:Number = this.items.at(i).value.rating; //rating at slider
      this.events[i].rating = r;
      
    }
  }

  updateRatingCtl(i:number) {
    let il = this.items.length;
    let el = this.events.length;
    console.log("items:" + il + " Events:" + el + " I:"+i);
    if (i < il && i< el) {
      let val = this.events[i].rating;
     // this.items.at(i).value.rating.updateValue(this.events[i].rating);
    }
  }

  initializeFields() {
    let l = this.items.length;
    let i:number;
    for(i=0; i<l; i++)
      this.updateRatingCtl(i);
  }

  

  /*
  onRate() {  
  }
  */

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingsPage');
    this.getEventVolunteers(this.eventid);
  }

  onRateSingle(i:number) {
    if (this.events.length > i) {
      this.insertRating( this.events[i].eventid, this.events[i].vid, this.events[i].rating);
    }
  }

  getEventVolunteers(eventid: Number){
    let url = this.dbcservice.getPhpCommand('getEventVolunteersPhp') + "?eventid=" + eventid; 
    this.http.get(url)
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null && data.length>0) {
          this.events = data;
          this.events.forEach(e => {
            this.addItem();
          });
          this.initializeFields();
        }        
    }); 
  }

  insertRating(eid: Number, vid: Number, r: Number) {
    var stat: boolean = false;

    var url = this.dbcservice.getPhpCommand('setVolunteersRatingsPhp');
    var params = new FormData();

    params.append('volid', vid.toString());
    params.append('eventid', eid.toString());
    params.append('rating', r.toString());
    
    //alert(vid + " " + eid + " " + r);
    console.log(params);
    console.log(url);
    this.http.post(url, params)
      .map(response => response.json())
        .subscribe(data => {
          console.log(data.code + " : " + data.desc);
          stat = (data.code == 0);
          let msg = (stat) ? "Volunteer Rating successful. " : "Rating Error: ";
          let sub = (stat) ? "Thank you for helping our volunteers help you!" : data.desc;
          this.pageMessage = msg + sub;
          this.toastCtrl.presentToast(this.pageMessage);
    });
  }

}
