define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KepatuhanCuciTanganCtrl', ['$q', '$scope', '$timeout', 'MedifirstService',
        function ($q, $scope, $timeout, medifirstService) {
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.cari = {};
            $scope.now = new Date();
            var norec = '';
            LoadCombo();
            init();
            init2();

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

            function LoadCombo() {
                $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-01 00:00'));
                $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'))

                medifirstService.getPart("sysadmin/general/get-datacombo-ruangan", true, true, 20).then(function (data) {
                    $scope.listRuang = data;
                });
                
                $scope.item.bulan =$scope.now;
                $scope.item.tanggal = moment(new Date()).format('YYYY-MM-DD HH:mm');    
                // init();   
                
                medifirstService.get("sysadmin/general/get-datacombo-indikasi-general", true, true, 20).then(function (data) {
                    $scope.listIndikasi = data.data;
                });
                medifirstService.getPart("sysadmin/general/get-datacombo-jenispegawai-general", true, true, 20).then(function (data) {
                    $scope.listJenisPegawai = data;
                });
                medifirstService.getPart('emr/get-datacombo-part-pegawai', true, true, 20).then(function (data) {
                    $scope.listPegawai = data
                });
                medifirstService.get("sysadmin/general/get-datacombo-handhygiene-general", true, true, 20).then(function (data) {
                    $scope.listHand = data.data;
                });
            }

            $scope.cariFilter = function () {
                init()
            }

            function init() {
                $scope.isRouteLoading = true;
                var tanggal = parseFloat(moment($scope.item.bulan).format('MM'));
                var bln = ''
                if ($scope.item.bulan != undefined) {
                    bln = moment($scope.item.bulan).format('YYYY-MM')
                }               
                medifirstService.get('emr/get-data-kepatuhan-handhygiene-ipcn?bln='+ bln).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        var month = new Array();
                          month[1] = "Januari";
                          month[2] = "Februari";
                          month[3] = "Maret";
                          month[4] = "April";
                          month[5] = "Mei";
                          month[6] = "Juni";
                          month[7] = "Juli";
                          month[8] = "Agustus";
                          month[9] = "September";
                          month[10] = "Oktober";
                          month[11] = "November";
                          month[12] = "Desember";
                        for (var i = 0; i < datas.length; i++) {
                                datas[i].no = i + 1;
                                datas[i].bulantahun = month[datas[i].bulan] + ' ' + datas[i].tahun
                            }
                        $scope.dataSource = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 100,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        namaruangan: {type: "string"}
                                    }
                                }
                            },
                            group:{
                                field: "namaruangan"
                            }
                        });
                    },function (error) {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            }

            $scope.optionGridMaster = {
                toolbar: ["excel"],
                excel: {
                    fileName: "Data Surveilans Ruangan" + moment($scope.now).format('DD/MMM/YYYY'),
                    allPages: true,
                },
                pageable: true,
                columns: 
                [
                    { 
                       "field": "bulantahun", 
                       "title": "Bulan",
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
                       "field": "patuh", 
                       "title": "Patuh",
                       "width": "200px"
                    },
                    { 
                       "field": "tidakpatuh", 
                       "title": "Tidak Patuh",
                       "width": "200px"
                    }
                ],
            }

            $scope.Tambah = function () {
                // $scope.item = {}
                $scope.isRouteLoading = false;
                $scope.isEdit = false
                $scope.disabledText = false
                $scope.dialogPopup.center().open()
            }
            
            $scope.Batal2 = function () {
                $scope.item = {}
                $scope.dialogPopup2.close();
            }

            $scope.edit = function (bool) {
                if ($scope.dataSelect == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                norec = $scope.dataSelect.norec;
                $scope.item.tanggal = new Date($scope.dataSelect.tanggal);
                $scope.item.doktersp_p = $scope.dataSelect.doktersp_p;
                $scope.item.doktersp_t = $scope.dataSelect.doktersp_t;
                $scope.item.dokteru_p = $scope.dataSelect.dokteru_p;
                $scope.item.dokteru_t = $scope.dataSelect.dokteru_t;
                $scope.item.perawat_p = $scope.dataSelect.perawat_p;
                $scope.item.perawat_t = $scope.dataSelect.perawat_t;
                $scope.item.penunjang_p = $scope.dataSelect.penunjang_p;
                $scope.item.penunjang_t = $scope.dataSelect.penunjang_t;
                $scope.item.administrasi_p = $scope.dataSelect.administrasi_p;
                $scope.item.administrasi_t = $scope.dataSelect.administrasi_t;
                $scope.item.coas_p = $scope.dataSelect.coas_p;
                $scope.item.coas_t = $scope.dataSelect.coas_t;
                $scope.item.siswa_p = $scope.dataSelect.siswa_p;
                $scope.item.siswa_t = $scope.dataSelect.siswa_t;
                $scope.item.lain_p = $scope.dataSelect.lain_p;
                $scope.item.lain_t = $scope.dataSelect.lain_t;
                $scope.item.noruanganfk = { value: $scope.dataSelect.noruanganfk, text: $scope.dataSelect.namaruangan };
                
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

            $scope.formatTanggalAjah = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY');
            }

            $scope.cariFilter2 = function () {
                init2()
            }

            function init2() {
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
                medifirstService.get('emr/get-data-kepatuhan-handhygiene?' + "tglAwal=" + tglAwal +
                        "&tglAkhir=" + tglAkhir + peg + pr + bng
                    ).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data;
                        for (let index = 0; index < datas.length; index++) {
                                datas[index].no = index + 1;
                                datas[index].statCheckbox = false
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
                        $scope.dataSource2 = new kendo.data.DataSource({
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
                    },function (error) {
                    $scope.isRouteLoading = false;
                    throw error;
                })
            }

            $scope.optionGridMaster2 = {
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
                       groupFooterTemplate: "<span class='style-left'> #= kendo.toString(data.nilailangkah?.average, '0.00')# %",
                       footerTemplate: "<span class='style-left'> #= kendo.toString(data.nilailangkah?.average, '0.00')# %"
                    },
                    {
                        "field": "isverif",
                        "title": "Verifikasi",
                        "width":"60px",
                        "template": '# if( isverif==true) {# ✔ # } else {# - #} #'
                    }           
                ],
            }

            $scope.Tambah2 = function () {
                // $scope.item = {}
                $scope.isRouteLoading = false;
                $scope.isEdit = false
                $scope.disabledText = false
                $scope.dialogPopup3.center().open()
                
                var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');
            }

            $scope.Save2 = function () {
                var listRawRequired = [
                    "item.objectruanganfk|k-ng-model|Ruangan",
                    "item.objectjenispegawaifk|k-ng-model|Profesi yang di audit",
                    "item.objectpegawaifk|k-ng-model|Pegawai"
                ]

                var listIndikasi = []
                $scope.listIndikasi.map(function(item){
                    if(item.isChecked == true){
                        listIndikasi.push(item.value)
                    }
                })

                var listHand = []
                $scope.listHand.map(function(item){
                    if(item.isChecked == true){
                        listHand.push(item.value)
                    }
                })

                if(listIndikasi.length <= 0){
                    toastr.error('Pilih indikasi dulu')
                    return
                }

                if(listHand.length <= 0){
                    toastr.error('Pilih tindakan dulu')
                    return
                }
                    
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
                        init2();
                        $scope.dialogPopup3.close()

                        // reset
                        listIndikasi = []
                        $scope.listIndikasi.map(function(item){
                            item.isChecked = false
                        })
                        listHand = []
                        $scope.listHand.map(function(item){
                            item.isChecked = false
                            
                        })
                        $scope.item.objectruanganfk = null
                        $scope.item.objectjenispegawaifk = null
                        $scope.item.objectpegawaifk = null
                        $scope.item.langkah = null
                        $scope.item.kesempatan = null
                        norec = ''
                        $scope.dataSelect2 = null
                    });
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
                $scope.isRouteLoading = false;
            }
            $scope.Batal3 = function () {
                $scope.dialogPopup3.close();
            }
            $scope.edit2 = function (bool) {
                if ($scope.dataSelect2 == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                for (var i = 0; i < $scope.listIndikasi.length; i++) {
                  $scope.listIndikasi[i].isChecked =false
                }
                 for (var i = 0; i < $scope.listHand.length; i++) {
                  $scope.listHand[i].isChecked =false
                }
                norec = $scope.dataSelect2.norec;
                $scope.item.tanggal = new Date($scope.dataSelect2.tanggal);
                $scope.item.langkah = $scope.dataSelect2.langkah;
                $scope.item.kesempatan = $scope.dataSelect2.kesempatan
                $scope.item.objectjenispegawaifk = { value: $scope.dataSelect2.objectjenispegawaifk, text: $scope.dataSelect2.jenispegawai };
                $scope.item.objectpegawaifk = { value: $scope.dataSelect2.objectpegawaifk, text: $scope.dataSelect2.namalengkap };
                // $scope.item.objectindikasifk = { value: $scope.dataSelect2.objectindikasifk, text: $scope.dataSelect2.indikasi };
                // $scope.item.objecthygienefk = { value: $scope.dataSelect2.objecthygienefk, text: $scope.dataSelect2.tindakan };
                $scope.item.objectruanganfk = { value: $scope.dataSelect2.objectruanganfk, text: $scope.dataSelect2.namaruangan };
                $scope.currentlistIndikasi =[]

                var selectedIndikasi = $scope.dataSelect2.objectindikasifk.split(',')
                for (var i = selectedIndikasi.length - 1; i >= 0; i--) {
                
                    var elem = selectedIndikasi[i]
                    for (var x =  $scope.listIndikasi.length - 1; x >= 0; x--) {
                        var elem2=  $scope.listIndikasi[x]
                        if(elem == elem2.value){
                            elem2.isChecked = true
                            
                        }
                    }
                }

                var selectedTindakan = $scope.dataSelect2.objecthygienefk.split(',')
                for (var i = selectedTindakan.length - 1; i >= 0; i--) {
                
                    var elem = selectedTindakan[i]
                    for (var x =  $scope.listHand.length - 1; x >= 0; x--) {
                        var elem2=  $scope.listHand[x]
                        if(elem == elem2.value){
                            elem2.isChecked = true
                        }
                    }
                }
                
                $scope.dialogPopup3.center().open()
                if (bool) {
                    $scope.isEdit = true
                    $scope.disabledText = true
                } else {
                    $scope.isEdit = false
                    $scope.disabledText = false
                }
            }
            $scope.hapus2 = function () {
                if ($scope.dataSelect2 == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }

                var data = {
                    "norec":$scope.dataSelect2.norec,
                }
                medifirstService.post('emr/batal-kepatuhan-handhygiene',data).then(function (e) {
                    init2();
                });
            }
            $scope.Verifikasi = function () {
                if($scope.selectedOnCheck.length == 0) {
                    alert("Harap pilih data yang akan diverifikasi!")
                    return;
                }
                
                var json = {
                    data: $scope.selectedOnCheck
                }
                $scope.isRouteLoading = true;
                medifirstService.post('emr/verifikasi-kepatuhan-handhygiene/true', json).then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.selectedOnCheck = []
                    init2();
                })
            }

            //** BATAS SUCI */
        }
    ])
})