define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('SP3BPCtrl', ['$scope', '$state', '$mdDialog','MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
            $state.go("LaporanKeuangan", {
                parameter: 'DDDDD'
            })
            
            /////////////////////////////////////////////////////////////////////
        }
    ]);
});