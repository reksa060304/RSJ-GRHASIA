define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    var baseTransaksi = configuration.baseApiBackend;
    initialize.controller('RincianPendapatanCtrl', ['$scope', '$mdDialog', 'MedifirstService','$timeout','ModelItem',
        function ($scope, $mdDialog, medifirstService, $timeout, ModelItem) {
            $scope.item = {}
            $scope.itemRincian = {}
            $scope.now = new Date();
            $scope.yearUngkul = {
                start: "decade",
                depth: "decade"
            }
            $scope.bulanOption = {
                start: "year",
                depth: "year"
            }
            var norec = "";
            $scope.listTahapKegiatan = []
            $scope.listRekeningTarget = []
            LoadCombo()
            LoadData()
            var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

            $scope.itemRincian.bulan = {
                januari: 0,
                februari: 0,
                maret: 0,
                april: 0,
                mei: 0,
                juni: 0,
                juli: 0,
                agustus: 0,
                september: 0,
                oktober: 0,
                november: 0,
                desember: 0,
                total: 0 // Menyimpan total pendapatan
            }

            function LoadCombo() {
                
                // console.log($scope.dataSelected)
                medifirstService.get('anggaran/load-combo-rincian-pendapatan').then(function(data){
                    var datas = data.data
                    $scope.listTahapKegiatan = datas.tahapanggaran
                    $scope.listSumberPendapatan = datas.sumberpendapatan
                    $scope.listUraianPendapatan = datas.uraianpendapatan

                    let urian = datas.urianpendapatanbaru.map(item => ({...item, text: item.koderekening + ' ' + item.namarekening}))

                    $scope.listUrianPendapatanBaru = urian

                    $scope.listAkun = datas.akun
                    $scope.listTarget = datas.targetpendapatan
                    // for (let i = 0; i < datas.targetpendapatan.length; i++) {
                    //     datas.targetpendapatan[i].no = i+1;
                        
                    // }
                    // $scope.dataSourceRincianPendapatan = new kendo.data.DataSource({
                    //     data: datas.targetpendapatan,
                    //     pageSize: 150,
                    //     total: datas.targetpendapatan.length,
                    //     serverPaging: false,
                    //     schema: {
                    //         model: {
                    //             fields: {}
                    //         }
                    //     },
                    // });
                })
            }

            function LoadData(){

                let sumberdana = ''
                if($scope.item.sumberPendapatan !== undefined && $scope.item.sumberPendapatan !== null){
                    sumberdana = $scope.item.sumberPendapatan.id
                }

                let tahap = ''
                if($scope.item.tahap !== undefined && $scope.item.tahap !== null){
                    tahap = $scope.item.tahap.id
                }

                let tahun = ''
                if($scope.item.tahun !== undefined && $scope.item.tahun !== null){
                    tahun =  moment($scope.item.tahun).format('YYYY')
                }


                medifirstService.get('anggaran/load-data-rincian-pendapatan' 
                    + '?sumberpendapatan=' + sumberdana
                    + '&tahap=' + tahap
                    + '&tahun=' + tahun)
                    .then(function(response){

                        // console.log(response.data)

                        let data = response.data.map(function(item, index){
                            return {...item, no: index+1}
                        })

                        // console.log(data)

                        $scope.dataSourceRincianPendapatan = new kendo.data.DataSource({
                            data: data,
                            total: data.length,
                            pageSize: 10,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                        });

                    })
            }

            $scope.cari = function(){
                LoadData()
            }

            $scope.columnRincianPendapatan = {
                toolbar: [{
                        name: "add",
                        text: "Tambah",
                        template: '<div class="grid_1"><button ng-click="TambahRincian()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-plus"></span>Tambah</button></div>'
                    },
                    // {
                    //     name: "edit",
                    //     text: "Edit",
                    //     template: '<div class="grid_1"><button ng-click="Edit()" class="k-button k-button-icontext k-grid-upload" href="\\#"><span class="k-icon k-i-edit"></span>Edit</button></div>'
                    // },
                ],
                
                selectable: 'row',
                scrollable: true,

                pageable: true,
                groupable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "Nomor",
                        "width": "30px",
                        // hidden: true
                    },
                    {
                        "field": "koderekening",
                        "title": "Kode Rekening",
                        "width": "100px",
                        // hidden: true
                    },
                    {
                        "field": "namarekening",
                        "title": "Rekening",
                        "width": "100px",
                        // hidden: true
                    },
                    {
                        "field": "keterangan",
                        "title": "Keterangan",
                        "width": "60px",
                        // hidden: true
                    },
                    {
                        "field": "jumlahpendapatan",
                        "title": "Target pendapatan",
                        "width": "60px",
                        "template": "<span class='style-right'>{{ formatRupiah('#: jumlahpendapatan #', 'Rp. ') }}</span>"
                        // hidden: true
                    },
                    {
                        "field": "tahun",
                        "title": "Tahun",
                        "width": "100px",
                        // hidden: true
                    },
                    
                    {
                        "field": "tglinput",
                        "title": "Tanggal Input",
                        "width": "100px",
                    },
                    {
                        "field": "tahap",
                        "title": "Tahap",
                        "width": "100px",
                    },
                    {
						"command": [
							{ text: "Edit", click: EditRincian, imageClass: "k-icon k-i-pencil" },
							{ text: "Hapus", click: Hapus, imageClass: "k-icon k-i-delete" },
						],
						title: "",
						width: "185px",
					}
                    
                ]
            }

            $scope.TambahRincian = function (){
                var tahun = moment($scope.now).format('YYYY');
                $scope.itemRincian ={}
                $scope.itemRincian.tglinput = moment($scope.now).format('YYYY-MM-DD')
                $scope.dataSelected = undefined
                // console.log($scope.dataSelected)
                $scope.itemRincian.norec = undefined
                // $scope.popupTambahRincianPendapatan.center().open()

                // ambil sumber dana hanya jasa layanan
                let jasaLayanan = $scope.listSumberPendapatan.filter(item => item.namaexternal.includes('Jasa Layanan'))
                if(jasaLayanan.length > 0){
                    $scope.listSumberPendapatan = jasaLayanan
                }else{
                    toastr.error('Belum ada data sumber dana jasa layanan')
                    return
                }

                $scope.popupTambahRencanaPendapatan.center().open()
            }
            
            $scope.simpanRincian = function(){
                console.log($scope.dataSelected)
                var tahun = $scope.itemRincian.tahun;
                var perubahan = "";
                if ($scope.itemRincian.perubahan == true) {
                    perubahan = true
                } 
                if($scope.itemRincian.nonPerubahan == true){
                    perubahan = false
                }
                norec = ''
                if($scope.itemRincian.norec != undefined){
                    norec = $scope.itemRincian.norec
                }
                var akun = ''
                if($scope.itemPendapatan.Akun != undefined){
                    akun = $scope.itemPendapatan.Akun.id
                }
                var objSave = {
                    'norec': norec,
                    'tglinput': $scope.itemRincian.tglinput,
                    'tahun': tahun,
                    'objectasalprodukfk': $scope.itemRincian.sumberPendapatan.id,
                    'uraianpendapatan': $scope.itemRincian.uraianPendapatan,
                    'jumlahpendapatan': $scope.itemRincian.jumlahPendapatan,
                    'keterangan': $scope.itemRincian.keterangan,
                    'objecturaianpendapatanfk':akun,
                    'objectakunpendapatanfk': $scope.itemPendapatan.Akun.id,
                    'isperubahan': perubahan
                }
                medifirstService.post('anggaran/save-rincian-pendapatan', objSave).then(function(data){
                    console.log(data);
                    $scope.popupTambahRincianPendapatan.close()
                    $scope.itemRincian = {}
                    LoadCombo()
                    $scope.dataSelected = {}
                    // norec = ""
                    console.log(norec);
                })
                console.log(objSave);
            }
            $scope.batalRincian = function(){
                $scope.popupTambahRencanaPendapatan.close()
                $scope.itemRincian = {}
            }


            // $scope.Edit=function(){
            //     if ($scope.dataSelected == undefined) {
            //         alert("Data Belum Dipilih!")
            //         return;
            //     };
            //     console.log($scope.dataSelected)
            //     $scope.itemRincian.tglinput = moment($scope.dataSelected.tglinput).format('YYYY-MM-DD')
            //     $scope.itemRincian.tahun = $scope.dataSelected.tahun
            //     $scope.itemRincian.sumberPendapatan = {id:$scope.dataSelected.objectasalprodukfk,namaexternal:$scope.dataSelected.namaexternal}
            //     $scope.itemRincian.uraianpendapatans = {id:$scope.dataSelected.objecturaianpendapatanfk,uraianpendapatan:$scope.dataSelected.uraianpendapatan}
            //     $scope.itemRincian.uraianPendapatan = $scope.dataSelected.uraian
            //     $scope.itemRincian.jumlahPendapatan = $scope.dataSelected.jumlahpendapatan
            //     $scope.itemRincian.keterangan = $scope.dataSelected.keterangan
            //     if($scope.dataSelected.isperubahan == true){
            //         $scope.itemRincian.perubahan = true
            //         $scope.itemRincian.nonPerubahan = false
            //     }else{
            //         $scope.itemRincian.perubahan = false
            //         $scope.itemRincian.nonPerubahan = true
            //     }
            //     $scope.popupTambahRincianPendapatan.center().open()
                
            // }

            function EditRincian(e){
                e.preventDefault();
                // console.log(e.preventDefault())
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                if (dataItem == undefined) {
					alert("Data Belum Dipilih!")
					return;
				};

                $scope.itemRincian.tglinput = moment(dataItem.tglinput).format('YYYY-MM-DD')
                $scope.itemRincian.tahun = dataItem.tahun
                // $scope.itemRincian.sumberPendapatan = {id:dataItem.objectasalprodukfk,namaexternal:dataItem.namaexternal}
                $scope.itemRincian.uraianpendapatans = {id:dataItem.objecturaianpendapatanfk,uraianpendapatan:dataItem.uraianpendapatan}
                $scope.itemRincian.uraianPendapatan = dataItem.uraian
                $scope.itemRincian.jumlahPendapatan = parseFloat(dataItem.jumlahpendapatan)
                $scope.itemRincian.keterangan = dataItem.keterangan
                $scope.itemRincian.norec = dataItem.norec
                if(dataItem.isperubahan == true){
                    $scope.itemRincian.perubahan = true
                    $scope.itemRincian.nonPerubahan = false
                }else{
                    $scope.itemRincian.perubahan = false
                    $scope.itemRincian.nonPerubahan = true
                }

                $scope.itemRincian.tahap = $scope.cariDariList($scope.listTahapKegiatan, dataItem.objecttahapfk)
                $scope.itemRincian.sumberPendapatan = $scope.cariDariList($scope.listSumberPendapatan, dataItem.objectasalprodukfk)
                $scope.itemRincian.uraianPendapatan = $scope.cariDariList($scope.listUrianPendapatanBaru, dataItem.objecturaianpendapatanfk)
                
                $scope.itemRincian.bulan.januari = parseFloat(dataItem.januari)
                $scope.itemRincian.bulan.februari = parseFloat(dataItem.februari)
                $scope.itemRincian.bulan.maret = parseFloat(dataItem.maret)
                $scope.itemRincian.bulan.april = parseFloat(dataItem.april)
                $scope.itemRincian.bulan.mei = parseFloat(dataItem.mei)
                $scope.itemRincian.bulan.juni = parseFloat(dataItem.juni)
                $scope.itemRincian.bulan.juli = parseFloat(dataItem.juli)
                $scope.itemRincian.bulan.agustus = parseFloat(dataItem.agustus)
                $scope.itemRincian.bulan.september = parseFloat(dataItem.september)
                $scope.itemRincian.bulan.oktober = parseFloat(dataItem.oktober)
                $scope.itemRincian.bulan.november = parseFloat(dataItem.november)
                $scope.itemRincian.bulan.desember = parseFloat(dataItem.desember)


                $scope.popupTambahRencanaPendapatan.center().open()
                
            }
            function Hapus(e){
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                console.log(dataItem.norec);
                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .htmlContent("Apakah anda ingin menghapus item ini?")
                    .ariaLabel('Lucky day')
                    .cancel('Batal')
                    .ok('Ok');

                $mdDialog.show(confirm).then(function () {
                    
                    var objSave = {
                        'norec': dataItem.norec
                    }
                    medifirstService.post('anggaran/hapus-rincian-pendapatan', objSave).then(function () {
                        LoadData()
                        $scope.dataSelected = {}
                        // console.log(norec);
                    })

                })
                
            }

            $scope.simpanPendapatan = function(){
                // console.log($scope.dataSelected)
                var tahun = $scope.itemRincian.tahun;
                
                //tambahain validasi
                if($scope.itemRincian.tglinput == undefined && $scope.itemRincian.tglinput == null){
                    toastr.error('Pilih tanggal dulu')
                    return
                }

                if($scope.itemRincian.sumberPendapatan == undefined && $scope.itemRincian.sumberPendapatan == null){
                    toastr.error('Pilih sumber pendapatan')
                    return
                }

                if($scope.itemRincian.tahap == undefined && $scope.itemRincian.tahap == null){
                    toastr.error('Pilih tahap dulu')
                    return
                }

                if($scope.itemRincian.uraianPendapatan == undefined && $scope.itemRincian.uraianPendapatan == null){
                    toastr.error('Pilih uraian dulu')
                    return
                }

                // if($scope.itemRincian.jumlahPendapatan == undefined && $scope.itemRincian.jumlahPendapatan == null){
                //     toastr.error('Isi jumlah pendapatan')
                //     return
                // }

                // if($scope.itemRincian.bulan == undefined && $scope.itemRincian.bulan == null){
                //     toastr.error('Pilih bulan dulu')
                //     return
                // }

                norec = ''
                if($scope.itemRincian.norec != undefined){
                    norec = $scope.itemRincian.norec
                }
                
                // validasi jika sudah ada urian, tahap, dan sumberpendapatan yang sama tidak boleh entry
                medifirstService.get('bendaharapenerimaan/cek-target-pendapatan' 
                    + '?sumberdana=' + $scope.itemRincian.sumberPendapatan.id
                    + '&tahap=' + $scope.itemRincian.tahap.id
                    + '&rekening=' + $scope.itemRincian.uraianPendapatan.id
                    + '&norec=' + norec)
                    .then(function(response){
                    
                        let data = response.data

                        // jika ada maka error
                        if(data.length > 0){
                            toastr.error('Sudah Ada Data Target Pendapatan')
                            return
                        }

                        var objSave = {
                            'norec': norec,
                            'tglinput': moment($scope.itemRincian.tglinput).format('YYYY-MM-DD'),
                            'bulan': parseInt(moment($scope.itemRincian.bulan).format('MM')),
                            'tahun': tahun,
                            'objectasalprodukfk': $scope.itemRincian.sumberPendapatan.id,
                            'uraianpendapatan': $scope.itemRincian.uraianPendapatan.namarekening,
                            'jumlahpendapatan': $scope.itemRincian.jumlahPendapatan,                    
                            'objecturaianpendapatanfk':$scope.itemRincian.uraianPendapatan.id,
                            'keterangan':$scope.itemRincian.uraianPendapatan.text,
                            // 'objectakunpendapatanfk': $scope.itemPendapatan.jumlahPendapatan,
                            'objecttahapfk' : $scope.itemRincian.tahap.id,
                            'isperubahan': false,
                            'bulan': $scope.itemRincian.bulan
                        }
        
                        medifirstService.post('anggaran/save-rincian-pendapatan', objSave).then(function(data){
                            // console.log(data);
                            $scope.popupTambahRencanaPendapatan.close()
                            
                            reset()
        
                            LoadData()
                        })

                    })
            }

            $scope.cariDariList = function(arrayList, idCari){
                let hasil = null
                arrayList.map(function(item){
                    if(item.id == idCari){
                        hasil = item
                    }
                })

                return hasil
            }

            $scope.transferTarget = function(){
                // reset
                $scope.listRekeningTarget = []
                $scope.item.tahunawal = null
                $scope.item.tahapawal = null
                $scope.item.tahunakhir = null
                $scope.item.tahapakhir = null

                $scope.popupTransferTarget.open().center()
            }

            $scope.cariTansferTarget = function(){

                if($scope.item.tahapawal == undefined || $scope.item.tahapawal == null){
                    toastr.error("Pilih tahap awal terlebihdahulu")
                    return
                }

                if($scope.item.tahunawal == undefined || $scope.item.tahunawal == null){
                    toastr.error("Pilih tahun awal terlebihdahulu")
                    return
                }

                medifirstService.get("perencanaan/get-transfer-target" 
                    + "?tahapawal=" + $scope.item.tahapawal.id 
                    + "&tahunawal=" + moment($scope.item.tahunawal).format('YYYY') 
                    ).then(function (response) {
                        
                        let data = response.data.map((item, index) => ({...item, no: index+1}))

                        // console.log(response.data)
                        $scope.listRekeningTarget = data

                    });

            }

            $scope.simpanTransferTarget = function(){

                if($scope.item.tahapakhir == undefined || $scope.item.tahapakhir == null){
                    toastr.error("Pilih tahap akhir terlebihdahulu")
                    return
                }

                if($scope.item.tahunakhir == undefined || $scope.item.tahunakhir == null){
                    toastr.error("Pilih tahun akhir terlebihdahulu")
                    return
                }

                if($scope.listRekeningTarget.length == 0){
                    toastr.error("Belum ada target pendapatan")
                    return
                }
                // ambil yang checked = true dari checkbox yang dipilih
                // let selected = []
                // $scope.listRekeningTarget.map(function(item){
                //     if(item.checked == true){
                //         selected.push(item)
                //     }
                // })

                // if(selected.length == 0){
                //     toastr.error("Pilih rekening yang akan ditransfer")
                //     return
                // }

                let objSave = {
                    tahunawal: moment($scope.item.tahunawal).format('YYYY'),
                    tahapawal: $scope.item.tahapawal.id,
                    tahunakhir: moment($scope.item.tahunakhir).format('YYYY'),
                    tahapakhir: $scope.item.tahapakhir.id,
                    tanggaltransfer: moment(new Date()).format('YYYY-MM-DD HH:mm'),
                    // listTarget: selected
                }


                medifirstService.post("perencanaan/simpan-transfer-target", objSave)
                    .then(function (response) {
                        
                        // reset
                        $scope.listRekeningTarget = []
                        $scope.item.tahunawal = null
                        $scope.item.tahapawal = null
                        $scope.item.tahunakhir = null
                        $scope.item.tahapakhir = null

                        $scope.popupTransferTarget.close()

                        LoadData()
                        
                    });

            }

            $scope.handleCetakTarget = function(){

                $scope.popUpCetakTarget.center().open()

            }

            $scope.batalCetakTarget = function(){
                
                // reset
                $scope.item.tahapawal = null
                $scope.item.tahapakhir = null

                $scope.popUpCetakTarget.close()

            }

            function reset() {
                $scope.itemRincian.tglinput = null
                $scope.itemRincian.tahun = null
                $scope.itemRincian.sumberPendapatan = null
                $scope.itemRincian.tahap = null
                $scope.itemRincian.uraianPendapatan = null
                $scope.itemRincian.jumlahPendapatan = null
            }

            $scope.formatRupiah = function (value, currency) {
				if (value == "undefined" || value == "null") {
					value = 0;
					return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
				} else {
					return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1.");
				}
			};

            var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
            $scope.formatBulan = function(tanggal){
                let bulan =  moment(tanggal).format('MM')
                return months[parseInt(bulan - 1)]
            }

            $scope.cetakTargetPendapatan = function() {

                // validasi
                if($scope.item.tahapawal == undefined && $scope.item.tahapawal == null){
                    toastr.error('Pilih tahap awal dulu')
                    return
                }

                if($scope.item.tahapakhir == undefined && $scope.item.tahapakhir == null){
                    toastr.error('Pilih tahap akhir dulu')
                    return
                }

                window.open(baseTransaksi + "report/cetak-targetpendapatan-bp" 
                    + "?tahapawal="+ $scope.item.tahapawal.id
                    + "&tahapakhir="+ $scope.item.tahapakhir.id
                    + "&tahun=" + moment($scope.item.tahunCetakTarget).format('YYYY'), '_blank');

            }

            $scope.$watch('itemRincian.bulan', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                  $scope.itemRincian.jumlahPendapatan = $scope.totalTarget(); // Mengupdate total setiap ada perubahan
                }
              }, true);

            $scope.totalTarget = function() {
                var total = 0;
                // Menghitung jumlah semua bulan
                for (var bulan in $scope.itemRincian.bulan) {
                  total += $scope.itemRincian.bulan[bulan] || 0;  // Tambahkan nilai bulan atau 0 jika undefined
                }
                return total;
            };

            // BATASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
        }
    ])
})
        
