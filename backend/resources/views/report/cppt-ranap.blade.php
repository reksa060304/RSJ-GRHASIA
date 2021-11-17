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

<body class="A4" style="font-family:Tahoma;height: auto" ng-controller="cetakCPPTRanapCtrl">
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
                                    <th style="font-size: 20px;text-align: center">CATATAN PERKEMBANGAN PASIEN
                                        TERINTEGRASI
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
                        <th rowspan="2">Tanggal/Jam</th>
                        <th rowspan="2">Profesional Pemberi Asuhan</th>
                        <th>Hasil Asesmen Pasien Dan Pemberian Pelayanan</th>
                        <th rowspan="2">Intruksi PPA</th>
                        <th rowspan="2"> Riview & Verifikasi DPJP</th>
                    </tr>
                    <tr>
                        <th>SOAP</th>
                    </tr>
                     <tr ng-show="item.obj[111348] != undefined">
                        <td> @{{ item.obj[111348] }}</td>
                        <td>@{{ item.obj[111349] }}</td>
                        <td>
                         @{{ item.obj[111350] }}
                            <p> @{{ item.obj[111351] }}</p>
                        </td>
                        <td>@{{ item.obj[111354] }}</td>
                        <td>
                            @{{ item.obj[111355] }}
                            <p> @{{ item.obj[111356] }}</p>
                            <p> @{{ item.obj[111357] }}
                           
                            </p>
                        </td>
                    </tr>
                     <tr ng-show="item.obj[111358] != undefined">
                        <td> @{{ item.obj[111358] }}</td>
                        <td>@{{ item.obj[111359] }}</td>
                        <td>
                            @{{ item.obj[111360] }}
                            <p> @{{ item.obj[111361] }}</p>
                        </td>
                        <td>@{{ item.obj[111364] }}</td>
                        <td>
                            @{{ item.obj[111395] }}
                            <p> @{{ item.obj[111396] }}</p>
                            <p> @{{ item.obj[111397] }}</p>
                        </td>
                    </tr>
                   <tr ng-show="item.obj[111368] != undefined">
                        <td> @{{ item.obj[111368] }}</td>
                        <td>@{{ item.obj[111369] }}</td>
                        <td>
                            @{{ item.obj[111370] }}
                            <p> @{{ item.obj[111371] }}</p>
                        </td>
                        <td>@{{ item.obj[111374] }}</td>
                        <td>
                            @{{ item.obj[111435] }}
                            <p> @{{ item.obj[111436] }}</p>
                            <p> @{{ item.obj[111437] }}</p>
                        </td>
                    </tr>
                     <tr ng-show="item.obj[111378] != undefined">
                        <td> @{{ item.obj[111378] }}</td>
                        <td>@{{ item.obj[111379] }}</td>
                        <td>
                            @{{ item.obj[111380] }}
                            <p> @{{ item.obj[111381] }}</p>
                        </td>
                        <td>@{{ item.obj[111384] }}</td>
                        <td>
                            @{{ item.obj[111480] }}
                            <p> @{{ item.obj[111481] }}</p>
                            <p> @{{ item.obj[111482] }}</p>
                        </td>
                    </tr>
                     <tr ng-show="item.obj[111388] != undefined">
                        <td> @{{ item.obj[111388] }}</td>
                        <td>@{{ item.obj[111389] }}</td>
                        <td>
                            @{{ item.obj[111390] }}
                            <p> @{{ item.obj[111391] }}</p>
                        </td>
                        <td>@{{ item.obj[111394] }}</td>
                        <td>
                            @{{ item.obj[111520] }}
                            <p> @{{ item.obj[111521] }}</p>
                            <p> @{{ item.obj[111522] }}</p>
                        </td>
                    </tr>
                     <tr ng-show="item.obj[111398] != undefined">
                        <td> @{{ item.obj[111398] }}</td>
                        <td>@{{ item.obj[111399] }}</td>
                        <td>
                            @{{ item.obj[111400] }}
                            <p> @{{ item.obj[111401] }}</p>
                        </td>
                        <td>@{{ item.obj[111404] }}</td>
                        <td>
                            @{{ item.obj[111560] }}
                            <p> @{{ item.obj[111561] }}</p>
                            <p> @{{ item.obj[111562] }}</p>
                        </td>
                    </tr>
                     <tr ng-show="item.obj[111408] != undefined">
                        <td> @{{ item.obj[111408] }}</td>
                        <td>@{{ item.obj[111409] }}</td>
                        <td>
                            @{{ item.obj[111410] }}
                            <p> @{{ item.obj[111411] }}</p>
                        </td>
                        <td>@{{ item.obj[111414] }}</td>
                        <td>
                            @{{ item.obj[21040380] }}
                            <p> @{{ item.obj[21040381] }}</p>
                            <p> @{{ item.obj[21040382] }}</p>
                        </td>
                    </tr>
                      <tr ng-show="item.obj[111418] != undefined">
                        <td> @{{ item.obj[111418] }}</td>
                        <td>@{{ item.obj[111419] }}</td>
                        <td>
                            @{{ item.obj[111420] }}
                            <p> @{{ item.obj[111421] }}</p>
                        </td>
                        <td>@{{ item.obj[111424] }}</td>
                        <td>
                            @{{ item.obj[21040383] }}
                            <p> @{{ item.obj[21040384] }}</p>
                            <p> @{{ item.obj[21040385] }}</p>
                        </td>
                    </tr>
                      <tr ng-show="item.obj[111428] != undefined">
                        <td> @{{ item.obj[111428] }}</td>
                        <td>@{{ item.obj[111429] }}</td>
                        <td>
                            @{{ item.obj[111430] }}
                            <p> @{{ item.obj[111431] }}</p>
                        </td>
                        <td>@{{ item.obj[111434] }}</td>
                        <td>
                            @{{ item.obj[21040386] }}
                            <p> @{{ item.obj[21040387] }}</p>
                            <p> @{{ item.obj[21040388] }}</p>
                        </td>
                    </tr>
                     <tr ng-show="item.obj[111438] != undefined">
                        <td> @{{ item.obj[111438] }}</td>
                        <td>@{{ item.obj[111439] }}</td>
                        <td>
                            @{{ item.obj[111440] }}
                            <p> @{{ item.obj[111441] }}</p>
                        </td>
                        <td>@{{ item.obj[111444] }}</td>
                        <td>
                            @{{ item.obj[21040389] }}
                            <p> @{{ item.obj[21040390] }}</p>
                            <p> @{{ item.obj[21040391] }}</p>
                        </td>
                    </tr>
                <tr ng-show="item.obj[111448] != undefined">
                        <td> @{{ item.obj[111448] }}</td>
                        <td>@{{ item.obj[111449] }}</td>
                        <td>
                            @{{ item.obj[111450] }}
                            <p> @{{ item.obj[111451] }}</p>
                        </td>
                        <td>@{{ item.obj[111454] }}</td>
                        <td>
                            @{{ item.obj[21040392] }}
                            <p> @{{ item.obj[21040393] }}</p>
                            <p> @{{ item.obj[21040394] }}</p>
                        </td>
                    </tr>
                   <tr ng-show="item.obj[111458] != undefined">
                        <td> @{{ item.obj[111458] }}</td>
                        <td>@{{ item.obj[111459] }}</td>
                        <td>
                            @{{ item.obj[111460] }}
                            <p> @{{ item.obj[111460] }}</p>
                        </td>
                        <td>@{{ item.obj[111464] }}</td>
                        <td>
                            @{{ item.obj[21040395] }}
                            <p> @{{ item.obj[21040396] }}</p>
                            <p> @{{ item.obj[21040397] }}</p>
                        </td>
                    </tr>
                      
                  <tr ng-show="item.obj[111473] != undefined">
                        <td> @{{ item.obj[111473] }}</td>
                        <td>@{{ item.obj[111474] }}</td>
                        <td>
                            @{{ item.obj[111475] }}
                            <p> @{{ item.obj[111476] }}</p>
                        </td>
                        <td>@{{ item.obj[111479] }}</td>
                        <td>
                            @{{ item.obj[21040398] }}
                            <p> @{{ item.obj[21040399] }}</p>
                            <p> @{{ item.obj[21040400] }}</p>
                        </td>
                    </tr>
                    <tr ng-show="item.obj[111483] != undefined">
                        <td> @{{ item.obj[111483] }}</td>
                        <td>@{{ item.obj[111484] }}</td>
                        <td>
                            @{{ item.obj[111485] }}
                            <p> @{{ item.obj[111486] }}</p>
                        </td>
                        <td>@{{ item.obj[111489] }}</td>
                        <td>
                            @{{ item.obj[21040401] }}
                            <p> @{{ item.obj[21040402] }}</p>
                            <p> @{{ item.obj[21040403] }}</p>
                        </td>
                    </tr>
                    <tr ng-show="item.obj[111493] != undefined">
                        <td> @{{ item.obj[111493] }}</td>
                        <td>@{{ item.obj[111494] }}</td>
                        <td>
                            @{{ item.obj[111495] }}
                            <p> @{{ item.obj[111496] }}</p>
                        </td>
                        <td>@{{ item.obj[111499] }}</td>
                        <td>
                            @{{ item.obj[21040404] }}
                            <p> @{{ item.obj[21040405] }}</p>
                            <p> @{{ item.obj[21040406] }}</p>
                        </td>
                    </tr>
                    <tr ng-show="item.obj[111503] != undefined">
                        <td> @{{ item.obj[111503] }}</td>
                        <td>@{{ item.obj[111504] }}</td>
                        <td>
                            @{{ item.obj[111505] }}
                            <p> @{{ item.obj[111506] }}</p>
                        </td>
                        <td>@{{ item.obj[111509] }}</td>
                        <td>
                            @{{ item.obj[21040407] }}
                            <p> @{{ item.obj[21040408] }}</p>
                            <p> @{{ item.obj[21040409] }}</p>
                        </td>
                    </tr>
                    <tr ng-show="item.obj[111513] != undefined">
                        <td> @{{ item.obj[111513] }}</td>
                        <td>@{{ item.obj[111514] }}</td>
                        <td>
                            @{{ item.obj[111515] }}
                            <p> @{{ item.obj[111516] }}</p>
                        </td>
                        <td>@{{ item.obj[111519] }}</td>
                        <td>
                            @{{ item.obj[21040410] }}
                            <p> @{{ item.obj[21040411] }}</p>
                            <p> @{{ item.obj[21040412] }}</p>
                        </td>
                    </tr>
                    <tr ng-show="item.obj[111523] != undefined">
                        <td> @{{ item.obj[111523] }}</td>
                        <td>@{{ item.obj[111524] }}</td>
                        <td>
                            @{{ item.obj[111525] }}
                            <p> @{{ item.obj[111526] }}</p>
                        </td>
                        <td>@{{ item.obj[111529] }}</td>
                        <td>
                            @{{ item.obj[21040413] }}
                            <p> @{{ item.obj[21040414] }}</p>
                            <p> @{{ item.obj[21040415] }}</p>
                        </td>
                    </tr>
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
{{--            </div>--}}
{{--        </td>--}}
{{--    </tr>--}}
{{--    </tbody>--}}
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

    angular.controller('cetakCPPTRanapCtrl', function ($scope, $http, httpService) {
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
        var dataLoad = {!! json_encode($res['d'] )!!};
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
                // var res = str.split("~");
                // $scope.item.objcbo[dataLoad[i].emrdfk]= {value:res[0],text:res[1]}
                $scope.item.obj[dataLoad[i].emrdfk] = str //res[1]

            }


        }
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
