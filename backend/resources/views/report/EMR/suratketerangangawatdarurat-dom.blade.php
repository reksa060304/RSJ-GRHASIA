{{-- @extends('report.dom') --}}
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">
    
<head>
    <meta charset="utf-8">
    <title>Surat Keterangan Gawat Darurat</title>
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
            size:A4
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
            text-align: center;
            position: absolute;
            bottom: 0;
            right: 5%;
        }
        footer {
            position: fixed;
            bottom: 0;
        }
        .footer3 {
            text-align: center;
            position: fixed;
            left: 1%;
            bottom: 10%;
            right: 1%;
        }
    </style>

</head>
<body>
        <section style="font-family:Arial;padding:10mm">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody>
                    <tr>
                        <td width="10%" style="padding: 5px">
                            {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
                                <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px; margin-bottom:10px">
                                <br>
                                <b >
                                    <span style="font-size: 10px;"> RUMAH SAKIT JIWA GRHASIA</span>

                                </b>
                            {{-- @else --}}
                                {{-- <img src="service/img/logo_only.png" alt="" style="width: 90px;"> --}}
                            {{-- @endif --}}
                        </td>
                        <td style="text-align: left">
                            <b>
                                <span style="font-size: 10px;">{!! $res['profile']->baris1 !!}</span>
                                <br>
                                <span style="font-size: 12px;">{!! $res['profile']->baris2 !!}</span>
                                <br>
                                <span style="font-size: 12px;">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                                <br>
                                <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 150px;">
                                <br>
                                <span style="font-size: 8px; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon: {!!$res['profile']->fixedphone!!}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                                </span>

                            </b>
                        </td>
                        <td width="20%" >
                            <div style="text-align: right">
                                <table>
                                    <tr>
                                        <td style="width: 100px;font-size: 13px; font-weight: bold"> 
                                            <br><br><br> <br><br><br></td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>
            <br>

            <table width="100%"  style="margin-top: 10px" cellspacing="0" cellpadding="0" 
                style="margin-left: 2px">
                <tr>
                    <th style="text-decoration: underline; font-size: 20px">SURAT KETERANGAN GAWAT DARURAT</th>
                </tr>
                <tr>
                    <th style=" font-size: 14px"><br><br> </th>
                </tr>
                <tr>
                    <td colspan="6" style="padding-left: 40px; padding-right: 40px; font-size: 13px" > Yang bertanda tangan di bawah ini dokter Rumah Sakit Jiwa Grhasia dengan ini menyatakan bahwa :
                    </td>
                </tr>
                <tr>
                    <td colspan="6" style="padding-left: 40px; padding-right: 40px" > <br>
                    </td>
                </tr>
                <tr>
                    <td>
                        <!-- <table border="1" width="{{$pageWidth}}" bgcolor="#FFFFFF"> -->
                        <table border="0" width="100%" bgcolor="#FFFFFF">
                            <tr>
                                <td width="80px" style="padding-left: 60px; font-size: 13px">Nama</td>
                                <td width="1px" style="font-size: 13px">:</td>
                                <td style="font-size: 13px">{{isset($item[190130801]) ? $item[190130801] : '' }}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 60px; font-size: 13px">Nomor Rekam Medis</td>
                                <td width="1" style="font-size: 13px">:</td>
                                <td width="250" style="font-size: 13px">{{isset($item[190130802]) ? $item[190130802] : '' }}</td>
                                
                            </tr>
                            <tr>
                                <td  style="padding-left: 60px; font-size: 13px">Umur</td>
                                <td width="1" style="font-size: 13px">:</td>
                                <td style="font-size: 13px">{{isset($item[190130804]) ? $item[190130804] : '' }}</td>
                            </tr>
                            <tr>
                                <td  style="padding-left: 60px; font-size: 13px">Jenis Kelamin</td>
                                <td width="1" style="font-size: 13px">:</td>
                                <td style="font-size: 13px">{{isset($item[190130803]) ? $item[190130803] : '' }}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 60px; font-size: 13px">Alamat</td>
                                <td width="1" style="font-size: 13px">:</td>
                                <td style="font-size: 13px">{{isset($item[190130805]) ? $item[190130805] : '' }}</td>
                            </tr>
                            <tr>
                                <td style="padding-left: 60px "></td>
                                <td width="1"></td>
                                <td ></td>
                            </tr>
                            <tr>
                                <td style="padding-left: 40px; padding-right: 40px" colspan="3"><br></td>
                            </tr>
                            <tr>
                                <td align="justify" style="padding-left: 40px; padding-right: 40px; font-size: 13px" colspan="3">
                                    Dinyatakan dalam keadaan gawat darurat dan telah diperiksa di Instalasi Gawat Darurat Rumah Sakit Jiwa Grhasia 
                                    pada tanggal {{isset($item[190130806]) ? $item[190130806] : ''}} dengan diagnosa {{isset($item[190130807]) ? $item[190130807] : '' }}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-left: 40px; padding-right: 40px" colspan="3"><br></td>
                            </tr>
                            <tr>
                                <td align="justify" style="padding-left: 40px; padding-right: 40px; font-size: 13px" colspan="3">Demikian surat keterangan ini dibuat hanya untuk kepentingan pembiayaan Rawat Inap di Rumah Sakit Jiwa Grhasia dan tidak dapat dipergunakan untuk kepentingan lain.</td>
                            </tr>
                            <tr>
                                <td colspan="3"><br></td>                           
                            </tr>
                            <tr>
                                <td colspan="3"><br></td>                           
                            </tr>
                        </table>
                        <table border="0" width="100%" bgcolor="#FFFFFF">
                            <tr>
                                <td width='100px'>&nbsp;</td>
                                <td width='100px'>&nbsp;</td>
                                <td width='150px' align="center" style="font-size: 13px">Yogyakarta, {{isset($item[190130808]) ? $item[190130808] : '' }}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td align="center" style="font-size: 13px">Dokter yang memeriksa</td>
                            </tr>

                            @if ($tte == 'true')
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td style="padding: 2em 0;">
                                        <p style="text-align: center; color:grey;font-family: 'Times New Roman', Times, serif;font-size: 16px;">
                                            Ditandatangani Secara 
                                            <br>Elektronik
                                        </p>    
                                    </td>
                                </tr>
                            @else
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td style="padding: 2em 0;"></td>
                                </tr>
                            @endif

                            <!-- <tr>
                                <td></td>
                                <td></td>
                                <td align="center" style="font-size: 13px">{{$item[190130809]}}</td>
                            </tr> -->
                            <tr>
                                <td style="text-align: center"></td>
                                <td style="text-align: center">&nbsp;</td>
                                <td style="text-align: center" style="font-size: 13px">
                                    {{-- <br>{!! $res['d'][0]->namadokter == null ? ($peg!=null?$peg->namalengkap:'-'): $res['d'][0]->namadokter !!} --}}
                                    <br>{!! isset($item[190130809]) ? $item[190130809] : ''  !!}
                                </td>
                            </tr>

                            <tr>
                                <td style="text-align: center"></td>
                                <td style="text-align: center">&nbsp;</td>
                                <td style="text-align: center">
                                    NIP/SIP :  
                                    @if (isset($peg->nip))
                                        {{ $peg->nip }}
                                    @else
                                        {{ (isset($sip->nosip)) ? $sip->nosip : '' }}
                                    @endif
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
            </table>
            <!-- <div class="footer2 ">
                <table>
                    <tbody>
                        <tr>
                            <td width="33%" style="text-align: center"> </td>
                            <td width="33%"></td>
                            <td width="33%" style="font-size: 13px">
                                Yogyakarta, {{$item[190130808]}} <br>Dokter yang memeriksa
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
                            <td style="text-align: center" style="font-size: 13px">
                                {{-- <br>{!! $res['d'][0]->namadokter == null ? ($peg!=null?$peg->namalengkap:'-'): $res['d'][0]->namadokter !!} --}}
                                <br>{!! $item[190130809] !!}
                            </td>
                        </tr>
                      
                    </tbody>
                </table>
            </div> -->
        </section>
        {{-- <p
            style="font-size:10px;color: rgb(173, 173, 173); position: absolute; bottom: 30%; left: 3%; width: 50%; text-align: center;">
            <i>Dokumen ini ditandatangani secara elektronik menggunakan sertifikat elektronik
                yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE) Badan Siber dan Sandi Negara</i></p> --}}
    @if ($tte == 'true')
        <div class="footer3">
            <table border="0">
                <tr>
                    <td style="width: 15%; text-align:center;">
                        <img src="img/bsre.png" alt="Logo" style="width: 50%; object-fit:contain; object-position:center; margin-bottom:10px;">
                    </td>
                    <td style="width: 15%; text-align: center;">
                        <p>$</p>
                    </td>
                    <td style="width: 70%;">
                        <p><i>Dokumen ini ditandatangani secara elektronik menggunakan sertifikat elektronik
                            yang diterbitkan oleh Balai Sertifikasi Elektronik (BSrE) Badan Siber dan Sandi Negara</i></p>
                    </td>
                </tr>
            </table>
        </div>
    @endif
    </body>
</html>

