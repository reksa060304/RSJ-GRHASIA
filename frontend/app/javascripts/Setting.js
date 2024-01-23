define([], function () {
    'use strict';
if (window.location.host.indexOf('apps') > -1) {
        return {

            // BaseUrl: 'https://apps.transmedic.co.id:2222/app/data/GetRouting',
            // RouteUrl: 'https://apps.transmedic.co.id:2222/app/data/GetRouting',
            UrlDataConfig: 'https://apps.transmedic.co.id:2101/app/data/GetRequireConfig',
            urlSocket: 'https://apps.transmedic.co.id:2101',
            baseUrlData: "https://apps.transmedic.co.id:2101/app/data/",
            urlRoute: 'https://apps.transmedic.co.id:2101/app/data/GetRouting',
            urlRoutePelayanan: 'https://apps.transmedic.co.id:2101/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'https://apps.transmedic.co.id:2101/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'https://apps.transmedic.co.id:2101/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'https://apps.transmedic.co.id:2101/app/data/GetRoutingManagemen',
            urlRouteSDM: 'https://apps.transmedic.co.id:2101/app/data/GetRoutingSDM',


            urlPACSEngine: 'https://apps.transmedic.co.id:2301',
            urlPACSViewer: 'http://bdg2.jasamedika.com:2303',
            urlPACSJpeg : 'https:/apps.transmedic.co.id:2222',



            baseUrlLogin: "https://apps.transmedic.co.id:2101/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "https://apps.transmedic.co.id:2101/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'https://apps.transmedic.co.id:2101/service/medifirst2000/',
            baseProfileMenu: 1,

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    } else  if(window.location.hostname.indexOf('localhost') > -1) {
        return {
           // BaseUrl: 'http://transmedic.co.id:2100/app/data/GetRouting',
            // RouteUrl: 'http://transmedic.co.id:2100/app/data/GetRouting',
            UrlDataConfig: 'http://localhost:2299/app/data/GetRequireConfig',         
            urlSocket: 'http://localhost:8881',
            baseUrlData: "http://localhost:2299/app/data/",         
            urlRoute: 'http://localhost:2299/app/data/GetRouting',
            urlRoutePelayanan: 'http://localhost:2299/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'http://localhost:2299/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'http://localhost:2299/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'http://localhost:2299/app/data/GetRoutingManagemen',
            urlRouteSDM: 'http://localhost:2299/app/data/GetRoutingSDM',

            baseUrlLogin: "http://localhost:9300/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "http://localhost:9300/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'http://localhost:9300/service/medifirst2000/',
            baseProfileMenu: 1, 

            urlPACSEngine: 'https://transmedic.co.id:2301',
            urlPACSViewer: 'http://bdg2.jasamedika.com:2303',
            urlPACSJpeg : 'https://localhost:8880',

            aktifkanSocket : false,
            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    }
});
