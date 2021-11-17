define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KepatuhanHandHygieneCtrl', ['$state', '$q', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($state, $q, $scope, cacheHelper, dateHelper, medifirstService) {
            
            $scope.isRouteLoading = false;
            // $scope.item.periodeAwal = new Date();
            // $scope.item.periodeAkhir = new Date();
            $scope.item = {};
            $scope.cari = {};
            $scope.now = new Date();
            var norec = '';
            $scope.monthUngkul = {
                start: "year",
                depth: "year"
            }

            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }

            $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                }
            }
                  

            LoadCombo();
            function LoadCombo() {
                var chacePeriode = cacheHelper.get('KepatuhanHandHygieneCtrl');
                if (chacePeriode != undefined) {
                    $scope.item.periodeAwal = new Date(chacePeriode[0]);;
                    $scope.item.periodeAkhir = new Date(chacePeriode[1]);

                    if (chacePeriode[2] != undefined) {
                        $scope.item.pegawai = chacePeriode[2]
                    }

                    if (chacePeriode[3] != undefined) {
                        $scope.item.profesor = chacePeriode[3]
                    }

                    if (chacePeriode[4] != undefined) {
                        $scope.item.bangsal = chacePeriode[4]
                    }

                    if (chacePeriode[5] != undefined) {
                        $scope.item.indikasi = chacePeriode[5]
                    }

                    // if (chacePeriode[6] != undefined) {
                    //     $scope.listRuangan = [chacePeriode[6]]
                    //     $scope.item.ruangan = chacePeriode[6]
                    // }

                    // if (chacePeriode[7] != undefined) {
                    //     $scope.item.listKelompokPasien = [chacePeriode[7]]
                    //     $scope.item.kelompokpasien = chacePeriode[7]
                    // }

                    // if (chacePeriode[8] != undefined) {
                    //     $scope.item.dokter = chacePeriode[8]
                    //     $scope.item.listDokter2 = chacePeriode[8]
                    // }

                    // if (chacePeriode[9] != undefined) {
                    //     $scope.item.jmlRows = chacePeriode[9]
                    // }

                } else {
                    $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))
                    
                }
                 medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listRuang = data;
                });
                medifirstService.get("sysadmin/general/get-datacombo-handhygiene-general", true, true, 20).then(function (data) {
                    $scope.listHand = data.data;
                });
                 medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                    $scope.listDepartemen = data;
                });
                 medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-general", true, true, 20).then(function (data) {
                    $scope.listJenisPegawai = data;
                });
                  medifirstService.get("sysadmin/general/get-datacombo-indikasi-general", true, true, 20).then(function (data) {
                    $scope.listIndikasi = data.data;
                });
                 medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                $scope.listPegawai = data
                });
                
                $scope.item.bulan = moment($scope.now).format('MMMM');
                $scope.item.tanggal = moment(new Date()).format('YYYY-MM-DD HH:mm'); 
                // $scope.listStatus = [{ "id": "1", "langkah": "Melakukan tapi salah" }, { "id": "0", "langkah": "Tidak Melakukan" }, { "id": "2", "langkah": "melakukan dengan" }, { "id": "4", "namaExternal": "Lunas" }]   
                // init();    
            }
           
            
             $scope.group = {
                field: "namaruangan",
                aggregates: [
                    // {
                    //     field: "pasien",
                    //     aggregate: "count"
                    // }, 
                    {
                        field: "namaruangan",
                        aggregate: "count",
                    }]
            };
            $scope.aggregate = [
                // {
                //     field: "pasien",
                //     aggregate: "count"
                // }, 
                {
                    field: "namaruangan",
                    aggregate: "count"
                }]
            $scope.optionGridMaster = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Surveilans Ruangan" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                selectable: 'row',
                scrollable: false,
                pageable: true,
                columns: 
                [
                    // { 
                    //    "field": "no",
                    //    "title": "No",
                    //    "width": "50px",
                    //    attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: center;"
                    //     } 
                      
                    // },
                    { 
                       "field": "tanggal", 
                       "title": "Tanggal",
                       "template": "<span class='style-center'>#: tanggal #</span>",
                       "width": "200px"
                       
                    },
                    { 
                       "field": "namaruangan", 
                       "title": "Nama Ruangan",
                       "width": "200px"
                       
                    },
                    { 
                       "field": "jenispegawai", 
                       "title": "Profesi",
                       "width": "200px"
                       
                    },
                    { 
                       "field": "namalengkap", 
                       "title": "Nama Pegawai",
                       "width": "200px"
                       
                    },
                    { 
                       "field": "indikasi", 
                       "title": "Moment",
                       "width": "200px"
                       
                    }, 
                    // { 
                    //    "field": "indikasi", 
                    //    "title": "Indikasi",
                    //    "width": "200px"
                       
                    // }, 
                    { 
                       "field": "tindakan", 
                       "title": "Metode",
                       "width": "200px"
                       
                    },                
                    
                    { 
                       "field": "langkah", 
                       "title": "Audit Cuci tangan",
                       "width": "200px"
                       
                    },
                    { 
                       "field": "kesempatan", 
                       "title": "Kesempatan ke",
                       "width": "200px",
                       groupFooterTemplate: "Rata-rata",
                       footerTemplate: "Total Rata-rata"
                       
                    },                
                    { 
                       "field": "snilailangkah", 
                       "title": "Total Nilai",
                       "width": "200px",
                       aggregates: ["average"],
                       groupFooterTemplate: "<span class='style-left'> #= kendo.toString(data.nilailangkah.average, '0.00')# %",
                       footerTemplate: "<span class='style-left'> #= kendo.toString(data.nilailangkah.average, '0.00')# %"
                    }              
                    
                    

                ],
            }

            function textareaNameEditor(container, options) {
                $('<textarea required name="' + options.field + '" cols="20" row="4" style="line-height: 6em;"></textarea>')
                    .appendTo(container)
            }

            $scope.cariFilter = function () {
                init()
            }

            function init() {
                $scope.isRouteLoading = false;
               var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                var peg = ""
                var tempNoReg = "";
                if ($scope.item.pegawai != undefined) {
                    var peg = "&pgid=" + $scope.item.pegawai.value
                    tempNoReg =  { value: $scope.item.pegawai.value, text: $scope.item.pegawai.namalengkap }
                }
                var pr = ""
                var temppr = "";
                if ($scope.item.profesor != undefined) {
                    var pr = "&prid=" + $scope.item.profesor.value
                    temppr =  { value: $scope.item.profesor.value, text: $scope.item.profesor.jenispegawai }


                }
                var bng = ""
                var tembng = "";
                if ($scope.item.bangsal != undefined) {
                    var bng = "&bngid=" + $scope.item.bangsal.value
                    tembng =  { value: $scope.item.bangsal.value, text: $scope.item.bangsal.namaruangan }


                }
                var ind = ""
                var temindikasi = "";
                if ($scope.item.indikasi2 != undefined) {
                    var ind = "&indikasiid=" + $scope.item.indikasi2.value
                    temindikasi =  { value: $scope.item.indikasi2.value, text: $scope.item.indikasi2.indikasi }


                }               
                medifirstService.get('emr/get-data-kepatuhan-handhygiene?' + "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir + peg + pr + bng + ind
                    ).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        for (let index = 0; index < datas.length; index++) {
                                datas[index].no = index + 1;
                                var langkah = datas[index].langkah
                                if (langkah==0){
                                  datas[index].nilailangkah=0
                                  datas[index].snilailangkah="0 %"
                                } else if (langkah==1){
                                  datas[index].nilailangkah=50
                                  datas[index].snilailangkah="50 %"
                                } else if (langkah==2){
                                  datas[index].nilailangkah=100
                                  datas[index].snilailangkah="100 %"
                                }
                                if(  datas[index].objectindikasifk != null){
                                  var inidikasiArr =   datas[index].objectindikasifk .split(',')
                                    var a = ''
                                       var b =''
                                  for (var i = 0; i < inidikasiArr.length; i++) {
                                     var elem = inidikasiArr[i]
                                    
                                       var listIndikasi =''
                                    for (var u = 0; u < $scope.listIndikasi.length; u++) {
                                       var indik = $scope.listIndikasi[u]
                                       
                                       if(indik.value == elem){
                                        var c = indik.indikasi
                                          b = "," + c
                                           a = a + b
                                       }
                                    }
                                     listIndikasi = a.slice(1, a.length)
                                      datas[index].indikasi =listIndikasi
                                  }
                                }

                                 if(  datas[index].objecthygienefk != null){
                                  var objecthygienefkArr =   datas[index].objecthygienefk .split(',')
                                    var a = ''
                                       var b =''
                                  for (var i = 0; i < objecthygienefkArr.length; i++) {
                                     var elem = objecthygienefkArr[i]
                                    
                                       var listHand =''
                                    for (var u = 0; u < $scope.listHand.length; u++) {
                                       var indik = $scope.listHand[u]
                                       
                                       if(indik.value == elem){
                                        var c = indik.tindakan
                                          b = "," + c
                                           a = a + b
                                       }
                                    }
                                     listHand = a.slice(1, a.length)
                                      datas[index].tindakan =listHand
                                  }
                                }
                            }
                        $scope.dataSource = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema:{
                              model:{
                                fields:{
                                  nilailangkah: {type: "number"},
                                  namalengkap: {type: "string"}
                                }
                              }
                            },
                            group:{
                              field: "namalengkap", aggregates: [
                                { field: "nilailangkah", aggregate: "average" }
                              ]
                            },
                            aggregate:[{ field: "nilailangkah", aggregate: "average"}]
                
                        });
                        var chacePeriode = {
                        0: tglAwal,
                        1: tglAkhir,
                        2: tempNoReg,
                        3: temppr,
                        4: tembng,
                        5: temindikasi,
                        
                    }
                    
                    cacheHelper.set('KepatuhanHandHygieneCtrl', chacePeriode);
                    },function (error) {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            }
            function loadData() {
                // $scope.item = {}
                $scope.isRouteLoading = false;
                var tanggal = parseFloat(moment($scope.item.bulan).format('MM'));               
                medifirstService.get('emr/get-data-kepatuhan-cuci-tanganload?&bulan=' + tanggal
                    ).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        for (let index = 0; index < datas.length; index++) {
                                datas[index].no = index + 1;
                            }
                        $scope.bambang = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    },function (error) {
                    $scope.isRouteLoading = false;
                    var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                    throw error;
                })
                    
            }
            $scope.Tambah = function () {
                // $scope.item = {}
                $scope.isRouteLoading = false;
                $scope.isEdit = false
                $scope.disabledText = false
                $scope.dialogPopup.center().open()
                
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
            }
            $scope.Edit = function () {
                // $scope.item = {}
                $scope.isRouteLoading = true;
                var tanggal = parseFloat(moment($scope.item.bulan).format('MM'));               
                medifirstService.get('emr/get-data-kepatuhan-handhygiene?&bulan=' + tanggal
                    ).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        for (let index = 0; index < datas.length; index++) {
                                datas[index].no = index + 1;
                            }
                        $scope.bambang = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    })
                $scope.isRouteLoading = false;
                $scope.isEdit = false
                $scope.disabledText = false
                $scope.dialogPopup.center().open()
            }
            $scope.clickedPopup = function () {
                $scope.item = {}
                $scope.dialogPopup.close();
            }
            $scope.Batal = function () {
                // $scope.item = {}
                $scope.dialogPopup.close();
            }
            $scope.Batal2 = function () {
                $scope.item = {}
                $scope.dialogPopup2.close();
            }
            $scope.lihatDetail = function () {
                init();
            }

            $scope.currentlistIndikasi = [];
            $scope.addlistIndikasi= function (data) {
                var index = $scope.currentlistIndikasi.indexOf(data);
                if (_.filter($scope.currentlistIndikasi, {
                    value: data.value
                }).length === 0)
                    $scope.currentlistIndikasi.push(data);
                else {
                    $scope.currentlistIndikasi.splice(index, 1);
                }
            }
            $scope.currentlistHand = [];
            $scope.addlistHand= function (data) {
                var index = $scope.currentlistHand.indexOf(data);
                if (_.filter($scope.currentlistHand, {
                    value: data.value
                }).length === 0)
                    $scope.currentlistHand.push(data);
                else {
                    $scope.currentlistHand.splice(index, 1);
                }
            }

            $scope.Save = function () {
                var listRawRequired = [
                    // "item.indikator|k-ng-model|Indikator",
                    // "item.jenisIndikator|k-ng-model|Jenis Indikator",
                    // "item.Departemen|k-ng-model|Departemen"
                ]
                var listIndikasi = ""
                        var a = ""
                        var b = ""
                        for (var i = $scope.currentlistIndikasi.length - 1; i >= 0; i--) {
                            var c = $scope.currentlistIndikasi[i].value
                            b = "," + c
                            a = a + b
                        }
                        listIndikasi = a.slice(1, a.length)
                var listHand = ""
                        var a = ""
                        var b = ""
                        for (var i = $scope.currentlistHand.length - 1; i >= 0; i--) {
                            var c = $scope.currentlistHand[i].value
                            b = "," + c
                            a = a + b
                        }
                        listHand = a.slice(1, a.length)
                    
                var isValid = medifirstService.setValidation($scope, listRawRequired);
                if (isValid.status) {

                    var data = {
                        "norec" : norec,
                        "tanggal" :moment($scope.item.tanggal).format('YYYY-MM-DD HH:mm'),                        
                        "objectruanganfk" :$scope.item.objectruanganfk != undefined ? $scope.item.objectruanganfk.value : null,
                        "objectjenispegawaifk" :$scope.item.objectjenispegawaifk != undefined ? $scope.item.objectjenispegawaifk.value : null,
                        "objectpegawaifk" :$scope.item.objectpegawaifk != undefined ? $scope.item.objectpegawaifk.value : null,
                        "objectindikasifk" :listIndikasi != undefined ? listIndikasi : null,
                        "objecthygienefk" :listHand != undefined ? listHand : null,
                        "langkah" :$scope.item.langkah != undefined ? $scope.item.langkah : 0,
                        "kesempatan" :$scope.item.kesempatan != undefined ? $scope.item.kesempatan : 0,

                        
                    }
                    medifirstService.post("emr/save-kepatuhanhandhygiene", data).then(function (e) {
                        init();
                        loadData();
                        // $scope.item = {}
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
                $scope.isRouteLoading = false;
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
                
            }

            $scope.resetFilter = function () {
                $scope.cari = {};
                init()
            }
            $scope.edit = function (bool) {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                for (var i = 0; i < $scope.listIndikasi.length; i++) {
                  $scope.listIndikasi[i].isChecked =false
                }
                 for (var i = 0; i < $scope.listHand.length; i++) {
                  $scope.listHand[i].isChecked =false
                }
                norec = $scope.dataSelect.norec;
                $scope.item.tanggal = new Date($scope.dataSelect.tanggal);
                $scope.item.langkah = $scope.dataSelect.langkah;
                $scope.item.objectjenispegawaifk = { value: $scope.dataSelect.objectjenispegawaifk, text: $scope.dataSelect.jenispegawai };
                $scope.item.objectpegawaifk = { value: $scope.dataSelect.objectpegawaifk, text: $scope.dataSelect.namalengkap };
                // $scope.item.objectindikasifk = { value: $scope.dataSelect.objectindikasifk, text: $scope.dataSelect.indikasi };
                // $scope.item.objecthygienefk = { value: $scope.dataSelect.objecthygienefk, text: $scope.dataSelect.tindakan };
                $scope.item.objectruanganfk = { value: $scope.dataSelect.objectruanganfk, text: $scope.dataSelect.namaruangan };
                $scope.currentlistIndikasi =[]
                var penjaminsLaka = $scope.dataSelect.objectindikasifk.split(',')
             
                for (var i = penjaminsLaka.length - 1; i >= 0; i--) {
                
                  var elem = penjaminsLaka[i]
                  for (var x =  $scope.listIndikasi.length - 1; x >= 0; x--) {
                    var elem2=  $scope.listIndikasi[x]
                    if(elem == elem2.value){
                          elem2.isChecked = true
                          var dataid = {
                              "text": elem2.text,
                              "indikasi": elem2.indikasi,
                              "value": elem
                          }
                          $scope.currentlistIndikasi.push(dataid)
                        }
                  }
                 }
                 $scope.currentlistHand =[]
                var penjaminsLaka = $scope.dataSelect.objecthygienefk.split(',')
             
                for (var i = penjaminsLaka.length - 1; i >= 0; i--) {
                
                  var elem = penjaminsLaka[i]
                  for (var x =  $scope.listHand.length - 1; x >= 0; x--) {
                    var elem2=  $scope.listHand[x]
                    if(elem == elem2.value){
                          elem2.isChecked = true
                          var dataid = {
                              "text": elem2.text,
                              "indikasi": elem2.indikasi,
                              "value": elem
                          }
                          $scope.currentlistHand.push(dataid)
                        }
                  }
                 }

               
                
                $scope.dialogPopup.center().open()
                if (bool) {
                    $scope.isEdit = true
                    $scope.disabledText = true
                } else {
                    $scope.isEdit = false
                    $scope.disabledText = false
                }
            }
            $scope.klikGrid = function (current) {
                toastr.info(current.tanggal + " Terpilih");
                $scope.current = current;
                console.log(JSON.stringify($scope.current));
            }
            $scope.hapus = function () {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                var data = {
                    "norec":$scope.dataSelect.norec,
                }
                medifirstService.post('emr/batal-kepatuhan-handhygiene',data).then(function (e) {
                    init();
                    loadData();
                    $scope.item = {}
                });
                 // medifirstService.post("emr/batal-kepatuhan-cuci-tangan", data).then(function (e) {
                 //        init();
                 //        $scope.item = {}
                 //    });
            }
            function deleteRow(e) {
                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var data = {
                    "id": dataItem.id,
                    "statusenabled": false,
                    "definisioperasional": dataItem.definisioperasional,
                    "formula": dataItem.formula,
                    "indikator": dataItem.indikator,
                    "pic": dataItem.pic,
                    "jenisindikatorfk": dataItem.jenisindikatorfk,
                    "numerator": dataItem.numerator,
                    "denominator": dataItem.denominator,

                }
                medifirstService.post("sysadmin/general/rensar/save-master-indikator", data).then(function (e) {
                    loadData();
                    $scope.item = {}
                });
            }
            function editRow(e) {
                e.preventDefault();
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem) {
                    $scope.item.id = dataItem.id
                    $scope.item.indikator = dataItem.indikator
                    $scope.item.pic = dataItem.pic
                    $scope.item.jenisIndikator = { id: dataItem.jenisindikatorfk, jenisindikator: dataItem.jenisindikator }
                    $scope.item.formula = dataItem.formula
                    $scope.item.denominator = dataItem.denominator
                    $scope.item.numerator = dataItem.numerator
                    $scope.item.do = dataItem.definisioperasional
                    $scope.dialogPopup.center().open()
                }

            }            

            $scope.formatTanggalAjah = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }
            var timeoutPromise;
            $scope.$watch('cari.indikator', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("indikator", newVal)
                    }
                }, 500)
            })
            $scope.$watch('cari.pic', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal != oldVal) {
                        applyFilter("pic", newVal)
                    }
                }, 500)
            })

            $scope.$watch('cari.jenisIndikator', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    applyFilter("jenisindikator", newVal.jenisindikator)
                }
            })

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#gridMaster").data("kendoGrid");
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

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }

            $scope.resetFilter = function () {
                var dataGrid = $("#gridMaster").data("kendoGrid");
                dataGrid.dataSource.filter({});
                $scope.cari = {};
            }

            $scope.$watch('item.numerator', function(newValue, oldValue) {
                if (newValue != oldValue  ) {
                    var text = '';
                    var num = '';
                    var denom = '';
                    if ($scope.item.numerator == undefined ) {
                        text =  num + ' / '  + $scope.item.denominator + ' ' + ' x 100%' 
                    }else if($scope.item.denominator == undefined ) {
                        text =  $scope.item.numerator + ' / '  + denom + ' '  + ' x 100%' 
                    }else{
                        text =  $scope.item.numerator + ' / '  + $scope.item.denominator + ' '  + ' x 100%' 
                    }                    
                    $scope.item.formula = text
                }
            });

            $scope.$watch('item.denominator', function(newValue, oldValue) {
                if (newValue != oldValue  ) {
                    var text = $scope.item.numerator + ' / '  + $scope.item.denominator + 'x 100%'
                    $scope.item.formula = text
                }
            });

            //** BATAS SUCI */
        }
    ])
})