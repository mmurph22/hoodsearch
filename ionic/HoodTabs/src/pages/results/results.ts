import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';

/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-results',
  templateUrl: 'results.html',
})
export class ResultsPage {

  SURVEYID_DEFAULT: string = "";
  SURVEYTITLE_DEFAULT: string = "Harford County Viewer";
  RESULTSURL_DEFAULT: string = "http://umdmpsgis.maps.arcgis.com/apps/opsdashboard/index.html#/0131755b4c144db2a50e61e5974c685f"; // use direct
  RESULTSURL_1: string = "http://umdmpsgis.maps.arcgis.com/apps/opsdashboard/index.html#/7a2e002ead9e45c182a381b6c66abaae";
  RESULTSURL_2: string = "http://umdmpsgis.maps.arcgis.com/apps/opsdashboard/index.html#/456293e4b66946afab7b001164a4d8c4"
  RESULTSURL_3: string = "http://umdmpsgis.maps.arcgis.com/apps/opsdashboard/index.html#/797ccc00c70e4b159194ca30b4d50fd3";
  
  //RESULTSURL_DEFAULT: string = "http://arcg.is/1jT1q8";
  //RESULSURL_1: string = "http://arcg.is/114uTf";
  //RESULSURL_2: string = "http://arcg.is/0bPLOD"
  //RESULSURL_3: string = "http://arcg.is/1Xmz51";


  // we will map static surveys to reuslt here, for lookup
  public survey_results_map: Map<string, string>;
  public surveyid: string = this.SURVEYID_DEFAULT;
  public surveytitle: string = this.SURVEYTITLE_DEFAULT;
  private _keysize: number = 8;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public sanitizer: DomSanitizer) {
    this.setup();
  }

  ionViewWillEnter() {
    this.setup();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultsPage');
  }
  setup() {
    this.survey_results_map = new Map<string, string>();
    this.setResultsMapping(this._keysize);
    this.surveyid = this.navParams.get('surveyid');
    this.surveytitle = this.SURVEYTITLE_DEFAULT;
    if (this.navParams.get('surveytitle') != "")
      this.surveytitle = this.navParams.get('surveytitle');
  }

  /* This section provides implementation for static presentation. 
   * In this case, we need to swap sample maps based on results requested.
   * The results are identified by surveyid 
   */
  setResultsMapping(numchars:number) {
    this.survey_results_map.set("default", this.RESULTSURL_DEFAULT); // default, in case no match
    
    this.survey_results_map.set( 
      this.guidToString("{995c0601-bc77-43b1-8186-3edd46397699}", numchars), this.RESULTSURL_1); // HoodSearchOD_One: A Place for Joe
    this.survey_results_map.set( 
      this.guidToString("{8e5b16e5-8f58-4406-8665-ee3ed0a6ffe7}", numchars), this.RESULTSURL_2); // HoodSearchOD_Two: Rural with Older Kids
    this.survey_results_map.set( 
      this.guidToString("{aa256b64-524c-486f-912f-4f9c0f096bd9}", numchars), this.RESULTSURL_3); // HoodSearchOD_Three: Kids with Many Wants

      console.log(this.survey_results_map);
  }

  // given a guid, return the 'n'th number of characters
  guidToString(guid:string, n:number) {
    let subguid:string = "";
    let stidx:number = 0;
    if (guid) {
      if (guid.startsWith("{")) {
        stidx++;
      }
      subguid = guid.substr(stidx, n);
    }
    return subguid;
  }

  getResultsUrl() {
    let fullurl:string = this.RESULTSURL_DEFAULT;
    let activesid: string = this.SURVEYID_DEFAULT;
    
    activesid = this.guidToString(this.surveyid, this._keysize);
    //console.log("surveyid = " + activesid);

    if (this.survey_results_map.has(activesid)) {
      fullurl = this.survey_results_map.get(activesid);
      //console.log("Results will display the map: " + fullurl);
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(fullurl);
  }
   
}
