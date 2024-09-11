<!DOCTYPE html >
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>Catatan Klinik</title>
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
        .row {
            display: table;
            width: 100%; /*Optional*/
            table-layout: fixed; /*Optional*/
            border-spacing: 10px; /*Optional*/
        }
        .column {
            display: table-cell;
            /* background-color: red; Optional */
        }
    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto" ng-controller="cetakCPPTRanapCtrl">
<section class="sheet padding-10mm" style="font-family:Tahoma;height: auto">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tbody>
                    <tr>
                        <td width="10%" style="padding: 5px">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                                <img src="{{ asset('img/logo_only.png') }}" alt="" style="width: 90px;">
                            @else
                                <img src="{{ asset('service/img/logo_only.png') }}" alt="" style="width: 90px;">
                            @endif
                        </td>
                        <td style="text-align: left">
                            <b>
                                <span style="font-size: 16px">{{ $profile[0]->namalengkap }}</span></br>
                                </br>
                                <span style="font-size: 14px;">{{ $profile[0]->alamatlengkap }}</span>
                            </b>
                        </td>
                        <td width="40%" style="padding: 10px">
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
                                        <td class="f-s-15 bold  text-top"><b>{!! $res['d'][0]->ruanganakhir   !!}</b>
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
                                    <th style="font-size: 20px;text-align: center">CATATAN PERKEMBANGAN PASIEN TERINTEGRASI </th>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
        <td style="vertical-align: text-top">
                <table width="100%" border="1" bordercolor="#000000" class="garis6" style="margin-left: 2px" >
                    <tr>
                        <th rowspan="2">Nama/Tanggal</th>
                        <th rowspan="2">Profesional Pemberi Asuhan</th>
                        <th>Hasil Asesmen Pasien Dan Pemberian Pelayanan</th>
                        <th rowspan="2">Intruksi PPA</th>
                        <th rowspan="2"> Riview & Verifikasi DPJP</th>
                    </tr>
                    <tr>
                        <th>SOAP</th>
                    </tr>
                       
                    @foreach ($res ['d'] as $item)
                        <tr>
                            <td width="10%">
                                <font style="font-size: 8pt;" color="#000000">{{ $item->namapasien }}</font>
                                <br><br>
                               <b><font style="font-size: 8pt;" color="#000000">{{ $item->nocm }}</font></b> 
                                <br><br>
                                <font style="font-size: 8pt;" color="#000000">{{ $item->tglasesmen }}</font>
                                <br><br>
                                <font style="font-size: 8pt;" color="#000000">{{ $item->ruangcppt }}</font>
                            </td>
                            <td width="10%"  
                            {{-- @if( $item->jenispegawai == 'DOKTER')
                            style="background-color:#c5f3fb;"
                            @elseif($item->jenispegawai  == 'Apoteker')
                            style="background-color:#fbc5f3;"
                            @else
                            style="background-color:#c5fbe8;"
                            @endif --}}
                            >
                                <font style="font-size: 10pt;" >{{ $item->jenispegawai }}</font>
                            </td>
                            <td width="40%" valign="top" >
                                <font style="font-size: 10pt;" color="#000000">
                                    @if($item->objectjenisdokumenfk == 1)
                                    <p style="text-align:center; margin:0;
                                    padding:0; line-height : 20px; background-color:rgb(234, 234, 224);"><b>C&ensp;P&ensp;P&ensp;T</b></p>
                                    @elseif($item->objectjenisdokumenfk == 2)
                                    <p style="text-align:center; margin:0;
                                    padding:0; line-height : 20px; background-color:rgb(234, 234, 224);"><b>S&ensp;B&ensp;A&ensp;R</b></p>
                                    @else
                                    <p style="text-align:center; margin:0;
                                    padding:0; line-height : 20px; background-color:rgb(234, 234, 224);"><b>NILAI KRITIS</b></p>
                                    @endif
                                    &#10148;{{ $item->s }} <br><br> &#10148;{{ $item->o }} <br><br> &#10148;{{ $item->a }} <br><br> &#10148;{{ $item->p }}
                                </font>
                                <font style="font-size: 8pt;" color="#000000">
                                <div class="row">
                                    <div class="column" ><u>Pemberi Laporan:</u></div>    
                                    @if($item->objectjenisdokumenfk == 2)  
                                    <div class="column" ><u>Penerima Laporan:</u></div> 
                                    @endif     
                                </div>
                                                         
                                <div style="display: flex; align-items: center;">
                                    <div >
                                        <p> {{ $item->namalengkap }}&nbsp;</p>
                                        <p>
                                        <img  style="margin-top: 5px; align-items: center;"
                                        rc="http://qrserver.rsudtulungagung.com/create?data= {{ $item->namalengkap }}" alt="" width="30" height="30" />
                                        </p>
                                    </div>
                                    @if(isset($item->namaterima))
                                        <div style="margin-left: 10px;">
                                            <p>Terima : {{ $item->namaterima }}</p>
                                            <p><img  style="margin-top: 5px; align-items: center;"
                                            rc="http://qrserver.rsudtulungagung.com/create?data= {{ $item->namaterima }}" alt="" width="30" height="30" />
                                            </p>
                                        </div>
                                    @endif
                                    @if($item->objectjenisdokumenfk != 2)                                    
                                </div>
                                @endif 
                                @if(isset($item->dpjpkonsulan))
                                @if($item->objectjenisdokumenfk != 2)
                                <div style="display: flex; align-items: right;"><u>Penerima Laporan:</u></div>
                                
                                <div style="display: flex; align-items: center;">
                                @endif      
                                    <div >
                                        <p>DPJP:{{ $item->dpjpkonsulan }}</p>
                                        <p>
                                        <img  style="margin-top: 5px; align-items: center;"
                                        rc="http://qrserver.rsudtulungagung.com/create?data= {{ $item->dpjpkonsulan }}" alt="" width="30" height="30" />
                                        </p>
                                    </div>                                   
                                    @if(isset($item->ppenunjang))
                                        <div style="margin-left: 10px;">
                                            <p>Perawat Penunjang : {{ $item->ppenunjang }}</p>
                                            <p><img  style="margin-top: 5px; align-items: center;"
                                            rc="http://qrserver.rsudtulungagung.com/create?data= {{ $item->ppenunjang }}" alt="" width="30" height="30" />
                                            </p>
                                        </div>
                                    @endif
                                </div>
                                @endif
                                </font>
                            </td>
                            <td width="20%">
                                <font style="font-size: 10pt;" color="#000000"><pre style="font-family: Tahoma; white-space: pre-wrap; margin: 0;">{{ $item->intruksi }}</pre></font> 
                            </td>
                            <td width="20%">
                                <font style="font-size: 10pt;" color="#000000"><pre style="font-family: Tahoma; white-space: pre-wrap; margin: 0;">{{ $item->riview }}</pre>
                                <p>{{ $item->tglreview }}</p>
                                
                                <p>
                                <!-- <img  style="margin-top: 5px; align-items: center;"
                                src="http://qrserver.rsudtulungagung.com/create?data= {{ $item->namareview }}" alt="" width="75" height="75" /> -->
                                @if(isset($item->namareview))
                                    <p>{{ $item->namareview }}</p>
                                    <p>
                                        <img style="margin-top: 5px; align-items: center;"
                                        rc="http://qrserver.rsudtulungagung.com/create?data={{ $item->namareview }}" alt="" width="50" height="50" />
                                    </p>
                                @else
                                    <p></p>
                                @endif
                                </p>   
                                </font> 
                            </td>
                        </tr>                            
                    @endforeach
                </table>
                {{--<table>
                    <tbody>
                    <tr>
                        <td width="33%" style="text-align: center">
                            
                        </td>

                        <td width="33%"></td>
                        <td width="33%"><b>Tulungagung</b>, {!! date('d-m-Y') !!} <br>
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
                           
                        </td>
                    </tr>

                    </tbody>
                </table>--}}
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
