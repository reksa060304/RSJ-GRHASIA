<!DOCTYPE html >
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Resume Medis</title>
    <link rel="stylesheet" href="{{ asset('css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/tabel.css') }}">
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery.qr-code.js') }}"></script>
    @if(stripos(\Request::url(), 'localhost') !== FALSE)
        <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        <!-- angular -->
        <script src="{{ asset('js/angular/angular.min.js') }}" type="text/javascript"></script>
        <script src="{{ asset('js/angular/angular-route.min.js') }}" type="text/javascript"></script>
        <script type="text/javascript" src="{{ asset('js/angular/angular-animate.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/angular/angular-aria.min.js') }}"></script>
        <script src="{{ asset('js/angular/angular-material.js') }}" type="text/javascript"></script>
    @else

        <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        <!-- angular -->
        <script src="{{ asset('js/angular/angular.min.js') }}" type="text/javascript"></script>
        <script src="{{ asset('js/angular/angular-route.min.js') }}" type="text/javascript"></script>
        <script type="text/javascript" src="{{ asset('js/angular/angular-animate.min.js') }}"></script>
        <script type="text/javascript" src="{{ asset('js/angular/angular-aria.min.js') }}"></script>
        <script src="{{ asset('js/angular/angular-material.js') }}" type="text/javascript"></script>
    @endif
    <style>
        @page {
            size: A4;
        }

        /*@media print {*/
        /*    body {margin:0}*/
        /*}*/
        .double-border {

            border: 4px solid #000;

        }

        .double-border:before {

            border: 4px solid #fff;

        }

        .box {
            border: 2px solid black;
            /*border-radius: 6px;*/
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

<body class="A4" style="font-family:Tahoma;height: auto" ng-controller="cetakCatatanKlinikCtrl">
<section class="sheet padding-10mm" style="font-family:Tahoma;height: auto">
{{--    <thead>--}}
{{--    <tr>--}}
{{--        <th>--}}
{{--            <div class="header">--}}

                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tbody>
                    <tr>
                        <td width="10%" style="padding: 5px">
                            <img src="{{ asset('img/logo_only.png') }}" alt="" style="width: 90px;">
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
                                        <td class="f-s-15 bold  text-top" style="width: 100px">No. RM</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold text-top"><b>{!! $res['d'][0]->nocm  !!}</b></td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Nama</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{!!  $res['d'][0]->namapasien  !!}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Jenis Kelamin</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{!! $res['d'][0]->jeniskelamin   !!}</b></td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Tgl Lahir</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top">
                                            <b>{!! date('d-m-Y',strtotime( $res['d'][0]->tgllahir  )) !!}</b></td>
                                    </tr>
                                    <tr>
                                        <td class="f-s-15 bold  text-top">Ruangan</td>
                                        <td class="f-s-15 bold  text-top">:</td>
                                        <td class="f-s-15 bold  text-top"><b>{!! $res['d'][0]->namaruangan   !!}</b>
                                        </td>
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
                                    <th style="font-size: 20px;text-align: center">CATATAN KLINIK
                                    </th>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
{{--            </div>--}}

{{--        </th>--}}
{{--    </tr>--}}
{{--    </thead>--}}
{{--    <tbody>--}}
{{--    <tr>--}}
        <td style="vertical-align: text-top">
{{--            <div class="con/tent">--}}
                <table width="100%" border="1" bordercolor="#000000" class="garis6" style="margin-left: 2px">
                    <tr>
                        <th >Tanggal/Jam</th>
                        <th >Profesional Pemberi  Asuhan</th>
                        <th >Hasil Asesmen Pasien dan Pemberian Pelayanan
                            (Tulis dengan format SOAP/ADIME, disertai saran, tulis nama, beri paraf pada akhir catatan)</th>
                        <th >Instruksi PPA Termasuk Pasca Bedah</th>
                         <th >Review & Verifikasi DPJP</th>
                    </tr>
                    <tr ng-repeat="list in listDataCppt" ng-show="show.obj[list.id]">
                        <td ng-repeat="jawab in list.detail | orderBy:'id'">
                            <div ng-switch on="jawab.type">
                                <div ng-switch-when="tgl/jam">
                                    @{{ item.obj[jawab.id] }}
                                </div>
                                <div ng-switch-when="ppa">
                                    @{{ item.obj[jawab.id] }}
                                </div>
                                <div ng-switch-when="soap">
                                    @{{ item.obj[jawab.id] }}
                                    <br>
                                    @{{ item.obj[jawab.id2] }}
                                </div>
                                <div ng-switch-when="intruksi">
                                    @{{ item.obj[jawab.id] }}
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
                    {{-- <tr>
                        <td> @{{ item.tglemr }}</td>
                        <td>
                            @{{ item.obj[4248] }}
                            <p> @{{ item.obj[4249] }}</p>
                            <p> @{{ item.obj[4250] }}</p>
                            <p> @{{ item.obj[4251] }}</p>
                        </td>
                        <td>
                         @{{ item.obj[5236] }}
                        </td>
                        <td><div style="text-align: center" id="qrDokter"></div></td>
                    </tr> --}}
                </table>
                <table>
                    <tbody>
                    <tr>
                        <td width="33%" style="text-align: center">
                            
                        </td>

                        <td width="33%"></td>
                        <td width="33%"><b>Bandung</b>, {!! date('d-m-Y') !!} <br>
                            <b>Dokter Penanggung Jawab</b></td>
                    </tr>
                    <tr>
                        <td>
                            <!-- <div style="text-align: center" id="qrPasien"></div> -->
                        </td>
                        <td></td>
                        <td>
                            <div style="text-align: center" id="qrDokter"></div>
                        </td>
                    </tr>

                    <tr>
                        <td style="text-align: center">
                         
                        </td>
                        <td style="text-align: center">&nbsp;</td>
                        <td style="text-align: center"><span style="font-weight: bold;color: #ccc">Ditandatangani secara elektronik</span>
                            <br>{!! $res['d'][0]->namadokter !!}
                        </td>
                    </tr>

                    </tbody>
                </table>
</section>
</body>

<script type="text/javascript">
    var baseUrl =
            {!! json_encode(url('/')) !!}
    var angular = angular.module('angularApp', [], function ($interpolateProvider) {
            $interpolateProvider.startSymbol('@{{');
            $interpolateProvider.endSymbol('}}');
        }).factory('httpService', function ($http, $q) {
            return {
                get: function (url) {
                    // $("#showLoading").show()
                    var deffer = $q.defer();
                    $http.get(baseUrl + '/' + url, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(function successCallback(response) {
                        deffer.resolve(response);
                        // $("#showLoading").hide()
                    }, function errorCallback(response) {
                        deffer.reject(response);
                        // $("#showLoading").hide()
                    });
                    return deffer.promise;
                },
            }
        })

    angular.controller('cetakCatatanKlinikCtrl', function ($scope, $http, httpService) {
        
        $scope.listDataCppt = [
                {
                    "id": 22034963, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034961, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034962, "nama": "ppa", "type": "ppa" },
                        { "id": 22034963, "id2": 22034964, "nama": "soap", "type": "soap" },
                        { "id": 22034965, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034966, "id2": 22034967, "id3": 22034968, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034971, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034969, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034970, "nama": "ppa", "type": "ppa" },
                        { "id": 22034971, "id2": 22034972, "nama": "soap", "type": "soap" },
                        { "id": 22034973, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034974, "id2": 22034975, "id3": 22034976, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034979, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034977, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034978, "nama": "ppa", "type": "ppa" },
                        { "id": 22034979, "id2": 22034980, "nama": "soap", "type": "soap" },
                        { "id": 22034981, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034982, "id2": 22034983, "id3": 22034984, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034987, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034985, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034986, "nama": "ppa", "type": "ppa" },
                        { "id": 22034987, "id2": 22034988, "nama": "soap", "type": "soap" },
                        { "id": 22034989, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034990, "id2": 22034991, "id3": 22034992, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22034995, "nama": "Baris satu",
                    "detail": [
                        { "id": 22034993, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22034994, "nama": "ppa", "type": "ppa" },
                        { "id": 22034995, "id2": 22034996, "nama": "soap", "type": "soap" },
                        { "id": 22034997, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22034998, "id2": 22034999, "id3": 22035000, "nama": "review", "type": "review" },
                    ]
                },
                {
                    "id": 22035003, "nama": "Baris satu",
                    "detail": [
                        { "id": 22035001, "nama": "tgl/jam", "type": "tgl/jam" },
                        { "id": 22035002, "nama": "ppa", "type": "ppa" },
                        { "id": 22035003, "id2": 22035004, "nama": "soap", "type": "soap" },
                        { "id": 22035005, "nama": "intruksi", "type": "intruksi" },
                        { "id": 22035006, "id2": 22035007, "id3": 22035008, "nama": "review", "type": "review" },
                    ]
                }
            ]
        $scope.listTK = [
            {name: "Rendah 0", id: 4},
            {name: "Rendah (total skor 1-3)", id: 5},
            {name: "Tinggi (total skor 4-5)", id: 6},
            {name: "Resiko Ringan ( Nilai MST 0-1)", id: 1},
            {name: "Resiko Sedang ( Nilai MST 2-3)", id: 2},
            {name: "Resiko Tinggi ( Nilai MST 4-5)", id: 3},
            {name: ">=12 Normal/tidak beresiko, tidak membutuhkan pengkajian lebih lanjut", id: 7},
            {name: "<=11 mungkin malnutrisi, membutuhkan pengkajian lanjut", id: 8},
        ];
        $scope.item = {
            obj: []
        }
        $scope.show = {obj:[]};
        $scope.showbtnadd = [];
        $scope.showbtnremove = [];
        $scope.show.obj[22034963] = true
        var dataLoad = {!! json_encode($res['d'] )!!};
        $scope.item.tglemr = dataLoad[0].tglemr;
        for (var i = 0; i <= dataLoad.length - 1; i++) {

            if (dataLoad[i].type == "textbox") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
            }
            if (dataLoad[i].type == "checkbox") {
                var chekedd = false
                if (dataLoad[i].value == '1') {
                    var chekedd = true
                }
                $scope.item.obj[dataLoad[i].emrdfk] = chekedd

            }
            if (dataLoad[i].type == "radio") {
                for (var i2 = 0; i2 <= $scope.listTK.length - 1; i2++) {
                    const elem = $scope.listTK[i2]

                    if (elem.id == dataLoad[i].value) {
                        $scope.item.obj[dataLoad[i].emrdfk] = elem.name
                    }
                }

            }

            if (dataLoad[i].type == "datetime") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
            }
            if (dataLoad[i].type == "time") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
            }
            if (dataLoad[i].type == "date") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
            }

            if (dataLoad[i].type == "checkboxtextbox") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
                $scope.item.obj2[dataLoad[i].emrdfk] = true
            }
            if (dataLoad[i].type == "textarea") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value
            }
            if (dataLoad[i].type == "combobox") {
                var str = dataLoad[i].value
                var res = str.split("~");
                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                $scope.item.obj[dataLoad[i].emrdfk] = res[1]

            }


        }
        var lastelement = '';
        for (let l = 0; l < $scope.listDataCppt.length; l++) {
            const element =  $scope.listDataCppt[l];
            const value = $scope.item.obj[element.id];
            if(value != undefined) {
                $scope.show.obj[element.id] = true
                $scope.showbtnadd[element.id] = false
                $scope.showbtnremove[element.id] = false
                lastelement = element.id
            }
        }
        $scope.showbtnadd[lastelement] = true
    })
    $(function () {
        'use strict';

        $('#qrPasien').qrcode({
            text: baseUrl + '/service/medifirst2000/report/cetak-pasien?reg=' + {{ $res['d'][0]->noregistrasi }} ,
            height: 75,
            width: 75
        });
        $('#qrDokter').qrcode({
            text: baseUrl + '/service/medifirst2000/report/cetak-dokter?reg=' + {{ $res['d'][0]->noregistrasi }} ,
            height: 75,
            width: 75
        });

    })
</script>
</body>

</html>
