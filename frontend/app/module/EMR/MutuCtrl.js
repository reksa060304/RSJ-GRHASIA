define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('MutuCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService','$parse',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService, $parse) {
            $scope.item = {};
            $scope.cc = {};
            $scope.dataVOloaded = true;
            $scope.item.tglPelayanan = $scope.now;
            $scope.now = new Date();
            $scope.currentNorecPD = $state.params.norecPD;
            $scope.currentNorecAPD = $state.params.noRec;
            var a = [];
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            var namaEMR = ''
            var nomorEMR = '-'
            var dataLoad = [];
            $scope.tombolSimpanVis = true;
            $scope.isRiwayat = true
            // $scope.header = {}
            var myVar = 0
            var paramSearch =''



            // LoadCache()
            // cacheHelper.get('cacheNomorEMR',undefined);;
            LoadCacheHelper();

            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRMelektronik');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
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
                    $scope.cc.DataNoregis = chacePeriode[13]
                    $scope.cc.norec_emr = '-'
                    // if (nomorEMR == '') {
                    //     $scope.cc.norec_emr = ''
                    // } else {
                    //     $scope.cc.norec_emr = nomorEMR
                    // }

                    // $scope.item.noMr = chacePeriode[0]
                    // nocm_str = chacePeriode[0]
                    // $scope.item.namaPasien = chacePeriode[1]
                    // $scope.item.jenisKelamin = chacePeriode[2]
                    // $scope.item.noregistrasi = chacePeriode[3]
                    // $scope.item.umur = chacePeriode[4]
                    // $scope.item.kelompokPasien = chacePeriode[5]
                    // $scope.item.tglRegistrasi = chacePeriode[6]
                    // norec_apd = chacePeriode[7]
                    // norec_pd = chacePeriode[8]
                    // $scope.item.idKelas = chacePeriode[9]
                    // $scope.item.kelas = chacePeriode[10]
                    // $scope.item.idRuangan = chacePeriode[11]
                    // $scope.item.namaRuangan = chacePeriode[12]
                    // $scope.header.DataNoregis = chacePeriode[13]
                    // if ($scope.header.DataNoregis == undefined) {
                    //     $scope.header.DataNoregis = false;
                    // }
                    
                    // if ($scope.cc.DataNoregis == undefined) {
                    //     $scope.cc.DataNoregis = false;
                    // }
                    // if ($scope.cc.DataNoregis == true) {
                        paramSearch ='noregistrasi=' + $scope.cc.noregistrasi
                    // } else {
                        // paramSearch ='nocm=' + $scope.cc.nocm
                    // }
                    loadPertama()
                }

                // init()
            }

            function loadPertama() {
                $scope.item.jumlah = 1;
                $scope.isRouteLoading = true;
                medifirstService.get("sysadmin/general/get-tgl-posting", true).then(function (dat) {
                  var tgltgltgltgl = dat.data.mindate[0].max
                  var tglkpnaja = dat.data.datedate
                  $scope.minDate = new Date(tgltgltgltgl);
                  $scope.maxDate = new Date($scope.now);
                  $scope.startDateOptions = {
                    disableDates: function (date) {
                      var disabled = tglkpnaja;
                      if (date && disabled.indexOf(date.getDate()) > -1) {
                        return true;
                      } else {
                        return false;
                      }
                    }
                  };
                })
                medifirstService.get("tatarekening/tindakan/get-pasien-bynorec?norec_pd="
                  + $scope.cc.norec_pd
                  + "&norec_apd="
                  + $scope.currentNorecAPD)
                  .then(function (e) {
                    $scope.isRouteLoading = false;
                    $scope.item.pasien = e.data[0];    
                    medifirstService.getDataDummyPHPV2("tatarekening/tindakan/get-mutu?idRuangan="
                      + $scope.item.pasien.objectruanganfk
                      + "&idKelas="
                      + $scope.item.pasien.objectkelasfk
                      + "&idJenisPelayanan="
                      + $scope.item.pasien.objectjenispelayananfk
                      , true, 10, 10)
                      .then(function (x) {
                        $scope.listProduk = x;
                      })
                  });
                  medifirstService.get("tatarekening/tindakan/get-riwayat-mutu?norec_pd=" + $scope.cc.norec_pd , true).then(function (dat) {
                    $scope.dataDaftar = new kendo.data.DataSource({
                        data: dat.data,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                });
              }

            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                    init()
                }
                else {
                    paramSearch ='nocm=' + $scope.cc.nocm
                    init()
                }
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.Batal = function () {
                $scope.item.obj = []
            }
            loadEMR()
            function loadEMR() {
                if (nomorEMR == '-') {
                    medifirstService.get("emr/get-rekam-medis-dynamic?emrid=147").then(function (e) {
                        $scope.listData = e.data
                        $scope.item.title = e.data.title
                        $scope.item.classgrid = e.data.classgrid

                        $scope.cc.emrfk = '147'
                        $scope.item.objcbo = []



                    })
                } else {
                    var chekedd = false
                    //medifirstService.get("emr/get-emr-transaksi-detail?noemr="+$state.params.nomorEMR, true).then(function(dat){
                    medifirstService.get("emr/get-rekam-medis-dynamic?emrid=147").then(function (e) {
                        $scope.listData = e.data
                        $scope.item.title = e.data.title
                        $scope.item.classgrid = e.data.classgrid

                        $scope.cc.emrfk = '147'


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
                        })



                    });
                }
            }
            function setobjectToModel(nomorEMRSS,emrfk){
                medifirstService.get("emr/get-emr-transaksi-detail?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                    $scope.item.obj = []
                    $scope.item.obj2 = []
                
                    dataLoad = dat.data.data
                    cacheHelper.set('cacheVitalSign',dataLoad)
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
                })
            }
            function init() {
                $scope.isRouteLoading = true
                medifirstService.get("tatarekening/tindakan/get-riwayat-mutu?norec_pd=" + $scope.item.pasien.norec_pd , true).then(function (dat) {
                    $scope.dataDaftar = new kendo.data.DataSource({
                        data: dat.data.data,
                        pageSize: 10,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {
                                }
                            }
                        }
                    });
                
                });



                $scope.treeSourceRuangan = [];
                medifirstService.get("emr/get-menu-rekam-medis-dynamic?namaemr=navigasi").then(function (e) {
                    var inlineDefault = new kendo.data.HierarchicalDataSource({
                        data: e.data.data,
                        schema: {
                            model: {
                                children: "child",
                                expanded: true
                            }
                        }
                    });
                    $scope.treeSourceBedah = inlineDefault
                    $scope.mainTreeViewBedahOption = {
                        dataTextField: ["caption"],
                        datakKeyField: ["id"],
                        select: onSelect,
                        dragAndDrop: true,
                        checkboxes: false
                    }
                    // var treeview = $("#treeview").data("kendoTreeView");
                    // .expandPath([2, 5])
                })
            }
            $scope.Riwayat = function () {
                $scope.myVar = 2
                $scope.showRiwayatEMR = true
                loadPertama()
            }
            $scope.kembali = function(){
                window.history().back()
            }
            $scope.kembaliIsi = function () {
                $scope.myVar = 1
                $scope.showRiwayatEMR = false
            }
            $scope.hapus = function(){
                if($scope.dataSelected == undefined){
                    toastr.error('pilih data dulu')
                    return
                }
                var objSave = {
                    objSave: $scope.dataSelected
          
                  }
                medifirstService.post('tatarekening/tindakan/delete-mutu',objSave).then(function(e){
                    loadPertama()
                });
                // medifirstService.post('emr/hapus-emr-transaksi',{norec:$scope.dataSelected.norec ,emrfk:$scope.dataSelected.emrfk }).then(function(e){
                //     init()
                //     $scope.dataSelected = undefined
                // })
            }
            $scope.Save = function () {
                if ($scope.item.obj.length == 0)
                    return
                var arrobj = Object.keys($scope.item.obj)
                var arrSave = []
                for (var i = arrobj.length - 1; i >= 0; i--) {
                    arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                }
                $scope.cc.jenisemr = 'navigasi'
                var jsonSave = {
                    head: $scope.cc,

                    data: arrSave//$scope.item.obj
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    if(medifirstService.getKelompokUser() =='suster'){
                        var data ={
                            "norec_apd" :$state.params.noRec,
                            "kelompokUser" : medifirstService.getKelompokUser(),
                            "vitalsign" : true
                        }
                        medifirstService.postNonMessage('rawatjalan/save-panggil',data)
                        .then(function (res) {
                          
                        })
                    }
                    $scope.item.obj = []
                    $scope.cc.norec_emr = '-'
                    $rootScope.loadRiwayat()

                });
            }
            $scope.back = function () {
                $scope.myVar = 1
                $scope.showRiwayatEMR = false
            }
            $rootScope.showRiwayat = function () {
                $scope.showRiwayatEMR = false
            }
            $rootScope.loadRiwayat = function () {
                // debugger
                init()
            }
            $scope.klikGrid = function (dataSelected) {
                $scope.dataSelected = dataSelected
            }
            $scope.showRiwayatEMR = false
            $scope.Lihat = function () {
                if ($scope.dataSelected == undefined){
                    toastr.error('Pilih data dulu')
                    return
                }
                  
                $scope.showRiwayatEMR = false
                $scope.myVar = 1

                nomorEMR = $scope.dataSelected.noemr
                $scope.cc.norec_emr = $scope.dataSelected.noemr
                $scope.cc.emrfk = 147
                loadEMR()

            }
            $scope.create = function () {
                $scope.showRiwayatEMR = false
                $scope.myVar = 1
                nomorEMR = '-'
                $scope.cc.norec_emr = '-'
                $scope.item.obj =[]
                var noemr2 = '-'
                loadEMR()

            }


            $scope.mainGridOptions = {
                pageable: true,
                columns: [{
                    "field": "kdpap",
                    "title": "Kode PAP",
                    "width": "15%"
                }, {
                    "field": "tglinput",
                    "title": "Tgl Pengkajian Awal",
                    "width": "20%",
                    template: "#= new moment(tglinput).format(\'DD-MM-YYYY HH:mm\') #",
                }, {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "15%"
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "25%"
                },
                {
                    "field": "namalengkap",
                    "title": "Petugas",
                    "width": "25%"
                },
                    // {
                    // "command": [{
                    //     text: "Hapus",
                    //     click: hapusData,
                    //     imageClass: "k-icon k-delete"
                    // }],
                    // title: "",
                    // width: "100px",
                    // }
                ]
            };

            $scope.columnDaftar = {
                selectable: 'row',
                pageable: true,
                columns:
                    [
                        
                        {
                            "field": "tglpelayanan",
                            "title": "Tgl Input",
                            "width": "80px",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                        },
                        {
                            "field": "pelayananmutu",
                            "title": "Mutu",
                            "width": "100px"
                        },
                        {
                            "field": "jumlah",
                            "title": "Qty",
                            "width": "100px"
                        },
                        {
                            "field": "namalengkap",
                            "title": "Pegawai",
                            "width": "100px"
                        },
                        // {
                        //     "field": "noregistrasi",
                        //     "title": "NoRegistrasi",
                        //     "width":"150px",
                        //     "template": "<span class='style-left'>#: noregistrasi #</span>"
                        // },
                        // {
                        //     "field": "namaruangan",
                        //     "title": "Nama Ruangan",
                        //     "width":"150px",
                        //     "template": "<span class='style-left'>#: namaruangan #</span>"
                        // }
                    ]
            };


            $scope.back = function () {
                window.history.back();
            }










            function onSelect(e) {
                var data3 = e.sender.dataSource._data
                // var itm = findObjectByKey(data3, 'uid', "245421fd-68db-4d25-8afc-dbe1d20a2056");
                var uid_select = e.node.dataset.uid
                var idTree = '';
                var urlTrue = null;
                for (var i = data3.length - 1; i >= 0; i--) {
                    if (uid_select == data3[i].uid) {
                        idTree = data3[i].id
                        urlTrue = data3[i].reportdisplay
                        break;
                    }
                    if (data3[i].child != undefined) {
                        for (var ii = data3[i].child.length - 1; ii >= 0; ii--) {
                            if (uid_select == data3[i].child[ii].uid) {
                                idTree = data3[i].child[ii].id
                                urlTrue = data3[i].child[ii].reportdisplay
                                break;
                            }
                            if (data3[i].child[ii].child != undefined) {
                                for (var iii = data3[i].child[ii].child.length - 1; iii >= 0; iii--) {
                                    if (uid_select == data3[i].child[ii].child[iii].uid) {
                                        idTree = data3[i].child[ii].child[iii].id
                                        urlTrue = data3[i].child[ii].child[iii].reportdisplay
                                        break;
                                    }
                                }
                            }

                        }
                    }

                }
                var noemr = '-'
                if ($scope.dataSelected != undefined) {
                    noemr = $scope.dataSelected.noemr
                }
                if (urlTrue == null) {
                    $state.go("RekamMedis.AsesmenMedis.AsesmenMedisDetail", {
                        namaEMR: idTree,
                        nomorEMR: noemr
                    });
                } else {
                    // $scope.currentState = state;
                    var arrStr = {
                        0: $scope.header.nocm,
                        1: $scope.header.namapasien,
                        2: $scope.header.jeniskelamin,
                        3: $scope.header.tgllahir,
                        4: $scope.header.umur,
                        5: $scope.header.alamatlengkap,
                        6: $scope.header.notelepon,
                    }
                    // cacheHelper.set('RekamMedisIGDCtrl', arrStr);       
                    $state.go(urlTrue);
                }




            }



            var onChange = function (e) {
                //var inputId = this.element.attr("id");
                //  console.log(inputId);
                var grid = $(this).data("mainGridOptions2");
        
              }
            
            $scope.mainGridOptions2 = {
                sortable: true,
                // toolbar: [{
                //     name: "create",
                //     text: "Tambah"
                // }],
                autoSync: true,
                change: onChange,
                batch: true,
                selectable: 'row',
                pageable: {
                  refresh: true,
                  pageSizes: true,
                  buttonCount: 5
                },
                columns: [
                  // {
                  //   "field": "rowNumber",
                  //   "title": "<h3 align=center>#</h3>",
                  //   "width": 20
                  // },
                  {
                    "field": "tglPelayanan",
                    "title": "<h3 align=center>Tanggal</h3>",
                    "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY') #",
                    "width": "60px"
                  },
                  {
                    "field": "tglPelayanan",
                    "title": "<h3 align=center>Jam</h3>",
                    "template": "#= new moment(new Date(tglPelayanan)).format('HH:mm') #",
                    "width": "40px"
                  },
                  {
                    "field": "produk.pelayananmutu",
                    "title": "<h3 align=center>Tindakan</h3>",
                    "width": "300px"
                  },
                  {
                    "field": "qty",
                    "title": "<h3 align=center>Qty</h3>",
                    "width": "70px",
                    "attributes": { align: "center" }
                  },
                  // { title: "<h3 align=center>Action<h3>",width : "100px",template : "<button class='btnHapus' ng-click='disableData()'>Disbled</button>"}
                  {
                    command: {
                      text: "Hapus",
                      width: "50px",
                      align: "center",
                      attributes: { align: "center" },
                      click: removeRowTindakan,
                      imageClass: "k-icon k-delete"
                    },
                    title: "",
                    width: "80px",
                    // template: "<a class='k-button k-grid-delete'><span class='glyphicon glyphicon-remove'></span></a>"
                  }
                ],
        
              }

              function removeRowTindakan(e) {
                e.preventDefault();
                var grid = this;
                var row = $(e.currentTarget).closest("tr");
                var tr = $(e.target).closest("tr");
                var dataItem = this.dataItem(tr);
                if (!dataItem) return
           
                // grid.removeRow(row);
                $scope.dataTindakan.remove(dataItem);
                  for (var i = data2.length - 1; i >= 0; i--) {
                    if (data2[i].rowNumber == dataItem.rowNumber) {
                 
                      data2.splice(i, 1);
                      // var subTotal = 0;
                      for (var j = data2.length - 1; j >= 0; j--) {
                        // subTotal = subTotal + parseFloat(data2[j].subTotal)
                        // data2[j].rowNumber = j + 1
                      }
                      // $scope.dataTindakan = new kendo.data.DataSource({
                      //   data: data2
                      // });
                    
                    }
                  }
        
              
                var subTotal = 0;
                for (var i = data2.length - 1; i >= 0; i--) {
                  subTotal = subTotal + parseFloat(data2[i].subTotal)
                }
                $scope.item.totalAlls = $scope.formatRupiah(subTotal, 'Rp.')
        
                // $scope.item.totalAlls=parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
              //parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                var gridPetugas = $scope.gridPetugasPelaksana._data;
                if (gridPetugas.length != 0) {
                  for (var i = gridPetugas.length - 1; i >= 0; i--) {
                    if (gridPetugas[i].idParent == dataItem.rowNumber) {
                      gridPetugas.splice(i, 1);
                      // for (var j = gridPetugas.length - 1; j >= 0; j--) {
        
                      //   gridPetugas[j].idParent = j + 1
                      // }
                      $scope.gridPetugasPelaksana.add(gridPetugas);
                      // $scope.gridPetugasPelaksana = new kendo.data.DataSource({
                      // data: gridPetugas
                      // });
                    }
                  }
                }
        
        
        
        
        
              }

              $scope.getHargaTindakan = function () {
                getKomponenHarga()
              }
        
              function getKomponenHarga() {
                $scope.item.hargaTindakan = 0
                $scope.item.jumlah = 1
                $scope.listKomponen = []
                if ($scope.item.namaProduk != undefined) {
                  medifirstService.get("tatarekening/tindakan/get-komponenharga?idRuangan="
                    + $scope.item.pasien.objectruanganfk
                    + "&idKelas=" + $scope.item.pasien.objectkelasfk
                    + "&idProduk=" + $scope.item.namaProduk.id
                    + "&idJenisPelayanan=" + $scope.item.pasien.objectjenispelayananfk
                    // +"&idKelas="
                    // +$scope.item.pasien.objectkelasfk
                    // +"&idJenisPelayanan="
                    // + $scope.item.pasien.objectjenispelayananfk
                  ).then(function (dat) {
                    $scope.listKomponen = dat.data.data;
                    // $scope.item.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
                    $scope.item.jumlah = 1;
                    $scope.z = dat.data.data2;
                  })
                }
              }

              $scope.dataSelectedRow = {};
              $scope.dataTindakan = new kendo.data.DataSource({
                autoSync: false,
                aggregate: [
                  { field: "subTotal", aggregate: "sum" }
                ],
                editable: true,
                schema: {
                  model: {
                    rowNumber: "id",
                    fields: {
                      rowNumber: { editable: false },
                      tglPelayanan: { editable: false, defaultValue: $scope.now },
                      produk: {
                        validation: {
                          productnamevalidation: function (input) {
                            if (input.is("[name='produk']") && input.val() === "") {
                              return false;
                            }
                            return true;
                          }
                        }
                      },
                      hargaSatuan: { type: "number", editable: false },
                      qty: {
                        type: "number", validation: {
                          productqtyvalidation: function (input) {
                            if (input.is("[name='qty']") && input.val() === "0") {
                              return false;
                            }
                            return true;
                          }
                        }
                      },
                      subTotal: { type: "number", editable: false }
                    }
                  }
                }
              });

              $scope.tambahTindakans = function () {
                // if ($scope.isSelesaiPeriksa == true) {
                //   messageContainer.error("Data sudah di closing, tidak bisa input tindakan ")
                //   return
                // }
                if ($scope.item.namaProduk == undefined) {
                  messageContainer.error("Tindakan harus di isi")
                  return
                }
                if ($scope.item.jumlah == 0) {
                  messageContainer.error("Jumlah tidak boleh nol")
                  return
                }  
        
                var nomor = 0
                if ($scope.dataTindakan == undefined) {
                  nomor = 1
                } else {
                  nomor = a.length + 1
                }
                var pegawai = medifirstService.getPegawai()
                var data = {};
                data = {
                  rowNumber: nomor,
                  tglPelayanan: $scope.item.tglPelayanan,
                  produk: $scope.item.namaProduk,//$scope.item.noRegistrasi,
                  qty: $scope.item.jumlah,
                  // hargaSatuan: $scope.item.hargaTindakan,
                  // hargadiskon: 0,
                  // subTotal: ($scope.item.hargaTindakan) * ($scope.item.jumlah),
                  listKomponen: $scope.listKomponen,
                  // statuscito: statuscito,
                  // cito: $scope.item.StatusCito,
                  // jasacito: $scope.item.JasaCito,
                  // isparamedis: $scope.item.paramedis,
                  jenispelayananfk: $scope.item.pasien.objectjenispelayananfk,
                  // nilaicito: $scope.item.NilaiCito,
                  pegawai: pegawai.id 
        
        
                }
                a.push(data);
                // $scope.dataGrid.add($scope.dataSelected)
                $scope.dataTindakan = new kendo.data.DataSource({
                  data: a
                });
                var subTotal = 0;
                for (var i = a.length - 1; i >= 0; i--) {
                  subTotal = subTotal + parseFloat(a[i].subTotal)
                }
                //$scope.item.totalAlls = $scope.formatRupiah(subTotal, 'Rp.')//parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                $scope.show = true;
                kosongkan();
                $scope.item.Cito = undefined;
        
        
              }

              function kosongkan() {
                $scope.item.namaProduk = undefined;
                $scope.item.hargaTindakan = "";
                $scope.item.jumlah = undefined;
                // $scope.item.jenisPelaksana = undefined;
                // $scope.item.petugasPelaksana = undefined;
                $scope.item.jenisPelaksana2 = undefined;
                $scope.item.petugasPelaksana2 = undefined;
                $scope.item.jenisPelaksana3 = undefined;
                $scope.item.petugasPelaksana3 = undefined;
                $scope.item.jenisPelaksana4 = undefined;
                $scope.item.petugasPelaksana4 = undefined;
                // $scope.selectedPegawai = [];
                $scope.selectedPegawai1 = [];
                $scope.selectedPegawai2 = [];
                $scope.selectedPegawai3 = [];
                $scope.selectedPegawai4 = [];
                $scope.selectedPegawai5 = [];
              }
              
              $scope.Save = function () {

                if ($scope.dataTindakan._data.length == 0) {
                  toastr.error('Tindakan belum di isi')
                  return
                }
                var dataTindakanFix = [];
                $scope.dataTindakan._data.forEach(function (e) {
                    // $scope.gridPetugasPelaksana._data.forEach(function (a) {
                    //   if (e.rowNumber === a.idParent) {
                    //     petugasLayanan.push({
                    //       "objectjenispetugaspefk": a.jenisPetugas.id,
                    //       // "objectpegawaifk": a.jenisPetugas.id
                    //       "listpegawai": a.listPetugas
                    //     });
                    //   }
                    // })
                    // var statusCitto = 0
                    // if (e.cito == 2) {
                    //   statusCitto = 1;
                    // }
                    // var nilaiCito = 0
                    // var nilaijasaCito = 0
                    // if (e.jasacito != 0) {
                    //   nilaiCito = e.jasacito;
                    //   nilaijasaCito = e.nilaicito;
                    // }
        
        
                    // if ( $scope.listKomponen.length>0)
                    // {
                    dataTindakanFix.push({
                      "norec_apd": $scope.currentNorecAPD,
                      "norec_pd": $scope.item.pasien.norec_pd,
                      "tglregistrasi": $scope.item.pasien.tglregistrasi,
                      "tglpelayanan": new moment(e.tglPelayanan).format('YYYY-MM-DD HH:mm'),
                      "pelayananmutu": e.produk.id,
                      "jumlah": e.qty,
                      "pegawai": e.pegawai
                    });
        
        
                  
                })
                var objSave = {
                  pelayananpasien: dataTindakanFix
        
                }
                $scope.hideSimpan = true
                medifirstService.post('tatarekening/tindakan/save-mutu', JSON.stringify(objSave)).then(function (e) {
                  //  $scope.isSimpan = true;
                  // $scope.isNext = true;
                  // medifirstService.postNonMessage('sysadmin/logging/save-log-input-tindakan', objSave).then(function (data) {
                  // })
                  // // $scope.savePanggilDokter()
                  // $scope.hapusAll();
                  // $scope.hideSimpan = false
                  // if ($scope.hideEMR != true) {
                  //   window.history.back()
                  // }
        
                }, function (error) {
                  // $scope.isNext = false;
                  $scope.hideSimpan = false
                })
                // $scope.SaveLogUser=function(){
                // }
        
              }

            //***********************************

        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1