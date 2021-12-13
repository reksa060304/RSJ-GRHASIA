define([], function () {
    'use strict';
    if (window.location.hostname.indexOf('rsud') > -1) {
        return {

            UrlDataConfig: 'https://www.rsudcibinong.xy/app/data/GetRequireConfig',
            urlSocket: 'https://www.rsudcibinong.xyz',
            baseUrlData: "https://www.rsudcibinong.xyz/app/data/",
            urlRoute: 'https://www.rsudcibinong.xyz/app/data/GetRouting',
            urlRoutePelayanan: 'https://www.rsudcibinong.xyz/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'https://www.rsudcibinong.xyz/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'https://www.rsudcibinong.xyz/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'https://www.rsudcibinong.xyz/app/data/GetRoutingManagemen',
            urlRouteSDM: 'https://www.rsudcibinong.xyz/app/data/GetRoutingSDM',

            baseUrlLogin: "https://www.rsudcibinong.xyz/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "https://www.rsudcibinong.xyz/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'https://www.rsudcibinong.xyz/service/medifirst2000/',
            baseProfileMenu: 1,

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    } else if (window.location.hostname.indexOf('localhost') > -1) {
        return {
            // BaseUrl: 'http://transmedic.co.id:2255/app/data/GetRouting',
            // RouteUrl: 'http://transmedic.co.id:2255/app/data/GetRouting',
            UrlDataConfig: 'http://localhost:2255/app/data/GetRequireConfig',
            urlSocket: 'http://localhost:9998',
            baseUrlData: "http://localhost:2255/app/data/",
            urlRoute: 'http://localhost:2255/app/data/GetRouting',
            urlRoutePelayanan: 'http://localhost:2255/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'http://localhost:2255/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'http://localhost:2255/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'http://localhost:2255/app/data/GetRoutingManagemen',
            urlRouteSDM: 'http://localhost:2255/app/data/GetRoutingSDM',

            baseUrlLogin: "http://localhost:8600/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "http://localhost:8600/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'http://localhost:8600/service/medifirst2000/',
            baseProfileMenu: 1,

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    } else {
        return {
            UrlDataConfig: '/app/data/GetRequireConfig',
            urlSocket: '',
            baseUrlData: "/app/data/",
            urlRoute: '/app/data/GetRouting',
            urlRoutePelayanan: '/app/data/GetRoutingPelayanan',
            urlRouteSarpras: '/app/data/GetRoutingSarpras',
            urlRouteKeuangan: '/app/data/GetRoutingKeuangan',
            urlRouteManagemen: '/app/data/GetRoutingManagemen',
            urlRouteSDM: '/app/data/GetRoutingSDM',

            baseUrlLogin: "/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "/service/medifirst2000/auth/sign-out",
            baseApiBackend: '/service/medifirst2000/',
            baseProfileMenu: 1,

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    }
});