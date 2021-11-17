define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('CatatanPemakaianCairanInfusCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
            $scope.cc = {}
            var nomorEMR = '-'
            var emrfk_ = 210061
            $scope.cc.emrfk = emrfk_
            var dataLoad = []
             $scope.isCetak = true
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
            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }
            $scope.cetakPdf = function () {
                if (norecEMR == '') return
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-cppt&id=' + $scope.cc.nocm + '&emr=' + norecEMR + '&view=true', function (response) {
                    // do something with response
                });
            }
             $scope.listDaily = [
                {
                    "id": 1, "nama": "Alergi",
                    "detail": [
                        { "id": 21023118, "nama": "Tidak Ada", "type": "checkbox" },
                        { "id": 21023119, "nama": "Ada, yaitu : ", "type": "checkbox" },
                        { "id": 21023120, "nama": "", "type": "textbox" },
                    ]
                },
                
            ]
            medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
             })
            medifirstService.getPart('emr/get-datacombo-part-dokter', true, true, 20).then(function (data) {
                $scope.listDokter = data

             })
            medifirstService.getPart('emr/get-datacombo-part-ruangan-pelayanan', true, true, 20).then(function (data) {
                $scope.listRuang = data
            
             })
  
           medifirstService.getPart('emr/get-datacombo-part-diagnosa', true, true, 20).then(function (data) {
                $scope.listDiagnosa = data
            
             })  
            medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-cppt", true, true, 20).then(function (data) {
                    $scope.listJenisPegawai = data;
            });
            

            $scope.listCatatanPemakaianCairanInfus1 = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21007373, "nama": "", "type": "datetime" },
                        { "id": 21007374, "nama": "", "type": "textarea" },
                        { "id": 21007375, "nama": "Ke - 1", "type": "label" },
                        { "id": 21007376, "nama": "", "type": "textbox" },
                        { "id": 21007377, "nama": "", "type": "time" },
                        { "id": 21007378, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008829, "nama": "", "type": "datetime" },
                        { "id": 21008830, "nama": "", "type": "textarea" },
                        { "id": 21007379, "nama": "Ke - 2", "type": "label" },
                        { "id": 21007380, "nama": "", "type": "textbox" },
                        { "id": 21007381, "nama": "", "type": "time" },
                        { "id": 21007382, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008831, "nama": "", "type": "datetime" },
                        { "id": 21008832, "nama": "", "type": "textarea" },
                        { "id": 21007383, "nama": "Ke - 3", "type": "label" },
                        { "id": 21007384, "nama": "", "type": "textbox" },
                        { "id": 21007385, "nama": "", "type": "time" },
                        { "id": 21007386, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008833, "nama": "", "type": "datetime" },
                        { "id": 21008834, "nama": "", "type": "textarea" },
                        { "id": 21007387, "nama": "Ke - 4", "type": "label" },
                        { "id": 21007388, "nama": "", "type": "textbox" },
                        { "id": 21007389, "nama": "", "type": "time" },
                        { "id": 21007390, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008835, "nama": "", "type": "datetime" },
                        { "id": 21008836, "nama": "", "type": "textarea" },
                        { "id": 21007391, "nama": "Ke - 5", "type": "label" },
                        { "id": 21007392, "nama": "", "type": "textbox" },
                        { "id": 21007393, "nama": "", "type": "time" },
                        { "id": 21007394, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008837, "nama": "", "type": "datetime" },
                        { "id": 21008838, "nama": "", "type": "textarea" },
                        { "id": 21007395, "nama": "Ke - 6", "type": "label" },
                        { "id": 21007396, "nama": "", "type": "textbox" },
                        { "id": 21007397, "nama": "", "type": "time" },
                        { "id": 21007398, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008839, "nama": "", "type": "datetime" },
                        { "id": 21008840, "nama": "", "type": "textarea" },
                        { "id": 21007399, "nama": "Ke - 7", "type": "label" },
                        { "id": 21007400, "nama": "", "type": "textbox" },
                        { "id": 21007401, "nama": "", "type": "time" },
                        { "id": 21007402, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008841, "nama": "", "type": "datetime" },
                        { "id": 21008842, "nama": "", "type": "textarea" },
                        { "id": 21007403, "nama": "Ke - 8", "type": "label" },
                        { "id": 21007404, "nama": "", "type": "textbox" },
                        { "id": 21007405, "nama": "", "type": "time" },
                        { "id": 21007406, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008843, "nama": "", "type": "datetime" },
                        { "id": 21008844, "nama": "", "type": "textarea" },
                        { "id": 21007407, "nama": "Ke - 9", "type": "label" },
                        { "id": 21007408, "nama": "", "type": "textbox" },
                        { "id": 21007409, "nama": "", "type": "time" },
                        { "id": 21007410, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008845, "nama": "", "type": "datetime" },
                        { "id": 21008846, "nama": "", "type": "textarea" },
                        { "id": 21007411, "nama": "Ke - 10", "type": "label" },
                        { "id": 21007412, "nama": "", "type": "textbox" },
                        { "id": 21007413, "nama": "", "type": "time" },
                        { "id": 21007414, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008847, "nama": "", "type": "datetime" },
                        { "id": 21008848, "nama": "", "type": "textarea" },
                        { "id": 21007415, "nama": "Ke - 11", "type": "label" },
                        { "id": 21007416, "nama": "", "type": "textbox" },
                        { "id": 21007417, "nama": "", "type": "time" },
                        { "id": 21007418, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008849, "nama": "", "type": "datetime" },
                        { "id": 21008850, "nama": "", "type": "textarea" },
                        { "id": 21007419, "nama": "Ke - 12", "type": "label" },
                        { "id": 21007420, "nama": "", "type": "textbox" },
                        { "id": 21007421, "nama": "", "type": "time" },
                        { "id": 21007422, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008851, "nama": "", "type": "datetime" },
                        { "id": 21008852, "nama": "", "type": "textarea" },
                        { "id": 21007423, "nama": "Ke - 13", "type": "label" },
                        { "id": 21007424, "nama": "", "type": "textbox" },
                        { "id": 21007425, "nama": "", "type": "time" },
                        { "id": 21007426, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008853, "nama": "", "type": "datetime" },
                        { "id": 21008854, "nama": "", "type": "textarea" },
                        { "id": 21007427, "nama": "Ke - 14", "type": "label" },
                        { "id": 21007428, "nama": "", "type": "textbox" },
                        { "id": 21007429, "nama": "", "type": "time" },
                        { "id": 21007430, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008855, "nama": "", "type": "datetime" },
                        { "id": 21008856, "nama": "", "type": "textarea" },
                        { "id": 21007431, "nama": "Ke - 15", "type": "label" },
                        { "id": 21007432, "nama": "", "type": "textbox" },
                        { "id": 21007433, "nama": "", "type": "time" },
                        { "id": 21007434, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008857, "nama": "", "type": "datetime" },
                        { "id": 21008858, "nama": "", "type": "textarea" },
                        { "id": 21007435, "nama": "Ke - 16", "type": "label" },
                        { "id": 21007436, "nama": "", "type": "textbox" },
                        { "id": 21007437, "nama": "", "type": "time" },
                        { "id": 21007438, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008859, "nama": "", "type": "datetime" },
                        { "id": 21008860, "nama": "", "type": "textarea" },
                        { "id": 21007439, "nama": "Ke - 17", "type": "label" },
                        { "id": 21007440, "nama": "", "type": "textbox" },
                        { "id": 21007441, "nama": "", "type": "time" },
                        { "id": 21007442, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008861, "nama": "", "type": "datetime" },
                        { "id": 21008862, "nama": "", "type": "textarea" },
                        { "id": 21007443, "nama": "Ke - 18", "type": "label" },
                        { "id": 21007444, "nama": "", "type": "textbox" },
                        { "id": 21007445, "nama": "", "type": "time" },
                        { "id": 21007446, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008863, "nama": "", "type": "datetime" },
                        { "id": 21008864, "nama": "", "type": "textarea" },
                        { "id": 21007447, "nama": "Ke - 19", "type": "label" },
                        { "id": 21007448, "nama": "", "type": "textbox" },
                        { "id": 21007449, "nama": "", "type": "time" },
                        { "id": 21007450, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008865, "nama": "", "type": "datetime" },
                        { "id": 21008866, "nama": "", "type": "textarea" },
                        { "id": 21007451, "nama": "Ke - 20", "type": "label" },
                        { "id": 21007452, "nama": "", "type": "textbox" },
                        { "id": 21007453, "nama": "", "type": "time" },
                        { "id": 21007454, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008867, "nama": "", "type": "datetime" },
                        { "id": 21008868, "nama": "", "type": "textarea" },
                        { "id": 21007455, "nama": "Ke - 21", "type": "label" },
                        { "id": 21007456, "nama": "", "type": "textbox" },
                        { "id": 21007457, "nama": "", "type": "time" },
                        { "id": 21007458, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008869, "nama": "", "type": "datetime" },
                        { "id": 21008870, "nama": "", "type": "textarea" },
                        { "id": 21007459, "nama": "Ke - 22", "type": "label" },
                        { "id": 21007460, "nama": "", "type": "textbox" },
                        { "id": 21007461, "nama": "", "type": "time" },
                        { "id": 21007462, "nama": "", "type": "combobox" },
                    ]
                },
            // ];
            // $scope.listCatatanPemakaianCairanInfus2 = [
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21007463, "nama": "", "type": "datetime" },
                        { "id": 21007464, "nama": "", "type": "textarea" },
                        { "id": 21007465, "nama": "Ke - 23", "type": "label" },
                        { "id": 21007466, "nama": "", "type": "textbox" },
                        { "id": 21007467, "nama": "", "type": "time" },
                        { "id": 21007468, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008871, "nama": "", "type": "datetime" },
                        { "id": 21008872, "nama": "", "type": "textarea" },
                        { "id": 21007469, "nama": "Ke - 24", "type": "label" },
                        { "id": 21007470, "nama": "", "type": "textbox" },
                        { "id": 21007471, "nama": "", "type": "time" },
                        { "id": 21007472, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008873, "nama": "", "type": "datetime" },
                        { "id": 21008874, "nama": "", "type": "textarea" },
                        { "id": 21007473, "nama": "Ke - 25", "type": "label" },
                        { "id": 21007474, "nama": "", "type": "textbox" },
                        { "id": 21007475, "nama": "", "type": "time" },
                        { "id": 21007476, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008875, "nama": "", "type": "datetime" },
                        { "id": 21008876, "nama": "", "type": "textarea" },
                        { "id": 21007477, "nama": "Ke - 26", "type": "label" },
                        { "id": 21007478, "nama": "", "type": "textbox" },
                        { "id": 21007479, "nama": "", "type": "time" },
                        { "id": 21007480, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008877, "nama": "", "type": "datetime" },
                        { "id": 21008878, "nama": "", "type": "textarea" },
                        { "id": 21007481, "nama": "Ke - 27", "type": "label" },
                        { "id": 21007482, "nama": "", "type": "textbox" },
                        { "id": 21007483, "nama": "", "type": "time" },
                        { "id": 21007484, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008879, "nama": "", "type": "datetime" },
                        { "id": 21008880, "nama": "", "type": "textarea" },
                        { "id": 21007485, "nama": "Ke - 28", "type": "label" },
                        { "id": 21007486, "nama": "", "type": "textbox" },
                        { "id": 21007487, "nama": "", "type": "time" },
                        { "id": 21007488, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008881, "nama": "", "type": "datetime" },
                        { "id": 21008882, "nama": "", "type": "textarea" },
                        { "id": 21007489, "nama": "Ke - 29", "type": "label" },
                        { "id": 21007490, "nama": "", "type": "textbox" },
                        { "id": 21007491, "nama": "", "type": "time" },
                        { "id": 21007492, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008883, "nama": "", "type": "datetime" },
                        { "id": 21008884, "nama": "", "type": "textarea" },
                        { "id": 21007493, "nama": "Ke - 30", "type": "label" },
                        { "id": 21007494, "nama": "", "type": "textbox" },
                        { "id": 21007495, "nama": "", "type": "time" },
                        { "id": 21007496, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008885, "nama": "", "type": "datetime" },
                        { "id": 21008886, "nama": "", "type": "textarea" },
                        { "id": 21007497, "nama": "Ke - 31", "type": "label" },
                        { "id": 21007498, "nama": "", "type": "textbox" },
                        { "id": 21007499, "nama": "", "type": "time" },
                        { "id": 21007500, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008887, "nama": "", "type": "datetime" },
                        { "id": 21008888, "nama": "", "type": "textarea" },
                        { "id": 21007501, "nama": "Ke - 32", "type": "label" },
                        { "id": 21007502, "nama": "", "type": "textbox" },
                        { "id": 21007503, "nama": "", "type": "time" },
                        { "id": 21007504, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008889, "nama": "", "type": "datetime" },
                        { "id": 21008890, "nama": "", "type": "textarea" },
                        { "id": 21007505, "nama": "Ke - 33", "type": "label" },
                        { "id": 21007506, "nama": "", "type": "textbox" },
                        { "id": 21007507, "nama": "", "type": "time" },
                        { "id": 21007508, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008891, "nama": "", "type": "datetime" },
                        { "id": 21008892, "nama": "", "type": "textarea" },
                        { "id": 21007509, "nama": "Ke - 34", "type": "label" },
                        { "id": 21007510, "nama": "", "type": "textbox" },
                        { "id": 21007511, "nama": "", "type": "time" },
                        { "id": 21007512, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008893, "nama": "", "type": "datetime" },
                        { "id": 21008894, "nama": "", "type": "textarea" },
                        { "id": 21007513, "nama": "Ke - 35", "type": "label" },
                        { "id": 21007514, "nama": "", "type": "textbox" },
                        { "id": 21007515, "nama": "", "type": "time" },
                        { "id": 21007516, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008895, "nama": "", "type": "datetime" },
                        { "id": 21008896, "nama": "", "type": "textarea" },
                        { "id": 21007517, "nama": "Ke - 36", "type": "label" },
                        { "id": 21007518, "nama": "", "type": "textbox" },
                        { "id": 21007519, "nama": "", "type": "time" },
                        { "id": 21007520, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008897, "nama": "", "type": "datetime" },
                        { "id": 21008898, "nama": "", "type": "textarea" },
                        { "id": 21007521, "nama": "Ke - 37", "type": "label" },
                        { "id": 21007522, "nama": "", "type": "textbox" },
                        { "id": 21007523, "nama": "", "type": "time" },
                        { "id": 21007524, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008899, "nama": "", "type": "datetime" },
                        { "id": 21008900, "nama": "", "type": "textarea" },
                        { "id": 21007525, "nama": "Ke - 38", "type": "label" },
                        { "id": 21007526, "nama": "", "type": "textbox" },
                        { "id": 21007527, "nama": "", "type": "time" },
                        { "id": 21007528, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008901, "nama": "", "type": "datetime" },
                        { "id": 21008902, "nama": "", "type": "textarea" },
                        { "id": 21007529, "nama": "Ke - 39", "type": "label" },
                        { "id": 21007530, "nama": "", "type": "textbox" },
                        { "id": 21007531, "nama": "", "type": "time" },
                        { "id": 21007532, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008903, "nama": "", "type": "datetime" },
                        { "id": 21008904, "nama": "", "type": "textarea" },
                        { "id": 21007533, "nama": "Ke - 40", "type": "label" },
                        { "id": 21007534, "nama": "", "type": "textbox" },
                        { "id": 21007535, "nama": "", "type": "time" },
                        { "id": 21007536, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008905, "nama": "", "type": "datetime" },
                        { "id": 21008906, "nama": "", "type": "textarea" },
                        { "id": 21007537, "nama": "Ke - 41", "type": "label" },
                        { "id": 21007538, "nama": "", "type": "textbox" },
                        { "id": 21007539, "nama": "", "type": "time" },
                        { "id": 21007540, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008907, "nama": "", "type": "datetime" },
                        { "id": 21008908, "nama": "", "type": "textarea" },
                        { "id": 21007541, "nama": "Ke - 42", "type": "label" },
                        { "id": 21007542, "nama": "", "type": "textbox" },
                        { "id": 21007543, "nama": "", "type": "time" },
                        { "id": 21007544, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008909, "nama": "", "type": "datetime" },
                        { "id": 21008910, "nama": "", "type": "textarea" },
                        { "id": 21007545, "nama": "Ke - 43", "type": "label" },
                        { "id": 21007546, "nama": "", "type": "textbox" },
                        { "id": 21007547, "nama": "", "type": "time" },
                        { "id": 21007548, "nama": "", "type": "combobox" },
                    ]
                },
                {
                    "id": 1, "nama": "",
                    "detail": [
                        { "id": 21008911, "nama": "", "type": "datetime" },
                        { "id": 21008912, "nama": "", "type": "textarea" },
                        { "id": 21007549, "nama": "Ke - 44", "type": "label" },
                        { "id": 21007550, "nama": "", "type": "textbox" },
                        { "id": 21007551, "nama": "", "type": "time" },
                        { "id": 21007552, "nama": "", "type": "combobox" },
                    ]
                },
            ];
    

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
                $scope.cc.dokterdpjp = chacePeriode[16]
                $scope.cc.iddpjp = chacePeriode[17]
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
           
                // console.log(dataLoad)
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
                        if (dataLoad[i].type == "datetime2") {
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
                        if (dataLoad[i].type == "checkboxtextarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                            $scope.item.obj2[dataLoad[i].emrdfk] = true
                        }
                        if (dataLoad[i].type == "textarea") {
                            $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                        }
                        if (dataLoad[i].type == "combobox2") {
                            var str = dataLoad[i].value
                            if(str != undefined){
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
                            }   
                            // var res = str.split("~");
                            // // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            // $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }
                        if (dataLoad[i].type == "combobox") {
                            var str = dataLoad[i].value
                            if(str != undefined){
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
                            }   
                            // var res = str.split("~");
                            // // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                            // $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }

                        }
                   
                        if (dataLoad[i].type == "combobox3") {
                            var str = dataLoad[i].value
                            if(str != undefined){
                                var res = str.split("~");
                                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                                $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }        
                            }   
                          

                        }

                    }

                }
            })
           
            

            $scope.Batal =function(){
                $scope.item.obj=[]
            }
            $scope.kembali = function () {
                $rootScope.showRiwayat()
            }

            $scope.Save = function () {

                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
                        $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('YYYY-MM-DD HH:mm')
                     // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'asesmen'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {

                    // $rootScope.loadRiwayat()
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'CatatanPemakaianCairanInfusCtrl' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                      $scope.cc.norec_emr = e.data.data.noemr
                 
                });
            }

        }
    ]);
});