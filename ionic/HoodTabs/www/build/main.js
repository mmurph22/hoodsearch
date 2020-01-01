webpackJsonp([1],{

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_login_service__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_toast_service__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__newcoordinator_newcoordinator__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__newvolunteer_newvolunteer__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__tabs_tabs__ = __webpack_require__(213);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, globalProvider, http, service, toastCtrl, dbcservice, formBuilder) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.globalProvider = globalProvider;
        this.http = http;
        this.service = service;
        this.toastCtrl = toastCtrl;
        this.dbcservice = dbcservice;
        this.formBuilder = formBuilder;
        this.opComplete = false;
        this.onRegister = function (params) {
            _this.toastCtrl.presentToast('Register User NOT USED. use other buttons.');
        };
        this.onSignupCoordinator = function (params) {
            _this.toastCtrl.presentToast('Gather login info for Coordinators.');
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__newcoordinator_newcoordinator__["a" /* NewCoordinatorPage */], {});
        };
        this.onSignupVolunteer = function (params) {
            _this.toastCtrl.presentToast('Gather login info for Researcher.');
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__newvolunteer_newvolunteer__["a" /* NewVolunteerPage */], {});
        };
        /*  Todo override this function with your logic
        =================================================*/
        this.onLogin = function (params) {
            _this.getLoginInfo(_this.formg.controls.uname.value, _this.formg.controls.pwd.value, 1); //1=login 
        };
        this.onLogout = function (params) {
            _this.getLogoutInfo(_this.globalProvider.getLoginName()); //0=logout 
        };
        this.data = this.service.getDataForLoginFlat();
        this.events = {
            "onLogin": this.onLogin,
            "onLogout": this.onLogout,
            "onRegister": this.onRegister
        };
        this.pageMessage = this.data['txtHaveAccount'];
        this.formg = formBuilder.group({
            "uname": ["", __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required],
            "pwd": ["", __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required],
        });
    }
    LoginPage.prototype.ionViewWillEnter = function () {
        //this.globalProvider.setLoginId(0); // equivalent to logout
        this.onLogout(0);
        this.opComplete = true;
    };
    LoginPage.prototype.getLoginInfo = function (credential, pwd, state) {
        var _this = this;
        var stat = false;
        var desc;
        var url = this.dbcservice.getPhpCommand('getLoginPhp');
        // to use GET, comment this
        var params = new FormData();
        params.append('uname', credential);
        params.append('pwd', pwd);
        params.append('state', state.toString());
        var preuname = (state == 0) ? this.globalProvider.getUserPublicName() : "";
        console.log(url);
        this.http.post(url, params)
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            if (data != null) {
                console.log(data);
                if (data.code == 0) {
                    // login/logout successful, now get credentials
                    if (state > 0) {
                        _this.getUserInfo(credential, true);
                    }
                    stat = true;
                }
                else {
                    // get error message
                    desc = data.desc;
                }
            }
            var msgtype = (state > 0) ? "Login" : "Logout";
            _this.pageMessage = (stat) ? (msgtype + " successful for " + (state > 0) ? _this.globalProvider.getUserPublicName() : preuname) : (msgtype + " Error: " + desc);
            if (stat) {
                //alert( this.globalProvider.getUserPublicName() + " " + this.globalProvider.getLoginRole());
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__tabs_tabs__["a" /* TabsPage */], { loginid: _this.globalProvider.getLoginId(), loginrole: _this.globalProvider.getLoginRole() });
            }
            _this.toastCtrl.presentToast(_this.pageMessage);
        });
    };
    LoginPage.prototype.getUserInfo = function (uname, asLogin) {
        var _this = this;
        var stat = false;
        var url = this.dbcservice.getPhpCommand('getUserInfoPhp');
        // to use GET, comment this
        var params = new FormData();
        params.append('uname', uname);
        console.log(url);
        this.http.post(url, params)
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            if (data != null && data.length > 0) {
                // user found, now get credentials
                var pname = (data[0].roleid == 2) ? (data[0].firstname + " " + data[0].lastname) : (data[0].pocname);
                _this.globalProvider.setLoginId(data[0].loginid);
                _this.globalProvider.setLoginRole(data[0].roleid);
                _this.globalProvider.setLoginName(uname);
                _this.globalProvider.setUserPublicName(pname);
                stat = true;
            }
        });
        return stat;
    };
    LoginPage.prototype.getLogoutInfo = function (credential) {
        var _this = this;
        var stat = false;
        var desc;
        var url = this.dbcservice.getPhpCommand('getLoginPhp');
        // if already logged out, do nothing
        if (this.globalProvider.getLoginId() == 0)
            return;
        // to use GET, comment this
        var params = new FormData();
        params.append('uname', credential);
        params.append('state', "0");
        var preuname = this.globalProvider.getUserPublicName();
        console.log(url);
        this.http.post(url, params)
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            if (data != null) {
                console.log(data);
                if (data.code == 0) {
                    // logout successful
                    stat = true;
                }
                else {
                    // get error message
                    desc = data.desc;
                }
            }
            _this.pageMessage = (stat) ? ("Logout successful for " + preuname) : (" Error in logout: " + desc);
            console.log(_this.pageMessage);
            _this.toastCtrl.presentToast(_this.pageMessage);
        });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
            selector: 'login-page',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\login\login.html"*/'<!--\n  Generated template for the LoginPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3>\n      <img logo src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMH3672YOSVynDVOvZ8LtRwV5x0O35lzJAh8VqAzqNfUnnDSMp&s" />\n    </ion-col>\n  </ion-row>\n</ion-header>\n\n<ion-content *ngIf="data != null">\n    <ion-grid no-padding>\n      <!-- logo -->\n      <ion-row header align-items-start align-items-stretch>\n        <!--<ion-col col-10 offset-1 col-md-6 offset-md-3>\n          <img logo src="{{data.logo}}" />\n        </ion-col>-->\n  \n      <!-- Section form>-->\n    <ion-col col-10 offset-1 col-md-6 offset-md-3>\n      <form padding [formGroup]="formg">\n        <ion-row align-items-start>\n          <ion-col col-12>\n            <div class="servace-banner">{{ data.title }}   <img class="prodicon" src="https://image.flaticon.com/icons/png/512/1028/1028047.png"/>\n              <br>{{ data.subtitle }}</div>\n          </ion-col>\n          <ion-col col-1>\n            \n          </ion-col>\n        </ion-row>\n        <ion-row col-12 offset-4>\n          <ion-label no-margin no-padding>{{ data.txtSignupnow }}</ion-label>\n        </ion-row>\n        <ion-row align-items-start>\n          <!-- Signup now buttons -->\n          <ion-col col-12 no-margin>\n            <button ion-button full text-uppercase (click)="onSignupVolunteer()">\n              {{data.btnSignupVolnow}}\n            </button>\n          </ion-col>\n          <!--<ion-col col-6 no-margin>\n            <button ion-button full text-uppercase (click)="onSignupCoordinator()">\n              {{data.btnSignupCoordnow}}\n            </button>\n          </ion-col>-->\n        </ion-row>\n        <!-- Input-field -->\n        <ion-row>\n          <ion-col col-12>\n            <div input-field>\n                <ion-row col-12 offset-4>\n                    <ion-label no-margin no-padding>{{pageMessage}}</ion-label>\n                </ion-row>\n              <!-- Input-field-text -->\n              <ion-item no-padding>\n                <ion-input formControlName="uname" type="text" [placeholder]="data.txtUsername" [(ngModel)]="username" [ngModelOptions]="{standalone: true}"></ion-input>\n  <!--               <ion-label no-margin *ngIf="!isUsernameValid">{{data.errorUser}}</ion-label>\n   -->            </ion-item>\n              <!-- Input-field-password -->\n              <ion-item no-padding>\n                <ion-input formControlName="pwd" type="password" [placeholder]="data.txtPassword" [(ngModel)]="password" [ngModelOptions]="{standalone: true}"></ion-input>\n                <!-- <ion-label no-margin *ngIf="!isPasswordValid">{{data.errorPassword}}</ion-label> -->\n              </ion-item>\n            </div>\n            <!-- Login button -->\n            <ion-col col-12 no-padding>\n              <button no-margin ion-button full text-uppercase (click)="onLogin()">{{data.btnLogin}}</button>\n            </ion-col>\n            <!-- Description -->\n            <div description text-center>\n              <ion-row>\n                <!-- Reset your password button -->\n                <!--<ion-col col-12 no-padding no-margin text-left>\n                  <p no-margin no-padding>{{data.txtForgotPassword}} <a>{{data.btnResetYourPassword}}</a> </p>\n                </ion-col> -->\n                <!-- Signup now button -->\n                <!--\n                <ion-col col-12 no-padding no-margin text-left>\n                  <p no-margin no-padding (click)="onRegister()">{{data.txtSignupnow}} <a>{{data.btnSignupnow}}</a> </p>\n                </ion-col>\n                -->\n              </ion-row>\n            </div>\n          </ion-col>\n        </ion-row>\n      </form>\n      </ion-col>\n          </ion-row>\n    </ion-grid>\n  </ion-content>\n\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\login\login.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_5__services_login_service__["a" /* LoginService */], __WEBPACK_IMPORTED_MODULE_6__services_toast_service__["a" /* ToastService */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_0__providers_global_global__["a" /* GlobalProvider */],
            __WEBPACK_IMPORTED_MODULE_9__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_5__services_login_service__["a" /* LoginService */], __WEBPACK_IMPORTED_MODULE_6__services_toast_service__["a" /* ToastService */],
            __WEBPACK_IMPORTED_MODULE_4__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveysPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__results_results__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(16);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the SurveysPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SurveysPage = /** @class */ (function () {
    function SurveysPage(navCtrl, navParams, sanitizer, http, dbcservice, globalProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.sanitizer = sanitizer;
        this.http = http;
        this.dbcservice = dbcservice;
        this.globalProvider = globalProvider;
        this.LBRAC = "{{ ";
        this.RBRAC = " }}";
        this.surveyurl_base = "https://survey123.arcgis.com/share/de76d0709d19439e80e888af183aafa1";
        this.surveyurl_newid = "?field:survey_userid=";
        this.surveyurl_edit = "?mode=edit&objectId=";
        this.survey123id = -1;
        this.surveyuserid = -1;
        this.surveyuserid = this.globalProvider.getLoginId(); //init
        this.survey123id = this.navParams.get('survey123id');
    }
    SurveysPage.prototype.initializeFields = function () {
    };
    SurveysPage.prototype.ionViewWillEnter = function () {
        this.survey123id = -1; //init
        this.surveyuserid = this.globalProvider.getLoginId(); //init
        this.survey123id = this.navParams.get('survey123id');
    };
    SurveysPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SurveysPage');
    };
    SurveysPage.prototype.getSurveyUrl = function () {
        var fullurl = "";
        // if survey12id>=0, then open an existing survey for edit
        //alert("s123 is enabled");
        if ((this.survey123id) && (this.survey123id >= 0)) {
            fullurl = this.surveyurl_base + this.surveyurl_edit + this.survey123id.toString();
        }
        else {
            fullurl = this.surveyurl_base + this.surveyurl_newid + this.surveyuserid;
        }
        //alert("s123"+ " = " + fullurl );
        //return this.sanitizer.sanitize(SecurityContext.HTML, fullurl);
        return this.sanitizer.bypassSecurityTrustResourceUrl(fullurl);
    };
    SurveysPage.prototype.executeResults = function () {
        var sid = "default";
        var stitle = "Harford County Viewer";
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_0__results_results__["a" /* ResultsPage */], { surveyid: sid, surveytitle: stitle });
    };
    SurveysPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
            selector: 'page-surveys',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\surveys\surveys.html"*/'<!--\n  Generated template for the SurveysPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n  </ion-row>\n  <ion-navbar>\n    <div id="executeResults">\n      <ion-row>\n        <ion-col col-10 text-wrap>\n          <ion-title>HoodSearch Surveys</ion-title>\n        </ion-col>\n        <ion-col col-1.5 text-wrap>\n          <ion-button [enabled]="false" ><ion-badge name="gosurvey" large item-end float-right color="primary" (click)="executeResults()">Show Results</ion-badge></ion-button>\n        </ion-col>\n        <img class="prodicon" src="https://image.flaticon.com/icons/png/512/1028/1028047.png" />\n      </ion-row>\n      </div>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <div>\n    <ion-card>\n      <div class="embed-container">\n        <!--<ion-content overflow-scroll="true">-->\n          <iframe class="iframe" scrolling="yes" title="Survey Page" frameborder="0" marginheight="0" marginwidth="0" [src]="getSurveyUrl()"></iframe>\n        <!--</ion-content>-->\n      </div> \n    </ion-card>\n  </div>\n</ion-content>\n\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\surveys\surveys.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["c" /* DomSanitizer */], __WEBPACK_IMPORTED_MODULE_6__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_5__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_4__providers_global_global__["a" /* GlobalProvider */]])
    ], SurveysPage);
    return SurveysPage;
}());

//# sourceMappingURL=surveys.js.map

/***/ }),

/***/ 123:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 123;

