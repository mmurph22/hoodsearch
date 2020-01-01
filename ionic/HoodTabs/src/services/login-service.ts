import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

    constructor() { }


    /*  Login Universal Data
    ==============================*/
    getDataForLoginFlat = () => {
        let data = {
            "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqZm27Ju0ifVO1pu92_1Jcmt3k8lrU92BJUoTPs0n9ShNY5SUp9g&s",
            "btnLogin": "Login",
            "txtUsername" : "Username",
            "txtPassword" : "Password",
            "txtForgotPassword" : "Forgot password?",
            "btnResetYourPassword": "Reset your password",
            "txtHaveAccount": "Already have an account?",
            "txtSignupnow" : "Don't have an account?",
            "btnSignupnow": "Signup now",
            "btnSignupVolnow": "Register as a Researcher",
            "btnSignupCoordnow": "Register as a GIS Suppliers",
            "title": "Welcome to HoodSearch,",
            "subtitle": "Discover your Neighborhood today",
            "errorUser" : "Field can't be empty.",
            "errorPassword" : "Field can't be empty."
        };
        return data;
    };

    getPhpCommand = (phpCommandName: string) => {
        
    }
}
