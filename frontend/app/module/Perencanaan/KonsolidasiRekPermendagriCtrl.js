define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('KonsolidasiRekPermendagriCtrl', ['$scope', '$state', '$mdDialog','MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
            $state.go("LaporanPerJenisAnggaran", {
                parameter: '33333'
            })
            
            /////////////////////////////////////////////////////////////////////
        }
    ]);
});