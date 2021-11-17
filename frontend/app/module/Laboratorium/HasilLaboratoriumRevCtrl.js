define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('HasilLaboratoriumRevCtrl', ['$scope', '$state', 'MedifirstService', 'CacheHelper',
        function ($scope, $state, medifirstService, cacheHelper) {

            $scope.isRouteLoading = false;
            $scope.norecPD = $state.params.norecPd
            $scope.norecAPD = $state.params.norecApd
            $scope.norecPP = $state.params.norecPP
           
            // $scope.shows = 0;
            $scope.item = {};

            LoadCacheHelper();
            function LoadCacheHelper() {                
                $scope.KelompokUser = medifirstService.getKelompokUser(); 
                if ($scope.KelompokUser != "laborat") {
                    $scope.IsSave = false;
                } else{
                    $scope.IsSave = true;
                }              
                var chacePeriode = cacheHelper.get('chaceHasilLab2');
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
                    $scope.item.tgllahir = chacePeriode[13]
                    $scope.item.objectjeniskelaminfk = chacePeriode[14]
                    $scope.item.norecPP = chacePeriode[15]
                    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                    const firstDate = new Date($scope.item.tgllahir);
                    const secondDate = new Date($scope.item.tglRegistrasi);
                    
                    $scope.item.umurDay = Math.round(Math.abs((firstDate - secondDate) / oneDay));
              
                }
                // init()
            }
            $scope.noRegistrasi = $state.params.noRegistrasi;
            $scope.noOrder = $state.params.noOrder;
           
            $scope.norecPP = $scope.item.norecPP;
            // var  onDataBound = function() {
            //     var gridId ="gridId"
            //     var colTitle ="Nama Pemeriksaan"

            // $('#' + gridId + '>.k-grid-content>table').each(function (index, item) {

            //     var dimension_col = 1;
            //     // First, scan first row of headers for the "Dimensions" column.
            //     $('#' + gridId + '>.k-grid-header>.k-grid-header-wrap>table').find('th').each(function () {
            //         if ($(this).text() == colTitle) {

            //             // first_instance holds the first instance of identical td
            //             var first_instance = null;

            //             $(item).find('tr').each(function () {

            //                 // find the td of the correct column (determined by the colTitle)
            //                 var dimension_td = $(this).find('td:nth-child(' + dimension_col + ')');

            //                 if (first_instance == null) {
            //                     first_instance = dimension_td;
            //                 } else if (dimension_td.text() == first_instance.text() ) {
            //                     // if current td is identical to the previous
            //                     // then remove the current td
            //                     // debugger
            //                     dimension_td.remove();
            //                     // increment the rowspan attribute of the first instance
            //                     first_instance.attr('rowspan', typeof first_instance.attr('rowspan') == "undefined" ? 2 : first_instance.attr('rowspan') + 1);
            //                 } else {
            //                     // this cell is different from the last
            //                     first_instance = dimension_td;
            //                 }
            //             });
            //             return;
            //         }
            //         dimension_col++;
            //     });

            // });
            // }
           
            $scope.result = function () {
                $scope.resultGrids = new kendo.data.DataSource({
                    data: []
                })
                // $scope.group = {
                //     field: "detailjenisproduk"
                // };

                $scope.ColumnResult = {
                    toolbar: [
                        "excel",

                    ],
                    excel: {
                        fileName: "HasilLab.xlsx",
                        allPages: true,
                    },
                    selectable: 'row',
                    pageable: true,
                    editable: true,

                    // dataBound: onDataBound,
                    excelExport: function (e) {

                        var sheet = e.workbook.sheets[0];
                        sheet.frozenRows = 2;
                        sheet.mergedCells = ["A1:H1"];
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
                        field: "namaproduk",
                        title: "Nama Pemeriksaan",
                        width: "20%"
                    },
                    {
                        field: "detailpemeriksaan",
                        title: "Detail Pemeriksaan",
                        width: "20%"
                    }, {
                        field: "hasil",
                        title: "Hasil Pemeriksaan",
                        width: "15%",
                        attributes: {
                            class: "#=flag != 'N' ? 'red' : 'green' #"
                       },
                       editor: dynamicEditor
                    }, {
                        field: "nilaitext",
                        title: "Nilai Normal",
                        width: "15%"
                    },
                    // {
                    //     field: "tipedata",
                    //     title: "tipedata",
                    //     width: "0%"
                        
                    // },
                    {
                        field: "satuanstandar",
                        title: "Satuan Hasil",
                        width: "20%"
                    },
                    {
                        field: "Metode",
                        title: "Metode",
                        width: "20%"
                    },

                    {
                        hidden: true,
                        field: "detailjenisproduk",
                        title: "Jenis Pemeriksaan"
                    },

                    {
                        hidden: true,
                        field: "nourutdetail"

                    }]
                };
                $scope.isRouteLoading = true
                
                medifirstService.get("laboratorium/get-hasil-lab-manual?norec_apd=" + $state.params.norecApd +
                    '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay + '&norec=' + $scope.item.norecPP ).then(function (data) {
                        // var sourceGrid = []
                        $scope.isRouteLoading = false;
                        if (data.statResponse == true && data.data.data.length > 0) {
                            // sourceGrid = data.data.data

                            for (let i = 0; i < data.data.data.length; i++) {
                                const element = data.data.data[i];
                            //     if (element.hasil != null) {
                            //         if (parseFloat(element.hasil) <= parseFloat(element.nilaimax)
                                        // && parseFloat(element.hasil) >= parseFloat(element.nilaimin)) {
                            //             element.flag = 'N'
                            //         }
                            //         if (parseFloat(element.hasil) > parseFloat(element.nilaimax)
                            //             || parseFloat(element.hasil) < parseFloat(element.nilaimin)) {
                            //             element.flag = ''
                            //         }
                            //         if (isNaN(parseFloat(element.nilaimin)) || isNaN(parseFloat(element.nilaimax))) {
                            //             if (element.nilaimin == element.hasil || element.nilaimax == element.hasil) {
                            //                 element.flag = 'N'
                            //             } else {
                            //                 element.flag = ''
                            //             }
                            //         }
                            //     } else {
                                    // element.flag = ''
                            //     }

                            }
                            // $scope.isRouteLoading = false
                            $scope.resultGrids = new kendo.data.DataSource({
                                data: data.data.data,
                                group: [
                                    { field: "detailjenisproduk" },
                                    // { field: "namaproduk" }
                                ],
                                sort: { field: "nourutdetail", dir: "asc" },
                                schema: {
                                    model: {
                                        id: "id",
                                        fields: {
                                            detailjenisproduk: { editable: false, type: "string" },
                                            detailpemeriksaan: { editable: false, type: "string" },
                                            memohasil: { editable: false, type: "string" },
                                            namaproduk: { editable: false, type: "string" },
                                            satuanstandar: { editable: false, type: "string" },
                                            // detailpemeriksaan: { editable: false, type: "string" },
                                            nilaimax: { editable: false, type: "string" },
                                            nilaimin: { editable: false, type: "string" },
                                            hasil: { editable:(dynamicEditor) },
                                            nourutdetail: { editable: false, type: "number" },
                                            nilaitext: { editable: false, type: "string" }
                                        }
                                    }
                                },
                                change: function (e) {
                                    console.log("change :" + e.action);
                                    if (e.field && e.action === "itemchange") {
                                        if(e.items[0].hasil){
                                            // $scope.item.nilaistr = e.items[0].nilaimin + '-' + e.items[0].nilaimax
                                            let HasilInput = e.items[0].hasil 
                                            if (HasilInput.indexOf("+/") >= 0) {
                                                let hssl = "positif"
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                if(hssl == nilaistring){
                                                    e.items[0].flag ="N"           
                                                }else{
                                                    e.items[0].flag ="Y"         
                                                }
                                            }else if(HasilInput.indexOf("-/") >= 0){
                                                let hssl = "negatif"
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                if(hssl == nilaistring){
                                                    e.items[0].flag ="N"           
                                                }else{
                                                    e.items[0].flag ="Y"         
                                                }
                                            }else if(HasilInput.indexOf("<") >= 0){
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split("<");
                                                let hssl = parseFloat(hsslARr[1])

                                                if(hssl >= a && hssl <= b){
                                                    e.items[0].flag ="N"           
                                                }else{
                                                    e.items[0].flag ="Y"         
                                                }
                                            }else if(HasilInput.indexOf(">") >= 0){
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split(">");
                                                let hssl = parseFloat(hsslARr[1]) 

                                                if(hssl >= a && hssl <= b){
                                                    e.items[0].flag ="N"           
                                                }else{
                                                    e.items[0].flag ="Y"         
                                                }
                                            }else if(HasilInput.indexOf("-") >= 0){
                                                let a = parseFloat(e.items[0].nilaimin)
                                                let b = parseFloat(e.items[0].nilaimax)
                                                let hsslARr = HasilInput.split("-");
                                                let hssl0 = parseFloat(hsslARr[0]) 
                                                let hssl = parseFloat(hsslARr[1]) 

                                                if(hssl0 >= a && hssl <= b){
                                                    e.items[0].flag ="N"           
                                                }else{
                                                    e.items[0].flag ="Y"         
                                                }
                                            }else if(e.items[0].nilaimin == null){
                                                let hssl = e.items[0].hasil 
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                
                                                    e.items[0].flag ="N"         
                                             
                                            }else if(e.items[0].nilaimin == ""){
                                                let hssl = e.items[0].hasil 
                                                let nilaistring = e.items[0].nilaitext
                                                nilaistring = nilaistring.toUpperCase();
                                                hssl = hssl.toUpperCase();
                                                
                                                    e.items[0].flag ="N"         
                                                
                                            }
                                            else{
                                                if(e.items[0].nilaimin != null){
                                                    if(e.items[0].tipedata == 2)
                                                    {
                                                        let a = (e.items[0].nilaimin).toUpperCase()
                                                        let b = (e.items[0].nilaimax).toUpperCase()
                                                        let hssl = ((e.items[0].hasil).trim()).toUpperCase()
                                                        if(hssl >= a && hssl <= b){
                                                            e.items[0].flag ="N"           
                                                        }else{
                                                            e.items[0].flag ="Y"         
                                                        } 
                                                    }else
                                                    {
                                                        let a = parseFloat(e.items[0].nilaimin)
                                                        let b = parseFloat(e.items[0].nilaimax)
                                                        let hssl = parseFloat(e.items[0].hasil )
                                                        if(hssl >= a && hssl <= b){
                                                            e.items[0].flag ="N"           
                                                        }else{
                                                            e.items[0].flag ="Y"         
                                                        }
                                                    }
                                                    
                                                }else{
                                                    let hssl = (e.items[0].hasil).trim() 
                                                    let nilaistring = e.items[0].nilaitext
                                                    nilaistring = nilaistring.toUpperCase();
                                                    hssl = hssl.toUpperCase();
                                                    if(hssl == nilaistring){
                                                        e.items[0].flag ="N"           
                                                    }else{
                                                        e.items[0].flag ="Y"         
                                                    }
                                                }
                                            }
//                                             alert('hasilna :'+e.items[0].hasil)
                                            e.items.state = "edit"
//                                         } else {
//                                             e.items.state = "add"
                                        }
                                        // $scope.current.selisih = $scope.current.stokReal - $scope.current.qtyProduk;
                                        $scope.resultGrids.fetch();
                                    }
                                }
                            });
                        } else {
                            toastr.info('Data Hasil tidak ada', 'Info')
                        }
                    });
            }

            $scope.result();
            $scope.simpanNilaiNormal = function(){
                if ($scope.item.objectprodukfk == undefined) {
                    return
                }
                $scope.popupEntry.center().open();
                //laboratorium/get-for-update-nilainormal
                 medifirstService.get("laboratorium/get-for-update-nilainormal?produkfk=" + $scope.item.objectprodukfk +
                    '&mpid=' + $scope.item.mpid).then(function (data) {
                        $scope.item.kelompokUmur = data.data.data[0].kelompokumur
                        for (var i = data.data.data.length - 1; i >= 0; i--) {
                            if(data.data.data[i].jkid == 1) {
                                $scope.item.idL = data.data.data[i].nnid
                                $scope.item.nilaiminL = data.data.data[i].nilaimin
                                $scope.item.nilaimaxL = data.data.data[i].nilaimax
                                $scope.item.nilaimaxL = data.data.data[i].nilaimax
                                $scope.item.nilaiTextL = data.data.data[i].nilaitext
                            }else if(data.data.data[i].jkid == 2) {
                                $scope.item.idP = data.data.data[i].nnid
                                $scope.item.nilaiminP = data.data.data[i].nilaimin
                                $scope.item.nilaimaxP = data.data.data[i].nilaimax
                                $scope.item.nilaimaxP = data.data.data[i].nilaimax
                                $scope.item.nilaiTextP = data.data.data[i].nilaitext
                            }
                        }
                        
                    })
                    //laboratorium/save-update-nilainormal
            }
            $scope.simpanUpdateNilaiNormal = function () {

                var objSave = {
                    "l": {
                        id:$scope.item.idL,
                        nilaimax:$scope.item.nilaimaxL,
                        nilaimin:$scope.item.nilaiminL,
                        nilaitext:$scope.item.nilaiTextL,
                    },
                    "p": {
                        id:$scope.item.idP,
                        nilaimax:$scope.item.nilaimaxP,
                        nilaimin:$scope.item.nilaiminP,
                        nilaitext:$scope.item.nilaiTextP,
                    }
                }
                medifirstService.post('laboratorium/save-update-nilainormal', objSave).then(function (e) {
                    $scope.popupEntry.center().close();
                    if ($scope.dataSelected.jeniskelaminfk == 1) {
                        $scope.dataSelected.nilaimin = $scope.item.nilaiminL
                        $scope.dataSelected.nilaimax = $scope.item.nilaimaxL
                        $scope.dataSelected.nilaitext = $scope.item.nilaiTextL

                        $scope.item.nilaimin = $scope.item.nilaiminL
                        $scope.item.nilaimax = $scope.item.nilaimaxL
                    }
                    if ($scope.dataSelected.jeniskelaminfk == 2) {
                        $scope.dataSelected.nilaimin = $scope.item.nilaiminP
                        $scope.dataSelected.nilaimax = $scope.item.nilaimaxP
                        $scope.dataSelected.nilaitext = $scope.item.nilaiTextP

                        $scope.item.nilaimin = $scope.item.nilaiminP
                        $scope.item.nilaimax = $scope.item.nilaimaxP
                    }
                    let HasilInput = $scope.dataSelected.hasil
                    if (HasilInput != "") {
                        if (HasilInput.indexOf("+/") >= 0) {
                            let hssl = "positif"
                            let nilaistring = $scope.dataSelected.nilaitext
                            nilaistring = nilaistring.toUpperCase();
                            hssl = hssl.toUpperCase();
                            if(hssl == nilaistring){
                                $scope.dataSelected.flag ="N"           
                            }else{
                                $scope.dataSelected.flag ="Y"         
                            }
                        }else if(HasilInput.indexOf("-/") >= 0){
                            let hssl = "negatif"
                            let nilaistring = $scope.dataSelected.nilaitext
                            nilaistring = nilaistring.toUpperCase();
                            hssl = hssl.toUpperCase();
                            if(hssl == nilaistring){
                                $scope.dataSelected.flag ="N"           
                            }else{
                                $scope.dataSelected.flag ="Y"         
                            }
                        }else if(HasilInput.indexOf("<") >= 0){
                            let a = parseFloat($scope.dataSelected.nilaimin)
                            let b = parseFloat($scope.dataSelected.nilaimax)
                            let hsslARr = HasilInput.split("<");
                            let hssl = parseFloat(hsslARr[1])

                            if(hssl >= a && hssl <= b){
                                $scope.dataSelected.flag ="N"           
                            }else{
                                $scope.dataSelected.flag ="Y"         
                            }
                        }else if(HasilInput.indexOf(">") >= 0){
                            let a = parseFloat($scope.dataSelected.nilaimin)
                            let b = parseFloat($scope.dataSelected.nilaimax)
                            let hsslARr = HasilInput.split(">");
                            let hssl = parseFloat(hsslARr[1]) 

                            if(hssl >= a && hssl <= b){
                                $scope.dataSelected.flag ="N"           
                            }else{
                                $scope.dataSelected.flag ="Y"         
                            }
                        }else if(HasilInput.indexOf("-") >= 0){
                            let a = parseFloat($scope.dataSelected.nilaimin)
                            let b = parseFloat($scope.dataSelected.nilaimax)
                            let hsslARr = HasilInput.split("-");
                            let hssl0 = parseFloat(hsslARr[0]) 
                            let hssl = parseFloat(hsslARr[1]) 

                            if(hssl0 >= a && hssl <= b){
                                $scope.dataSelected.flag ="N"           
                            }else{
                                $scope.dataSelected.flag ="Y"         
                            }
                        }else{
                            if($scope.dataSelected.nilaimin != null){
                                let a = parseFloat($scope.dataSelected.nilaimin)
                                let b = parseFloat($scope.dataSelected.nilaimax)
                                let hssl = parseFloat($scope.dataSelected.hasil )

                                if(hssl >= a && hssl <= b){
                                    $scope.dataSelected.flag ="N"           
                                }else{
                                    $scope.dataSelected.flag ="Y"         
                                }
                            }else{
                                let hssl = $scope.dataSelected.hasil 
                                let nilaistring = $scope.dataSelected.nilaitext
                                nilaistring = nilaistring.toUpperCase();
                                hssl = hssl.toUpperCase();
                                if(hssl == nilaistring){
                                    $scope.dataSelected.flag ="N"           
                                }else{
                                    $scope.dataSelected.flag ="Y"         
                                }
                            }
                        }
                    }
                })
            }

            function dynamicEditor(container, options) {

              // if(options.model.tipedata == 1){
              //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
              //   input.appendTo(container);
              // }else{
                var input = $('<input type="text" class="k-input k-textbox" name="hasil" data-bind="value:hasil">');
                input.appendTo(container);
              // }
            };
            $scope.kl = function(ttm){
                $scope.item.nilaimin = $scope.dataSelected.nilaimin
                $scope.item.nilaimax = $scope.dataSelected.nilaimax
                $scope.item.objectprodukfk = $scope.dataSelected.produkfk
                $scope.item.mpid = $scope.dataSelected.map_id
                $scope.item.nmPemeriksaan = $scope.dataSelected.namaproduk
                $scope.item.detPemeriksaan = $scope.dataSelected.detailpemeriksaan
                // alert("ASDASD")
            }

            

            $scope.simpan = function () {
                var dataArray = [];
                for (var i = $scope.resultGrids._data.length - 1; i >= 0; i--) {
                    if ($scope.resultGrids._data[i].hasil != null)
                        dataArray.push({
                            "produkfk": $scope.resultGrids._data[i].produkfk,
                            "hasil": $scope.resultGrids._data[i].hasil,
                            "noregistrasifk": $state.params.norecApd,
                            "flag": $scope.resultGrids._data[i].flag,
                            "detailpemeriksaan": $scope.resultGrids._data[i].detailpemeriksaan,
                            "norecpelayanan" : $scope.resultGrids._data[i].norecpp,
                        });
                }

                if (dataArray.length !== 0) {
                    var objSave = {
                        "hasil": dataArray
                    }
                    medifirstService.post('laboratorium/save-hasil-lab-manual', objSave).then(function (e) {
                        $scope.result();
                    })
                }
            }
            $scope.simpanTAT = function () {
                
            let json = {
                id: '',
                noregistrasifk:  $state.params.norecApd,
                TglAwal: '',
                TglAkhir: '',
                statusenabled: 1,
               
            }
            medifirstService.post('laboratorium/save-tat', json).then(function (e) {
               
            })
            }

            $scope.ubahAT = function () {
                let json = {
                    id: '',
                    noregistrasifk:  $state.params.norecApd,
                    TglAwal: '',
                    TglAkhir: '',
                    statusenabled: 1,
                
                }
                medifirstService.post('laboratorium/update-tat', json).then(function (e) {
                
                })
            }

            
            $scope.kembali = function () {
                window.history.back()
            }
            $scope.kembaliAh = function () {
                $scope.popUpDokter.close();
            }
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
            $scope.showPopUp = function () {
                $scope.popUpDokter.center().open();
            }
            $scope.cetak = function () {
                var dokter ="";
                var user = medifirstService.getPegawaiLogin(); 
                var stt = 'false'
                if (confirm('View Hasil Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                if($scope.item.DataPegawai == undefined)
                {
                    alert("Pilih terlebih dahulu dookter nya!!")
                    return;
                }else{
                dokter = $scope.item.DataPegawai
                }
                // medifirstService.get("laboratorium/get-riwayat-bayar?norec=" + $scope.norecAPD ).then(function (data) {
                //     if(data.data.data[0].nostruklastfk == null )
                //     {
                //          alert("Passien Umum Wajib Bayar Terlebih Dahulu!!")
                //          return;
                //     }
                //  });

                var client = new HttpClient();
                 client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD 
                            + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                            + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view='+ stt + '&doketr=' + dokter.namalengkap +'&catatan=' + $scope.item.catatan, function (response) {

                }); 
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=' + $scope.dataSbnSelected.noregistrasi + $scope.dataSbnSelected.norec_sp + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {                    
                
                    // $scope.popUpDokter.close();
                // });
            }



            $scope.cetakSurat = function () {
                var dokter ="";
                var user = medifirstService.getPegawaiLogin(); 
                var stt = 'false'
                if (confirm('View Surat Keterangan Laboratorium? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                if($scope.item.catatan == undefined)
                {
                    alert("Isi Catatan Untuk mengisi tujuan suratnya!!")
                    return;
                }
                var client = new HttpClient();
                
                client.get('http://127.0.0.1:1237/printvb/bridging?cetak-suratketerangan-lab=1&norec=' + $scope.norecAPD 
                            + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                            + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view='+ stt + '&doketr=' + dokter.namalengkap +'&catatan=' + $scope.item.catatan, function (response) {

                }); 
                // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=' + $scope.dataSbnSelected.noregistrasi + $scope.dataSbnSelected.norec_sp + '&idPegawai=' + $scope.pegawai.namaLengkap + '&STD=' + sudahTerimaDari + '&view=' + stt, function (response) {                    
                
                    $scope.popUpDokter.close();
                // });
            }

            medifirstService.getPart("laboratorium/get-combo-dokter-lab").then(function (data) {
                $scope.ListDataPegawai = data;
            });

           

        }
    ]);

});