/***/ }),

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RatingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_toast_service__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Generated class for the RatingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RatingsPage = /** @class */ (function () {
    function RatingsPage(navCtrl, navParams, http, dbcservice, globalProvider, formBuilder, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.globalProvider = globalProvider;
        this.formBuilder = formBuilder;
        this.toastCtrl = toastCtrl;
        this.connection = {};
        this.DEF_RATING = 0;
        // defaults 
        this.connection = this.dbcservice.getDbConnectionData();
        this.eventid = this.navParams.get("eventid");
        this.eventname = this.navParams.get("eventname");
    }
    RatingsPage.prototype.ngOnInit = function () {
        this.formg = this.formBuilder.group({
            items: this.formBuilder.array([])
        });
    };
    RatingsPage.prototype.createItem = function () {
        return this.formBuilder.group({
            firstname: '',
            lastname: '',
            percent: '',
            rating: ''
        });
    };
    RatingsPage.prototype.addItem = function () {
        this.items = this.formg.get('items');
        this.items.push(this.createItem());
    };
    RatingsPage.prototype.updateRatingData = function (i) {
        if (this.events.length > i) {
            var r = this.items.at(i).value.rating; //rating at slider
            this.events[i].rating = r;
        }
    };
    RatingsPage.prototype.updateRatingCtl = function (i) {
        var il = this.items.length;
        var el = this.events.length;
        console.log("items:" + il + " Events:" + el + " I:" + i);
        if (i < il && i < el) {
            var val = this.events[i].rating;
            // this.items.at(i).value.rating.updateValue(this.events[i].rating);
        }
    };
    RatingsPage.prototype.initializeFields = function () {
        var l = this.items.length;
        var i;
        for (i = 0; i < l; i++)
            this.updateRatingCtl(i);
    };
    /*
    onRate() {
    }
    */
    RatingsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad RatingsPage');
        this.getEventVolunteers(this.eventid);
    };
    RatingsPage.prototype.onRateSingle = function (i) {
        if (this.events.length > i) {
            this.insertRating(this.events[i].eventid, this.events[i].vid, this.events[i].rating);
        }
    };
    RatingsPage.prototype.getEventVolunteers = function (eventid) {
        var _this = this;
        var url = this.dbcservice.getPhpCommand('getEventVolunteersPhp') + "?eventid=" + eventid;
        this.http.get(url)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null && data.length > 0) {
                _this.events = data;
                _this.events.forEach(function (e) {
                    _this.addItem();
                });
                _this.initializeFields();
            }
        });
    };
    RatingsPage.prototype.insertRating = function (eid, vid, r) {
        var _this = this;
        var stat = false;
        var url = this.dbcservice.getPhpCommand('setVolunteersRatingsPhp');
        var params = new FormData();
        params.append('volid', vid.toString());
        params.append('eventid', eid.toString());
        params.append('rating', r.toString());
        //alert(vid + " " + eid + " " + r);
        console.log(params);
        console.log(url);
        this.http.post(url, params)
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            console.log(data.code + " : " + data.desc);
            stat = (data.code == 0);
            var msg = (stat) ? "Volunteer Rating successful. " : "Rating Error: ";
            var sub = (stat) ? "Thank you for helping our volunteers help you!" : data.desc;
            _this.pageMessage = msg + sub;
            _this.toastCtrl.presentToast(_this.pageMessage);
        });
    };
    RatingsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["n" /* Component */])({
            selector: 'page-ratings',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\ratings\ratings.html"*/'<!--\n  Generated template for the RatingsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n    <ion-row header align-items-start align-items-stretch>\n      <ion-col col-12 col-md-6 offset-md-3>\n        <img logo src="assets/imgs/ace_table_pan.png" />\n      </ion-col>\n    </ion-row>\n    <ion-navbar>\n      <ion-title>Rate Volunteers</ion-title>\n    </ion-navbar>\n </ion-header>\n\n<ion-content padding>\n    <form padding [formGroup]="formg">\n      <ion-card>\n        <ion-card-header>\n            <ion-label no-margin text-center><div class="servace-menu">Volunteers at {{eventname}}</div></ion-label>\n        </ion-card-header>\n\n        <ion-card-content>\n          <div class="table-hover">\n          <ion-list inset>\n            <ion-row>\n              <ion-col col-1 text-wrap>\n                <thead>First Name</thead>\n              </ion-col>             \n              <ion-col col-2 text-wrap>\n                <thead>Last Name</thead>\n              </ion-col>\n              <ion-col col-2 text-wrap>\n                <thead>% Time</thead>\n              </ion-col>\n              <ion-col col-7 text-wrap float-center>\n                <thead>Rating</thead>\n              </ion-col>\n            </ion-row>\n\n            <div formArrayName="items">\n              <ion-list *ngFor="let event of events; let i = index">\n                <div [formGroupName]="i" ><ion-row>\n                  <ion-col col-1 text-wrap>\n                    <ion-label ><td>{{ event.firstname }}</td></ion-label>\n                  </ion-col>\n                  <ion-col col-2 text-wrap>\n                    <ion-label ><td>{{ event.lastname }}</td></ion-label>\n                  </ion-col>\n                  <ion-col col-2 text-wrap>\n                    <ion-label ><td>{{ event.volperc }}%</td></ion-label>\n                  </ion-col>\n                  <ion-col col-6 text-wrap>\n                    <ion-item for="i" >\n                      <!--<ion-badge item-end>{{formg.controls.rating.value}}</ion-badge>-->  \n                      <ion-range (ionChange)="updateRatingData(i)" formControlName="rating" [ngModel]="event.rating" min="0" max="5" step="1" pin="true" snaps="true">\n                        <ion-label range-left>Not Set</ion-label>\n                        <ion-label range-right>5</ion-label>\n                      </ion-range>\n                      <ion-badge item-end>{{event.rating}}</ion-badge> \n                      <output class="range_output"></output> \n                    </ion-item>\n                  </ion-col>\n                  <ion-col col-1 text-wrap>\n                      <button ion-button text-center block fixed (click)="onRateSingle(i)">Rate</button>\n                  </ion-col>\n                </ion-row></div>\n              </ion-list>\n            </div>\n\n          </ion-list>\n          <ion-item>\n            <!--<button ion-button text-center block (click)="onRate()">Send Ratings</button>-->\n            <!--<button ion-button text-center block (click)="initializeFields()">Reset</button>-->\n          </ion-item> \n          </div>\n        </ion-card-content>\n      </ion-card>\n    </form>\n  </ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\ratings\ratings.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_6__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_0__providers_global_global__["a" /* GlobalProvider */],
            __WEBPACK_IMPORTED_MODULE_4__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_5__services_toast_service__["a" /* ToastService */]])
    ], RatingsPage);
    return RatingsPage;
}());

//# sourceMappingURL=ratings.js.map

/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DbConnectionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DbConnectionService = /** @class */ (function () {
    function DbConnectionService() {
        this.getDbConnectionData = function () {
            var data = {
                //server urls
                "remoteBaseUrl": 'http://129.2.24.226:8080/mps/mmurph22/geog797/HoodSearch/',
                "localBaseUrl": "http://localhost/:8101/",
                "testBaseUrl": "http://129.2.24.226:8080/mps/mmurph22/geog650/Final/",
                "PhpSuffix": ".php",
                "ImageCardPath": "../../assets/imgs/cards/",
                "ImagePokerPath": "../../assets/imgs/",
                "surveyDataUrl": "https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/service_9eb8e96e758340a59c7630dd2f166af1/FeatureServer",
                "restComQuery": "/0",
                // put all php command names here
                "getTest": "profile_get",
                "getTest2": "profilehistory_get",
                "setTest": "insert_collision",
                "getProfilePhp": "profile_get",
                "getProfileHistoryPhp": "profilehistory_get",
                "getOpportunitiesPhp": "opportunities_get",
                "getEventSignupPhp": "event_signup_get",
                "setEventSignupPhp": "event_signup_set",
                "getBookingsPhp": "bookings_get",
                "setVolunteersPhp": "volunteer_set",
                "setCoordinatorsPhp": "coordinator_set",
                "getVenuePhp": "venue_get",
                "getVenueHistoryPhp": "venuehistory_get",
                "setEventPhp": "event_set",
                "getEventVolunteersPhp": "eventvols_get",
                "setVolunteersRatingsPhp": "volratings_set",
                "getLoginPhp": "login_get",
                "getUserInfoPhp": "userinfo_get",
                // New PHP Here
                "getLoginPhp797": 'login_get',
                "getUserInfoPhp797": 'userinfo_get',
                "setUserInfoPhp797": 'userinfo_set',
                "getScenarioPhp": 'scenario_get',
                "setScenarioPhp": 'scenario_set',
                "getScenariosPhp": 'scenarios_get',
                "getRolePhp797": 'role_get'
            };
            return data;
        };
    }
    DbConnectionService.prototype.getPhpCommand = function (phpCommand) {
        var connection = this.getDbConnectionData();
        var url = connection['remoteBaseUrl'] + connection[phpCommand] + connection['PhpSuffix'];
        return url;
    };
    DbConnectionService.prototype.getRestCommand = function (phpCommand) {
        var connection = this.getDbConnectionData();
        var url = connection[phpCommand] + connection['restComQuery'];
        return url;
    };
    DbConnectionService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], DbConnectionService);
    return DbConnectionService;
}());

//# sourceMappingURL=DbConnectionService.js.map

/***/ }),

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../components/login/login-flat/login-flat.module": [
		322,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 166;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*
  Generated class for the GlobalProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var GlobalProvider = /** @class */ (function () {
    function GlobalProvider(http) {
        this.http = http;
        // Id for login
        this.login_id = 0; //  0 = not logged in
        // role of logged in user
        this.login_role = 2;
        console.log('Hello GlobalProvider Provider');
        this.login_id = 0;
        this.login_role = 2;
    }
    GlobalProvider.prototype.setLoginId = function (value) {
        this.login_id = value;
    };
    GlobalProvider.prototype.getLoginId = function () {
        return this.login_id;
    };
    GlobalProvider.prototype.setLoginRole = function (value) {
        this.login_role = value;
    };
    GlobalProvider.prototype.getLoginRole = function () {
        return this.login_role;
    };
    GlobalProvider.prototype.setUserPublicName = function (value) {
        this.vis_name = value;
    };
    GlobalProvider.prototype.getUserPublicName = function () {
        return this.vis_name;
    };
    GlobalProvider.prototype.setLoginName = function (value) {
        this.login_name = value;
    };
    GlobalProvider.prototype.getLoginName = function () {
        return this.login_name;
    };
    GlobalProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]])
    ], GlobalProvider);
    return GlobalProvider;
}());

//# sourceMappingURL=global.js.map

/***/ }),

/***/ 206:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VenuePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_toast_service__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ratings_ratings__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var VenuePage = /** @class */ (function () {
    function VenuePage(navCtrl, navParams, http, dbcservice, globalProvider, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.globalProvider = globalProvider;
        this.toastCtrl = toastCtrl;
        this.events = [];
        // defaults 
        this.connection = this.dbcservice.getDbConnectionData();
        this.imgcard = this.connection['ImagePokerPath'] + "chipcash.png";
    }
    VenuePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ProfilePage');
    };
    VenuePage.prototype.ionViewWillEnter = function () {
        this.venueid = this.queryVenueId(this.globalProvider.getLoginId());
    };
    VenuePage.prototype.showMap = function (active, lat, lng) {
        this.currentLocation = new google.maps.LatLng(lat, lng);
        var mapOptions = {
            center: this.currentLocation,
            zoom: 12,
            mapTypeId: 'roadmap'
        };
        this.map = new google.maps.Map(document.getElementById('venueprofilemap'), mapOptions);
        if (active) {
            this.createMarker(lat, lng, active);
        }
    };
    VenuePage.prototype.createMarker = function (lat, lng, active) {
        var marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(lat, lng),
        });
        if (!active)
            marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
        // custom info on popup
        var infocontent = "<b>" + this.venuename + "</b><br>" + this.address;
        google.maps.event.addListener(marker, 'click', function () {
            var infowindow = new google.maps.InfoWindow({
                content: infocontent
            });
            infowindow.open(this.map, this);
        });
    };
    VenuePage.prototype.queryVenueId = function (loginid) {
        var _this = this;
        var ret;
        var url = this.dbcservice.getPhpCommand('getUserInfoPhp');
        //url = url + "?loginid=" + loginid;
        var params = new FormData();
        params.append('loginid', loginid.toString());
        console.log(url);
        //this.http.get(url)
        this.http.post(url, params)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null && data.length > 0) {
                _this.venueid = data[0].venueid;
                _this.getMainVenueProfile(_this.dbcservice.getPhpCommand('getVenuePhp'), _this.venueid);
            }
        });
        return this.venueid;
    };
    VenuePage.prototype.getMainVenueProfile = function (phpCommand, vid) {
        var _this = this;
        var url = phpCommand + "?venueid=" + vid; //this.retrieveScript;
        console.log(url);
        this.http.get(url)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null && data.length > 0) {
                _this.venuename = data[0].venue_name;
                _this.address = data[0].address;
                _this.pocname = data[0].pocname;
                _this.pocemail = data[0].pocemail;
                _this.pocphone = data[0].pocphone;
                _this.latitude = data[0].latitude;
                _this.longitude = data[0].longitude;
                _this.showMap(true, _this.latitude, _this.longitude);
                _this.getVenueHistoryList(_this.dbcservice.getPhpCommand('getVenueHistoryPhp'), vid);
            }
        });
    };
    VenuePage.prototype.getVenueHistoryList = function (phpCommand, vid) {
        var _this = this;
        var url = phpCommand + "?venueid=" + vid;
        this.http.get(url)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null && data.length > 0) {
                _this.events = data;
            }
        });
    };
    VenuePage.prototype.goToRatingsPage = function (index) {
        var eventid = 3;
        var ename = "Test Event";
        if (this.events != null) {
            eventid = this.events[index].eventid;
            ename = this.events[index].event_name;
        }
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_1__ratings_ratings__["a" /* RatingsPage */], {
            eventid: eventid,
            eventname: ename
        });
        this.toastCtrl.presentToast('Rate Volunteers at this event. Help them earn ServAce points!');
    };
    VenuePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_4__angular_core__["n" /* Component */])({
            selector: 'page-venue',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\venue\venue.html"*/'<!--\n  Generated template for the VenuePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3>\n      <img logo src="assets/imgs/ace_table_pan.png" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar>\n    <ion-title>Venue Profile</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-card>\n    <ion-card-header text-center>\n      <ion-label no-margin text-center><ion-badge color="primary"><div class="servace-badge">{{venuename}}</div></ion-badge></ion-label>\n    </ion-card-header>\n\n    <ion-card-content>\n      <ion-row>\n        <ion-col col-6>\n          <div id="venueprofilemap"></div>\n          <ion-item no-padding>\n            <ion-icon name="loc" item-start></ion-icon>\n            <ion-label no-margin>Lat|Lng: <ion-badge float-right color="secondary">{{latitude}} | {{longitude}}</ion-badge></ion-label>\n          </ion-item>\n        </ion-col>\n        <ion-col col-6>\n          <ion-item no-padding>\n            <ion-icon name="list" item-start></ion-icon>\n            <ion-label no-margin>Address: \n            <ion-badge float-right color="secondary">{{address}}</ion-badge></ion-label>\n          </ion-item>\n          <ion-item no-padding>\n              <ion-icon name="person" item-start></ion-icon>\n              <ion-label no-margin no-padding>Point of Contact</ion-label>\n          </ion-item>\n          <ion-item no-padding>\n              \n              <ion-label no-margin>Name:\n              <ion-badge float-right color="secondary">{{pocname}}</ion-badge></ion-label>\n            </ion-item>\n          <ion-item no-padding>\n              \n              <ion-label no-margin>Email: \n              <ion-badge float-right color="secondary">{{pocemail}}</ion-badge></ion-label>\n            </ion-item>\n          <ion-item no-padding>\n              \n              <ion-label no-margin>Phone: \n              <ion-badge float-right color="secondary">{{pocphone}}</ion-badge></ion-label>\n            </ion-item>\n        </ion-col> \n      </ion-row>\n    </ion-card-content>\n  </ion-card>\n\n  <ion-card-header>\n    <ion-label text-center><div class="servace-menu">Venue Event History</div></ion-label>\n  </ion-card-header>\n  <ion-card-content>\n    <div class="table-hover">\n    <ion-list inset>\n      <ion-row>\n        <ion-col col-2 text-wrap>\n          <thead>Event</thead>\n        </ion-col>\n        <ion-col col-3 text-wrap>\n          <thead>Description</thead>\n        </ion-col>\n        <ion-col col-1 text-wrap>\n          <thead>Start Date</thead>\n        </ion-col>\n        <ion-col col-1 text-wrap>\n          <thead>End Date</thead>\n        </ion-col>\n        <ion-col col-2 text-wrap>\n          <thead>Plan Staff</thead>\n        </ion-col>\n      </ion-row>\n      <ion-item ion-item *ngFor="let event of events; let i = index" (click)="goToRatingsPage(i)">\n        <ion-row>\n          <ion-col col-2 text-wrap>\n            <td>{{ event.event_name }}</td>\n          </ion-col>\n          <ion-col col-3 text-wrap>\n            <td>{{ event.event_description }}</td>\n          </ion-col>\n          <ion-col col-1 text-wrap>\n            <td>{{ event.startdate }}</td>\n          </ion-col>\n          <ion-col col-1 text-wrap>\n            <td>{{ event.enddate }}</td>\n          </ion-col>\n          <ion-col col-2 text-wrap>\n            <td>{{ event.numstaff }}</td>\n          </ion-col>\n          <ion-col col-3 text-wrap>\n              <!--<ion-badge text-wrap item-end float-right full *ngIf="event.vols_assigned; else coveredBlock">Rate Effort ({{ event.badgepoints_pp }} Pts)</ion-badge>-->\n              <button ion-button text-center block text-wrap *ngIf="event.vols_assigned; else coveredBlock">Rate Effort ({{ event.badgepoints_pp }} Pts)</button>\n              <ng-template  #coveredBlock>\n                <!--<ion-badge item-end float-right color="light">No Volunteers ({{ event.badgepoints_pp }} SP)</ion-badge>-->\n                <button ion-button text-center block text-wrap color="light">No Volunteers ({{ event.badgepoints_pp }} SP)</button>\n              </ng-template>\n            </ion-col>\n        </ion-row>\n      </ion-item>  \n    </ion-list></div>\n  </ion-card-content>\n\n</ion-content>'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\venue\venue.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_3__services_DbConnectionService__["a" /* DbConnectionService */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_5_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_6__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_3__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_2__providers_global_global__["a" /* GlobalProvider */], __WEBPACK_IMPORTED_MODULE_0__services_toast_service__["a" /* ToastService */]])
    ], VenuePage);
    return VenuePage;
}());

