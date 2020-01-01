import { ToastService } from './../../services/toast-service';
import { GlobalProvider } from './../../providers/global/global';
import { DbConnectionService } from './../../services/DbConnectionService';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Time } from '@angular/common';

declare var google;
/**
 * Generated class for the NewcoordinatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class VenueEventsPage {
  formg: FormGroup;
  showForm: boolean = true;
  pageMessage: string = "Register"

  public rdata: Array<any>;
  public connection : {};

  public venueid: Number;
  
  ename: string;
  desc: string;
  stdate: Date;
  sttime: Time;
  enddate: Date;  
  endtime: Time;
  numstaff: Number;
  eppp: Number;

  default_values: any = [{
    ename: "",
    desc: "",
    stdate: "1", // offset from now
    sttime: "06:00:00",
    enddate: "2", // offset from now
    endtime: "18:00:00",
    numstaff: "1",
    eppp: "50"
  }];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public dbcservice: DbConnectionService, public formBuilder:FormBuilder, public globalProvider: GlobalProvider, private toastCtrl: ToastService) {
    this.connection = this.dbcservice.getDbConnectionData();

    this.formg = formBuilder.group({
      "ename": [this.default_values[0].ename, Validators.nullValidator],
      "desc": [this.default_values[0].desc],
      "stdate": [this.default_values[0].stdate, Validators.nullValidator], 
      "sttime": [this.default_values[0].sttime], 
      "enddate": [this.default_values[0].enddate, Validators.nullValidator], 
      "endtime": [this.default_values[0].endtime],
      "numstaff": [this.default_values[0].numstaff, Validators.required],
      "eppp": [this.default_values[0].eppp, Validators.nullValidator]
    });
  }
  
  initializeFields() {
    this.ename = this.default_values[0].ename;
    this.desc= this.default_values[0].desc;
    this.stdate= Date.now + this.default_values[0].stdate;
    this.sttime= this.default_values[0].sttime;
    this.enddate= Date.now + this.default_values[0].enddate; 
    this.endtime= this.default_values[0].endtime;
    this.numstaff= this.default_values[0].numstaff;
    this.eppp= this.default_values[0].eppp;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewcoordinatorPage');
  }

  ionViewWillEnter(){
    this.venueid = this.queryVenueId(this.globalProvider.getLoginId());
    this.initializeFields();
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
          }
    });
    return this.venueid;
  }

  
  onRegister() {
    this.insertRegistration(this.venueid, 
      this.formg.controls.ename.value, 
      this.formg.controls.desc.value,
      this.formg.controls.stdate.value,
      this.formg.controls.sttime.value,
      this.formg.controls.enddate.value,     
      this.formg.controls.endtime.value,
      this.formg.controls.numstaff.value,
      this.formg.controls.eppp.value
    );
  }

  insertRegistration(vid:Number, enm:string, ede:string, sdt:Date, stm:Time, edt:Date, etm:Time, nst:Number, ppp:Number) {
    

    
    let svid:string = vid.toString();
    let senm:string = enm;
    let sede:string = ede;
    let ssdt:string = sdt.toString();
    let sstm:string = stm+":00";
    let sedt:string = edt.toString();
    let setm:string = etm+":00";
    let snst:string = nst.toString();
    let sppp:string = ppp.toString();

    console.log(svid+"||"+senm+"||"+sede+"||"+ssdt+
    "||"+sstm+"||"+sedt+"||"+setm+
    "||"+snst+"||"+sppp);

    var url = this.dbcservice.getPhpCommand('setEventPhp');
    url = url + "?venueid=" + svid;
    url = url + "&ename=" + senm;
    url = url + "&edesc=" + sede; 
    url = url + "&estdate=" + ssdt;
    url = url + "&esttime=" + sstm;
    url = url + "&eenddate=" + sedt;
    url = url + "&eendtime=" + setm;
    url = url + "&enumstaff=" + snst;
    url = url + "&eppp=" + sppp;
    
    var stat: boolean = false;
    var err:string;

    var params = new FormData();
    params.append('venueid', svid);
    params.append('ename', senm);
    params.append('edesc', sede);
    params.append('estdate', ssdt);
    params.append('esttime', sstm);
    params.append('eenddate', sedt);
    params.append('eendtime', setm);
    params.append('enumstaff', snst);
    params.append('eppp', sppp);
    
    console.log(params);
    console.log(url);
    this.http.get(url)
   //this.http.post(url, params)
      .map(response => response.json())
        .subscribe(data => {
          if (data.code == 0) {
            // insertion success
            this.showForm = false;
            stat = true;
          }
          this.pageMessage = (stat) ? "Event Add successful." : ("Event Add Error: " + data.desc);
          if (stat) {
            //this.goToBookingsPage(this.eventid, this.vid, this.vpercent);
        }
    });
  }

}
