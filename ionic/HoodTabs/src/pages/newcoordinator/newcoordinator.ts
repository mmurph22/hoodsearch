import { ToastService } from './../../services/toast-service';
import { DbConnectionService } from './../../services/DbConnectionService';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var google;
/**
 * Generated class for the NewcoordinatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-newcoordinator',
  templateUrl: 'newcoordinator.html',
})
export class NewCoordinatorPage {
  formg: FormGroup;
  showForm: boolean = true;
  pageMessage: string = "Register"

  public rdata: Array<any>;
  public connection : {};
  
  uname: string;
  passwd: string;

  vname: string;
  loc: string;
  public lat: Number;
  public lng: Number;

  fname: string;
  lname: string;
  email: string;
  phone: string;

  public map: any = [];
  public marker: any = [];
  public currentLocation: any;

  DEF_VAL = [{   
    uname: "testc",
    passwd: "default", 
    vname: "Test Venue",
    loc: "LeFrak Hall College Park, MD",
    lat:38.9838, 
    lng:-76.9461, 
    fname: "Testy",
    lname: "Usery",
    email: "testy@usery.org",
    phone: "444-123-4567"
}];

  //DEF_POS = [{lat:38.9838, lng:-76.9461}];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public dbcservice: DbConnectionService, public formBuilder:FormBuilder, public toastCtrl: ToastService) {
    this.connection = this.dbcservice.getDbConnectionData();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewcoordinatorPage');
    this.showMap(false, this.DEF_VAL[0].lat, this.DEF_VAL[0].lng);
  }

  ngOnInit() {
    this.formg = this.formBuilder.group({
      
      "uname": [this.DEF_VAL[0].uname],
      "passwd": [this.DEF_VAL[0].passwd, Validators.required],
      "vname": [this.DEF_VAL[0].vname],
      "loc": [this.DEF_VAL[0].loc],
      "lat":[this.DEF_VAL[0].lat, Validators.required],
      "lng":[this.DEF_VAL[0].lng, Validators.required],
      "fname": [this.DEF_VAL[0].fname],
      "lname": [this.DEF_VAL[0].lname],
      "email": [this.DEF_VAL[0].email, Validators.required],
      "phone": [this.DEF_VAL[0].phone, Validators.required]
    });

    this.uname = this.DEF_VAL[0].uname;
    this.passwd = this.DEF_VAL[0].passwd;
    this.vname = this.DEF_VAL[0].vname;
    this.loc = this.DEF_VAL[0].loc;
    this.lat = this.DEF_VAL[0].lat;
    this.lng = this.DEF_VAL[0].lng;
    this.fname = this.DEF_VAL[0].fname;
    this.lname = this.DEF_VAL[0].lname;
    this.email = this.DEF_VAL[0].email;
    this.phone = this.DEF_VAL[0].phone;

  }

  onRegister() { /*
    this.insertRegistration( 
      this.formg.controls.uname.value, 
      this.formg.controls.passwd.value,
      this.formg.controls.fname.value,
      this.formg.controls.lname.value,
      this.formg.controls.email.value,     
      this.formg.controls.phone.value,
      this.formg.controls.vname.value,
      this.formg.controls.loc.value,
      this.formg.controls.lat.value,
      this.formg.controls.lng.value,
    );*/

    this.insertRegistration( 
      this.uname, 
      this.passwd,
      this.fname,
      this.lname,
      this.email,     
      this.phone,
      this.vname,
      this.loc,
      this.lat,
      this.lng
    );
  }

  insertRegistration(un:string, pw:string, fn:string, ln:string, em:string, ph:string, vn:string, loc:string, lat:Number, lng:Number) {
    console.log(un+":::"+pw+":::"+ln+":::"+em+":::"+ph+":::"+vn+":::"+loc+":::"+lat+":::"+lng);
    
    var stat: boolean = false;
    var err:string;

    var url = this.dbcservice.getPhpCommand('setCoordinatorsPhp');
    var params = new FormData();

    params.append('uname', un);
    params.append('pwd', pw);
    params.append('pocname', fn + " " + ln);
    params.append('email', em);
    params.append('phone', ph);
    params.append('venue', vn);
    params.append('location', loc);
    if (lat!= null)
      params.append('lat', lat.toString());
    if (lng!=null)
      params.append('lng', lng.toString());
    
    //alert(un + " " + pw + " " + fn + " " + ln + " " + em);
    console.log(params);
    console.log(url);
    this.http.post(url, params)
      .map(response => response.json())
        .subscribe(data => {
          console.log(data.code + " : " + data.desc);
          if (data.code == 0) {
            // insertion success
            this.showForm = false;
            stat = true;
          }
          this.pageMessage = (stat) ? "Volunteer Registration successful." : ("Registration Error: " + data.desc);
          this.toastCtrl.presentToast(this.pageMessage);
    });
  }

  showMap(active:Boolean, lat:Number, lng:Number) {
    this.currentLocation = new google.maps.LatLng(lat, lng);

    let mapOptions = {
        center: this.currentLocation,
        zoom: 8,
        mapTypeId: 'roadmap'
    };
    this.map = new google.maps.Map(document.getElementById('venuemap'), mapOptions);

    google.maps.event.addListener(this.map, 'click', (event) => {	
      
      console.log(this);
      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: event.latLng, 
      });
      console.log("event latLng" + event.latLng);

      console.log(this.marker);
      if (this.marker!=null) {
          this.lat = this.marker.getPosition().lat();
          this.lng = this.marker.getPosition().lng();
        console.log('test ' + this.lat + "||" + this.lng);
      }
  
      var infocontent = "<b>Estimated Venue Location</b>"
      google.maps.event.addListener(this.marker, 'click', () => {
        let infowindow = new google.maps.InfoWindow({
          content: infocontent
        });
        infowindow.open(this.map, this.marker);
      });
    }); // addListener click map
  }

}
