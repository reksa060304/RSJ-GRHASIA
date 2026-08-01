<!DOCTYPE html >
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Komunikasi Efektif SBAR</title>
    
    @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link rel="stylesheet" href="{{ asset('css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/tabel.css') }}">
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery.qr-code.js') }}"></script>

        <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        <!-- angular -->
        <script src="{{ asset('js/angular/angular.min.js') }}" type="text/javascript"></script>
        <script src="{{ asset('js/angular/angular-route.min.js') }}" type="text/javascript"></script>
        <script type="text/javascript" src="{{ asset('js/angular/angular-animate.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/angular/angular-aria.min.js') }}"></script>
        <script src="{{ asset('js/angular/angular-material.js') }}" type="text/javascript"></script>
    @else

    <link rel="stylesheet" href="{{ asset('service/css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('service/css/report/tabel.css') }}">
    <script src="{{ asset('service/js/jquery.min.js') }}"></script>
    <script src="{{ asset('service/js/jquery.qr-code.js') }}"></script>

        <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
        <!-- angular -->
        <script src="{{ asset('service/js/angular/angular.min.js') }}" type="text/javascript"></script>
        <script src="{{ asset('service/js/angular/angular-route.min.js') }}" type="text/javascript"></script>
        <script type="text/javascript" src="{{ asset('service/js/angular/angular-animate.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('service/js/angular/angular-aria.min.js') }}"></script>
        <script src="{{ asset('service/js/angular/angular-material.js') }}" type="text/javascript"></script>
    @endif
    <style>
        @page {
            size: A4;
        }

        .double-border {
            border: 4px solid #000;
        }

        .double-border:before {
            border: 4px solid #fff;
        }

        .box {
            border: 2px solid black;
        }

        .garis6 td {
            padding: 3px;
        }

        .bold {
            font-weight: bold;
        }

        .f-s-15 {
            font-size: 12px;
        }

        .top-height {
            height: 50px;
            vertical-align: text-top;
            width: 15%;
        }

        .text-top {
            vertical-align: text-top;
        }
        table {
            width: 100%;
            height: 100%;
        }
    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto" ng-controller="cetakCatatanSbarCtrl">
