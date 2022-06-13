define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KelompokAnggaranCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataAnggaranSelected = {};
            var DataKegiatan= [];
            var DataMataAnggaran= [];
            var DataTotalMataAnggaran = [];
            var DataKeteranganBelanja = [];

            $scope.rcn = {};
            $scope.rcn.mataAnggaranlv1 = ""
            $scope.rcn.mataAnggaranlv2 = ""
            $scope.rcn.mataAnggaranlv3 = ""
            $scope.rcn.totallv1 = ""
            $scope.rcn.totallv2 = ""
            $scope.rcn.totallv3 = ""
            
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            loadDataGrid();
            function loadDataGrid() {
                $scope.isRouteLoading = true;
                medifirstService.get("perencanaan/get-total-mata-anggaran").then(function (e) {
                    DataTotalMataAnggaran = e.data.data
                    $scope.listAsalProduk = e.data.asalproduk
                    $scope.dataSourceDetailMT = new kendo.data.DataSource({
                        data: DataTotalMataAnggaran
                    });
                    
                })
                medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                    $scope.isRouteLoading = false
                    $scope.dataSourceKegiatan = e.data.kegiatan
                    // $scope.dataSourceDetailMT = e.data.mataanggaran
                    DataKegiatan = e.data.kegiatan
                    DataMataAnggaran = e.data.mataanggaran
                    $scope.dataSourceMataAnggaran = e.data.mataanggaran
                    for (let index = 0; index < e.data.keterangan.length; index++) {
                        const element = e.data.keterangan[index];
                        if(element.namafield == "namaPemda"){
                           $scope.item.namaPemda = element.nilaifield
                        }
                        if(element.namafield == "kepalaDaerah"){
                           $scope.item.kepalaDaerah  = element.nilaifield
                        }
                        if(element.namafield == "namaKepalaDaerah"){
                           $scope.item.namaKepalaDaerah  = element.nilaifield
                        }
                        if(element.namafield == "namaSekda"){
                           $scope.item.namaSekda  = element.nilaifield
                        }
                        if(element.namafield == "nipSekda"){
                           $scope.item.nipSekda  = element.nilaifield
                        }
                        if(element.namafield == "namaPpkd"){
                           $scope.item.namaPpkd  = element.nilaifield
                        }
                        if(element.namafield == "nipPpkd"){
                           $scope.item.nipPpkd  = element.nilaifield
                        }
                        if(element.namafield == "pengelolaKeuanganBlud"){
                           $scope.item.pengelolaKeuanganBlud  = element.nilaifield
                           $scope.item.organisasi  = element.nilaifield
                        }
                        if(element.namafield == "namaKepalaBlud"){
                           $scope.item.namaKepalaBlud  = element.nilaifield
                        }
                        if(element.namafield == "alamat"){
                           $scope.item.alamat  = element.nilaifield
                        }
                        if(element.namafield == "kota"){
                           $scope.item.kota  = element.nilaifield
                        }
                        if(element.namafield == "telepon"){
                           $scope.item.telepon  = element.nilaifield
                        }
                        if(element.namafield == "faximile"){
                           $scope.item.faximile  = element.nilaifield
                        }
                        if(element.namafield == "tahunAnggaran"){
                           $scope.item.tahunAnggaran  = element.nilaifield
                        }
                        if(element.namafield == "tahapAktiv"){
                           $scope.item.tahapAktiv  = element.nilaifield
                        }
                        if(element.namafield == "nomorNpwp"){
                           $scope.item.nomorNpwp = element.nilaifield
                        }

                    }
                    // $scope.dataSourceKedua = e.data.kelompokkedua
                    // $scope.dataSourceKetiga = e.data.kelompokketiga
                    // $scope.dataSourceKeempat = e.data.kelompokkeempat
                    //  $scope.dataSourceLima = e.data.kelompokkelima
                    // $scope.dataSourceEnam = e.data.kelompokkeenam
                })
            }    
            
            // $scope.popupEntry.center().open();
            $scope.addKegiatan = function(){
                $scope.popupKegiatan.center().open();
            }
            $scope.addSubKegiatan = function(){
                $scope.popupSubKegiatan.center().open();
            }
            $scope.addSubSubKegiatan = function(){
                $scope.popupSubSubKegiatan.center().open();
            }
            $scope.addProgram = function(){
                $scope.popupProgram.center().open();
            }
            $scope.Tambah = function(){
                $scope.item.id = ''
                $scope.popupTambah.center().open()
            }
            $scope.TambahMT = function(){
                $scope.item.id = ''
                $scope.popupTambahMT.center().open()
            }
            function editKegiatanT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                $scope.item.id = dataItem.id
                const kodeArr = dataItem.kode.split(" ");
                const kodeArr2 = kodeArr[0].split(".");
                let a1 = kodeArr2[0] + '.' + kodeArr2[1]
                let b1 = kodeArr2[2]
                let c1 = kodeArr2[3]  + '.' + kodeArr2[4]
                let d1 = kodeArr2[5]  
                if(dataItem.div == 1){
                    $scope.popupProgram.center().open()
                    // a1 = kodeArr2[0] + '.' + kodeArr2[1]
                    $scope.item.kodeHead = a1
                //    b1 = kodeArr2[2]
                    $scope.item.kode = b1
                    
                    // $scope.item.kodeHead = dataItem.kode.substring(0,4)
                    // $scope.item.kode = dataItem.kode.substring(5,7)
                }else if(dataItem.div == 2){
                    $scope.popupKegiatan.center().open();
                    $scope.item.kodeHead = a1 + '.' + b1
                    // c1 = kodeArr2[3]  + '.' + kodeArr2[4]
                    $scope.item.kode = c1
                    // $scope.item.kodeHead =dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7)
                    // $scope.item.kode = dataItem.kode.substring(8,12)
                }else if(dataItem.div == 3){
                    $scope.popupSubKegiatan.center().open();
                    $scope.item.kodeHead =  a1 +'.'+ b1 +'.'+c1
                    // d1 = kodeArr2[5]  
                    $scope.item.kode = d1 
                    // $scope.item.kodeHead = dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7) + '.' + dataItem.kode.substring(8,12)
                    // $scope.item.kode = dataItem.kode.substring(13,15)
                }else if(dataItem.div == 4){
                    $scope.popupSubSubKegiatan.center().open();  
                    for (let index = 0; index < $scope.dataSourceKegiatan.length; index++) {
                        const element = $scope.dataSourceKegiatan[index];
                        if(element.kode == a1){
                            $scope.item.urusanPemerintahan = element.kode + ' ' + element.keterangan
                        }
                        if(element.kode == a1 + '.' + b1){
                            $scope.item.program = element.kode + ' ' + element.keterangan
                        }
                        if(element.kode == a1 +'.'+ b1 +'.'+ c1){
                            $scope.item.kegiatan = element.kode + ' ' + element.keterangan
                        }
                        if(element.kode == a1 +'.'+ b1 +'.'+ c1+'.'+ d1){
                            $scope.item.subKegiatan = element.kode + ' ' + element.keterangan
                        }
                        // if(element.kode == dataItem.kode.substring(0,4)){
                        //     $scope.item.urusanPemerintahan = element.kode + ' ' + element.keterangan
                        // }
                        // if(element.kode == dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7)){
                        //     $scope.item.program = element.kode + ' ' + element.keterangan
                        // }
                        // if(element.kode == dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7) + '.' + dataItem.kode.substring(8,12)){
                        //     $scope.item.kegiatan = element.kode + ' ' + element.keterangan
                        // }
                        // if(element.kode == dataItem.kode.substring(0,4) + '.' + dataItem.kode.substring(5,7) + '.' + dataItem.kode.substring(8,12) + '.' + dataItem.kode.substring(13,15)){
                        //     $scope.item.subKegiatan = element.kode + ' ' + element.keterangan
                        // }
                        
                    }
                    $scope.item.subSubKegiatankode = kodeArr[1]//dataItem.kode//.substring(16) 
                    $scope.item.subSubKegiatan =  dataItem.keterangan
                    $scope.item.thnAnggaran = dataItem.tahun
                    $scope.item.tahap = dataItem.tahap
                    $scope.item.thpid = dataItem.thpid

                    $scope.rcn.judulKegiatan =  dataItem.keterangan

                    $scope.item.tolokUkurMasukan = dataItem.indikatormasuk
                    $scope.item.targetKinerjaMasukan = dataItem.targetmasuk
                    $scope.item.tolokUkurKeluaran = dataItem.indikatorkeluaran
                    $scope.item.targetKinerjaKeluaran = dataItem.targetkeluaran
                    $scope.item.tolokUkurHasil = dataItem.indikatorhasil
                    $scope.item.targetKinerjaHasil = dataItem.targethasil
                }
                
                $scope.item.keterangan = dataItem.keterangan
                $scope.item.div = dataItem.div
            }
            function editMataT(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                medifirstService.get("reservasionline/get-daftar-slotting?id=1").then(function (e) {

				})
                
                $scope.item.id = dataItem.id
                $scope.item.kodeAddMT = dataItem.kodemataanggaran
                $scope.item.keteranganAddMT = dataItem.namamataanggaran
                $scope.popupTambahMT.center().open();
            }
           $scope.klikKegiatan = function(dataKegiatanSelected){
                
            }
            
            $scope.columnKegiatan = {
				toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="Tambah()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                    {
                        name: "ads", 
                        text: "asd",
                        template: '<div class="grid_6"></div>'
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_4" style="margin-top: -8px;"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.search" /></div></div>'
                    }
                ],
                columns:[
                {
                  "command": [
                        {
                           text: "Detail",
                           click: editKegiatanT,
                           imageClass: "clinic fa"
                        },
                    ],
                       title: "",
                       width: "30px",
                },
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "30px"
                // },
                {
                    "field": "kode",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "250px"
                },
                {
                    "field": "tahun",
                    "title": "Tahun Angaran",
                    "width": "80px"
                },
                {
                    "field": "tahap",
                    "title": "Tahap",
                    "width": "100px"
                },
                {
                    "field": "targetmasuk",
                    "title": "Target Kinerja",
                    "width": "100px"
                },
                {
                    "field": "namakelompok",
                    "title": "div",
                    "width": "80px"
                }
            ]};
            $scope.$watch('item.search', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataKegiatan.length; index++) {
                        const element = DataKegiatan[index];
                        if (element.keterangan.match($scope.item.search)) {
                            data.push(element)
                        }else if (element.kode.match($scope.item.search)) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceKegiatan = new kendo.data.DataSource({
                        data: data
                    });
                }
            });
            

            $scope.$watch('item.searchMata', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    
                    var data = []
                    for (let index = 0; index < DataMataAnggaran.length; index++) {
                        const element = DataMataAnggaran[index];
                        if (element.namamataanggaran.match(newValue)) {
                            data.push(element)
                        }else if (element.kodemataanggaran.match(newValue)) {
                            data.push(element)
                        }
                    }
                    $scope.dataSourceMataAnggaran = new kendo.data.DataSource({
                        data: data
                    });
                }
            });
            $scope.SimpanPopUpTambah = function(){
                var jmlkode = $scope.item.kodeAdd.length
                var divS = 0;
                if(jmlkode == 7){
                    divS = 1
                }else 
                if(jmlkode == 12){
                    divS = 2
                }else if(jmlkode == 15){
                    divS = 3
                }else if(jmlkode > 15){
                    divS = 4
                }
                var objSave =
                    {
                        id: '',
                        kode: $scope.item.kodeAdd,
                        keterangan: $scope.item.keteranganAdd,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: null,
                        tahap: null,
                        indikatormasuk: null,
                        indikatorkeluaran: null,
                        indikatorhasil: null,
                        targetmasuk: null,
                        targetkeluaran: null,
                        targethasil: null,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupTambah.center().close()
                }, function (error) {

                })
            }
            $scope.SimpanPopUpProgram = function(){
                var jmlkode = $scope.item.kodeHead + '.' + $scope.item.kode
                jmlkode = jmlkode.length
                var divS = 0;
                if(jmlkode == 7){
                    divS = 1
                }else 
                if(jmlkode == 12){
                    divS = 2
                }else if(jmlkode == 15){
                    divS = 3
                }else if(jmlkode > 15){
                    divS = 4
                }
                var objSave =
                    {
                        id: $scope.item.id,
                        kode: $scope.item.kodeHead + '.' + $scope.item.kode,
                        keterangan: $scope.item.keterangan,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: null,
                        tahap: null,
                        indikatormasuk: null,
                        indikatorkeluaran: null,
                        indikatorhasil: null,
                        targetmasuk: null,
                        targetkeluaran: null,
                        targethasil: null,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupProgram.center().close()
                }, function (error) {

                })
            }
            $scope.SimpanPopUpKegiatan = function(){
                var jmlkode = $scope.item.kodeHead + '.' + $scope.item.kode
                jmlkode = jmlkode.length
                var divS = 0;
                if(jmlkode == 7){
                    divS = 1
                }else 
                if(jmlkode == 12){
                    divS = 2
                }else if(jmlkode == 15){
                    divS = 3
                }else if(jmlkode > 15){
                    divS = 4
                }
                var objSave =
                    {
                        id: $scope.item.id,
                        kode: $scope.item.kodeHead + '.' + $scope.item.kode,
                        keterangan: $scope.item.keterangan,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: null,
                        tahap: null,
                        indikatormasuk: null,
                        indikatorkeluaran: null,
                        indikatorhasil: null,
                        targetmasuk: null,
                        targetkeluaran: null,
                        targethasil: null,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupKegiatan.center().close()
                }, function (error) {

                })
            }
            $scope.SimpanPopUpSubKegiatan = function(){
                var jmlkode = $scope.item.kodeHead + '.' + $scope.item.kode
                jmlkode = jmlkode.length
                var divS = 0;
                if(jmlkode == 7){
                    divS = 1
                }else 
                if(jmlkode == 12){
                    divS = 2
                }else if(jmlkode == 15){
                    divS = 3
                }else if(jmlkode > 15){
                    divS = 4
                }
                var objSave =
                    {
                        id: $scope.item.id,
                        kode: $scope.item.kodeHead + '.' + $scope.item.kode,
                        keterangan: $scope.item.keterangan,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: null,
                        tahap: null,
                        indikatormasuk: null,
                        indikatorkeluaran: null,
                        indikatorhasil: null,
                        targetmasuk: null,
                        targetkeluaran: null,
                        targethasil: null,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupSubKegiatan.center().close()
                }, function (error) {

                })
            }
            $scope.SimpanPopUpSubSubKegiatan = function(){
                var jmlkode = $scope.item.kodeHead + '.' + $scope.item.kode
                jmlkode = jmlkode.length
                var divS = 0;
                if(jmlkode == 7){
                    divS = 1
                }else 
                if(jmlkode == 12){
                    divS = 2
                }else if(jmlkode == 15){
                    divS = 3
                }else if(jmlkode > 15){
                    divS = 4
                }
                var objSave =
                    {
                        id: $scope.item.id,
                        kode: $scope.item.subSubKegiatankode,
                        keterangan: $scope.item.subSubKegiatan,
                        kodeexternal: null,
                        namaexternal: null,
                        reportdisplay: null,
                        tahun: $scope.item.thnAnggaran,
                        tahap: $scope.item.thpid,
                        indikatormasuk: $scope.item.tolokUkurMasukan,
                        indikatorkeluaran:  $scope.item.tolokUkurKeluaran,
                        indikatorhasil:  $scope.item.tolokUkurHasil,
                        targetmasuk:  $scope.item.targetKinerjaMasukan,
                        targetkeluaran:  $scope.item.targetKinerjaKeluaran,
                        targethasil:  $scope.item.targetKinerjaHasil,
                        div: divS
                    }
                medifirstService.post('perencanaan/save-kegiatan-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupSubSubKegiatan.center().close()
                }, function (error) {

                })
            }
            $scope.columnMataAnggaran = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="TambahMT()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                    {
                        name: "ads", 
                        text: "asd",
                        template: '<div class="grid_6"></div>'
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_4" style="margin-top: -8px;"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.searchMata" /></div></div>'
                    }
                ],
                columns:[
                    {
                        "command": [
                              {
                                 text: "Detail",
                                 click: editMataT,
                                 imageClass: "clinic fa"
                              },
                          ],
                             title: "",
                             width: "30px",
                      },
                    {
                        "field": "id",
                        "title": "Id",
                        "width": "50px"
                    },
                    {
                        "field": "kodemataanggaran",
                        "title": "Kode",
                        "width": "80px"
                    },
                    {
                        "field": "namamataanggaran",
                        "title": "Mata Anggaran",
                        "width": "200px"
                    },
                    // {
                    //     "field": "kodeexternal",
                    //     "title": "Kode External",
                    //     "width": "80px"
                    // },
                    // {
                    //     "field": "namaexternal",
                    //     "title": "Nama External",
                    //     "width": "200px"
                    // }
                ]
            };
            
            $scope.columnKeteranganBelanja = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="TambahMT()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                    {
                        name: "ads", 
                        text: "asd",
                        template: '<div class="grid_6"></div>'
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_4" style="margin-top: -8px;"><div class="grid_1" style="margin-top: 10px;"><label c-label item="item" c-label-text="Search"></label></div><div class="grid_11"><input c-text-box type="input" class="k-textbox" ng-model="item.searchKeteranganBelanja" /></div></div>'
                    }
                ],
                columns:[
                    {
                        "command": [
                              {
                                 text: "Detail",
                                 click: editMataT,
                                 imageClass: "clinic fa"
                              },
                          ],
                             title: "",
                             width: "30px",
                      },
                    {
                        "field": "id",
                        "title": "Id",
                        "width": "50px"
                    },
                    {
                        "field": "kodemataanggaran",
                        "title": "Kode",
                        "width": "80px"
                    },
                    {
                        "field": "namamataanggaran",
                        "title": "Mata Anggaran",
                        "width": "200px"
                    },
                    {
                        "field": "kodeexternal",
                        "title": "Kode External",
                        "width": "80px"
                    },
                    {
                        "field": "namaexternal",
                        "title": "Nama External",
                        "width": "200px"
                    }
                ]
            };
            
            $scope.SimpanPopUpTambahMT = function(){
                var jmlkode = $scope.item.kodeAddMT.length
                var divS = 0;
                var IDD = undefined

                if($scope.item.id == undefined){
                    IDD = ''
                }else{
                    IDD = $scope.item.id
                }
                if(jmlkode == 7){
                    divS = 1
                }else 
                if(jmlkode == 12){
                    divS = 2
                }else if(jmlkode == 15){
                    divS = 3
                }else if(jmlkode > 15){
                    divS = 4
                }
                var objSave =
                    {
                        id: IDD,
                        reportdisplay: null,
                        kodemataanggaran: $scope.item.kodeAddMT,
                        namamataanggaran: $scope.item.keteranganAddMT,
                        keterangan: null,
                        kodeexternal: null,
                        namaexternal: null,
                    }
                medifirstService.post('perencanaan/save-mata-anggaran', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupTambahMT.center().close()
                }, function (error) {

                })
            }
            
            $scope.columnRincianAnggaran = {
                toolbar:[
                    {
                        name: "add", 
                        text: "Tambah",
                        template: '<div class="grid_2"><button ng-click="TambahKeterangan()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'                    
                    },
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_6" style="margin-top: 10px;margin-left: -80px;">{{rcn.mataAnggaranDipilih}}</div>'
                    }
                ],
                columns:[
                    {
                        "field": "nourut",
                        "title": "No. Urut",
                        "width": "60px"
                    },
                    {
                        "field": "keteranganbelanja",
                        "title": "Keterangan",
                        "width": "100px"
                    },
                    {
                        "field": "jml",
                        "title": "Jml",
                        "width": "80px",
						"template": "<span class='style-right'>{{formatRupiah2('#: jml #', '')}}</span>",
                    },
                    {
                        "field": "satuan",
                        "title": "Satuan",
                        "width": "80px"
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "80px",
						"template": "<span class='style-right'>{{formatRupiah2('#: hargasatuan #', '')}}</span>",
                    },
                    {
                        "field": "subtotal",
                        "title": "Sub Total",
                        "width": "80px",
						"template": "<span class='style-right'>{{formatRupiah2('#: subtotal #', '')}}</span>",
                    },
                    {
                        "field": "asalproduk",
                        "title": "Sumber Dana",
                        "width": "80px"
                    }
                ]
            };
            $scope.columnDetailMT = {
                toolbar:[
                    {
                        name: "src", 
                        text: "src",
                        template:  '<div class="grid_1" style="margin-top: 10px;">' +
                                        '<label c-label item="item" c-label-text="Search"></label>' +
                                    '</div>' +
                                    '<div class="grid_4">'+
                                        '<input c-text-box type="input" class="k-textbox" ng-model="item.searchMataMT" /></div>' +
                                    '</div>'
                    }
                    
                ],
                columns:[
                    {
                        "field": "kodemataanggaran",
                        "title": "Kode rek.",
                        "width": "80px"
                    },
                    {
                        "field": "namamataanggaran",
                        "title": "Nama Rekening",
                        "width": "120px"
                    },
                    {
                        "field": "total",
                        "title": "Sub Total",
                        "width": "80px",
						"template": "<span class='style-right'>{{formatRupiah2('#: total #', '')}}</span>",
                    }
                ]
            };
            $scope.formatRupiah2 = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}
            // $scope.columnRincianAnggaran = {
            //     toolbar:[

            //     ],
            //     columns:[
                   
            //         {
            //             "field": "id",
            //             "title": "No. Urut",
            //             "width": "30px"
            //         },
            //         {
            //             "field": "kodemataanggaran",
            //             "title": "Keterangan",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "namamataanggaran",
            //             "title": "Jml",
            //             "width": "40px"
            //         },
            //         {
            //             "field": "kodeexternal",
            //             "title": "Satuan",
            //             "width": "40px"
            //         },
            //         {
            //             "field": "namaexternal",
            //             "title": "Harga Satuan",
            //             "width": "40px"
            //         },
            //         {
            //             "field": "namaexternal",
            //             "title": "Sub Total",
            //             "width": "40px"
            //         },
            //         {
            //             "field": "namaexternal",
            //             "title": "Sumber Dana",
            //             "width": "40px"
            //         }
            //     ]
            // };



            $scope.saveHead = function () {
                var kdHead = ""
                if ($scope.item.kodeHead != undefined)
                    kdHead = $scope.item.kodeHead

                var namaHead = ""
                if ($scope.item.namaHead != undefined) {
                    namaHead = $scope.item.namaHead
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Head harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalHead != undefined)
                    kdExtern = $scope.item.kodeExternalHead

                var namaExtern = ""
                if ($scope.item.namaExternalHead != undefined)
                    namaExtern = $scope.item.namaExternalHead

                var id = ""
                if ($scope.idHead != undefined)
                    id = $scope.idHead

                var jsonSave = {
                    "id": id,
                    "kdkelompokhead": kdHead,
                    "kelompokhead": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-head-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelPertama = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokPertama != undefined)
                    kdHead = $scope.item.kodeKelompokPertama

                var namaHead = ""
                if ($scope.item.namaKelompokPertama != undefined) {
                    namaHead = $scope.item.namaKelompokPertama
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Pertama harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalPertama != undefined)
                    kdExtern = $scope.item.kodeExternalPertama

                var namaExtern = ""
                if ($scope.item.namaExternalPertama != undefined)
                    namaExtern = $scope.item.namaExternalPertama

                var id = ""
                if ($scope.idPertama != undefined)
                    id = $scope.idPertama
                var jsonSave = {
                    "id": id,
                    "kdchildpertama": kdHead,
                    "childpertama": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-pertama-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelKedua = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokKedua != undefined)
                    kdHead = $scope.item.kodeKelompokKedua

                var namaHead = ""
                if ($scope.item.namaKelompokKedua != undefined) {
                    namaHead = $scope.item.namaKelompokKedua
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Kedua harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalKedua != undefined)
                    kdExtern = $scope.item.kodeExternalKedua

                var namaExtern = ""
                if ($scope.item.namaExternalKedua != undefined)
                    namaExtern = $scope.item.namaExternalKedua

                var id = ""
                if ($scope.idKedua != undefined)
                    id = $scope.idKedua

                var jsonSave = {
                    "id": id,
                    "kdchildkedua": kdHead,
                    "childkedua": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-kedua-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelKetiga = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokKetiga != undefined)
                    kdHead = $scope.item.kodeKelompokKetiga

                var namaHead = ""
                if ($scope.item.namaKelompokKetiga != undefined) {
                    namaHead = $scope.item.namaKelompokKetiga
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Ketiga harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalKetiga != undefined)
                    kdExtern = $scope.item.kodeExternalKetiga

                var namaExtern = ""
                if ($scope.item.namaExternalKetiga != undefined)
                    namaExtern = $scope.item.namaExternalKetiga

                var id = ""
                if ($scope.idKetiga != undefined)
                    id = $scope.idKetiga

                var jsonSave = {
                    "id": id,
                    "kdchildketiga": kdHead,
                    "childketiga": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-ketiga-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelKeempat = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokKeempat != undefined)
                    kdHead = $scope.item.kodeKelompokKeempat

                var namaHead = ""
                if ($scope.item.namaKelompokKeempat != undefined) {
                    namaHead = $scope.item.namaKelompokKeempat
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Keempat harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalKeempat != undefined)
                    kdExtern = $scope.item.kodeExternalKeempat

                var namaExtern = ""
                if ($scope.item.namaExternalKeempat != undefined)
                    namaExtern = $scope.item.namaExternalKeempat

                var id = ""
                if ($scope.idKeempat != undefined)
                    id = $scope.idKeempat

                var jsonSave = {
                    "id": id,
                    "kdchildkeempat": kdHead,
                    "childkeempat": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-keempat-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }

          $scope.saveKel = function (id) {

              if(id == 5){
                   var jsonSave = {
                    "kelompok" :5,      
                    "id": $scope.idLima != undefined? $scope.idLima : '',
                    "kdkelompok": $scope.item.kodeKelompokLima != undefined?$scope.item.kodeKelompokLima :null,
                    "namakelompok": $scope.item.namaKelompokLima != undefined?$scope.item.namaKelompokLima :null,
                    "kodeexternal":  $scope.item.kodeExternalLima != undefined?$scope.item.kodeExternalLima :null,
                    "namaexternal":    $scope.item.namaExternalLima != undefined?$scope.item.namaExternalLima :null,
                }
              }
               if(id == 6){
                 var jsonSave = {
                      "kelompok" :6,      
                    "id":  $scope.idEnam != undefined? $scope.idEnam : '',
                    "kdkelompok": $scope.item.kodeKelompokEnam != undefined?$scope.item.kodeKelompokEnam :null,
                    "namakelompok": $scope.item.namaKelompokEnam != undefined?$scope.item.namaKelompokEnam :null,
                    "kodeexternal":  $scope.item.kodeExternalEnam != undefined?$scope.item.kodeExternalEnam :null,
                    "namaexternal":    $scope.item.namaExternalEnam != undefined?$scope.item.namaExternalEnam :null,
                }
               }
              
               
                medifirstService.post('perencanaan/save-kel-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }

            $scope.batal = function () {
                $scope.item = {};
                $scope.idHead = ""
                $scope.idPertama = ""
                $scope.idKedua = ""
                $scope.idKetiga = ""
                $scope.idKeempat = ""

            }
            $scope.klikDetailMT = function (dataMataAnggaranSelected) {
                if (dataMataAnggaranSelected != undefined) {
                    
                    const kodeArr = dataMataAnggaranSelected.kodemataanggaran.split(".");
                    let a1 = kodeArr[0] 
                    let b1 = kodeArr[1]
                    let c1 = kodeArr[2] 
                    let d1 = dataMataAnggaranSelected.kodemataanggaran
                    for (let index = 0; index < DataMataAnggaran.length; index++) {
                        const element = DataMataAnggaran[index];
                        if(element.kodemataanggaran == a1){
                            $scope.rcn.mataAnggaranlv1 = element.kodemataanggaran + ' - ' + element.namamataanggaran
                            $scope.rcn.totallv1 = formatRupiah(element.total, "Rp. ")
                        }
                        if(element.kodemataanggaran == a1 + '.' + b1){
                            $scope.rcn.mataAnggaranlv2 = element.kodemataanggaran + ' - ' + element.namamataanggaran
                            $scope.rcn.totallv2 = formatRupiah(element.total, "Rp. ")
                        }
                        if(element.kodemataanggaran == a1 + '.' + b1 + '.' + c1){
                            $scope.rcn.mataAnggaranlv3 = element.kodemataanggaran + ' - ' + element.namamataanggaran
                            $scope.rcn.totallv3 = formatRupiah(element.total, "Rp. ")
                        }
                    }
                    $scope.rcn.mataAnggaranDipilih= dataMataAnggaranSelected.kodemataanggaran + " " + dataMataAnggaranSelected.namamataanggaran
                    // $scope.rcn.paguAnggaran = formatRupiah(0, "Rp. ")
                    // $scope.rcn.totalAnggaran = formatRupiah(dataMataAnggaranSelected.total, "Rp. ")
                    // $scope.rcn.sisaAnggaran = formatRupiah(dataMataAnggaranSelected.total - 0, "Rp. ")
                }
            }
            //perencanaan/save-keterangan-belanja
            $scope.SimpanPopUpAddKeterangan = function(){
                medifirstService.post('perencanaan/save-keterangan-belanja', objSave).then(function (e) {
                    loadDataGrid();
                    $scope.popupTambah.center().close()
                }, function (error) {

                })
            }
            function formatRupiah(value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.TambahKeterangan = function(){
                $scope.item.noUrutKT = DataKeteranganBelanja.length + 1
                $scope.popupTambahKeteranganBelanja.center().open()
            }

            $scope.klik = function (dataHeadSelected) {
                if (dataHeadSelected != undefined) {
                    $scope.idHead = dataHeadSelected.id
                    $scope.item.kodeHead = dataHeadSelected.kdkelompokhead
                    $scope.item.namaHead = dataHeadSelected.kelompokhead
                    $scope.item.kodeExternalHead = dataHeadSelected.kodeexternal
                    $scope.item.namaExternalHead = dataHeadSelected.namaexternal
                }
            }
            $scope.klikPertama = function (dataPertamaSelected) {
                if (dataPertamaSelected != undefined) {
                    $scope.idPertama = dataPertamaSelected.id
                    $scope.item.kodeKelompokPertama = dataPertamaSelected.kdchildpertama
                    if (dataPertamaSelected.kodeexternal != null)
                        $scope.item.kodeExternalPertama = dataPertamaSelected.kodeexternal
                    else
                        $scope.item.kodeExternalPertama = ""
                    if (dataPertamaSelected.namaexternal != null)
                        $scope.item.namaExternalPertama = dataPertamaSelected.namaexternal
                    else
                        $scope.item.namaExternalPertama = ""

                    $scope.item.namaKelompokPertama = dataPertamaSelected.childpertama
                }
            }

            $scope.klikKedua = function (dataKeduaSelected) {
                if (dataKeduaSelected != undefined) {
                    $scope.idKedua = dataKeduaSelected.id
                    $scope.item.kodeKelompokKedua = dataKeduaSelected.kdchildkedua
                    $scope.item.namaKelompokKedua = dataKeduaSelected.childkedua
                    if (dataKeduaSelected.kodeexternal != null)
                        $scope.item.kodeExternalKedua = dataKeduaSelected.kodeexternal
                    else
                        $scope.item.kodeExternalKedua = ""
                    if (dataKeduaSelected.namaexternal != null)
                        $scope.item.namaExternalKedua = dataKeduaSelected.namaexternal
                    else
                        $scope.item.namaExternalKedua = ""
                }
            }
            $scope.klikKetiga = function (dataKetigaSelected) {
                if (dataKetigaSelected != undefined) {
                    $scope.idKetiga = dataKetigaSelected.id
                    $scope.item.kodeKelompokKetiga = dataKetigaSelected.kdchildketiga
                    $scope.item.namaKelompokKetiga = dataKetigaSelected.childketiga
                    if (dataKetigaSelected.kodeexternal != null)
                        $scope.item.kodeExternalKetiga = dataKetigaSelected.kodeexternal
                    else
                        $scope.item.kodeExternalKetiga = ""
                    if (dataKetigaSelected.namaexternal != null)
                        $scope.item.namaExternalKetiga = dataKetigaSelected.namaexternal
                    else
                        $scope.item.namaExternalKetiga = ""
                }
            }

            $scope.klikKeempat = function (dataKeempatSelected) {
                if (dataKeempatSelected != undefined) {
                    $scope.idKeempat = dataKeempatSelected.id
                    $scope.item.kodeKelompokKeempat = dataKeempatSelected.kdchildkeempat
                    $scope.item.namaKelompokKeempat = dataKeempatSelected.childkeempat
                    if (dataKeempatSelected.kodeexternal != null)
                        $scope.item.kodeExternalKeempat = dataKeempatSelected.kodeexternal
                    else
                        $scope.item.kodeExternalKeempat = ""
                    if (dataKeempatSelected.namaexternal != null)
                        $scope.item.namaExternalKeempat = dataKeempatSelected.namaexternal
                    else
                        $scope.item.namaExternalKeempat = ""

                }
            }
             $scope.klikLima = function (dataLimaSelected) {
                if (dataLimaSelected != undefined) {
                    $scope.idLima = dataLimaSelected.id
                    $scope.item.kodeKelompokLima = dataLimaSelected.kdchildkelima
                    $scope.item.namaKelompokLima= dataLimaSelected.childkelima
                    if (dataLimaSelected.kodeexternal != null)
                        $scope.item.kodeExternalLima = dataLimaSelected.kodeexternal
                    else
                        $scope.item.kodeExternalLima = ""
                    if (dataLimaSelected.namaexternal != null)
                        $scope.item.namaExternalLima = dataLimaSelected.namaexternal
                    else
                        $scope.item.namaExternalLima = ""

                }
            }

 $scope.klikEnam = function (dataEnamSelected) {
                if (dataEnamSelected != undefined) {
                    $scope.idEnam = dataEnamSelected.id
                    $scope.item.kodeKelompokEnam = dataEnamSelected.kdchildkeenam
                    $scope.item.namaKelompokEnam= dataEnamSelected.childkeenam
                    if (dataEnamSelected.kodeexternal != null)
                        $scope.item.kodeExternalEnam = dataEnamSelected.kodeexternal
                    else
                        $scope.item.kodeExternalEnam = ""
                    if (dataEnamSelected.namaexternal != null)
                        $scope.item.namaExternalEnam = dataEnamSelected.namaexternal
                    else
                        $scope.item.namaExternalEnam = ""

                }
            }

             $scope.hapusKelompok = function (kode) {
                        var id = ''
                        if(kode == 5){
                            id = $scope.idLima
                        }
                         if(kode == 6){
                            id = $scope.idEnam
                        }

                        if(id == '')return
                    var itemDelete = {
                        "id":id ,
                        "kelompok": kode,
                    }
                    medifirstService.post('perencanaan/delete-kel-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idBerapa = ""
                        $scope.batal()
                    })
                
            }
            $scope.hapusHead = function () {
                if ($scope.idHead == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idHead,
                    }
                    medifirstService.post('perencanaan/delete-kel-head-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idHead = ""
                        $scope.batal()
                    })
                }
            }
            $scope.hapusKelPertama = function () {
                if ($scope.idPertama == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idPertama,
                    }
                    medifirstService.post('perencanaan/delete-kel-pertama-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idPertama = ""
                        $scope.batal()
                    })
                }
            }
            $scope.hapusKelKedua = function () {
                if ($scope.idKedua == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idKedua,
                    }
                    medifirstService.post('perencanaan/delete-kel-kedua-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.batal()
                        $scope.idKedua = ""
                    })
                }
            }
            $scope.hapusKelKetiga = function () {
                if ($scope.idKetiga == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idKetiga,
                    }
                    medifirstService.post('perencanaan/delete-kel-ketiga-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idKetiga = ""
                        $scope.batal()
                    })
                }
            }
            $scope.nextSubSubKegiatan = function () {
                $scope.popupRincianAnggaran.center().open()
                medifirstService.get("perencanaan/get-keterangan-belanja?objectkegiatanfk=" + $scope.item.id).then(function (e) {
                    DataKeteranganBelanja = e.data.data
                    $scope.dataSourceRincianAnggaran = new kendo.data.DataSource({
                        data: DataKeteranganBelanja
                    });
                    let TotalAnggaran = 0;
                    for (let index = 0; index < DataKeteranganBelanja.length; index++) {
                        const element = DataKeteranganBelanja[index];
                        TotalAnggaran = TotalAnggaran + element.subtotal
                    }
                    $scope.rcn.paguAnggaran = formatRupiah(0, "Rp. ")
                    $scope.rcn.totalAnggaran = formatRupiah(TotalAnggaran, "Rp. ")
                    $scope.rcn.sisaAnggaran = formatRupiah(TotalAnggaran - 0, "Rp. ")
                    
                })
            }









            /////////////////////////////////////////////////////////////////////
        }
    ]);
});