{{-- @extends('report.dom') --}}
@php
    $reportcontroller = new \App\Http\Controllers\Report\ReportController();
    // $indexData = $homeController->index();
@endphp
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>SPPB</title>
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
            position: fixed;
            left: 67%;
            bottom: 35%;
            right: 3%;
            }

        footer {
            /* text-align: center; */
            /* position: fixed; */
            position: fixed;
            bottom: 10%;
            right: 5%;
        }
    </style>

</head>
<body>
        <section style="font-family:Arial;padding:15mm 10mm 10mm 15mm">
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
            <table width="100%"   cellspacing="0" cellpadding="0" 
                style="margin-left: 2px;padding:0">
                <tr>
                    <th style="font-size: 12px;" colspan="3">SURAT PERINTAH PENGELUARAN / PENYALURAN BARANG</th>
                </tr>
                <tr>
                    <th style="font-size: 12px; font-weight: normal" colspan="3">
                        {{$data[0]->nokirim}}
                    </th>
                </tr>
                <tr>
                    <td><br></td>
                </tr>
                <tr>
                    <td width="50px">Dari</td>
                    <td width="5px"> : </td>
                    <td> Pengguna / Kuasa Pengguna</td>
                </tr>
                <tr>
                    <td>Kepada</td>
                    <td> : </td>
                    <td> Penyimpan Barang</td>
                </tr>
                <tr>
                    <td>Alamat</td>
                    <td> : </td>
                    <td> RS Jiwa Grhasia DIY</td>
                </tr>
                <tr>
                    <td colspan="3"> Harap dikeluarkan dari gudang dan disalurkan barang tersebut dalam daftar dibawah ini untuk: <br>
                    {{$data[0]->namaruangan}}</td>
                </tr>
                <tr>
                    <td colspan="3">Berdasarkan permintaan barang : {{$data[0]->noorder}}</td>
                </tr>
            </table>
            <br>
            <table  cellspacing="0" cellpadding="0" border="1" width="100%">
                <tr>
                    <th style="padding: 0px 3px 0px 3px;font-weight: none; font-size: 10pt" width="10%">No</th>
                    <th style="padding: 0px 3px 0px 3px;font-weight: none; font-size: 10pt" width="3%">Banyaknya</th>
                    <th style="padding: 0px 3px 0px 3px;font-weight: none; font-size: 10pt" width="50%">Nama Barang</th>
                    <th style="padding: 0px 3px 0px 3px;font-weight: none; font-size: 10pt" width="20%">Harga Satuan</th>
                    <th style="padding: 0px 3px 0px 3px;font-weight: none; font-size: 10pt" width="20%">Jumlah</th>
                    <th style="padding: 0px 3px 0px 3px;font-weight: none; font-size: 10pt" width="20%">Ket</th>
                </tr>
                @php
                    $no = 1;
                @endphp
                @foreach ($data as $item)
                    <tr>
                        <th style="font-weight: none; font-size: 10pt">{{$no++}}</th>
                        <td style="padding: 0px 3px 0px 3px">{{$item->qtyproduk}}</td>
                        <td style="padding: 0px 3px 0px 3px">{{$item->namaproduk}}</td>
                        <td style="padding: 0px 3px 0px 3px">Rp. {{ number_format($item->harganetto,2,",",".")}}</td>
                        <td style="padding: 0px 3px 0px 3px">Rp. {{ number_format($item->harganetto * $item->qtyproduk,2,",",".")}}</td>
                        <td></td>
                    </tr>
                @endforeach
            </table>

            
            <div class="footer">
            <table>
                <tbody>
                    <tr>
                        <td width="33%" style="text-align: center"> </td>
                        <td width="33%">
                        </td>
                        <td width="33%" style="margin: 0">Sleman, {{$reportcontroller->tanggal_indonesia(date('Y-m-d', strtotime($data[0]->tglorder)))}}</td>
                    </tr>
                    <tr>
                        <td width="33%">
                        </td>
                        <td width="33%">
                        </td>
                        <td width="33%" style="text-align: center">Pengguna / Kuasa Pengguna
                        </td>
                    </tr>
                    <tr>
                        <td width="33%" style="text-align: center"> </td>
                        <td width="33%"></td>
                        <td width="33%" style="text-align: center">
                            Pejabat Penatausahaan Barang
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td height="20px"> </td>
                    </tr>
                    <tr>
                        <td style="text-align: center"></td>
                        <td style="text-align: center">&nbsp;</td>
                        <td style="text-align: center">
                            <br>
                            <u>drg. RIRIN PUSPANDARI, M. Kes.</u>
                            <br>
                            NIP. 19670530 199403 2 003
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        </section>
        
    </body>
</html>

