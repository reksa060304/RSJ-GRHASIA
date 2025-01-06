define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('PanjarCtrl', ['$scope', '$state', '$mdDialog','MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
            // $state.go("KelompokAnggaran", {
            //     parameter: '99999'
            // })

            $state.go("KelompokAnggaran2024", {
                parameter: '99999'
            })
            
            /////////////////////////////////////////////////////////////////////
        }
    ]);
});