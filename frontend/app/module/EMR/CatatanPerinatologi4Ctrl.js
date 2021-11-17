define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPerinatologi4Ctrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            $scope.cc.emrfk = 210227
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
                        { "id": 22037168, "nama": "h-1", "type": "datetime" },
                        { "id": 22037169, "nama": "h-2", "type": "datetime" },
                        { "id": 22037170, "nama": "h-3", "type": "datetime" },
                        { "id": 22037171, "nama": "h-4", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22037175, "nama": "h-1", "type": "textbox" },
                        { "id": 22037176, "nama": "h-2", "type": "textbox" },
                        { "id": 22037177, "nama": "h-3", "type": "textbox" },
                        { "id": 22037178, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22037182, "nama": "h-1", "type": "textbox" },
                        { "id": 22037183, "nama": "h-2", "type": "textbox" },
                        { "id": 22037184, "nama": "h-3", "type": "textbox" },
                        { "id": 22037185, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22037189, "nama": "h-1", "type": "textbox" },
                        { "id": 22037190, "nama": "h-2", "type": "textbox" },
                        { "id": 22037191, "nama": "h-3", "type": "textbox" },
                        { "id": 22037192, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22037196, "nama": "h-1", "type": "textbox" },
                        { "id": 22037197, "nama": "h-2", "type": "textbox" },
                        { "id": 22037198, "nama": "h-3", "type": "textbox" },
                        { "id": 22037199, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22037203, "nama": "h-1", "type": "textbox" },
                        { "id": 22037204, "nama": "h-2", "type": "textbox" },
                        { "id": 22037205, "nama": "h-3", "type": "textbox" },
                        { "id": 22037206, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22037210, "nama": "h-1", "type": "textbox" },
                        { "id": 22037211, "nama": "h-2", "type": "textbox" },
                        { "id": 22037212, "nama": "h-3", "type": "textbox" },
                        { "id": 22037213, "nama": "h-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22037217, "nama": "h-1", "type": "textbox" },
                        { "id": 22037218, "nama": "h-2", "type": "textbox" },
                        { "id": 22037219, "nama": "h-3", "type": "textbox" },
                        { "id": 22037220, "nama": "h-4", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22037224, "nama": "p-1", "type": "textbox" },
                        { "id": 22037225, "nama": "si-1", "type": "textbox" },
                        { "id": 22037226, "nama": "s-1", "type": "textbox" },
                        { "id": 22037227, "nama": "m-1", "type": "textbox" },
                        { "id": 22037228, "nama": "p-2", "type": "textbox" },
                        { "id": 22037229, "nama": "si-2", "type": "textbox" },
                        { "id": 22037230, "nama": "s-2", "type": "textbox" },
                        { "id": 22037231, "nama": "m-2", "type": "textbox" },
                        { "id": 22037232, "nama": "p-3", "type": "textbox" },
                        { "id": 22037233, "nama": "si-3", "type": "textbox" },
                        { "id": 22037234, "nama": "s-3", "type": "textbox" },
                        { "id": 22037235, "nama": "m-3", "type": "textbox" },
                        { "id": 22037236, "nama": "p-4", "type": "textbox" },
                        { "id": 22037237, "nama": "si-4", "type": "textbox" },
                        { "id": 22037238, "nama": "s-4", "type": "textbox" },
                        { "id": 22037239, "nama": "m-4", "type": "textbox" },
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
                        { "id": 22037252, "nama": "p-1", "type": "textbox" },
                        { "id": 22037253, "nama": "si-1", "type": "textbox" },
                        { "id": 22037254, "nama": "s-1", "type": "textbox" },
                        { "id": 22037255, "nama": "m-1", "type": "textbox" },
                        { "id": 22037256, "nama": "p-2", "type": "textbox" },
                        { "id": 22037257, "nama": "si-2", "type": "textbox" },
                        { "id": 22037258, "nama": "s-2", "type": "textbox" },
                        { "id": 22037259, "nama": "m-2", "type": "textbox" },
                        { "id": 22037260, "nama": "p-3", "type": "textbox" },
                        { "id": 22037261, "nama": "si-3", "type": "textbox" },
                        { "id": 22037262, "nama": "s-3", "type": "textbox" },
                        { "id": 22037263, "nama": "m-3", "type": "textbox" },
                        { "id": 22037264, "nama": "p-4", "type": "textbox" },
                        { "id": 22037265, "nama": "si-4", "type": "textbox" },
                        { "id": 22037266, "nama": "s-4", "type": "textbox" },
                        { "id": 22037267, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22037280, "nama": "p-1", "type": "textbox" },
                        { "id": 22037281, "nama": "si-1", "type": "textbox" },
                        { "id": 22037282, "nama": "s-1", "type": "textbox" },
                        { "id": 22037283, "nama": "m-1", "type": "textbox" },
                        { "id": 22037284, "nama": "p-2", "type": "textbox" },
                        { "id": 22037285, "nama": "si-2", "type": "textbox" },
                        { "id": 22037286, "nama": "s-2", "type": "textbox" },
                        { "id": 22037287, "nama": "m-2", "type": "textbox" },
                        { "id": 22037288, "nama": "p-3", "type": "textbox" },
                        { "id": 22037289, "nama": "si-3", "type": "textbox" },
                        { "id": 22037290, "nama": "s-3", "type": "textbox" },
                        { "id": 22037291, "nama": "m-3", "type": "textbox" },
                        { "id": 22037292, "nama": "p-4", "type": "textbox" },
                        { "id": 22037293, "nama": "si-4", "type": "textbox" },
                        { "id": 22037294, "nama": "s-4", "type": "textbox" },
                        { "id": 22037295, "nama": "m-4", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22037308, "nama": "p-1", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037309, "nama": "p-2", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037310, "nama": "p-3", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037311, "nama": "p-4", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPerinatologi2 = [
                {
                    "id": 1, "nama": "Tgl / Bln", "style": "text-align: center;background-color: #dedfe2d3;",
                    "detail": [
                        { "id": 22037172, "nama": "h-5", "type": "datetime" },
                        { "id": 22037173, "nama": "h-6", "type": "datetime" },
                        { "id": 22037174, "nama": "h-7", "type": "datetime" },
                    ]
                },
                {
                    "id": 2, "nama": "Balance Cairan",
                    "detail": [
                        { "id": 22037179, "nama": "h-5", "type": "textbox" },
                        { "id": 22037180, "nama": "h-6", "type": "textbox" },
                        { "id": 22037181, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 3, "nama": "Bilirubin",
                    "detail": [
                        { "id": 22037186, "nama": "h-5", "type": "textbox" },
                        { "id": 22037187, "nama": "h-6", "type": "textbox" },
                        { "id": 22037188, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Minum",
                    "detail": [
                        { "id": 22037193, "nama": "h-5", "type": "textbox" },
                        { "id": 22037194, "nama": "h-6", "type": "textbox" },
                        { "id": 22037195, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 5, "nama": "Muntah",
                    "detail": [
                        { "id": 22037200, "nama": "h-5", "type": "textbox" },
                        { "id": 22037201, "nama": "h-6", "type": "textbox" },
                        { "id": 22037202, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 6, "nama": "Urine",
                    "detail": [
                        { "id": 22037207, "nama": "h-5", "type": "textbox" },
                        { "id": 22037208, "nama": "h-6", "type": "textbox" },
                        { "id": 22037209, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 7, "nama": "Defekasi",
                    "detail": [
                        { "id": 22037214, "nama": "h-5", "type": "textbox" },
                        { "id": 22037215, "nama": "h-6", "type": "textbox" },
                        { "id": 22037216, "nama": "h-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 8, "nama": "Infus",
                    "detail": [
                        { "id": 22037221, "nama": "h-5", "type": "textbox" },
                        { "id": 22037222, "nama": "h-6", "type": "textbox" },
                        { "id": 22037223, "nama": "h-7", "type": "textbox" },
                    ]
                },
            ]
            $scope.listData2 = [
                {
                    "id": 1, "nama": "Pernafasan",
                    "detail": [
                        { "id": 22037240, "nama": "p-5", "type": "textbox" },
                        { "id": 22037241, "nama": "si-5", "type": "textbox" },
                        { "id": 22037242, "nama": "s-5", "type": "textbox" },
                        { "id": 22037243, "nama": "m-5", "type": "textbox" },
                        { "id": 22037244, "nama": "p-6", "type": "textbox" },
                        { "id": 22037245, "nama": "si-6", "type": "textbox" },
                        { "id": 22037246, "nama": "s-6", "type": "textbox" },
                        { "id": 22037247, "nama": "m-6", "type": "textbox" },
                        { "id": 22037248, "nama": "p-7", "type": "textbox" },
                        { "id": 22037249, "nama": "si-7", "type": "textbox" },
                        { "id": 22037250, "nama": "s-7", "type": "textbox" },
                        { "id": 22037251, "nama": "m-7", "type": "textbox" },
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
                        { "id": 22037268, "nama": "p-5", "type": "textbox" },
                        { "id": 22037269, "nama": "si-5", "type": "textbox" },
                        { "id": 22037270, "nama": "s-5", "type": "textbox" },
                        { "id": 22037271, "nama": "m-5", "type": "textbox" },
                        { "id": 22037272, "nama": "p-6", "type": "textbox" },
                        { "id": 22037273, "nama": "si-6", "type": "textbox" },
                        { "id": 22037274, "nama": "s-6", "type": "textbox" },
                        { "id": 22037275, "nama": "m-6", "type": "textbox" },
                        { "id": 22037276, "nama": "p-7", "type": "textbox" },
                        { "id": 22037277, "nama": "si-7", "type": "textbox" },
                        { "id": 22037278, "nama": "s-7", "type": "textbox" },
                        { "id": 22037279, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "Nadi",
                    "detail": [
                        { "id": 22037296, "nama": "p-5", "type": "textbox" },
                        { "id": 22037297, "nama": "si-5", "type": "textbox" },
                        { "id": 22037298, "nama": "s-5", "type": "textbox" },
                        { "id": 22037299, "nama": "m-5", "type": "textbox" },
                        { "id": 22037300, "nama": "p-6", "type": "textbox" },
                        { "id": 22037301, "nama": "si-6", "type": "textbox" },
                        { "id": 22037302, "nama": "s-6", "type": "textbox" },
                        { "id": 22037303, "nama": "m-6", "type": "textbox" },
                        { "id": 22037304, "nama": "p-7", "type": "textbox" },
                        { "id": 22037305, "nama": "si-7", "type": "textbox" },
                        { "id": 22037306, "nama": "s-7", "type": "textbox" },
                        { "id": 22037307, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 4, "nama": "BB", "colspan": "4",
                    "detail": [
                        { "id": 22037312, "nama": "p-5", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037313, "nama": "p-6", "type": "textbox", "satuan": "Gram" },
                        { "id": 22037314, "nama": "p-7", "type": "textbox", "satuan": "Gram" },
                    ]
                },
            ]
            $scope.listPengenal1 = [
                { "id": 22037315, "nama": "Tgl.Lahir", "type": "datetime", "satuan": "" },
                { "id": 22037316, "nama": "Jenis Kelamin", "type": "textbox", "satuan": "" },
                { "id": 22037317, "nama": "APGAR Score", "type": "textbox", "satuan": "" },
                { "id": 22037318, "nama": "BB Lahir", "type": "textbox", "satuan": "Gram" },
                { "id": 22037319, "nama": "Panjang", "type": "textbox", "satuan": "cm" },
                { "id": 22037320, "nama": "Lingkar Kepala", "type": "textbox", "satuan": "cm" },
                { "id": 22037321, "nama": "Suhu", "type": "textbox", "satuan": "C" },
            ]
            $scope.listPengenal2 = [
                { "id": 22037322, "nama": "Riwayat Persalinan : GPA", "type": "textbox", "satuan": "" },
                { "id": 22037323, "nama": "Kehamilan", "type": "textbox", "satuan": "" },
                { "id": 22037324, "nama": "Umur Ibu", "type": "textbox", "satuan": "" },
                { "id": 22037325, "nama": "HbsAg Ibu", "type": "textbox", "satuan": "" },
                { "id": 22037326, "nama": "Gol. Darah Ibu", "type": "textbox", "satuan": "" },
                { "id": 22037327, "nama": "Persalinan", "type": "textbox", "satuan": "" },
                { "id": 22037328, "nama": "Ketuban", "type": "textbox", "satuan": "" },
            ]
            $scope.listPengenal3 = [
                { "id": 22037329, "nama": "Resusitasi", "type": "textbox", "satuan": "" },
                { "id": 22037330, "nama": "Obat yang diberikan", "type": "textbox", "satuan": "" },
                { "id": 22037331, "nama": "Miksi", "type": "textbox", "satuan": "" },
                { "id": 22037332, "nama": "Meco", "type": "textbox", "satuan": "" },
                { "id": 22037333, "nama": "Anus", "type": "textbox", "satuan": "" },
                { "id": 22037334, "nama": "Mata", "type": "textbox", "satuan": "" },
                { "id": 22037335, "nama": "Hal-hal istimewa", "type": "textbox", "satuan": "" },
            ]
            $scope.listObat = [
                {
                    "id": 22037336, "nama": "Obat-1",
                    "detail": [
                        { "id": 22037337, "nama": "p-1", "type": "textbox" },
                        { "id": 22037338, "nama": "si-1", "type": "textbox" },
                        { "id": 22037339, "nama": "s-1", "type": "textbox" },
                        { "id": 22037340, "nama": "m-1", "type": "textbox" },
                        { "id": 22037341, "nama": "p-2", "type": "textbox" },
                        { "id": 22037342, "nama": "si-2", "type": "textbox" },
                        { "id": 22037343, "nama": "s-2", "type": "textbox" },
                        { "id": 22037344, "nama": "m-2", "type": "textbox" },
                        { "id": 22037345, "nama": "p-3", "type": "textbox" },
                        { "id": 22037346, "nama": "si-3", "type": "textbox" },
                        { "id": 22037347, "nama": "s-3", "type": "textbox" },
                        { "id": 22037348, "nama": "m-3", "type": "textbox" },
                        { "id": 22037349, "nama": "p-4", "type": "textbox" },
                        { "id": 22037350, "nama": "si-4", "type": "textbox" },
                        { "id": 22037351, "nama": "s-4", "type": "textbox" },
                        { "id": 22037352, "nama": "m-4", "type": "textbox" },
                        { "id": 22037353, "nama": "p-5", "type": "textbox" },
                        { "id": 22037354, "nama": "si-5", "type": "textbox" },
                        { "id": 22037355, "nama": "s-5", "type": "textbox" },
                        { "id": 22037356, "nama": "m-5", "type": "textbox" },
                        { "id": 22037357, "nama": "p-6", "type": "textbox" },
                        { "id": 22037358, "nama": "si-6", "type": "textbox" },
                        { "id": 22037359, "nama": "s-6", "type": "textbox" },
                        { "id": 22037360, "nama": "m-6", "type": "textbox" },
                        { "id": 22037361, "nama": "p-7", "type": "textbox" },
                        { "id": 22037362, "nama": "si-7", "type": "textbox" },
                        { "id": 22037363, "nama": "s-7", "type": "textbox" },
                        { "id": 22037364, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037365, "nama": "Obat-2",
                    "detail": [
                        { "id": 22037366, "nama": "p-1", "type": "textbox" },
                        { "id": 22037367, "nama": "si-1", "type": "textbox" },
                        { "id": 22037368, "nama": "s-1", "type": "textbox" },
                        { "id": 22037369, "nama": "m-1", "type": "textbox" },
                        { "id": 22037370, "nama": "p-2", "type": "textbox" },
                        { "id": 22037371, "nama": "si-2", "type": "textbox" },
                        { "id": 22037372, "nama": "s-2", "type": "textbox" },
                        { "id": 22037373, "nama": "m-2", "type": "textbox" },
                        { "id": 22037374, "nama": "p-3", "type": "textbox" },
                        { "id": 22037375, "nama": "si-3", "type": "textbox" },
                        { "id": 22037376, "nama": "s-3", "type": "textbox" },
                        { "id": 22037377, "nama": "m-3", "type": "textbox" },
                        { "id": 22037378, "nama": "p-4", "type": "textbox" },
                        { "id": 22037379, "nama": "si-4", "type": "textbox" },
                        { "id": 22037380, "nama": "s-4", "type": "textbox" },
                        { "id": 22037381, "nama": "m-4", "type": "textbox" },
                        { "id": 22037382, "nama": "p-5", "type": "textbox" },
                        { "id": 22037383, "nama": "si-5", "type": "textbox" },
                        { "id": 22037384, "nama": "s-5", "type": "textbox" },
                        { "id": 22037385, "nama": "m-5", "type": "textbox" },
                        { "id": 22037386, "nama": "p-6", "type": "textbox" },
                        { "id": 22037387, "nama": "si-6", "type": "textbox" },
                        { "id": 22037388, "nama": "s-6", "type": "textbox" },
                        { "id": 22037389, "nama": "m-6", "type": "textbox" },
                        { "id": 22037390, "nama": "p-7", "type": "textbox" },
                        { "id": 22037391, "nama": "si-7", "type": "textbox" },
                        { "id": 22037392, "nama": "s-7", "type": "textbox" },
                        { "id": 22037393, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037394, "nama": "Obat-3",
                    "detail": [
                        { "id": 22037395, "nama": "p-1", "type": "textbox" },
                        { "id": 22037396, "nama": "si-1", "type": "textbox" },
                        { "id": 22037397, "nama": "s-1", "type": "textbox" },
                        { "id": 22037398, "nama": "m-1", "type": "textbox" },
                        { "id": 22037399, "nama": "p-2", "type": "textbox" },
                        { "id": 22037400, "nama": "si-2", "type": "textbox" },
                        { "id": 22037401, "nama": "s-2", "type": "textbox" },
                        { "id": 22037402, "nama": "m-2", "type": "textbox" },
                        { "id": 22037403, "nama": "p-3", "type": "textbox" },
                        { "id": 22037404, "nama": "si-3", "type": "textbox" },
                        { "id": 22037405, "nama": "s-3", "type": "textbox" },
                        { "id": 22037406, "nama": "m-3", "type": "textbox" },
                        { "id": 22037407, "nama": "p-4", "type": "textbox" },
                        { "id": 22037408, "nama": "si-4", "type": "textbox" },
                        { "id": 22037409, "nama": "s-4", "type": "textbox" },
                        { "id": 22037410, "nama": "m-4", "type": "textbox" },
                        { "id": 22037411, "nama": "p-5", "type": "textbox" },
                        { "id": 22037412, "nama": "si-5", "type": "textbox" },
                        { "id": 22037413, "nama": "s-5", "type": "textbox" },
                        { "id": 22037414, "nama": "m-5", "type": "textbox" },
                        { "id": 22037415, "nama": "p-6", "type": "textbox" },
                        { "id": 22037416, "nama": "si-6", "type": "textbox" },
                        { "id": 22037417, "nama": "s-6", "type": "textbox" },
                        { "id": 22037418, "nama": "m-6", "type": "textbox" },
                        { "id": 22037419, "nama": "p-7", "type": "textbox" },
                        { "id": 22037420, "nama": "si-7", "type": "textbox" },
                        { "id": 22037421, "nama": "s-7", "type": "textbox" },
                        { "id": 22037422, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037423, "nama": "Obat-4",
                    "detail": [
                        { "id": 22037424, "nama": "p-1", "type": "textbox" },
                        { "id": 22037425, "nama": "si-1", "type": "textbox" },
                        { "id": 22037426, "nama": "s-1", "type": "textbox" },
                        { "id": 22037427, "nama": "m-1", "type": "textbox" },
                        { "id": 22037428, "nama": "p-2", "type": "textbox" },
                        { "id": 22037429, "nama": "si-2", "type": "textbox" },
                        { "id": 22037430, "nama": "s-2", "type": "textbox" },
                        { "id": 22037431, "nama": "m-2", "type": "textbox" },
                        { "id": 22037432, "nama": "p-3", "type": "textbox" },
                        { "id": 22037433, "nama": "si-3", "type": "textbox" },
                        { "id": 22037434, "nama": "s-3", "type": "textbox" },
                        { "id": 22037435, "nama": "m-3", "type": "textbox" },
                        { "id": 22037436, "nama": "p-4", "type": "textbox" },
                        { "id": 22037437, "nama": "si-4", "type": "textbox" },
                        { "id": 22037438, "nama": "s-4", "type": "textbox" },
                        { "id": 22037439, "nama": "m-4", "type": "textbox" },
                        { "id": 22037440, "nama": "p-5", "type": "textbox" },
                        { "id": 22037441, "nama": "si-5", "type": "textbox" },
                        { "id": 22037442, "nama": "s-5", "type": "textbox" },
                        { "id": 22037443, "nama": "m-5", "type": "textbox" },
                        { "id": 22037444, "nama": "p-6", "type": "textbox" },
                        { "id": 22037445, "nama": "si-6", "type": "textbox" },
                        { "id": 22037446, "nama": "s-6", "type": "textbox" },
                        { "id": 22037447, "nama": "m-6", "type": "textbox" },
                        { "id": 22037448, "nama": "p-7", "type": "textbox" },
                        { "id": 22037449, "nama": "si-7", "type": "textbox" },
                        { "id": 22037450, "nama": "s-7", "type": "textbox" },
                        { "id": 22037451, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037452, "nama": "Obat-5",
                    "detail": [
                        { "id": 22037453, "nama": "p-1", "type": "textbox" },
                        { "id": 22037454, "nama": "si-1", "type": "textbox" },
                        { "id": 22037455, "nama": "s-1", "type": "textbox" },
                        { "id": 22037456, "nama": "m-1", "type": "textbox" },
                        { "id": 22037457, "nama": "p-2", "type": "textbox" },
                        { "id": 22037458, "nama": "si-2", "type": "textbox" },
                        { "id": 22037459, "nama": "s-2", "type": "textbox" },
                        { "id": 22037460, "nama": "m-2", "type": "textbox" },
                        { "id": 22037461, "nama": "p-3", "type": "textbox" },
                        { "id": 22037462, "nama": "si-3", "type": "textbox" },
                        { "id": 22037463, "nama": "s-3", "type": "textbox" },
                        { "id": 22037464, "nama": "m-3", "type": "textbox" },
                        { "id": 22037465, "nama": "p-4", "type": "textbox" },
                        { "id": 22037466, "nama": "si-4", "type": "textbox" },
                        { "id": 22037467, "nama": "s-4", "type": "textbox" },
                        { "id": 22037468, "nama": "m-4", "type": "textbox" },
                        { "id": 22037469, "nama": "p-5", "type": "textbox" },
                        { "id": 22037470, "nama": "si-5", "type": "textbox" },
                        { "id": 22037471, "nama": "s-5", "type": "textbox" },
                        { "id": 22037472, "nama": "m-5", "type": "textbox" },
                        { "id": 22037473, "nama": "p-6", "type": "textbox" },
                        { "id": 22037474, "nama": "si-6", "type": "textbox" },
                        { "id": 22037475, "nama": "s-6", "type": "textbox" },
                        { "id": 22037476, "nama": "m-6", "type": "textbox" },
                        { "id": 22037477, "nama": "p-7", "type": "textbox" },
                        { "id": 22037478, "nama": "si-7", "type": "textbox" },
                        { "id": 22037479, "nama": "s-7", "type": "textbox" },
                        { "id": 22037480, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037481, "nama": "Obat-6",
                    "detail": [
                        { "id": 22037482, "nama": "p-1", "type": "textbox" },
                        { "id": 22037483, "nama": "si-1", "type": "textbox" },
                        { "id": 22037484, "nama": "s-1", "type": "textbox" },
                        { "id": 22037485, "nama": "m-1", "type": "textbox" },
                        { "id": 22037486, "nama": "p-2", "type": "textbox" },
                        { "id": 22037487, "nama": "si-2", "type": "textbox" },
                        { "id": 22037488, "nama": "s-2", "type": "textbox" },
                        { "id": 22037489, "nama": "m-2", "type": "textbox" },
                        { "id": 22037490, "nama": "p-3", "type": "textbox" },
                        { "id": 22037491, "nama": "si-3", "type": "textbox" },
                        { "id": 22037492, "nama": "s-3", "type": "textbox" },
                        { "id": 22037493, "nama": "m-3", "type": "textbox" },
                        { "id": 22037494, "nama": "p-4", "type": "textbox" },
                        { "id": 22037495, "nama": "si-4", "type": "textbox" },
                        { "id": 22037496, "nama": "s-4", "type": "textbox" },
                        { "id": 22037497, "nama": "m-4", "type": "textbox" },
                        { "id": 22037498, "nama": "p-5", "type": "textbox" },
                        { "id": 22037499, "nama": "si-5", "type": "textbox" },
                        { "id": 22037500, "nama": "s-5", "type": "textbox" },
                        { "id": 22037501, "nama": "m-5", "type": "textbox" },
                        { "id": 22037502, "nama": "p-6", "type": "textbox" },
                        { "id": 22037503, "nama": "si-6", "type": "textbox" },
                        { "id": 22037504, "nama": "s-6", "type": "textbox" },
                        { "id": 22037505, "nama": "m-6", "type": "textbox" },
                        { "id": 22037506, "nama": "p-7", "type": "textbox" },
                        { "id": 22037507, "nama": "si-7", "type": "textbox" },
                        { "id": 22037508, "nama": "s-7", "type": "textbox" },
                        { "id": 22037509, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037510, "nama": "Obat-7",
                    "detail": [
                        { "id": 22037511, "nama": "p-1", "type": "textbox" },
                        { "id": 22037512, "nama": "si-1", "type": "textbox" },
                        { "id": 22037513, "nama": "s-1", "type": "textbox" },
                        { "id": 22037514, "nama": "m-1", "type": "textbox" },
                        { "id": 22037515, "nama": "p-2", "type": "textbox" },
                        { "id": 22037516, "nama": "si-2", "type": "textbox" },
                        { "id": 22037517, "nama": "s-2", "type": "textbox" },
                        { "id": 22037518, "nama": "m-2", "type": "textbox" },
                        { "id": 22037519, "nama": "p-3", "type": "textbox" },
                        { "id": 22037520, "nama": "si-3", "type": "textbox" },
                        { "id": 22037521, "nama": "s-3", "type": "textbox" },
                        { "id": 22037522, "nama": "m-3", "type": "textbox" },
                        { "id": 22037523, "nama": "p-4", "type": "textbox" },
                        { "id": 22037524, "nama": "si-4", "type": "textbox" },
                        { "id": 22037525, "nama": "s-4", "type": "textbox" },
                        { "id": 22037526, "nama": "m-4", "type": "textbox" },
                        { "id": 22037527, "nama": "p-5", "type": "textbox" },
                        { "id": 22037528, "nama": "si-5", "type": "textbox" },
                        { "id": 22037529, "nama": "s-5", "type": "textbox" },
                        { "id": 22037530, "nama": "m-5", "type": "textbox" },
                        { "id": 22037531, "nama": "p-6", "type": "textbox" },
                        { "id": 22037532, "nama": "si-6", "type": "textbox" },
                        { "id": 22037533, "nama": "s-6", "type": "textbox" },
                        { "id": 22037534, "nama": "m-6", "type": "textbox" },
                        { "id": 22037535, "nama": "p-7", "type": "textbox" },
                        { "id": 22037536, "nama": "si-7", "type": "textbox" },
                        { "id": 22037537, "nama": "s-7", "type": "textbox" },
                        { "id": 22037538, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037539, "nama": "Obat-8",
                    "detail": [
                        { "id": 22037540, "nama": "p-1", "type": "textbox" },
                        { "id": 22037541, "nama": "si-1", "type": "textbox" },
                        { "id": 22037542, "nama": "s-1", "type": "textbox" },
                        { "id": 22037543, "nama": "m-1", "type": "textbox" },
                        { "id": 22037544, "nama": "p-2", "type": "textbox" },
                        { "id": 22037545, "nama": "si-2", "type": "textbox" },
                        { "id": 22037546, "nama": "s-2", "type": "textbox" },
                        { "id": 22037547, "nama": "m-2", "type": "textbox" },
                        { "id": 22037548, "nama": "p-3", "type": "textbox" },
                        { "id": 22037549, "nama": "si-3", "type": "textbox" },
                        { "id": 22037550, "nama": "s-3", "type": "textbox" },
                        { "id": 22037551, "nama": "m-3", "type": "textbox" },
                        { "id": 22037552, "nama": "p-4", "type": "textbox" },
                        { "id": 22037553, "nama": "si-4", "type": "textbox" },
                        { "id": 22037554, "nama": "s-4", "type": "textbox" },
                        { "id": 22037555, "nama": "m-4", "type": "textbox" },
                        { "id": 22037556, "nama": "p-5", "type": "textbox" },
                        { "id": 22037557, "nama": "si-5", "type": "textbox" },
                        { "id": 22037558, "nama": "s-5", "type": "textbox" },
                        { "id": 22037559, "nama": "m-5", "type": "textbox" },
                        { "id": 22037560, "nama": "p-6", "type": "textbox" },
                        { "id": 22037561, "nama": "si-6", "type": "textbox" },
                        { "id": 22037562, "nama": "s-6", "type": "textbox" },
                        { "id": 22037563, "nama": "m-6", "type": "textbox" },
                        { "id": 22037564, "nama": "p-7", "type": "textbox" },
                        { "id": 22037565, "nama": "si-7", "type": "textbox" },
                        { "id": 22037566, "nama": "s-7", "type": "textbox" },
                        { "id": 22037567, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037568, "nama": "Obat-9",
                    "detail": [
                        { "id": 22037569, "nama": "p-1", "type": "textbox" },
                        { "id": 22037570, "nama": "si-1", "type": "textbox" },
                        { "id": 22037571, "nama": "s-1", "type": "textbox" },
                        { "id": 22037572, "nama": "m-1", "type": "textbox" },
                        { "id": 22037573, "nama": "p-2", "type": "textbox" },
                        { "id": 22037574, "nama": "si-2", "type": "textbox" },
                        { "id": 22037575, "nama": "s-2", "type": "textbox" },
                        { "id": 22037576, "nama": "m-2", "type": "textbox" },
                        { "id": 22037577, "nama": "p-3", "type": "textbox" },
                        { "id": 22037578, "nama": "si-3", "type": "textbox" },
                        { "id": 22037579, "nama": "s-3", "type": "textbox" },
                        { "id": 22037580, "nama": "m-3", "type": "textbox" },
                        { "id": 22037581, "nama": "p-4", "type": "textbox" },
                        { "id": 22037582, "nama": "si-4", "type": "textbox" },
                        { "id": 22037583, "nama": "s-4", "type": "textbox" },
                        { "id": 22037584, "nama": "m-4", "type": "textbox" },
                        { "id": 22037585, "nama": "p-5", "type": "textbox" },
                        { "id": 22037586, "nama": "si-5", "type": "textbox" },
                        { "id": 22037587, "nama": "s-5", "type": "textbox" },
                        { "id": 22037588, "nama": "m-5", "type": "textbox" },
                        { "id": 22037589, "nama": "p-6", "type": "textbox" },
                        { "id": 22037590, "nama": "si-6", "type": "textbox" },
                        { "id": 22037591, "nama": "s-6", "type": "textbox" },
                        { "id": 22037592, "nama": "m-6", "type": "textbox" },
                        { "id": 22037593, "nama": "p-7", "type": "textbox" },
                        { "id": 22037594, "nama": "si-7", "type": "textbox" },
                        { "id": 22037595, "nama": "s-7", "type": "textbox" },
                        { "id": 22037596, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037597, "nama": "Obat-10",
                    "detail": [
                        { "id": 22037598, "nama": "p-1", "type": "textbox" },
                        { "id": 22037599, "nama": "si-1", "type": "textbox" },
                        { "id": 22037600, "nama": "s-1", "type": "textbox" },
                        { "id": 22037601, "nama": "m-1", "type": "textbox" },
                        { "id": 22037602, "nama": "p-2", "type": "textbox" },
                        { "id": 22037603, "nama": "si-2", "type": "textbox" },
                        { "id": 22037604, "nama": "s-2", "type": "textbox" },
                        { "id": 22037605, "nama": "m-2", "type": "textbox" },
                        { "id": 22037606, "nama": "p-3", "type": "textbox" },
                        { "id": 22037607, "nama": "si-3", "type": "textbox" },
                        { "id": 22037608, "nama": "s-3", "type": "textbox" },
                        { "id": 22037609, "nama": "m-3", "type": "textbox" },
                        { "id": 22037610, "nama": "p-4", "type": "textbox" },
                        { "id": 22037611, "nama": "si-4", "type": "textbox" },
                        { "id": 22037612, "nama": "s-4", "type": "textbox" },
                        { "id": 22037613, "nama": "m-4", "type": "textbox" },
                        { "id": 22037614, "nama": "p-5", "type": "textbox" },
                        { "id": 22037615, "nama": "si-5", "type": "textbox" },
                        { "id": 22037616, "nama": "s-5", "type": "textbox" },
                        { "id": 22037617, "nama": "m-5", "type": "textbox" },
                        { "id": 22037618, "nama": "p-6", "type": "textbox" },
                        { "id": 22037619, "nama": "si-6", "type": "textbox" },
                        { "id": 22037620, "nama": "s-6", "type": "textbox" },
                        { "id": 22037621, "nama": "m-6", "type": "textbox" },
                        { "id": 22037622, "nama": "p-7", "type": "textbox" },
                        { "id": 22037623, "nama": "si-7", "type": "textbox" },
                        { "id": 22037624, "nama": "s-7", "type": "textbox" },
                        { "id": 22037625, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037626, "nama": "Obat-11",
                    "detail": [
                        { "id": 22037627, "nama": "p-1", "type": "textbox" },
                        { "id": 22037628, "nama": "si-1", "type": "textbox" },
                        { "id": 22037629, "nama": "s-1", "type": "textbox" },
                        { "id": 22037630, "nama": "m-1", "type": "textbox" },
                        { "id": 22037631, "nama": "p-2", "type": "textbox" },
                        { "id": 22037632, "nama": "si-2", "type": "textbox" },
                        { "id": 22037633, "nama": "s-2", "type": "textbox" },
                        { "id": 22037634, "nama": "m-2", "type": "textbox" },
                        { "id": 22037635, "nama": "p-3", "type": "textbox" },
                        { "id": 22037636, "nama": "si-3", "type": "textbox" },
                        { "id": 22037637, "nama": "s-3", "type": "textbox" },
                        { "id": 22037638, "nama": "m-3", "type": "textbox" },
                        { "id": 22037639, "nama": "p-4", "type": "textbox" },
                        { "id": 22037640, "nama": "si-4", "type": "textbox" },
                        { "id": 22037641, "nama": "s-4", "type": "textbox" },
                        { "id": 22037642, "nama": "m-4", "type": "textbox" },
                        { "id": 22037643, "nama": "p-5", "type": "textbox" },
                        { "id": 22037644, "nama": "si-5", "type": "textbox" },
                        { "id": 22037645, "nama": "s-5", "type": "textbox" },
                        { "id": 22037646, "nama": "m-5", "type": "textbox" },
                        { "id": 22037647, "nama": "p-6", "type": "textbox" },
                        { "id": 22037648, "nama": "si-6", "type": "textbox" },
                        { "id": 22037649, "nama": "s-6", "type": "textbox" },
                        { "id": 22037650, "nama": "m-6", "type": "textbox" },
                        { "id": 22037651, "nama": "p-7", "type": "textbox" },
                        { "id": 22037652, "nama": "si-7", "type": "textbox" },
                        { "id": 22037653, "nama": "s-7", "type": "textbox" },
                        { "id": 22037654, "nama": "m-7", "type": "textbox" },
                    ]
                },
                {
                    "id": 22037655, "nama": "Obat-12",
                    "detail": [
                        { "id": 22037656, "nama": "p-1", "type": "textbox" },
                        { "id": 22037657, "nama": "si-1", "type": "textbox" },
                        { "id": 22037658, "nama": "s-1", "type": "textbox" },
                        { "id": 22037659, "nama": "m-1", "type": "textbox" },
                        { "id": 22037660, "nama": "p-2", "type": "textbox" },
                        { "id": 22037661, "nama": "si-2", "type": "textbox" },
                        { "id": 22037662, "nama": "s-2", "type": "textbox" },
                        { "id": 22037663, "nama": "m-2", "type": "textbox" },
                        { "id": 22037664, "nama": "p-3", "type": "textbox" },
                        { "id": 22037665, "nama": "si-3", "type": "textbox" },
                        { "id": 22037666, "nama": "s-3", "type": "textbox" },
                        { "id": 22037667, "nama": "m-3", "type": "textbox" },
                        { "id": 22037668, "nama": "p-4", "type": "textbox" },
                        { "id": 22037669, "nama": "si-4", "type": "textbox" },
                        { "id": 22037670, "nama": "s-4", "type": "textbox" },
                        { "id": 22037671, "nama": "m-4", "type": "textbox" },
                        { "id": 22037672, "nama": "p-5", "type": "textbox" },
                        { "id": 22037673, "nama": "si-5", "type": "textbox" },
                        { "id": 22037674, "nama": "s-5", "type": "textbox" },
                        { "id": 22037675, "nama": "m-5", "type": "textbox" },
                        { "id": 22037676, "nama": "p-6", "type": "textbox" },
                        { "id": 22037677, "nama": "si-6", "type": "textbox" },
                        { "id": 22037678, "nama": "s-6", "type": "textbox" },
                        { "id": 22037679, "nama": "m-6", "type": "textbox" },
                        { "id": 22037680, "nama": "p-7", "type": "textbox" },
                        { "id": 22037681, "nama": "si-7", "type": "textbox" },
                        { "id": 22037682, "nama": "s-7", "type": "textbox" },
                        { "id": 22037683, "nama": "m-7", "type": "textbox" },
                    ]
                }
            ]
            $scope.listSuhu = [
                { "id": 22037252, "nama": "p-1", "type": "textbox" },
                { "id": 22037253, "nama": "si-1", "type": "textbox" },
                { "id": 22037254, "nama": "s-1", "type": "textbox" },
                { "id": 22037255, "nama": "m-1", "type": "textbox" },
                { "id": 22037256, "nama": "p-2", "type": "textbox" },
                { "id": 22037257, "nama": "si-2", "type": "textbox" },
                { "id": 22037258, "nama": "s-2", "type": "textbox" },
                { "id": 22037259, "nama": "m-2", "type": "textbox" },
                { "id": 22037260, "nama": "p-3", "type": "textbox" },
                { "id": 22037261, "nama": "si-3", "type": "textbox" },
                { "id": 22037262, "nama": "s-3", "type": "textbox" },
                { "id": 22037263, "nama": "m-3", "type": "textbox" },
                { "id": 22037264, "nama": "p-4", "type": "textbox" },
                { "id": 22037265, "nama": "si-4", "type": "textbox" },
                { "id": 22037266, "nama": "s-4", "type": "textbox" },
                { "id": 22037267, "nama": "m-4", "type": "textbox" },
                { "id": 22037268, "nama": "p-5", "type": "textbox" },
                { "id": 22037269, "nama": "si-5", "type": "textbox" },
                { "id": 22037270, "nama": "s-5", "type": "textbox" },
                { "id": 22037271, "nama": "m-5", "type": "textbox" },
                { "id": 22037272, "nama": "p-6", "type": "textbox" },
                { "id": 22037273, "nama": "si-6", "type": "textbox" },
                { "id": 22037274, "nama": "s-6", "type": "textbox" },
                { "id": 22037275, "nama": "m-6", "type": "textbox" },
                { "id": 22037276, "nama": "p-7", "type": "textbox" },
                { "id": 22037277, "nama": "si-7", "type": "textbox" },
                { "id": 22037278, "nama": "s-7", "type": "textbox" },
                { "id": 22037279, "nama": "m-7", "type": "textbox" },
            ]
            $scope.listNadi = [
                { "id": 22037280, "nama": "p-1", "type": "textbox" },
                { "id": 22037281, "nama": "si-1", "type": "textbox" },
                { "id": 22037282, "nama": "s-1", "type": "textbox" },
                { "id": 22037283, "nama": "m-1", "type": "textbox" },
                { "id": 22037284, "nama": "p-2", "type": "textbox" },
                { "id": 22037285, "nama": "si-2", "type": "textbox" },
                { "id": 22037286, "nama": "s-2", "type": "textbox" },
                { "id": 22037287, "nama": "m-2", "type": "textbox" },
                { "id": 22037288, "nama": "p-3", "type": "textbox" },
                { "id": 22037289, "nama": "si-3", "type": "textbox" },
                { "id": 22037290, "nama": "s-3", "type": "textbox" },
                { "id": 22037291, "nama": "m-3", "type": "textbox" },
                { "id": 22037292, "nama": "p-4", "type": "textbox" },
                { "id": 22037293, "nama": "si-4", "type": "textbox" },
                { "id": 22037294, "nama": "s-4", "type": "textbox" },
                { "id": 22037295, "nama": "m-4", "type": "textbox" },
                { "id": 22037296, "nama": "p-5", "type": "textbox" },
                { "id": 22037297, "nama": "si-5", "type": "textbox" },
                { "id": 22037298, "nama": "s-5", "type": "textbox" },
                { "id": 22037299, "nama": "m-5", "type": "textbox" },
                { "id": 22037300, "nama": "p-6", "type": "textbox" },
                { "id": 22037301, "nama": "si-6", "type": "textbox" },
                { "id": 22037302, "nama": "s-6", "type": "textbox" },
                { "id": 22037303, "nama": "m-6", "type": "textbox" },
                { "id": 22037304, "nama": "p-7", "type": "textbox" },
                { "id": 22037305, "nama": "si-7", "type": "textbox" },
                { "id": 22037306, "nama": "s-7", "type": "textbox" },
                { "id": 22037307, "nama": "m-7", "type": "textbox" },
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
                    'Catatan Perinatologi 4' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
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