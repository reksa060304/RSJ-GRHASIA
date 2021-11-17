define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPerinatologi6Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210229
            var dataLoad = []
            var norecEMR = ''
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if(cacheNoREC!= undefined){
                norecEMR = cacheNomorEMR[1]
            }
            if (cacheNomorEMR != undefined) {
                nomorEMR = cacheNomorEMR[0]
                norecEMR = cacheNomorEMR[1]
                $scope.cc.norec_emr = nomorEMR
            }
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.getPart('emr/get-datacombo-part-kelas', true, true, 20).then(function (data) {
                $scope.listKelas = data

            })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuang = data

            })
            var sesiesSuhu = []
            var seriesNadi = []
            loadChart()
            function loadChart() {
                $("#chartNadi").kendoChart({
                    title: {
                        text: "Grafik Nadi"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [
                        {
                            type: "line",
                            data: seriesNadi,
                            name: "Nadi",
                            color: "#fc0303",

                        }],
                    valueAxes: [{
                        title: { text: "N" },
                        min: 40,
                        max: 180,
                        majorUnit: 20
                    },
                    ],
                    categoryAxis: {
                        categories: ['P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M'],
                        axisCrossingValues: [0, 35]
                    }
                });

                $("#chartSuhu").kendoChart({
                    title: {
                        text: "Grafik Suhu"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: sesiesSuhu,
                        name: "Suhu",
                        color: "#0328fc",

                    }
                    ],
                    valueAxes: [
                        {
                            name: "S",
                            title: { text: "S" },
                            min: 32,
                            max: 42,

                        }
                    ],
                    categoryAxis: {
                        categories: ['P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M', 'P','Si','S','M'],
                        axisCrossingValues: [0, 35]
                    }
                });
            }
            $scope.listPerinatologi = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22038200, "nama": "h-1", "type": "datetime" },
                        { "id": 22038201, "nama": "h-2", "type": "datetime" },
                        { "id": 22038202, "nama": "h-3", "type": "datetime" },
                        { "id": 22038203, "nama": "h-4", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22038207, "nama": "h-1", "type": "textbox" },
                        { "id": 22038208, "nama": "h-2", "type": "textbox" },
                        { "id": 22038209, "nama": "h-3", "type": "textbox" },
                        { "id": 22038210, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22038214, "nama": "h-1", "type": "textbox" },
                        { "id": 22038215, "nama": "h-2", "type": "textbox" },
                        { "id": 22038216, "nama": "h-3", "type": "textbox" },
                        { "id": 22038217, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22038221, "nama": "h-1", "type": "textbox" },
                        { "id": 22038222, "nama": "h-2", "type": "textbox" },
                        { "id": 22038223, "nama": "h-3", "type": "textbox" },
                        { "id": 22038224, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22038228, "nama": "h-1", "type": "textbox" },
                        { "id": 22038229, "nama": "h-2", "type": "textbox" },
                        { "id": 22038230, "nama": "h-3", "type": "textbox" },
                        { "id": 22038231, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22038235, "nama": "h-1", "type": "textbox" },
                        { "id": 22038236, "nama": "h-2", "type": "textbox" },
                        { "id": 22038237, "nama": "h-3", "type": "textbox" },
                        { "id": 22038238, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22038242, "nama": "h-1", "type": "textbox" },
                        { "id": 22038243, "nama": "h-2", "type": "textbox" },
                        { "id": 22038244, "nama": "h-3", "type": "textbox" },
                        { "id": 22038245, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22038249, "nama": "h-1", "type": "textbox" },
                        { "id": 22038250, "nama": "h-2", "type": "textbox" },
                        { "id": 22038251, "nama": "h-3", "type": "textbox" },
                        { "id": 22038252, "nama": "h-4", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22038256, "nama": "p-1", "type": "textbox" },
                        { "id": 22038257, "nama": "si-1", "type": "textbox" },
                        { "id": 22038258, "nama": "s-1", "type": "textbox" },
                        { "id": 22038259, "nama": "m-1", "type": "textbox" },
                        { "id": 22038260, "nama": "p-2", "type": "textbox" },
                        { "id": 22038261, "nama": "si-2", "type": "textbox" },
                        { "id": 22038262, "nama": "s-2", "type": "textbox" },
                        { "id": 22038263, "nama": "m-2", "type": "textbox" },
                        { "id": 22038264, "nama": "p-3", "type": "textbox" },
                        { "id": 22038265, "nama": "si-3", "type": "textbox" },
                        { "id": 22038266, "nama": "s-3", "type": "textbox" },
                        { "id": 22038267, "nama": "m-3", "type": "textbox" },
                        { "id": 22038268, "nama": "p-4", "type": "textbox" },
                        { "id": 22038269, "nama": "si-4", "type": "textbox" },
                        { "id": 22038270, "nama": "s-4", "type": "textbox" },
                        { "id": 22038271, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 2, "nama": "",
                    "detail": [
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                    ]
                },
                {
                    "id": 3, "nama": "Suhu",
                    "detail": [
                        { "id": 22038284, "nama": "p-1", "type": "textbox" },
                        { "id": 22038285, "nama": "si-1", "type": "textbox" },
                        { "id": 22038286, "nama": "s-1", "type": "textbox" },
                        { "id": 22038287, "nama": "m-1", "type": "textbox" },
                        { "id": 22038288, "nama": "p-2", "type": "textbox" },
                        { "id": 22038289, "nama": "si-2", "type": "textbox" },
                        { "id": 22038290, "nama": "s-2", "type": "textbox" },
                        { "id": 22038291, "nama": "m-2", "type": "textbox" },
                        { "id": 22038292, "nama": "p-3", "type": "textbox" },
                        { "id": 22038293, "nama": "si-3", "type": "textbox" },
                        { "id": 22038294, "nama": "s-3", "type": "textbox" },
                        { "id": 22038295, "nama": "m-3", "type": "textbox" },
                        { "id": 22038296, "nama": "p-4", "type": "textbox" },
                        { "id": 22038297, "nama": "si-4", "type": "textbox" },
                        { "id": 22038298, "nama": "s-4", "type": "textbox" },
                        { "id": 22038299, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22038312, "nama": "p-1", "type": "textbox" },
                        { "id": 22038313, "nama": "si-1", "type": "textbox" },
                        { "id": 22038314, "nama": "s-1", "type": "textbox" },
                        { "id": 22038315, "nama": "m-1", "type": "textbox" },
                        { "id": 22038316, "nama": "p-2", "type": "textbox" },
                        { "id": 22038317, "nama": "si-2", "type": "textbox" },
                        { "id": 22038318, "nama": "s-2", "type": "textbox" },
                        { "id": 22038319, "nama": "m-2", "type": "textbox" },
                        { "id": 22038320, "nama": "p-3", "type": "textbox" },
                        { "id": 22038321, "nama": "si-3", "type": "textbox" },
                        { "id": 22038322, "nama": "s-3", "type": "textbox" },
                        { "id": 22038323, "nama": "m-3", "type": "textbox" },
                        { "id": 22038324, "nama": "p-4", "type": "textbox" },
                        { "id": 22038325, "nama": "si-4", "type": "textbox" },
                        { "id": 22038326, "nama": "s-4", "type": "textbox" },
                        { "id": 22038327, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22038340, "nama": "p-1", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038341, "nama": "p-2", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038342, "nama": "p-3", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038343, "nama": "p-4", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPerinatologi2 = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22038204, "nama": "h-5", "type": "datetime" },
                        { "id": 22038205, "nama": "h-6", "type": "datetime" },
                        { "id": 22038206, "nama": "h-7", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22038211, "nama": "h-5", "type": "textbox" },
                        { "id": 22038212, "nama": "h-6", "type": "textbox" },
                        { "id": 22038213, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22038218, "nama": "h-5", "type": "textbox" },
                        { "id": 22038219, "nama": "h-6", "type": "textbox" },
                        { "id": 22038220, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22038225, "nama": "h-5", "type": "textbox" },
                        { "id": 22038226, "nama": "h-6", "type": "textbox" },
                        { "id": 22038227, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22038232, "nama": "h-5", "type": "textbox" },
                        { "id": 22038233, "nama": "h-6", "type": "textbox" },
                        { "id": 22038234, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22038239, "nama": "h-5", "type": "textbox" },
                        { "id": 22038240, "nama": "h-6", "type": "textbox" },
                        { "id": 22038241, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22038246, "nama": "h-5", "type": "textbox" },
                        { "id": 22038247, "nama": "h-6", "type": "textbox" },
                        { "id": 22038248, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22038253, "nama": "h-5", "type": "textbox" },
                        { "id": 22038254, "nama": "h-6", "type": "textbox" },
                        { "id": 22038255, "nama": "h-7", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData2 = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22038272, "nama": "p-5", "type": "textbox" },
                        { "id": 22038273, "nama": "si-5", "type": "textbox" },
                        { "id": 22038274, "nama": "s-5", "type": "textbox" },
                        { "id": 22038275, "nama": "m-5", "type": "textbox" },
                        { "id": 22038276, "nama": "p-6", "type": "textbox" },
                        { "id": 22038277, "nama": "si-6", "type": "textbox" },
                        { "id": 22038278, "nama": "s-6", "type": "textbox" },
                        { "id": 22038279, "nama": "m-6", "type": "textbox" },
                        { "id": 22038280, "nama": "p-7", "type": "textbox" },
                        { "id": 22038281, "nama": "si-7", "type": "textbox" },
                        { "id": 22038282, "nama": "s-7", "type": "textbox" },
                        { "id": 22038283, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 2, "nama": "",
                    "detail": [
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                        { "nama": "P", "type": "label" },
                        { "nama": "Si", "type": "label" },
                        { "nama": "S", "type": "label" },
                        { "nama": "M", "type": "label" },
                    ]
                },
                {
                    "id": 3, "nama": "Suhu",
                    "detail": [
                        { "id": 22038300, "nama": "p-5", "type": "textbox" },
                        { "id": 22038301, "nama": "si-5", "type": "textbox" },
                        { "id": 22038302, "nama": "s-5", "type": "textbox" },
                        { "id": 22038303, "nama": "m-5", "type": "textbox" },
                        { "id": 22038304, "nama": "p-6", "type": "textbox" },
                        { "id": 22038305, "nama": "si-6", "type": "textbox" },
                        { "id": 22038306, "nama": "s-6", "type": "textbox" },
                        { "id": 22038307, "nama": "m-6", "type": "textbox" },
                        { "id": 22038308, "nama": "p-7", "type": "textbox" },
                        { "id": 22038309, "nama": "si-7", "type": "textbox" },
                        { "id": 22038310, "nama": "s-7", "type": "textbox" },
                        { "id": 22038311, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22038328, "nama": "p-5", "type": "textbox" },
                        { "id": 22038329, "nama": "si-5", "type": "textbox" },
                        { "id": 22038330, "nama": "s-5", "type": "textbox" },
                        { "id": 22038331, "nama": "m-5", "type": "textbox" },
                        { "id": 22038332, "nama": "p-6", "type": "textbox" },
                        { "id": 22038333, "nama": "si-6", "type": "textbox" },
                        { "id": 22038334, "nama": "s-6", "type": "textbox" },
                        { "id": 22038335, "nama": "m-6", "type": "textbox" },
                        { "id": 22038336, "nama": "p-7", "type": "textbox" },
                        { "id": 22038337, "nama": "si-7", "type": "textbox" },
                        { "id": 22038338, "nama": "s-7", "type": "textbox" },
                        { "id": 22038339, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22038344, "nama": "p-5", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038345, "nama": "p-6", "type": "textbox", "satuan": "Gram" },
                        { "id": 22038346, "nama": "p-7", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPengenal1 = [
                { "id": 22038347, "nama": "Tgl.Lahir", "type": "datetime", "satuan": "" },
                { "id": 22038348, "nama": "Jenis Kelamin", "type": "textbox", "satuan": "" },
                { "id": 22038349, "nama": "APGAR Score", "type": "textbox", "satuan": "" },
                { "id": 22038350, "nama": "BB Lahir", "type": "textbox", "satuan": "Gram" },
                { "id": 22038351, "nama": "Panjang", "type": "textbox", "satuan": "cm" },
                { "id": 22038352, "nama": "Lingkar Kepala", "type": "textbox", "satuan": "cm" },
                { "id": 22038353, "nama": "Suhu", "type": "textbox", "satuan": "C" },
            ]
            $scope.listPengenal2 = [
                { "id": 22038354, "nama": "Riwayat Persalinan : GPA", "type": "textbox", "satuan": "" },
                { "id": 22038355, "nama": "Kehamilan", "type": "textbox", "satuan": "" },
                { "id": 22038356, "nama": "Umur Ibu", "type": "textbox", "satuan": "" },
                { "id": 22038357, "nama": "HbsAg Ibu", "type": "textbox", "satuan": "" },
                { "id": 22038358, "nama": "Gol. Darah Ibu", "type": "textbox", "satuan": "" },
                { "id": 22038359, "nama": "Persalinan", "type": "textbox", "satuan": "" },
                { "id": 22038360, "nama": "Ketuban", "type": "textbox", "satuan": "" },
            ]
            $scope.listPengenal3 = [
                { "id": 22038361, "nama": "Resusitasi", "type": "textbox", "satuan": "" },
                { "id": 22038362, "nama": "Obat yang diberikan", "type": "textbox", "satuan": "" },
                { "id": 22038363, "nama": "Miksi", "type": "textbox", "satuan": "" },
                { "id": 22038364, "nama": "Meco", "type": "textbox", "satuan": "" },
                { "id": 22038365, "nama": "Anus", "type": "textbox", "satuan": "" },
                { "id": 22038366, "nama": "Mata", "type": "textbox", "satuan": "" },
                { "id": 22038367, "nama": "Hal-hal istimewa", "type": "textbox", "satuan": "" },
            ]
            $scope.listObat = [
                {
                    "id": 22038368, "nama": "Obat-1",
                    "detail": [
                        { "id": 22038369, "nama": "p-1", "type": "textbox" },
                        { "id": 22038370, "nama": "si-1", "type": "textbox" },
                        { "id": 22038371, "nama": "s-1", "type": "textbox" },
                        { "id": 22038372, "nama": "m-1", "type": "textbox" },
                        { "id": 22038373, "nama": "p-2", "type": "textbox" },
                        { "id": 22038374, "nama": "si-2", "type": "textbox" },
                        { "id": 22038375, "nama": "s-2", "type": "textbox" },
                        { "id": 22038376, "nama": "m-2", "type": "textbox" },
                        { "id": 22038377, "nama": "p-3", "type": "textbox" },
                        { "id": 22038378, "nama": "si-3", "type": "textbox" },
                        { "id": 22038379, "nama": "s-3", "type": "textbox" },
                        { "id": 22038380, "nama": "m-3", "type": "textbox" },
                        { "id": 22038381, "nama": "p-4", "type": "textbox" },
                        { "id": 22038382, "nama": "si-4", "type": "textbox" },
                        { "id": 22038383, "nama": "s-4", "type": "textbox" },
                        { "id": 22038384, "nama": "m-4", "type": "textbox" },
                        { "id": 22038385, "nama": "p-5", "type": "textbox" },
                        { "id": 22038386, "nama": "si-5", "type": "textbox" },
                        { "id": 22038387, "nama": "s-5", "type": "textbox" },
                        { "id": 22038388, "nama": "m-5", "type": "textbox" },
                        { "id": 22038389, "nama": "p-6", "type": "textbox" },
                        { "id": 22038390, "nama": "si-6", "type": "textbox" },
                        { "id": 22038391, "nama": "s-6", "type": "textbox" },
                        { "id": 22038392, "nama": "m-6", "type": "textbox" },
                        { "id": 22038393, "nama": "p-7", "type": "textbox" },
                        { "id": 22038394, "nama": "si-7", "type": "textbox" },
                        { "id": 22038395, "nama": "s-7", "type": "textbox" },
                        { "id": 22038396, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038397, "nama": "Obat-2",
                    "detail": [
                        { "id": 22038398, "nama": "p-1", "type": "textbox" },
                        { "id": 22038399, "nama": "si-1", "type": "textbox" },
                        { "id": 22038400, "nama": "s-1", "type": "textbox" },
                        { "id": 22038401, "nama": "m-1", "type": "textbox" },
                        { "id": 22038402, "nama": "p-2", "type": "textbox" },
                        { "id": 22038403, "nama": "si-2", "type": "textbox" },
                        { "id": 22038404, "nama": "s-2", "type": "textbox" },
                        { "id": 22038405, "nama": "m-2", "type": "textbox" },
                        { "id": 22038406, "nama": "p-3", "type": "textbox" },
                        { "id": 22038407, "nama": "si-3", "type": "textbox" },
                        { "id": 22038408, "nama": "s-3", "type": "textbox" },
                        { "id": 22038409, "nama": "m-3", "type": "textbox" },
                        { "id": 22038410, "nama": "p-4", "type": "textbox" },
                        { "id": 22038411, "nama": "si-4", "type": "textbox" },
                        { "id": 22038412, "nama": "s-4", "type": "textbox" },
                        { "id": 22038413, "nama": "m-4", "type": "textbox" },
                        { "id": 22038414, "nama": "p-5", "type": "textbox" },
                        { "id": 22038415, "nama": "si-5", "type": "textbox" },
                        { "id": 22038416, "nama": "s-5", "type": "textbox" },
                        { "id": 22038417, "nama": "m-5", "type": "textbox" },
                        { "id": 22038418, "nama": "p-6", "type": "textbox" },
                        { "id": 22038419, "nama": "si-6", "type": "textbox" },
                        { "id": 22038420, "nama": "s-6", "type": "textbox" },
                        { "id": 22038421, "nama": "m-6", "type": "textbox" },
                        { "id": 22038422, "nama": "p-7", "type": "textbox" },
                        { "id": 22038423, "nama": "si-7", "type": "textbox" },
                        { "id": 22038424, "nama": "s-7", "type": "textbox" },
                        { "id": 22038425, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038426, "nama": "Obat-3",
                    "detail": [
                        { "id": 22038427, "nama": "p-1", "type": "textbox" },
                        { "id": 22038428, "nama": "si-1", "type": "textbox" },
                        { "id": 22038429, "nama": "s-1", "type": "textbox" },
                        { "id": 22038430, "nama": "m-1", "type": "textbox" },
                        { "id": 22038431, "nama": "p-2", "type": "textbox" },
                        { "id": 22038432, "nama": "si-2", "type": "textbox" },
                        { "id": 22038433, "nama": "s-2", "type": "textbox" },
                        { "id": 22038434, "nama": "m-2", "type": "textbox" },
                        { "id": 22038435, "nama": "p-3", "type": "textbox" },
                        { "id": 22038436, "nama": "si-3", "type": "textbox" },
                        { "id": 22038437, "nama": "s-3", "type": "textbox" },
                        { "id": 22038438, "nama": "m-3", "type": "textbox" },
                        { "id": 22038439, "nama": "p-4", "type": "textbox" },
                        { "id": 22038440, "nama": "si-4", "type": "textbox" },
                        { "id": 22038441, "nama": "s-4", "type": "textbox" },
                        { "id": 22038442, "nama": "m-4", "type": "textbox" },
                        { "id": 22038443, "nama": "p-5", "type": "textbox" },
                        { "id": 22038444, "nama": "si-5", "type": "textbox" },
                        { "id": 22038445, "nama": "s-5", "type": "textbox" },
                        { "id": 22038446, "nama": "m-5", "type": "textbox" },
                        { "id": 22038447, "nama": "p-6", "type": "textbox" },
                        { "id": 22038448, "nama": "si-6", "type": "textbox" },
                        { "id": 22038449, "nama": "s-6", "type": "textbox" },
                        { "id": 22038450, "nama": "m-6", "type": "textbox" },
                        { "id": 22038451, "nama": "p-7", "type": "textbox" },
                        { "id": 22038452, "nama": "si-7", "type": "textbox" },
                        { "id": 22038453, "nama": "s-7", "type": "textbox" },
                        { "id": 22038454, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038455, "nama": "Obat-4",
                    "detail": [
                        { "id": 22038456, "nama": "p-1", "type": "textbox" },
                        { "id": 22038457, "nama": "si-1", "type": "textbox" },
                        { "id": 22038458, "nama": "s-1", "type": "textbox" },
                        { "id": 22038459, "nama": "m-1", "type": "textbox" },
                        { "id": 22038460, "nama": "p-2", "type": "textbox" },
                        { "id": 22038461, "nama": "si-2", "type": "textbox" },
                        { "id": 22038462, "nama": "s-2", "type": "textbox" },
                        { "id": 22038463, "nama": "m-2", "type": "textbox" },
                        { "id": 22038464, "nama": "p-3", "type": "textbox" },
                        { "id": 22038465, "nama": "si-3", "type": "textbox" },
                        { "id": 22038466, "nama": "s-3", "type": "textbox" },
                        { "id": 22038467, "nama": "m-3", "type": "textbox" },
                        { "id": 22038468, "nama": "p-4", "type": "textbox" },
                        { "id": 22038469, "nama": "si-4", "type": "textbox" },
                        { "id": 22038470, "nama": "s-4", "type": "textbox" },
                        { "id": 22038471, "nama": "m-4", "type": "textbox" },
                        { "id": 22038472, "nama": "p-5", "type": "textbox" },
                        { "id": 22038473, "nama": "si-5", "type": "textbox" },
                        { "id": 22038474, "nama": "s-5", "type": "textbox" },
                        { "id": 22038475, "nama": "m-5", "type": "textbox" },
                        { "id": 22038476, "nama": "p-6", "type": "textbox" },
                        { "id": 22038477, "nama": "si-6", "type": "textbox" },
                        { "id": 22038478, "nama": "s-6", "type": "textbox" },
                        { "id": 22038479, "nama": "m-6", "type": "textbox" },
                        { "id": 22038480, "nama": "p-7", "type": "textbox" },
                        { "id": 22038481, "nama": "si-7", "type": "textbox" },
                        { "id": 22038482, "nama": "s-7", "type": "textbox" },
                        { "id": 22038483, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038484, "nama": "Obat-5",
                    "detail": [
                        { "id": 22038485, "nama": "p-1", "type": "textbox" },
                        { "id": 22038486, "nama": "si-1", "type": "textbox" },
                        { "id": 22038487, "nama": "s-1", "type": "textbox" },
                        { "id": 22038488, "nama": "m-1", "type": "textbox" },
                        { "id": 22038489, "nama": "p-2", "type": "textbox" },
                        { "id": 22038490, "nama": "si-2", "type": "textbox" },
                        { "id": 22038491, "nama": "s-2", "type": "textbox" },
                        { "id": 22038492, "nama": "m-2", "type": "textbox" },
                        { "id": 22038493, "nama": "p-3", "type": "textbox" },
                        { "id": 22038494, "nama": "si-3", "type": "textbox" },
                        { "id": 22038495, "nama": "s-3", "type": "textbox" },
                        { "id": 22038496, "nama": "m-3", "type": "textbox" },
                        { "id": 22038497, "nama": "p-4", "type": "textbox" },
                        { "id": 22038498, "nama": "si-4", "type": "textbox" },
                        { "id": 22038499, "nama": "s-4", "type": "textbox" },
                        { "id": 22038500, "nama": "m-4", "type": "textbox" },
                        { "id": 22038501, "nama": "p-5", "type": "textbox" },
                        { "id": 22038502, "nama": "si-5", "type": "textbox" },
                        { "id": 22038503, "nama": "s-5", "type": "textbox" },
                        { "id": 22038504, "nama": "m-5", "type": "textbox" },
                        { "id": 22038505, "nama": "p-6", "type": "textbox" },
                        { "id": 22038506, "nama": "si-6", "type": "textbox" },
                        { "id": 22038507, "nama": "s-6", "type": "textbox" },
                        { "id": 22038508, "nama": "m-6", "type": "textbox" },
                        { "id": 22038509, "nama": "p-7", "type": "textbox" },
                        { "id": 22038510, "nama": "si-7", "type": "textbox" },
                        { "id": 22038511, "nama": "s-7", "type": "textbox" },
                        { "id": 22038512, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038513, "nama": "Obat-6",
                    "detail": [
                        { "id": 22038514, "nama": "p-1", "type": "textbox" },
                        { "id": 22038515, "nama": "si-1", "type": "textbox" },
                        { "id": 22038516, "nama": "s-1", "type": "textbox" },
                        { "id": 22038517, "nama": "m-1", "type": "textbox" },
                        { "id": 22038518, "nama": "p-2", "type": "textbox" },
                        { "id": 22038519, "nama": "si-2", "type": "textbox" },
                        { "id": 22038520, "nama": "s-2", "type": "textbox" },
                        { "id": 22038521, "nama": "m-2", "type": "textbox" },
                        { "id": 22038522, "nama": "p-3", "type": "textbox" },
                        { "id": 22038523, "nama": "si-3", "type": "textbox" },
                        { "id": 22038524, "nama": "s-3", "type": "textbox" },
                        { "id": 22038525, "nama": "m-3", "type": "textbox" },
                        { "id": 22038526, "nama": "p-4", "type": "textbox" },
                        { "id": 22038527, "nama": "si-4", "type": "textbox" },
                        { "id": 22038528, "nama": "s-4", "type": "textbox" },
                        { "id": 22038529, "nama": "m-4", "type": "textbox" },
                        { "id": 22038530, "nama": "p-5", "type": "textbox" },
                        { "id": 22038531, "nama": "si-5", "type": "textbox" },
                        { "id": 22038532, "nama": "s-5", "type": "textbox" },
                        { "id": 22038533, "nama": "m-5", "type": "textbox" },
                        { "id": 22038534, "nama": "p-6", "type": "textbox" },
                        { "id": 22038535, "nama": "si-6", "type": "textbox" },
                        { "id": 22038536, "nama": "s-6", "type": "textbox" },
                        { "id": 22038537, "nama": "m-6", "type": "textbox" },
                        { "id": 22038538, "nama": "p-7", "type": "textbox" },
                        { "id": 22038539, "nama": "si-7", "type": "textbox" },
                        { "id": 22038540, "nama": "s-7", "type": "textbox" },
                        { "id": 22038541, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038542, "nama": "Obat-7",
                    "detail": [
                        { "id": 22038543, "nama": "p-1", "type": "textbox" },
                        { "id": 22038544, "nama": "si-1", "type": "textbox" },
                        { "id": 22038545, "nama": "s-1", "type": "textbox" },
                        { "id": 22038546, "nama": "m-1", "type": "textbox" },
                        { "id": 22038547, "nama": "p-2", "type": "textbox" },
                        { "id": 22038548, "nama": "si-2", "type": "textbox" },
                        { "id": 22038549, "nama": "s-2", "type": "textbox" },
                        { "id": 22038550, "nama": "m-2", "type": "textbox" },
                        { "id": 22038551, "nama": "p-3", "type": "textbox" },
                        { "id": 22038552, "nama": "si-3", "type": "textbox" },
                        { "id": 22038553, "nama": "s-3", "type": "textbox" },
                        { "id": 22038554, "nama": "m-3", "type": "textbox" },
                        { "id": 22038555, "nama": "p-4", "type": "textbox" },
                        { "id": 22038556, "nama": "si-4", "type": "textbox" },
                        { "id": 22038557, "nama": "s-4", "type": "textbox" },
                        { "id": 22038558, "nama": "m-4", "type": "textbox" },
                        { "id": 22038559, "nama": "p-5", "type": "textbox" },
                        { "id": 22038560, "nama": "si-5", "type": "textbox" },
                        { "id": 22038561, "nama": "s-5", "type": "textbox" },
                        { "id": 22038562, "nama": "m-5", "type": "textbox" },
                        { "id": 22038563, "nama": "p-6", "type": "textbox" },
                        { "id": 22038564, "nama": "si-6", "type": "textbox" },
                        { "id": 22038565, "nama": "s-6", "type": "textbox" },
                        { "id": 22038566, "nama": "m-6", "type": "textbox" },
                        { "id": 22038567, "nama": "p-7", "type": "textbox" },
                        { "id": 22038568, "nama": "si-7", "type": "textbox" },
                        { "id": 22038569, "nama": "s-7", "type": "textbox" },
                        { "id": 22038570, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038571, "nama": "Obat-8",
                    "detail": [
                        { "id": 22038572, "nama": "p-1", "type": "textbox" },
                        { "id": 22038573, "nama": "si-1", "type": "textbox" },
                        { "id": 22038574, "nama": "s-1", "type": "textbox" },
                        { "id": 22038575, "nama": "m-1", "type": "textbox" },
                        { "id": 22038576, "nama": "p-2", "type": "textbox" },
                        { "id": 22038577, "nama": "si-2", "type": "textbox" },
                        { "id": 22038578, "nama": "s-2", "type": "textbox" },
                        { "id": 22038579, "nama": "m-2", "type": "textbox" },
                        { "id": 22038580, "nama": "p-3", "type": "textbox" },
                        { "id": 22038581, "nama": "si-3", "type": "textbox" },
                        { "id": 22038582, "nama": "s-3", "type": "textbox" },
                        { "id": 22038583, "nama": "m-3", "type": "textbox" },
                        { "id": 22038584, "nama": "p-4", "type": "textbox" },
                        { "id": 22038585, "nama": "si-4", "type": "textbox" },
                        { "id": 22038586, "nama": "s-4", "type": "textbox" },
                        { "id": 22038587, "nama": "m-4", "type": "textbox" },
                        { "id": 22038588, "nama": "p-5", "type": "textbox" },
                        { "id": 22038589, "nama": "si-5", "type": "textbox" },
                        { "id": 22038590, "nama": "s-5", "type": "textbox" },
                        { "id": 22038591, "nama": "m-5", "type": "textbox" },
                        { "id": 22038592, "nama": "p-6", "type": "textbox" },
                        { "id": 22038593, "nama": "si-6", "type": "textbox" },
                        { "id": 22038594, "nama": "s-6", "type": "textbox" },
                        { "id": 22038595, "nama": "m-6", "type": "textbox" },
                        { "id": 22038596, "nama": "p-7", "type": "textbox" },
                        { "id": 22038597, "nama": "si-7", "type": "textbox" },
                        { "id": 22038598, "nama": "s-7", "type": "textbox" },
                        { "id": 22038599, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038600, "nama": "Obat-9",
                    "detail": [
                        { "id": 22038601, "nama": "p-1", "type": "textbox" },
                        { "id": 22038602, "nama": "si-1", "type": "textbox" },
                        { "id": 22038603, "nama": "s-1", "type": "textbox" },
                        { "id": 22038604, "nama": "m-1", "type": "textbox" },
                        { "id": 22038605, "nama": "p-2", "type": "textbox" },
                        { "id": 22038606, "nama": "si-2", "type": "textbox" },
                        { "id": 22038607, "nama": "s-2", "type": "textbox" },
                        { "id": 22038608, "nama": "m-2", "type": "textbox" },
                        { "id": 22038609, "nama": "p-3", "type": "textbox" },
                        { "id": 22038610, "nama": "si-3", "type": "textbox" },
                        { "id": 22038611, "nama": "s-3", "type": "textbox" },
                        { "id": 22038612, "nama": "m-3", "type": "textbox" },
                        { "id": 22038613, "nama": "p-4", "type": "textbox" },
                        { "id": 22038614, "nama": "si-4", "type": "textbox" },
                        { "id": 22038615, "nama": "s-4", "type": "textbox" },
                        { "id": 22038616, "nama": "m-4", "type": "textbox" },
                        { "id": 22038617, "nama": "p-5", "type": "textbox" },
                        { "id": 22038618, "nama": "si-5", "type": "textbox" },
                        { "id": 22038619, "nama": "s-5", "type": "textbox" },
                        { "id": 22038620, "nama": "m-5", "type": "textbox" },
                        { "id": 22038621, "nama": "p-6", "type": "textbox" },
                        { "id": 22038622, "nama": "si-6", "type": "textbox" },
                        { "id": 22038623, "nama": "s-6", "type": "textbox" },
                        { "id": 22038624, "nama": "m-6", "type": "textbox" },
                        { "id": 22038625, "nama": "p-7", "type": "textbox" },
                        { "id": 22038626, "nama": "si-7", "type": "textbox" },
                        { "id": 22038627, "nama": "s-7", "type": "textbox" },
                        { "id": 22038628, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038629, "nama": "Obat-10",
                    "detail": [
                        { "id": 22038630, "nama": "p-1", "type": "textbox" },
                        { "id": 22038631, "nama": "si-1", "type": "textbox" },
                        { "id": 22038632, "nama": "s-1", "type": "textbox" },
                        { "id": 22038633, "nama": "m-1", "type": "textbox" },
                        { "id": 22038634, "nama": "p-2", "type": "textbox" },
                        { "id": 22038635, "nama": "si-2", "type": "textbox" },
                        { "id": 22038636, "nama": "s-2", "type": "textbox" },
                        { "id": 22038637, "nama": "m-2", "type": "textbox" },
                        { "id": 22038638, "nama": "p-3", "type": "textbox" },
                        { "id": 22038639, "nama": "si-3", "type": "textbox" },
                        { "id": 22038640, "nama": "s-3", "type": "textbox" },
                        { "id": 22038641, "nama": "m-3", "type": "textbox" },
                        { "id": 22038642, "nama": "p-4", "type": "textbox" },
                        { "id": 22038643, "nama": "si-4", "type": "textbox" },
                        { "id": 22038644, "nama": "s-4", "type": "textbox" },
                        { "id": 22038645, "nama": "m-4", "type": "textbox" },
                        { "id": 22038646, "nama": "p-5", "type": "textbox" },
                        { "id": 22038647, "nama": "si-5", "type": "textbox" },
                        { "id": 22038648, "nama": "s-5", "type": "textbox" },
                        { "id": 22038649, "nama": "m-5", "type": "textbox" },
                        { "id": 22038650, "nama": "p-6", "type": "textbox" },
                        { "id": 22038651, "nama": "si-6", "type": "textbox" },
                        { "id": 22038652, "nama": "s-6", "type": "textbox" },
                        { "id": 22038653, "nama": "m-6", "type": "textbox" },
                        { "id": 22038654, "nama": "p-7", "type": "textbox" },
                        { "id": 22038655, "nama": "si-7", "type": "textbox" },
                        { "id": 22038656, "nama": "s-7", "type": "textbox" },
                        { "id": 22038657, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038658, "nama": "Obat-11",
                    "detail": [
                        { "id": 22038659, "nama": "p-1", "type": "textbox" },
                        { "id": 22038660, "nama": "si-1", "type": "textbox" },
                        { "id": 22038661, "nama": "s-1", "type": "textbox" },
                        { "id": 22038662, "nama": "m-1", "type": "textbox" },
                        { "id": 22038663, "nama": "p-2", "type": "textbox" },
                        { "id": 22038664, "nama": "si-2", "type": "textbox" },
                        { "id": 22038665, "nama": "s-2", "type": "textbox" },
                        { "id": 22038666, "nama": "m-2", "type": "textbox" },
                        { "id": 22038667, "nama": "p-3", "type": "textbox" },
                        { "id": 22038668, "nama": "si-3", "type": "textbox" },
                        { "id": 22038669, "nama": "s-3", "type": "textbox" },
                        { "id": 22038670, "nama": "m-3", "type": "textbox" },
                        { "id": 22038671, "nama": "p-4", "type": "textbox" },
                        { "id": 22038672, "nama": "si-4", "type": "textbox" },
                        { "id": 22038673, "nama": "s-4", "type": "textbox" },
                        { "id": 22038674, "nama": "m-4", "type": "textbox" },
                        { "id": 22038675, "nama": "p-5", "type": "textbox" },
                        { "id": 22038676, "nama": "si-5", "type": "textbox" },
                        { "id": 22038677, "nama": "s-5", "type": "textbox" },
                        { "id": 22038678, "nama": "m-5", "type": "textbox" },
                        { "id": 22038679, "nama": "p-6", "type": "textbox" },
                        { "id": 22038680, "nama": "si-6", "type": "textbox" },
                        { "id": 22038681, "nama": "s-6", "type": "textbox" },
                        { "id": 22038682, "nama": "m-6", "type": "textbox" },
                        { "id": 22038683, "nama": "p-7", "type": "textbox" },
                        { "id": 22038684, "nama": "si-7", "type": "textbox" },
                        { "id": 22038685, "nama": "s-7", "type": "textbox" },
                        { "id": 22038686, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22038687, "nama": "Obat-12",
                    "detail": [
                        { "id": 22038688, "nama": "p-1", "type": "textbox" },
                        { "id": 22038689, "nama": "si-1", "type": "textbox" },
                        { "id": 22038690, "nama": "s-1", "type": "textbox" },
                        { "id": 22038691, "nama": "m-1", "type": "textbox" },
                        { "id": 22038692, "nama": "p-2", "type": "textbox" },
                        { "id": 22038693, "nama": "si-2", "type": "textbox" },
                        { "id": 22038694, "nama": "s-2", "type": "textbox" },
                        { "id": 22038695, "nama": "m-2", "type": "textbox" },
                        { "id": 22038696, "nama": "p-3", "type": "textbox" },
                        { "id": 22038697, "nama": "si-3", "type": "textbox" },
                        { "id": 22038698, "nama": "s-3", "type": "textbox" },
                        { "id": 22038699, "nama": "m-3", "type": "textbox" },
                        { "id": 22038700, "nama": "p-4", "type": "textbox" },
                        { "id": 22038701, "nama": "si-4", "type": "textbox" },
                        { "id": 22038702, "nama": "s-4", "type": "textbox" },
                        { "id": 22038703, "nama": "m-4", "type": "textbox" },
                        { "id": 22038704, "nama": "p-5", "type": "textbox" },
                        { "id": 22038705, "nama": "si-5", "type": "textbox" },
                        { "id": 22038706, "nama": "s-5", "type": "textbox" },
                        { "id": 22038707, "nama": "m-5", "type": "textbox" },
                        { "id": 22038708, "nama": "p-6", "type": "textbox" },
                        { "id": 22038709, "nama": "si-6", "type": "textbox" },
                        { "id": 22038710, "nama": "s-6", "type": "textbox" },
                        { "id": 22038711, "nama": "m-6", "type": "textbox" },
                        { "id": 22038712, "nama": "p-7", "type": "textbox" },
                        { "id": 22038713, "nama": "si-7", "type": "textbox" },
                        { "id": 22038714, "nama": "s-7", "type": "textbox" },
                        { "id": 22038715, "nama": "m-7", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSuhu = [
                { "id": 22038284, "nama": "p-1", "type": "textbox" },
                { "id": 22038285, "nama": "si-1", "type": "textbox" },
                { "id": 22038286, "nama": "s-1", "type": "textbox" },
                { "id": 22038287, "nama": "m-1", "type": "textbox" },
                { "id": 22038288, "nama": "p-2", "type": "textbox" },
                { "id": 22038289, "nama": "si-2", "type": "textbox" },
                { "id": 22038290, "nama": "s-2", "type": "textbox" },
                { "id": 22038291, "nama": "m-2", "type": "textbox" },
                { "id": 22038292, "nama": "p-3", "type": "textbox" },
                { "id": 22038293, "nama": "si-3", "type": "textbox" },
                { "id": 22038294, "nama": "s-3", "type": "textbox" },
                { "id": 22038295, "nama": "m-3", "type": "textbox" },
                { "id": 22038296, "nama": "p-4", "type": "textbox" },
                { "id": 22038297, "nama": "si-4", "type": "textbox" },
                { "id": 22038298, "nama": "s-4", "type": "textbox" },
                { "id": 22038299, "nama": "m-4", "type": "textbox" },
                { "id": 22038300, "nama": "p-5", "type": "textbox" },
                { "id": 22038301, "nama": "si-5", "type": "textbox" },
                { "id": 22038302, "nama": "s-5", "type": "textbox" },
                { "id": 22038303, "nama": "m-5", "type": "textbox" },
                { "id": 22038304, "nama": "p-6", "type": "textbox" },
                { "id": 22038305, "nama": "si-6", "type": "textbox" },
                { "id": 22038306, "nama": "s-6", "type": "textbox" },
                { "id": 22038307, "nama": "m-6", "type": "textbox" },
                { "id": 22038308, "nama": "p-7", "type": "textbox" },
                { "id": 22038309, "nama": "si-7", "type": "textbox" },
                { "id": 22038310, "nama": "s-7", "type": "textbox" },
                { "id": 22038311, "nama": "m-7", "type": "textbox" },
            ]
            $scope.listNadi = [
                { "id": 22038312, "nama": "p-1", "type": "textbox" },
                { "id": 22038313, "nama": "si-1", "type": "textbox" },
                { "id": 22038314, "nama": "s-1", "type": "textbox" },
                { "id": 22038315, "nama": "m-1", "type": "textbox" },
                { "id": 22038316, "nama": "p-2", "type": "textbox" },
                { "id": 22038317, "nama": "si-2", "type": "textbox" },
                { "id": 22038318, "nama": "s-2", "type": "textbox" },
                { "id": 22038319, "nama": "m-2", "type": "textbox" },
                { "id": 22038320, "nama": "p-3", "type": "textbox" },
                { "id": 22038321, "nama": "si-3", "type": "textbox" },
                { "id": 22038322, "nama": "s-3", "type": "textbox" },
                { "id": 22038323, "nama": "m-3", "type": "textbox" },
                { "id": 22038324, "nama": "p-4", "type": "textbox" },
                { "id": 22038325, "nama": "si-4", "type": "textbox" },
                { "id": 22038326, "nama": "s-4", "type": "textbox" },
                { "id": 22038327, "nama": "m-4", "type": "textbox" },
                { "id": 22038328, "nama": "p-5", "type": "textbox" },
                { "id": 22038329, "nama": "si-5", "type": "textbox" },
                { "id": 22038330, "nama": "s-5", "type": "textbox" },
                { "id": 22038331, "nama": "m-5", "type": "textbox" },
                { "id": 22038332, "nama": "p-6", "type": "textbox" },
                { "id": 22038333, "nama": "si-6", "type": "textbox" },
                { "id": 22038334, "nama": "s-6", "type": "textbox" },
                { "id": 22038335, "nama": "m-6", "type": "textbox" },
                { "id": 22038336, "nama": "p-7", "type": "textbox" },
                { "id": 22038337, "nama": "si-7", "type": "textbox" },
                { "id": 22038338, "nama": "s-7", "type": "textbox" },
                { "id": 22038339, "nama": "m-7", "type": "textbox" },
            ]
            // onloadchart()

            var chacePeriode = cacheHelper.get('cacheRekamMedis');
            if (chacePeriode != undefined) {
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2]
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[12]
                if (nomorEMR == '-') {
                    $scope.cc.norec_emr = '-'
                } else {
                    $scope.cc.norec_emr = nomorEMR
                }
            }
            var chekedd = false

            medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
                $scope.item.obj = []
                $scope.item.obj2 = []
                dataLoad = dat.data.data
                for (var i = 0; i <= dataLoad.length - 1; i++) {
                    if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {

                        if (dataLoad[i].type == "textbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "checkbox") {
                            chekedd = false
                            if (dataLoad[i].value == '1') {
                                chekedd = true
                            }
                            $scope.item.obj[dataLoad[i].emrdfk] = chekedd
                        }

                        if (dataLoad[i].type == "datetime") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "time") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }
                        if (dataLoad[i].type == "date") {
                            $scope.item.obj[dataLoad[i].emrdfk] = new Date(dataLoad[i].value)
                        }

                        if (dataLoad[i].type == "checkboxtextbox") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            var res = str.split("~");
                            // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }


                    }

                }
                onloadchart()
            })
            function onloadchart(){
                // var arrobj = Object.keys($scope.item.obj)

                // for (var i = arrobj.length - 1; i >= 0; i--) {
                    for (let z = 0; z < 28; z++) {
                        // if (arrobj[i] == 25000 + z)
                        //     sesiesSuhu[z] = $scope.item.obj[parseFloat(arrobj[i])]
                        var item = $scope.listSuhu[z]['id'];
                        sesiesSuhu[z] = $scope.item.obj[parseFloat(item)]
                    }

                // }
                // for (var i = arrobj.length - 1; i >= 0; i--) {
                    for (let y = 0; y < 28; y++) {
                        // if (arrobj[i] == 25028 + y)
                        //     seriesNadi[y] = $scope.item.obj[parseFloat(arrobj[i])]
                        var item = $scope.listNadi[y]['id'];
                        seriesNadi[y] = $scope.item.obj[parseFloat(item)]
                    }

                // }

                for (let x = 0; x < sesiesSuhu.length; x++) {

                    if (!isNaN(parseFloat(sesiesSuhu[x])))
                        sesiesSuhu[x] = parseFloat(sesiesSuhu[x])
                    else
                        sesiesSuhu[x] = null
                }
                for (let x = 0; x < seriesNadi.length; x++) {
                    if (!isNaN(parseInt(seriesNadi[x])))
                        seriesNadi[x] = parseInt(seriesNadi[x])
                    else
                        seriesNadi[x] = null
                }
                loadChart()
                console.log(seriesNadi)
                console.log(sesiesSuhu)
            }

            $scope.Batal = function () {
                $scope.item.obj = []
            }
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                    'Catatan Perinatologi 6' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                    var arrobj = Object.keys($scope.item.obj)

                    // for (var i = arrobj.length - 1; i >= 0; i--) {
                        for (let z = 0; z < 28; z++) {
                            // if (arrobj[i] == 25000 + z)
                            //     sesiesSuhu[z] = $scope.item.obj[parseFloat(arrobj[i])]
                            var item = $scope.listSuhu[z]['id'];
                            sesiesSuhu[z] = $scope.item.obj[parseFloat(item)]
                        }
                        for (let z = 0; z < 28; z++) {
                            // if (arrobj[i] == 25028 + z)
                            //     seriesNadi[z] = $scope.item.obj[parseFloat(arrobj[i])]
                            var item = $scope.listNadi[z]['id'];
                            seriesNadi[z] = $scope.item.obj[parseFloat(item)]
                        }
                    // }
                    for (let x = 0; x < sesiesSuhu.length; x++) {
                        if (!isNaN(parseFloat(sesiesSuhu[x])))
                            sesiesSuhu[x] = parseFloat(sesiesSuhu[x])
                        else
                            sesiesSuhu[x] = null
                    }
                    for (let x = 0; x < seriesNadi.length; x++) {
                        if (!isNaN(parseInt(seriesNadi[x])))
                            seriesNadi[x] = parseInt(seriesNadi[x])
                        else    
                            seriesNadi[x] = null
                    }
                    loadChart()
                    $rootScope.loadRiwayat()
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
            }

        }
    ]);
});