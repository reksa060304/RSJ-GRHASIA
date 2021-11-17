define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PerhitunganIndexPostRemunCtrl', ['$mdDialog', '$timeout', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($mdDialog, $timeout, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {

            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.item = {};
            $scope.itm = {};
            $scope.item.periodeAwal = new Date();
            $scope.item.periodeAkhir = new Date();
            $scope.item.tanggalPulang = new Date();
            $scope.dataPasienSelected = {};
            $scope.cboDokter = false;
            $scope.pasienPulang = false;
            $scope.cboUbahDokter = true;
            $scope.isRouteLoading = false;
            $scope.item.jmlRows = 100
            $scope.jmlRujukanMasuk = 0
            $scope.jmlRujukanKeluar = 0

            var dataSave = []
            var dataPegawaiAll = []
            var data3 = []
            medifirstService.getPart('sysadmin/menu/get-pegawai-part', true, true, 10).then(function (data) {
                $scope.listPegawai = data
            })
            medifirstService.get('remunerasi/get-combo-idx').then(function (e) {
                $scope.listJabatan = e.data.jabatan
                $scope.listPendidikan = e.data.pendidikan
                $scope.listUnitKerja = e.data.unitkerja
                $scope.listGolongan = e.data.golongan
                $scope.listRuangan = e.data.ruangan

            })
            loadData()

            $scope.formatTanggal = function (tanggal) {
                if (tanggal == 'null')
                    return '-'
                if (tanggal == '')
                    return '-'
                else
                    return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.SearchData = function () {
                loadData()
            }
            function loadData() {
                $scope.isRouteLoading = true;
                // var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD 00:00:00');
                // var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD 23:59:59');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noreg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&norm=" + $scope.item.noRm
                }
                var nm = ""
                if ($scope.item.namapegawai != undefined) {
                    var nm = "&namalengkap=" + $scope.item.namapegawai
                }
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.unit != undefined) {
                    var kp = "&un_id=" + $scope.item.unit.id
                }
                var jb = ""
                if ($scope.item.jabatan != undefined) {
                    var jb = "&j_id=" + $scope.item.jabatan.id
                }

                var jmlRows = "";
                if ($scope.item.jmlRows != undefined) {
                    jmlRows = $scope.item.jmlRows
                }
                $q.all([
                    medifirstService.get("remunerasi/get-daftar-index-pegawai?" +
                        reg + rm + nm + ins + rg + kp + jb
                        + '&jmlRows=' + jmlRows),
                ]).then(function (data) {
                    $scope.isRouteLoading = false;
                    // data1 = data[0].data.data1
                    data3 = data[0].data.datapersen
                    for (var i = 0; i < data[0].data.data.length; i++) {
                        var element = data[0].data.data[i];
                        element.totalindex = parseFloat(element.totalindex).toFixed(2)
                        if (element.poinjpu != null)
                            element.poinjpu = parseFloat(element.poinjpu).toFixed(2)
                        for (var key in element) {
                            if (element[key] == null)
                                element[key] = ''
                        }
                    }
                    $scope.data1 = new kendo.data.DataSource({
                        data: data[0].data.data,
                        pageSize: 10,
                        // group: $scope.group,
                        // total:data1.data,
                        serverPaging: false,
                    });
                    // var chacePeriode = tglAwal + "~" + tglAkhir;
                    // cacheHelper.set('PerhitunganIndexPostRemunCtrl', chacePeriode);
                });

            };
            $scope.columnData1 = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Daftar Index Pegawai.xlsx",
                    allPages: true,
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "idpegawai",
                        "title": "ID",
                        "width": "80px"
                    },
                    {
                        "field": "namalengkap",
                        "title": "Nama Lengkap",
                        "width": "250px"
                    },

                    {
                        "field": "namajabatan",
                        "title": "Jabatan",
                        "width": "200px"
                    },

                    {
                        "field": "golongan",
                        "title": "Golongan",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: golongan #'}}</span>"
                    },
                    {
                        "field": "pendidikan",
                        "title": "Pendidikan",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: pendidikan #'}}</span>"
                    },
                    {
                        "field": "unitkerja",
                        "title": "Unit Kerja",
                        "width": "200px",
                        "template": "<span class='style-center'>{{'#: unitkerja #'}}</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Sub Unit Kerja",
                        "width": "200px",
                        "template": "<span class='style-center'>{{'#: namaruangan #'}}</span>"
                    },
                    // {
                    //     "field": "petugasdiklat",
                    //     "title": "Diklat",
                    //     "width": "100px",
                    //     "template": "<span class='style-center'>{{'#: petugasdiklat #'}}</span>"
                    // },
                    {
                        "field": "tglmasuk",
                        "title": "Tgl Masuk",
                        "width": "100px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>"
                    },
                    {
                        "field": "poinjpu",
                        "title": "Point JPU",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: poinjpu #'}}</span>"
                    },
                    {
                        "field": "idxbasic",
                        "title": "Basic Index ",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: idxbasic #'}}</span>"
                    },
                    {
                        "field": "idxcompetency",
                        "title": "Competency Index",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: idxcompetency #'}}</span>"
                    },
                    {
                        "field": "idxrisk",
                        "title": "Risk Index",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: idxrisk #'}}</span>"
                    },
                    {
                        "field": "idxemergency",
                        "title": "Emergency Index ",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: idxemergency #'}}</span>"
                    },
                    {
                        "field": "idxposition",
                        "title": "Position Index",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: idxposition #'}}</span>"
                    },
                    {
                        "field": "idxperformance",
                        "title": "Performance Index",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: idxperformance #'}}</span>"
                    },
                    {
                        "field": "totalindex",
                        "title": "Total Index",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: totalindex #'}}</span>"
                    },
                     {
                        "field": "pointcasemix",
                        "title": "Point Casemix",
                        "width": "100px",
                        "template": "<span class='style-center'>{{'#: pointcasemix #'}}</span>"
                    },

                ]
            };
            // $scope.columnData1 = {
            //     selectable: 'row',
            //     pageable: true,
            //     columns: [
            //         {
            //             "field": "idpegawai",
            //             "title": "ID",
            //             "width": "80px"
            //         },
            //         {
            //             "field": "namakaryawan",
            //             "title": "Nama Karyawan",
            //             "width": "250px"
            //         },
            //         {
            //             "field": "jabatan",
            //             "title": "Jabatan",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "statuskerja",
            //             "title": "Status Kerja",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "golongan",
            //             "title": "Golongan",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: golongan #'}}</span>"
            //         },
            //         {
            //             "field": "skpertamamasukrs",
            //             "title": "Tgl SK",
            //             "width": "100px",
            //             "template": "<span class='style-left'>{{formatTanggal('#: skpertamamasukrs #')}}</span>"
            //         },
            //         {
            //             "field": "basicindex",
            //             "title": "Basic Index",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: basicindex #'}}</span>"
            //         },
            //         {
            //             "field": "pendidikan",
            //             "title": "Pendidikan",
            //             "width": "130px"
            //         },
            //         {
            //             "field": "cidx",
            //             "title": "Idx",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: cidx #'}}</span>"
            //         },
            //         {
            //             "field": "crating",
            //             "title": "Rating",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: crating #'}}</span>"
            //         },
            //         {
            //             "field": "competencyindex",
            //             "title": "CompetencyIdx",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: competencyindex #'}}</span>"
            //         },
            //         {
            //             "field": "unitkerja",
            //             "title": "Unit Kerja",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "risk",
            //             "title": "Risk",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: risk #'}}</span>"
            //         },
            //         {
            //             "field": "ridx",
            //             "title": "Idx",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: ridx #'}}</span>"
            //         },
            //         {
            //             "field": "rrating",
            //             "title": "Rating",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: rrating #'}}</span>"
            //         },
            //         {
            //             "field": "riskindex",
            //             "title": "Risk Index",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: riskindex #'}}</span>"
            //         },
            //         {
            //             "field": "emergency",
            //             "title": "Emergency",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: emergency #'}}</span>"
            //         },
            //         {
            //             "field": "eidx",
            //             "title": "Idx",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: eidx #'}}</span>"
            //         },
            //         {
            //             "field": "erating",
            //             "title": "Rating",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: erating #'}}</span>"
            //         },
            //         {
            //             "field": "emergencyindex",
            //             "title": "EmergencyIdx",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: emergencyindex #'}}</span>"
            //         },
            //         {
            //             "field": "pidx",
            //             "title": "Idx",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: pidx #'}}</span>"
            //         },
            //         {
            //             "field": "prating",
            //             "title": "Rating",
            //             "width": "50px",
            //             "template": "<span class='style-center'>{{'#: prating #'}}</span>"
            //         },
            //         {
            //             "field": "positionindex",
            //             "title": "PositionIdx",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: positionindex #'}}</span>"
            //         },
            //         {
            //             "field": "performanceindex",
            //             "title": "PerformanceIdx",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: performanceindex #'}}</span>"
            //         },
            //         {
            //             "field": "totalindex",
            //             "title": "Total Index",
            //             "width": "100px",
            //             "template": "<span class='style-center'>{{'#: totalindex #'}}</span>"
            //         },
            //         // {
            //         // 	"field": "nostrukpagu",
            //         // 	"title": "Nostrukpagu",
            //         // 	"width":"100px"
            //         // },
            //         //         	{
            //         // 	"field": "periodeawal",
            //         // 	"title": "Tgl Pelayanan",
            //         // 	"width":"100px",
            //         // 	"template": "<span class='style-left'>{{formatTanggal('#: periodeawal #')}}</span>"
            //         // }
            //     ]
            // };
            // $scope.$watch('item.namapegawai', function(newValue, oldValue) {
            //           if (newValue != oldValue  ) {
            //           	if (oldValue.length == 4) {

            //           	}

            //           	if (oldValue.length == 2) {

            //           	}
            //           	var str = newValue
            //               if (str.length == 2) {
            //               	$scope.item.namapegawai = newValue + '-'
            //               }
            //               if (str.length == 5) {
            //               	$scope.item.namapegawai = newValue + '-'
            //               }
            //           }
            //       });

            $scope.ubahDataIndex = function () {
                if ($scope.data1Selected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.popupDetailIndex.center().open();
                // $scope.itm = $scope.data1Selected
                $scope.listPegawai.add({ id: $scope.data1Selected.idpegawai, namalengkap: $scope.data1Selected.namalengkap })
                $scope.itm.pegawai = { id: $scope.data1Selected.idpegawai, namalengkap: $scope.data1Selected.namalengkap }
                if ($scope.data1Selected.objectjabatanfungsionalfk)
                    $scope.itm.jab = { id: $scope.data1Selected.objectjabatanfungsionalfk, namajabatan: $scope.data1Selected.namajabatan }
                if ($scope.data1Selected.objectgolonganfk)
                    $scope.itm.gol = { id: $scope.data1Selected.objectgolonganfk, golongan: $scope.data1Selected.golongan }
                if ($scope.data1Selected.objectpendidikanterakhirfk)
                    $scope.itm.pdd = { id: $scope.data1Selected.objectpendidikanterakhirfk, pendidikan: $scope.data1Selected.pendidikan }
                if ($scope.data1Selected.objectunitkerjapegawaifk)
                    $scope.itm.unit = { id: $scope.data1Selected.objectunitkerjapegawaifk, unitkerja: $scope.data1Selected.unitkerja }
                if ($scope.data1Selected.poinjpu)
                    $scope.itm.poinjpu = $scope.data1Selected.poinjpu
                if ($scope.data1Selected.idxbasic)
                    $scope.itm.idxbasic = $scope.data1Selected.idxbasic
                if ($scope.data1Selected.idxcompetency)
                    $scope.itm.idxcompetency = $scope.data1Selected.idxcompetency
                if ($scope.data1Selected.idxrisk)
                    $scope.itm.idxrisk = $scope.data1Selected.idxrisk
                if ($scope.data1Selected.idxemergency)
                    $scope.itm.idxemergency = $scope.data1Selected.idxemergency
                if ($scope.data1Selected.idxposition)
                    $scope.itm.idxposition = $scope.data1Selected.idxposition
                if ($scope.data1Selected.idxperformance)
                    $scope.itm.idxperformance = $scope.data1Selected.idxperformance

                 if ($scope.data1Selected.nomorrekening)
                    $scope.itm.noRekening = $scope.data1Selected.nomorrekening
                  if ($scope.data1Selected.objectruangankerjafk)
                    $scope.itm.subUnit = { id: $scope.data1Selected.objectruangankerjafk, namaruangan: $scope.data1Selected.namaruangan }
                if ($scope.data1Selected.nip)
                    $scope.itm.nip = $scope.data1Selected.nip

                if ($scope.data1Selected.tglmasuk)
                    $scope.itm.tglmasuk = new Date($scope.data1Selected.tglmasuk)
                 if ($scope.data1Selected.totalindex)
                    $scope.itm.totalindex = $scope.data1Selected.totalindex
                   if ($scope.data1Selected.pointcasemix)
                    $scope.itm.pointcasemix = $scope.data1Selected.pointcasemix
                

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
            $scope.save = function () {
                let json = {
                    'id': $scope.itm.pegawai.id,
                    'objectpendidikanterakhirfk': $scope.itm.pdd != undefined ? $scope.itm.pdd.id : null,
                    'objectgolonganfk': $scope.itm.gol != undefined ? $scope.itm.gol.id : null,
                    'objectjabatanfungsionalfk': $scope.itm.jab != undefined ? $scope.itm.jab.id : null,
                    'objectunitkerjapegawaifk': $scope.itm.unit != undefined ? $scope.itm.unit.id : null,
                    'tglmasuk': $scope.itm.tglmasuk != undefined ? moment($scope.itm.tglmasuk).format('YYYY-MM-DD') : null,
                    'idxbasic': $scope.itm.idxbasic != undefined ? $scope.itm.idxbasic : null,
                    'idxcompetency': $scope.itm.idxcompetency != undefined ? $scope.itm.idxcompetency : null,
                    'idxrisk': $scope.itm.idxrisk != undefined ? $scope.itm.idxrisk : null,
                    'idxemergency': $scope.itm.idxemergency != undefined ? $scope.itm.idxemergency : null,
                    'idxposition': $scope.itm.idxposition != undefined ? $scope.itm.idxposition : null,
                    'idxperformance': $scope.itm.idxperformance != undefined ? $scope.itm.idxperformance : null,
                    // 'idxperformance': $scope.itm.idxperformance != undefined ? $scope.itm.idxperformance : null,
                    'poinjpu': $scope.itm.poinjpu != undefined ? $scope.itm.poinjpu : null,
                     'nip': $scope.itm.nip != undefined ? $scope.itm.nip : null,
                      'nomorrekening': $scope.itm.noRekening != undefined ? $scope.itm.noRekening : null,
                       'objectruangankerjafk': $scope.itm.subUnit != undefined ? $scope.itm.subUnit.id : null,
                        'pointcasemix': $scope.itm.pointcasemix != undefined ? $scope.itm.pointcasemix : null,
                }
                medifirstService.post('remunerasi/save-index-pegawai', json).then(function (e) {
                     medifirstService.postLogging('Remunerasi', 'id pegawai', $scope.itm.pegawai.id,
                       'Perubahan index dari  ' + e.data.idx.totalindex +' menjadi '+ e.data.total + ' pada Pegawai '
                        + $scope.itm.pegawai.namalengkap).then(function (res) {
                        })
                    loadData()
                    $scope.batal()
                   
                })

            }
            $scope.SearchEnter = function(){
                  loadData()
            }
            $scope.batal = function(){
                $scope.data1Selected = undefined
                $scope.popupDetailIndex.close();
                $scope.itm = {}
            }
            $scope.MapPegawai = function(){
                $state.go("MappingJasaPelayananToPegawai")
            }
            $scope.cetakKartu = function () {
                $scope.dataLogin = JSON.parse(window.localStorage.getItem('pegawai'));
                if ($scope.dataPasienSelected.tglpulang == undefined) {
                    window.messageContainer.error("Pasien Belum Dipulangkan!!!");
                    return;
                }
                if ($scope.dataPasienSelected.noregistrasi == undefined)
                    var noReg = "";
                else
                    var noReg = $scope.dataPasienSelected.noregistrasi;
                var stt = 'false'
                if (confirm('View Kartu Pulang? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kip-pasien=1&noregistrasi=' + noReg + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=' + stt, function (response) {
                    // do something with response
                });
            }
            // END ################

        }
    ]);
});