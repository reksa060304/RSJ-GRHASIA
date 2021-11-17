define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DataPegawaiCtrl', ['CacheHelper', '$scope', 'ModelItem', '$state', 'DateHelper', '$timeout', 'CetakHelper', 'MedifirstService',
        function (cacheHelper, $scope, ModelItem, $state, dateHelper, $timeout, cetakHelper, medifirstService) {
            $scope.title = "Data Pegawai";
            $scope.now = new Date();
            $scope.item = {};
            $scope.itemF = {};
            $scope.username = "Show";
            $scope.dialogPopup;
            $scope.popupHistory;
            $scope.isRouteLoading = false;
            formLoad();

            function formLoad() {
                $scope.monthSelectorOptions = {
                    start: "year",
                    depth: "year"
                };

                var data = cacheHelper.get('listPegawai');
                $scope.filteredData = [];

                if (data === undefined) {
                    data = [];
                }

                $scope.daftarPegawai = new kendo.data.DataSource({
                    data: data,
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                    serverFiltering: false
                });

                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    // var dataLogin = dat.datalogin[0];
                    $scope.listUnitKerja = dataCombo.dataunitkerja;
                    $scope.ListKedudukanPegawai = dataCombo.statuspegawai;
                    $scope.ListStatusPegawai = dataCombo.kategorypegawai;
                    $scope.listJenis = dataCombo.jenispegawai;
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.dropDownPegawai = data;
                    LoadDataGrid();
                });                
            }

            function LoadDataGrid() {
                $scope.isRouteLoading = true;
                medifirstService.get("sdm/get-data-pegawai-all-sdm?", true).then(function (dat) {
                    var dataForGrid = dat.data
                     for (var i = 0; i < dataForGrid.length; i++) {
                         var sip = ''
                         var str = ''
                         if( dataForGrid[i].nosip!= null  &&  dataForGrid[i].nosip!=''){
                             sip =  dataForGrid[i].nosip
                         }
                         if( dataForGrid[i].nostr!= null  &&  dataForGrid[i].nostr!=''){
                             str =  dataForGrid[i].nostr
                         }
                         dataForGrid[i].nosipstr = sip + '/' + str
                     }
                  
                    $scope.daftarPegawai = new kendo.data.DataSource({
                        data: dataForGrid,
                        pageSize: 10,
                        total: dataForGrid.length,
                        serverPaging: false
                    });
                    $scope.isRouteLoading = false
                });
            }

            $scope.getIsiComboSubUnit = function () {                
                if ($scope.item.qunitKerja != undefined || $scope.item.qunitKerja != "") {
                    $scope.listSubUnit = $scope.item.qunitKerja.subunit
                }
            }

            $scope.exportDetail = function (e) {
                var tempDataExport = [];
                var rows = [{
                    cells: [
                        { value: "idFinger" },
                        { value: "NIP" },
                        { value: "Nama" },
                        { value: "Gelar(Dpn)" },
                        { value: "Gelar(Blkng)" },
                        { value: "Nama Lengkap" },
                        { value: "Tempat Lahir" },
                        { value: "Tanggal Lahir" },
                        { value: "Jenis Kelamin" },
                        { value: "Status Pegawai" },
                        { value: "Kedudukan Pegawai" },
                        { value: "Tanggal Masuk" },
                        { value: "Tanggal Keluar" },
                        { value: "Golongan" },
                        { value: "Jabatan Struktural/Fungsional" },
                        { value: "Pendidikan" },
                        { value: "Jabatan Internal" },
                        { value: "Kelompok Jabatan" },
                        { value: "Status Kawin" },
                        { value: "No Rekening" },
                        { value: "Nama Rekening" },
                        { value: "Kode Bank" },
                        { value: "NPWP" },
                        { value: "Alamat" },
                        { value: "Kodepos" },
                        { value: "Agama" },
                        { value: "Unit Kerja" },
                        { value: "Sub Unit Kerja" },
                        { value: "Eselon" },
                        { value: "Pola Kerja" },
                        { value: "Nilai Jabatan" },
                        { value: "Grade" },
                        { value: "SIP" },
                        { value: "Tgl Terbit SIP" },
                        { value: "Tgl Berakhir SIP" },
                        { value: "STR" },
                        { value: "Tgl Terbit STR" },
                        { value: "Tgl Berakhir STR" }
                    ]
                }];
                if ($scope.filteredData.length > 0) {
                    tempDataExport = new kendo.data.DataSource({
                        data: $scope.filteredData
                    });
                } else {
                    tempDataExport = $scope.daftarPegawai;
                }
                tempDataExport.fetch(function () {
                    var data = this.data();
                    for (var i = 0; i < data.length; i++) {
                        //push single row for every record
                        rows.push({
                            cells: [
                                { value: data[i].idFinger },
                                { value: data[i].nipPns },
                                { value: data[i].nama },
                                { value: data[i].gelarDepan },
                                { value: data[i].gelarBelakang },
                                { value: data[i].namaLengkap },
                                { value: data[i].tempatLahir },
                                { value: data[i].tglLahir, format: "dd MM yyyy" },
                                { value: data[i].jenisKelamin },
                                { value: data[i].kategoriPegawai },
                                { value: data[i].kedudukan },
                                { value: data[i].tglMasuk },
                                { value: data[i].tglKeluar },
                                { value: data[i].namaGolongan },
                                { value: data[i].namaJabatan },
                                { value: data[i].namaPendidikan },
                                { value: data[i].jabatanInternal },
                                { value: data[i].kelompokJabatan },
                                { value: data[i].statusPerkawinanPegawai },
                                { value: data[i].bankRekeningNomor },
                                { value: data[i].bankRekeningAtasNama },
                                { value: data[i].bankRekeningNama },
                                { value: data[i].npwp },
                                { value: data[i].alamat },
                                { value: data[i].kodePos },
                                { value: data[i].agama },
                                { value: data[i].unitKerja },
                                { value: data[i].subUnitKerja },
                                { value: data[i].eselon },
                                { value: data[i].shiftKerja },
                                { value: data[i].nilaiJabatan },
                                { value: data[i].grade },
                                { value: data[i].noSip },
                                { value: data[i].tglTerbitSip },
                                { value: data[i].tglBerakhirSip },
                                { value: data[i].noStr },
                                { value: data[i].tglTerbitStr },
                                { value: data[i].tglBerakhirStr }
                            ]
                        })
                    }
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: [
                            {
                                freezePane: {
                                    rowSplit: 1
                                },
                                columns: [
                                    // Column settings (width)
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                    { autoWidth: true },
                                ],
                                // Title of the sheet
                                title: "Employees",
                                // Rows of the sheet
                                rows: rows
                            }
                        ]
                    });
                    //save the file as Excel file with extension xlsx
                    // kendo.saveAs({ dataURI: workbook.toDataURL(), fileName: "RSAB HK Export Data Pegawai Detail-" + dateHelper.formatDate(new Date(), 'DD-MMM-YYYY HH:mm:ss') + ".xlsx" });
                });
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.daftarpegawaiOpt = {
                    toolbar: [
                    "excel",
                    
                    ],
                    excel: {
                        fileName: "DataPegawai.xlsx",
                        allPages: true,
                    },
                    excelExport: function(e){
                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:K1"];
                        sheet.name = "Page 1";

                        var myHeaders = [{
                            value:"Data Pegawai",
                            fontSize: 20,
                            textAlign: "center",
                            background:"#ffffff",
                         // color:"#ffffff"
                     }];

                     sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                 },
                // toolbar: [
                // "excel",
                // {text: "export", name:"Export detail", template: '<button ng-click="exportDetail()" class="k-button k-button-icontext k-grid-upload"><span class="k-icon k-i-excel"></span>Export All to Excel</button>'},
                // {name: "username", text:"Show username", template: '<button ng-click="toogleClick()" class="k-button k-button-icontext k-grid-upload pull-right"><span class="k-icon k-i-refresh"></span>{{username}} Username</button>'}
                // ],
                // excel: {
                //     allPages: true,
                //     fileName: "RSAB HK Export Data Pegawai-" + dateHelper.formatDate(new Date(), 'DD-MMM-YYYY HH:mm:ss') +".xlsx"
                // },
                pageable: true,
                pageSize: 10, //page size
                selectable: 'row',
                scrollable: true,
                resizable:true,
                columns: [
                    { field: "nippns", title: "Nip", width: "10%" },
                    { field: "namalengkap", title: "Nama Lengkap", width: "25%" },
                    // {
                    //   field: "NamaUser",
                    //   title: "Username", 
                    //   width: "20%", 
                    //   hidden: true ,
                    //   // template: "# for(var i=0; i < usernames.length;i++){# usernames.usernames.namaUser #}"
                    // },
                    { field: "agama", title: "Agama", width: "10%" },
                    { field: "unitkerja", title: "Unit Kerja", width: "25%" },
                    { field: "jenispegawai", title: "Jenis Pegawai", width: "20%" },
                    { field: "jbstruktural", title: "Jabatan Internal", width: "20%", hidden: "true" },
                    { field: "statuspegawai", title: "Status", width: "10%" },
                    { field: "namakategorypegawai", title: "Kategory", width: "10%" },
                    { field: "tglmasuk", title: "TglMasuk", width: "10%", 
                    template: "<span class='style-left'>{{formatTanggal('#: tglmasuk #')}}</span>" },
                    { field: "nosipstr", title: "No SIP/ STR", width: "10%" },
                    { field: "id", title: "ID Pegawai", width: "10%" },
                ],
                // set column width to auto
                excelExport: function (e) {
                    var columns = e.workbook.sheets[0].columns;
                    columns.forEach(function (column) {
                        delete column.width;
                        column.autoWidth = true;
                    });
                },
                change: function (e) {
                    // debugger;
                    var grid = $("#gridDataPegawai").data("kendoGrid");
                    var selectedRows = grid.dataItem(grid.select());
                    // for(var i=0; i < $scope.arrayMapAtasan.length; i++){
                    //     if(selectedRows.idPegawai == $scope.arrayMapAtasan[i].pegawai.id){
                    //         if($scope.arrayMapAtasan[i].atasanLangsung) selectedRows.atasanLangsung = $scope.arrayMapAtasan[i].atasanLangsung;
                    //         if($scope.arrayMapAtasan[i].atasanPejabatPenilai) selectedRows.atasanPejabatPenilai = $scope.arrayMapAtasan[i].atasanPejabatPenilai;
                    //         break;
                    //     }
                    // }
                    $scope.dataItem = selectedRows;
                }
            };            

            $scope.klik = function (data) {                
                $scope.dataItem = data;
            }

            $scope.ubah = function () {
                if ($scope.dataItem) {
                    var chacePeriode = {
                        0: $scope.dataItem.id,
                        1: 'EditPegawai',
                        2: '',
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('MasterPegawaiCtrl', chacePeriode);
                    $state.go('MasterPegawai')
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }

            $scope.InputBaru = function () {                
                var chacePeriode = {
                    0: '',
                    1: '',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('MasterPegawaiCtrl', chacePeriode);
                $state.go('MasterPegawai')
            }

            $scope.idFinger = function () {
                if ($scope.dataItem) {
                    $scope.itemF.idFinger = $scope.dataItem.fingerprintid;
                    $scope.itemF.tglInput = moment($scope.now).format('YYYY-MM-DD HH:mm');
                    $scope.itemF.idPegawai = $scope.dataItem.id;
                    $scope.itemF.namaLengkap = $scope.dataItem.namalengkap;
                    $scope.itemF.JenisKelamin = $scope.dataItem.jeniskelamin;
                    $scope.itemF.namaJabatan = $scope.dataItem.jbfungsional;
                    $scope.popUpIdFinger.center().open();
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };

            }

            $scope.simpanIdFinger = function () {
                if ($scope.itemF.idFinger == undefined) {
                    alert("Id Finger Tidak Boleh Kosong!")
                    return;
                }

                var objSave = {
                    idpegawai: $scope.itemF.idPegawai,
                    tglinput: $scope.itemF.tglInput,
                    idfinger: $scope.itemF.idFinger
                }

                medifirstService.post('sdm/update-idfinger-pegawai', objSave).then(function (e) {
                    $scope.itemF.idFinger = undefined;
                    $scope.itemF.tglInput = undefined;
                    $scope.itemF.idPegawai = undefined
                    $scope.itemF.namaLengkap = undefined;
                    $scope.itemF.JenisKelamin = undefined;
                    $scope.itemF.namaJabatan = undefined;
                    $scope.popUpIdFinger.close();
                    formLoad();
                }, function (error) {
                    toastr.error(JSON.stringify(error.message), 'Error')
                });
            }

            $scope.batalFinger = function () {
                $scope.itemF.idFinger = undefined;
                $scope.itemF.tglInput = undefined;
                $scope.itemF.idPegawai = undefined
                $scope.itemF.namaLengkap = undefined;
                $scope.itemF.JenisKelamin = undefined;
                $scope.itemF.namaJabatan = undefined;
                // $scope.popUpIdFinger.close();
            }

            $scope.HapusPegawai = function () {
                if ($scope.dataItem.id != undefined) {
                    var item = {
                        idPegawai: $scope.dataItem.id
                    }

                    medifirstService.post('sdm/update-false-pegawai', item).then(function (e) {
                        formLoad();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.mutasi = function () {
                if ($scope.dataItem) {
                    $state.go("MutasiPegawai", { idPegawai: $scope.dataItem.id });
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }

            $scope.keluarga = function () {
                if ($scope.dataItem) {
                    $state.go("DataKeluarga", { idPegawai: $scope.dataItem.id });
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            }

            $scope.mappingAtasan = function (e) {
                if ($scope.dataItem) {
                    $state.go("MappingAtasanPegawai", {
                        idPegawai: $scope.dataItem.id,
                        namaLengkap: $scope.dataItem.namakengkap
                    })
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            };

            $scope.riwayatPendidikan = function (e) {
                if ($scope.dataItem) {
                    $state.go("RiwayatPendidikan", {
                        idPegawai: $scope.dataItem.id,
                        namaLengkap: $scope.dataItem.namalengkap,
                        nip: $scope.dataItem.nippns,
                    })
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            };
            $scope.riwayatJabatan = function (e) {
                if ($scope.dataItem) {
                    $state.go("RiwayatJabatan", {
                        idPegawai: $scope.dataItem.id,
                        namaLengkap: $scope.dataItem.namalengkap,
                        nip: $scope.dataItem.nippns,
                    })
                } else {
                    messageContainer.error('Pegawai belum di pilih')
                };
            };
            $scope.goToUrl = function () {
                $scope.dialogPopup.close();
                $state.go('MasaBerlakuSipStr');
            };
            $scope.goToUrlReport = function (data) {
                var listRawRequired = [
                    "report.statusPegawai|k-ng-model|Status pegawai"
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    $scope.dialogReport.close();
                    var fixUrlLaporan = cetakHelper.openURLReporting("reporting/data-pegawai-berdasarkan-kategori-pegawai?kategoryPegawaiId=" + data.statusPegawai.id);
                    window.open(fixUrlLaporan, "Report Pegawai (" + data.statusPegawai.kategoryPegawai + ") RSABHK", "width=800, height=600");
                } else {
                    ModelItem.showMessages(isValid.messages);
                }
            };
            $scope.goToUrlReportAll = function () {
                $scope.dialogReport.close();
                var fixUrlLaporan = cetakHelper.openURLReporting("reporting/data-pegawai-berdasarkan-kategori-pegawai?kategoryPegawaiId=");
                window.open(fixUrlLaporan, "Report Pegawai RSABHK", "width=800, height=600");
            }
            function filterSubunit(subUnit) {
                if (!$scope.item.qunitKerja) return;
                if (subUnit.id === $scope.item.qunitKerja.id) {
                    return true;
                }
                return false;
            }
            var timeoutPromise;
            $scope.$watch('item.qnamaPegawai', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namalengkap", newVal);
                    }
                }, 500)
            });
            $scope.$watch('item.qkedudukanPegawai', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("statuspegawai", newVal)
                }
            });
               $scope.$watch('item.qJenisPegawai', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("objectjenispegawaifk", newVal.id)
                }
            });
            $scope.$watch('item.qjabatanInternal', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("objectjabatanstrukturalfk", newVal)
                }
            });
            $scope.$watch('item.qunitKerja', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    // var filteredSubUnit = $scope.listUnitKerja.filter(filterSubunit);
                    // if ($scope.item.qsubUnitKerja && $scope.item.qsubUnitKerja.id !== newVal.id) delete $scope.item.qsubUnitKerja;
                    // if (filteredSubUnit.length > 0) {
                    //     $scope.listSubUnit = filteredSubUnit;
                    // } else {
                    //     $scope.listUnitKerja = $scope.listUnitKerja;
                    // }
                    applyFilter("objectunitkerjapegawaifk", newVal)
                }
            });
           
            $scope.$watch('item.qstatusPegawai', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("kategorypegawai", newVal)
                }
            });

            $scope.$watch('item.tglMasuk', function (newVal, oldVal) {
                if (!newVal) return;
                if (newVal && newVal !== oldVal) {
                    applyFilter("tglmasuk", newVal)
                }
            });

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridDataPegawai").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterField === "namalengkap") {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    });
                } else if (filterField === "statuspegawai") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.statuspegawai
                    });
                } else if (filterField === "objectjabatanstrukturalfk" || filterField === "objectunitkerjafk") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else if (filterField === "kategorypegawai") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.kategorypegawai
                    });
                }
                else if (filterField === "objectunitkerjapegawaifk") {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else if (filterField === "tglmasuk") {

                    var date = new Date($scope.item.tglMasuk),
                        y = date.getFullYear(),
                        m = date.getMonth() + 1;

                    if (m < 10) {
                        m = '0' + m;
                    }

                    var filter = m + '-' + y;


                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filter
                    });
                }else{

                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue
                    });
               
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                });

                var allData = dataGrid.dataSource.data();
                var params = dataGrid.dataSource.filter();
                var query = new kendo.data.Query(allData);
                $scope.filteredData = query.filter(params).data;
            }
            $scope.resetFilters = function () {
                var gridData = $("#gridDataPegawai").data("kendoGrid");
                gridData.dataSource.filter({});
                $scope.item = {};
                $scope.filteredData = [];
            };
            $scope.riwayat = function (data) {
                if (!data) {
                    messageContainer.error('Pegawai belum di pilih');
                    return;
                }                
            }
            
            function showDetail(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            }

            $scope.closeHistory = function () {
                $scope.title = "Data Pegawai";
                $scope.klikRiwayat = false;
            }



            $scope.simpanAtasan = function (data) {
                var listRawRequired = [
                    "dataItem.atasanPejabatPenilai|k-ng-model|Atasan pejabat penilai",
                    "dataItem.atasanLangsung|k-ng-model|Atasan langsung",
                    "dataItem.idPegawai|ng-model|Pegawai",
                ];

                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var dataModel = [], itemSend;
                    if (!$scope.dataItem.atasanPejabatPenilai.id || $scope.dataItem.atasanPejabatPenilai.id === "") {
                        itemSend = {
                            pegawai: { id: $scope.dataItem.idPegawai },
                            atasanLangsung: $scope.dataItem.atasanLangsung,
                            statusEnabled: $scope.dataItem.action ? false : true
                        }
                    } else {
                        itemSend = {
                            pegawai: { id: $scope.dataItem.idPegawai },
                            atasanLangsung: $scope.dataItem.atasanLangsung,
                            atasanPejabatPenilai: $scope.dataItem.atasanPejabatPenilai,
                            statusEnabled: true
                        }
                    }
                    dataModel.push(itemSend);
                    ManageSdmNew.saveData(dataModel, "sdm/save-mapping-pegawai-to-atasan").then(function (e) {
                        // grid.dataSource.add($scope.item);
                        init();
                    });
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            $scope.cetakReport = function () {
                $scope.report = {};
                $scope.dialogReport.setOptions({
                    width: 400,
                    title: 'Report Pegawai RSABHK'
                })
                $scope.dialogReport.center();
                $scope.dialogReport.open();
            }

            $scope.toogleClick = function () {
                var grid = $("#gridDataPegawai").data("kendoGrid");
                if ($scope.username == "Show") {
                    grid.showColumn(2);
                    $scope.username = "Hide"
                } else if ($scope.username == "Hide") {
                    grid.hideColumn(2);
                    $scope.username = "Show"
                }

            }
        // * BATAS SUCI *//
        }
    ]);
});