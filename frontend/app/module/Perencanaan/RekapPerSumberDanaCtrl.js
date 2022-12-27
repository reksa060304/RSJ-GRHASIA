define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('RekapPerSumberDanaCtrl', ['$scope', '$state', '$mdDialog','MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
            $state.go("LaporanPerJenisAnggaran", {
                parameter: '99999'
            })
            
            /////////////////////////////////////////////////////////////////////
        }
    ]);
});