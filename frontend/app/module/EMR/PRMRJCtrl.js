define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PRMRJCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService','$mdDialog', 'isPopupPRMRJ',
        function ($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, $mdDialog, isPopupPRMRJ) {


            $scope.noCM = $state.params.noCM;
            $scope.tombolSimpanVis = true
            $scope.noRecPap = cacheHelper.get('noRecPap');
            $scope.isPopupPRMRJ = isPopupPRMRJ || false;
            $scope.totalSkor = 0
            $scope.totalSkor2 = 0
               // Inisialisasi $scope.item agar tidak undefined saat dipakai sebagai dialog popup
            $scope.item = $scope.item || { obj: [], obj2: [], riwPRMRJ: [] };
            $scope.item.riwPRMRJ = $scope.item.riwPRMRJ || [];
            $scope.cc = {}
            var nomorEMR = '-'
            var emrfk_ = 210051
            $scope.cc.emrfk = emrfk_
            var dataLoad = []
             $scope.isCetak = true
            var norecEMR = ''

            // Tab state
            $scope.prmrjTab = 'input';
            $scope.selectedRiwayatPRMRJ = null;

            // Mapping 20 baris tabel PRMRJ (dateId, diagId, tindId, dpjpId)
            // Baris 1: 21023359, 21023361, 21023363, 21023365
            // Baris k: dateId = 21023359 + 7*(k-1), diagId = 21023361 + 7*(k-1), dst
            $scope.prmrjRiwayatRows = [];
            for (var _r = 0; _r < 20; _r++) {
                $scope.prmrjRiwayatRows.push({
                    dateId: 21023359 + 7 * _r,
                    diagId:  21023361 + 7 * _r,
                    tindId:  21023363 + 7 * _r,
                    dpjpId:  21023365 + 7 * _r
                });
            }
            var cacheNomorEMR = cacheHelper.get('cacheNomorEMR');
            var cacheNoREC = cacheHelper.get('cacheNOREC_EMR');
            if(cacheNoREC!= undefined){
                norecEMR = cacheNomorEMR[1]
            }
            if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
                $scope.tombolSimpanVis = false
            }else if (medifirstService.getKelompokUser() != 'dokter' && medifirstService.getKelompokUser() != 'suster') {
                $scope.tombolSimpanVis = false
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

                // Start of CPPT SOAP Integration
                var cpptSoapData = cacheHelper.get('cpptSoapData');
                if (cpptSoapData && cpptSoapData.length > 0) {
                    var parseSOAP = function (soapText) {
                        if (!soapText) return { s: '', o: '', a: '', p: '' };
                        var s = '';
                        var o = '';
                        var a = '';
                        var p = '';
                        var regex = /(?:^|[\r\n]+)\s*(S|O|A|P)\s*:\s*/i;
                        var parts = soapText.split(regex);
                        if (parts.length <= 1) {
                            return { s: soapText.trim(), o: '', a: '', p: '' };
                        }
                        for (var j = 1; j < parts.length; j += 2) {
                            var key = parts[j].toUpperCase();
                            var val = (parts[j+1] || '').trim();
                            if (key === 'S') s = val;
                            else if (key === 'O') o = val;
                            else if (key === 'A') a = val;
                            else if (key === 'P') p = val;
                        }
                        return { s: s, o: o, a: a, p: p };
                    };

                    var isSameDate = function (date1, date2) {
                        if (!date1 || !date2) return false;
                        var d1 = new Date(date1);
                        var d2 = new Date(date2);
                        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;
                        return d1.getFullYear() === d2.getFullYear() &&
                               d1.getMonth() === d2.getMonth() &&
                               d1.getDate() === d2.getDate() &&
                               d1.getHours() === d2.getHours() &&
                               d1.getMinutes() === d2.getMinutes();
                    };

                    var nextPrmrjRowIndex = 1;
                    cpptSoapData.forEach(function(cpptEntry) {
                        var parsed = parseSOAP(cpptEntry.soapText);
                        var diagValue = parsed.a ? "A : " + parsed.a : "";
                        
                        var tindakanParts = [];
                        if (parsed.s) tindakanParts.push("S : " + parsed.s);
                        if (parsed.o) tindakanParts.push("O : " + parsed.o);
                        if (parsed.p) tindakanParts.push("P : " + parsed.p);
                        var tindakanValue = tindakanParts.join("\n");

                        // Check if a row with the same date already exists
                        var foundRowIndex = -1;
                        for (var k = 1; k <= 20; k++) {
                            var dateId = 21023359 + 7 * (k - 1);
                            var existingDate = $scope.item.obj[dateId];
                            if (isSameDate(existingDate, cpptEntry.date)) {
                                foundRowIndex = k;
                                break;
                            }
                        }

                        if (foundRowIndex !== -1) {
                            // Row exists, fill empty fields
                            var diagId = 21023361 + 7 * (foundRowIndex - 1);
                            var tindId = 21023363 + 7 * (foundRowIndex - 1);
                            var dpjpId = 21023365 + 7 * (foundRowIndex - 1);

                            if (!$scope.item.obj[diagId] && diagValue) {
                                $scope.item.obj[diagId] = diagValue;
                            }
                            if (!$scope.item.obj[tindId] && tindakanValue) {
                                $scope.item.obj[tindId] = tindakanValue;
                            }
                            if (!$scope.item.obj[dpjpId] && cpptEntry.ppa) {
                                $scope.item.obj[dpjpId] = cpptEntry.ppa;
                            }
                        } else {
                            // Find the first empty row
                            while (nextPrmrjRowIndex <= 20) {
                                var diagId = 21023361 + 7 * (nextPrmrjRowIndex - 1);
                                var tindId = 21023363 + 7 * (nextPrmrjRowIndex - 1);
                                var dateId = 21023359 + 7 * (nextPrmrjRowIndex - 1);
                                var dpjpId = 21023365 + 7 * (nextPrmrjRowIndex - 1);

                                var existingDiag = $scope.item.obj[diagId];
                                var existingTind = $scope.item.obj[tindId];

                                if (!existingDiag && !existingTind) {
                                    $scope.item.obj[diagId] = diagValue;
                                    $scope.item.obj[tindId] = tindakanValue;
                                    if (cpptEntry.date) {
                                        $scope.item.obj[dateId] = new Date(cpptEntry.date);
                                    } else {
                                        $scope.item.obj[dateId] = new Date();
                                    }
                                    if (cpptEntry.ppa) {
                                        $scope.item.obj[dpjpId] = cpptEntry.ppa;
                                    }
                                    nextPrmrjRowIndex++;
                                    break;
                                }
                                nextPrmrjRowIndex++;
                            }
                        }
                    });
                }
                // End of CPPT SOAP Integration

                // Prefill Alergi from cacheRekamMedis
                var cacheRekamMedis = cacheHelper.get('cacheRekamMedis');
                if (cacheRekamMedis && cacheRekamMedis[40]) {
                    $scope.item.obj[21023362] = cacheRekamMedis[40];
                }
                //cache get alergi
                 if ($scope.cc.norec) {
                    medifirstService.get('emr/get-antrian-pasien-norec/' + $scope.cc.norec).then(function (e) {
                        if (e && e.data && e.data.result && e.data.result.ketalergi) {
                            $scope.item.obj[21023362] = e.data.result.ketalergi;
                        }
                    });
                }
            })
           
            
 
            $scope.Batal =function(){
                $scope.item.obj=[]
            }

            // ===== RIWAYAT PRMRJ =====

            // Kolom grid daftar riwayat
            $scope.columnGridRiwayatPRMRJ = {
                pageable: true,
                columns: [
                    {
                        field: 'tglemr',
                        title: 'Tanggal EMR',
                        width: '15%'
                    },
                    {
                        field: 'namalengkap',
                        title: 'Nama Pegawai',
                        width: '25%'
                    },
                    {
                        field: 'namaruangan',
                        title: 'Nama Ruangan',
                        width: '25%'
                    },
                    {
                        field: 'noemr',
                        title: 'No EMR',
                        width: '15%',
                        attributes: { style: 'text-align: center;' }
                    },
                    {
                        field: 'noemr',
                        title: 'Aksi',
                        width: '20%',
                        template: '<button class="k-button k-primary" style="margin:2px" ng-click="loadDetailRiwayatPRMRJ(dataItem)"><i class="fa fa-eye"></i> Lihat Detail</button>',
                        attributes: { style: 'text-align: center;' }
                    }
                ]
            };

            // Load daftar riwayat PRMRJ berdasarkan nocm, gunakan endpoint asesmen (sama seperti Riwayat Pengkajian EMR)
            $scope.loadRiwayatPRMRJ = function () {
                if (!$scope.cc.nocm) return;
                var url = 'emr/get-emr-transaksi-detail-form-new?nocm=' + encodeURIComponent($scope.cc.nocm) + '&jenisEmr=asesmen';
                medifirstService.get(url, true).then(function (e) {
                    var res = e.data ? e.data : e;
                    var rawData = (res && Array.isArray(res.data)) ? res.data : [];
                    var flattenedData = [];
                    rawData.forEach(function (parent) {
                        if (parent.details && Array.isArray(parent.details)) {
                            parent.details.forEach(function (detail) {
                                // Filter hanya emrfk PRMRJ (210051)
                                if (parseInt(detail.emrfk) === 210051) {
                                    flattenedData.push({
                                        tglemr:      parent.tglregistrasi,
                                        tglregistrasi: parent.tglregistrasi,
                                        namalengkap: parent.namaLengkap || parent.namalengkap || '-',
                                        namaruangan: parent.namaruangan || '-',
                                        noemr:       parent.noemr || parent.norec,   // No EMR (angka) untuk detail
                                        norec:       parent.norec,                    // UUID
                                        norec_apd:   parent.norec_apd,
                                        norec_pd:    parent.norec_pd,
                                        nocm:        parent.nocm,
                                        noregistrasi: parent.noregistrasi,
                                        emrfk:       detail.emrfk
                                    });
                                }
                            });
                        }
                    });
                    $scope.dataGridRiwayatPRMRJ = new kendo.data.DataSource({
                        data: flattenedData,
                        pageSize: 10
                    });
                    if (flattenedData.length === 0) {
                        toastr.info('Belum ada riwayat PRMRJ untuk pasien ini');
                    }
                }, function () {
                    toastr.error('Gagal memuat riwayat PRMRJ');
                });
            };

            // Load detail satu record PRMRJ ke dalam $scope.item.riwPRMRJ
            $scope.loadDetailRiwayatPRMRJ = function (dataItem) {
                // Gunakan noemr (angka/string EMR number), fallback ke norec (UUID)
                var noemr = dataItem.noemr || dataItem.norec;
                $scope.selectedRiwayatPRMRJ = dataItem;
                $scope.item.riwPRMRJ = [];
                console.log('[PRMRJ Detail] noemr:', noemr, '| emrfk:', emrfk_);
                medifirstService.get('emr/get-emr-transaksi-detail?noemr=' + noemr + '&emrfk=' + emrfk_, true).then(function (dat) {
                    var rows = (dat.data && dat.data.data) ? dat.data.data : [];
                    console.log('[PRMRJ Detail] rows returned:', rows.length);
                    rows.forEach(function (r) {
                        if (parseFloat(r.emrfk) !== emrfk_) return;
                        var val = r.value;
                        if (r.type === 'datetime' || r.type === 'datetime2' || r.type === 'date' || r.type === 'time') {
                            val = new Date(r.value);
                        } else if ((r.type === 'combobox' || r.type === 'combobox2' || r.type === 'combobox3') && val && val.indexOf('~') >= 0) {
                            val = val.split('~')[1];
                        }
                        $scope.item.riwPRMRJ[r.emrdfk] = val;
                    });
                    if (rows.length === 0) {
                        toastr.warning('Data detail PRMRJ tidak ditemukan (noemr: ' + noemr + ')');
                    }
                }, function (err) {
                    console.error('[PRMRJ Detail] error:', err);
                    toastr.error('Gagal memuat detail PRMRJ');
                });
            };

            // ===== END RIWAYAT PRMRJ =====

            $scope.kembali = function () {
                if ($scope.isPopupPRMRJ) {
                    $mdDialog.hide()
                    return
                }
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
                    var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .textContent('EMR SUDAH TERSIMPAN, KLIK YA UNTUK KONFIRMASI')
                    .ariaLabel('Lucky day')
                    .cancel('')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'RM.07.02 PRMRJ' + ' dengan No EMR - ' +e.data.data.noemr +  ' Sudah Klik Ya pada EMR No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                })

                    $rootScope.loadRiwayat()
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,  
                    'RM.07.02 PRMRJ' + ' dengan No EMR - ' +e.data.data.noemr +  ' pada No Registrasi ' 
                    + $scope.cc.noregistrasi).then(function (res) {
                    })
                      $scope.cc.norec_emr = e.data.data.noemr
                 
                });
            }

        }
    ]);
});