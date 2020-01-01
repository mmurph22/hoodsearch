import { GlobalProvider } from './../../providers/global/global';
import { DbConnectionService } from './../../services/DbConnectionService';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { SignupPage } from '../signup/signup';

declare var google;
/**
 * Generated class for the OpportunitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-opportunities',
  templateUrl: 'opportunities.html',
})
export class OpportunitiesPage {
  public connection : {};
  map: any;
  currentLocation: any;
  public eventid: string;
  public vid: string;  
  events: Array<any>;

  
  latitude: Number = 40.0;
  longitude: Number = -75.0;
  keyword: String;
  searchType: String;
  distance: Number;


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public dbcservice: DbConnectionService, public globalProvider: GlobalProvider) {
    this.connection = this.dbcservice.getDbConnectionData();

  }

  ionViewWillEnter() {
    this.queryUserId(this.globalProvider.getLoginId());
    this.getOpportunitiesList(this.dbcservice.getPhpCommand('getOpportunitiesPhp'));
  }

  /*ionViewDidLoad() {
    this.queryEvents();
  }*/

  queryUserId(loginid: Number) {
    var stat: boolean = false;
    var err:string;

    var url = this.dbcservice.getPhpCommand('getUserInfoPhp');
    var params = new FormData();
    params.append('loginid', loginid.toString());
    console.log(url);
    this.http.post(url, params)
      .map(response => response.json())
        .subscribe(data => {
          if (data!=null && data.length>0) {
            console.log(data[0]);
            this.vid = data[0].vid;
            //this.getOpportunitiesList(this.dbcservice.getPhpCommand('getOpportunitiesPhp'));
          }
    });
  }

  getOpportunitiesList(phpCommand: string){
    let url = phpCommand; 
    this.http.get(url)
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null) {
          this.events = data;
          this.queryEvents(data);
        }        
    }); 
  }

  queryEvents(the_events) {
    this.currentLocation = new google.maps.LatLng(this.latitude, this.longitude);
    
    let mapOptions = {
        center: this.currentLocation,
        zoom: 12,
        mapTypeId: 'roadmap'
    };
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    if (the_events) {

    // set map bounds
    var bounds = new google.maps.LatLngBounds();
    for (let i=0; i<the_events.length; i++) {
      let active = the_events[i].vols_required>0;
      this.createMarker(the_events[i], bounds, active);
    }
    this.map.fitBounds(bounds);
    }
  }

  createMarker(place, bounds, active) {
    
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(place.latitude, place.longitude), 
    });

    if (!active)
      marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");

    // custom info on popup
    var infocontent = "<b>" + place.venue_name + "</b><br>" +
    place.address + "<br>" +
    "Event: " + place.event_name + "<br>" +
    "Volunteers Needed: " + place.vols_required;

    google.maps.event.addListener(marker, 'click', function() {
      let infowindow = new google.maps.InfoWindow({
        content: infocontent
      });
      infowindow.open(this.map, this);
    });

    // set map bounds
    if (bounds)
      bounds.extend(marker.position);
  }

  goToSignupPage(index) {
    let eid = 0;
    if (this.events && this.events.length>index)
      eid = this.events[index].eventid;

    //alert(eid);
    this.navCtrl.push(SignupPage, {
      eventid: eid,
      vid: this.vid,
    });
  }

}
