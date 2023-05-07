define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('MataAnggaranPermenRBACtrl', ['$scope', '$state', '$mdDialog','MedifirstService',
        function ($scope, $state, $mdDialog, medifirstService) {
            $state.go("KelompokAnggaran", {
                parameter: '67676'
            })
            
            /////////////////////////////////////////////////////////////////////
        }
    ]);
});