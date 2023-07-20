define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('EISCtrl', ['$scope', '$state', '$mdDialog','MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
            window.open('http://192.168.99.165/eis', '_blank');

            
            /////////////////////////////////////////////////////////////////////
        }
    ]);
});