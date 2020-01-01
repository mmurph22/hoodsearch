webpackJsonp([0],{

/***/ 322:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginFlatModule", function() { return LoginFlatModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__login_flat__ = __webpack_require__(323);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var LoginFlatModule = /** @class */ (function () {
    function LoginFlatModule() {
    }
    LoginFlatModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["J" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__login_flat__["a" /* LoginFlat */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["d" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__login_flat__["a" /* LoginFlat */]),
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_2__login_flat__["a" /* LoginFlat */]
            ],
            schemas: [__WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* CUSTOM_ELEMENTS_SCHEMA */]]
        })
    ], LoginFlatModule);
    return LoginFlatModule;
}());

//# sourceMappingURL=login-flat.module.js.map

/***/ }),

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginFlat; });
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

var LoginFlat = /** @class */ (function () {
    function LoginFlat() {
        var _this = this;
        this.onEvent = function (event) {
            if (event == "onLogin" && !_this.validate()) {
                return;
            }
            if (_this.events[event]) {
                _this.events[event]({
                    'username': _this.username,
                    'password': _this.password
                });
            }
        };
        this.isUsernameValid = true;
        this.isPasswordValid = true;
    }
    LoginFlat.prototype.validate = function () {
        this.isUsernameValid = true;
        this.isPasswordValid = true;
        if (!this.username || this.username.length == 0) {
            this.isUsernameValid = false;
        }
        if (!this.password || this.password.length == 0) {
            this.isPasswordValid = false;
        }
        return this.isPasswordValid && this.isUsernameValid;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], LoginFlat.prototype, "data", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["E" /* Input */])(),
        __metadata("design:type", Object)
    ], LoginFlat.prototype, "events", void 0);
    LoginFlat = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'login-flat',template:/*ion-inline-start:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\components\login\login-flat\login-flat.html"*/'<!-- Themes  register-flat-->\n\n<ion-content *ngIf="data != null">\n\n  <ion-grid no-padding>\n\n    <!-- logo -->\n\n    <ion-row header align-items-start align-items-stretch>\n\n      <ion-col col-10 offset-1 col-md-6 offset-md-3>\n\n        <img logo src="{{data.logo}}" />\n\n      </ion-col>\n\n\n\n    <!-- Section form>-->\n\n  <ion-col col-10 offset-1 col-md-6 offset-md-3>\n\n    <form padding>\n\n      <ion-row align-items-start>\n\n        <ion-col col-12>\n\n          <h1><strong>{{data.title}}</strong> {{data.subtitle}}</h1>\n\n        </ion-col>\n\n      </ion-row>\n\n      <!-- Input-field -->\n\n      <ion-row>\n\n        <ion-col col-12>\n\n          <div input-field>\n\n            <!-- Input-field-text -->\n\n            <ion-item no-padding>\n\n              <ion-input type="text" [placeholder]="data.txtUsername" [(ngModel)]="username" [ngModelOptions]="{standalone: true}"></ion-input>\n\n<!--               <ion-label no-margin *ngIf="!isUsernameValid">{{data.errorUser}}</ion-label>\n\n -->            </ion-item>\n\n            <!-- Input-field-password -->\n\n            <ion-item no-padding>\n\n              <ion-input type="password" [placeholder]="data.txtPassword" [(ngModel)]="password" [ngModelOptions]="{standalone: true}"></ion-input>\n\n              <!-- <ion-label no-margin *ngIf="!isPasswordValid">{{data.errorPassword}}</ion-label> -->\n\n            </ion-item>\n\n          </div>\n\n          <!-- Login button -->\n\n          <ion-col col-12 no-padding>\n\n            <button no-margin ion-button full text-uppercase (click)="onEvent(\'onLogin\')">{{data.btnLogin}}</button>\n\n          </ion-col>\n\n          <!-- Description -->\n\n          <div description text-center>\n\n            <ion-row>\n\n              <!-- Reset your password button -->\n\n              <ion-col col-12 no-padding no-margin>\n\n                <p no-margin no-padding>{{data.txtForgotPassword}} <a>{{data.btnResetYourPassword}}</a> </p>\n\n              </ion-col>\n\n              <!-- Signup now button -->\n\n              <ion-col col-12padding>\n\n                <p no-margin no-padding>{{data.txtSignupnow}} <a>{{data.btnSignupnow}}</a> </p>\n\n              </ion-col>\n\n            </ion-row>\n\n          </div>\n\n        </ion-col>\n\n      </ion-row>\n\n    </form>\n\n    </ion-col>\n\n        </ion-row>\n\n  </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"D:\UMD\GEOG797\Project\ionic\HoodTabs\src\components\login\login-flat\login-flat.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], LoginFlat);
    return LoginFlat;
}());

//# sourceMappingURL=login-flat.js.map

/***/ })

});
//# sourceMappingURL=0.js.map