//# sourceMappingURL=venue.js.map

/***/ }),

/***/ 207:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewVolunteerPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_toast_service__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the NewvolunteerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var NewVolunteerPage = /** @class */ (function () {
    function NewVolunteerPage(navCtrl, navParams, http, dbcservice, formBuilder, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.formBuilder = formBuilder;
        this.toastCtrl = toastCtrl;
        this.showForm = true;
        this.pageMessage = "Register";
        this.DEF_VAL = [{
                uname: "hoods",
                passwd: "default",
                fname: "Henry",
                lname: "Hood",
                email: "hoody@hoodsearch.org"
            }];
        this.connection = this.dbcservice.getDbConnectionData();
    }
    NewVolunteerPage.prototype.ngOnInit = function () {
        this.formg = this.formBuilder.group({
            "uname": [this.DEF_VAL[0].uname],
            "passwd": [this.DEF_VAL[0].passwd, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].required],
            "fname": [this.DEF_VAL[0].fname],
            "lname": [this.DEF_VAL[0].lname],
            "email": [this.DEF_VAL[0].email, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].required]
        });
        this.uname = this.DEF_VAL[0].uname;
        this.passwd = this.DEF_VAL[0].passwd;
        this.fname = this.DEF_VAL[0].fname;
        this.lname = this.DEF_VAL[0].lname;
        this.email = this.DEF_VAL[0].email;
    };
    NewVolunteerPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad NewvolunteerPage');
    };
    NewVolunteerPage.prototype.onRegister = function () {
        this.insertRegistration(this.dbcservice.getPhpCommand('setVolunteersPhp'), this.formg.controls.uname.value, this.formg.controls.passwd.value, this.formg.controls.fname.value, this.formg.controls.lname.value, this.formg.controls.email.value);
    };
    NewVolunteerPage.prototype.insertRegistration = function (phpCommand, un, pw, fn, ln, em) {
        var _this = this;
        var stat = false;
        var err;
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
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            console.log(data.code + " : " + data.desc);
            if (data.code == 0) {
                // insertion success
                _this.showForm = false;
                stat = true;
            }
            _this.pageMessage = (stat) ? "Researcher Registration successful." : ("Registration Error: " + data.desc);
            _this.toastCtrl.presentToast(_this.pageMessage);
        });
    };
    NewVolunteerPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["n" /* Component */])({
            selector: 'page-newvolunteer',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\newvolunteer\newvolunteer.html"*/'<!--\n  Generated template for the NewvolunteerPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3>\n      <img logo src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPHGd4enc8PrM4l2JjrqDZ7PyMCL9n50K69vQMDrURqzAzN9Fr8Q&s" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar col-12>\n    <ion-row><ion-title>Register as Hood Researcher</ion-title>\n      <img class="prodicon" src="https://image.flaticon.com/icons/png/512/1028/1028047.png" />\n    </ion-row>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <form [formGroup]="formg">\n\n    <!-- Login Credentials -->\n    <div input-field>\n      <ion-row col-12 offset-4>\n        <ion-label no-margin no-padding>Enter New Login Credentials</ion-label>\n      </ion-row>\n      <!-- Input-field-text -->\n      <ion-item no-padding>\n        <ion-label no-margin >Enter Username</ion-label>\n        <ion-input formControlName="uname" type="text" [(ngModel)]="uname" [ngModelOptions]="{standalone: true}"></ion-input>\n        <!--               <ion-label no-margin *ngIf="!isUsernameValid">{{data.errorUser}}</ion-label>-->            \n      </ion-item>\n        <!-- Input-field-password -->\n      <ion-item no-padding>\n        <ion-label no-margin >Enter Password</ion-label>\n        <ion-input formControlName="passwd" type="password" [(ngModel)]="passwd" [ngModelOptions]="{standalone: true}"></ion-input>\n        <!-- <ion-label no-margin *ngIf="!isPasswordValid">{{data.errorPassword}}</ion-label> -->\n      </ion-item>\n    </div>\n\n    <!-- Researcher Credentials -->\n    <div input-field>\n      <ion-row col-12 offset-4>\n        <ion-label no-margin no-padding>Enter Researcher Credentials</ion-label>\n      </ion-row>\n      <!-- Input-field-text -->\n      <ion-item no-padding>\n        <ion-label no-margin >Enter First Name</ion-label>\n        <ion-input formControlName="fname" type="text" [(ngModel)]="fname" [ngModelOptions]="{standalone: true}"></ion-input>\n        <!--               <ion-label no-margin *ngIf="!isUsernameValid">{{data.errorUser}}</ion-label>-->            \n      </ion-item>\n      <ion-item no-padding>\n          <ion-label no-margin >Enter Last Name</ion-label>\n          <ion-input formControlName="lname" type="text" [(ngModel)]="lname" [ngModelOptions]="{standalone: true}"></ion-input>\n          <!-- <ion-label no-margin *ngIf="!isUsernameValid">{{data.errorUser}}</ion-label>-->            \n      </ion-item>\n        <!-- Input-field-password -->\n      <ion-item no-padding>\n        <ion-label no-margin >Enter Email</ion-label>\n        <ion-input formControlName="email" type="email" [(ngModel)]="email" [ngModelOptions]="{standalone: true}"></ion-input>\n        <!-- <ion-label no-margin *ngIf="!isPasswordValid">{{data.errorPassword}}</ion-label> -->\n      </ion-item>\n    </div>\n\n  </form>\n\n  <!-- Register button -->\n  <ion-col col-12 no-padding>\n    <button no-margin ion-button full text-uppercase (click)="onRegister()">Register</button>\n  </ion-col>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\newvolunteer\newvolunteer.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_5__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_4__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_0__services_toast_service__["a" /* ToastService */]])
    ], NewVolunteerPage);
    return NewVolunteerPage;
}());

//# sourceMappingURL=newvolunteer.js.map

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewCoordinatorPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_toast_service__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the NewcoordinatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var NewCoordinatorPage = /** @class */ (function () {
    //DEF_POS = [{lat:38.9838, lng:-76.9461}];
    function NewCoordinatorPage(navCtrl, navParams, http, dbcservice, formBuilder, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.formBuilder = formBuilder;
        this.toastCtrl = toastCtrl;
        this.showForm = true;
        this.pageMessage = "Register";
        this.map = [];
        this.marker = [];
        this.DEF_VAL = [{
                uname: "testc",
                passwd: "default",
                vname: "Test Venue",
                loc: "LeFrak Hall College Park, MD",
                lat: 38.9838,
                lng: -76.9461,
                fname: "Testy",
                lname: "Usery",
                email: "testy@usery.org",
                phone: "444-123-4567"
            }];
        this.connection = this.dbcservice.getDbConnectionData();
    }
    NewCoordinatorPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad NewcoordinatorPage');
        this.showMap(false, this.DEF_VAL[0].lat, this.DEF_VAL[0].lng);
    };
    NewCoordinatorPage.prototype.ngOnInit = function () {
        this.formg = this.formBuilder.group({
            "uname": [this.DEF_VAL[0].uname],
            "passwd": [this.DEF_VAL[0].passwd, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].required],
            "vname": [this.DEF_VAL[0].vname],
            "loc": [this.DEF_VAL[0].loc],
            "lat": [this.DEF_VAL[0].lat, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].required],
            "lng": [this.DEF_VAL[0].lng, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].required],
            "fname": [this.DEF_VAL[0].fname],
            "lname": [this.DEF_VAL[0].lname],
            "email": [this.DEF_VAL[0].email, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].required],
            "phone": [this.DEF_VAL[0].phone, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* Validators */].required]
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
    };
    NewCoordinatorPage.prototype.onRegister = function () {
        this.insertRegistration(this.uname, this.passwd, this.fname, this.lname, this.email, this.phone, this.vname, this.loc, this.lat, this.lng);
    };
    NewCoordinatorPage.prototype.insertRegistration = function (un, pw, fn, ln, em, ph, vn, loc, lat, lng) {
        var _this = this;
        console.log(un + ":::" + pw + ":::" + ln + ":::" + em + ":::" + ph + ":::" + vn + ":::" + loc + ":::" + lat + ":::" + lng);
        var stat = false;
        var err;
        var url = this.dbcservice.getPhpCommand('setCoordinatorsPhp');
        var params = new FormData();
        params.append('uname', un);
        params.append('pwd', pw);
        params.append('pocname', fn + " " + ln);
        params.append('email', em);
        params.append('phone', ph);
        params.append('venue', vn);
        params.append('location', loc);
        if (lat != null)
            params.append('lat', lat.toString());
        if (lng != null)
            params.append('lng', lng.toString());
        //alert(un + " " + pw + " " + fn + " " + ln + " " + em);
        console.log(params);
        console.log(url);
        this.http.post(url, params)
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            console.log(data.code + " : " + data.desc);
            if (data.code == 0) {
                // insertion success
                _this.showForm = false;
                stat = true;
            }
            _this.pageMessage = (stat) ? "Volunteer Registration successful." : ("Registration Error: " + data.desc);
            _this.toastCtrl.presentToast(_this.pageMessage);
        });
    };
    NewCoordinatorPage.prototype.showMap = function (active, lat, lng) {
        var _this = this;
        this.currentLocation = new google.maps.LatLng(lat, lng);
        var mapOptions = {
            center: this.currentLocation,
            zoom: 8,
            mapTypeId: 'roadmap'
        };
        this.map = new google.maps.Map(document.getElementById('venuemap'), mapOptions);
        google.maps.event.addListener(this.map, 'click', function (event) {
            console.log(_this);
            _this.marker = new google.maps.Marker({
                map: _this.map,
                animation: google.maps.Animation.DROP,
                position: event.latLng,
            });
            console.log("event latLng" + event.latLng);
            console.log(_this.marker);
            if (_this.marker != null) {
                _this.lat = _this.marker.getPosition().lat();
                _this.lng = _this.marker.getPosition().lng();
                console.log('test ' + _this.lat + "||" + _this.lng);
            }
            var infocontent = "<b>Estimated Venue Location</b>";
            google.maps.event.addListener(_this.marker, 'click', function () {
                var infowindow = new google.maps.InfoWindow({
                    content: infocontent
                });
                infowindow.open(_this.map, _this.marker);
            });
        }); // addListener click map
    };
    NewCoordinatorPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["n" /* Component */])({
            selector: 'page-newcoordinator',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\newcoordinator\newcoordinator.html"*/'<!--\n  Generated template for the NewcoordinatorPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3 no-padding>\n      <img logo src="assets/imgs/ace_table_pan.png" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar>\n    <ion-title>Register as Coordinator</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n  <form [formGroup]="formg">\n\n    <!-- Login Credentials -->\n    <div input-field>\n      <ion-row col-12 offset-4>\n        <ion-label no-margin no-padding>Enter New Login Credentials</ion-label>\n      </ion-row>\n      <!-- Input-field-text -->\n      <ion-item no-padding>\n        <ion-label no-margin >Enter Username</ion-label>\n        <ion-input formControlName="uname" type="text" [(ngModel)]="uname" [ngModelOptions]="{standalone: true}"></ion-input>  \n      </ion-item>\n        <!-- Input-field-password -->\n      <ion-item no-padding>\n        <ion-label no-margin >Enter Password</ion-label>\n        <ion-input formControlName="passwd" type="password" [(ngModel)]="passwd" [ngModelOptions]="{standalone: true}"></ion-input>\n      </ion-item>\n    </div>\n    \n    <!-- Coordinator Venue Credentials -->\n    <div input-field>\n      <ion-row col-12 offset-4>\n        <ion-label no-margin no-padding>Enter Venue Information</ion-label>\n      </ion-row>\n      <ion-item no-padding>\n        <ion-label no-margin>Venue Name</ion-label>\n        <ion-input formControlName="vname" type="text" [(ngModel)]="vname" [ngModelOptions]="{standalone: true}"></ion-input>\n      </ion-item>\n      <ion-item no-padding>\n        <ion-label no-margin>Venue Address</ion-label>\n        <ion-input formControlName="loc" type="text" [(ngModel)]="loc" [ngModelOptions]="{standalone: true}"></ion-input>\n      </ion-item>\n    </div>\n  </form>\n  <ion-item no-padding>\n    <ion-label no-margin color="primary">Select location on the map</ion-label>\n  </ion-item>\n  <!--<div id="venuemap"></div>-->\n  <form [formGroup]="formg">\n    <div input-field>\n      <ion-row>\n        <ion-col col-6>\n            <div id="venuemap"></div>\n        </ion-col>\n        <ion-col col-6>\n          <ion-item no-padding>\n            <ion-label no-margin color="primary">Latitude</ion-label>\n            <ion-input formControlName="lat" type="number" [(ngModel)]="lat" [ngModelOptions]="{standalone: true}"></ion-input>\n          </ion-item>\n          <ion-item no-padding>\n            <ion-label no-margin color="primary">Longitude</ion-label>\n            <ion-input formControlName="lng" type="number"[(ngModel)]="lng" [ngModelOptions]="{standalone: true}"></ion-input>\n          </ion-item>\n          <ion-item><div></div></ion-item> <!--adding height to map-->  \n          <ion-item><div></div></ion-item> <!--adding height to map-->  \n          <ion-item><div></div></ion-item> <!--adding height to map-->  \n        </ion-col>     \n      </ion-row>\n\n\n\n\n\n      <!-- Coordinator Point of Contact Credentials -->\n      <ion-row col-12 offset-4>\n        <ion-label no-margin no-padding>Enter Point of Contact\'s Information</ion-label>\n      </ion-row>\n      <ion-item no-padding>\n        <ion-label no-margin >Enter First Name</ion-label>\n        <ion-input formControlName="fname" type="text" [(ngModel)]="fname" [ngModelOptions]="{standalone: true}"></ion-input>        \n      </ion-item>\n      <ion-item no-padding>\n          <ion-label no-margin >Enter Last Name</ion-label>\n          <ion-input formControlName="lname" type="text" [(ngModel)]="lname" [ngModelOptions]="{standalone: true}"></ion-input>\n      </ion-item>\n      <ion-item no-padding>\n        <ion-label no-margin >Enter Email</ion-label>\n        <ion-input formControlName="email" type="email" [(ngModel)]="email" [ngModelOptions]="{standalone: true}"></ion-input>\n      </ion-item>\n      <ion-item no-padding>\n        <ion-label no-margin >Enter Phone Number</ion-label>\n        <ion-input formControlName="phone" type="tel" [(ngModel)]="phone" [ngModelOptions]="{standalone: true}"></ion-input>\n      </ion-item>\n    </div>\n  </form>\n\n  <!-- Register button -->\n  <ion-col col-12 no-padding>\n    <button no-margin ion-button full text-uppercase (click)="onRegister()">Register</button>\n  </ion-col>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\newcoordinator\newcoordinator.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_5__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_4__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_0__services_toast_service__["a" /* ToastService */]])
    ], NewCoordinatorPage);
    return NewCoordinatorPage;
}());

