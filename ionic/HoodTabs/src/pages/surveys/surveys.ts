import { ResultsPage } from './../results/results';
import { Component, SecurityContext } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
import { GlobalProvider } from './../../providers/global/global';
import { DbConnectionService } from './../../services/DbConnectionService';
import { Http } from '@angular/http';

/**
 * Generated class for the SurveysPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-surveys',
  templateUrl: 'surveys.html',
})
export class SurveysPage {
  LBRAC:string = "{{ "
  RBRAC:string = " }}"

  surveyurl_base: string = "https://survey123.arcgis.com/share/de76d0709d19439e80e888af183aafa1"
  surveyurl_newid: string = "?field:survey_userid="
  surveyurl_edit:string = "?mode=edit&objectId="
  survey123id:Number = -1;
  surveyuserid:Number = -1;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public sanitizer: DomSanitizer, public http: Http, 
    public dbcservice: DbConnectionService, public globalProvider: GlobalProvider) {
      this.surveyuserid = this.globalProvider.getLoginId(); //init
      this.survey123id = this.navParams.get('survey123id');  
  }

  initializeFields() {
  }

  ionViewWillEnter() {
    this.survey123id = -1; //init
    this.surveyuserid = this.globalProvider.getLoginId(); //init
    this.survey123id = this.navParams.get('survey123id');  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SurveysPage');
  }

  getSurveyUrl() {
    let fullurl:string = ""
    // if survey12id>=0, then open an existing survey for edit
    //alert("s123 is enabled");
    if ((this.survey123id) && (this.survey123id>=0)) {
      fullurl = this.surveyurl_base + this.surveyurl_edit + this.survey123id.toString();
    }
    // else this is a new survey
    else {
      fullurl = this.surveyurl_base + this.surveyurl_newid + this.surveyuserid;
    }
    //alert("s123"+ " = " + fullurl );
    //return this.sanitizer.sanitize(SecurityContext.HTML, fullurl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullurl);
  }

  executeResults() {
    let sid:string = "default";
    let stitle:string = "Harford County Viewer";    

    this.navCtrl.push(ResultsPage, { surveyid: sid, surveytitle: stitle });
  }

}
