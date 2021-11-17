define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPerinatologi8Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210231
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
                        { "id": 22039232, "nama": "h-1", "type": "datetime" },
                        { "id": 22039233, "nama": "h-2", "type": "datetime" },
                        { "id": 22039234, "nama": "h-3", "type": "datetime" },
                        { "id": 22039235, "nama": "h-4", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22039239, "nama": "h-1", "type": "textbox" },
                        { "id": 22039240, "nama": "h-2", "type": "textbox" },
                        { "id": 22039241, "nama": "h-3", "type": "textbox" },
                        { "id": 22039242, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22039246, "nama": "h-1", "type": "textbox" },
                        { "id": 22039247, "nama": "h-2", "type": "textbox" },
                        { "id": 22039248, "nama": "h-3", "type": "textbox" },
                        { "id": 22039249, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22039253, "nama": "h-1", "type": "textbox" },
                        { "id": 22039254, "nama": "h-2", "type": "textbox" },
                        { "id": 22039255, "nama": "h-3", "type": "textbox" },
                        { "id": 22039256, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22039260, "nama": "h-1", "type": "textbox" },
                        { "id": 22039261, "nama": "h-2", "type": "textbox" },
                        { "id": 22039262, "nama": "h-3", "type": "textbox" },
                        { "id": 22039263, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22039267, "nama": "h-1", "type": "textbox" },
                        { "id": 22039268, "nama": "h-2", "type": "textbox" },
                        { "id": 22039269, "nama": "h-3", "type": "textbox" },
                        { "id": 22039270, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22039274, "nama": "h-1", "type": "textbox" },
                        { "id": 22039275, "nama": "h-2", "type": "textbox" },
                        { "id": 22039276, "nama": "h-3", "type": "textbox" },
                        { "id": 22039277, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22039281, "nama": "h-1", "type": "textbox" },
                        { "id": 22039282, "nama": "h-2", "type": "textbox" },
                        { "id": 22039283, "nama": "h-3", "type": "textbox" },
                        { "id": 22039284, "nama": "h-4", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22039288, "nama": "p-1", "type": "textbox" },
                        { "id": 22039289, "nama": "si-1", "type": "textbox" },
                        { "id": 22039290, "nama": "s-1", "type": "textbox" },
                        { "id": 22039291, "nama": "m-1", "type": "textbox" },
                        { "id": 22039292, "nama": "p-2", "type": "textbox" },
                        { "id": 22039293, "nama": "si-2", "type": "textbox" },
                        { "id": 22039294, "nama": "s-2", "type": "textbox" },
                        { "id": 22039295, "nama": "m-2", "type": "textbox" },
                        { "id": 22039296, "nama": "p-3", "type": "textbox" },
                        { "id": 22039297, "nama": "si-3", "type": "textbox" },
                        { "id": 22039298, "nama": "s-3", "type": "textbox" },
                        { "id": 22039299, "nama": "m-3", "type": "textbox" },
                        { "id": 22039300, "nama": "p-4", "type": "textbox" },
                        { "id": 22039301, "nama": "si-4", "type": "textbox" },
                        { "id": 22039302, "nama": "s-4", "type": "textbox" },
                        { "id": 22039303, "nama": "m-4", "type": "textbox" },
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
                        { "id": 22039316, "nama": "p-1", "type": "textbox" },
                        { "id": 22039317, "nama": "si-1", "type": "textbox" },
                        { "id": 22039318, "nama": "s-1", "type": "textbox" },
                        { "id": 22039319, "nama": "m-1", "type": "textbox" },
                        { "id": 22039320, "nama": "p-2", "type": "textbox" },
                        { "id": 22039321, "nama": "si-2", "type": "textbox" },
                        { "id": 22039322, "nama": "s-2", "type": "textbox" },
                        { "id": 22039323, "nama": "m-2", "type": "textbox" },
                        { "id": 22039324, "nama": "p-3", "type": "textbox" },
                        { "id": 22039325, "nama": "si-3", "type": "textbox" },
                        { "id": 22039326, "nama": "s-3", "type": "textbox" },
                        { "id": 22039327, "nama": "m-3", "type": "textbox" },
                        { "id": 22039328, "nama": "p-4", "type": "textbox" },
                        { "id": 22039329, "nama": "si-4", "type": "textbox" },
                        { "id": 22039330, "nama": "s-4", "type": "textbox" },
                        { "id": 22039331, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22039344, "nama": "p-1", "type": "textbox" },
                        { "id": 22039345, "nama": "si-1", "type": "textbox" },
                        { "id": 22039346, "nama": "s-1", "type": "textbox" },
                        { "id": 22039347, "nama": "m-1", "type": "textbox" },
                        { "id": 22039348, "nama": "p-2", "type": "textbox" },
                        { "id": 22039349, "nama": "si-2", "type": "textbox" },
                        { "id": 22039350, "nama": "s-2", "type": "textbox" },
                        { "id": 22039351, "nama": "m-2", "type": "textbox" },
                        { "id": 22039352, "nama": "p-3", "type": "textbox" },
                        { "id": 22039353, "nama": "si-3", "type": "textbox" },
                        { "id": 22039354, "nama": "s-3", "type": "textbox" },
                        { "id": 22039355, "nama": "m-3", "type": "textbox" },
                        { "id": 22039356, "nama": "p-4", "type": "textbox" },
                        { "id": 22039357, "nama": "si-4", "type": "textbox" },
                        { "id": 22039358, "nama": "s-4", "type": "textbox" },
                        { "id": 22039359, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22039372, "nama": "p-1", "type": "textbox", "satuan": "Gram" },
                        { "id": 22039373, "nama": "p-2", "type": "textbox", "satuan": "Gram" },
                        { "id": 22039374, "nama": "p-3", "type": "textbox", "satuan": "Gram" },
                        { "id": 22039375, "nama": "p-4", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPerinatologi2 = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22039236, "nama": "h-5", "type": "datetime" },
                        { "id": 22039237, "nama": "h-6", "type": "datetime" },
                        { "id": 22039238, "nama": "h-7", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22039243, "nama": "h-5", "type": "textbox" },
                        { "id": 22039244, "nama": "h-6", "type": "textbox" },
                        { "id": 22039245, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22039250, "nama": "h-5", "type": "textbox" },
                        { "id": 22039251, "nama": "h-6", "type": "textbox" },
                        { "id": 22039252, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22039257, "nama": "h-5", "type": "textbox" },
                        { "id": 22039258, "nama": "h-6", "type": "textbox" },
                        { "id": 22039259, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22039264, "nama": "h-5", "type": "textbox" },
                        { "id": 22039265, "nama": "h-6", "type": "textbox" },
                        { "id": 22039266, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22039271, "nama": "h-5", "type": "textbox" },
                        { "id": 22039272, "nama": "h-6", "type": "textbox" },
                        { "id": 22039273, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22039278, "nama": "h-5", "type": "textbox" },
                        { "id": 22039279, "nama": "h-6", "type": "textbox" },
                        { "id": 22039280, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22039285, "nama": "h-5", "type": "textbox" },
                        { "id": 22039286, "nama": "h-6", "type": "textbox" },
                        { "id": 22039287, "nama": "h-7", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData2 = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22039304, "nama": "p-5", "type": "textbox" },
                        { "id": 22039305, "nama": "si-5", "type": "textbox" },
                        { "id": 22039306, "nama": "s-5", "type": "textbox" },
                        { "id": 22039307, "nama": "m-5", "type": "textbox" },
                        { "id": 22039308, "nama": "p-6", "type": "textbox" },
                        { "id": 22039309, "nama": "si-6", "type": "textbox" },
                        { "id": 22039310, "nama": "s-6", "type": "textbox" },
                        { "id": 22039311, "nama": "m-6", "type": "textbox" },
                        { "id": 22039312, "nama": "p-7", "type": "textbox" },
                        { "id": 22039313, "nama": "si-7", "type": "textbox" },
                        { "id": 22039314, "nama": "s-7", "type": "textbox" },
                        { "id": 22039315, "nama": "m-7", "type": "textbox" },
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
                        { "id": 22039332, "nama": "p-5", "type": "textbox" },
                        { "id": 22039333, "nama": "si-5", "type": "textbox" },
                        { "id": 22039334, "nama": "s-5", "type": "textbox" },
                        { "id": 22039335, "nama": "m-5", "type": "textbox" },
                        { "id": 22039336, "nama": "p-6", "type": "textbox" },
                        { "id": 22039337, "nama": "si-6", "type": "textbox" },
                        { "id": 22039338, "nama": "s-6", "type": "textbox" },
                        { "id": 22039339, "nama": "m-6", "type": "textbox" },
                        { "id": 22039340, "nama": "p-7", "type": "textbox" },
                        { "id": 22039341, "nama": "si-7", "type": "textbox" },
                        { "id": 22039342, "nama": "s-7", "type": "textbox" },
                        { "id": 22039343, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22039360, "nama": "p-5", "type": "textbox" },
                        { "id": 22039361, "nama": "si-5", "type": "textbox" },
                        { "id": 22039362, "nama": "s-5", "type": "textbox" },
                        { "id": 22039363, "nama": "m-5", "type": "textbox" },
                        { "id": 22039364, "nama": "p-6", "type": "textbox" },
                        { "id": 22039365, "nama": "si-6", "type": "textbox" },
                        { "id": 22039366, "nama": "s-6", "type": "textbox" },
                        { "id": 22039367, "nama": "m-6", "type": "textbox" },
                        { "id": 22039368, "nama": "p-7", "type": "textbox" },
                        { "id": 22039369, "nama": "si-7", "type": "textbox" },
                        { "id": 22039370, "nama": "s-7", "type": "textbox" },
                        { "id": 22039371, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22039376, "nama": "p-5", "type": "textbox", "satuan": "Gram" },
                        { "id": 22039377, "nama": "p-6", "type": "textbox", "satuan": "Gram" },
                        { "id": 22039378, "nama": "p-7", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPengenal1 = [
                { "id": 22039379, "nama": "Tgl.Lahir", "type": "datetime", "satuan": "" },
                { "id": 22039380, "nama": "Jenis Kelamin", "type": "textbox", "satuan": "" },
                { "id": 22039381, "nama": "APGAR Score", "type": "textbox", "satuan": "" },
                { "id": 22039382, "nama": "BB Lahir", "type": "textbox", "satuan": "Gram" },
                { "id": 22039383, "nama": "Panjang", "type": "textbox", "satuan": "cm" },
                { "id": 22039384, "nama": "Lingkar Kepala", "type": "textbox", "satuan": "cm" },
                { "id": 22039385, "nama": "Suhu", "type": "textbox", "satuan": "C" },
            ]
            $scope.listPengenal2 = [
                { "id": 22039386, "nama": "Riwayat Persalinan : GPA", "type": "textbox", "satuan": "" },
                { "id": 22039387, "nama": "Kehamilan", "type": "textbox", "satuan": "" },
                { "id": 22039388, "nama": "Umur Ibu", "type": "textbox", "satuan": "" },
                { "id": 22039389, "nama": "HbsAg Ibu", "type": "textbox", "satuan": "" },
                { "id": 22039390, "nama": "Gol. Darah Ibu", "type": "textbox", "satuan": "" },
                { "id": 22039391, "nama": "Persalinan", "type": "textbox", "satuan": "" },
                { "id": 22039392, "nama": "Ketuban", "type": "textbox", "satuan": "" },
            ]
            $scope.listPengenal3 = [
                { "id": 22039393, "nama": "Resusitasi", "type": "textbox", "satuan": "" },
                { "id": 22039394, "nama": "Obat yang diberikan", "type": "textbox", "satuan": "" },
                { "id": 22039395, "nama": "Miksi", "type": "textbox", "satuan": "" },
                { "id": 22039396, "nama": "Meco", "type": "textbox", "satuan": "" },
                { "id": 22039397, "nama": "Anus", "type": "textbox", "satuan": "" },
                { "id": 22039398, "nama": "Mata", "type": "textbox", "satuan": "" },
                { "id": 22039399, "nama": "Hal-hal istimewa", "type": "textbox", "satuan": "" },
            ]
            $scope.listObat = [
                {
                    "id": 22039400, "nama": "Obat-1",
                    "detail": [
                        { "id": 22039401, "nama": "p-1", "type": "textbox" },
                        { "id": 22039402, "nama": "si-1", "type": "textbox" },
                        { "id": 22039403, "nama": "s-1", "type": "textbox" },
                        { "id": 22039404, "nama": "m-1", "type": "textbox" },
                        { "id": 22039405, "nama": "p-2", "type": "textbox" },
                        { "id": 22039406, "nama": "si-2", "type": "textbox" },
                        { "id": 22039407, "nama": "s-2", "type": "textbox" },
                        { "id": 22039408, "nama": "m-2", "type": "textbox" },
                        { "id": 22039409, "nama": "p-3", "type": "textbox" },
                        { "id": 22039410, "nama": "si-3", "type": "textbox" },
                        { "id": 22039411, "nama": "s-3", "type": "textbox" },
                        { "id": 22039412, "nama": "m-3", "type": "textbox" },
                        { "id": 22039413, "nama": "p-4", "type": "textbox" },
                        { "id": 22039414, "nama": "si-4", "type": "textbox" },
                        { "id": 22039415, "nama": "s-4", "type": "textbox" },
                        { "id": 22039416, "nama": "m-4", "type": "textbox" },
                        { "id": 22039417, "nama": "p-5", "type": "textbox" },
                        { "id": 22039418, "nama": "si-5", "type": "textbox" },
                        { "id": 22039419, "nama": "s-5", "type": "textbox" },
                        { "id": 22039420, "nama": "m-5", "type": "textbox" },
                        { "id": 22039421, "nama": "p-6", "type": "textbox" },
                        { "id": 22039422, "nama": "si-6", "type": "textbox" },
                        { "id": 22039423, "nama": "s-6", "type": "textbox" },
                        { "id": 22039424, "nama": "m-6", "type": "textbox" },
                        { "id": 22039425, "nama": "p-7", "type": "textbox" },
                        { "id": 22039426, "nama": "si-7", "type": "textbox" },
                        { "id": 22039427, "nama": "s-7", "type": "textbox" },
                        { "id": 22039428, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039429, "nama": "Obat-2",
                    "detail": [
                        { "id": 22039430, "nama": "p-1", "type": "textbox" },
                        { "id": 22039431, "nama": "si-1", "type": "textbox" },
                        { "id": 22039432, "nama": "s-1", "type": "textbox" },
                        { "id": 22039433, "nama": "m-1", "type": "textbox" },
                        { "id": 22039434, "nama": "p-2", "type": "textbox" },
                        { "id": 22039435, "nama": "si-2", "type": "textbox" },
                        { "id": 22039436, "nama": "s-2", "type": "textbox" },
                        { "id": 22039437, "nama": "m-2", "type": "textbox" },
                        { "id": 22039438, "nama": "p-3", "type": "textbox" },
                        { "id": 22039439, "nama": "si-3", "type": "textbox" },
                        { "id": 22039440, "nama": "s-3", "type": "textbox" },
                        { "id": 22039441, "nama": "m-3", "type": "textbox" },
                        { "id": 22039442, "nama": "p-4", "type": "textbox" },
                        { "id": 22039443, "nama": "si-4", "type": "textbox" },
                        { "id": 22039444, "nama": "s-4", "type": "textbox" },
                        { "id": 22039445, "nama": "m-4", "type": "textbox" },
                        { "id": 22039446, "nama": "p-5", "type": "textbox" },
                        { "id": 22039447, "nama": "si-5", "type": "textbox" },
                        { "id": 22039448, "nama": "s-5", "type": "textbox" },
                        { "id": 22039449, "nama": "m-5", "type": "textbox" },
                        { "id": 22039450, "nama": "p-6", "type": "textbox" },
                        { "id": 22039451, "nama": "si-6", "type": "textbox" },
                        { "id": 22039452, "nama": "s-6", "type": "textbox" },
                        { "id": 22039453, "nama": "m-6", "type": "textbox" },
                        { "id": 22039454, "nama": "p-7", "type": "textbox" },
                        { "id": 22039455, "nama": "si-7", "type": "textbox" },
                        { "id": 22039456, "nama": "s-7", "type": "textbox" },
                        { "id": 22039457, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039458, "nama": "Obat-3",
                    "detail": [
                        { "id": 22039459, "nama": "p-1", "type": "textbox" },
                        { "id": 22039460, "nama": "si-1", "type": "textbox" },
                        { "id": 22039461, "nama": "s-1", "type": "textbox" },
                        { "id": 22039462, "nama": "m-1", "type": "textbox" },
                        { "id": 22039463, "nama": "p-2", "type": "textbox" },
                        { "id": 22039464, "nama": "si-2", "type": "textbox" },
                        { "id": 22039465, "nama": "s-2", "type": "textbox" },
                        { "id": 22039466, "nama": "m-2", "type": "textbox" },
                        { "id": 22039467, "nama": "p-3", "type": "textbox" },
                        { "id": 22039468, "nama": "si-3", "type": "textbox" },
                        { "id": 22039469, "nama": "s-3", "type": "textbox" },
                        { "id": 22039470, "nama": "m-3", "type": "textbox" },
                        { "id": 22039471, "nama": "p-4", "type": "textbox" },
                        { "id": 22039472, "nama": "si-4", "type": "textbox" },
                        { "id": 22039473, "nama": "s-4", "type": "textbox" },
                        { "id": 22039474, "nama": "m-4", "type": "textbox" },
                        { "id": 22039475, "nama": "p-5", "type": "textbox" },
                        { "id": 22039476, "nama": "si-5", "type": "textbox" },
                        { "id": 22039477, "nama": "s-5", "type": "textbox" },
                        { "id": 22039478, "nama": "m-5", "type": "textbox" },
                        { "id": 22039479, "nama": "p-6", "type": "textbox" },
                        { "id": 22039480, "nama": "si-6", "type": "textbox" },
                        { "id": 22039481, "nama": "s-6", "type": "textbox" },
                        { "id": 22039482, "nama": "m-6", "type": "textbox" },
                        { "id": 22039483, "nama": "p-7", "type": "textbox" },
                        { "id": 22039484, "nama": "si-7", "type": "textbox" },
                        { "id": 22039485, "nama": "s-7", "type": "textbox" },
                        { "id": 22039486, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039487, "nama": "Obat-4",
                    "detail": [
                        { "id": 22039488, "nama": "p-1", "type": "textbox" },
                        { "id": 22039489, "nama": "si-1", "type": "textbox" },
                        { "id": 22039490, "nama": "s-1", "type": "textbox" },
                        { "id": 22039491, "nama": "m-1", "type": "textbox" },
                        { "id": 22039492, "nama": "p-2", "type": "textbox" },
                        { "id": 22039493, "nama": "si-2", "type": "textbox" },
                        { "id": 22039494, "nama": "s-2", "type": "textbox" },
                        { "id": 22039495, "nama": "m-2", "type": "textbox" },
                        { "id": 22039496, "nama": "p-3", "type": "textbox" },
                        { "id": 22039497, "nama": "si-3", "type": "textbox" },
                        { "id": 22039498, "nama": "s-3", "type": "textbox" },
                        { "id": 22039499, "nama": "m-3", "type": "textbox" },
                        { "id": 22039500, "nama": "p-4", "type": "textbox" },
                        { "id": 22039501, "nama": "si-4", "type": "textbox" },
                        { "id": 22039502, "nama": "s-4", "type": "textbox" },
                        { "id": 22039503, "nama": "m-4", "type": "textbox" },
                        { "id": 22039504, "nama": "p-5", "type": "textbox" },
                        { "id": 22039505, "nama": "si-5", "type": "textbox" },
                        { "id": 22039506, "nama": "s-5", "type": "textbox" },
                        { "id": 22039507, "nama": "m-5", "type": "textbox" },
                        { "id": 22039508, "nama": "p-6", "type": "textbox" },
                        { "id": 22039509, "nama": "si-6", "type": "textbox" },
                        { "id": 22039510, "nama": "s-6", "type": "textbox" },
                        { "id": 22039511, "nama": "m-6", "type": "textbox" },
                        { "id": 22039512, "nama": "p-7", "type": "textbox" },
                        { "id": 22039513, "nama": "si-7", "type": "textbox" },
                        { "id": 22039514, "nama": "s-7", "type": "textbox" },
                        { "id": 22039515, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039516, "nama": "Obat-5",
                    "detail": [
                        { "id": 22039517, "nama": "p-1", "type": "textbox" },
                        { "id": 22039518, "nama": "si-1", "type": "textbox" },
                        { "id": 22039519, "nama": "s-1", "type": "textbox" },
                        { "id": 22039520, "nama": "m-1", "type": "textbox" },
                        { "id": 22039521, "nama": "p-2", "type": "textbox" },
                        { "id": 22039522, "nama": "si-2", "type": "textbox" },
                        { "id": 22039523, "nama": "s-2", "type": "textbox" },
                        { "id": 22039524, "nama": "m-2", "type": "textbox" },
                        { "id": 22039525, "nama": "p-3", "type": "textbox" },
                        { "id": 22039526, "nama": "si-3", "type": "textbox" },
                        { "id": 22039527, "nama": "s-3", "type": "textbox" },
                        { "id": 22039528, "nama": "m-3", "type": "textbox" },
                        { "id": 22039529, "nama": "p-4", "type": "textbox" },
                        { "id": 22039530, "nama": "si-4", "type": "textbox" },
                        { "id": 22039531, "nama": "s-4", "type": "textbox" },
                        { "id": 22039532, "nama": "m-4", "type": "textbox" },
                        { "id": 22039533, "nama": "p-5", "type": "textbox" },
                        { "id": 22039534, "nama": "si-5", "type": "textbox" },
                        { "id": 22039535, "nama": "s-5", "type": "textbox" },
                        { "id": 22039536, "nama": "m-5", "type": "textbox" },
                        { "id": 22039537, "nama": "p-6", "type": "textbox" },
                        { "id": 22039538, "nama": "si-6", "type": "textbox" },
                        { "id": 22039539, "nama": "s-6", "type": "textbox" },
                        { "id": 22039540, "nama": "m-6", "type": "textbox" },
                        { "id": 22039541, "nama": "p-7", "type": "textbox" },
                        { "id": 22039542, "nama": "si-7", "type": "textbox" },
                        { "id": 22039543, "nama": "s-7", "type": "textbox" },
                        { "id": 22039544, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039545, "nama": "Obat-6",
                    "detail": [
                        { "id": 22039546, "nama": "p-1", "type": "textbox" },
                        { "id": 22039547, "nama": "si-1", "type": "textbox" },
                        { "id": 22039548, "nama": "s-1", "type": "textbox" },
                        { "id": 22039549, "nama": "m-1", "type": "textbox" },
                        { "id": 22039550, "nama": "p-2", "type": "textbox" },
                        { "id": 22039551, "nama": "si-2", "type": "textbox" },
                        { "id": 22039552, "nama": "s-2", "type": "textbox" },
                        { "id": 22039553, "nama": "m-2", "type": "textbox" },
                        { "id": 22039554, "nama": "p-3", "type": "textbox" },
                        { "id": 22039555, "nama": "si-3", "type": "textbox" },
                        { "id": 22039556, "nama": "s-3", "type": "textbox" },
                        { "id": 22039557, "nama": "m-3", "type": "textbox" },
                        { "id": 22039558, "nama": "p-4", "type": "textbox" },
                        { "id": 22039559, "nama": "si-4", "type": "textbox" },
                        { "id": 22039560, "nama": "s-4", "type": "textbox" },
                        { "id": 22039561, "nama": "m-4", "type": "textbox" },
                        { "id": 22039562, "nama": "p-5", "type": "textbox" },
                        { "id": 22039563, "nama": "si-5", "type": "textbox" },
                        { "id": 22039564, "nama": "s-5", "type": "textbox" },
                        { "id": 22039565, "nama": "m-5", "type": "textbox" },
                        { "id": 22039566, "nama": "p-6", "type": "textbox" },
                        { "id": 22039567, "nama": "si-6", "type": "textbox" },
                        { "id": 22039568, "nama": "s-6", "type": "textbox" },
                        { "id": 22039569, "nama": "m-6", "type": "textbox" },
                        { "id": 22039570, "nama": "p-7", "type": "textbox" },
                        { "id": 22039571, "nama": "si-7", "type": "textbox" },
                        { "id": 22039572, "nama": "s-7", "type": "textbox" },
                        { "id": 22039573, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039574, "nama": "Obat-7",
                    "detail": [
                        { "id": 22039575, "nama": "p-1", "type": "textbox" },
                        { "id": 22039576, "nama": "si-1", "type": "textbox" },
                        { "id": 22039577, "nama": "s-1", "type": "textbox" },
                        { "id": 22039578, "nama": "m-1", "type": "textbox" },
                        { "id": 22039579, "nama": "p-2", "type": "textbox" },
                        { "id": 22039580, "nama": "si-2", "type": "textbox" },
                        { "id": 22039581, "nama": "s-2", "type": "textbox" },
                        { "id": 22039582, "nama": "m-2", "type": "textbox" },
                        { "id": 22039583, "nama": "p-3", "type": "textbox" },
                        { "id": 22039584, "nama": "si-3", "type": "textbox" },
                        { "id": 22039585, "nama": "s-3", "type": "textbox" },
                        { "id": 22039586, "nama": "m-3", "type": "textbox" },
                        { "id": 22039587, "nama": "p-4", "type": "textbox" },
                        { "id": 22039588, "nama": "si-4", "type": "textbox" },
                        { "id": 22039589, "nama": "s-4", "type": "textbox" },
                        { "id": 22039590, "nama": "m-4", "type": "textbox" },
                        { "id": 22039591, "nama": "p-5", "type": "textbox" },
                        { "id": 22039592, "nama": "si-5", "type": "textbox" },
                        { "id": 22039593, "nama": "s-5", "type": "textbox" },
                        { "id": 22039594, "nama": "m-5", "type": "textbox" },
                        { "id": 22039595, "nama": "p-6", "type": "textbox" },
                        { "id": 22039596, "nama": "si-6", "type": "textbox" },
                        { "id": 22039597, "nama": "s-6", "type": "textbox" },
                        { "id": 22039598, "nama": "m-6", "type": "textbox" },
                        { "id": 22039599, "nama": "p-7", "type": "textbox" },
                        { "id": 22039600, "nama": "si-7", "type": "textbox" },
                        { "id": 22039601, "nama": "s-7", "type": "textbox" },
                        { "id": 22039602, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039603, "nama": "Obat-8",
                    "detail": [
                        { "id": 22039604, "nama": "p-1", "type": "textbox" },
                        { "id": 22039605, "nama": "si-1", "type": "textbox" },
                        { "id": 22039606, "nama": "s-1", "type": "textbox" },
                        { "id": 22039607, "nama": "m-1", "type": "textbox" },
                        { "id": 22039608, "nama": "p-2", "type": "textbox" },
                        { "id": 22039609, "nama": "si-2", "type": "textbox" },
                        { "id": 22039610, "nama": "s-2", "type": "textbox" },
                        { "id": 22039611, "nama": "m-2", "type": "textbox" },
                        { "id": 22039612, "nama": "p-3", "type": "textbox" },
                        { "id": 22039613, "nama": "si-3", "type": "textbox" },
                        { "id": 22039614, "nama": "s-3", "type": "textbox" },
                        { "id": 22039615, "nama": "m-3", "type": "textbox" },
                        { "id": 22039616, "nama": "p-4", "type": "textbox" },
                        { "id": 22039617, "nama": "si-4", "type": "textbox" },
                        { "id": 22039618, "nama": "s-4", "type": "textbox" },
                        { "id": 22039619, "nama": "m-4", "type": "textbox" },
                        { "id": 22039620, "nama": "p-5", "type": "textbox" },
                        { "id": 22039621, "nama": "si-5", "type": "textbox" },
                        { "id": 22039622, "nama": "s-5", "type": "textbox" },
                        { "id": 22039623, "nama": "m-5", "type": "textbox" },
                        { "id": 22039624, "nama": "p-6", "type": "textbox" },
                        { "id": 22039625, "nama": "si-6", "type": "textbox" },
                        { "id": 22039626, "nama": "s-6", "type": "textbox" },
                        { "id": 22039627, "nama": "m-6", "type": "textbox" },
                        { "id": 22039628, "nama": "p-7", "type": "textbox" },
                        { "id": 22039629, "nama": "si-7", "type": "textbox" },
                        { "id": 22039630, "nama": "s-7", "type": "textbox" },
                        { "id": 22039631, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039632, "nama": "Obat-9",
                    "detail": [
                        { "id": 22039633, "nama": "p-1", "type": "textbox" },
                        { "id": 22039634, "nama": "si-1", "type": "textbox" },
                        { "id": 22039635, "nama": "s-1", "type": "textbox" },
                        { "id": 22039636, "nama": "m-1", "type": "textbox" },
                        { "id": 22039637, "nama": "p-2", "type": "textbox" },
                        { "id": 22039638, "nama": "si-2", "type": "textbox" },
                        { "id": 22039639, "nama": "s-2", "type": "textbox" },
                        { "id": 22039640, "nama": "m-2", "type": "textbox" },
                        { "id": 22039641, "nama": "p-3", "type": "textbox" },
                        { "id": 22039642, "nama": "si-3", "type": "textbox" },
                        { "id": 22039643, "nama": "s-3", "type": "textbox" },
                        { "id": 22039644, "nama": "m-3", "type": "textbox" },
                        { "id": 22039645, "nama": "p-4", "type": "textbox" },
                        { "id": 22039646, "nama": "si-4", "type": "textbox" },
                        { "id": 22039647, "nama": "s-4", "type": "textbox" },
                        { "id": 22039648, "nama": "m-4", "type": "textbox" },
                        { "id": 22039649, "nama": "p-5", "type": "textbox" },
                        { "id": 22039650, "nama": "si-5", "type": "textbox" },
                        { "id": 22039651, "nama": "s-5", "type": "textbox" },
                        { "id": 22039652, "nama": "m-5", "type": "textbox" },
                        { "id": 22039653, "nama": "p-6", "type": "textbox" },
                        { "id": 22039654, "nama": "si-6", "type": "textbox" },
                        { "id": 22039655, "nama": "s-6", "type": "textbox" },
                        { "id": 22039656, "nama": "m-6", "type": "textbox" },
                        { "id": 22039657, "nama": "p-7", "type": "textbox" },
                        { "id": 22039658, "nama": "si-7", "type": "textbox" },
                        { "id": 22039659, "nama": "s-7", "type": "textbox" },
                        { "id": 22039660, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039661, "nama": "Obat-10",
                    "detail": [
                        { "id": 22039662, "nama": "p-1", "type": "textbox" },
                        { "id": 22039663, "nama": "si-1", "type": "textbox" },
                        { "id": 22039664, "nama": "s-1", "type": "textbox" },
                        { "id": 22039665, "nama": "m-1", "type": "textbox" },
                        { "id": 22039666, "nama": "p-2", "type": "textbox" },
                        { "id": 22039667, "nama": "si-2", "type": "textbox" },
                        { "id": 22039668, "nama": "s-2", "type": "textbox" },
                        { "id": 22039669, "nama": "m-2", "type": "textbox" },
                        { "id": 22039670, "nama": "p-3", "type": "textbox" },
                        { "id": 22039671, "nama": "si-3", "type": "textbox" },
                        { "id": 22039672, "nama": "s-3", "type": "textbox" },
                        { "id": 22039673, "nama": "m-3", "type": "textbox" },
                        { "id": 22039674, "nama": "p-4", "type": "textbox" },
                        { "id": 22039675, "nama": "si-4", "type": "textbox" },
                        { "id": 22039676, "nama": "s-4", "type": "textbox" },
                        { "id": 22039677, "nama": "m-4", "type": "textbox" },
                        { "id": 22039678, "nama": "p-5", "type": "textbox" },
                        { "id": 22039679, "nama": "si-5", "type": "textbox" },
                        { "id": 22039680, "nama": "s-5", "type": "textbox" },
                        { "id": 22039681, "nama": "m-5", "type": "textbox" },
                        { "id": 22039682, "nama": "p-6", "type": "textbox" },
                        { "id": 22039683, "nama": "si-6", "type": "textbox" },
                        { "id": 22039684, "nama": "s-6", "type": "textbox" },
                        { "id": 22039685, "nama": "m-6", "type": "textbox" },
                        { "id": 22039686, "nama": "p-7", "type": "textbox" },
                        { "id": 22039687, "nama": "si-7", "type": "textbox" },
                        { "id": 22039688, "nama": "s-7", "type": "textbox" },
                        { "id": 22039689, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039690, "nama": "Obat-11",
                    "detail": [
                        { "id": 22039691, "nama": "p-1", "type": "textbox" },
                        { "id": 22039692, "nama": "si-1", "type": "textbox" },
                        { "id": 22039693, "nama": "s-1", "type": "textbox" },
                        { "id": 22039694, "nama": "m-1", "type": "textbox" },
                        { "id": 22039695, "nama": "p-2", "type": "textbox" },
                        { "id": 22039696, "nama": "si-2", "type": "textbox" },
                        { "id": 22039697, "nama": "s-2", "type": "textbox" },
                        { "id": 22039698, "nama": "m-2", "type": "textbox" },
                        { "id": 22039699, "nama": "p-3", "type": "textbox" },
                        { "id": 22039700, "nama": "si-3", "type": "textbox" },
                        { "id": 22039701, "nama": "s-3", "type": "textbox" },
                        { "id": 22039702, "nama": "m-3", "type": "textbox" },
                        { "id": 22039703, "nama": "p-4", "type": "textbox" },
                        { "id": 22039704, "nama": "si-4", "type": "textbox" },
                        { "id": 22039705, "nama": "s-4", "type": "textbox" },
                        { "id": 22039706, "nama": "m-4", "type": "textbox" },
                        { "id": 22039707, "nama": "p-5", "type": "textbox" },
                        { "id": 22039708, "nama": "si-5", "type": "textbox" },
                        { "id": 22039709, "nama": "s-5", "type": "textbox" },
                        { "id": 22039710, "nama": "m-5", "type": "textbox" },
                        { "id": 22039711, "nama": "p-6", "type": "textbox" },
                        { "id": 22039712, "nama": "si-6", "type": "textbox" },
                        { "id": 22039713, "nama": "s-6", "type": "textbox" },
                        { "id": 22039714, "nama": "m-6", "type": "textbox" },
                        { "id": 22039715, "nama": "p-7", "type": "textbox" },
                        { "id": 22039716, "nama": "si-7", "type": "textbox" },
                        { "id": 22039717, "nama": "s-7", "type": "textbox" },
                        { "id": 22039718, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22039719, "nama": "Obat-12",
                    "detail": [
                        { "id": 22039720, "nama": "p-1", "type": "textbox" },
                        { "id": 22039721, "nama": "si-1", "type": "textbox" },
                        { "id": 22039722, "nama": "s-1", "type": "textbox" },
                        { "id": 22039723, "nama": "m-1", "type": "textbox" },
                        { "id": 22039724, "nama": "p-2", "type": "textbox" },
                        { "id": 22039725, "nama": "si-2", "type": "textbox" },
                        { "id": 22039726, "nama": "s-2", "type": "textbox" },
                        { "id": 22039727, "nama": "m-2", "type": "textbox" },
                        { "id": 22039728, "nama": "p-3", "type": "textbox" },
                        { "id": 22039729, "nama": "si-3", "type": "textbox" },
                        { "id": 22039730, "nama": "s-3", "type": "textbox" },
                        { "id": 22039731, "nama": "m-3", "type": "textbox" },
                        { "id": 22039732, "nama": "p-4", "type": "textbox" },
                        { "id": 22039733, "nama": "si-4", "type": "textbox" },
                        { "id": 22039734, "nama": "s-4", "type": "textbox" },
                        { "id": 22039735, "nama": "m-4", "type": "textbox" },
                        { "id": 22039736, "nama": "p-5", "type": "textbox" },
                        { "id": 22039737, "nama": "si-5", "type": "textbox" },
                        { "id": 22039738, "nama": "s-5", "type": "textbox" },
                        { "id": 22039739, "nama": "m-5", "type": "textbox" },
                        { "id": 22039740, "nama": "p-6", "type": "textbox" },
                        { "id": 22039741, "nama": "si-6", "type": "textbox" },
                        { "id": 22039742, "nama": "s-6", "type": "textbox" },
                        { "id": 22039743, "nama": "m-6", "type": "textbox" },
                        { "id": 22039744, "nama": "p-7", "type": "textbox" },
                        { "id": 22039745, "nama": "si-7", "type": "textbox" },
                        { "id": 22039746, "nama": "s-7", "type": "textbox" },
                        { "id": 22039747, "nama": "m-7", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSuhu = [
                { "id": 22039316, "nama": "p-1", "type": "textbox" },
                { "id": 22039317, "nama": "si-1", "type": "textbox" },
                { "id": 22039318, "nama": "s-1", "type": "textbox" },
                { "id": 22039319, "nama": "m-1", "type": "textbox" },
                { "id": 22039320, "nama": "p-2", "type": "textbox" },
                { "id": 22039321, "nama": "si-2", "type": "textbox" },
                { "id": 22039322, "nama": "s-2", "type": "textbox" },
                { "id": 22039323, "nama": "m-2", "type": "textbox" },
                { "id": 22039324, "nama": "p-3", "type": "textbox" },
                { "id": 22039325, "nama": "si-3", "type": "textbox" },
                { "id": 22039326, "nama": "s-3", "type": "textbox" },
                { "id": 22039327, "nama": "m-3", "type": "textbox" },
                { "id": 22039328, "nama": "p-4", "type": "textbox" },
                { "id": 22039329, "nama": "si-4", "type": "textbox" },
                { "id": 22039330, "nama": "s-4", "type": "textbox" },
                { "id": 22039331, "nama": "m-4", "type": "textbox" },
                { "id": 22039332, "nama": "p-5", "type": "textbox" },
                { "id": 22039333, "nama": "si-5", "type": "textbox" },
                { "id": 22039334, "nama": "s-5", "type": "textbox" },
                { "id": 22039335, "nama": "m-5", "type": "textbox" },
                { "id": 22039336, "nama": "p-6", "type": "textbox" },
                { "id": 22039337, "nama": "si-6", "type": "textbox" },
                { "id": 22039338, "nama": "s-6", "type": "textbox" },
                { "id": 22039339, "nama": "m-6", "type": "textbox" },
                { "id": 22039340, "nama": "p-7", "type": "textbox" },
                { "id": 22039341, "nama": "si-7", "type": "textbox" },
                { "id": 22039342, "nama": "s-7", "type": "textbox" },
                { "id": 22039343, "nama": "m-7", "type": "textbox" },
            ]
            $scope.listNadi = [
                { "id": 22039344, "nama": "p-1", "type": "textbox" },
                { "id": 22039345, "nama": "si-1", "type": "textbox" },
                { "id": 22039346, "nama": "s-1", "type": "textbox" },
                { "id": 22039347, "nama": "m-1", "type": "textbox" },
                { "id": 22039348, "nama": "p-2", "type": "textbox" },
                { "id": 22039349, "nama": "si-2", "type": "textbox" },
                { "id": 22039350, "nama": "s-2", "type": "textbox" },
                { "id": 22039351, "nama": "m-2", "type": "textbox" },
                { "id": 22039352, "nama": "p-3", "type": "textbox" },
                { "id": 22039353, "nama": "si-3", "type": "textbox" },
                { "id": 22039354, "nama": "s-3", "type": "textbox" },
                { "id": 22039355, "nama": "m-3", "type": "textbox" },
                { "id": 22039356, "nama": "p-4", "type": "textbox" },
                { "id": 22039357, "nama": "si-4", "type": "textbox" },
                { "id": 22039358, "nama": "s-4", "type": "textbox" },
                { "id": 22039359, "nama": "m-4", "type": "textbox" },
                { "id": 22039360, "nama": "p-5", "type": "textbox" },
                { "id": 22039361, "nama": "si-5", "type": "textbox" },
                { "id": 22039362, "nama": "s-5", "type": "textbox" },
                { "id": 22039363, "nama": "m-5", "type": "textbox" },
                { "id": 22039364, "nama": "p-6", "type": "textbox" },
                { "id": 22039365, "nama": "si-6", "type": "textbox" },
                { "id": 22039366, "nama": "s-6", "type": "textbox" },
                { "id": 22039367, "nama": "m-6", "type": "textbox" },
                { "id": 22039368, "nama": "p-7", "type": "textbox" },
                { "id": 22039369, "nama": "si-7", "type": "textbox" },
                { "id": 22039370, "nama": "s-7", "type": "textbox" },
                { "id": 22039371, "nama": "m-7", "type": "textbox" },
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
                    'Catatan Perinatologi 8' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
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