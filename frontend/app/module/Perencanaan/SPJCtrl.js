define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('SPJCtrl', ['$scope', '$state', '$mdDialog','MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
            // $state.go("KelompokAnggaran", {
            //     parameter: '77777'
            // })

            $state.go("KelompokAnggaran2024", {
                parameter: '77777'
            })
            
            /////////////////////////////////////////////////////////////////////
        }
    ]);
});