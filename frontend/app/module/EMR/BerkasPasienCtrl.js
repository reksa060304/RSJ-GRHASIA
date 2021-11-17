define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    var baseTransaksi = config.baseApiBackend; 
    initialize.controller('BerkasPasienCtrl', ['$q', '$rootScope', '$scope', '$state', 'CacheHelper', 'MedifirstService', '$mdDialog', '$parse',
        function ($q, $rootScope, $scope, $state, cacheHelper, medifirstService, $mdDialog, $parse) {
            $scope.item = {};
            $scope.isRouteLoading = false;
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            cacheHelper.set('cacheNomorEMR', undefined);

            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            var norec_Emr = ''
            $scope.item.qty = 1
            $scope.riwayatForm = false
            $scope.inputOrder = true
            $scope.CmdOrderPelayanan = true;
            $scope.OrderPelayanan = false;
            $scope.showTombol = false;
            $scope.disabledSimpan = false;
            $scope.disabledBatal = false;

            var myVar = 0
            var detail = ''
            var datana = [];
            var data2 = [];
            var data_head = [];
            var data_Save = [];
            $scope.PegawaiLogin2 = {};
            var paramSearch =''
            var namaRuangan = ''
            var namaRuanganFk = ''
            $scope.SistoleChart = false;
            $scope.NonSistoleChart = false;

            medifirstService.get("emr/combo-jenis-berkas", true).then(function (dat) {
                $scope.listJenisBerkas = dat.data;
            });

            LoadCacheHelper();
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('cacheRekamMedis');
                if (chacePeriode != undefined) {
                    $scope.item.noMr = chacePeriode[0]
                    nocm_str = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.header.DataNoregis = chacePeriode[13]
                    if ($scope.header.DataNoregis == undefined) {
                        $scope.header.DataNoregis = false;
                    }
                    if ($scope.header.DataNoregis == true) {
                        paramSearch = 'noregistrasi=' + $scope.item.noregistrasi
                  
                    } else {
                        paramSearch ='nocm=' + $scope.item.noMr
                    }
                    init()
  
                }
  
             
            }
            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    paramSearch = 'noregistrasi=' + $scope.item.noregistrasi
                    init()
                }
                else {
                    paramSearch ='nocm=' + $scope.item.noMr
                    init()
                }
            }
            $scope.refresh = function () {
                init()
            }
            function init() {
                $scope.isRouteLoading = true
                medifirstService.get("emr/get-berkas-pasien?" + paramSearch, true).then(function (dat) {
                    $scope.isRouteLoading = false
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
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.columnDaftar = {
                selectable: 'row',
                pageable: true,
                columns:
                    [ 
                        {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "10%",
                        },
                        {
                            "field": "tglemr",
                            "title": "Tgl Upload",
                            "width": "10%",
                            "template": "<span class='style-left'>{{formatTanggal('#: tglemr #')}}</span>"
                        },
                        {
                            "field": "namafile",
                            "title": "Nama File",
                            "width": "25%",
                        },
                        {
                            "field": "deskripsi",
                            "title": "Deskripsi",
                            "width": "45%",
                        },
                        {
                            "command": [
                                { text: "Lihat", click: LihatBerkas },
                                { text: "Download", click: DownloadBerkas }
                            ],
                            title: "",
                            width: "15%",
                        }
                    ]
            }
            $scope.inputBaru = function () {
                clear()
                $scope.dataSelected = undefined
                $scope.popUpFile.center().open()
            }
            $scope.batal = function () {
                $scope.popUpFile.close()
            }
            function clear() {
                document.getElementById("formFile").reset();
                delete $scope.item.namafile
                delete $scope.item.keterangan
            }
            $scope.klikGrid = function (dataSelected) {
                $scope.dataSelected = dataSelected
            }
            function LihatBerkas(e) 
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/berkaspasien?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }
            function DownloadBerkas(e) 
            {
                e.preventDefault();
				var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                var strBACKEND = baseTransaksi.replace('service/medifirst2000/', '')
                window.open(strBACKEND + "service/storage/berkaspasien/download?nocm="+ dataItem.nocm + "&filename=" + dataItem.namafile);
            }

            $scope.Save = function (data) {
                if ($scope.item.namafile == undefined) {
                    toastr.error("Isi nama file terlebih dahulu !")
                    return
                }

                var objSave = {
                    norec: $scope.dataSelected != undefined ? $scope.dataSelected.norec : '',
                    noregistrasi: $scope.item.noregistrasi,
                    nocm: $scope.item.noMr,
                    norec_apd: norec_apd,
                    namafile: $scope.item.namafile != undefined ? $scope.item.namafile.nama : '',
                    keterangan: $scope.item.keterangan != undefined ? $scope.item.keterangan : '',
                    objectberkaspasien: $scope.item.namafile != undefined ? $scope.item.namafile.id : '',
                }

                const url = baseTransaksi + 'emr/post-berkas-pasien'
				const formData = new FormData()
				const file = document.getElementById("filePasien").files[0];
                
                if ($scope.dataSelected == undefined && file == undefined) 
                {
                    toastr.error('Silahkan Upload File Berkas')
                    return;
                }

                if (file != undefined) {
                    if (file.size > 10485760) {
                        toastr.error('Maksumum Ukuran File adalah 10 MB.')
                        return;
                    }
                    if(file.type != "application/pdf") 
                    {
                        toastr.error('File yang diizinkan dalam bentuk format PDF.')
                        return;
                    }
                }

                formData.append('filePasien', file)
				formData.append('norec', objSave.norec)
				formData.append('noregistrasi', objSave.noregistrasi)
				formData.append('nocm', objSave.nocm)
				formData.append('norec_apd', objSave.norec_apd)
				formData.append('namafile', objSave.namafile)
				formData.append('keterangan', objSave.keterangan)
				formData.append('objectberkaspasien', objSave.objectberkaspasien)
				var arr = document.cookie.split(';')
                var authorization;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i].split('=');
                    if (element[0].indexOf('authorization') > 0) {
                        authorization = element[1];
                    }
                }

                var btnSimpan = angular.element(document.getElementById("btnSimpan"));
                var btnBatal = angular.element(document.getElementById("btnBatal"));
                var spinElementSimpan = angular.element('<span class="fa fa-spinner fa-spin"></span>&nbsp;<span> Sedang menyimpan</span>');
                var textElementSimpan = angular.element('<span class="k-icon k-update"></span><span>Simpan</span>');
                
                btnSimpan.empty();
                btnSimpan.append(spinElementSimpan);
                $scope.disabledSimpan = true;
                $scope.disabledBatal = true;
                fetch(url, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-AUTH-TOKEN': authorization
                    }
				})
                .then(response => response.json())
                .then(result => {
                    clear();
                    init();

                    var pesan = $scope.dataSelected == undefined ? "Simpan" : "Edit";
                    medifirstService.postLogging(pesan + ' Berkas Pasien', 'Norec emrdokumen_t', result.dokumen.norec, 
                    pesan + ' Berkas Pasien pada No Registrasi  '
                    +  $scope.item.noregistrasi  + ' - Pasien : ' + $scope.item.namaPasien).then(function (res) {
                    })

                    toastr.success(pesan + " Berkas berhasil.");

                    btnSimpan.empty();
                    btnSimpan.append(textElementSimpan);
                    $scope.disabledSimpan = false;
                    $scope.disabledBatal = false;

                    if($scope.dataSelected != undefined)
                    {
                        $scope.popUpFile.close()
                    }
                })
                .catch((error) => {
                    toastr.error("Simpan Berkas gagal.");

                    btnSimpan.empty();
                    btnSimpan.append(textElementSimpan);
                    $scope.disabledSimpan = false;
                    $scope.disabledBatal = false;
                    $scope.popUpFile.close()
                });
            }

            $scope.edit = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu')
                    return
                }
                $scope.item.namafile = { id: $scope.dataSelected.objectberkaspasien, nama: $scope.dataSelected.namafile.split('_')[0] }
                $scope.item.keterangan = $scope.dataSelected.deskripsi
                $scope.popUpFile.center().open()
            }
            $scope.hapus = function(){
                if($scope.dataSelected == undefined){
                    toastr.error('pilih data dulu')
                    return
                }

                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin mau menghapus data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('emr/hapus-berkas-pasien',{norec:$scope.dataSelected.norec}).then(function(e){
                        init()
                        medifirstService.postLogging('Hapus Berkas Pasien', 'Norec emrdokumen_t', $scope.dataSelected.norec, 
                        'Hapus Berkas Pasien '+ $scope.dataSelected.namafile +' pada No Registrasi  '
                        +  $scope.item.noregistrasi  + ' - Pasien : ' + $scope.item.namaPasien).then(function (res) {
                        })
                        $scope.dataSelected = undefined
                    })
                })

                
            }

        }
    ]);
});
