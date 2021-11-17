define(['initialize', 'Configuration'], function (initialize, config) {
    'use strict';
    initialize.controller('HasilLaboratoriumCtrl', ['$scope', '$state', 'MedifirstService', 'CacheHelper',
        function ($scope, $state, medifirstService, cacheHelper) {

            $scope.isRouteLoading = false;
            $scope.norecPD = $state.params.norecPd
            $scope.norecAPD = $state.params.norecApd
            // $scope.shows = 0;
            $scope.item = {};
            $scope.hideBtn = false

            LoadCacheHelper();
            function LoadCacheHelper() {
                var chacePeriode = cacheHelper.get('chaceHasilLab2');
                var hideHasilLab = cacheHelper.get('hideHasilLab');
                if( hideHasilLab !=undefined ){
                    $scope.hideBtn = hideHasilLab
                }else{
                    $scope.hideBtn = false
                }
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]

                    cacheHelper.set('chaceHasilLab2',undefined);
                    cacheHelper.set('hideHasilLab',undefined);
                    //    if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                    //         $scope.showTombol = true
                    //    }
                }
                // init()
            }
            $scope.noRegistrasi = $state.params.noRegistrasi;
            $scope.noOrder = $state.params.noOrder;


            $scope.result = function () {
                //belum di rapihkan, 2 view yang berbeda
                ///grid untuk di modul app lab khusus
                $scope.group = {
                    field: "Pemeriksaan"
                };

                // $scope.ColumnResult = {
                //     toolbar: [
                //         "excel",

                //     ],
                //     excel: {
                //         fileName: "HasilLab.xlsx",
                //         allPages: true,
                //     },

                //     excelExport: function (e) {

                //         var sheet = e.workbook.sheets[0];
                //         sheet.frozenRows = 2;
                //         sheet.mergedCells = ["A1:H1"];
                //         sheet.name = "Hasil";

                //         var myHeaders = [

                //             {
                //                 value: "Hasil Laboratorium",
                //                 fontSize: 15,
                //                 textAlign: "center",
                //                 background: "#c1d2d2",
                //                 // color:"#ffffff"
                //             }];

                //         sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                //     },
                //     columns: [{
                //         field: "namaPemeriksaan",
                //         title: "Nama Pemeriksaan",
                //         width: "20%"
                //     }, {
                //         field: "hasilPemeriksaan",
                //         title: "Hasil Pemeriksaan",
                //         width: "15%",
                //         attributes: {
                //             class: "#=flag != 'N' ? 'red' : 'green' #"
                //         }
                //     }, {
                //         field: "nilaiNormal",
                //         title: "Nilai Normal",
                //         width: "15%"
                //     }, {
                //         field: "satuan",
                //         title: "Satuan",
                //         width: "8%"
                //     }, {
                //         field: "keterangan",
                //         title: "Keterangan",
                //         width: "15%"
                //     }, {
                //         field: "validator",
                //         title: "Validator",
                //         width: "20%"
                //     }, {
                //         title: "Status",
                //         field: "flag",
                //         width: "7%"
                //     }, {
                //         hidden: true,
                //         field: "paket",
                //         title: "Pemeriksaan"
                //     }, {
                //         hidden: true,
                //         field: "idLab"
                //     }, {
                //         hidden: true,
                //         field: "urutan"

                //     }]
                // };


            //   medifirstService.get("laboratorium/get-hasil-lab?noorder=" + $scope.noOrder).then(function (data) {
            //         var sourceGrid = []
            //         if (data.statResponse == true && data.data.length > 0) {
            //             sourceGrid = data.data
            //         } else
            //             toastr.info('Data Hasil tidak ada', 'Info')

            //         $scope.resultGrids = new kendo.data.DataSource({
            //             data: sourceGrid,
            //             group: {
            //                 field: "paket"
            //             },
            //             sort: { field: "urutan", dir: "asc" }
            //         });
            //     });
            // }
            $scope.ColumnResult = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "HasilLab.xlsx",
                    allPages: true,
                },

                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:G1"];
                    sheet.name = "Hasil";

                    var myHeaders = [

                        {
                            value: "Hasil Laboratorium",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                columns: [{
                    field: "nama_pemeriksaan",
                    title: "Nama Pemeriksaan",
                    width: "20%"
                }, {
                    field: "hasil",
                    title: "Hasil Pemeriksaan",
                    width: "15%",
                    attributes: {
                        class: "#=flag != 'N' ? 'red' : 'green' #"
                    }
                }, {
                    field: "nilainormal",
                    title: "Nilai Normal",
                    width: "15%"
                }, 
                {
                    field: "satuan",
                    title: "Satuan",
                    width: "8%"
                }, 
                // {
                //     field: "keterangan",
                //     title: "Keterangan",
                //     width: "15%"
                // }, 
                {
                    field: "analis",
                    title: "Analis",
                    width: "20%"
                }, 
                {
                    field: "tanggal_validasi",
                    title: "Tgl Hasil",
                    width: "20%"
                },
                // {
                //     title: "Status",
                //     field: "flag",
                //     width: "7%"
                // },
                //     {
                //     field: "nama_alat",
                //     title: "Alat",
                //     width: "15%"
                // },
                {
                    field: "resourceType",
                    title: "Metode",
                    width: "15%"
                },
                 {
                    hidden: true,
                    field: "unit",
                    title: "Jenis"
                },
         
                //  {
                //     hidden: true,
                //     field: "no_urut"

                // }
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                }
                ,
                pageable: {
                    messages: {
                        display: "Menampilkan {2} data"
                    }
                },
            };
            $scope.isRouteLoading =true
            medifirstService.get("laboratorium/get-hasil-lis?noorder=" + $scope.noOrder).then(function (data) {
                var sourceGrid = []
                var resBrid = data.data.resBridging
                var produk =  data.data.produk
                // if (data.statResponse == true && resBrid.status == true && resBrid.data!=null) {

                //     var konten =resBrid.data[0].contained
                //     if(konten.length > 0){
                //         for (var i = 0; i < konten.length; i++) {
                //             const elem = konten[i]
                //             var detailjenis = null
                //             for (var x = 0; x < produk.length; x++) {
                //                var prod = produk[x]
                //                // if(prod.test_cd ==elem.code.coding[0].display){
                //                //    detailjenis = prod.detailjenisproduk
                //                //    break
                //                // }
                //                if(prod.namaproduk.toLowerCase() == elem.code.text.toLowerCase() ){
                //                   detailjenis = prod.detailjenisproduk
                //                   break
                //                }
                //             }

                //             var hasil = elem.valueQuantity.value
                //             var nilaimin =''
                //             var nilaimax =''
                //             if(elem.referenceRange !=null){
                //                 nilaimin  = elem.referenceRange[0].low !=null ?elem.referenceRange[0].low.value : ''
                //                 nilaimax  = elem.referenceRange[0].high!=null ?elem.referenceRange[0].high.value : ''
                //             }
                             
                //             var flag =''
                //             if(nilaimin  =='' && nilaimax ==''){
                //                flag ='N' 
                //             }else{
                //                if(!isNaN(parseInt(hasil))){
                //                    if(parseFloat(hasil) >= parseFloat(nilaimin) && parseFloat(hasil) <= parseFloat(nilaimax)){
                //                       flag ='N'
                //                     } 
                //                 }else{
                //                     if(nilaimin ==hasil ){
                //                       flag ='N'
                //                     }
                //                 }
                //             }
                                  
                //             var nilaiNM = nilaimax !=''? ' - '+nilaimax :''
                //             var nilaiNormal = nilaimin +nilaiNM
                //             var data2 = {
                //                 'flag' : flag,
                //                 'nama_pemeriksaan' : elem.code.text,
                //                 'analis' : elem.performer[0].display,
                //                 'hasil':hasil,
                //                 'satuan' : elem.valueQuantity.unit,
                //                 'nilainormal' : nilaiNormal,
                //                 'tanggal_validasi' : moment(new Date(resBrid.data[0].issued)).format('YYYY-MM-DD HH:mm'),
                //                 'resourceType' :resBrid.data[0].resourceType,
                //                 'unit':detailjenis
                //             }
                //             sourceGrid.push(data2)
                           
                //         }

                //     }
                if(resBrid == null){
                    toastr.info("Data tidak ada", 'Info')
                    $scope.isRouteLoading =false
                    return;
                }

                if(resBrid.status ==200){
                    for (var i = 0; i < resBrid.data.length; i++) {
                       const elem = resBrid.data[i]
                       let flag = 'T'
                       if(elem.flag  != 'H' &&elem.flag  != 'L'&&elem.flag  != '**' ){
                           flag = 'N'
                       }
                       var data2 = {
                            'flag' :flag,
                            'nama_pemeriksaan' :elem.examination_name,
                            'analis' : '-',
                            'hasil':elem.result_value,
                            'satuan' : elem.unit,
                            'nilainormal' : elem.normal_value,
                            'tanggal_validasi' : moment(new Date(elem.visit_date)).format('YYYY-MM-DD HH:mm'),
                            'resourceType' :elem.metode,
                            'unit':elem.treatment_name
                        }
                        sourceGrid.push(data2)
                    }


                } else
                    toastr.info(resBrid.message, 'Info')

                $scope.isRouteLoading = false
                $scope.resultGrids = new kendo.data.DataSource({
                    data: sourceGrid,
                     schema: {
                            model: {
                                // id: "id",
                                fields: {
                                    nama_pemeriksaan: { editable: false ,type: "string"},
                                
                                }
                            }
                        },
                    selectable: true,
                    refresh: true,
                    group: {
                        field: "unit"
                    },
                   
                    
                    // sort: { field: "no_urut", dir: "asc" }
                });
            });
        }

         $scope.result();
         $scope.cetak = function(){
             var profile  = 21
             var local =JSON.parse(localStorage.getItem('profile')) 
             var nama = medifirstService.getPegawaiLogin().namaLengkap
             if(local!= null)
                  profile =local.id;
            window.open(config.baseApiBackend + "report/get-data-hasil-lab?noorder=" + $state.params.noOrder+'&kdprofile='+profile 
                +'&nama='+nama,  '_blank');

        }

        }

    ]);
});