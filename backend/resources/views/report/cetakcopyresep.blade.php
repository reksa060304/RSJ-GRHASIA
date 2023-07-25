{{-- @extends('report.dom') --}}
@php
    $reportcontroller = new \App\Http\Controllers\Report\ReportController();
    // $indexData = $homeController->index();
@endphp
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>COPY RESEP</title>
    {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
        <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">

        <link href="css/style.css" rel="stylesheet">
    {{-- @else
        <link rel="stylesheet" href="service/css/report/paper.css">
        <link rel="stylesheet" href="service/css/report/table.css">
        <link rel="stylesheet" href="service/css/report/tabel.css">

        <link href="service/css/style.css" rel="stylesheet">
    @endif --}}

    <style>
        @page {
            size:A4;
            line-height: 1.5;
        }
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
        .footer2 {
            text-align: center;
            position: absolute;
            left: 67%;
            bottom: 35%;
            right: 3%;
            }

        footer {
            /* text-align: center; */
            bottom: 0;
        }
        footer {
            bottom: 0;
        }
    </style>

</head>
<body>
        <section style="font-family:Arial;padding:3mm 110mm 10mm 3mm; width: 110mm; height: 220mm">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <th colspan="2" style="text-align: right">CM.FM.03</th>
                    </tr>
                    <tr>
                        <td width="5%" style="padding: 0px">
                            {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 80px;">
                                <br>
                                {{-- <b style="">
                                    RSJ GRHASIA
                                </b> --}}
                            {{-- @else --}}
                                {{-- <img src="service/img/logo_only.png" alt="" style="width: 90px;"> --}}
                            {{-- @endif --}}
                        </td>
                        <td style="text-align: center; line-height: normal">
                            <br>
                            <span style="font-size: 7pt;font-weight: bold">{!! $res['profile']->baris1 !!}</span>
                                <br>
                                <span style="font-size: 9pt; font-weight: bold">{!! $res['profile']->baris2 !!}</span>
                                <br>
                                <span style="font-size: 8pt; font-weight: bold">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                                <br>
                                <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 100px;">
                                <br>
                                <span style="font-size: 5pt; font-weight: normal">Jl.  Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}, 895297 Faksimile : {{$res['profile']->faksimile}}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                                
                                </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <hr style="border:1px solid #000;margin-bottom:0px">
                            <hr style="border:0.5px solid #000;margin-top:2px">
                        </td>
                    </tr>
                </tbody>
            </table>
            <table width="100%"   cellspacing="0" cellpadding="0" 
                style="margin-left: 2px">
                <tr style="font-size: 5pt;">
                    <td  width="70px">Pro</td>
                    <td width="1%"> : </td>
                    <td>{{$data[0]->namapasien}} </td>
                </tr>
                <tr>
                    <td>Dokter</td>
                    <td> : </td>
                    <td> {{ $data[0]->dokter}}</td>
                </tr>
                <tr>
                    <td>Tanggal / No</td>
                    <td> : </td>
                    <td> {{ $reportcontroller->tanggal_indonesia(date('Y-m-d',strtotime($data[0]->tanggal)))}} / {{$data[0]->noresep}}</td>
                </tr>
                <tr>
                    <td colspan="3">
                        <hr style="border:0.5px solid #000;margin-top:0px">
                    </td>
                </tr>
            </table>
            <table  cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <th colspan="2" style="text-align: center"><u>COPY RESEP</u></th>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: left">@if($data[0]->cpiter1 == true) Iter 1x @elseif ($data[0]->cpiter2 == true) Iter 2x @elseif ($data[0]->cpiter3 == true) Iter 3x @endif</td>
                </tr>
                @php
                    $rke = 0;
                @endphp
                @foreach ($data as $d)
                    <tr>
                        <td>@if($d->nomor == 1) R/  @endif <br> @if($d->iteroabat1 == true) Iter 1x @elseif ($d->iteroabat2 == true) Iter 2x @elseif ($d->iteroabat3 == true) Iter 3x @endif</td>
                        <td >{{$d->produk}} &nbsp;{{$d->dosis}} No. {{$d->jumlahobat}} <br>
                            @if ($d->mfla != null)
                                mfla {{$d->mfla}} No. {{$d->jumlah}} 
                                <br>
                            @endif 
                            @if ($d->entry != null)
                                S. {{$d->ispagi ? 1 : 0 }}-{{$d->issiang ? 1 : 0 }}-{{$d->issore ? 1: 0 }}-{{$d->ismalam ? 1: 0 }} &nbsp; {{$d->sediaan}}
                            @endif

                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: right">{{$d->entry}}
                            @if ($d->entry != null)
                                <hr style="border-style: solid">
                            @endif</td>
                    </tr>
                    @php
                        $rke = $d->rke;
                    @endphp
                @endforeach
            </table>
            <div style="text-align: center; bottom:0px; position: absolute; left: 200px">
                <table>
                    <tr style="text-align: right">
                        <td>{{$reportcontroller->tanggal_indonesia(date('Y-m-d',strtotime($data[0]->tglcopy)))}}</td>
                    </tr>
                    <tr>
                        <td style="text-align: right">Pcc : <br>
                            {{$data[0]->namalengkap}}</td>
                    </tr>
                </table>
            </div>
        </section>
        
    </body>
</html>

