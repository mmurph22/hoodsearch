import { ToastService } from './../../services/toast-service';
import { DbConnectionService } from './../../services/DbConnectionService';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the NewvolunteerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-newvolunteer',
  templateUrl: 'newvolunteer.html',
})
export class NewVolunteerPage {
  formg: FormGroup;
  showForm: boolean = true;
  pageMessage: string = "Register"

  public rdata: Array<any>;
  public connection : {};
  
  uname: string;
  passwd: string;
  fname: string;
  lname: string;
  email: string;

  DEF_VAL = [{   
    uname: "hoods",
    passwd: "default",  
    fname: "Henry",
    lname: "Hood",
    email: "hoody@hoodsearch.org"
}];


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public dbcservice: DbConnectionService, public formBuilder:FormBuilder, private toastCtrl: ToastService) {
    this.connection = this.dbcservice.getDbConnectionData();
  }

  ngOnInit() {
    this.formg = this.formBuilder.group({
      "uname": [this.DEF_VAL[0].uname],
      "passwd": [this.DEF_VAL[0].passwd, Validators.required],
      "fname": [this.DEF_VAL[0].fname],
      "lname": [this.DEF_VAL[0].lname],
      "email": [this.DEF_VAL[0].email, Validators.required]
    });

    this.uname = this.DEF_VAL[0].uname;
    this.passwd = this.DEF_VAL[0].passwd;
    this.fname = this.DEF_VAL[0].fname;
    this.lname = this.DEF_VAL[0].lname;
    this.email = this.DEF_VAL[0].email;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewvolunteerPage');
  }

  onRegister() {
    this.insertRegistration(this.dbcservice.getPhpCommand('setVolunteersPhp'), 
      this.formg.controls.uname.value, 
      this.formg.controls.passwd.value,
      this.formg.controls.fname.value,
      this.formg.controls.lname.value,
      this.formg.controls.email.value
    );
  }

  insertRegistration(phpCommand: string, un: string, pw:string, fn:string, ln:string, em:string) {
    var stat: boolean = false;
    var err:string;

    var url = phpCommand;
    var params = new FormData();

    params.append('uname', un);
    params.append('pwd', pw);
    params.append('fname', fn);
    params.append('lname', ln);
    params.append('email', em);
    
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
          this.pageMessage = (stat) ? "Researcher Registration successful." : ("Registration Error: " + data.desc);
          this.toastCtrl.presentToast(this.pageMessage);
    });
  }

}