//# sourceMappingURL=newcoordinator.js.map

/***/ }),

/***/ 213:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__events_events__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__about_about__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scenarios_scenarios__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__surveys_surveys__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__results_results__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__venue_venue__ = __webpack_require__(206);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








//import { OpportunitiesPage } from '../opportunities/opportunities';

//import { HomePage } from '../home/home';
//mport { HomePage } from '../home-page/home-page';
var TabsPage = /** @class */ (function () {
    function TabsPage(globalProvider) {
        this.globalProvider = globalProvider;
        this.LOGOUT = "Logout";
        // default setup
        this.tabs_searcher = [
            { root: __WEBPACK_IMPORTED_MODULE_5__scenarios_scenarios__["a" /* ScenariosPage */], tabTitle: "My Surveys", tabIcon: "calendar" },
            { root: __WEBPACK_IMPORTED_MODULE_6__surveys_surveys__["a" /* SurveysPage */], tabTitle: "New Survey", tabIcon: "ribbon" },
            { root: __WEBPACK_IMPORTED_MODULE_7__results_results__["a" /* ResultsPage */], tabTitle: "Results", tabIcon: "images" },
            { root: __WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */], tabTitle: this.LOGOUT, tabIcon: "log-out" },
        ];
        this.tabs_coordinator = [
            { root: __WEBPACK_IMPORTED_MODULE_3__about_about__["a" /* AboutPage */], tabTitle: "About", tabIcon: "information-circle" },
            { root: __WEBPACK_IMPORTED_MODULE_8__venue_venue__["a" /* VenuePage */], tabTitle: "Venue Profile", tabIcon: "home" },
            { root: __WEBPACK_IMPORTED_MODULE_1__events_events__["a" /* VenueEventsPage */], tabTitle: "Add Event", tabIcon: "microphone" },
            { root: __WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */], tabTitle: this.LOGOUT, tabIcon: "log-out" },
        ];
        this.loginId = 1;
        this.loginRole = 2;
        this.loginname = "none";
        this.loginpublicname = "none";
        this.btnsEnabled = true;
        this.configureBtns(true);
    }
    TabsPage.prototype.ionViewWillEnter = function () {
        this.configureBtns(true);
    };
    TabsPage.prototype.configureBtns = function (enable) {
        if (enable === void 0) { enable = false; }
        // set setup by role
        this.loginRole = this.globalProvider.getLoginRole();
        this.loginId = this.globalProvider.getLoginId();
        this.loginname = this.globalProvider.getLoginName();
        this.loginpublicname = this.globalProvider.getUserPublicName();
        /*
        alert("ENABLE:" + enable + "\n"+
              "LNID:"+this.loginId+"\n"+
              "LNNM:"+this.loginname+"\n"+
              "NAME:"+this.loginpublicname+"\n"+
              "ROLE:"+this.loginRole);
        */
        if (this.loginRole == 2) {
            // Volunteer
            this.tab_config = this.tabs_searcher;
        }
        else if (this.loginRole == 3) {
            // Coordinator
            this.tab_config = this.tabs_coordinator;
        }
        // set visible name
        this.tab_config[3].tabTitle = this.LOGOUT + " " + this.loginpublicname;
        // if loginid = 0, disable
        this.btnsEnabled = enable;
    };
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["n" /* Component */])({template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\tabs\tabs.html"*/'<!--<ion-label>Logged in: {{loginpublicname}}</ion-label>-->\n<ion-tabs>\n  <!--\n  <ion-tab [root]="tab1Root" tabTitle="About" tabIcon="information-circle"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="Profile" tabIcon="person"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="Events" tabIcon="ribbon"></ion-tab>\n  <ion-tab [root]="tab4Root" tabTitle="Logout" tabIcon="log-out"></ion-tab>-->\n  \n  <ion-tab [root]="tab_config[0].root" [show]="btnsEnabled" tabTitle={{tab_config[0].tabTitle}} tabIcon={{tab_config[0].tabIcon}} ></ion-tab>\n  <ion-tab [root]="tab_config[1].root" [show]="btnsEnabled" tabTitle={{tab_config[1].tabTitle}} tabIcon={{tab_config[1].tabIcon}} ></ion-tab>\n  <ion-tab [root]="tab_config[2].root" [show]="btnsEnabled" tabTitle={{tab_config[2].tabTitle}} tabIcon={{tab_config[2].tabIcon}} ></ion-tab>\n  <ion-tab [root]="tab_config[3].root" [show]="btnsEnabled" tabTitle={{tab_config[3].tabTitle}} tabIcon={{tab_config[3].tabIcon}} (ionSelect)="configureBtns()" ></ion-tab>\n  <!--<ion-tab [root]="tab_config[4].root" [enabled]="btnsEnabled" tabTitle={{tab_config[4].tabTitle}} tabIcon={{tab_config[4].tabIcon}} ></ion-tab>-->\n</ion-tabs>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__providers_global_global__["a" /* GlobalProvider */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VenueEventsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_toast_service__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Generated class for the NewcoordinatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var VenueEventsPage = /** @class */ (function () {
    function VenueEventsPage(navCtrl, navParams, http, dbcservice, formBuilder, globalProvider, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.formBuilder = formBuilder;
        this.globalProvider = globalProvider;
        this.toastCtrl = toastCtrl;
        this.showForm = true;
        this.pageMessage = "Register";
        this.default_values = [{
                ename: "",
                desc: "",
                stdate: "1",
                sttime: "06:00:00",
                enddate: "2",
                endtime: "18:00:00",
                numstaff: "1",
                eppp: "50"
            }];
        this.connection = this.dbcservice.getDbConnectionData();
        this.formg = formBuilder.group({
            "ename": [this.default_values[0].ename, __WEBPACK_IMPORTED_MODULE_5__angular_forms__["f" /* Validators */].nullValidator],
            "desc": [this.default_values[0].desc],
            "stdate": [this.default_values[0].stdate, __WEBPACK_IMPORTED_MODULE_5__angular_forms__["f" /* Validators */].nullValidator],
            "sttime": [this.default_values[0].sttime],
            "enddate": [this.default_values[0].enddate, __WEBPACK_IMPORTED_MODULE_5__angular_forms__["f" /* Validators */].nullValidator],
            "endtime": [this.default_values[0].endtime],
            "numstaff": [this.default_values[0].numstaff, __WEBPACK_IMPORTED_MODULE_5__angular_forms__["f" /* Validators */].required],
            "eppp": [this.default_values[0].eppp, __WEBPACK_IMPORTED_MODULE_5__angular_forms__["f" /* Validators */].nullValidator]
        });
    }
    VenueEventsPage.prototype.initializeFields = function () {
        this.ename = this.default_values[0].ename;
        this.desc = this.default_values[0].desc;
        this.stdate = Date.now + this.default_values[0].stdate;
        this.sttime = this.default_values[0].sttime;
        this.enddate = Date.now + this.default_values[0].enddate;
        this.endtime = this.default_values[0].endtime;
        this.numstaff = this.default_values[0].numstaff;
        this.eppp = this.default_values[0].eppp;
    };
    VenueEventsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad NewcoordinatorPage');
    };
    VenueEventsPage.prototype.ionViewWillEnter = function () {
        this.venueid = this.queryVenueId(this.globalProvider.getLoginId());
        this.initializeFields();
    };
    VenueEventsPage.prototype.queryVenueId = function (loginid) {
        var _this = this;
        var ret;
        var url = this.dbcservice.getPhpCommand('getUserInfoPhp');
        //url = url + "?loginid=" + loginid;
        var params = new FormData();
        params.append('loginid', loginid.toString());
        console.log(url);
        //this.http.get(url)
        this.http.post(url, params)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null && data.length > 0) {
                _this.venueid = data[0].venueid;
            }
        });
        return this.venueid;
    };
    VenueEventsPage.prototype.onRegister = function () {
        this.insertRegistration(this.venueid, this.formg.controls.ename.value, this.formg.controls.desc.value, this.formg.controls.stdate.value, this.formg.controls.sttime.value, this.formg.controls.enddate.value, this.formg.controls.endtime.value, this.formg.controls.numstaff.value, this.formg.controls.eppp.value);
    };
    VenueEventsPage.prototype.insertRegistration = function (vid, enm, ede, sdt, stm, edt, etm, nst, ppp) {
        var _this = this;
        var svid = vid.toString();
        var senm = enm;
        var sede = ede;
        var ssdt = sdt.toString();
        var sstm = stm + ":00";
        var sedt = edt.toString();
        var setm = etm + ":00";
        var snst = nst.toString();
        var sppp = ppp.toString();
        console.log(svid + "||" + senm + "||" + sede + "||" + ssdt +
            "||" + sstm + "||" + sedt + "||" + setm +
            "||" + snst + "||" + sppp);
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
        var stat = false;
        var err;
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
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            if (data.code == 0) {
                // insertion success
                _this.showForm = false;
                stat = true;
            }
            _this.pageMessage = (stat) ? "Event Add successful." : ("Event Add Error: " + data.desc);
            if (stat) {
                //this.goToBookingsPage(this.eventid, this.vid, this.vpercent);
            }
        });
    };
    VenueEventsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["n" /* Component */])({
            selector: 'page-events',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\events\events.html"*/'<!--\n  Generated template for the EventsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3>\n      <img logo src="assets/imgs/ace_table_pan.png" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar>\n    <ion-title>Add Event to Venue</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <form [formGroup]="formg">\n  \n      <!-- Event Description -->\n      <div input-field>\n        <ion-row col-12 offset-4>\n          <ion-label no-margin no-padding>Enter Event Description</ion-label>\n        </ion-row>\n        <!-- Input-field-text -->\n        <ion-item no-padding>\n          <ion-label no-margin >Event Name</ion-label>\n          <ion-input formControlName="ename" type="text" [(ngModel)]="ename" [ngModelOptions]="{standalone: true}"></ion-input>  \n        </ion-item>\n        <!-- Input-field-text -->\n        <ion-item no-padding>\n          <ion-label no-margin >Brief Description of Event</ion-label>\n          <ion-input formControlName="desc" type="textarea" [(ngModel)]="desc" [ngModelOptions]="{standalone: true}"></ion-input>\n        </ion-item>\n      </div>\n  \n      <!-- Event Time -->\n      <div input-field>\n        <ion-row col-12 offset-4>\n          <ion-label no-margin no-padding>Enter Event Time Information</ion-label>\n        </ion-row>\n        <ion-item no-padding>\n          <ion-label no-margin>Start Date</ion-label>\n          <ion-input formControlName="stdate" type="date"[(ngModel)]="stdate" [ngModelOptions]="{standalone: true}"></ion-input>\n        </ion-item>\n        <ion-item no-padding>\n          <ion-label no-margin>End Date</ion-label>\n          <ion-input formControlName="enddate" type="date" [(ngModel)]="enddate" [ngModelOptions]="{standalone: true}"></ion-input>\n        </ion-item>\n        <ion-item no-padding>\n          <ion-label no-margin>Daily Start Time</ion-label>\n          <ion-input formControlName="sttime" type="time" [(ngModel)]="sttime" [ngModelOptions]="{standalone: true}"></ion-input>\n        </ion-item>\n        <ion-item no-padding>\n          <ion-label no-margin>Daily End Time</ion-label>\n          <ion-input formControlName="endtime" type="time" [(ngModel)]="endtime" [ngModelOptions]="{standalone: true}"></ion-input>\n        </ion-item>\n      </div>\n      <div input-field>\n        <ion-row col-12 offset-4>\n            <ion-label no-margin no-padding>Enter Labor Needs and ServACE Sponsorship</ion-label>\n        </ion-row>\n        <ion-item no-padding>\n          <ion-label no-margin color="primary">Total Number of Staff Needed</ion-label>\n          <ion-input formControlName="numstaff" type="number" [(ngModel)]="numstaff" [ngModelOptions]="{standalone: true}"></ion-input>\n        </ion-item>\n        <ion-item no-padding>\n          <ion-label no-margin color="primary">ServACE Points per Volunteer</ion-label>\n          <ion-input formControlName="eppp" type="number"[(ngModel)]="eppp" [ngModelOptions]="{standalone: true}"></ion-input>\n        </ion-item>\n      </div>\n    </form>\n  \n    <!-- Register button -->\n    <ion-col col-12 no-padding>\n      <button no-margin ion-button full text-uppercase (click)="onRegister()">Register Event</button>\n      <button ion-button text-center block (click)="initializeFields()">Reset</button>\n    </ion-col>\n  </ion-content>\n  '/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\events\events.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_6__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_2__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_5__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_1__providers_global_global__["a" /* GlobalProvider */], __WEBPACK_IMPORTED_MODULE_0__services_toast_service__["a" /* ToastService */]])
    ], VenueEventsPage);
    return VenueEventsPage;
}());

