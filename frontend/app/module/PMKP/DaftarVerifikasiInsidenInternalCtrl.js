define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarVerifikasiInsidenInternalCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.showFilter = false;
            $scope.tglMeninggal = '';
            var norecInsiden = '';
            $scope.selectedOnCheck = [];
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }

            var petugasInsidenInternal = ''
            var verifikatorInsidenInternal = ''
            $scope.pegawai = ModelItem.getPegawai();

            loadCombo();
            loadFirst();
            loadData();
            loadKonsul();

            function loadCombo() {
                medifirstService.get("pmkp/get-data-combo-pmkp")
                    .then(function (data) {
                        
                        // Petugas dan verifikator insiden
                        petugasInsidenInternal = data.data.petugasInsidenInternal
                        verifikatorInsidenInternal = data.data.verifikatorInsidenInternal
                        
                        medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                            $scope.listRuangan = data;
                        });
                        
                        
                    })
            }

            function loadFirst() {
                var chacePeriode = cacheHelper.get('DaftarVerifikasiInsidenInternalCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }

            function loadData() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm');

                var namaruangan = ""
                if ($scope.item.ruangan != undefined) {
                    namaruangan = "&idRuangan=" + $scope.item.ruangan.id
                }

                medifirstService.get("pmkp/get-data-insiden-internal?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    namaruangan).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i + 1
							doto[i].statCheckbox = false
                        }
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: doto,
                            group: $scope.group,
                            pageSize: 50,
                            total: doto.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        // jumlah: { type: "number" }
                                    }
                                }
                            },
                            aggregate: [
                                // { field: 'jumlah', aggregate: 'sum' },
                            ]
                        })
                    });

                var chacePeriode = $scope.item.periodeAwal + "~" +$scope.item.periodeAkhir
                cacheHelper.set('DaftarVerifikasiInsidenInternalCtrl', chacePeriode);
            };

            $scope.SearchData = function () {
                loadData();
            }

            $scope.InsidenBaru = function () {
                loadGridKonsul();
                $scope.winKonsul.center().open()
            }

            function loadKonsul() {
                var tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');                
                medifirstService.get("pmkp/get-data-insiden-internal?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir).then(function (data) {
                        $scope.isRouteLoading = false;
                        var doto = data.data.data;
                        for (var i = 0; i < doto.length; i++) {
                            doto[i].no = i + 1
                            if (doto[i].norec_lk != null) {
                                doto.splice([i], 1)
                            }
                            if (doto.length > 0) {
                                $scope.showNotif = true
                                $scope.lengthInsiden = doto.length
                            } else
                                $scope.showNotif = false
                        }
                    })
            }

            function loadGridKonsul() {
                var tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                var tglAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');                
                medifirstService.get("pmkp/get-data-insiden-internal?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir).then(function (data) {
                        var doto = data.data.data;
                        if (doto.length > 0) {
                            var j = 0
                            for (var i = 0; i < doto.length; i++) {
                                doto[j].no = j + 1
                                if (doto[j].norec_lk == null) {
                                    doto[j].status = 'Belum Ditindaklanjuti'
                                    j++
                                }
                                else
                                    result.splice(j, 1)
                            }
                        }                        
                        $scope.sourceKonsul = new kendo.data.DataSource({
                            data: doto,
                            pageSize: 20,
                        });
                    }, (error) => {
                        throw error;
                    })
            }

            // var onDataBound = function (e) {
            //     var columns = e.sender.columns;
            //     var rows = e.sender.tbody.children();
                
            //     for (var j = 0; j < rows.length; j++) {
            //       // sisa sekarang
            //       var row = $(rows[j]);
            //       var dataItem = e.sender.dataItem(row);

            //       var grading = dataItem.get("grading");
				
            //       var cellNo = row.children().eq(1);
            //       if(grading == "3" 
            //       ||grading == "4") {
            //         cellNo.addClass("red");
            //       }
            //     }
            // }

            $scope.group = {
                field: "jeniskeselamatan",
                aggregates: [{
                    field: "jeniskeselamatan",
                    aggregate: "count"
                }, {
                    field: "jeniskeselamatan",
                    aggregate: "count"
                }]
            };
            $scope.aggregate = [{
                field: "jeniskeselamatan",
                aggregate: "count"
            }, {
                field: "jeniskeselamatan",
                aggregate: "count"
            }]
            $scope.columnGrid = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarLaporanInsidenInternal.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:M1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Laporan Insiden Internal",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];
                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                // dataBound: onDataBound,
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                        template: "# if (statCheckbox) { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />" +
                            "# } else { #" +
                            "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />" +
                            "# } #",
                        width: "30px"
                    },
                    {
                        "field": "no",
                        "title": "No",
                        "width": "60px",
                    },
                    {
                        "field": "tglinsiden",
                        "title": "Tgl Insiden",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglinsiden #')}}</span>"
                    },
                    // {
                    //     "field": "nocm",
                    //     "title": "No Rm",
                    //     "width": "220px",
                    // },
                    // {
                    //     "field": "namapasien",
                    //     "title": "Nama Pasien",
                    //     "width": "220px",
                    // },
                    {
                        "field": "insiden",
                        "title": "Insiden",
                        "width": "220px",
                    },
                    {
                        "field": "keselamatan",
                        "title": "Keselamatan",
                        "width": "220px",
                    },
                    {
                        hidden: true,
                        field: "jeniskeselamatan",
                        title: "Jenis Keselamatan",
                        aggregates: ["count"],
                        // groupHeaderTemplate: "Tindakan #= value # (Jumlah: #= count#)"
                    },
                    {
                        "field": "statusverif",
                        "title": "Verifikasi",
                        "width":"60px",
                        "template": '# if( statusverif==true) {# ✔ # } else {# - #} #'
                    },
                ]
            };

            $scope.selectRow = function (dataItem) {
				var dataSelect = _.find($scope.dataSourceGrid._data, function (data) {
					return data.norec == dataItem.norec;
				});
				if (dataSelect.statCheckbox) {
					dataSelect.statCheckbox = false;
					for (let i = 0; i < $scope.selectedOnCheck.length; i++) {
						if (dataSelect.norec == $scope.selectedOnCheck[i].norec) {
							$scope.selectedOnCheck.splice([i], 1)
							break
						}
					}
				}
				else {
					dataSelect.statCheckbox = true;
					$scope.selectedOnCheck.push(dataSelect)
				}
			}
            var isCheckAll = false
			$scope.selectUnselectAllRow = function () {
				var tempData = $scope.dataSourceGrid._data;
				if (isCheckAll) {
					isCheckAll = false;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = false;
						$scope.selectedOnCheck = []
					}
				}
				else {
					isCheckAll = true;
					for (var i = 0; i < tempData.length; i++) {
						tempData[i].statCheckbox = true;
						$scope.selectedOnCheck.push(tempData[i])
					}
				}
				reloaddataSourceGrid(tempData);
			}

			function reloaddataSourceGrid(ds) {
				var newDs = new kendo.data.DataSource({
					data: ds,
					pageSize: 10,
					total: ds.length,
                    group: $scope.group,
					serverPaging: true,
				});
				var grid = $('#kGrid').data("kendoGrid");
				grid.setDataSource(newDs);
				grid.refresh();
			}

            $scope.konsulOpt = {

                pageable: true,
                scrollable: true,
                columns: [
                    // { field: "rowNumber", title: "#", width: 40, width: 40, attributes: { style: "text-align:right; padding-right: 15px;"}, hideMe: true},
                    // "field": "tglinsiden",                    
                    { field: "no", title: "No", width: 40 },
                    {
                        "field": "tglinsiden",
                        "title": "Tgl Insiden",
                        "width": "95px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglinsiden #')}}</span>"
                    },
                    {
                        "field": "nocm",
                        "title": "No Rm",
                        "width": "220px",
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "220px",
                    },
                    {
                        "field": "insiden",
                        "title": "Insiden",
                        "width": "220px",
                    },
                    { field: "status", title: "Status", width: 120 },
                    { command: [{ name: "tindak lanjuti", text: "Tindak Lanjuti", click: verif }], title: "&nbsp;", width: 120 }
                ],
            };

            function verif(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem.status != 'Belum Ditindaklanjuti') {
                    toastr.error('Sudah di Tindak Lanjuti')
                    return
                }

                var chacePeriode = {
                    0: dataItem.norec,
                    1: 'TindakLanjut',
                    2: dataItem.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('LembarKerjaInvestigasiSederhanaCtrl', chacePeriode);
                $state.go('LembarKerjaInvestigasiSederhana', {
                    kpid: dataItem.norec,
                    noOrder: 'TindakLanjut'
                });
            }

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.editData = function () {
                if(petugasInsidenInternal.includes($scope.pegawai.id.toString()) == false || verifikatorInsidenInternal.includes($scope.pegawai.id.toString()) == false){
                    toastr.error('Anda Bukan Petugas / Verifikator Insiden Internal')
                    return
                }

                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                if ($scope.dataPasienSelected.statusverif == true) {
                    toastr.error("Data Sudah Diverifikasi!")
                    return;
                }
               
                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'EditInsiden',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'EditInsiden'
                });
            }

            $scope.hapusData = function () {
                if(petugasInsidenInternal.includes($scope.pegawai.id.toString()) == false || verifikatorInsidenInternal.includes($scope.pegawai.id.toString()) == false){
                    toastr.error('Anda Bukan Petugas / Verifikator Insiden Internal')
                    return
                }

                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                if ($scope.dataPasienSelected.norec_lk != undefined) {
                    messageContainer.error("Insiden Telah Ditindaklanjuti Tidak Bisa Dihapus!")
                    return
                }

                if ($scope.dataPasienSelected != undefined) {

                    var item = {
                        norec: $scope.dataPasienSelected.norec
                    }

                    medifirstService.post('pmkp/delete-data-insiden-internal', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.Lanjut = function () {
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'TindakLanjut',
                    2: $scope.dataPasienSelected.norec,
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('LembarKerjaInvestigasiSederhanaCtrl', chacePeriode);
                $state.go('LembarKerjaInvestigasiSederhana', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'TindakLanjut'
                });
            }

            $scope.tambahData = function () {
                $state.go('InsidenInternal', {});
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

            $scope.Cetak = function(){
                debugger;
                $scope.pegawai = medifirstService.getPegawaiLogin();
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Data Belum Dipilih !")
                    return
                }
                
                var stt = 'false'
                if (confirm('View Insiden Internal? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var client = new HttpClient();                
                client.get('http://127.0.0.1:1237/printvb/pmkp?cetak-lap-insiden-keomite-mutu&norec=' + $scope.dataPasienSelected.norec + '&view=' + stt, function (response) {
                    //aadc=response; 

                });
            }

            $scope.Lihat= function(){
                if ($scope.dataPasienSelected == undefined) {
                    alert("Data Belum Dipilih!")
                    return;
                }

                var chacePeriode = {
                    0: $scope.dataPasienSelected.norec,
                    1: 'LihatInsiden',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }

                cacheHelper.set('InsidenInternalCtrl', chacePeriode);
                $state.go('InsidenInternal', {
                    kpid: $scope.dataPasienSelected.norec,
                    noOrder: 'LihatInsiden'
                });
            }

            $scope.verifikasiInsiden = function () {
                if(verifikatorInsidenInternal.includes($scope.pegawai.id.toString()) == false){
                    toastr.error("Anda Bukan Verifikator Insiden Internal")
                    return
                }

                if($scope.selectedOnCheck.length == 0) {
                    alert("Harap pilih data yang akan diverifikasi!")
                    return;
                }

                let listStatusVerif = [] 

                $scope.selectedOnCheck.map(function(data){
                   listStatusVerif.push(data.statusverif)
                })

                if(listStatusVerif.includes(true)){
                    toastr.error("Ada data yang sudah diverifikasi")
                    return
                }
                
                var json = {
                    data: $scope.selectedOnCheck
                }
                $scope.isRouteLoading = true;
                medifirstService.post('pmkp/verifikasi-data-insiden-internal/true', json).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.selectedOnCheck = []
                    loadData();
                })
            }

            $scope.unverifikasiInsiden = function () {
                if(verifikatorInsidenInternal.includes($scope.pegawai.id.toString()) == false){
                    toastr.error("Anda Bukan Verifikator Insiden Internal")
                    return
                }

                if($scope.selectedOnCheck.length == 0) {
                    alert("Harap pilih data yang akan di unverifikasi!")
                    return;
                }
                
                var json = {
                    data: $scope.selectedOnCheck
                }
                $scope.isRouteLoading = true;
                medifirstService.post('pmkp/verifikasi-data-insiden-internal/false', json).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.selectedOnCheck = []
                    loadData();
                })
            }

            //** BATAS SUCI */                    
        }
    ]);
});