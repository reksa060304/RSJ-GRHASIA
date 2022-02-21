define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanKegiatanPelayananResepCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService',
        function ($scope, dateHelper, $http, $state, medifirstService) {
            //Inisial Variable   
            $scope.isRouteLoading = false;
            $scope.item = {};
            $scope.now = new Date();
            $scope.date = new Date();
            $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
            $scope.dataSelected = {};
            $scope.item.jmlRows = 50;
            FormLoad();

            function LoadCombo() {
                medifirstService.get("farmasi/get-datacombo?", true).then(function (dat) {
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listRajalRanap = [
                        { id: 1, names: "Rawat Jalan" },
                        { id: 2, names: "Rawat Inap"}
                    ];
                    $scope.namaLengkap = medifirstService.getPegawaiLogin();
                    // init();
                });
                
            }

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle("fast", "linear");
            }

            function init() {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');

                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    kp = $scope.item.kelompokPasien.id
                }

                var rajalRanap = "";
                if ($scope.item.rajalRanap != undefined) {
                    rajalRanap = $scope.item.rajalRanap.id
                }

                medifirstService.get("farmasi/get-laporan-kegiatan-pelayanan-resep?" +
                    "tglAwal=" + tglAwal + "&kpid=" + kp + "&rajalRanap=" + rajalRanap
                    , true).then(function (data) {
                        $scope.isRouteLoading = false;
                        var datas = data.data.detail;
                        var lengthawal = datas.length;
                        //console.log(datas[i].jumlahtotalobatjadifebruary);

                        if(datas.length === 0 || datas.length === 1 || datas.length === 2 || datas.length === 3 || datas.length === 4 || datas.length === 5 || datas.length === 6 || datas.length === 7 || datas.length === 8 || datas.length === 9 || datas.length === 10 || datas.length === 11 || datas.length === 12 || datas.length === 13 || datas.length === 14 || datas.length === 15 || datas.length === 16){
                            datas.length = 17;
                        }

                        for(i=lengthawal; i<datas.length; i++){
                            datas[i]={};
                            datas[i].jumlahtotalrkedecember = 0;
                            datas[i].jumlahtotalrkeapril = 0;
                            datas[i].jumlahtotalrkeaugust = 0;
                            datas[i].jumlahtotalrkefebruary = 0;
                            datas[i].jumlahtotalrkejanuary = 0;
                            datas[i].jumlahtotalrkejuly = 0;
                            datas[i].jumlahtotalrkejune = 0;
                            datas[i].jumlahtotalrkemarch = 0;
                            datas[i].jumlahtotalrkemay = 0;
                            datas[i].jumlahtotalrkenovember = 0;
                            datas[i].jumlahtotalrkeoctober = 0;
                            datas[i].jumlahtotalrkeseptember = 0;
                            datas[i].jumlahtotalresepdecember = 0;
                            datas[i].jumlahtotalresepapril = 0;
                            datas[i].jumlahtotalresepaugust = 0;
                            datas[i].jumlahtotalresepfebruary = 0;
                            datas[i].jumlahtotalresepjanuary = 0;
                            datas[i].jumlahtotalresepjuly = 0;
                            datas[i].jumlahtotalresepjune = 0;
                            datas[i].jumlahtotalresepmarch = 0;
                            datas[i].jumlahtotalresepmay = 0;
                            datas[i].jumlahtotalresepnovember = 0;
                            datas[i].jumlahtotalresepoctober = 0;
                            datas[i].jumlahtotalresepseptember = 0;
                            datas[i].jumlahtotalobatjadidecember = 0;
                            datas[i].jumlahtotalobatjadiapril = 0;
                            datas[i].jumlahtotalobatjadiaugust = 0;
                            datas[i].jumlahtotalobatjadifebruary = 0;
                            datas[i].jumlahtotalobatjadijanuary = 0;
                            datas[i].jumlahtotalobatjadijuly = 0;
                            datas[i].jumlahtotalobatjadijune = 0;
                            datas[i].jumlahtotalobatjadimarch = 0;
                            datas[i].jumlahtotalobatjadimay = 0;
                            datas[i].jumlahtotalobatjadinovember = 0;
                            datas[i].jumlahtotalobatjadioctober = 0;
                            datas[i].jumlahtotalobatjadiseptember = 0;
                            datas[i].jumlahtotalkapsulkurangdecember = 0;
                            datas[i].jumlahtotalkapsulkurangapril = 0;
                            datas[i].jumlahtotalkapsulkurangaugust = 0;
                            datas[i].jumlahtotalkapsulkurangfebruary = 0;
                            datas[i].jumlahtotalkapsulkurangjanuary = 0;
                            datas[i].jumlahtotalkapsulkurangjuly = 0;
                            datas[i].jumlahtotalkapsulkurangjune = 0;
                            datas[i].jumlahtotalkapsulkurangmarch = 0;
                            datas[i].jumlahtotalkapsulkurangmay = 0;
                            datas[i].jumlahtotalkapsulkurangnovember = 0;
                            datas[i].jumlahtotalkapsulkurangoctober = 0;
                            datas[i].jumlahtotalkapsulkurangseptember = 0;
                            datas[i].jumlahtotalkapsullebihdecember = 0;
                            datas[i].jumlahtotalkapsullebihapril = 0;
                            datas[i].jumlahtotalkapsullebihaugust = 0;
                            datas[i].jumlahtotalkapsullebihfebruary = 0;
                            datas[i].jumlahtotalkapsullebihjanuary = 0;
                            datas[i].jumlahtotalkapsullebihjuly = 0;
                            datas[i].jumlahtotalkapsullebihjune = 0;
                            datas[i].jumlahtotalkapsullebihmarch = 0;
                            datas[i].jumlahtotalkapsullebihmay = 0;
                            datas[i].jumlahtotalkapsullebihnovember = 0;
                            datas[i].jumlahtotalkapsullebihoctober = 0;
                            datas[i].jumlahtotalkapsullebihseptember = 0;
                            datas[i].jumlahtotalracikkurangdecember = 0;
                            datas[i].jumlahtotalracikkurangapril = 0;
                            datas[i].jumlahtotalracikkurangaugust = 0;
                            datas[i].jumlahtotalracikkurangfebruary = 0;
                            datas[i].jumlahtotalracikkurangjanuary = 0;
                            datas[i].jumlahtotalracikkurangjuly = 0;
                            datas[i].jumlahtotalracikkurangjune = 0;
                            datas[i].jumlahtotalracikkurangmarch = 0;
                            datas[i].jumlahtotalracikkurangmay = 0;
                            datas[i].jumlahtotalracikkurangnovember = 0;
                            datas[i].jumlahtotalracikkurangoctober = 0;
                            datas[i].jumlahtotalracikkurangseptember = 0;
                            datas[i].jumlahtotalraciklebihdecember = 0;
                            datas[i].jumlahtotalraciklebihapril = 0;
                            datas[i].jumlahtotalraciklebihaugust = 0;
                            datas[i].jumlahtotalraciklebihfebruary = 0;
                            datas[i].jumlahtotalraciklebihjanuary = 0;
                            datas[i].jumlahtotalraciklebihjuly = 0;
                            datas[i].jumlahtotalraciklebihjune = 0;
                            datas[i].jumlahtotalraciklebihmarch = 0;
                            datas[i].jumlahtotalraciklebihmay = 0;
                            datas[i].jumlahtotalraciklebihnovember = 0;
                            datas[i].jumlahtotalraciklebihoctober = 0;
                            datas[i].jumlahtotalraciklebihseptember = 0;
                            datas[i].jumlahtotalraciksalepdecember = 0;
                            datas[i].jumlahtotalraciksalepapril = 0;
                            datas[i].jumlahtotalraciksalepaugust = 0;
                            datas[i].jumlahtotalraciksalepfebruary = 0;
                            datas[i].jumlahtotalraciksalepjanuary = 0;
                            datas[i].jumlahtotalraciksalepjuly = 0;
                            datas[i].jumlahtotalraciksalepjune = 0;
                            datas[i].jumlahtotalraciksalepmarch = 0;
                            datas[i].jumlahtotalraciksalepmay = 0;
                            datas[i].jumlahtotalraciksalepnovember = 0;
                            datas[i].jumlahtotalraciksalepoctober = 0;
                            datas[i].jumlahtotalraciksalepseptember = 0;
                            datas[i].jumlahtotalraciksirupdecember = 0;
                            datas[i].jumlahtotalraciksirupapril = 0;
                            datas[i].jumlahtotalraciksirupaugust = 0;
                            datas[i].jumlahtotalraciksirupfebruary = 0;
                            datas[i].jumlahtotalraciksirupjanuary = 0;
                            datas[i].jumlahtotalraciksirupjuly = 0;
                            datas[i].jumlahtotalraciksirupjune = 0;
                            datas[i].jumlahtotalraciksirupmarch = 0;
                            datas[i].jumlahtotalraciksirupmay = 0;
                            datas[i].jumlahtotalraciksirupnovember = 0;
                            datas[i].jumlahtotalraciksirupoctober = 0;
                            datas[i].jumlahtotalraciksirupseptember = 0;
                            datas[i].jumlahtotalkonselingdecember = 0;
                            datas[i].jumlahtotalkonselingapril = 0;
                            datas[i].jumlahtotalkonselingaugust = 0;
                            datas[i].jumlahtotalkonselingfebruary = 0;
                            datas[i].jumlahtotalkonselingjanuary = 0;
                            datas[i].jumlahtotalkonselingjuly = 0;
                            datas[i].jumlahtotalkonselingjune = 0;
                            datas[i].jumlahtotalkonselingmarch = 0;
                            datas[i].jumlahtotalkonselingmay = 0;
                            datas[i].jumlahtotalkonselingnovember = 0;
                            datas[i].jumlahtotalkonselingoctober = 0;
                            datas[i].jumlahtotalkonselingseptember = 0;
                            datas[i].jumlahtotalpetunjukdecember = 0;
                            datas[i].jumlahtotalpetunjukapril = 0;
                            datas[i].jumlahtotalpetunjukaugust = 0;
                            datas[i].jumlahtotalpetunjukfebruary = 0;
                            datas[i].jumlahtotalpetunjukjanuary = 0;
                            datas[i].jumlahtotalpetunjukjuly = 0;
                            datas[i].jumlahtotalpetunjukjune = 0;
                            datas[i].jumlahtotalpetunjukmarch = 0;
                            datas[i].jumlahtotalpetunjukmay = 0;
                            datas[i].jumlahtotalpetunjuknovember = 0;
                            datas[i].jumlahtotalpetunjukoctober = 0;
                            datas[i].jumlahtotalpetunjukseptember = 0;
                            datas[i].jumlahtotalvisitedecember = 0;
                            datas[i].jumlahtotalvisiteapril = 0;
                            datas[i].jumlahtotalvisiteaugust = 0;
                            datas[i].jumlahtotalvisitefebruary = 0;
                            datas[i].jumlahtotalvisitejanuary = 0;
                            datas[i].jumlahtotalvisitejuly = 0;
                            datas[i].jumlahtotalvisitejune = 0;
                            datas[i].jumlahtotalvisitemarch = 0;
                            datas[i].jumlahtotalvisitemay = 0;
                            datas[i].jumlahtotalvisitenovember = 0;
                            datas[i].jumlahtotalvisiteoctober = 0;
                            datas[i].jumlahtotalvisiteseptember = 0;
                            datas[i].jumlahtotalpemantauandecember = 0;
                            datas[i].jumlahtotalpemantauanapril = 0;
                            datas[i].jumlahtotalpemantauanaugust = 0;
                            datas[i].jumlahtotalpemantauanfebruary = 0;
                            datas[i].jumlahtotalpemantauanjanuary = 0;
                            datas[i].jumlahtotalpemantauanjuly = 0;
                            datas[i].jumlahtotalpemantauanjune = 0;
                            datas[i].jumlahtotalpemantauanmarch = 0;
                            datas[i].jumlahtotalpemantauanmay = 0;
                            datas[i].jumlahtotalpemantauannovember = 0;
                            datas[i].jumlahtotalpemantauanoctober = 0;
                            datas[i].jumlahtotalpemantauanseptember = 0;
                            datas[i].jumlahtotalembalacedecember = 0;
                            datas[i].jumlahtotalembalaceapril = 0;
                            datas[i].jumlahtotalembalaceaugust = 0;
                            datas[i].jumlahtotalembalacefebruary = 0;
                            datas[i].jumlahtotalembalacejanuary = 0;
                            datas[i].jumlahtotalembalacejuly = 0;
                            datas[i].jumlahtotalembalacejune = 0;
                            datas[i].jumlahtotalembalacemarch = 0;
                            datas[i].jumlahtotalembalacemay = 0;
                            datas[i].jumlahtotalembalacenovember = 0;
                            datas[i].jumlahtotalembalaceoctober = 0;
                            datas[i].jumlahtotalembalaceseptember = 0;
                            datas[i].jumlahtotalinjeksidecember = 0;
                            datas[i].jumlahtotalinjeksiapril = 0;
                            datas[i].jumlahtotalinjeksiaugust = 0;
                            datas[i].jumlahtotalinjeksifebruary = 0;
                            datas[i].jumlahtotalinjeksijanuary = 0;
                            datas[i].jumlahtotalinjeksijuly = 0;
                            datas[i].jumlahtotalinjeksijune = 0;
                            datas[i].jumlahtotalinjeksimarch = 0;
                            datas[i].jumlahtotalinjeksimay = 0;
                            datas[i].jumlahtotalinjeksinovember = 0;
                            datas[i].jumlahtotalinjeksioctober = 0;
                            datas[i].jumlahtotalinjeksiseptember = 0;
                            datas[i].jumlahtotalinfusdecember = 0;
                            datas[i].jumlahtotalinfusapril = 0;
                            datas[i].jumlahtotalinfusaugust = 0;
                            datas[i].jumlahtotalinfusfebruary = 0;
                            datas[i].jumlahtotalinfusjanuary = 0;
                            datas[i].jumlahtotalinfusjuly = 0;
                            datas[i].jumlahtotalinfusjune = 0;
                            datas[i].jumlahtotalinfusmarch = 0;
                            datas[i].jumlahtotalinfusmay = 0;
                            datas[i].jumlahtotalinfusnovember = 0;
                            datas[i].jumlahtotalinfusoctober = 0;
                            datas[i].jumlahtotalinfusseptember = 0;
                            datas[i].jumlahtotalrekondecember = 0;
                            datas[i].jumlahtotalrekonapril = 0;
                            datas[i].jumlahtotalrekonaugust = 0;
                            datas[i].jumlahtotalrekonfebruary = 0;
                            datas[i].jumlahtotalrekonjanuary = 0;
                            datas[i].jumlahtotalrekonjuly = 0;
                            datas[i].jumlahtotalrekonjune = 0;
                            datas[i].jumlahtotalrekonmarch = 0;
                            datas[i].jumlahtotalrekonmay = 0;
                            datas[i].jumlahtotalrekonnovember = 0;
                            datas[i].jumlahtotalrekonoctober = 0;
                            datas[i].jumlahtotalrekonseptember = 0;
                            datas[i].totalresep = 0;
                            datas[i].totalrke = 0;
                            datas[i].totalobatjadi = 0;
                            datas[i].totalkapsulkurang = 0;
                            datas[i].totalkapsullebih = 0;
                            datas[i].totalracikkurang = 0;
                            datas[i].totalraciklebih = 0;
                            datas[i].totalraciksalep = 0;
                            datas[i].totalraciksirup = 0;
                            datas[i].totalkonseling = 0;
                            datas[i].totalpetunjuk = 0;
                            datas[i].totalvisite = 0;
                            datas[i].totalpemantauan = 0;
                            datas[i].totalembalace = 0;
                            datas[i].totalinjeksi = 0;
                            datas[i].totalinfus = 0;
                            datas[i].totalrekon = 0;
                        }
                        
                        for (var i = 0; i < datas.length; i++) {
                            datas[0].kategori = 'R/';
                            datas[1].kategori = 'Lembar';
                            datas[2].kategori = 'Pelayanan Resep Obat Jadi / Alkes';
                            datas[3].kategori = 'Pelayanan Resep Obat di kapsul < 30 Kapsul';
                            datas[4].kategori = 'Pelayanan Resep Obat di kapsul > 30 Kapsul';
                            datas[5].kategori = 'Pelayanan Resep Obat Racik < 30 Bungkus';
                            datas[6].kategori = 'Pelayanan Resep Obat Racik > 30 Bungkus';
                            datas[7].kategori = 'Pelayanan Resep Racik Salep';
                            datas[8].kategori = 'Pelayanan Resep Racik Sirup';
                            datas[9].kategori = 'Konseling / Konsultasi Obat';
                            datas[10].kategori = 'Petunjutk Informasi Obat';
                            datas[11].kategori = 'Visite Apoteker';
                            datas[12].kategori = 'Pemantauan Terapi Obat';
                            datas[13].kategori = 'Embalace';
                            datas[14].kategori = 'Pelayanan Steril (Injeksi)';
                            datas[15].kategori = 'Pelayanan Steril (Infus)';
                            datas[16].kategori = 'Pelayanan Rekonstitusi Injeksi';
                            datas[i].no = i+1;
                            if(datas[i].jumlahtotalrkejanuary != 0){
                                datas[0].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalrkejanuary;
                            }
                            if(datas[i].jumlahtotalrkefebruary != 0){
                                datas[0].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalrkefebruary;
                            }
                            if(datas[i].jumlahtotalresepjanuary != 0){
                                datas[1].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalresepjanuary;
                            }
                            if(datas[i].jumlahtotalresepfebruary != 0){
                                datas[1].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalresepfebruary;
                            }
                            if(datas[i].jumlahtotalrkemarch != 0){
                                datas[0].jumlahtotalrkemarchfix = datas[i].jumlahtotalrkemarch;
                            }
                            if(datas[i].jumlahtotalresepmarch != 0){
                                datas[1].jumlahtotalrkemarchfix = datas[i].jumlahtotalresepmarch;
                            }
                            if(datas[i].jumlahtotalrkeapril != 0){
                                datas[0].jumlahtotalrkeaprilfix = datas[i].jumlahtotalrkeapril;
                            }
                            if(datas[i].jumlahtotalresepapril != 0){
                                datas[1].jumlahtotalrkeaprilfix = datas[i].jumlahtotalresepapril;
                            }
                            if(datas[i].jumlahtotalrkemay != 0){
                                datas[0].jumlahtotalrkemayfix = datas[i].jumlahtotalrkemay;
                            }
                            if(datas[i].jumlahtotalresepmay != 0){
                                datas[1].jumlahtotalrkemayfix = datas[i].jumlahtotalresepmay;
                            }
                            if(datas[i].jumlahtotalrkejune != 0){
                                datas[0].jumlahtotalrkejunefix = datas[i].jumlahtotalrkejune;
                            }
                            if(datas[i].jumlahtotalresepjune != 0){
                                datas[1].jumlahtotalrkejunefix = datas[i].jumlahtotalresepjune;
                            }
                            if(datas[i].jumlahtotalrkejuly != 0){
                                datas[0].jumlahtotalrkejulyfix = datas[i].jumlahtotalrkejuly;
                            }
                            if(datas[i].jumlahtotalresepjuly != 0){
                                datas[1].jumlahtotalrkejulyfix = datas[i].jumlahtotalresepjuly;
                            }
                            if(datas[i].jumlahtotalrkeaugust != 0){
                                datas[0].jumlahtotalrkeaugustfix = datas[i].jumlahtotalrkeaugust;
                            }
                            if(datas[i].jumlahtotalresepaugust != 0){
                                datas[1].jumlahtotalrkeaugustfix = datas[i].jumlahtotalresepaugust;
                            }
                            if(datas[i].jumlahtotalrkeseptember != 0){
                                datas[0].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalrkeseptember;
                            }
                            if(datas[i].jumlahtotalresepseptember != 0){
                                datas[1].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalresepseptember;
                            }
                            if(datas[i].jumlahtotalrkeoctober != 0){
                                datas[0].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalrkeoctober;
                            }
                            if(datas[i].jumlahtotalresepoctober != 0){
                                datas[1].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalresepoctober;
                            }
                            if(datas[i].jumlahtotalrkenovember != 0){
                                datas[0].jumlahtotalrkenovemberfix = datas[i].jumlahtotalrkenovember;
                            }
                            if(datas[i].jumlahtotalresepnovember != 0){
                                datas[1].jumlahtotalrkenovemberfix = datas[i].jumlahtotalresepnovember;
                            }
                            if(datas[i].jumlahtotalrkedecember != 0){
                                datas[0].jumlahtotalrkedecemberfix = datas[i].jumlahtotalrkedecember;
                            }
                            if(datas[i].jumlahtotalresepdecember != 0){
                                datas[1].jumlahtotalrkedecemberfix = datas[i].jumlahtotalresepdecember;
                            }
                            if(datas[i].jumlahtotalobatjadijanuary != 0){
                                datas[2].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalobatjadijanuary;
                            }
                            if(datas[i].jumlahtotalobatjadifebruary != 0){
                                datas[2].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalobatjadifebruary;
                            }
                            if(datas[i].jumlahtotalobatjadimarch != 0){
                                datas[2].jumlahtotalrkemarchfix = datas[i].jumlahtotalobatjadimarch;
                            }
                            if(datas[i].jumlahtotalobatjadiapril != 0){
                                datas[2].jumlahtotalrkeaprilfix = datas[i].jumlahtotalobatjadiapril;
                            }
                            if(datas[i].jumlahtotalobatjadimay != 0){
                                datas[2].jumlahtotalrkemayfix = datas[i].jumlahtotalobatjadimay;
                            }
                            if(datas[i].jumlahtotalobatjadijune != 0){
                                datas[2].jumlahtotalrkejunefix = datas[i].jumlahtotalobatjadijune;
                            }
                            if(datas[i].jumlahtotalobatjadijuly != 0){
                                datas[2].jumlahtotalrkejulyfix = datas[i].jumlahtotalobatjadijuly;
                            }
                            if(datas[i].jumlahtotalobatjadiaugust != 0){
                                datas[2].jumlahtotalrkeaugustfix = datas[i].jumlahtotalobatjadiaugust;
                            }
                            if(datas[i].jumlahtotalobatjadiseptember != 0){
                                datas[2].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalobatjadiseptember;
                            }
                            if(datas[i].jumlahtotalobatjadioctober != 0){
                                datas[2].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalobatjadioctober;
                            }
                            if(datas[i].jumlahtotalobatjadinovember != 0){
                                datas[2].jumlahtotalrkenovemberfix = datas[i].jumlahtotalobatjadinovember;
                            }
                            if(datas[i].jumlahtotalobatjadidecember != 0){
                                datas[2].jumlahtotalrkedecemberfix = datas[i].jumlahtotalobatjadidecember;
                            }
                            if(datas[i].jumlahtotalkapsulkurangjanuary != 0){
                                datas[3].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalkapsulkurangjanuary;
                            }
                            if(datas[i].jumlahtotalkapsulkurangfebruary != 0){
                                datas[3].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalkapsulkurangfebruary;
                            }
                            if(datas[i].jumlahtotalkapsulkurangmarch != 0){
                                datas[3].jumlahtotalrkemarchfix = datas[i].jumlahtotalkapsulkurangmarch;
                            }
                            if(datas[i].jumlahtotalkapsulkurangapril != 0){
                                datas[3].jumlahtotalrkeaprilfix = datas[i].jumlahtotalkapsulkurangapril;
                            }
                            if(datas[i].jumlahtotalkapsulkurangmay != 0){
                                datas[3].jumlahtotalrkemayfix = datas[i].jumlahtotalkapsulkurangmay;
                            }
                            if(datas[i].jumlahtotalkapsulkurangjune != 0){
                                datas[3].jumlahtotalrkejunefix = datas[i].jumlahtotalkapsulkurangjune;
                            }
                            if(datas[i].jumlahtotalkapsulkurangjuly != 0){
                                datas[3].jumlahtotalrkejulyfix = datas[i].jumlahtotalkapsulkurangjuly;
                            }
                            if(datas[i].jumlahtotalkapsulkurangaugust != 0){
                                datas[3].jumlahtotalrkeaugustfix = datas[i].jumlahtotalkapsulkurangaugust;
                            }
                            if(datas[i].jumlahtotalkapsulkurangseptember != 0){
                                datas[3].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalkapsulkurangseptember;
                            }
                            if(datas[i].jumlahtotalkapsulkurangoctober != 0){
                                datas[3].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalkapsulkurangoctober;
                            }
                            if(datas[i].jumlahtotalkapsulkurangnovember != 0){
                                datas[3].jumlahtotalrkenovemberfix = datas[i].jumlahtotalkapsulkurangnovember;
                            }
                            if(datas[i].jumlahtotalkapsulkurangdecember != 0){
                                datas[3].jumlahtotalrkedecemberfix = datas[i].jumlahtotalkapsulkurangdecember;
                            }

                            if(datas[i].jumlahtotalkapsullebihjanuary != 0){
                                datas[4].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalkapsullebihjanuary;
                            }
                            if(datas[i].jumlahtotalkapsullebihfebruary != 0){
                                datas[4].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalkapsullebihfebruary;
                            }
                            if(datas[i].jumlahtotalkapsullebihmarch != 0){
                                datas[4].jumlahtotalrkemarchfix = datas[i].jumlahtotalkapsullebihmarch;
                            }
                            if(datas[i].jumlahtotalkapsullebihapril != 0){
                                datas[4].jumlahtotalrkeaprilfix = datas[i].jumlahtotalkapsullebihapril;
                            }
                            if(datas[i].jumlahtotalkapsullebihmay != 0){
                                datas[4].jumlahtotalrkemayfix = datas[i].jumlahtotalkapsullebihmay;
                            }
                            if(datas[i].jumlahtotalkapsullebihjune != 0){
                                datas[4].jumlahtotalrkejunefix = datas[i].jumlahtotalkapsullebihjune;
                            }
                            if(datas[i].jumlahtotalkapsullebihjuly != 0){
                                datas[4].jumlahtotalrkejulyfix = datas[i].jumlahtotalkapsullebihjuly;
                            }
                            if(datas[i].jumlahtotalkapsullebihaugust != 0){
                                datas[4].jumlahtotalrkeaugustfix = datas[i].jumlahtotalkapsullebihaugust;
                            }
                            if(datas[i].jumlahtotalkapsullebihseptember != 0){
                                datas[4].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalkapsullebihseptember;
                            }
                            if(datas[i].jumlahtotalkapsullebihoctober != 0){
                                datas[4].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalkapsullebihoctober;
                            }
                            if(datas[i].jumlahtotalkapsullebihnovember != 0){
                                datas[4].jumlahtotalrkenovemberfix = datas[i].jumlahtotalkapsullebihnovember;
                            }
                            if(datas[i].jumlahtotalkapsullebihdecember != 0){
                                datas[4].jumlahtotalrkedecemberfix = datas[i].jumlahtotalkapsullebihdecember;
                            }

                            if(datas[i].jumlahtotalracikkurangjanuary != 0){
                                datas[5].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalracikkurangjanuary;
                            }
                            if(datas[i].jumlahtotalracikkurangfebruary != 0){
                                datas[5].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalracikkurangfebruary;
                            }
                            if(datas[i].jumlahtotalracikkurangmarch != 0){
                                datas[5].jumlahtotalrkemarchfix = datas[i].jumlahtotalracikkurangmarch;
                            }
                            if(datas[i].jumlahtotalracikkurangapril != 0){
                                datas[5].jumlahtotalrkeaprilfix = datas[i].jumlahtotalracikkurangapril;
                            }
                            if(datas[i].jumlahtotalracikkurangmay != 0){
                                datas[5].jumlahtotalrkemayfix = datas[i].jumlahtotalracikkurangmay;
                            }
                            if(datas[i].jumlahtotalracikkurangjune != 0){
                                datas[5].jumlahtotalrkejunefix = datas[i].jumlahtotalracikkurangjune;
                            }
                            if(datas[i].jumlahtotalracikkurangjuly != 0){
                                datas[5].jumlahtotalrkejulyfix = datas[i].jumlahtotalracikkurangjuly;
                            }
                            if(datas[i].jumlahtotalracikkurangaugust != 0){
                                datas[5].jumlahtotalrkeaugustfix = datas[i].jumlahtotalracikkurangaugust;
                            }
                            if(datas[i].jumlahtotalracikkurangseptember != 0){
                                datas[5].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalracikkurangseptember;
                            }
                            if(datas[i].jumlahtotalracikkurangoctober != 0){
                                datas[5].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalracikkurangoctober;
                            }
                            if(datas[i].jumlahtotalracikkurangnovember != 0){
                                datas[5].jumlahtotalrkenovemberfix = datas[i].jumlahtotalracikkurangnovember;
                            }
                            if(datas[i].jumlahtotalracikkurangdecember != 0){
                                datas[5].jumlahtotalrkedecemberfix = datas[i].jumlahtotalracikkurangdecember;
                            }

                            if(datas[i].jumlahtotalraciklebihjanuary != 0){
                                datas[6].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalraciklebihjanuary;
                            }
                            if(datas[i].jumlahtotalraciklebihfebruary != 0){
                                datas[6].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalraciklebihfebruary;
                            }
                            if(datas[i].jumlahtotalraciklebihmarch != 0){
                                datas[6].jumlahtotalrkemarchfix = datas[i].jumlahtotalraciklebihmarch;
                            }
                            if(datas[i].jumlahtotalraciklebihapril != 0){
                                datas[6].jumlahtotalrkeaprilfix = datas[i].jumlahtotalraciklebihapril;
                            }
                            if(datas[i].jumlahtotalraciklebihmay != 0){
                                datas[6].jumlahtotalrkemayfix = datas[i].jumlahtotalraciklebihmay;
                            }
                            if(datas[i].jumlahtotalraciklebihjune != 0){
                                datas[6].jumlahtotalrkejunefix = datas[i].jumlahtotalraciklebihjune;
                            }
                            if(datas[i].jumlahtotalraciklebihjuly != 0){
                                datas[6].jumlahtotalrkejulyfix = datas[i].jumlahtotalraciklebihjuly;
                            }
                            if(datas[i].jumlahtotalraciklebihaugust != 0){
                                datas[6].jumlahtotalrkeaugustfix = datas[i].jumlahtotalraciklebihaugust;
                            }
                            if(datas[i].jumlahtotalraciklebihseptember != 0){
                                datas[6].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalraciklebihseptember;
                            }
                            if(datas[i].jumlahtotalraciklebihoctober != 0){
                                datas[6].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalraciklebihoctober;
                            }
                            if(datas[i].jumlahtotalraciklebihnovember != 0){
                                datas[6].jumlahtotalrkenovemberfix = datas[i].jumlahtotalraciklebihnovember;
                            }
                            if(datas[i].jumlahtotalraciklebihdecember != 0){
                                datas[6].jumlahtotalrkedecemberfix = datas[i].jumlahtotalraciklebihdecember;
                            }

                            if(datas[i].jumlahtotalraciksalepjanuary != 0){
                                datas[7].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalraciksalepjanuary;
                            }
                            if(datas[i].jumlahtotalraciksalepfebruary != 0){
                                datas[7].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalraciksalepfebruary;
                            }
                            if(datas[i].jumlahtotalraciksalepmarch != 0){
                                datas[7].jumlahtotalrkemarchfix = datas[i].jumlahtotalraciksalepmarch;
                            }
                            if(datas[i].jumlahtotalraciksalepapril != 0){
                                datas[7].jumlahtotalrkeaprilfix = datas[i].jumlahtotalraciksalepapril;
                            }
                            if(datas[i].jumlahtotalraciksalepmay != 0){
                                datas[7].jumlahtotalrkemayfix = datas[i].jumlahtotalraciksalepmay;
                            }
                            if(datas[i].jumlahtotalraciksalepjune != 0){
                                datas[7].jumlahtotalrkejunefix = datas[i].jumlahtotalraciksalepjune;
                            }
                            if(datas[i].jumlahtotalraciksalepjuly != 0){
                                datas[7].jumlahtotalrkejulyfix = datas[i].jumlahtotalraciksalepjuly;
                            }
                            if(datas[i].jumlahtotalraciksalepaugust != 0){
                                datas[7].jumlahtotalrkeaugustfix = datas[i].jumlahtotalraciksalepaugust;
                            }
                            if(datas[i].jumlahtotalraciksalepseptember != 0){
                                datas[7].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalraciksalepseptember;
                            }
                            if(datas[i].jumlahtotalraciksalepoctober != 0){
                                datas[7].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalraciksalepoctober;
                            }
                            if(datas[i].jumlahtotalraciksalepnovember != 0){
                                datas[7].jumlahtotalrkenovemberfix = datas[i].jumlahtotalraciksalepnovember;
                            }
                            if(datas[i].jumlahtotalraciksalepdecember != 0){
                                datas[7].jumlahtotalrkedecemberfix = datas[i].jumlahtotalraciksalepdecember;
                            }

                            if(datas[i].jumlahtotalraciksirupjanuary != 0){
                                datas[8].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalraciksirupjanuary;
                            }
                            if(datas[i].jumlahtotalraciksirupfebruary != 0){
                                datas[8].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalraciksirupfebruary;
                            }
                            if(datas[i].jumlahtotalraciksirupmarch != 0){
                                datas[8].jumlahtotalrkemarchfix = datas[i].jumlahtotalraciksirupmarch;
                            }
                            if(datas[i].jumlahtotalraciksirupapril != 0){
                                datas[8].jumlahtotalrkeaprilfix = datas[i].jumlahtotalraciksirupapril;
                            }
                            if(datas[i].jumlahtotalraciksirupmay != 0){
                                datas[8].jumlahtotalrkemayfix = datas[i].jumlahtotalraciksirupmay;
                            }
                            if(datas[i].jumlahtotalraciksirupjune != 0){
                                datas[8].jumlahtotalrkejunefix = datas[i].jumlahtotalraciksirupjune;
                            }
                            if(datas[i].jumlahtotalraciksirupjuly != 0){
                                datas[8].jumlahtotalrkejulyfix = datas[i].jumlahtotalraciksirupjuly;
                            }
                            if(datas[i].jumlahtotalraciksirupaugust != 0){
                                datas[8].jumlahtotalrkeaugustfix = datas[i].jumlahtotalraciksirupaugust;
                            }
                            if(datas[i].jumlahtotalraciksirupseptember != 0){
                                datas[8].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalraciksirupseptember;
                            }
                            if(datas[i].jumlahtotalraciksirupoctober != 0){
                                datas[8].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalraciksirupoctober;
                            }
                            if(datas[i].jumlahtotalraciksirupnovember != 0){
                                datas[8].jumlahtotalrkenovemberfix = datas[i].jumlahtotalraciksirupnovember;
                            }
                            if(datas[i].jumlahtotalraciksirupdecember != 0){
                                datas[8].jumlahtotalrkedecemberfix = datas[i].jumlahtotalraciksirupdecember;
                            }

                            if(datas[i].jumlahtotalkonselingjanuary != 0){
                                datas[9].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalkonselingjanuary;
                            }
                            if(datas[i].jumlahtotalkonselingfebruary != 0){
                                datas[9].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalkonselingfebruary;
                            }
                            if(datas[i].jumlahtotalkonselingmarch != 0){
                                datas[9].jumlahtotalrkemarchfix = datas[i].jumlahtotalkonselingmarch;
                            }
                            if(datas[i].jumlahtotalkonselingapril != 0){
                                datas[9].jumlahtotalrkeaprilfix = datas[i].jumlahtotalkonselingapril;
                            }
                            if(datas[i].jumlahtotalkonselingmay != 0){
                                datas[9].jumlahtotalrkemayfix = datas[i].jumlahtotalkonselingmay;
                            }
                            if(datas[i].jumlahtotalkonselingjune != 0){
                                datas[9].jumlahtotalrkejunefix = datas[i].jumlahtotalkonselingjune;
                            }
                            if(datas[i].jumlahtotalkonselingjuly != 0){
                                datas[9].jumlahtotalrkejulyfix = datas[i].jumlahtotalkonselingjuly;
                            }
                            if(datas[i].jumlahtotalkonselingaugust != 0){
                                datas[9].jumlahtotalrkeaugustfix = datas[i].jumlahtotalkonselingaugust;
                            }
                            if(datas[i].jumlahtotalkonselingseptember != 0){
                                datas[9].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalkonselingseptember;
                            }
                            if(datas[i].jumlahtotalkonselingoctober != 0){
                                datas[9].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalkonselingoctober;
                            }
                            if(datas[i].jumlahtotalkonselingnovember != 0){
                                datas[9].jumlahtotalrkenovemberfix = datas[i].jumlahtotalkonselingnovember;
                            }
                            if(datas[i].jumlahtotalkonselingdecember != 0){
                                datas[9].jumlahtotalrkedecemberfix = datas[i].jumlahtotalkonselingdecember;
                            }

                            if(datas[i].jumlahtotalpetunjukjanuary != 0){
                                datas[10].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalpetunjukjanuary;
                            }
                            if(datas[i].jumlahtotalpetunjukfebruary != 0){
                                datas[10].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalpetunjukfebruary;
                            }
                            if(datas[i].jumlahtotalpetunjukmarch != 0){
                                datas[10].jumlahtotalrkemarchfix = datas[i].jumlahtotalpetunjukmarch;
                            }
                            if(datas[i].jumlahtotalpetunjukapril != 0){
                                datas[10].jumlahtotalrkeaprilfix = datas[i].jumlahtotalpetunjukapril;
                            }
                            if(datas[i].jumlahtotalpetunjukmay != 0){
                                datas[10].jumlahtotalrkemayfix = datas[i].jumlahtotalpetunjukmay;
                            }
                            if(datas[i].jumlahtotalpetunjukjune != 0){
                                datas[10].jumlahtotalrkejunefix = datas[i].jumlahtotalpetunjukjune;
                            }
                            if(datas[i].jumlahtotalpetunjukjuly != 0){
                                datas[10].jumlahtotalrkejulyfix = datas[i].jumlahtotalpetunjukjuly;
                            }
                            if(datas[i].jumlahtotalpetunjukaugust != 0){
                                datas[10].jumlahtotalrkeaugustfix = datas[i].jumlahtotalpetunjukaugust;
                            }
                            if(datas[i].jumlahtotalpetunjukseptember != 0){
                                datas[10].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalpetunjukseptember;
                            }
                            if(datas[i].jumlahtotalpetunjukoctober != 0){
                                datas[10].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalpetunjukoctober;
                            }
                            if(datas[i].jumlahtotalpetunjuknovember != 0){
                                datas[10].jumlahtotalrkenovemberfix = datas[i].jumlahtotalpetunjuknovember;
                            }
                            if(datas[i].jumlahtotalpetunjukdecember != 0){
                                datas[10].jumlahtotalrkedecemberfix = datas[i].jumlahtotalpetunjukdecember;
                            }

                            if(datas[i].jumlahtotalvisitejanuary != 0){
                                datas[11].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalvisitejanuary;
                            }
                            if(datas[i].jumlahtotalvisitefebruary != 0){
                                datas[11].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalvisitefebruary;
                            }
                            if(datas[i].jumlahtotalvisitemarch != 0){
                                datas[11].jumlahtotalrkemarchfix = datas[i].jumlahtotalvisitemarch;
                            }
                            if(datas[i].jumlahtotalvisiteapril != 0){
                                datas[11].jumlahtotalrkeaprilfix = datas[i].jumlahtotalvisiteapril;
                            }
                            if(datas[i].jumlahtotalvisitemay != 0){
                                datas[11].jumlahtotalrkemayfix = datas[i].jumlahtotalvisitemay;
                            }
                            if(datas[i].jumlahtotalvisitejune != 0){
                                datas[11].jumlahtotalrkejunefix = datas[i].jumlahtotalvisitejune;
                            }
                            if(datas[i].jumlahtotalvisitejuly != 0){
                                datas[11].jumlahtotalrkejulyfix = datas[i].jumlahtotalvisitejuly;
                            }
                            if(datas[i].jumlahtotalvisiteaugust != 0){
                                datas[11].jumlahtotalrkeaugustfix = datas[i].jumlahtotalvisiteaugust;
                            }
                            if(datas[i].jumlahtotalvisiteseptember != 0){
                                datas[11].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalvisiteseptember;
                            }
                            if(datas[i].jumlahtotalvisiteoctober != 0){
                                datas[11].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalvisiteoctober;
                            }
                            if(datas[i].jumlahtotalvisitenovember != 0){
                                datas[11].jumlahtotalrkenovemberfix = datas[i].jumlahtotalvisitenovember;
                            }
                            if(datas[i].jumlahtotalvisitedecember != 0){
                                datas[11].jumlahtotalrkedecemberfix = datas[i].jumlahtotalvisitedecember;
                            }

                            if(datas[i].jumlahtotalpemantauanjanuary != 0){
                                datas[12].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalpemantauanjanuary;
                            }
                            if(datas[i].jumlahtotalpemantauanfebruary != 0){
                                datas[12].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalpemantauanfebruary;
                            }
                            if(datas[i].jumlahtotalpemantauanmarch != 0){
                                datas[12].jumlahtotalrkemarchfix = datas[i].jumlahtotalpemantauanmarch;
                            }
                            if(datas[i].jumlahtotalpemantauanapril != 0){
                                datas[12].jumlahtotalrkeaprilfix = datas[i].jumlahtotalpemantauanapril;
                            }
                            if(datas[i].jumlahtotalpemantauanmay != 0){
                                datas[12].jumlahtotalrkemayfix = datas[i].jumlahtotalpemantauanmay;
                            }
                            if(datas[i].jumlahtotalpemantauanjune != 0){
                                datas[12].jumlahtotalrkejunefix = datas[i].jumlahtotalpemantauanjune;
                            }
                            if(datas[i].jumlahtotalpemantauanjuly != 0){
                                datas[12].jumlahtotalrkejulyfix = datas[i].jumlahtotalpemantauanjuly;
                            }
                            if(datas[i].jumlahtotalpemantauanaugust != 0){
                                datas[12].jumlahtotalrkeaugustfix = datas[i].jumlahtotalpemantauanaugust;
                            }
                            if(datas[i].jumlahtotalpemantauanseptember != 0){
                                datas[12].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalpemantauanseptember;
                            }
                            if(datas[i].jumlahtotalpemantauanoctober != 0){
                                datas[12].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalpemantauanoctober;
                            }
                            if(datas[i].jumlahtotalpemantauannovember != 0){
                                datas[12].jumlahtotalrkenovemberfix = datas[i].jumlahtotalpemantauannovember;
                            }
                            if(datas[i].jumlahtotalpemantauandecember != 0){
                                datas[12].jumlahtotalrkedecemberfix = datas[i].jumlahtotalpemantauandecember;
                            }

                            if(datas[i].jumlahtotalembalacejanuary != 0){
                                datas[13].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalembalacejanuary;
                            }
                            if(datas[i].jumlahtotalembalacefebruary != 0){
                                datas[13].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalembalacefebruary;
                            }
                            if(datas[i].jumlahtotalembalacemarch != 0){
                                datas[13].jumlahtotalrkemarchfix = datas[i].jumlahtotalembalacemarch;
                            }
                            if(datas[i].jumlahtotalembalaceapril != 0){
                                datas[13].jumlahtotalrkeaprilfix = datas[i].jumlahtotalembalaceapril;
                            }
                            if(datas[i].jumlahtotalembalacemay != 0){
                                datas[13].jumlahtotalrkemayfix = datas[i].jumlahtotalembalacemay;
                            }
                            if(datas[i].jumlahtotalembalacejune != 0){
                                datas[13].jumlahtotalrkejunefix = datas[i].jumlahtotalembalacejune;
                            }
                            if(datas[i].jumlahtotalembalacejuly != 0){
                                datas[13].jumlahtotalrkejulyfix = datas[i].jumlahtotalembalacejuly;
                            }
                            if(datas[i].jumlahtotalembalaceaugust != 0){
                                datas[13].jumlahtotalrkeaugustfix = datas[i].jumlahtotalembalaceaugust;
                            }
                            if(datas[i].jumlahtotalembalaceseptember != 0){
                                datas[13].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalembalaceseptember;
                            }
                            if(datas[i].jumlahtotalembalaceoctober != 0){
                                datas[13].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalembalaceoctober;
                            }
                            if(datas[i].jumlahtotalembalacenovember != 0){
                                datas[13].jumlahtotalrkenovemberfix = datas[i].jumlahtotalembalacenovember;
                            }
                            if(datas[i].jumlahtotalembalacedecember != 0){
                                datas[13].jumlahtotalrkedecemberfix = datas[i].jumlahtotalembalacedecember;
                            }

                            if(datas[i].jumlahtotalinjeksijanuary != 0){
                                datas[14].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalinjeksijanuary;
                            }
                            if(datas[i].jumlahtotalinjeksifebruary != 0){
                                datas[14].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalinjeksifebruary;
                            }
                            if(datas[i].jumlahtotalinjeksimarch != 0){
                                datas[14].jumlahtotalrkemarchfix = datas[i].jumlahtotalinjeksimarch;
                            }
                            if(datas[i].jumlahtotalinjeksiapril != 0){
                                datas[14].jumlahtotalrkeaprilfix = datas[i].jumlahtotalinjeksiapril;
                            }
                            if(datas[i].jumlahtotalinjeksimay != 0){
                                datas[14].jumlahtotalrkemayfix = datas[i].jumlahtotalinjeksimay;
                            }
                            if(datas[i].jumlahtotalinjeksijune != 0){
                                datas[14].jumlahtotalrkejunefix = datas[i].jumlahtotalinjeksijune;
                            }
                            if(datas[i].jumlahtotalinjeksijuly != 0){
                                datas[14].jumlahtotalrkejulyfix = datas[i].jumlahtotalinjeksijuly;
                            }
                            if(datas[i].jumlahtotalinjeksiaugust != 0){
                                datas[14].jumlahtotalrkeaugustfix = datas[i].jumlahtotalinjeksiaugust;
                            }
                            if(datas[i].jumlahtotalinjeksiseptember != 0){
                                datas[14].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalinjeksiseptember;
                            }
                            if(datas[i].jumlahtotalinjeksioctober != 0){
                                datas[14].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalinjeksioctober;
                            }
                            if(datas[i].jumlahtotalinjeksinovember != 0){
                                datas[14].jumlahtotalrkedecemberfix = datas[i].jumlahtotalinjeksinovember;
                            }
                            if(datas[i].jumlahtotalinjeksidecember != 0){
                                datas[14].jumlahtotalrkedecemberfix = datas[i].jumlahtotalinjeksidecember;
                            }

                            if(datas[i].jumlahtotalinfusjanuary != 0){
                                datas[15].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalinfusjanuary;
                            }
                            if(datas[i].jumlahtotalinfusfebruary != 0){
                                datas[15].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalinfusfebruary;
                            }
                            if(datas[i].jumlahtotalinfusmarch != 0){
                                datas[15].jumlahtotalrkemarchfix = datas[i].jumlahtotalinfusmarch;
                            }
                            if(datas[i].jumlahtotalinfusapril != 0){
                                datas[15].jumlahtotalrkeaprilfix = datas[i].jumlahtotalinfusapril;
                            }
                            if(datas[i].jumlahtotalinfusmay != 0){
                                datas[15].jumlahtotalrkemayfix = datas[i].jumlahtotalinfusmay;
                            }
                            if(datas[i].jumlahtotalinfusjune != 0){
                                datas[15].jumlahtotalrkejunefix = datas[i].jumlahtotalinfusjune;
                            }
                            if(datas[i].jumlahtotalinfusjuly != 0){
                                datas[15].jumlahtotalrkejulyfix = datas[i].jumlahtotalinfusjuly;
                            }
                            if(datas[i].jumlahtotalinfusaugust != 0){
                                datas[15].jumlahtotalrkeaugustfix = datas[i].jumlahtotalinfusaugust;
                            }
                            if(datas[i].jumlahtotalinfusseptember != 0){
                                datas[15].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalinfusseptember;
                            }
                            if(datas[i].jumlahtotalinfusoctober != 0){
                                datas[15].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalinfusoctober;
                            }
                            if(datas[i].jumlahtotalinfusnovember != 0){
                                datas[15].jumlahtotalrkedecemberfix = datas[i].jumlahtotalinfusnovember;
                            }
                            if(datas[i].jumlahtotalinfusdecember != 0){
                                datas[15].jumlahtotalrkedecemberfix = datas[i].jumlahtotalinfusdecember;
                            }

                            if(datas[i].jumlahtotalrekonjanuary != 0){
                                datas[16].jumlahtotalrkejanuaryfix = datas[i].jumlahtotalrekonjanuary;
                            }
                            if(datas[i].jumlahtotalrekonfebruary != 0){
                                datas[16].jumlahtotalrkefebruaryfix = datas[i].jumlahtotalrekonfebruary;
                            }
                            if(datas[i].jumlahtotalrekonmarch != 0){
                                datas[16].jumlahtotalrkemarchfix = datas[i].jumlahtotalrekonmarch;
                            }
                            if(datas[i].jumlahtotalrekonapril != 0){
                                datas[16].jumlahtotalrkeaprilfix = datas[i].jumlahtotalrekonapril;
                            }
                            if(datas[i].jumlahtotalrekonmay != 0){
                                datas[16].jumlahtotalrkemayfix = datas[i].jumlahtotalrekonmay;
                            }
                            if(datas[i].jumlahtotalrekonjune != 0){
                                datas[16].jumlahtotalrkejunefix = datas[i].jumlahtotalrekonjune;
                            }
                            if(datas[i].jumlahtotalrekonjuly != 0){
                                datas[16].jumlahtotalrkejulyfix = datas[i].jumlahtotarekonjuly;
                            }
                            if(datas[i].jumlahtotalrekonaugust != 0){
                                datas[16].jumlahtotalrkeaugustfix = datas[i].jumlahtotalrekonaugust;
                            }
                            if(datas[i].jumlahtotalrekonseptember != 0){
                                datas[16].jumlahtotalrkeseptemberfix = datas[i].jumlahtotalrekonseptember;
                            }
                            if(datas[i].jumlahtotalrekonoctober != 0){
                                datas[16].jumlahtotalrkeoctoberfix = datas[i].jumlahtotalrekonoctober;
                            }
                            if(datas[i].jumlahtotalrekonnovember != 0){
                                datas[16].jumlahtotalrkenovemberfix = datas[i].jumlahtotalrekonnovember;
                            }
                            if(datas[i].jumlahtotalrekondecember != 0){
                                datas[16].jumlahtotalrkedecemberfix = datas[i].jumlahtotalrekondecember;
                            }
                        }

                        // console.log(datas);

                        if(lengthawal < 17){
                            datas[0].total = datas[lengthawal-1].totalrke;
                            datas[1].total = datas[lengthawal-1].totalresep;
                            datas[2].total = datas[0].totalobatjadi;
                            datas[3].total = datas[0].totalkapsulkurang;
                            datas[4].total = datas[0].totalkapsullebih;
                            datas[5].total = datas[0].totalracikkurang;
                            datas[6].total = datas[0].totalraciklebih;
                            datas[7].total = datas[0].totalraciksalep;
                            datas[8].total = datas[0].totalraciksirup;
                            datas[9].total = datas[0].totalkonseling;
                            datas[10].total = datas[0].totalpetunjuk;
                            datas[11].total = datas[0].totalvisite;
                            datas[12].total = datas[0].totalpemantauan;
                            datas[13].total = datas[0].totalembalace;
                            datas[14].total = datas[0].totalinjeksi;
                            datas[15].total = datas[0].totalinfus;
                            datas[16].total = datas[0].totalrekon;
                        } else{
                            datas[0].total = datas[datas.length-1].totalrke;
                            datas[1].total = datas[datas.length-1].totalresep;
                            datas[2].total = datas[0].totalobatjadi;
                            datas[3].total = datas[0].totalkapsulkurang;
                            datas[4].total = datas[0].totalkapsullebih;
                            datas[5].total = datas[0].totalracikkurang;
                            datas[6].total = datas[0].totalraciklebih;
                            datas[7].total = datas[0].totalraciksalep;
                            datas[8].total = datas[0].totalraciksirup;
                            datas[9].total = datas[0].totalkonseling;
                            datas[10].total = datas[0].totalpetunjuk;
                            datas[11].total = datas[0].totalvisite;
                            datas[12].total = datas[0].totalpemantauan;
                            datas[13].total = datas[0].totalembalace;
                            datas[14].total = datas[0].totalinjeksi;
                            datas[15].total = datas[0].totalinfus;
                            datas[16].total = datas[0].totalrekon;
                        }

                        datas.length = 17;
                        
                        // console.log(datas.length);

                        $scope.dataGrid = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 100,
                            total: datas.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            },
                            aggregate: [
                            ]
                        });                                             
                    });
            }

            function FormLoad() {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                LoadCombo();
            }

            $scope.ClearData = function () {
                $scope.item.tglAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.kelompokPasien = undefined;
            }

            $scope.cariFilter = function () {
                init();
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('YYYY-MM-DD');
            };

            $scope.columnGrid = {
                toolbar: [
                    "excel",
                ],
                excel: {
                    fileName: "LaporanKegiatanPelayananResep.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 1;
                    sheet.mergedCells = ["A1:O1", "A2:O2"];
                    sheet.name = "Report";
                    sheet.layout = "Landscape";

                    var myHeaders = [{
                        value: "LAPORAN KEGIATAN PELAYANAN RESEP",
                        fontSize: 16,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });

                    var myHeaders = [{
                        value: "",
                        fontSize: 12,
                        fontWeight: 900,
                        textAlign: "center",
                        backgroundUrl: "#fffff"
                    }];

                    sheet.rows.splice(1, 0, { cells: myHeaders, type: "header", height: 20 });

                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "50px",
                    },
                    {
                        "field": "kategori",
                        "title": "Kategori",
                        "width": "200px",
                    },
                    {
                        
                        "field": "jumlahtotalrkejanuaryfix",
                        "title": "Januari",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkefebruaryfix",
                        "title": "Februari",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkemarchfix",
                        "title": "Maret",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkeaprilfix",
                        "title": "April",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkemayfix",
                        "title": "Mei",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkejunefix",
                        "title": "Juni",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkejulyfix",
                        "title": "Juli",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkeaugustfix",
                        "title": "Agustus",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkeseptemberfix",
                        "title": "September",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkeoctoberfix",
                        "title": "Oktober",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkenovemberfix",
                        "title": "November",
                        "width": "110px",
                    },
                    {
                        "field": "jumlahtotalrkedecemberfix",
                        "title": "Desember",
                        "width": "110px",
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "110px",
                    }
                ]
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            //////////////////////////////////////////////////////////////          END             /////////////////////////////////////////////////////////////////////////////////////       
        }
    ]);
});