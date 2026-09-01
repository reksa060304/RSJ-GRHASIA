<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="css/report/paper.css">
    <link rel="stylesheet" href="css/report/table.css">
    <link rel="stylesheet" href="css/report/tabel.css">

    <link href="css/style.css" rel="stylesheet">
    <title>Pengkajian Awal Medis Rawat Jalan Jiwa</title>
    <style>
        @page {
            size: A4;
            margin-top: 5mm;
        }

        @page: first {
            size: A4
        }
        @media print{
            table {page-break-after: auto}
            tr {page-break-inside: avoid;}
            td{page-break-inside: avoid;}
            thead{display: table-header-group;
            }
            tfoot{display:table-footer-group;}
        }

        .double-border {
            border: 4px solid #000;
        }

        .double-border:before {
            border: 4px solid #fff;
        }

        .box {
            border: 2px solid black;
            /border-radius: 6px;/
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
        .underline {
        text-decoration: underline;
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
            /* left: 67%; */
            bottom: 0%;
            /* right: 3%; */
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

        body {
            font-family: 'Arial'
        }

        td {
            vertical-align: top
        }

        input[type="checkbox"] {
            vertical-align: middle;
            transform: scale(0.7);
            /* Mengurangi skala kotak centang */
            margin-right: 0px;
        }

        label {
            vertical-align: middle;
            line-height: 1;
            /* Tambahan gaya CSS lainnya */
        }

        div {
            display: inline-block;
            /* atau sesuaikan dengan kebutuhan desain Anda */
            vertical-align: middle;
            /* atau sesuaikan dengan kebutuhan desain Anda */
        }

        td {
            margin: 0;
            padding: 3px;
           
            /* Juga pastikan padding disetel ke nol jika Anda ingin menghilangkan padding */
        }
      
    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto" >
    <section style="font-family:Arial;padding:5mm 5mm 5mm 5mm;page-break-after: page;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
                <tr>
                    <td style="text-align: center;" width="15%">
                        <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 70px; margin: 0 !important;
                        padding: 0 !important;">
                        <br>
                        <span style="font-size: 7pt; font-weight: bold">RS JIWA GRHASIA</span>
                        <br>
                        <span style="font-size: 8px; font-weight: bold">Daerah Istimewa Yogyakarta</span>
                    </td>
                    <td style="text-align: center;vertical-align: top" width="50%">
                        <b>
                            <span style="font-size: 9pt;">{!! $res['profile']->baris1 !!}</span>
                            <br>
                            <span style="font-size: 10pt;">{!! $res['profile']->baris2 !!}</span>
                            <br>
                            <span style="font-size: 10pt;">{!! strtoupper($res['profile']->namalengkap) !!}</span>
                            <br>
                            <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 140px;">
                            <br>
                            <span style="font-size: 7pt; font-weight: normal">Jalan Kaliurang Km 17 Sleman, Telepon:
                                {!!$res['profile']->fixedphone!!}
                                <br style="margin: 0px">
                                Laman: {!!$res['profile']->website!!}, Surel: {!!$res['profile']->alamatemail!!}
                            </span>

                        </b>
                    </td>
                    {{-- @php 
                        @dd($res);
                        @endphp --}}
                    <td width="30%">
                        <div class="box" style="text-align: left">
                            <table style="padding: 1px;">
                                <tr>
                                    <td class="f-s-15  text-top" style="width: 40%">No. RM</td>
                                    <td class="f-s-15  text-top" style="width: 5%">:</td>
                                    <td class="f-s-15 text-top" style="width: 60%">{!! $res['d'][0]->nocm !!}</td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Nama</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top">{!! $res['d'][0]->namapasien !!}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Jenis Kelamin</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top">
                                        {!! $res['d'][0]->jeniskelamin !!}</td>
                                </tr>
                                <tr>
                                    <td class="f-s-15  text-top">Tgl Lahir</td>
                                    <td class="f-s-15  text-top">:</td>
                                    <td class="f-s-15  text-top">
                                        {!! date('d-m-Y',strtotime($res['d'][0]->tgllahir )) !!}</td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <th colspan="3">Pengkajian Awal Medis Rawat Jalan Jiwa</th>

                </tr>


        </table>

        <table cellspacing="0" cellpadding="0" rules="none" width="100%" style="border: 1.5px solid #000;padding: 3px; ">
            <tr >
                <br>
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        Mulai Pemeriksaan :
                    </font>
                  
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000001 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    
                 </td>
               

            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">ALLOANAMNESIS /
                    ANAMNESIS</td>
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;padding-top:5px;"> 
                <font style="font-size: 9px; font-weight: 400;">
                    A.Diperoleh dari :
                </font>
                <font style="font-size: 9px; ">
                    @php
                    $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                    @if ($item->emrdfk == 300000002 && !empty($item->value))
                    {!! $item->value !!}
                    @php
                    $found = true;
                    @endphp
                    @break
                    @endif
                    @endforeach
                    @if (!$found)
                    ................
                    @endif
                </font>
                
                </td>

                <td colspan="2" style="font-size: 8pt;padding-left:5px;padding-top:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        hubungan dengan penderita :
                    </font>
                   
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000003 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>

                </td>

            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;padding-top:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Riwayat Penyakit :
                    </font>
              
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 1. Keluhan Utama / Keluhan Saat Ini :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000004 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>


            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;padding-top:5px;">
                   
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 2. Sejak kapan terjadi perubahan tingkah laku / peningkatan gejala :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000005 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>


            </tr>

            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;padding-top:5px;">
                   
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 3. Gejala yang ditunjukkan :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000006 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>


            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 4. Riwayat Gangguan Jiwa Sebelumnya :
                    </font>
                   
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000007' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000007]"/>Pernah
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000007' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000008]"/>Tidak Pernah
                    </font>
                </td>

            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Pertama kali (kapan) :
                    </font>
                    <br>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000009 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
                <td colspan="2" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp;  - Pernah Sembuh :
                    </font>
                    <br>
                    <font style="font-size: 9px; " align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000011' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000011]"/>Ya
                    </font>
                    <font style="font-size: 9px;  " align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000012' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000012]"/>Tidak
                    </font>
                </td>
               
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Berapa kali :
                    </font>
                    <br>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000010 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
                <td colspan="2" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Berobat Jalan :
                    </font>
                    <br>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000013' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000013]"/>Teratur
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000014' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000014]"/>Tidak Teratur
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000015' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000015]"/>Tidak Pernah
                    </font>
                </td>
         
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 5. Riwayat penggunaan obat :
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Obat yang rutin dikonsumsi :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000093 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
                <td colspan="2" style="font-size: 8pt;padding-left:5px;">
                    
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Obat yang digunakan sekarang :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000094 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>

            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp;  6. Faktor yang mendahului :
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Organik :
                    </font>
                    
                  <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000016' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000016]"/>Panas
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000017' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000017]"/>Kejang
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000018' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000018]"/>Keracunan
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000019' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000019]"/>Radupaksa
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000020' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000020]"/>Herediter
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Spiritual :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000021 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Psikososial :
                    </font>
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000095 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Ekonomi :
                    </font>
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000022 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Lain - lain :
                    </font>
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000023 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
              
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp;  7. Riwayat gangguan jiwa dalam keluarga :
                    </font>
                    <br>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000024 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                   
                </td>
               
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp;   8. Silsilah Keluarga :
                    </font>
                    <br>
                    &nbsp;&nbsp; <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000025 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                   
                </td>
            
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp;   9. Riwayat pribadi :
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Kepribadian sebelum sakit :
                    </font>
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000026 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Pola asuh :
                    </font>
                  <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000027 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Pendidikan :
                       
                    </font>
                  <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000028 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Pekerjaan :
                    </font>
                  <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000029 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; - Perkawinan :
                    </font>
                  <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000030 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                
                    <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                        <font style="font-size: 9px; font-weight: 400;">
                            &nbsp;&nbsp;  10. Riwayat penyalahgunaan NAPZA :
                        </font>
                        <br>
                        &nbsp;&nbsp;<font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 300000031 && !empty($item->value))
                            {!! $item->value !!}
                            @php
                            $found = true;
                            @endphp
                            @break
                            @endif
                            @endforeach
                            @if (!$found)
                            ................
                            @endif
                        </font>
                       
                    </td>
                  
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 11. Riwayat alergi :
                    </font>
                    <br>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000032 && !empty($item->value))
                        {!! $item->value !!}
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                   
                </td>
    
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">PEMERIKSAAN FISIK
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        A. Vital Sign
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Tekanan Darah :
                    </font>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000033 && !empty($item->value))
                        {!! $item->value !!} mmHg
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                   
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Nadi :
                    </font>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000034 && !empty($item->value))
                        {!! $item->value !!} x/menit
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                   
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Suhu :
                    </font>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000035 && !empty($item->value))
                        {!! $item->value !!} &deg;C
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                   
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Respirasi :
                    </font>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000036 && !empty($item->value))
                        {!! $item->value !!} x/menit
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
                
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        B. Status Generalis dan Neurologis
                    </font>
                    <br>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000037 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
               
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">PEMERIKSAAN
                    PSIKIATRIK</td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 1. Kesan umum :
                    </font>
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000038 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
               
            </tr>
            <tr>
                <td  style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 2. Kesadaran :
                    </font>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; a. Kuantitatif :
                    </font>
                 
                    
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000039 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    
                </td>
                <td colspan="2" style="font-size: 8pt;padding-left:5px;">
                    
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; b. Kualitatif :
                    </font>
                    
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000040 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
               
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 3. Orientasi :
                    </font>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Waktu :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000041 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Tempat :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000042 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Orang :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000043 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Situasi :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000044 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
                
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 4. Sikap dan tingkah laku :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000045 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 5. Proses pikir :
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; a. Bentuk pikir :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000046 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                   
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; b. Isi pikir :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000047 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                <td  style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; c. Progresi pikir :
                    </font>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; a. Kuantitatif :
                    </font>
                 
                    
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000048 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                    
                </td>
                <td colspan="2" style="font-size: 8pt;padding-left:5px;">
                    
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; b. Kualitatif :
                    </font>
                    
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000049 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
               
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 6. Mood :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000050 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 7. Afek :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000051 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 8. Gangguan persepsi :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000052 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 9. Gangguan memori :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000053 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 10. Gangguan Intelegensi :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000054 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 11. Perhatian :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000055 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; Hubungan jiwa : 
                    </font>
                   
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000056' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000056]"/>Sukar
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '300000057' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[300000057]"/>Mudah
                    </font>
                </td>

            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; 12. Insight :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000058 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">PEMERIKSAAN PENUNJANG</td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000059 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; "> DIAGNOSIS</td>

            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; a. Axis I :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000060 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; b. Axis II :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000061 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; c. Axis III :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000062 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; d. Axis IV :
                    </font>
                    
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000063 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                <td  style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; d. Axis V :
                    </font>
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; a. GAF scale saat ini :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000064 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
                <td colspan="2" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px; font-weight: 400;">
                        &nbsp;&nbsp; b. GAF scale 1 tahun terakhir :
                    </font>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000065 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">MASALAH KEPERAWATAN</td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                   <br>
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 300000096 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">PENATALAKSANAAN</td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                <br>
                <font style="font-size: 9px; ">
                    @php
                    $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                    @if ($item->emrdfk == 300000066 && !empty($item->value))
                    {!! $item->value !!} 
                    @php
                    $found = true;
                    @endphp
                    @break
                    @endif
                    @endforeach
                    @if (!$found)
                    ................
                    @endif
                </font>
            </td>
            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;font-weight:bold;text-decoration:underline;padding-left:5px;">
                    <br>
                    <u>INTEGRASI ASUHAN</u>
                    
                    
                </td> 

            </tr>
          <tr>
            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == '300000070' && $item->value == 1)
                    checked
                    @endif
                    @endforeach
                    ng-model="item.obj[300000070]"/>Dokter :
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 1901300429 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </font>
                <br>
                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == '300000071' && $item->value == 1)
                    checked
                    @endif
                    @endforeach
                    ng-model="item.obj[300000071]"/>Perawat :
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 1901300430 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </font>
                <br>
                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == '300000072' && $item->value == 1)
                    checked
                    @endif
                    @endforeach
                    ng-model="item.obj[300000072]"/>PPA lain :
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 1901300431 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </font>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                <font style="font-size: 9px; font-weight: 400;">
                    &nbsp;&nbsp; Catatan / Notasi DPJP :
                </font>
                <font style="font-size: 9px; ">
                    @php
                    $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                    @if ($item->emrdfk == 300000073 && !empty($item->value))
                    {!! $item->value !!} 
                    @php
                    $found = true;
                    @endphp
                    @break
                    @endif
                    @endforeach
                    @if (!$found)
                    ................
                    @endif
                </font>
            </td>
          </tr>
          <tr>
            <td></td>
            <td colspan="2" style="font-size: 8pt;padding-left:5px;">
                <font style="font-size: 9px; font-weight: 400;">
                   Paraf DPJP :
                </font>
                
                <br>
             
                &nbsp;&nbsp;<font style="font-size: 9px; ">
                    @php
                    $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                    @if ($item->emrdfk == 300000080 && !empty($item->value))
                    {!! $item->split !!} 
                    @php
                    $found = true;
                    @endphp
                    @break
                    @endif
                    @endforeach
                    @if (!$found)
                    ................
                    @endif
                </font>

            </td>
        </tr>
        <tr>
            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                <font style="font-size: 9px; font-weight: 400;">
                    &nbsp;&nbsp;  Keadaan Waktu Keluar :
                </font>
                <font style="font-size: 9px; ">
                    @php
                    $found = false;
                    @endphp
                    @foreach ($res['d'] as $item)
                    @if ($item->emrdfk == 300000082 && !empty($item->value))
                    {!! $item->value !!} 
                    @php
                    $found = true;
                    @endphp
                    @break
                    @endif
                    @endforeach
                    @if (!$found)
                    ................
                    @endif
                </font>
            </td>
          </tr>
          <tr>
            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                <font style="font-size: 9px; font-weight: 400;">
                    Penjelasan hasil pengkajian, pemeriksaan fisik dan penunjang, diagnosis, rencana asuhan dan terapi, dijelaskan kepada :
                </font>
                
                <br>
                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == '300000067' && $item->value == 1)
                    checked
                    @endif
                    @endforeach
                    ng-model="item.obj[300000067]"/>Pasien
                </font>
                <br>
                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == '300000068' && $item->value == 1)
                    checked
                    @endif
                    @endforeach
                    ng-model="item.obj[300000068]"/>Keluarga Pasien,nama dan hubungan dengan pasien:
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 1901300427 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </font>
          
            <br>
                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == '300000069' && $item->value == 1)
                    checked
                    @endif
                    @endforeach
                    ng-model="item.obj[300000069]"/>Tidak dapat memberi edukasi kepada pasien / keluarga karena :
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 1901300428 && !empty($item->value))
                        {!! $item->value !!} 
                        @php
                        $found = true;
                        @endphp
                        @break
                        @endif
                        @endforeach
                        @if (!$found)
                        ................
                        @endif
                    </font>
                </font>
            </td>
          </tr>
          <tr>
            <td style="padding: 0px;" colspan="3">
                <table cellspacing="0" cellpadding="0" width="100%" style="border-top: 1.5px solid #000">
                    <tr>
                        <td  style="font-size: 8pt;">
                            <u>RENCANA PEMULANGAN PASIEN</u>
                            <br>
                            <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == '300000074' && $item->value == 1)
                                checked
                                @endif
                                @endforeach
                                ng-model="item.obj[300000074]"/>Pulang, konsultasi selesai
                            </font>
                            <br>
                            <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == '300000075' && $item->value == 1)
                                checked
                                @endif
                                @endforeach
                                ng-model="item.obj[300000075]"/>Pulang, kontrol ulang:
                                <font style="font-size: 9px; ">
                                    @php
                                    $found = false;
                                    @endphp
                                    @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 1901300433 && !empty($item->value))
                                    {!! $item->value !!} hari
                                    @php
                                    $found = true;
                                    @endphp
                                    @break
                                    @endif
                                    @endforeach
                                    @if (!$found)
                                    ................
                                    @endif
                                </font>
                            </font>
                            <br>
                            <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == '300000076' && $item->value == 1)
                                checked
                                @endif
                                @endforeach
                                ng-model="item.obj[300000076]"/>Rujuk ke :
                                <font style="font-size: 9px; ">
                                    @php
                                    $found = false;
                                    @endphp
                                    @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 1901300434 && !empty($item->value))
                                    {!! $item->value !!} hari
                                    @php
                                    $found = true;
                                    @endphp
                                    @break
                                    @endif
                                    @endforeach
                                    @if (!$found)
                                    ................
                                    @endif
                                </font>
                            </font>
                                <br>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '300000077' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[300000077]"/>
                                    <font style="font-size: 9px; ">
                                        @php
                                        $found = false;
                                        @endphp
                                        @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == 1901300435 && !empty($item->value))
                                        {!! $item->value !!} hari
                                        @php
                                        $found = true;
                                        @endphp
                                        @break
                                        @endif
                                        @endforeach
                                        @if (!$found)
                                        ................
                                        @endif
                                    </font>
                                </font>
                       
                        </td>
                        <td colspan="2" style="font-size: 8pt;border-left: 1.5px solid #000;">
        
                            
                            <table style="width:100%">
                                <tr>
                                  <td colspan="2" style="text-align:left;">Selesai pemeriksaan, Tanggal :
                                    @php
                                    $found = false;
                                    @endphp
                                    @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 300000081 && !empty($item->value))
                                    {!! $item->value !!} 
                                    @php
                                    $found = true;
                                    @endphp
                                    @break
                                    @endif
                                    @endforeach
                                    @if (!$found)
                                    ................
                                    @endif
                                </font>
                            </td>
                            <font style="font-size: 9px; ">
                                </tr>
                                <tr>
                                  <td style="text-align:center;">Penanggung Jawab Pasien</td>
                                  <td style="text-align:center;">Dokter Pemeriksa/DPJP</td>
                                 
                                </tr>
                                <tr >
                                    <td style="height:60px"></td>
                                    <td style="height:60px"></td>
                                   
                                  </tr>
                                <tr >
                                  <td style="text-align:center;">( 
                                    @php
                                    $found = false;
                                    @endphp
                                    @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 300000078 && !empty($item->value))
                                    {!! $item->value !!}
                                    @php
                                    $found = true;
                                    @endphp
                                    @break
                                    @endif
                                    @endforeach
                                   
                                   )</td>
                                  <td style="text-align:center;">( 
                                    @php
                                    $found = false;
                                    @endphp
                                    @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 300000079 && !empty($item->value))
                                    {!! $item->split !!}
                                    @php
                                    $found = true;
                                    @endphp
                                    @break
                                    @endif
                                    @endforeach
                                   
                                   )</td>
                                 
                                </tr>
                              </table>
                            
                           
                            
                            
        
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        </table>
       
        </td>

        </tr>

        </div>
        
    </section>

</body>

</html>