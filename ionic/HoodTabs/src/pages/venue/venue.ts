import { ToastService } from './../../services/toast-service';
import { RatingsPage } from './../ratings/ratings';
import { GlobalProvider } from './../../providers/global/global';
import { DbConnectionService } from './../../services/DbConnectionService';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var google;
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-venue',
  templateUrl: 'venue.html',
  providers: [
    DbConnectionService
  ]
})
export class VenuePage {
  events: any = [];
  
  public venueid: Number;

  public venuename: string;
  public address: string;
  public pocname: string;
  public pocemail: string;
  public pocphone: string;
  public latitude: Number;
  public longitude: Number;

  public imgcard: string;
  public map: any;
  public currentLocation: any;

  public connection : {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public dbcservice: DbConnectionService, public globalProvider: GlobalProvider, private toastCtrl: ToastService) {
    // defaults 
    this.connection = this.dbcservice.getDbConnectionData();
    this.imgcard = this.connection['ImagePokerPath'] + "chipcash.png";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ionViewWillEnter(){
    this.venueid = this.queryVenueId(this.globalProvider.getLoginId());
  }

  showMap(active:Boolean, lat:Number, lng:Number) {
    this.currentLocation = new google.maps.LatLng(lat, lng);

    let mapOptions = {
        center: this.currentLocation,
        zoom: 12,
        mapTypeId: 'roadmap'
    };
    this.map = new google.maps.Map(document.getElementById('venueprofilemap'), mapOptions);
    if (active) {
      this.createMarker(lat, lng, active);
    }
  }

  createMarker(lat:Number, lng:Number, active:Boolean) {
    
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, lng), 
    });

    if (!active)
      marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");

    // custom info on popup
    var infocontent = "<b>"+this.venuename+"</b><br>"+this.address;
    google.maps.event.addListener(marker, 'click', function() {
      let infowindow = new google.maps.InfoWindow({
        content: infocontent
      });
      infowindow.open(this.map, this);
    });
  }



  queryVenueId(loginid: Number): Number {
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
            this.venueid = data[0].venueid;
            this.getMainVenueProfile(this.dbcservice.getPhpCommand('getVenuePhp'), this.venueid);
          }
    });
    return this.venueid;
  }


  getMainVenueProfile(phpCommand: string, vid: Number) {
    let url = phpCommand + "?venueid=" + vid; //this.retrieveScript;
    console.log(url);
    
    this.http.get(url)
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null && data.length>0) {
          this.venuename = data[0].venue_name;
          this.address = data[0].address;
          this.pocname = data[0].pocname;
          this.pocemail = data[0].pocemail;
          this.pocphone = data[0].pocphone;
          this.latitude = data[0].latitude;
          this.longitude = data[0].longitude;
          this.showMap(true, this.latitude, this.longitude);
          this.getVenueHistoryList(this.dbcservice.getPhpCommand('getVenueHistoryPhp'), vid);
        }        
    });        
  }

  getVenueHistoryList(phpCommand: string, vid: Number){
    let url = phpCommand + "?venueid=" + vid; 
    this.http.get(url)
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null && data.length>0) {
          this.events = data;
        }        
    }); 
  }

  goToRatingsPage(index: number) {
    let eventid = 3;
    let ename = "Test Event";

    if (this.events!=null) {
      eventid = this.events[index].eventid;
      ename = this.events[index].event_name;
    }
    
    this.navCtrl.push(RatingsPage, {
      eventid: eventid,
      eventname: ename
    });

    this.toastCtrl.presentToast('Rate Volunteers at this event. Help them earn ServAce points!');
  }

}

