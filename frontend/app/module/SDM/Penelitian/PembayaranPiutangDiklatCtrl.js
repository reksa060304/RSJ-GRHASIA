define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PembayaranPiutangDiklatCtrl', ['$state', '$q', '$rootScope', '$scope', 'MedifirstService',
        function ($state, $q, $rootScope, $scope, medifirstService) {
            $scope.dataParams = JSON.parse($state.params.dataPasien);
            $scope.item = {};
            $scope.now = new Date();
            showButton();
            loadData();

            function loadData() {
                medifirstService.get("diklat/detail-diklat-penjamin/" + $scope.dataParams.noRegistrasi, true).then(function (dat) {
                    $scope.listDetailPiutangpasien = dat.data;
                    $scope.item.kampus = dat.data.datakampus[0].institusipendidikan;
                    $scope.item.kegiatan = dat.data.datakampus[0].detailjenisproduk;
                    $scope.item.periode = moment(dat.data.datakampus[0].tanggalmulai).format('DD-MM-YYYY') + ' S.D ' + moment(dat.data.datakampus[0].tanggalselesai).format('DD-MM-YYYY');
                    $scope.item.totalTagihan = "Rp. " + parseFloat(dat.data.totalTagihan).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"); //dat.data.totalTagihan;
                    $scope.item.totalDeposit = "Rp. " + parseFloat(dat.data.sudahDibayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"); //dat.data.sudahDibayar;
                    $scope.item.jumlahBayarFix = "Rp. " + parseFloat(dat.data.totalTagihan - dat.data.sudahDibayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"); //dat.data.sisaPiutang;
                    $scope.item.jumlahBayar = dat.data.totalTagihan - dat.data.sudahDibayar
                    $scope.dataDaftarTagihan = new kendo.data.DataSource({
                        data: $scope.listDetailPiutangpasien.detailPembayaran
                    });
                });
            }

            function showButton() {
                //$scope.showBtnCetak = true;
                $scope.showBtnBatal = true;
                $scope.showBtnBayar = true;
                $scope.showBtnKembali = true;
            }

            $scope.columnDaftarTagihan = [{
                    "field": "noSbm",
                    "title": "Nomor SBM",
                    "width": "200px"
                },
                {
                    "field": "tglPembayaran",
                    "title": "Tgl Pembayaran",
                    "width": "50px"
                },
                {
                    "field": "jlhPembayaran",
                    "title": "Jumlah Pembayaran",
                    "width": "150px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jlhPembayaran #', 'Rp.')}}</span>"
                }
            ];

            $scope.Cetak = function () {

            }

            $scope.Batal = function () {

            }

            $scope.Bayar = function () {
                $scope.changePage("TglPembayaranDiklat");
            }

            $scope.changePage = function (stateName) {
                var obj = {
                    pageFrom: "PembayaranDiklat",
                    noRegistrasi: $scope.dataParams.noRegistrasi,
                    jumlahBayar: $scope.item.jumlahBayar,
                }

                $state.go(stateName, {
                    dataPasien: JSON.stringify(obj)
                });
            }


            $scope.Kembali = function () {
                $state.go('DaftarPiutangKasir', {});
            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"); //
            }


            //** BATAS */
        }
    ]);
});