//# sourceMappingURL=events.js.map

/***/ }),

/***/ 215:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl, globalProvider) {
        this.navCtrl = navCtrl;
        this.globalProvider = globalProvider;
    }
    AboutPage.prototype.ionViewDidEnter = function () {
        this.loggedIn = this.globalProvider.getUserPublicName();
    };
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
            selector: 'page-about',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\about\about.html"*/'<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3>\n      <img logo src="assets/imgs/ace_table_pan.png" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar>\n    <ion-row><ion-title>About HoodSearch</ion-title>\n    <ion-label float-right class="login-label">[Logged in: {{loggedIn}}]</ion-label></ion-row>\n  </ion-navbar>\n</ion-header> \n\n<ion-content padding>\n  <div class="row alert servace-alert">\n    <div class="servace-banner">Volunteer you time and talents.<br>Let your efforts be counted.</div>					\n      <ion-row align-items-start>\n        <!--<ion-col col-12>-->\n          <div class="col-md-6 col-sm-6">\n            <div class="embed-responsive embed-responsive-4by3">\n              <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/aS-mAz34NA0" \n                allow="autoplay; encrypted-media" allowfullscreen></iframe>\n              <!--<iframe src="https://www.youtube.com/embed/6WzRtWb70Qs" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>-->\n            </div>\n            <!--<blockquote>For information on how to get started with ServACE, please see the <a href="index.php?action=directions">Directions</a> page.</blockquote>-->\n          </div>\n        <!---</ion-col>-->\n      </ion-row>\n      <div class ="col-md-12 col-sm-12">\n        <ion-row>\n          <ion-col col-12 text-wrap>	\n            <ion-label><div class="servace-menu">Volunteers Benefit the Community and Themselves</div></ion-label>\n          </ion-col>\n        </ion-row>\n        <ion-row>	\n        <ion-row>\n          <ion-col col-12>\n            <!--<blockquote cite="https://www.helpguide.org/articles/healthy-living/volunteering-and-its-surprising-benefits.htm">-->\n            <ion-label text-wrap>\n            Volunteering offers vital help to people in need, worthwhile causes, and the community, but the benefits can be even greater for you, the volunteer. Volunteering and helping others can help you reduce stress, combat depression, keep you mentally stimulated, and provide a sense of purpose. While it’s true that the more you volunteer, the more benefits you’ll experience, volunteering doesn’t have to involve a long-term commitment or take a huge amount of time out of your busy day. Giving in even simple ways can help others those in need and improve your health and happiness.\n            </ion-label>\n          </ion-col>\n        </ion-row>		\n        <div class="form-group"> \n          <ion-row>\n            <ion-col col-12 text-wrap>\n              <div class="servace-menu">\n                <a href="https://www.google.com/search?safe=active&q=volunteer+opportunities+near+me">\n                  <ion-badge float-right><ion-icon name="search" item-end></ion-icon> Search<br></ion-badge>\n                </a>                \n                <ion-label>\n                  Find out where you can volunteer today.\n                </ion-label>\n              </div>\n            </ion-col>\n          </ion-row>\n        </div>\n      </ion-row>\n    </div>\n  </div>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\about\about.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_0__providers_global_global__["a" /* GlobalProvider */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScenariosPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__results_results__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__surveys_surveys__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__esri_arcgis_rest_feature_layer__ = __webpack_require__(302);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










/**
 * Generated class for the ScenariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ScenariosPage = /** @class */ (function () {
    function ScenariosPage(navCtrl, navParams, http, dbcservice, globalProvider, formBuilder) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.globalProvider = globalProvider;
        this.formBuilder = formBuilder;
        this.showForm = true;
        this.pageMessage = "Scenario";
        /* main table for display */
        this.scntable = new Array();
        this.latitude = 40.0;
        this.longitude = -75.0;
        this.DEF_VAL = [{
                survey_name: "Template Scenario",
                CreationDate: Date.now,
                EditDate: Date.now
            }];
        this.connection = this.dbcservice.getDbConnectionData();
        this.formg = this.formBuilder.group({
            "survey_name": [this.DEF_VAL[0].survey_name],
            "CreationDate": [this.DEF_VAL[0].CreationDate, __WEBPACK_IMPORTED_MODULE_0__angular_forms__["f" /* Validators */].nullValidator],
            "EditDate": [this.DEF_VAL[0].EditDate],
        });
    }
    ScenariosPage.prototype.ngOnInit = function () { };
    ScenariosPage.prototype.initializeFields = function () {
        this.survey_name = this.DEF_VAL[0].survey_name;
        this.CreationDate = this.DEF_VAL[0].CreationDate;
        this.EditDate = this.DEF_VAL[0].EditDate;
    };
    ScenariosPage.prototype.ionViewWillEnter = function () {
        this.initializeFields();
        this.queryUserId(this.globalProvider.getLoginId());
        this.getScenariosList(this.globalProvider.getLoginId());
    };
    ScenariosPage.prototype.queryUserId = function (loginid) {
        var _this = this;
        var stat = false;
        var err;
        //var url = this.dbcservice.getPhpCommand('getUserInfoPhp797');
        var url = this.dbcservice.getPhpCommand('getUserInfoPhp');
        var params = new FormData();
        params.append('loginid', loginid.toString());
        this.http.post(url, params)
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            if (data != null && data.length > 0) {
                console.log(data[0]);
                _this.vid = data[0].vid;
            }
        });
    };
    ScenariosPage.prototype.getSurveysFromSurvey123 = function (response) {
        var _this = this;
        console.log(response);
        var qfr = response;
        var ftrs = qfr.features;
        // clear table
        if (this.scntable != null) {
            this.scntable.splice(0, this.scntable.length);
        }
        // refill table from Survey123
        ftrs.forEach(function (ftr) {
            /*console.log(
              ftr.attributes['survey_name'] + ":"+
              ftr.attributes['globalid'] + ":" +
              ftr.attributes['CreationDate'] + ":" +
              ftr.attributes['EditDate']);
            */
            //console.log(ftr.attributes);
            if (_this.scntable != null) {
                // convert date formats
                ftr.attributes['CreationDate'] = new Date(ftr.attributes['CreationDate']).toLocaleString();
                ftr.attributes['EditDate'] = new Date(ftr.attributes['EditDate']).toLocaleString();
                _this.scntable.push(ftr.attributes);
            }
        });
    };
    ScenariosPage.prototype.getScenariosList = function (credential) {
        var _this = this;
        var stat = false;
        var url = this.dbcservice.getPhpCommand('getScenariosPhp');
        var arcurl = this.dbcservice.getRestCommand('surveyDataUrl');
        //const arcurl = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
        /*getFeature({
          arcurl,
          id: 32
        }).then(feature => {
         console.log(feature.attributes.FID); // 32
        });*/
        //arcurl = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3";
        var fparams = {
            //where: "STATE_NAME = 'Alaska'"
            where: "survey_userid = '" + credential.toString() + "'",
            outFields: ['survey_name', 'survey_userid', 'objectid', 'globalid', 'CreationDate', 'EditDate']
            //outFields: "*"
        };
        Object(__WEBPACK_IMPORTED_MODULE_9__esri_arcgis_rest_feature_layer__["a" /* queryFeatures */])({
            url: arcurl,
            params: fparams
        }).then(function (response) {
            _this.getSurveysFromSurvey123(response);
        });
    };
    ScenariosPage.prototype.goToSurveyPage = function (index) {
        var s123id = -1;
        if ((this.scntable != null) && this.scntable.length > index)
            s123id = this.scntable[index].objectid;
        //alert("scenarios:goToSurveyPage");
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__surveys_surveys__["a" /* SurveysPage */], { survey123id: s123id
        });
    };
    ScenariosPage.prototype.executeResults = function (index) {
        var eid = 0;
        var gid = "";
        if ((this.scntable != null) && this.scntable.length > index) {
            eid = this.scntable[index].objectid;
            gid = this.scntable[index].globalid;
        }
        //alert("TBD: Firing the geoprocessor here: " + gid);
        this.goToResultsPage(index);
    };
    ScenariosPage.prototype.goToResultsPage = function (index) {
        var sid = "default";
        var stitle = "";
        if ((this.scntable != null) && this.scntable.length > index) {
            sid = this.scntable[index].globalid;
            stitle = this.scntable[index].survey_name;
        }
        console.log("ScenarioPage is passing to Results: " + sid + " from index[" + index + "]");
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_1__results_results__["a" /* ResultsPage */], { surveyid: sid, surveytitle: stitle });
    };
    //*******
    // Not used: Survey123 now managing surveys
    //******* */ 
    ScenariosPage.prototype.newScenario = function () {
        //alert("TBD");
        //let dtnow:Date = Date.now.prototype;
        this.insertScenario(this.globalProvider.getLoginId(), this.formg.controls.nsname.value, 'init', "99", this.formg.controls.stdate.value, this.formg.controls.sttime.value, // Time not supported
        this.formg.controls.stdate.value, this.formg.controls.sttime.value, // Time not supported
        3);
        //now refresh
        this.getScenariosListFromDb(this.globalProvider.getLoginId());
    };
    ScenariosPage.prototype.getScenariosListFromDb = function (credential) {
        var _this = this;
        var stat = false;
        var url = this.dbcservice.getPhpCommand('getScenariosPhp');
        // to use GET, comment this
        var params = new FormData();
        params.append('userid', credential.toString());
        console.log(url);
        this.http.post(url, params)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null) {
                _this.scntable = data;
            }
        });
    };
    ScenariosPage.prototype.insertScenario = function (uid, scnname, sid, s123id, create_date, create_time, update_date, update_time, rating) {
        var _this = this;
        var suid = uid.toString();
        var sscnname = scnname;
        var ssid = sid;
        var ss123id = s123id;
        var screate_date = create_date.toString();
        var screate_time = create_time + ":00";
        var supdate_date = update_date.toString();
        var supdate_time = update_time + ":00";
        var srating = rating.toString();
        console.log(suid + "||" + sscnname + "||" + ssid + "||" + ss123id + "||" +
            screate_date + "||" + screate_time + "||" + supdate_date + "||" + supdate_time + "||" +
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
        var stat = false;
        var err;
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
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            if (data.code == 0) {
                // insertion success
                _this.showForm = false;
                stat = true;
            }
            _this.pageMessage = (stat) ? "Scenario Add successful." : ("Scenario Add Error: " + data.desc);
        });
    };
    ScenariosPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["n" /* Component */])({
            selector: 'page-scenarios',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\scenarios\scenarios.html"*/'<!--\n  Generated template for the ScenariosPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3>\n      <img logo src="https://render.fineartamerica.com/images/images-profile-flow/350/images/artworkimages/medium/1/midwinter-over-the-patapsco-ellicott-city-md-wiley-purkey.jpg" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar>\n    <!--<ion-title>HoodSearch Surveys</ion-title>-->\n    <div class ="col-md-12 col-xs-12">\n        <ion-row><ion-title>HoodSearch Survey Discoveries</ion-title>\n          <img class="prodicon" src="https://image.flaticon.com/icons/png/512/1028/1028047.png" />\n        </ion-row>\n        <ion-row>\n          <ion-label text-wrap class="servace-badge">\n            Before you delve into the home buying process, consider this. What are the factors that are most impoprtant in your home purchase?\n            And which of these factors are not about the house...but the <i><b>neighborhood</b></i>? HoodSearch surveys are designed around \n            key questions which will match you with our community database of compati neighborhoods. Let\'s delve... \n          </ion-label>\n        </ion-row>		\n      </div>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <div id="resultList" class ="col-md-12 col-xs-12">\n    <div class="table-hover">\n    <form padding [formGroup]="formg">  \n      <ion-list>\n        <ion-row>\n          <button ion-item *ngIf="scntable" >{{scntable?.length || \'0\'}} Surveys Found </button>\n        </ion-row>\n        <ion-row>\n        <!--\n        <ion-col col-1 text-wrap>\n          <thead>S123</thead>\n        </ion-col>\n        <ion-col col-1 text-wrap>\n          <thead>((SurveyID))</thead>\n        </ion-col>   -->     \n        <ion-col col-4 text-wrap>\n          <thead>Name</thead>\n        </ion-col>\n        <ion-col col-3 text-wrap>\n          <thead>Creation Date</thead>\n        </ion-col>\n        <ion-col col-3 text-wrap>\n          <thead>Last Edit Date</thead>\n        </ion-col>\n        <ion-col col-2 text-wrap>\n          <thead>Actions</thead>\n        </ion-col>        \n      </ion-row>\n      <!--<ion-button ion-item *ngFor="let event of scntable; let i=index" (click)="goToSurveyPage(i)">-->\n        <!-- show grid here -->\n        <ion-row *ngFor="let event of scntable; let i=index">\n          <!--<td>{{ event.s123id }}</td>--><!--<td>{{ event.surveyid }}</td>-->\n          <!--<ion-col col-1 text-wrap>\n            <td>{{ event.objectid }}</td>\n          </ion-col>\n          <ion-col col-1 text-wrap>\n            <td>{{ event.globalid }}</td>>\n          </ion-col>-->\n          <ion-col col-4 text-wrap>\n            <td><ion-label>{{ event.survey_name }}</ion-label></td><!--<td>{{ event.name }}</td>-->\n          </ion-col>\n          <ion-col col-3 text-wrap>\n            <!--<td><ion-label formControlName="CreationDate" readonly type="date" [(ngModel)]=event.CreationDate [ngModelOptions]="{standalone: true}"></ion-label></td>-->\n            <td><ion-label text-wrap type="date">{{ event.CreationDate }}</ion-label></td><!--<td>{{ event.create_date }}</td>-->\n          </ion-col>\n          <ion-col col-3 text-wrap>\n            <td><ion-label text-wrap type="datetime">{{ event.EditDate }}</ion-label></td><!--<td>{{ event.update_date }}</td>-->\n          </ion-col>\n          <ion-col col-2 text-wrap>\n            <ion-row>\n              <ion-button><ion-badge name="gosurvey" item-end float-right color="dark" (click)="goToSurveyPage(i)">Edit Surveys</ion-badge></ion-button>\n            </ion-row>\n            <ion-row>\n              <ion-button><ion-badge name="goresults" item-end float-right color="primary" (click)="executeResults(i)">Show Results</ion-badge></ion-button>\n            </ion-row>\n          </ion-col>          \n        </ion-row>\n      <!--</ion-button>-->\n    </ion-list> </form> \n    </div>\n  </div>\n\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\scenarios\scenarios.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_7__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_4__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_3__providers_global_global__["a" /* GlobalProvider */], __WEBPACK_IMPORTED_MODULE_0__angular_forms__["a" /* FormBuilder */]])
    ], ScenariosPage);
    return ScenariosPage;
}());

