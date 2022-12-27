define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('RegisterPenutupanKasCtrl', ['$scope', '$state', '$mdDialog','MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
            $state.go("LaporanKeuangan", {
                parameter: 'BBBBB'
            })
            
            /////////////////////////////////////////////////////////////////////
        }
    ]);
});