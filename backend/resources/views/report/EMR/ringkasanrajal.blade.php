{{-- @extends('report.dom') --}}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Resume Medis</title>
        <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">
        <link href="css/style.css" rel="stylesheet">
        <script src="js/jquery.min.js"></script>
    <script src="js/jquery.qr-code.js"></script>

        <!-- angular -->
        @if(stripos(\Request::url(), 'localhost') !== FALSE)
    <link rel="stylesheet" href="{{ asset('css/report/paper.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/table.css') }}">
    <link rel="stylesheet" href="{{ asset('css/report/tabel.css') }}">
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery.qr-code.js') }}"></script>

        <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        <!-- angular -->
        {{-- <script src="{{ asset('js/angular/angular.min.js') }}" type="text/javascript"></script> --}}
        {{-- <script src="{{ asset('js/angular/angular-route.min.js') }}" type="text/javascript"></script> --}}
        {{-- <script type="text/javascript" src="{{ asset('js/angular/angular-animate.min.js') }}"></script> --}}
        {{-- <script type="text/javascript" src="{{ asset('js/angular/angular-aria.min.js') }}"></script> --}}
        {{-- <script src="{{ asset('js/angular/angular-material.js') }}" type="text/javascript"></script> --}}
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
            size:A4;
            margin-top: 50px
        }
        @page::after {
            size:A4;
            margin-top: 50px


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
        .footer {
            text-align: center;
            position: absolute;
            bottom: 0;
            right: 5%;
        }
        footer {
            position: fixed;
            bottom: 0;
        }
        #soap >table>tr> td{
            border-collapse: collapse;
            border: 1px solid #000000;
        }
    </style>