//# sourceMappingURL=scenarios.js.map

/***/ }),

/***/ 223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__bookings_bookings__ = __webpack_require__(224);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SignupPage = /** @class */ (function () {
    function SignupPage(navCtrl, navParams, http, dbcservice, formBuilder) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.formBuilder = formBuilder;
        this.showForm = true;
        this.pageMessage = "Sign Up";
        this.canVolunteer = true;
        this.vpercent = 100;
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
            "eperctime": ["100", __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required],
        });
    }
    SignupPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad SignupPage');
        this.getSignupData(this.dbcservice.getPhpCommand('getEventSignupPhp'), this.eventid);
    };
    SignupPage.prototype.ionViewWillEnter = function () {
        this.initializeFields();
    };
    SignupPage.prototype.getSignupData = function (phpCommand, eventid) {
        var _this = this;
        var url = phpCommand + "?eid=" + eventid;
        //alert(url);
        this.http.get(url)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null) {
                _this.showForm = true;
                _this.eventdata = data;
                _this.canVolunteer = (data[0].vols_required > 0);
                _this.evenue = data[0].venue_name;
                _this.eevent = data[0].event_name;
                _this.edescription = data[0].event_description;
                _this.estartdate = data[0].startdate;
                _this.estarttime = data[0].daystarttime;
                _this.eenddate = data[0].enddate;
                _this.eendtime = data[0].dayendtime;
                _this.epoints = data[0].badgepoints_pp;
                _this.evolsreq = data[0].vols_required;
            }
        });
    };
    SignupPage.prototype.initializeFields = function () {
        this.showForm = true;
        // set field values
        this.formg.controls.eperctime.setValue(100);
    };
    SignupPage.prototype.volunteer = function () {
        this.vpercent = this.formg.controls.eperctime.value;
        this.insertBooking(this.dbcservice.getPhpCommand('setEventSignupPhp'), this.eventid, this.vid, this.vpercent);
    };
    SignupPage.prototype.insertBooking_get = function (phpCommand, eventid, vid, vpercent) {
        var _this = this;
        var stat = false;
        var err;
        var url = phpCommand;
        url = url + "?eid=" + eventid;
        url = url + "&vid=" + vid;
        url = url + "&vperc=" + vpercent;
        //alert(url);
        this.http.get(url)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null) {
                if (data.code == 0) {
                    // insertion success
                    _this.showForm = false;
                    stat = true;
                }
                else {
                    err = data.desc;
                }
            }
        });
        this.pageMessage = (stat) ? "Volunteer Signup successful." : ("Volunteer Signup Error: " + err);
        //if (stat)
        //alert("Here we move to Booking completion page");
        //this.goToBookingsPage(eventid, vid, vpercent); //not yet
    };
    SignupPage.prototype.insertBooking = function (phpCommand, eventid, vid, vpercent) {
        var _this = this;
        var stat = false;
        var err;
        var url = phpCommand;
        var params = new FormData();
        params.append('eid', this.eventid);
        params.append('vid', this.vid);
        params.append('vperc', this.formg.controls.eperctime.value);
        console.log(params);
        console.log(url);
        this.http.post(url, params)
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            if (data.code == 0) {
                // insertion success
                _this.showForm = false;
                stat = true;
            }
            _this.pageMessage = (stat) ? "Volunteer Signup successful." : ("Signup Error: " + data.desc);
            if (stat)
                _this.goToBookingsPage(eventid, vid, vpercent);
        });
    };
    SignupPage.prototype.goToBookingsPage = function (eventid, vid, vpercent) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__bookings_bookings__["a" /* BookingsPage */], {
            eid: eventid,
            vid: vid,
            vperc: vpercent
        });
    };
    SignupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
            selector: 'page-signup',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\signup\signup.html"*/'<!--\n  Generated template for the SignupPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3 no-padding>\n      <img logo src="assets/imgs/ace_table_pan.png" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar>\n    <ion-title>{{pageMessage}}</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n    <div *ngIf="canVolunteer; else coveredBlock">\n      <form [formGroup]="formg">\n          <ion-list text-wrap>\n            <ion-row>\n              <ion-col col-4><ion-label><b>Venue</b></ion-label></ion-col><ion-col col-6><p>{{evenue}}</p></ion-col>\n            </ion-row>\n            <ion-row>\n              <ion-col col-4><ion-label><b>Event</b></ion-label></ion-col><ion-col col-6><p>{{eevent}}</p></ion-col>\n            </ion-row>\n            <ion-row>\n              <ion-col col-4><ion-label><b>Event Description</b></ion-label></ion-col><ion-col col-6><p>{{edescription}}</p></ion-col>\n            </ion-row>\n            <ion-row>\n              <ion-col col-4><ion-label><b>Start Date and Time</b></ion-label></ion-col><ion-col col-6><p>{{estartdate}} at {{estarttime}}</p></ion-col>\n            </ion-row>\n            <ion-row>\n              <ion-col col-4><ion-label><b>End Date and Time</b></ion-label></ion-col><ion-col col-6><p>{{eenddate}} at {{eendtime}}</p></ion-col>\n            </ion-row>\n            <ion-row>\n              <ion-col col-4><ion-label><b>ServAce Points Available</b></ion-label></ion-col><ion-col col-6><p>{{epoints}}</p></ion-col>\n            </ion-row>\n            <ion-row>\n              <ion-col col-4><ion-label><b>Number of Required Staff</b></ion-label></ion-col><ion-col col-6><p>{{evolsreq}}</p></ion-col>\n            </ion-row>\n            <ion-row>\n              <ion-col col-4><ion-label><b>Percentage Event Time to Volunteer</b></ion-label></ion-col>\n              <!--<ion-col col-4><ion-input formControlName="eperctime" type="number" min="0" max="100" step="25" placeholder="100">{{vpercent}}</ion-input></ion-col>-->\n              <ion-col col-6>\n                <ion-item>\n                  <ion-range formControlName="eperctime" min="25" max="100" step="25" snaps="true" pin="true">\n                    <ion-label range-left>25%</ion-label>\n                    <ion-label range-right>100%</ion-label>\n                  </ion-range>\n                  <ion-badge item-end>{{formg.controls.eperctime.value}}%</ion-badge>\n                </ion-item>\n              </ion-col>\n            </ion-row>\n          </ion-list>\n\n          <ion-item>\n            <button ion-button text-center block (click)="volunteer()" [disabled]="!canVolunteer">Volunteer</button>\n            <button ion-button text-center block (click)="initializeFields()">Reset</button>\n          </ion-item>\n      </form>\n    </div>\n    <ng-template #coveredBlock>\n      <div #coveredBlock>\n        No Volunteers Needed. Go BACK!!!!\n      </div>\n    </ng-template>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\signup\signup.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_0__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */]])
    ], SignupPage);
    return SignupPage;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BookingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the BookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var BookingsPage = /** @class */ (function () {
    function BookingsPage(navCtrl, navParams, http, dbcservice) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.connection = this.dbcservice.getDbConnectionData();
        this.vid = navParams.get('vid');
        this.eid = navParams.get('eid');
        this.vperc = navParams.get('vperc');
    }
    BookingsPage.prototype.ionViewWillEnter = function () {
        this.getBookingProfile(this.dbcservice.getPhpCommand('getBookingsPhp'), this.eid, this.vid, this.vperc);
    };
    BookingsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad BookingsPage');
    };
    BookingsPage.prototype.getBookingProfile = function (phpCommand, eid, vid, vperc) {
        var _this = this;
        var url = phpCommand;
        url = url + "?eid=" + eid;
        url = url + "&vid=" + vid;
        url = url + "&vperc=" + vperc;
        //alert(url);
        this.http.get(url)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null) {
                // retrieve any display info needed
                _this.results = data;
                _this.fname = data[0].firstname;
                _this.lname = data[0].lastname;
                _this.ename = data[0].event_name;
                _this.vname = data[0].venue_name;
                _this.vaddr = data[0].address;
                _this.estdt = data[0].startdate;
                _this.eendt = data[0].enddate;
                _this.esttm = data[0].daystarttime;
                _this.eentm = data[0].dayendtime;
                _this.vpocn = data[0].pocname;
                _this.vpoce = data[0].pocemail;
                _this.vpocp = data[0].pocphone;
                _this.eppts = data[0].badgepoints_pp;
            }
        });
    };
    BookingsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["n" /* Component */])({
            selector: 'page-bookings',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\bookings\bookings.html"*/'<!--\n  Generated template for the BookingsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3 no-padding>\n      <img logo src="assets/imgs/ace_table_pan.png" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar>\n    <ion-title>Thank You</ion-title>\n  </ion-navbar>\n\n</ion-header>\n<ion-content padding>\n  <div class="row alert servace-alert">\n    <div id="msg_hdr">\n      <div class="servace-banner">Thank you {{fname}}, for volunteering through ServACE.</div>\n      <p>There is no powerful force in this world than a neighbor willing to help another neighbor. \n      As you know, you will be earning valuable points to earn your stripes and "move up the deck"! For this event, you could earn an average of \n      {{eppts}} ServACE points to go with the points you already have earned, but if you give above and beyond and \n      your coordinator notices, those points may go higher. One day, they may call YOU a ServACE!</p>\n    </div>\n    <div class="row">\n      <div class ="col-md-6 col-sm-6">\n        <div class ="form-group">\n          <p id="msg_event_hdr">You will be volunteering for the event:</p>\n          <table id="msg_event_table">\n            <tr><th class ="col-md-3 col-sm-3">{{ename}} at</th></tr>\n            <tr><th class ="col-md-3 col-sm-3">{{vname}}</th></tr>\n            <tr><th class ="col-md-3 col-sm-3">{{vaddr}}</th></tr>\n            <tr><th class ="col-md-3 col-sm-3">You have volunteered for {{vperc}}% of this event time</tr>\n            <tr><th class ="col-md-3 col-sm-3">Starting Date: </th><td>{{estdt}}</td></tr>\n            <tr><th class ="col-md-3 col-sm-3">Ending Date: </th><td>{{eendt}}</td></tr>\n            <tr><th class ="col-md-3 col-sm-3">Daily Start at: </th><td>{{esttm}}</td></tr>\n            <tr><th class ="col-md-3 col-sm-3">Daily End at: </th><td>{{eentm}}</td></tr>                \n          </table>					\n        </div>\n        <p id="msg_POC_hdr">Event POC as follows:</p>\n        <table id="msg_POC_table">\n          <tr><th class ="col-md-3 col-sm-3">Name: </th><td>{{vpocn}}</td></tr>\n          <tr><th class ="col-md-3 col-sm-3">Phone: </th><td>{{vpocp}}</td></tr>\n          <tr><th class ="col-md-3 col-sm-3">Email: </th><td>{{vpoce}}</td></tr>\n        </table>\n        <div class ="col-md-6 col-sm-6">\n          <div id="mapCanvas_booking"></div>\n          <!--<img src="images/chips_numbers.png" /> <!-- placeholder, until map displays -->\n          <!--<button id="inform" name="inform" type="button" class="btn btn-info btn-lg" onclick="compileEmail()">Inform POC</button>\n          <br><label id="msg_response"></label>-->\n        </div>\n      </div>\n      <div>\n        <br><label id="msg_footer"><h4>Again, thank you for your ServACE! Hearts in Spades!</h4></label>\n      </div>\n    </div>\n  </div>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\bookings\bookings.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_0__services_DbConnectionService__["a" /* DbConnectionService */]])
    ], BookingsPage);
    return BookingsPage;
}());

