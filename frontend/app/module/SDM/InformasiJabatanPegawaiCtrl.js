define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InformasiJabatanPegawaiCtrl', ['$scope', 'MedifirstService', 'DateHelper', 
        function ($scope, medifirstService, dateHelper) {
            //Inisial Variable             
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            FormLoad ();

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

            function FormLoad (){

                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;
                $scope.date = new Date();
                var tanggals = dateHelper.getDateTimeFormatted3($scope.date);                
                $scope.pegawai = medifirstService.getPegawai();
              
                medifirstService.get("sdm/get-data-jabatan-new?", true).then(function(datas){    
                    var dat = datas.data                                                   
                    $scope.listJabatan = dat.jabatan;         
                });

                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai= data;
                });      
            LoadData(); 
           
            }                                  

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                LoadData();              
            }

            function LoadData() {       

                $scope.isRouteLoading = true;                              
                var idJenisPegawai = "";
                if ($scope.item.Jabatan != undefined) {
                    idJenisPegawai = "&JabatanStrukturalfk=" + $scope.item.Jabatan.id;
                }
        
                var idPegawai = "";
                if ($scope.item.namaPegawai != undefined) {
                    idPegawai = "&idPegawai=" + $scope.item.namaPegawai.id;
                }
                
                medifirstService.get("sdm/get-data-jabatan-new?"                                       
                    + idJenisPegawai
                    + idPegawai).then(function (data) {
                    $scope.isLoadingData = false;                    
                    var datas = data.data.data;           
                   
                    $scope.sourceLaporan = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 10,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                id: "id", // FIXED: definisikan field id
                                fields: {
                                    id: { type: "number" },
                                    namajabatan: { type: "string" },
                                    kualifikasipendidikan: { type: "string" },
                                    jumlahkebutuhan: { type: "number" }
                                }
                            }
                        }
                    });

                })
            }                    

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }
          
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatTanggal = function(tanggal){
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatJam = function(tanggal){
                return moment(tanggal).format('HH:mm');
            }

            $scope.columnLaporan = {
            toolbar: ["excel"],
            excel: {
                fileName: "DataJabatan" + moment($scope.now).format('DD/MMM/YYYY'),
                allPages: true,
            },
            selectable: 'row',
            pageable: true,
            columns: [
                { 
                    field: "id", 
                    title: "ID",
                    width: "50px",
                    // hidden: true 
                },
                {
                    field: "namajabatan",
                    title: "Nama Jabatan",
                    width: "150px",
                },
                {
                    field: "kualifikasipendidikan",
                    title: "Kualifikasi Pendidikan",
                    width: "100px"
                },
                {
                    field: "jumlahkebutuhan",
                    title: "Jumlah Kebutuhan",
                    width: "120px"
                },
                {
                    command: [
                        {
                            name: "edit",
                            text: "Edit",
                            click: function(e) {
                                e.preventDefault();
                                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                                $scope.$apply(function() {  // FIXED: pastikan Angular update scope
                                    $scope.editData(dataItem);
                                });
                            }
                        },
                        {
                            name: "hapus",
                            text: "Hapus",
                            click: function(e) {
                                e.preventDefault();
                                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                                $scope.$apply(function() {
                                    $scope.hapusData(dataItem);
                                });
                            }
                        }
                    ],

                    title: "&nbsp;",
                    width: "180px"
                }
            ]
        };

        $scope.editData = function (data) {
            // FIXED: ubah dari Observable ke plain object
            var d = data.toJSON ? data.toJSON() : angular.copy(data);

            // FIXED: set field satu per satu ke form
            $scope.editForm = {
                id: d.id || null,
                namajabatan: d.namajabatan || '',
                kualifikasipendidikan: d.kualifikasipendidikan || '',
                jumlahkebutuhan: d.jumlahkebutuhan || ''
            };

            console.log('Data form popup:', $scope.editForm); // cek di console: id harus muncul

            $scope.winEdit.center().open();
        };


        $scope.closeEdit = function() {
            $scope.winEdit.close();
        };

        $scope.saveEdit = function () {
        // FIXED: ambil semua nilai manual dan buat objek baru
            var objSave = {
                id: $scope.editForm.id,
                namajabatan: $scope.editForm.namajabatan,
                kualifikasipendidikan: $scope.editForm.kualifikasipendidikan,
                jumlahkebutuhan: $scope.editForm.jumlahkebutuhan
            };

            if (!objSave.id) {
                toastr.error('ID tidak ditemukan, gagal menyimpan');
                return;
            }

            console.log('Kirim ke backend:', objSave); // pastikan ID muncul

            medifirstService.post('sdm/save-update-data-jabatan', objSave).then(function (res) {
                toastr.success('Data berhasil diperbarui');
                $scope.winEdit.close();
                $scope.Search(); // refresh grid
            }, function (err) {
                toastr.error('Gagal memperbarui data');
            });
        };

        $scope.hapusData = function(data) {
            if (confirm('Yakin ingin menghapus data ini?')) {
                console.log('Hapus data:', data);
                medifirstService.post('sdm/delete-data-jabatan', { id: data.id }).then(function (res) {
                    toastr.success('Data berhasil dihapus');
                    $scope.Search(); // refresh grid
                }, function (err) {
                    toastr.error('Gagal menghapus data');
                });
            }
        };



                //* BATAS SUCI *//
                }
            ]);
        });