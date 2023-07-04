{{-- @extends('report.dom') --}}
@php
    $reportcontroller = new \App\Http\Controllers\Report\ReportController();
    // $indexData = $homeController->index();
@endphp
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>SPB</title>
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
            position: absolute;
            bottom: 0;
            right: 5%;
        }
        footer {
            position: fixed;
            bottom: 0;
        }
    </style>

</head>
<body>
        <section style="font-family:Arial;padding:15mm 10mm 15mm 15mm">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td width="10%" style="padding: 0px">
                            {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
                                <img src="img/pemda_trans.png" alt="Logo" style="width: 100px; margin-left:30px">
                                <br>
                                <b >
                                </b>
                            {{-- @else --}}
                                {{-- <img src="service/img/logo_only.png" alt="" style="width: 90px;"> --}}
                            {{-- @endif --}}
                        </td>
                        <td style="text-align: center; line-height: normal">
                            <span style="font-size: 12pt;">{!! $res['profile']->baris1 !!}</span>
                                <br>
                                <span style="font-size: 15pt;">{!! $res['profile']->baris2 !!}</span>
                                <br>
                                <span style="font-size: 12pt;">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                                <br>
                                <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 190px;">
                                <br>
                                <span style="font-size: 10pt; font-weight: normal">Jl.  Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}, 895297 Faksimile : {{$res['profile']->faksimile}}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                                <br>
                                Yogyakarta 55582
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
            <br>
            <table width="100%"   cellspacing="0" cellpadding="0" 
                style="margin-left: 2px">
                <tr>
                    <th style="font-size: 12px" colspan="3">SURAT PERMINTAAN BARANG</th>
                </tr>
                <tr>
                    <th style="font-size: 12px; font-weight: normal" colspan="3">
                        {{$data[0]->noorder}}
                    </th>
                </tr>
                <tr>
                    <td><br></td>
                </tr>
                <tr>
                    <td width="70px">Dari</td>
                    <td width="1%"> : </td>
                    <td> </td>
                </tr>
                <tr>
                    <td>Kepada</td>
                    <td> : </td>
                    <td> Pengguna Barang/Kuasa Pengguna c.q Sekretaris</td>
                </tr>
                <tr>
                    <td colspan="3"> Mohon diberikan barang dalam daftar dibawah ini untuk 
                    {{$data[0]->namaruangan}}</td>
                </tr>
            </table>
            <br>
            <table  cellspacing="0" cellpadding="0" border="1" width="100%">
                <tr>
                    <th style="padding: 3px;font-weight: none; font-size: 10pt" width="5%" rowspan="2">No. <br> Urut</th>
                    <th style="padding: 3px;font-weight: none; font-size: 10pt" width="40%" rowspan="2">Nama Barang</th>
                    <th style="padding: 3px;font-weight: none; font-size: 10pt" width="15%" rowspan="2">Stok  <br>di Ruangan</th>
                    <th style="padding: 3px;font-weight: none; font-size: 10pt" width="10%" rowspan="2">Satuan</th>
                    <th style="padding: 3px;font-weight: none; font-size: 10pt" width="10%" colspan="2">Jumlah</th>
                    <th style="padding: 3px;font-weight: none; font-size: 10pt" width="10%" rowspan="2">Ket</th>
                </tr>
                <tr>
                    <th style="padding: 3px;font-weight: none; font-size: 10pt" width="10%">Permintaan</th>
                    <th style="padding: 3px;font-weight: none; font-size: 10pt" width="10%">diberikan</th>
                </tr>
                @php
                    $no = 1;
                @endphp
                @foreach ($data as $item)
                    <tr>
                        <th style="font-weight: none; font-size: 10pt">{{$no++}}</th>
                        <td style="padding: 3px">{{$item->namaproduk}}</td>
                        <th style="font-weight: none; font-size: 10pt">{{$item->qtyprodukruangan}}</th>
                        <th style="font-weight: none; font-size: 10pt">{{$item->satuanstandar}}</th>
                        <th style="font-weight: none; font-size: 10pt">{{$item->qtyproduk}}</th>
                        <th style="font-weight: none; font-size: 10pt">{{$item->qtyberi}}</th>
                        <td style="padding: 3px"></td>
                    </tr>
                @endforeach
            </table>

            <div class="footer ">
                <table>
                    <tbody>
                        <tr>
                            <td width="33%" style="text-align: center"> </td>
                            <td width="33%">
                            </td>
                            <td width="33%">Sleman, {{$reportcontroller->tanggal_indonesia(date('Y-m-d'))}}</td>

                        </tr>
                        <tr>
                            <td width="33%">
                            </td>
                            <td width="33%">
                            </td>
                            <td width="33%" style="text-align: center">Yang Mengajukan
                            </td>
                        </tr>
                        <tr>
                            <td width="33%" style="text-align: center"> </td>
                            <td width="33%"></td>
                            <td width="33%" style="text-align: center">
                                {{-- Pejabat Penatausahaan Barang --}}
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td height="100px"> </td>
                        </tr>
                        <tr>
                            <td style="text-align: center"></td>
                            <td style="text-align: center">&nbsp;</td>
                            <td style="text-align: center">
                                <br>
                                <u>{{$data[0]->namalengkap}}</u>
                                <br>
                                NIP. {{$data[0]->nippns}}
                                {{-- <br>{!! $res['d'][0]->namadokter == null ? ($peg!=null?$peg->namalengkap:'-'): $res['d'][0]->namadokter !!} --}}
                                {{-- <br>{!! $item[3003998] !!} --}}
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
                {{-- <p
            style="font-size:10px;color: rgb(173, 173, 173); position: absolute; bottom: 30%; left: 3%; width: 50%; text-align: center;">
            <i>Dokumen ini ditandatangani secara elektronik menggunakan sertifikat elektronik
                yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE) Badan Siber dan Sandi Negara</i></p> --}}
            </div>
            
        </section>
        
    </body>
</html>

