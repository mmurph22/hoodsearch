import { Injectable } from '@angular/core';

@Injectable()
export class DbConnectionService {

    constructor() { }

    getDbConnectionData = () => {
        let data = {
            //server urls
            "remoteBaseUrl": 'http://129.2.24.226:8080/mps/mmurph22/geog797/HoodSearch/',
            "localBaseUrl": "http://localhost/:8101/",
            "testBaseUrl": "http://129.2.24.226:8080/mps/mmurph22/geog650/Final/",
            "PhpSuffix": ".php",
            "ImageCardPath": "../../assets/imgs/cards/",
            "ImagePokerPath": "../../assets/imgs/",
            "surveyDataUrl":"https://services5.arcgis.com/njRHYVhl2CMXMsap/arcgis/rest/services/service_9eb8e96e758340a59c7630dd2f166af1/FeatureServer",
            "restComQuery" : "/0",

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

    getPhpCommand(phpCommand: string) {
        let connection = this.getDbConnectionData();
        let url = connection['remoteBaseUrl'] + connection[phpCommand] + connection['PhpSuffix'];
        return url;
    }
    getRestCommand(phpCommand: string) {
        let connection = this.getDbConnectionData();
        let url = connection[phpCommand] + connection['restComQuery'];
        return url;
    }
}