//# sourceMappingURL=bookings.js.map

/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(246);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pages_ratings_ratings__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pages_venue_venue__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pages_newvolunteer_newvolunteer__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_newcoordinator_newcoordinator__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_platform_browser__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_component__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__angular_common_http__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_toast_service__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_loading_service__ = __webpack_require__(316);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_about_about__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_contact_contact__ = __webpack_require__(317);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_home_home__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_tabs_tabs__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_status_bar__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__ionic_native_splash_screen__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_profile_profile__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_opportunities_opportunities__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_scenarios_scenarios__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_signup_signup__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_login_login__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_bookings_bookings__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_register_register__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_surveys_surveys__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__pages_results_results__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_events_events__ = __webpack_require__(214);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["J" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_15__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_opportunities_opportunities__["a" /* OpportunitiesPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_scenarios_scenarios__["a" /* ScenariosPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_bookings_bookings__["a" /* BookingsPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_2__pages_newvolunteer_newvolunteer__["a" /* NewVolunteerPage */],
                __WEBPACK_IMPORTED_MODULE_3__pages_newcoordinator_newcoordinator__["a" /* NewCoordinatorPage */],
                __WEBPACK_IMPORTED_MODULE_1__pages_venue_venue__["a" /* VenuePage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_events_events__["a" /* VenueEventsPage */],
                __WEBPACK_IMPORTED_MODULE_0__pages_ratings_ratings__["a" /* RatingsPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_surveys_surveys__["a" /* SurveysPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_results_results__["a" /* ResultsPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_6__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_9__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_10__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_7_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../components/login/login-flat/login-flat.module#LoginFlatModule', name: 'LoginFlat', segment: 'login-flat', priority: 'low', defaultHistory: [] }
                    ]
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_7_ionic_angular__["a" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_15__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_opportunities_opportunities__["a" /* OpportunitiesPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_scenarios_scenarios__["a" /* ScenariosPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_bookings_bookings__["a" /* BookingsPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_2__pages_newvolunteer_newvolunteer__["a" /* NewVolunteerPage */],
                __WEBPACK_IMPORTED_MODULE_3__pages_newcoordinator_newcoordinator__["a" /* NewCoordinatorPage */],
                __WEBPACK_IMPORTED_MODULE_1__pages_venue_venue__["a" /* VenuePage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_events_events__["a" /* VenueEventsPage */],
                __WEBPACK_IMPORTED_MODULE_0__pages_ratings_ratings__["a" /* RatingsPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_surveys_surveys__["a" /* SurveysPage */],
                __WEBPACK_IMPORTED_MODULE_28__pages_results_results__["a" /* ResultsPage */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_5__angular_core__["i" /* CUSTOM_ELEMENTS_SCHEMA */]],
            providers: [
                __WEBPACK_IMPORTED_MODULE_18__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_19__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_9__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_11__services_toast_service__["a" /* ToastService */],
                __WEBPACK_IMPORTED_MODULE_12__services_loading_service__["a" /* LoadingService */],
                __WEBPACK_IMPORTED_MODULE_4__services_DbConnectionService__["a" /* DbConnectionService */],
                __WEBPACK_IMPORTED_MODULE_13__providers_global_global__["a" /* GlobalProvider */],
                { provide: __WEBPACK_IMPORTED_MODULE_5__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_7_ionic_angular__["b" /* IonicErrorHandler */] },
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(109);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        //rootPage:any = TabsPage;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 301:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var LoginService = /** @class */ (function () {
    function LoginService() {
        /*  Login Universal Data
        ==============================*/
        this.getDataForLoginFlat = function () {
            var data = {
                "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqZm27Ju0ifVO1pu92_1Jcmt3k8lrU92BJUoTPs0n9ShNY5SUp9g&s",
                "btnLogin": "Login",
                "txtUsername": "Username",
                "txtPassword": "Password",
                "txtForgotPassword": "Forgot password?",
                "btnResetYourPassword": "Reset your password",
                "txtHaveAccount": "Already have an account?",
                "txtSignupnow": "Don't have an account?",
                "btnSignupnow": "Signup now",
                "btnSignupVolnow": "Register as a Researcher",
                "btnSignupCoordnow": "Register as a GIS Suppliers",
                "title": "Welcome to HoodSearch,",
                "subtitle": "Discover your Neighborhood today",
                "errorUser": "Field can't be empty.",
                "errorPassword": "Field can't be empty."
            };
            return data;
        };
        this.getPhpCommand = function (phpCommandName) {
        };
    }
    LoginService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], LoginService);
    return LoginService;
}());

//# sourceMappingURL=login-service.js.map

/***/ }),

/***/ 316:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoadingService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LoadingService = /** @class */ (function () {
    function LoadingService(loadingCtrl) {
        this.loadingCtrl = loadingCtrl;
    }
    LoadingService.prototype.show = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    };
    LoadingService.prototype.hide = function () {
        this.loading.dismiss();
    };
    LoadingService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["e" /* LoadingController */]])
    ], LoadingService);
    return LoadingService;
}());

//# sourceMappingURL=loading-service.js.map

/***/ }),

/***/ 317:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ContactPage = /** @class */ (function () {
    function ContactPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ContactPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-contact',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\contact\contact.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Contact\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <ion-list-header>Follow us on Twitter</ion-list-header>\n    <ion-item>\n      <ion-icon name="ionic" item-start></ion-icon>\n      @ionicframework\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\contact\contact.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]])
    ], ContactPage);
    return ContactPage;
}());

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 318:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HomePage = /** @class */ (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>Home</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n		<!--<div class="form-group container-fluid">-->\n      <div class="row alert servace-alert">\n        <div class="servace-banner">ServACE Concept of the Volunteer Network</div>\n        <div class="col-md-10 col-sm-10 col-md-offset-1 col-sm-offset-1">\n          <div class="form-group" align="center">\n            <div class="embed-responsive embed-responsive-16by9">\n              <img class="embed-responsive-item" id="img_concept" alt="images/ServACE_diagram.png" src="../../assets/imgs/ServACE_diagram.png" />\n            </div>\n          </div>\n        </div>\n        <div class="row">\n          <div class ="col-md-6 col-sm-6">\n            <div class="form-group">\n              <h4>Willing to volunteer in your community? <br>Follow these directions to get started:</h4>\n              <ul>\n                <li>Register yourself as a ServerAce Volunteer, by browsing to <a href="index.php?action=vol_profile">ServACE Profiles</a></li>\n                <li>Browse to <a href="index.php?action=current_events">ServACE Opportunities</a> and look for a need you can fill</li>\n                <li>If you decide to volunteer, click the <a href="#">Sign Up</a> link to Volunteer</li>\n                <li>You will be given your event and POC\'s information. Your POC is very important to you.</li>\n                <li>Give it your all, because your POC <strong>will be rating your efforts</strong> and are the <strong>key to receiving ServAce points!</strong></li>\n                <li>Want to volunteer again? Your profile is ready, so got to the  <a href="index.php?action=current_events">ServACE Opportunities</a> and earn more ServACE points.</li>\n              </ul>\n            </div>\n          </div>\n          <div class ="col-md-6 col-sm-6">\n            <div class="form-group">\n              <h4>Looking for Volunteers to help you out? <br>Follow these directions to get started:</h4>\n              <ul>\n                <li>Register your Site for future events by browsing to <a href="index.php?action=venue_profile">Manage Venues</a></li>\n                <li>Have an event to be staffed? Describe it at the <a href="index.php?action=event_manage">Manage Events</a> page</li>\n                <li>Volunteers will be signing up and contacting you about your event.</li>\n                <li>Have a succesful vent, but take notice on which volunteers rose to the occuasion (and perhaps which did not).</li>\n                <li>After the event, rate your Volunteer\'s efforts at the <a href="index.php?action=rate_vols">Rate Volunteers</a> page. Your rating is very important and is the <strong>key to your volunteers earned ServACE points</strong></li>\n                <li>Have another event? Your Venue profile is ready, so got to the the <a href="index.php?action=event_manage">Manage Events</a> page to find more ServACE volunteers.</li>\n              </ul>\n            </div>\n          </div>\n        </div>\n      </div>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 319:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ProfilePage = /** @class */ (function () {
    function ProfilePage(navCtrl, navParams, http, dbcservice, globalProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.globalProvider = globalProvider;
        this.events = [];
        this.firstname = "Jacob";
        this.lastname = "Marley";
        this.email = "jm@bigchains.org";
        this.level = "4";
        this.points = 625.75;
        this.imgcard = "2_of_hearts.png";
        this.imgtable = "pokertable.jpg";
        // defaults 
        this.connection = this.dbcservice.getDbConnectionData();
        this.imgcard = this.connection['ImageCardPath'] + "2_of_hearts.png";
        this.imgtable = this.connection['ImagePokerPath'] + "poker_table_icon.png";
    }
    ProfilePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ProfilePage');
    };
    ProfilePage.prototype.ionViewWillEnter = function () {
        this.vid = this.queryUserId(this.globalProvider.getLoginId());
    };
    ProfilePage.prototype.queryUserId = function (loginid) {
        var _this = this;
        var ret;
        var url = this.dbcservice.getPhpCommand('getUserInfoPhp');
        //url = url + "?loginid=" + loginid;
        var params = new FormData();
        params.append('loginid', loginid.toString());
        console.log(url);
        //this.http.get(url)
        this.http.post(url, params)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null && data.length > 0) {
                _this.vid = data[0].vid;
                _this.getMainProfile(_this.dbcservice.getPhpCommand('getProfilePhp'), _this.vid);
            }
        });
        return this.vid;
    };
    ProfilePage.prototype.getMainProfile = function (phpCommand, vid) {
        var _this = this;
        var url = phpCommand + "?q=" + vid; //this.retrieveScript;
        console.log(url);
        this.http.get(url)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null && data.length > 0) {
                _this.firstname = data[0].firstname;
                _this.lastname = data[0].lastname;
                _this.email = data[0].email;
                _this.level = data[0].s_level;
                _this.points = data[0].s_score;
                _this.imgcard = _this.connection['ImageCardPath'] + data[0].s_card;
                _this.getHistoryList(_this.dbcservice.getPhpCommand('getProfileHistoryPhp'), vid);
            }
        });
    };
    ProfilePage.prototype.getHistoryList = function (phpCommand, vid) {
        var _this = this;
        var url = phpCommand + "?q=" + vid;
        this.http.get(url)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null && data.length > 0) {
                _this.events = data;
            }
        });
    };
    ProfilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["n" /* Component */])({
            selector: 'page-profile',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\profile\profile.html"*/'<!--\n  Generated template for the ProfilePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3 no-padding>\n      <img logo src="assets/imgs/ace_table_pan.png" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar>\n    <ion-title>Volunteer Profile</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <ion-card>\n      <ion-card-header text-center>\n        <ion-label no-margin text-center><ion-badge color="primary"><div class="servace-badge">{{firstname}} {{lastname}}</div></ion-badge></ion-label>\n      </ion-card-header>\n\n      <ion-card-content>\n        <ion-row>\n          <ion-col col-3>\n            <ion-item no-padding>\n              <!--<img class="profilecard" src=\'{{imgtable}}\'>-->\n              <img class="profilecard" src=\'{{imgcard}}\'>\n            </ion-item>\n          </ion-col>\n          <ion-col col-9>\n            <ion-item no-padding>\n              <ion-icon name="medal" item-start></ion-icon>\n              <ion-label no-margin>ServACE Level: \n              <ion-badge float-right color="secondary">{{level}}</ion-badge></ion-label>\n            </ion-item>\n            <ion-item no-padding>\n              <ion-icon name="list" item-start></ion-icon>\n              <ion-label no-margin>ServACE Points: \n              <ion-badge float-right color="secondary">{{points}}</ion-badge></ion-label>\n            </ion-item>\n            <ion-item no-padding>\n              <ion-icon name="mail" item-start></ion-icon>\n              <ion-label no-margin>Email: \n              <ion-badge float-right color="secondary">{{email}}</ion-badge></ion-label>\n            </ion-item>\n          </ion-col> \n        </ion-row>\n      </ion-card-content>\n    </ion-card>\n\n    <ion-card-header>\n      <ion-label text-center><div class="servace-menu">Volunteer History</div></ion-label>\n    </ion-card-header>\n    <ion-card-content>\n      <div class="table-hover">\n      <ion-list inset>\n          <ion-row>\n            <ion-col col-3 text-wrap>\n              <thead>Event</thead>\n            </ion-col>\n            <ion-col col-3 text-wrap>\n              <thead>Venue</thead>\n            </ion-col>\n            <ion-col col-2 text-wrap>\n              <thead>Start Date</thead>\n            </ion-col>\n            <ion-col col-2 text-wrap>\n              <thead>End Date</thead>\n            </ion-col>\n            <ion-col col-2 text-wrap>\n              <thead>Points Earned</thead>\n            </ion-col>\n          </ion-row>\n        <button ion-item *ngFor="let event of events">\n          <ion-row>\n            <ion-col col-3 text-wrap>\n              <td>{{ event.event_name }}</td>\n            </ion-col>\n            <ion-col col-3 text-wrap>\n              <td>{{ event.venue_name }}</td>\n            </ion-col>\n            <ion-col col-2 text-wrap>\n              <td>{{ event.startdate }}</td>\n            </ion-col>\n            <ion-col col-2 text-wrap>\n              <td>{{ event.enddate }}</td>\n            </ion-col>\n            <ion-col col-2 text-wrap>\n              <ion-badge item-end>{{event.s_pts}}</ion-badge>\n            </ion-col>\n          </ion-row>\n        </button>  \n      </ion-list>\n      </div>\n    </ion-card-content>\n\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\profile\profile.html"*/,
            providers: [
                __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__["a" /* DbConnectionService */]
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_0__providers_global_global__["a" /* GlobalProvider */]])
    ], ProfilePage);
    return ProfilePage;
}());

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 320:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OpportunitiesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_global_global__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__signup_signup__ = __webpack_require__(223);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the OpportunitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var OpportunitiesPage = /** @class */ (function () {
    function OpportunitiesPage(navCtrl, navParams, http, dbcservice, globalProvider) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.dbcservice = dbcservice;
        this.globalProvider = globalProvider;
        this.latitude = 40.0;
        this.longitude = -75.0;
        this.connection = this.dbcservice.getDbConnectionData();
    }
    OpportunitiesPage.prototype.ionViewWillEnter = function () {
        this.queryUserId(this.globalProvider.getLoginId());
        this.getOpportunitiesList(this.dbcservice.getPhpCommand('getOpportunitiesPhp'));
    };
    /*ionViewDidLoad() {
      this.queryEvents();
    }*/
    OpportunitiesPage.prototype.queryUserId = function (loginid) {
        var _this = this;
        var stat = false;
        var err;
        var url = this.dbcservice.getPhpCommand('getUserInfoPhp');
        var params = new FormData();
        params.append('loginid', loginid.toString());
        console.log(url);
        this.http.post(url, params)
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            if (data != null && data.length > 0) {
                console.log(data[0]);
                _this.vid = data[0].vid;
                //this.getOpportunitiesList(this.dbcservice.getPhpCommand('getOpportunitiesPhp'));
            }
        });
    };
    OpportunitiesPage.prototype.getOpportunitiesList = function (phpCommand) {
        var _this = this;
        var url = phpCommand;
        this.http.get(url)
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            console.log(data);
            if (data != null) {
                _this.events = data;
                _this.queryEvents(data);
            }
        });
    };
    OpportunitiesPage.prototype.queryEvents = function (the_events) {
        this.currentLocation = new google.maps.LatLng(this.latitude, this.longitude);
        var mapOptions = {
            center: this.currentLocation,
            zoom: 12,
            mapTypeId: 'roadmap'
        };
        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        if (the_events) {
            // set map bounds
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < the_events.length; i++) {
                var active = the_events[i].vols_required > 0;
                this.createMarker(the_events[i], bounds, active);
            }
            this.map.fitBounds(bounds);
        }
    };
    OpportunitiesPage.prototype.createMarker = function (place, bounds, active) {
        var marker = new google.maps.Marker({
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
        google.maps.event.addListener(marker, 'click', function () {
            var infowindow = new google.maps.InfoWindow({
                content: infocontent
            });
            infowindow.open(this.map, this);
        });
        // set map bounds
        if (bounds)
            bounds.extend(marker.position);
    };
    OpportunitiesPage.prototype.goToSignupPage = function (index) {
        var eid = 0;
        if (this.events && this.events.length > index)
            eid = this.events[index].eventid;
        //alert(eid);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__signup_signup__["a" /* SignupPage */], {
            eventid: eid,
            vid: this.vid,
        });
    };
    OpportunitiesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["n" /* Component */])({
            selector: 'page-opportunities',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\opportunities\opportunities.html"*/'<!--\n  Generated template for the OpportunitiesPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n    <ion-col col-12 col-md-6 offset-md-3>\n      <img logo src="assets/imgs/ace_table_pan.png" />\n    </ion-col>\n  </ion-row>\n  <ion-navbar>\n    <ion-title>HoodSearch Scenarios</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n    <div id="map"></div>\n    <div id="resultList">\n      <div class="table-hover">\n      <ion-list>\n        <button ion-item *ngIf="events" >{{events?.length || \'0\'}} Events Found </button>\n        <ion-row>\n          \n          <ion-col col-3 text-wrap>\n            <thead>Venue</thead>\n          </ion-col>\n          <ion-col col-3 text-wrap>\n            <thead>Event</thead>\n          </ion-col>\n          <ion-col col-2 text-wrap>\n            <thead>Start Date</thead>\n          </ion-col>\n          <ion-col col-2 text-wrap>\n            <thead>End Date</thead>\n          </ion-col>\n        </ion-row>\n        <button ion-item *ngFor="let event of events; let i=index" (click)="goToSignupPage(i)">\n          <!-- show grid here -->\n          <ion-row>\n            \n            <ion-col col-3 text-wrap>\n              <td>{{ event.venue_name }}</td>\n            </ion-col>\n            <ion-col col-3 text-wrap>\n              <td>{{ event.event_name }}</td>\n            </ion-col>\n            <ion-col col-2 text-wrap>\n              <td>{{ event.startdate }}</td>\n            </ion-col>\n            <ion-col col-2 text-wrap>\n              <td>{{ event.enddate }}</td>\n            </ion-col>\n            <ion-col col-2 text-wrap>\n              <ion-badge item-end float-right color="secondary" *ngIf="event.vols_required; else coveredBlock">Signup</ion-badge>\n              <ng-template  #coveredBlock><ion-badge item-end float-right color="light">Covered</ion-badge></ng-template>\n            </ion-col>\n            \n          </ion-row>\n        </button>\n      </ion-list>  \n    </div>\n    </div>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\opportunities\opportunities.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */],
            __WEBPACK_IMPORTED_MODULE_1__services_DbConnectionService__["a" /* DbConnectionService */], __WEBPACK_IMPORTED_MODULE_0__providers_global_global__["a" /* GlobalProvider */]])
    ], OpportunitiesPage);
    return OpportunitiesPage;
}());

