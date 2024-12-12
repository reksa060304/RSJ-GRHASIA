define(['initialize'], function(initialize) {
	'use strict';
	initialize.controller('PenelitianEksternalCtrl', ['$scope', '$state', 'DateHelper', 'CacheHelper', 'MedifirstService', 'ModelItem',
		function ($scope, $state, dateHelper, cacheHelper, medifirstService, ModelItem) {
			//untuk menampilkan levelpendidikan
            $scope.lvlpendidikan = false
            $scope.idlvlpendidikan = true
            $scope.dataVOloaded = true;
			$scope.isRouteLoading=false;
			$scope.now = new Date();
			$scope.item={};
			$scope.currentKeterangan=[];
            
            $scope.Pembimbing = false
            $scope.tabletambahmahasiswa = false;
            $scope.tgl = true;
            $scope.pemb = true;
            $scope.ru = true;
            $scope.serti=false
            
            if (medifirstService.getKelompokUser() == 'diklit') {
                $scope.cbxuser = true 
                $scope.txtuser = false
            }else{
                $scope.cbxuser = false
                $scope.txtuser = true
                $scope.item.namainstansi = medifirstService.getPegawaiLogin().namaLengkap;
                $scope.item.namauser = medifirstService.getUserLogin().kdUser;
            }
            // $scope.penelitibtn = true
			var noOrder='';
			var NorecKpe='';
			var norec_kpe ='';
            var norecmhs = '';
            
			loadDataCombo();
			LoadCache();
			function LoadCache(){
                var chacePeriode = cacheHelper.get('PenelitianEksternalCtrl');
                if(chacePeriode != undefined){
                    NorecKpe = chacePeriode[0]
                    noOrder = chacePeriode[1]
                    $scope.usereksternal = chacePeriode[2]
                    init()
                    var chacePeriode ={ 0 : '' ,
                        1 : '',
                        2 : '',
                        3 : '', 
                        4 : '',
                        5 : '',
                        6 : ''
                    }
                    cacheHelper.set('PenelitianEksternalCtrl', chacePeriode);
                }else{
                    init()
                }
            }			
            
            if ($scope.idpegawai != true) {
                $scope.tgl = false;
                $scope.pemb = false;
                $scope.ru = false;
                $scope.tabletambahmahasiswa = true;

            }
			function loadDataCombo(){
                $scope.isRouteLoading = true
                var norec_pd = '';
                if ($scope.norec_pd != undefined) {
                    norec_pd = "&norec_pd=" + $scope.norec_pd;
                }
                var noregistrasi = '';
                if ($scope.noregistrasifk != undefined) {
                    noregistrasi = "noregistrasi=" + $scope.noregistrasifk;
                }
                var chacePeriode = cacheHelper.get('PenelitianEksternalCtrl');
                if (chacePeriode != undefined) {
                    chacePeriode = cacheHelper.get('PenelitianEksternalCtrl');
                    NorecKpe = chacePeriode[0]
                }
                if (NorecKpe != '') {
                    noregistrasi = "noregistrasi=" + NorecKpe;
                }
                // var modelid = '&modelid='+ModelItem.getPegawai().id;
	            medifirstService.get("sdm/penelitian/get-data-combo-penelitian?"+ noregistrasi, true).then(function(datas){
                $scope.isRouteLoading = false
                    var dat = datas.data
	            	// $scope.idpegawai = datas.data.pegawaiuser[0].usereksternal
                    $scope.ListInstitusiPendidikan=dat.institusi;
                    $scope.ListJenisDiklat = dat.jenisdiklat;
                    $scope.ListJenisLayanan = dat.detailjenisproduk;
                    $scope.ListJenisKelamin = dat.jeniskelamin;
                    $scope.ListPejabatPengesah = dat.pegawai;
                    $scope.ListRuangan = dat.dataruangan;
                    $scope.kendo = datas.data.me.length;
                    $scope.ListLevelPendidikan = dat.levelpendidikan;
                    $scope.ListNamaUser = dat.institusiuser2
                    if (dat.pegawaiuser != '') {
                    $scope.item.notelp = dat.pegawaiuser[0].nomor
                    }
                    if (datas.data.norec != '') {
                        $scope.norec = datas.data.norec[0].jumlahpeserta
                    }
                    if (dat.sp != '') {
                        if (dat.sp != undefined) {
                            $scope.peneliti = true
                            toastr.error("Informasi, Data Sudah Diverifikasi !")
                        }
                    }
                   
                    
                    
                    
                    
                    $scope.dataSourceGridDiagnosapasien = new kendo.data.DataSource({
                        data: datas.data.me,
                        // group: $scope.group,
                        pageSize: 100,
                        total: datas.data.me.length,
                        serverPaging: false,
                        schema: {
                            model: {}
                        },
                    });
	            });
                
                
		    }
            
            
            $scope.GetLevelPendidikan = function(){
                
                $scope.item.levelpendidikan = undefined
                
                $scope.item.satuan = $scope.item.layanan.namaexternal
                if (noOrder == 'EditPenelitianEksternal') {
                    if ($scope.usereksternal != true) {
                        // $scope.item.layanan.id == 1947 || layanan praktek klinik
                        if ($scope.item.layanan.id == 1948 || $scope.item.layanan.id == 1957) {
                            $scope.pembimbing = true;
                        }
                    }
                    if ($scope.item.layanan.id != null) {
                        $scope.lvlpendidikan = false
                        $scope.idlvlpendidikan = true
                    }
                }
                

                var jenisLayanan = $scope.item.layanan.id
                medifirstService.get("sdm/penelitian/get-data-combo-penelitian?diklat=" +
                    jenisLayanan).then(function (datas) {
                    var dat = datas.data
                    $scope.ListLevelPendidikan = dat.layanan;
                    // $scope.item.satuan = dat.detailjp[0].namaexternal;
                });
            }
            $scope.GetHarga = function () {
                var layanan = $scope.item.layanan.id
                var levelpendidikan = $scope.item.levelpendidikan.id;
                $scope.item.biaya = undefined
                $scope.item.jumlahpeserta = undefined
                $scope.item.qty = undefined
                medifirstService.get("sdm/penelitian/get-data-combo-penelitian?diklat=" +
                    layanan + "&lynn=" + levelpendidikan).then(function (datas) {
                    var dat = datas.data
                    $scope.harganetto = dat.lynn[0].harganetto1;
                    $scope.item.hargasatuan = $scope.harganetto;
                });

            }
            $scope.item.biaya = 0
            $scope.GetBiaya = function(){
                if ($scope.item.jumlahpeserta > 5 && $scope.item.levelpendidikan.id == 40410021) {
                    toastr.error('Jumlah Peserta Maksimal 5')
                    $scope.item.jumlahpeserta = 0
                }
                if ($scope.item.jumlahpeserta > 10 && $scope.item.levelpendidikan.id == 40410022) {
                    toastr.error('Jumlah Peserta Maksimal 10')
                    $scope.item.jumlahpeserta = 0
                }
                if ($scope.item.jumlahpeserta > 0 && $scope.item.jumlahpeserta < 6 && $scope.item.levelpendidikan.id == 40410021) {
                    $scope.item.biaya = 0
                    $scope.item.biaya = $scope.item.hargasatuan * $scope.item.qty;
                }

                if ($scope.item.jumlahpeserta > 0 && $scope.item.levelpendidikan.id == 40410024) {
                    $scope.item.biaya = 0
                    $scope.item.biaya = $scope.item.hargasatuan * $scope.item.qty;
                }
                
                if ($scope.item.jumlahpeserta >= 6 && $scope.item.jumlahpeserta <= 10 && $scope.item.levelpendidikan.id == 40410022) {
                     $scope.item.biaya = 0

                    $scope.item.biaya = ($scope.item.jumlahpeserta * $scope.item.hargasatuan) * $scope.item.qty;
                    // $scope.item.biaya = $scope.harganetto * $scope.item.qty;
                } 
                if ($scope.item.jumlahpeserta > 10 && $scope.item.levelpendidikan.id == 40410023) {
                    $scope.item.biaya = 0
                    $scope.item.biaya = ($scope.item.jumlahpeserta * $scope.item.hargasatuan) * $scope.item.qty;
                }

                if ($scope.item.layanan.id == 1950 && $scope.item.jumlahpeserta <= 25) {
                $scope.item.biaya = 0
                    $scope.item.biaya = (25 * $scope.item.qty) * $scope.item.hargasatuan;
                } 
                if ($scope.item.layanan.id == 1950 && $scope.item.jumlahpeserta > 25) {
                    $scope.item.biaya = 0
                    $scope.item.biaya = $scope.item.jumlahpeserta * $scope.item.hargasatuan * $scope.item.qty;
                }
                if ($scope.item.layanan.id != 1950 && $scope.item.layanan.id != 1952) {
                    $scope.item.biaya = 0
                    $scope.item.biaya = $scope.item.jumlahpeserta * $scope.item.hargasatuan * $scope.item.qty
                }
                
                // if (($scope.item.levelpendidikan.id !== 40400030) && ($scope.item.layanan.id !== 1950)) {
                //     $scope.item.biaya = $scope.item.jumlahpeserta*$scope.harganetto * $scope.item.qty;
                // }
                
                // tglOtomatis()
            }
            
            function tglOtomatis(){
                var satuan = "";
                var qty =";"
                if ($scope.item.satuan == "Orang - Bulan(OB)"){
                    satuan = "&satuan=month";
                    qty = "&qty=" + ($scope.item.qty * 31)
                }
                else if ($scope.item.satuan == "Orang - Minggu(OM)") {
                    qty = "&qty=" + (($scope.item.qty*7)-1)

                } else 
                if ($scope.item.satuan == "Orang - Hari(OH)") {
                    qty = "&qty=" + ($scope.item.qty-1)
                } 
                medifirstService.get('diklat/get-tanggal-otomatis?tgl=' + moment($scope.now).format('YYYY-MM-DD') +satuan + qty).then(function (data) {
                    var datas = data.data.nyarihari
                    var tglpertama = $scope.now
                    var tglterakhir = datas.length - 1
                    $scope.item.tanggalMulai = tglpertama
                    $scope.item.tanggalSelesai = datas[tglterakhir].hari
                })
            }
			function init(){
			   	if (noOrder == 'EditPenelitianEksternal') {
                    $scope.isRouteLoading=true;
                    
                    medifirstService.get("sdm/penelitian/get-detail-penelitian-eksternal?"
                    +"Norec="+NorecKpe, true).then(function(dat){
                        $scope.isRouteLoading=false;
                        var datas = dat.data.datas[0];
                        norec_kpe = datas.norec;

                        $scope.item.namauser = datas.namauser;
                        $scope.item.namainstansi = datas.institusipendidikan
                        $scope.item.notelp = datas.notelp;
                        $scope.item.jenis = {id:datas.idjenis,diklatkategori:datas.diklatkategori};
                        $scope.item.layanan = {id:datas.idlayanan,detailjenisproduk:datas.detailjenisproduk};
                        $scope.item.levelpendidikan = {
                            id: datas.idlevelpendidikan,
                            namaproduk: datas.levelpendidikan
                        };
                        $scope.item.hargasatuan = datas.hargasatuan;
                        $scope.idlvlpendidikan = false
                        $scope.lvlpendidikan = true
                        $scope.item.look = datas.levelpendidikan
                        $scope.item.jumlahpeserta = datas.jumlahpeserta
                        $scope.item.qty = datas.qty
                        $scope.item.satuan = datas.satuan
                        $scope.item.biaya = datas.biayapenelitian
                        $scope.item.tanggalMulai = datas.tanggalmulai;
                        $scope.item.tanggalSelesai = datas.tanggalselesai;
                        $scope.tabletambahmahasiswa = true;
                        $scope.tglregistrasiedit = moment(datas.tglregistrasi).format('YYYY-MM-DD HH:mm'); 
                        $scope.item.namapendamping = datas.namapendamping;
                        $scope.item.namapengawas = datas.namapengawas;
                        $scope.item.judulpenelitian = datas.judulpeneltian;
                        $scope.item.pengesah = {id: datas.idpengesah,namalengkap:datas.namalengkap};
                        $scope.item.nosertifikat = datas.nosertifikat;
                        // $scope.penelitibtn = true
                        if ($scope.usereksternal != true) {
                            if ($scope.item.layanan.id == 1948 || $scope.item.layanan.id == 1957) {
                                $scope.Pembimbing = true;
                            }
                            $scope.serti = true
                        }
                        if (medifirstService.getKelompokUser() == 'diklit') {
                            $scope.penelitibtn = false
                            $scope.item.cbxnamauser = {
                                namauser: datas.namauser,
                                username: datas.namauser + ",  " + datas.institusipendidikan,
                                namalengkap: datas.institusipendidikan
                            }
                            $scope.item.namainstansi = datas.institusipendidikan
                        }
                    })
                    
                }
            }

		    

			$scope.addListKeterangan = function(bool,data) {
                var index = $scope.currentKeterangan.indexOf(data);
                if (_.filter($scope.currentKeterangan, {
                        id: data.id
                    }).length === 0)
                    $scope.currentKeterangan.push(data);
                else {
                    $scope.currentKeterangan.splice(index, 1);
                }
                
            }

			$scope.Batal = function(){
				$scope.item = {};
			}

			$scope.Save = function(){
                if ($scope.item.biaya == undefined) {
                    toastr.error("Tunggu Hingga Total Biaya Muncul")
                    return
                }
                if ($scope.item.biaya == 0) {
                    toastr.error("Biaya Tidak Boleh 0")
                    return
                }
                var listRawRequired = [
                    "item.notelp|ng-model|No Telp",
                    "item.jenis|k-ng-model|Jenis Layanan",
                    "item.levelpendidikan|k-ng-model|Level Pendidikan",
                    "item.layanan|k-ng-model|Layanan",
                    "item.jumlahpeserta|ng-model|Jumlah Peserta",
                    "item.qty|ng-model|Quantity",
                    "item.satuan|ng-model|Satuan",
                    "item.hargasatuan|ng-model|Harga Satuan",
                    "item.tanggalMulai|k-ng-model|tanggal Mulai",
                    "item.tanggalSelesai|k-ng-model|Tanggal Selesai",
                    "item.biaya|ng-model|Perkiraan Biaya",
                    // "item.desaKelurahan|k-ng-model|Kelurahan",
                    // "item.noHp|ng-model|No. HP / Ponsel",
                ];
                var isValid = ModelItem.setValidation($scope, listRawRequired);

                if(isValid.status == true){


                    $scope.isRouteLoading = true;
                    //bikin if untuk tanggal mulai dan selesai
                    var tanggalmulai = null
                    if ($scope.item.tanggalMulai != undefined) {
                        tanggalmulai = moment($scope.item.tanggalMulai).format('YYYY-MM-DD HH:mm')
                    }
                    var tanggalselesai = null
                    if ($scope.item.tanggalSelesai != undefined) {
                        tanggalselesai = moment($scope.item.tanggalSelesai).format('YYYY-MM-DD HH:mm')
                    }
                    $scope.tglregistrasi = ''
                    if ($scope.tglregistrasiedit != undefined) {
                        $scope.tglregistrasi = moment($scope.tglregistrasiedit).format('YYYY-MM-DD HH:mm')
                    } else {
                        $scope.tglregistrasi = moment($scope.now).format('YYYY-MM-DD HH:mm')
                    }
                    var judulpenelitian = "";
                    var namapendamping = "";
                    var namapengawas = "";
                    if ($scope.item.judulpenelitian != undefined) {
                        judulpenelitian = $scope.item.judulpenelitian
                    }
                    if ($scope.item.namapendamping != undefined) {
                        namapendamping = $scope.item.namapendamping
                    }
                    if ($scope.item.namapengawas != undefined) {
                        namapengawas = $scope.item.namapengawas
                    }
                    var nosertifikat = "";
                    if ($scope.item.nosertifikat != undefined) {
                        nosertifikat = $scope.item.nosertifikat
                    }
                    var pengesah = null;
                    if ($scope.item.pengesah != undefined) {
                        pengesah = $scope.item.pengesah.id
                    }
                    var namauser = null;
                    if ($scope.item.namauser != undefined) {
                        namauser = $scope.item.namauser
                    } else if ($scope.item.cbxnamauser != undefined) {
                        namauser = $scope.item.cbxnamauser.namauser
                    }
                    var data = {
                        "norec_kpe": norec_kpe,
                        "namauser": namauser,
                        "institusipendidikan": $scope.item.namainstansi,
                        "notelp": $scope.item.notelp,
                        "objectdiklatkategorifk": $scope.item.jenis.id,
                        "objectdetailjenisprodukfk": $scope.item.layanan.id,
                        "objectprodukfk": $scope.item.levelpendidikan.id,
                        "jumlahpeserta": $scope.item.jumlahpeserta,
                        "qty": $scope.item.qty,
                        "satuan": $scope.item.satuan,
                        "biayapenelitian": $scope.item.biaya,
                        "tglregistrasi": $scope.tglregistrasi,
                        "tanggalmulai": tanggalmulai,
                        "tanggalselesai": tanggalselesai,
                        "hargasatuan": $scope.item.hargasatuan,
                        "judulpenelitian": judulpenelitian,
                        "namapendamping": namapendamping,
                        "namapengawas": namapengawas,
                        "nosertifikat": nosertifikat,
                        "pengesah": pengesah
                    };

                    var objSave = {
                        data: data,
                    }
                    // return
                    medifirstService.post('sdm/penelitian/save-kegiatan-penelitian-eksternal', objSave).then(function (e) {
                        $scope.item = {};
                        // $state.go('DaftarPenelitianEksternal')
                        $state.go('DaftarPenelitianEksternal')
                    })

                }
                

			}
            $scope.$watch('item.cbxnamauser', function(newValue, oldValue){
                if (newValue != oldValue) {
                    $scope.item.namainstansi = $scope.item.cbxnamauser.namalengkap
                }
            })

            // function deleteRow(e) {
            //     e.preventDefault();

            //     var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            //     var datasend = {
            //         "statusenabled": true,
            //         "norec_eks": dataItem.norec_eks,
            //         "norec": false
            //     };
            //     var objSave = {
            //         data: datasend
            //     }
            //         $scope.isRouteLoading = true;
            //     medifirstService.post("sdm/pendidikan/save-pesertadidik", datasend).then(function (e) {
            //         $scope.isRouteLoading = false;
            //         loadDataCombo();
            //     });
            // }
			
		}
	]);
});