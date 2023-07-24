@extends('report.dom')
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>CATATAN KONSELING NAPZA</title>
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
        /* Padding for the header on the first page */
        @page :first {
            margin-top: 5mm;
        }

        /* Padding for the header on subsequent pages */
        @page {
            margin-top: 5mm;
            margin-bottom: 5mm;

        }
        .footer {
            text-align: center;
            position: fixed;
            bottom: 0;
            }

        
        
    </style>

</head>
<body>
        <section style="font-family:Arial;padding:5mm">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td width="10%" style="padding: 5px">
                            {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 90px;">
                            {{-- @else --}}
                                {{-- <img src="service/img/logo_only.png" alt="" style="width: 90px;"> --}}
                            {{-- @endif --}}
                        </td>
                        <td width="60%" style="text-align: center">
                            <span style="font-size: 10pt;font-weight: bold;letter-spacing: normal;">{!! $res['profile']->baris1 !!}</span>
                                <br>
                                <span style="font-size: 12pt; font-weight: bold;letter-spacing: normal">{!! $res['profile']->baris2 !!}</span>
                                <br>
                                <span style="font-size: 10pt; font-weight: bold">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                                <br>
                                <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 120px;">
                                <br>
                                <span style="font-size: 7pt; font-weight: normal">Jl.  Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}, 895297 Faksimile : {{$res['profile']->faksimile}}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                                
                                </span>
                        </td>
                        <td width="40%" style="padding: 0px">
                            <div class="box" style="text-align: left">
                                <table style="padding: 1px;">
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
                                            <b>{!!  $res['d'][0]->jeniskelamin   !!}</b></td>
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
                                        <td class="f-s-15 bold  text-top"><b>{!! $res['d'][0]->namaruangan  !!}</b>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <hr style="border:1px solid #000;">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <th colspan="3" style="font-size: 20px; text-align: center">CATATAN KONSELING</th>
                </tr>
                <tr>
                    <td width="20%">Nomor Rekam Medis</td>
                    <td width="5%"> : </td>
                    <td width="75%">{{isset($item[1901305600]) ? $item[1901305600] : '' }}</td>
                </tr>
                <tr>
                    <td>Nama Lengkap</td>
                    <td> : </td>
                    <td>{{isset($item[1901305610]) ? $item[1901305610] : '' }}</td>
                </tr>
                <tr>
                    <td>Tempat, Tanggal Lahir</td>
                    <td> : </td>
                    <td>{{isset($item[1901305620]) ? $item[1901305620] : '' }}</td>
                </tr>
            </table>
            <br>
            <table cellspacing="0" cellpadding="0" border="1" width="100%">
                <tr>
                    <th width="20%" style="padding: 3px; font-size:10pt">Tanggal</th>
                    <th width="50%" style="padding: 3px; font-size:10pt">PELAKSANAAN</th>
                    <th width="30%" style="padding: 3px; font-size:10pt">TTD DAN NAMA</th>
                </tr>
                <tr>
                    <th style="font-weight: normal;padding: 3px; font-size:10pt; vertical-align: top">{{isset($item[1901305000]) ? $item[1901305000] : '' }}</td>
                    <td style="white-space: pre-line;padding: 3px; font-size:10pt; height: 500px; vertical-align: top">{{isset($item[1901305010]) ? $item[1901305010] : '' }}</td>
                    <th style="font-weight: normal;padding: 3px; font-size:10pt; ">{{isset($item[1901305020]) ? $item[1901305020] : '' }}</th>
                </tr>
            </table>
        </section>
    </body>
</html>