<section class="sheet padding-10mm" style="font-family:Tahoma;height: auto">
    <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tbody>
        <tr>
            <td width="10%" style="padding: 5px">
                @if(stripos(\Request::url(), 'localhost') !== FALSE)
                   <img src="{{ asset('img/logo_grhasia_com.png') }}" alt="" style="width: 90px;">
                @else
                  <img src="{{ asset('service/img/logo_grhasia_com.png') }}" alt="" style="width: 90px;">
                @endif
            </td>
            <td style="text-align: left">
                <b>
                    <span style="font-size: 16px">{!! $res['profile']->namalengkap !!}</span></br>
                    </br>
                    <span style="font-size: 14px;">{!! $res['profile']->alamatlengkap !!}</span>
                </b>
            </td>
            <td width="50%" style="padding: 10px">
                <div class="box" style="text-align: left">
                    <table style="padding: 3px;">
                        <tr>
                            <td class="f-s-15 bold text-top" style="width: 100px">No. RM</td>
                            <td class="f-s-15 bold text-top">:</td>
                            <td class="f-s-15 bold text-top"><b>{!! $res['d'][0]->nocm ?? '' !!}</b></td>
                        </tr>
                        <tr>
                            <td class="f-s-15 bold text-top">Nama</td>
                            <td class="f-s-15 bold text-top">:</td>
                            <td class="f-s-15 bold text-top"><b>{!! $res['d'][0]->namapasien ?? '' !!}</b></td>
                        </tr>
                        <tr>
                            <td class="f-s-15 bold text-top">Jenis Kelamin</td>
                            <td class="f-s-15 bold text-top">:</td>
                            <td class="f-s-15 bold text-top"><b>{!! $res['d'][0]->jeniskelamin ?? '' !!}</b></td>
                        </tr>
                        <tr>
                            <td class="f-s-15 bold text-top">Tgl Lahir</td>
                            <td class="f-s-15 bold text-top">:</td>
                            <td class="f-s-15 bold text-top"><b>{!! isset($res['d'][0]->tgllahir) ? date('d-m-Y',strtotime($res['d'][0]->tgllahir)) : '' !!}</b></td>
                        </tr>
                        <tr>
                            <td class="f-s-15 bold text-top">Ruangan</td>
                            <td class="f-s-15 bold text-top">:</td>
                            <td class="f-s-15 bold text-top"><b>{!! $res['d'][0]->namaruangan ?? '' !!}</b></td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        </tbody>
    </table>

    <hr style="border:2px solid #000;margin-bottom:0px">
    <hr style="border:0.5px solid #000;margin-top:2px">
    <table>
        <tr>
            <td>
                <table style="text-align: center">
                    <tr style="text-align: center">
                        <th style="font-size: 20px;text-align: center">CATATAN KOMUNIKASI EFEKTIF SBAR</th>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td style="vertical-align: text-top">
                <table width="100%" border="1" bordercolor="#000000" class="garis6" style="margin-left: 2px">
                    <tr>
                        <th style="width: 15%">Tanggal/Jam</th>
                        <th style="width: 15%">Profesional Pemberi Asuhan</th>
                        <th style="width: 45%">Materi Konsultasi (SBAR)</th>
                        <th style="width: 25%">Verifikasi DPJP</th>
                    </tr>
                    <tr ng-repeat="list in listDataCppt" ng-show="show.obj[list.id]">
                        <td ng-repeat="jawab in list.detail | filter:{type: '!intruksi'} | orderBy:'id'">
                            <div ng-switch on="jawab.type">
                                <div ng-switch-when="tgl/jam">
                                    @{{ item.obj[jawab.id] }}
                                </div>
                                <div ng-switch-when="ppa">
                                    @{{ item.obj[jawab.id] }}
                                </div>
                                <div ng-switch-when="soap" style="white-space: pre-line;">
                                    @{{ item.obj[jawab.id] }}
                                    <br>
                                    @{{ item.obj[jawab.id2] }}
                                </div>
                                <div ng-switch-when="review">
                                    @{{ item.obj[jawab.id] }}
                                    <br>
                                    @{{ item.obj[jawab.id2] }}
                                    <br>
                                    @{{ item.obj[jawab.id3] }}
                               </div>
                            </div>
                        </td>
                    </tr>
                </table>
                <table>
                    <tbody>
                    <tr>
                        <td width="33%" style="text-align: center"></td>
                        <td width="33%"></td>
                        <td width="33%"><b>Yogyakarta</b>, {!! date('d-m-Y') !!} <br>
                            <b>Dokter Penanggung Jawab</b></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td>
                            <div style="text-align: center" id="qrDokter"></div>
                        </td>
                    </tr>

                    <tr>
                        <td style="text-align: center"></td>
                        <td style="text-align: center">&nbsp;</td>
                        <td style="text-align: center"><span style="font-weight: bold;color: #ccc">Ditandatangani secara elektronik</span>
                            <br>{!! $res['d'][0]->namadokter ?? '' !!}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</section>
</body>

