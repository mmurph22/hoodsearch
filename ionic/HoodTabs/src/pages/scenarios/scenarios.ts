import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResultsPage } from './../results/results';
import { SurveysPage } from './../surveys/surveys';
import { GlobalProvider } from './../../providers/global/global';
import { DbConnectionService } from './../../services/DbConnectionService';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { SignupPage } from '../signup/signup';
import { Time } from '@angular/common';
import { queryFeatures, getFeature, IQueryFeaturesResponse } from '@esri/arcgis-rest-feature-layer';

declare var google;
/**
 * Generated class for the ScenariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scenarios',
  templateUrl: 'scenarios.html',
})
export class ScenariosPage {

  formg: FormGroup;
  showForm: boolean = true;
  pageMessage: string = "Scenario";

  public connection : {};
  map: any;
  currentLocation: any;
  public eventid: string;
  public vid: string;
  
  /* main table for display */
  public scntable: Array<any> = new Array<any>();

  
  latitude: Number = 40.0;
  longitude: Number = -75.0;
  keyword: String;
  searchType: String;
  distance: Number;

  action: Number; // button click action
  survey_name: string; // new scenario name
  CreationDate: Date;
  EditDate: Time;

  DEF_VAL: any = [{   
    survey_name: "Template Scenario",
    CreationDate: Date.now, // offset from now
    EditDate: Date.now
  }];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public dbcservice: DbConnectionService, public globalProvider: GlobalProvider, private formBuilder: FormBuilder) {
    
    this.connection = this.dbcservice.getDbConnectionData();
    this.formg = this.formBuilder.group({
      "survey_name": [this.DEF_VAL[0].survey_name],
      "CreationDate": [this.DEF_VAL[0].CreationDate, Validators.nullValidator], 
      "EditDate": [this.DEF_VAL[0].EditDate], 
    });
  }
  ngOnInit() {}

  initializeFields() {
    this.survey_name = this.DEF_VAL[0].survey_name;
    this.CreationDate = this.DEF_VAL[0].CreationDate;
    this.EditDate = this.DEF_VAL[0].EditDate;
  }

  ionViewWillEnter() {
    this.initializeFields();
    this.queryUserId(this.globalProvider.getLoginId());
    this.getScenariosList(this.globalProvider.getLoginId());
  }

  queryUserId(loginid: Number) {
    var stat: boolean = false;
    var err:string;

    //var url = this.dbcservice.getPhpCommand('getUserInfoPhp797');
    var url = this.dbcservice.getPhpCommand('getUserInfoPhp');
    var params = new FormData();
    params.append('loginid', loginid.toString());
    this.http.post(url, params)
      .map(response => response.json())
        .subscribe(data => {
          if (data!=null && data.length>0) {
            console.log(data[0]);
            this.vid = data[0].vid;
          }
    });
  }

  getSurveysFromSurvey123(response) {
    console.log(response);
    var qfr = (response as IQueryFeaturesResponse);
    const ftrs = qfr.features;
    
    // clear table
    if (this.scntable!=null)  {
      this.scntable.splice(0, this.scntable.length)
    }

    // refill table from Survey123
    ftrs.forEach( (ftr) => {
      /*console.log(
        ftr.attributes['survey_name'] + ":"+ 
        ftr.attributes['globalid'] + ":" + 
        ftr.attributes['CreationDate'] + ":" + 
        ftr.attributes['EditDate']);
      */
     //console.log(ftr.attributes);
      if (this.scntable!=null)  {
        
        // convert date formats
        ftr.attributes['CreationDate'] = new Date(ftr.attributes['CreationDate']).toLocaleString();
        ftr.attributes['EditDate'] = new Date(ftr.attributes['EditDate']).toLocaleString();
        
        this.scntable.push(ftr.attributes);
      }
    });
  }

  getScenariosList(credential: Number){
    var stat: boolean = false;
    var url = this.dbcservice.getPhpCommand('getScenariosPhp');
    const arcurl = this.dbcservice.getRestCommand('surveyDataUrl');
    
    //const arcurl = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
    /*getFeature({
      arcurl,
      id: 32
    }).then(feature => {
     console.log(feature.attributes.FID); // 32
    });*/

    //arcurl = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3";
    const fparams = {
        //where: "STATE_NAME = 'Alaska'"
        where: "survey_userid = '" + credential.toString()+"'",
        outFields: ['survey_name', 'survey_userid', 'objectid', 'globalid', 'CreationDate', 'EditDate']
        //outFields: "*"
    }

    queryFeatures({
      url: arcurl, 
      params: fparams
    }).then(response => {
      this.getSurveysFromSurvey123(response);
    });
  }

  goToSurveyPage(index) {
    let s123id = -1;
    if ((this.scntable!=null) && this.scntable.length>index)
      s123id = this.scntable[index].objectid;
    
    //alert("scenarios:goToSurveyPage");
    this.navCtrl.push(SurveysPage, { survey123id: s123id 
    });
  }

  executeResults(index) {
    let eid = 0;
    let gid = "";
    if ((this.scntable!=null) && this.scntable.length>index) {
      eid = this.scntable[index].objectid;
      gid = this.scntable[index].globalid;
    }

    //alert("TBD: Firing the geoprocessor here: " + gid);
    this.goToResultsPage(index);
  }

  goToResultsPage(index) {
    let sid:string = "default";
    let stitle:string = "";
    if ((this.scntable!=null) && this.scntable.length>index) {
      sid = this.scntable[index].globalid;
      stitle = this.scntable[index].survey_name;
    }
    
    console.log("ScenarioPage is passing to Results: " + sid + " from index["+index+"]");
    this.navCtrl.push(ResultsPage, { surveyid: sid, surveytitle: stitle });
  }

  //*******
  // Not used: Survey123 now managing surveys
  //******* */ 
  
  newScenario() {
    //alert("TBD");
    //let dtnow:Date = Date.now.prototype;

    this.insertScenario(
      this.globalProvider.getLoginId(),
      this.formg.controls.nsname.value,
      'init',
      "99",
      this.formg.controls.stdate.value,
      this.formg.controls.sttime.value, // Time not supported
      this.formg.controls.stdate.value,
      this.formg.controls.sttime.value, // Time not supported
      3);

      //now refresh
      this.getScenariosListFromDb(this.globalProvider.getLoginId());

  }

  getScenariosListFromDb(credential: Number){
    var stat: boolean = false;
    var url = this.dbcservice.getPhpCommand('getScenariosPhp');

    // to use GET, comment this
    var params = new FormData();
    params.append('userid', credential.toString());
    
    console.log(url);
    this.http.post(url, params)

    // to use POST, comment this out
    //url = url + "?uname=" + credential;    
    //console.log(url);
    //this.http.get(url)
    
    .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        if (data!=null) {
          this.scntable = data;
        }        
    }); 
  }

  insertScenario(uid:Number, scnname:string, sid:string, s123id:string, create_date:Date, create_time:Number, update_date:Date, update_time:Number, rating:Number) {
    
    let suid:string = uid.toString();
    let sscnname:string = scnname;
    let ssid:string = sid;
    let ss123id:string = s123id;
    let screate_date:string = create_date.toString();
    let screate_time:string = create_time+":00";
    let supdate_date:string = update_date.toString();
    let supdate_time:string = update_time+":00";
    let srating:string = rating.toString();

    console.log(suid+"||"+sscnname+"||"+ssid+"||"+ss123id+"||"+
    screate_date+"||"+screate_time+"||"+supdate_date+"||"+supdate_time+"||"+
    srating);

    var url = this.dbcservice.getPhpCommand('setScenarioPhp');
    url = url + "?userid=" + suid;
    url = url + "&name=" + sscnname;
    url = url + "&surveyid=" + ssid;
    url = url + "&s123id=" + ss123id; 
    //url = url + "&create_date=" + screate_date;
    //url = url + "&screate_time=" + screate_time; // not supported yet
    //url = url + "&update_date=" + supdate_date;
    //url = url + "&supdate_time=" + supdate_time; // not supported yet
    //url = url + "&rating=" + srating;
    
    var stat: boolean = false;
    var err:string;

    var params = new FormData();
    params.append('userid', suid);
    params.append('name', sscnname);
    params.append('surveyid', ssid);
    params.append('s123id', ss123id);
    //params.append('create_date', screate_date);
    //params.append('create_time', screate_time); // not supported yet
    //params.append('update_date', supdate_date);
    //params.append('update_time', supdate_time); // not supported yet
    //params.append('rating', srating);
    
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
          this.pageMessage = (stat) ? "Scenario Add successful." : ("Scenario Add Error: " + data.desc);
        });
  }

}