//# sourceMappingURL=opportunities.js.map

/***/ }),

/***/ 321:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var RegisterPage = /** @class */ (function () {
    function RegisterPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.roletypes = ['Administrator', 'Volunteer', 'Coordinator'];
        this.role = 1;
    }
    RegisterPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad RegisterPage');
    };
    RegisterPage.prototype.onRegister = function () {
        //alert("Register user");
    };
    RegisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-register',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\register\register.html"*/'<!--\n  Generated template for the RegisterPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <ion-title>Register</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-col col-10 offset-1 col-md-6 offset-md-3>\n      <!--<form padding>-->\n        <ion-row align-items-start>\n          <ion-col col-12>\n            <h1>Register as a <strong>Hood Researcher</strong></h1>\n          </ion-col>\n        </ion-row>\n        <!-- Input-field -->\n        <ion-row>\n          <ion-col col-12>\n            <div>\n              <!-- Input-field-text -->\n              <ion-item no-padding>\n                <ion-label>Username</ion-label>\n                <ion-input type="text" [(ngModel)]="username" [ngModelOptions]="{standalone: true}"></ion-input>\n              </ion-item>\n              <ion-item no-padding>\n                <ion-label>Password</ion-label>\n                <ion-input type="password" [(ngModel)]="password" [ngModelOptions]="{standalone: true}"></ion-input>\n              </ion-item>\n            </div>\n            <div>\n              <ion-item no-padding>\n                <ion-label>First Name</ion-label>\n                <ion-input type="text" [(ngModel)]="firstname" [ngModelOptions]="{standalone: true}"></ion-input>\n              </ion-item>\n              <ion-item no-padding>\n                <ion-label>Last Name</ion-label>\n                <ion-input type="text" [(ngModel)]="lastname" [ngModelOptions]="{standalone: true}"></ion-input>\n              </ion-item>\n              <ion-item no-padding>\n                <ion-label>Email</ion-label>\n                <ion-input type="email" [(ngModel)]="email" [ngModelOptions]="{standalone: true}"></ion-input>\n              </ion-item>             \n              <ion-item no-padding>\n                <ion-label>Phone</ion-label>\n                <ion-input type="tel" [(ngModel)]="tel" [ngModelOptions]="{standalone: true}"></ion-input>\n              </ion-item>\n              <ion-item>\n                <ion-label>Role</ion-label>\n                <ion-select [(ngModel)]="role">\n                  <!--<ion-option value="0"> {{roletypes[0]}} </ion-option>-->\n                  <ion-option value="1"> {{roletypes[1]}} </ion-option>\n                  <ion-option value="2"> {{roletypes[2]}} </ion-option>\n                </ion-select>\n              </ion-item>\n            </div>\n            <!-- Register button -->\n            <div>\n              <ion-col col-12 no-padding>\n                <button no-margin ion-button full text-uppercase (click)="onRegister()">Register</button>\n              </ion-col>\n            </div>\n          </ion-col>\n        </ion-row>\n      <!--</form>-->\n  </ion-col>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\register\register.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */]])
    ], RegisterPage);
    return RegisterPage;
}());

//# sourceMappingURL=register.js.map

/***/ }),

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToastService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ToastService = /** @class */ (function () {
    function ToastService(toastCtrl) {
        this.toastCtrl = toastCtrl;
    }
    ToastService.prototype.presentToast = function (message) {
        var toastItem = {
            "duration": 1000,
            "position": "buttom"
        };
        toastItem["message"] = message;
        var toast = this.toastCtrl.create(toastItem);
        toast.present();
    };
    ToastService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["B" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["i" /* ToastController */]])
    ], ToastService);
    return ToastService;
}());

//# sourceMappingURL=toast-service.js.map

/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ResultsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__(25);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the ResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ResultsPage = /** @class */ (function () {
    function ResultsPage(navCtrl, navParams, sanitizer) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.sanitizer = sanitizer;
        this.SURVEYID_DEFAULT = "";
        this.SURVEYTITLE_DEFAULT = "Harford County Viewer";
        this.RESULTSURL_DEFAULT = "http://umdmpsgis.maps.arcgis.com/apps/opsdashboard/index.html#/0131755b4c144db2a50e61e5974c685f"; // use direct
        this.RESULTSURL_1 = "http://umdmpsgis.maps.arcgis.com/apps/opsdashboard/index.html#/7a2e002ead9e45c182a381b6c66abaae";
        this.RESULTSURL_2 = "http://umdmpsgis.maps.arcgis.com/apps/opsdashboard/index.html#/456293e4b66946afab7b001164a4d8c4";
        this.RESULTSURL_3 = "http://umdmpsgis.maps.arcgis.com/apps/opsdashboard/index.html#/797ccc00c70e4b159194ca30b4d50fd3";
        this.surveyid = this.SURVEYID_DEFAULT;
        this.surveytitle = this.SURVEYTITLE_DEFAULT;
        this._keysize = 8;
        this.setup();
    }
    ResultsPage.prototype.ionViewWillEnter = function () {
        this.setup();
    };
    ResultsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad ResultsPage');
    };
    ResultsPage.prototype.setup = function () {
        this.survey_results_map = new Map();
        this.setResultsMapping(this._keysize);
        this.surveyid = this.navParams.get('surveyid');
        this.surveytitle = this.SURVEYTITLE_DEFAULT;
        if (this.navParams.get('surveytitle') != "")
            this.surveytitle = this.navParams.get('surveytitle');
    };
    /* This section provides implementation for static presentation.
     * In this case, we need to swap sample maps based on results requested.
     * The results are identified by surveyid
     */
    ResultsPage.prototype.setResultsMapping = function (numchars) {
        this.survey_results_map.set("default", this.RESULTSURL_DEFAULT); // default, in case no match
        this.survey_results_map.set(this.guidToString("{995c0601-bc77-43b1-8186-3edd46397699}", numchars), this.RESULTSURL_1); // HoodSearchOD_One: A Place for Joe
        this.survey_results_map.set(this.guidToString("{8e5b16e5-8f58-4406-8665-ee3ed0a6ffe7}", numchars), this.RESULTSURL_2); // HoodSearchOD_Two: Rural with Older Kids
        this.survey_results_map.set(this.guidToString("{aa256b64-524c-486f-912f-4f9c0f096bd9}", numchars), this.RESULTSURL_3); // HoodSearchOD_Three: Kids with Many Wants
        console.log(this.survey_results_map);
    };
    // given a guid, return the 'n'th number of characters
    ResultsPage.prototype.guidToString = function (guid, n) {
        var subguid = "";
        var stidx = 0;
        if (guid) {
            if (guid.startsWith("{")) {
                stidx++;
            }
            subguid = guid.substr(stidx, n);
        }
        return subguid;
    };
    ResultsPage.prototype.getResultsUrl = function () {
        var fullurl = this.RESULTSURL_DEFAULT;
        var activesid = this.SURVEYID_DEFAULT;
        activesid = this.guidToString(this.surveyid, this._keysize);
        //console.log("surveyid = " + activesid);
        if (this.survey_results_map.has(activesid)) {
            fullurl = this.survey_results_map.get(activesid);
            //console.log("Results will display the map: " + fullurl);
        }
        return this.sanitizer.bypassSecurityTrustResourceUrl(fullurl);
    };
    ResultsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'page-results',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\results\results.html"*/'<!--\n  Generated template for the ResultsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-row header align-items-start align-items-stretch>\n  </ion-row>\n  <ion-navbar>\n    <ion-row><ion-title>HoodSearch Results - {{ surveytitle }}</ion-title>\n      <img class="prodicon" src="https://image.flaticon.com/icons/png/512/1028/1028047.png" />\n    </ion-row>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <ion-card>\n    <!--<div>\n      <small><a href="http://arcg.is/114uTf" target="_blank">View larger map</a></small><br>\n    </div> -->\n    <div class="embed-container">\n      <!-- <iframe frameborder="0" scrolling="yes" marginheight="0" marginwidth="0" title="Ops Dashboard Survey Results" src="http://arcg.is/114uTf"></iframe> -->\n     <iframe class="iframe" frameborder="0" scrolling="yes" marginheight="0" marginwidth="0" title="Ops Dashboard Survey Results" [src]="getResultsUrl()"></iframe>\n\n\n\n      <!--<br>\n      <iframe width="500" height="400" \n      frameborder="0" scrolling="no" marginheight="0" marginwidth="0" \n      title="Foliage Drawing" \n      src="//umdmpsgis.maps.arcgis.com/apps/Embed/index.html?webmap=d6c920d67418433287a8707240da3522&extent=-76.487,39.5335,-76.4846,39.5347&zoom=true&previewImage=false&scale=true&legendlayers=true&basemap_gallery=true&disable_scroll=false&theme=dark&marker=-76.485924;39.53406;;Home%20base%20for%20tree%20line%20and%20foliage%20collection;http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fpaomedia%2Fsmall-n-flat%2F1024%2Fhouse-icon.png;Home"></iframe>\n      -->\n\n\n    </div> \n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\pages\results\results.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["c" /* DomSanitizer */]])
    ], ResultsPage);
    return ResultsPage;
}());

//# sourceMappingURL=results.js.map

/***/ })

},[225]);
//# sourceMappingURL=main.js.map