<script type="text/javascript">
    var baseUrl = {!! json_encode(url('/')) !!}
    var angular = angular.module('angularApp', [], function ($interpolateProvider) {
            $interpolateProvider.startSymbol('@{{');
            $interpolateProvider.endSymbol('}}');
        }).factory('httpService', function ($http, $q) {
            return {
                get: function (url) {
                    var deffer = $q.defer();
                    $http.get(baseUrl + '/' + url, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(function successCallback(response) {
                        deffer.resolve(response);
                    }, function errorCallback(response) {
                        deffer.reject(response);
                    });
                    return deffer.promise;
                },
            }
        })

    angular.controller('cetakCatatanSbarCtrl', function ($scope, $http, httpService) {
        $scope.listDataCppt = [
            {
                "id": 22034963, "nama": "Baris satu",
                "detail": [
                    { "id": 22034961, "nama": "tgl/jam", "type": "tgl/jam" },
                    { "id": 22034962, "nama": "ppa", "type": "ppa" },
                    { "id": 22034963, "id2": 22034964, "nama": "soap", "type": "soap" },
                    { "id": 22034965, "nama": "intruksi", "type": "intruksi" },
                    { "id": 22034966, "id2": 22034967, "id3": 22034968, "nama": "review", "type": "review" }
                ]
            },
            {
                "id": 22034971, "nama": "Baris dua",
                "detail": [
                    { "id": 22034969, "nama": "tgl/jam", "type": "tgl/jam" },
                    { "id": 22034970, "nama": "ppa", "type": "ppa" },
                    { "id": 22034971, "id2": 22034972, "nama": "soap", "type": "soap" },
                    { "id": 22034973, "nama": "intruksi", "type": "intruksi" },
                    { "id": 22034974, "id2": 22034975, "id3": 22034976, "nama": "review", "type": "review" }
                ]
            },
            {
                "id": 22034979, "nama": "Baris tiga",
                "detail": [
                    { "id": 22034977, "nama": "tgl/jam", "type": "tgl/jam" },
                    { "id": 22034978, "nama": "ppa", "type": "ppa" },
                    { "id": 22034979, "id2": 22034980, "nama": "soap", "type": "soap" },
                    { "id": 22034981, "nama": "intruksi", "type": "intruksi" },
                    { "id": 22034982, "id2": 22034983, "id3": 22034984, "nama": "review", "type": "review" }
                ]
            },
            {
                "id": 22034987, "nama": "Baris empat",
                "detail": [
                    { "id": 22034985, "nama": "tgl/jam", "type": "tgl/jam" },
                    { "id": 22034986, "nama": "ppa", "type": "ppa" },
                    { "id": 22034987, "id2": 22034988, "nama": "soap", "type": "soap" },
                    { "id": 22034989, "nama": "intruksi", "type": "intruksi" },
                    { "id": 22034990, "id2": 22034991, "id3": 22034992, "nama": "review", "type": "review" }
                ]
            },
            {
                "id": 22034995, "nama": "Baris lima",
                "detail": [
                    { "id": 22034993, "nama": "tgl/jam", "type": "tgl/jam" },
                    { "id": 22034994, "nama": "ppa", "type": "ppa" },
                    { "id": 22034995, "id2": 22034996, "nama": "soap", "type": "soap" },
                    { "id": 22034997, "nama": "intruksi", "type": "intruksi" },
                    { "id": 22034998, "id2": 22034999, "id3": 22035000, "nama": "review", "type": "review" }
                ]
            },
            {
                "id": 22035003, "nama": "Baris enam",
                "detail": [
                    { "id": 22035001, "nama": "tgl/jam", "type": "tgl/jam" },
                    { "id": 22035002, "nama": "ppa", "type": "ppa" },
                    { "id": 22035003, "id2": 22035004, "nama": "soap", "type": "soap" },
                    { "id": 22035005, "nama": "intruksi", "type": "intruksi" },
                    { "id": 22035006, "id2": 22035007, "id3": 22035008, "nama": "review", "type": "review" }
                ]
            }
        ];
        
        $scope.item = { obj: [] };
        $scope.show = { obj: [] };
        $scope.show.obj[22034963] = true;
        var dataLoad = {!! json_encode($res['d']) !!};
        if (dataLoad && dataLoad.length > 0) {
            $scope.item.tglemr = dataLoad[0].tglemr;
            for (var i = 0; i <= dataLoad.length - 1; i++) {
                if (dataLoad[i].type == "textbox" || dataLoad[i].type == "datetime" || dataLoad[i].type == "textarea") {
                    $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                }
                if (dataLoad[i].type == "combobox") {
                    var str = dataLoad[i].value;
                    var res = str.split("~");
                    $scope.item.obj[dataLoad[i].emrdfk] = res[1] || res[0];
                }
            }
            var lastelement = '';
            for (let l = 0; l < $scope.listDataCppt.length; l++) {
                const element = $scope.listDataCppt[l];
                const value = $scope.item.obj[element.id];
                if (value != undefined && value != "" && value != null) {
                    $scope.show.obj[element.id] = true;
                    lastelement = element.id;
                }
            }
        }
    });

    $(function () {
        'use strict';
        $('#qrDokter').qrcode({
            text: baseUrl + '/service/medifirst2000/report/cetak-dokter?reg=' + {{ $res['d'][0]->noregistrasi ?? 0 }},
            height: 75,
            width: 75
        });
    });
</script>
</html>