</head>
<body class="A4" style="font-family:Tahoma;height: auto">
        <section style="font-family:Arial;padding:10mm">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td width="20%" style="padding: 5px">
                            @if ( stripos(\Request::url(), 'localhost') !== FALSE)
                                <img src="{{asset('img/logo_grhasia_com.png')}}" alt="Logo" style="width: 100px; margin-bottom:10px">
                            @else
                                <img src="{{asset('service/img/logo_grhasia_com.png')}}" alt="Logo" style="width: 100px; margin-bottom:10px">
                            @endif
                                 <br>
                                <b >
                                    <span style="font-size: 9pt;"> RS JIWA GRHASIA</span>
                                    <br>
                                    <span style="font-size: 6pt;"> Daerah Istimewa Yogyakarta</span>
                                </b>
                        </td>
                        <td style="text-align: center">
                            <b>
                                <span style="font-size: 16pt; text-align: center">RINGKASAN <br> RAWAT JALAN</span>
                            </b>
                        </td>
                        <td style="text-align: center">
                            <table bgcolor="#FFFFFF" border="1" style="border:#000 solid 1px"width="100%">
                                <tr>
                                    <td height="5" width="40%" style="border: none;">
                                        <font style="font-size: 10pt;" color="#000000" >&nbsp;&nbsp;NOMOR RM</font>
                                    </td>
                                    <td height="5" width="2%" style="border: none;"><font size="1">:</font></td>
                                    <td height="5" width="58%" style="border: none;"><font style="font-size: 10pt;" color="#000000" >{{$dataReport->nocm}}</font></td>
                                </tr>
                                <tr>
                                    <td height="5" width="40%" style="border: none;">
                                        <font style="font-size: 10pt;" color="#000000" >&nbsp;&nbsp;Nama</font>
                                    </td>
                                    <td height="5" width="2%" style="border: none;"><font size="1">:</font></td>
                                    <td height="5" width="58%" style="border: none;"><font style="font-size: 10pt;" color="#000000" >{{$dataReport->namapasien}}</font></td>
                                </tr>
                                <tr>
                                    <td height="5" width="40%" style="border: none;">
                                        <font style="font-size: 10pt;" color="#000000" >&nbsp;&nbsp;Tanggal Lahir</font>
                                    </td>
                                    <td height="5" width="2%" style="border: none;"><font size="1">:</font></td>
                                    <td height="5" width="58%" style="border: none;"><font style="font-size: 10pt;" color="#000000">{{$dataReport->tgllahir}} / {{$dataReport->jk}}</font></td>
                                </tr>
                                
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left" colspan="3">
                            <table bgcolor="#FFFFFF" border="1" style="border:#000 solid 1px"width="100%">
                                <tr>
                                    <td height="5" width="40%" style="border: none;">
                                        <font style="font-size: 10pt;" color="#000000" >&nbsp;&nbsp;Tanggal Kunjungan </font>
                                    </td>
                                    <td height="5" width="2%" style="border: none;"><font size="1">:</font></td>
                                    <td height="5" width="58%" style="border: none;"><font style="font-size: 10pt;" color="#000000" >{{date('d-m-Y', strtotime($dataReport->tglregistrasi))}}</font></td>
                                </tr>
                                <tr>
                                    <td height="5" width="40%" style="border: none;">
                                        <font style="font-size: 10pt;" color="#000000" >&nbsp;&nbsp;Klinik</font>
                                    </td>
                                    <td height="5" width="2%" style="border: none;"><font size="1">:</font></td>
                                    <td height="5" width="58%" style="border: none;"><font style="font-size: 10pt;" color="#000000" >{{$dataReport->namaruangan}}</font></td>
                                </tr>
                                <tr>
                                    <td height="5" width="40%" style="border: none;">
                                        <font style="font-size: 10pt;" color="#000000" >&nbsp;&nbsp;Cara Bayar</font>
                                    </td>
                                    <td height="5" width="2%" style="border: none;"><font size="1">:</font></td>
                                    <td height="5" width="58%" style="border: none;"><font style="font-size: 10pt;" color="#000000">{{$dataReport->kelompokpasien}}</font></td>
                                </tr>
                                <tr>
                                    <td height="5" width="40%" style="border: none;">
                                        <font style="font-size: 10pt;" color="#000000" >&nbsp;&nbsp;Kasus</font>
                                    </td>
                                    <td height="5" width="2%" style="border: none;"><font size="1">:</font></td>
                                    <td height="5" width="58%" style="border: none;"><font style="font-size: 10pt;" color="#000000">{{$dataReport->statuskunjungan}}</font></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <table cellspacing="0" cellpadding="0" border="1" width="100%">
                                <tr>
                                    <td style="text-align: center; font-weight: bold" width="20%">TANGGAL DAN PUKUL</td>
                                    <td style="text-align: center; font-weight: bold" width="10%">PROFESIONAL PEMBERI ASUHAN</td>
                                    <td style="text-align: center; font-weight: bold" width="40%">HASIL PEMERIKSAAN, ANALISIS, RENCANA PENATALAKSANAAN PASIEN <br>(Dituliskan dengan format SOAP/ADIME, disertai dengan tulisan yang terukur, evaluasi hasil tatalaksana dituliskan dalam asesmen, Harap bubuhkan stempel nama dan paraf pada setiap akhir catatan)</td>
                                    <td style="text-align: center; font-weight: bold" width="5%">INSTRUKSI PPA</td>
                                    <td style="text-align: center; font-weight: bold" width="25%">REVIEW & VERIFIKASI DPJP/DOKTER <br>
                                    (Tulis nama, beri paraf, Tgl, Jam) <br>
                                    (DPJP harus membaca/mereview seluruh rencana asuhan)</td>
                                </tr>
                                @foreach ($item as $i)
                                
                                    <tr>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{$i['tgljam'] }}</td>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{$i['jenisppa'] }}</td>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{$i['soap'] }} <br> <br> {{$i['tenagamedis'] }}</td>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{$i['instruksi'] }}</td>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{$i['review'] }} <br> <br> <p>{{$i['tgldpjp'] }} <br> {{$i['ttddpjp'] }}</p></td>
                                    </tr>
                                    {{-- @if (isset($item[22034969]))
                                    <tr>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{isset($item[22034970]) ? $item[22034970] : '' }}</td>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{isset($item[22034971]) ? $item[22034971] : '' }}</td>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{isset($item[22034972]) ? $item[22034972] : '' }} <br> <br> {{isset($item[22034973]) ? $item[22034973] : '' }}</td>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{isset($item[22034974]) ? $item[22034974] : '' }}</td>
                                        <td style="white-space: pre-wrap;vertical-align: top; font-size: 10pt">{{isset($item[22034975]) ? $item[22034975] : '' }} <br> <br> <p>{{isset($item[22034976]) ? $item[22034976] : '' }} <br> {{isset($item[22034968]) ? $item[22034968] : '' }}</p></td>
                                    </tr>
                                    @endif --}}
                                
                                    
                                @endforeach
                             
                            </table>
                        </td>
                    </tr>
                    <tr style="page-break-before: always;">
                        <td colspan="3">
                            <table cellspacing="0" cellpadding="0" border="1" width="100%">
                                <tr>
                                    <td>Diagnosa Utama</td>
                                    @forelse ($diagnosa as $d)
                                        @if ($d->objectjenisdiagnosafk == 1)
                                        <td>{{$d->namadiagnosa}}</td>
                                        <td>{{$d->kddiagnosa}}</td>
                                        @endif
                                    @empty
                                    @endforelse
                                </tr>
                                <tr>
                                    <td>Diagnosa Sekunder</td>
                                    @forelse ($diagnosa as $d)
                                        @if ($d->objectjenisdiagnosafk == 2)
                                        <td>{{$d->namadiagnosa}}</td>
                                        <td>{{$d->kddiagnosa}}</td>
                                        @endif
                                        @empty
                                    @endforelse
                                </tr>
                              
                            </table>
                        </td>
                    </tr>
                    @if (count($konsultasi)>0)
                        <tr>
                        <td colspan="3">
                            <table cellspacing="0" cellpadding="0" border="1" width="100%">
                                <tr>
                                    <th style="text-align: center" colspan="3">KONSULTASI</th>
                                </tr>
                                <tr>
                                    <td style="text-align: center">Permasalahan</td>
                                    <td style="text-align: center">Nama DPJP</td>
                                    <td style="text-align: center">Jawaban Konsultasi</td>
                          
                                </tr>
                                @forelse ($konsultasi as $item)
                                    <tr>
                                    <td style="text-align: center">{{$item->keteranganorder}}</td>
                                    <td style="text-align: center">{{$item->namalengkap}}</td>
                                    <td style="text-align: center">{{$item->keteranganlainnya}}</td>
                                </tr>
                                @empty
                                    
                                @endforelse
                             
                            </table>
                        </td>
                    </tr>
                    @endif
                </tbody>
            </table>
            
            <div style="margin-top: 30px; margin-left:20px">
                <table>
                    <tbody>
                        <tr>
                            <td width="33%" style="text-align: center"> </td>
                            <td width="33%"></td>
                            <td width="33%">
                                <b>Yogyakarta, {{date('d-m-Y', strtotime($dataReport->tglregistrasi))}}</b>
                            </td>
                        </tr>
                        <tr>
                            <td width="33%" style="text-align: center"> </td>
                            <td width="33%"></td>
                            <td width="33%">
                                <b>Dokter Penanggung Jawab Pasien</b>
                            </td>
                        </tr>
                        <tr>
                            <td width="33%" >
                                <!-- <div style="text-align: center" id="qrPasien"></div> -->
                            </td>
                            <td width="33%"></td>
                            <td width="33%" style="text-align: center">
                                <div style="text-align: center" id="qrDokter"></div>
                            </td>
                        </tr>
                        <tr>
                            <td width="33%"></td>
                            <td width="33%"></td>
                            <td height="50px" width="33%" style="text-align: center"> {{$dataReport->namalengkap}}</td>
                        </tr>
                        
                      
                    </tbody>
                </table>
            </div>
            
        </section>
        {{-- <p
            style="font-size:10px;color: rgb(173, 173, 173); position: absolute; bottom: 0; left: 3%; width: 50%; text-align: center;">
            <i>Dokumen ini ditandatangani secara elektronik menggunakan sertifikat elektronik
                yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE) Badan Siber dan Sandi Negara</i></p>
         --}}
    </body>
<script type="text/javascript">
var baseUrl =
        {!! json_encode(url('/')) !!}
        $(function () {
            'use strict';
        $('#qrDokter').qrcode({
            text: baseUrl + '/service/medifirst2000/report/cetak-dokter?reg=' + {{ $dataReport->noregistrasi }}+'&cetakan=RINGKASAN RAWAT JALAN' ,
            height: 75,
            width: 75
        });
        window.print();

        })

        
</script>
</html>

