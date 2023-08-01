define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('LaporanPenyerapanAnggaranVerifCtrl', ['$scope', '$state', '$mdDialog', 'MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
            $state.go("LaporanKeuangan", {
                parameter: '101010'
            })
            
            /////////////////////////////////////////////////////////////////////
        }
    ]);
});