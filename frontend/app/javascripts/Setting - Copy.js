define([], function () {
    'use strict';
    if (window.location.hostname.indexOf('transmedic') > -1) {
        return { 

            // BaseUrl: 'http://transmedic.co.id:4444/app/data/GetRouting',
            // RouteUrl: 'http://transmedic.co.id:4444/app/data/GetRouting',
            UrlDataConfig: 'http://transmedic.co.id:4444/app/data/GetRequireConfig',         
            urlSocket: 'http://transmedic.co.id:4444',
            baseUrlData: "http://transmedic.co.id:4444/app/data/",         
            urlRoute: 'http://transmedic.co.id:4444/app/data/GetRouting',
            urlRoutePelayanan: 'http://transmedic.co.id:4444/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'http://transmedic.co.id:4444/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'http://transmedic.co.id:4444/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'http://transmedic.co.id:4444/app/data/GetRoutingManagemen',
            urlRouteSDM: 'http://transmedic.co.id:4444/app/data/GetRoutingSDM',

            urlPACSEngine: 'http://10.122.250.11:8080',
            urlPACSViewer: 'http://10.122.250.11:8118',
            urlPACSJpeg : 'http://10.122.250.11',
			
            baseUrlLogin: "http://transmedic.co.id:8400/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "http://transmedic.co.id:8400/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'http://transmedic.co.id:8400/service/medifirst2000/',
            baseProfileMenu: 1, 

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    } 
     else  if(window.location.hostname.indexOf('202.138') > -1) {
        return {
           // BaseUrl: 'http://transmedic.co.id:4444/app/data/GetRouting',
            // RouteUrl: 'http://transmedic.co.id:4444/app/data/GetRouting',
            UrlDataConfig: 'http://transmedic.co.id:4444/app/data/GetRequireConfig',         
            urlSocket: 'http://transmedic.co.id:4444',
            baseUrlData: "http://transmedic.co.id:4444/app/data/",         
            urlRoute: 'http://transmedic.co.id:4444/app/data/GetRouting',
            urlRoutePelayanan: 'http://transmedic.co.id:4444/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'http://transmedic.co.id:4444/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'http://transmedic.co.id:4444/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'http://transmedic.co.id:4444/app/data/GetRoutingManagemen',
            urlRouteSDM: 'http://transmedic.co.id:4444/app/data/GetRoutingSDM',

            urlPACSEngine: 'http://10.122.250.11:8080',
            urlPACSViewer: 'http://10.122.250.11:8118',
            urlPACSJpeg : 'http://10.122.250.11',

            baseUrlLogin: "http://transmedic.co.id:8400/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "http://transmedic.co.id:8400/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'http://transmedic.co.id:8400/service/medifirst2000/',
            baseProfileMenu: 1, 

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    }
	 else  if(window.location.hostname.indexOf('localhost') > -1) {
        return {
           // BaseUrl: 'http://transmedic.co.id:4444/app/data/GetRouting',
            // RouteUrl: 'http://transmedic.co.id:4444/app/data/GetRouting',
            UrlDataConfig: 'http://localhost:4444/app/data/GetRequireConfig',         
            urlSocket: 'http://localhost:4444',
            baseUrlData: "http://localhost:4444/app/data/",         
            urlRoute: 'http://localhost:4444/app/data/GetRouting',
            urlRoutePelayanan: 'http://localhost:4444/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'http://localhost:4444/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'http://localhost:4444/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'http://localhost:4444/app/data/GetRoutingManagemen',
            urlRouteSDM: 'http://localhost:4444/app/data/GetRoutingSDM',

            urlPACSEngine: 'http://10.122.250.11:8080',
            urlPACSViewer: 'http://10.122.250.11:8118',
            urlPACSJpeg : 'http://10.122.250.11',

            baseUrlLogin: "http://localhost:8400/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "http://localhost:8400/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'http://localhost:8400/service/medifirst2000/',
            baseProfileMenu: 1, 

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    }else {
        return {
           // BaseUrl: 'http://transmedic.co.id:4444/app/data/GetRouting',
            // RouteUrl: 'http://transmedic.co.id:4444/app/data/GetRouting',
            UrlDataConfig: 'http://172.20.1.13:4444/app/data/GetRequireConfig',         
            urlSocket: 'http://172.20.1.13:4444',
            baseUrlData: "http://172.20.1.13:4444/app/data/",         
            urlRoute: 'http://172.20.1.13:4444/app/data/GetRouting',
            urlRoutePelayanan: 'http://172.20.1.13:4444/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'http://172.20.1.13:4444/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'http://172.20.1.13:4444/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'http://172.20.1.13:4444/app/data/GetRoutingManagemen',
            urlRouteSDM: 'http://172.20.1.13:4444/app/data/GetRoutingSDM',
            
            urlPACSEngine: 'http://10.122.250.11:8080',
            urlPACSViewer: 'http://10.122.250.11:8118',
            urlPACSJpeg : 'http://10.122.250.11',

            baseUrlLogin: "http://192.168.0.79:8400/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "http://192.168.0.79:8400/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'http://192.168.0.79:8400/service/medifirst2000/',
            baseProfileMenu: 1, 

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    }
});
