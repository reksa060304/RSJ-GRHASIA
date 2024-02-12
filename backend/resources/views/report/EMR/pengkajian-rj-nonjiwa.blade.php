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
    <title>PENGKAJIAN AWAL MEDIS RAWAT JALAN NON JIWA</title>
    <style>
        @page {
            size: A4;
            margin-top: 5mm;
        }

        @page: first {
            size:A4
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
               

        </table>

        <table cellspacing="0" cellpadding="0" rules="none" width="100%" style="border: 1px solid #000;padding: 3px; ">
            <tr>
                <th colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-bottom:1px solid #000; text-align:center;padding-left:5px; font-weight:bold; ">PENGKAJIAN AWAL MEDIS RAWAT JALAN NON JIWA</th>

            </tr>
            <tr >
               
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> Mulai Pemeriksaan:
                    {{isset($item[3017300]) ?$item[3017300] : ""  }}
                   
                </td>

            </tr>
            <tr>
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">A. ANAMNESIS
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        1. Keluhan Utama / Keluhan Saat Ini :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017302 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        2. Riwayat Penyakit Sekarang :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017303 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        3. Riwayat Penyakit Dahulu : 
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017304 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        4. Riwayat Penyakit Keluarga : 
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017305 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        5. Riwayat Alergi : 
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017306 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;" > 
                    <font style="font-size: 9px; font-weight: 400;">
                        6. Riwayat Penggunaan Obat :
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        - Obat yang rutin dikonsumsi :
                    </font>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017308 && !empty($item->value))
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
                 <td style="font-size: 8pt;padding-left:5px;" colspan="2" > 
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        - Obat yang digunakan sekarang :
                    </font>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017309 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        7. Pengaruh Faktor Psikososial Spiritual dan Ekonomi :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017310 && !empty($item->value))
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
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">B. PEMERIKSAAN
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        1. Pemeriksaan Fisik :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017312 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        2. Pemeriksaan Penunjang :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017313 && !empty($item->value))
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
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">C. DIAGNOSIS
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017314 && !empty($item->value))
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
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">D. DIAGNOSIS KEPERAWATAN
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017315 && !empty($item->value))
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
                <td colspan="3" style="background-color: #a5a2a2;font-size: 9pt; border-top:1px solid #000; border-bottom:1px solid #000;text-align:left;padding-left:5px;font-weight:bold; ">E. PENATALAKSANAAN
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017316 && !empty($item->value))
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
                  
                    <u>INTEGRASI ASUHAN</u>

                </td> 

            </tr>
            <tr>
                <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '3017237' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[3017237]"/>Dokter :
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 3017319 && !empty($item->value))
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
                            @if ($item->emrdfk == '3017239' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[3017239]"/>Perawat :
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 3017321 && !empty($item->value))
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
                            @if ($item->emrdfk == '3017241' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[3017241]"/>PPA lain :
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 3017323 && !empty($item->value))
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
                
                   
                    <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                        <font style="font-size: 9px; font-weight: 400;">
                            Catatan / Notasi DPJP :
                        </font>
                        <br>
                        &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 3017324 && !empty($item->value))
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
                   
                    Paraf DPJP :
                    <br>
                    &nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017325 && !empty($item->value))
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
                   
                    Keadaan Waktu Keluar :
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3017326 && !empty($item->value))
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
                    Penjelasan hasil pengkajian, pemeriksaan fisik dan penunjang, diagnosis, rencana asuhan dan terapi, dijelaskan kepada :
                    <br>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '3017328' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[3017328]"/>Pasien 
                    </font>
                    <br>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '3017329' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[3017329]"/>Keluarga pasien,Nama : 
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 3017330 && !empty($item->value))
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
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        Hubungan dengan Pasien : 
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 3017331 && !empty($item->value))
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
                            @if ($item->emrdfk == '3017332' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[3017332]"/>Lain-Lain
                    </font>
                    
                    
                   
                    
                    

                </td>
            </tr>
            <tr>
                <td style="padding: 0px;" colspan="3">
                    <table cellspacing="0" cellpadding="0" width="100%" style="border-top: 1px solid #000">
                        <tr>
                            <td  style="font-size: 8pt;">
                                <u>RENCANA PEMULANGAN PASIEN</u>
                                <br>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3017336' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3017336]"/>Pulang, konsultasi selesai 
                                </font>
                               <br>
                               <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == '3017338' && $item->value == 1)
                                checked
                                @endif
                                @endforeach
                                ng-model="item.obj[3017338]"/>Pulang, kontrol ulang:  <font style="font-size: 9px; ">
                                    @php
                                    $found = false;
                                    @endphp
                                    @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 3017339 && !empty($item->value))
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
                                @if ($item->emrdfk == '3017340' && $item->value == 1)
                            checked
                            @endif
                            @endforeach
                            ng-model="item.obj[3017340]"/>Rujuk ke :
                            <font style="font-size: 9px; ">
                                    @php
                                    $found = false;
                                    @endphp
                                    @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 3017341 && !empty($item->value))
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
                    </font>
                    <br>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == '3017343' && $item->value == 1)
                    checked
                    @endif
                    @endforeach
                    ng-model="item.obj[3017343]"/>Lain-lain
                </font>
                            </td>
                            <td colspan="2" style="font-size: 8pt;border-left: 1px solid #000;">
            
                                
                                <table style="width:100%">
                                    <tr>
                                      <td colspan="2" style="text-align:left;">Selesai pemeriksaan, Tanggal :
                                        @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == 3017344 && !empty($item->value))
                                        {!! $item->value !!}
                                        @break
                                        @endif
                                        @endforeach</td>
                                     
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
                                      <td style="text-align:center;">
                                        (  @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == 3017345 && !empty($item->value))
                                        {!! $item->value !!}
                                        @break
                                        @endif
                                        @endforeach   )</td>
                                      <td style="text-align:center;">

                                        (  @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == 3017346 && !empty($item->value))
                                        {!! $item->split !!}
                                        @break
                                        @endif
                                        @endforeach )</td>
                                     
                                    </tr>
                                  </table>
                                
                               
                                
                                
            
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        
    </section>

</body>

</html>