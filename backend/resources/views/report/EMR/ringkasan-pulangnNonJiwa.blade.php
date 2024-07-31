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
    <title>RINGKASAN PULANG NON JIWA</title>
    <style>
        @page {
            size: A4;
            margin: 5mm;
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

        .footer3 {
            text-align: center;
            position: absolute;
            left: 1%;
            bottom: 15mm;
            right: 1%;
        }

        #footer {
            height: 30px;
        }
        
        #page {
            height: calc(100vh - 30px); //viewport height - footer height
        }
      
    </style>
</head>

<body class="A4" style="font-family:Tahoma;height: auto" >
    <section id="page" style="font-family:Arial;padding:5mm 5mm 5mm 5mm;page-break-after: page;">
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
                    <th colspan="3" style="text-decoration:underline;">RINGKASAN PULANG NON JIWA</th>

                </tr>
                <tr>
                    <th colspan="3" >DISCHARGE SUMMARY</th>

                </tr>
             
              

        </table>
        <table  cellspacing="0" cellpadding="0"  width="100%" style="padding: 3px; ">
            <tr >
                <td style="font-size: 8pt;padding-left:5px;"> 
                    <font style="font-size: 9px; font-weight: 400;">
                    Tanggal Masuk :
                    </font>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008000 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        Tanggal Pulang :
                    </font>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008001 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;"> 
                    <font style="font-size: 9px; font-weight: 400;">
                    Wisma :
                    </font>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008002 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        Kelas :
                    </font>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008003 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                <font style="font-size: 9px; font-weight: 400;">
                        1. Indikasi pasien dirawat inap/diagnosis masuk :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008004 && !empty($item->value))
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
                    2. Pemeriksaan fisik yang penting :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008005 && !empty($item->value))
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
                    3. Riwayat kesehatan :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008006 && !empty($item->value))
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
                        4. Alergi :
                    </font>
                    <br>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008007' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008007]"/>Tidak
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008008' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008008]"/>Ya,Sebutkan:
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 30008009 && !empty($item->value))
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
                    5. Hasil pemeriksaan diagnostik / penunjang yang mendukung diagnosis:
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008010 && !empty($item->value))
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
                    6. Diagnosis
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                    a. Diagnosis Utama
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008011 && !empty($item->value))
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
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        b. Diagnosis Sekunder
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008012 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                <font style="font-size: 9px; font-weight: 400;">
                7. Tindakan diagnostik dan prosedur terapi :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008013 && !empty($item->value))
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
                        8. Pemberian obat selama perawatan :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;
                    <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008014 && !empty($item->value))
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
                    9. Instruksi tindak lanjut :
                    </font>
                    <br>
                    <font style="font-size: 9px; font-weight: 400;">
                        a. Pemberian obat waktu pulang :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008015 && !empty($item->value))
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
                        Edukasi waktu pulang :
                    </font>
                    <br>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008016' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008016]"/>Perawatan di rumah:
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 30008017 && !empty($item->value))
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
                    <br>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008018' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008019]"/>
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 30008019 && !empty($item->value))
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
                        10. Keadaan keluar :
                    </font>
                    <br>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008020' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008020]"/>Perbaikan
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008021' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008021]"/>Sembuh
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008022' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008022]"/>Pulang
                    </font>
                </td>
        
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                
                    <font style="font-size: 9px; font-weight: 400;">
                        11. Cara keluar :
                    </font>
                    <br>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008023' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008023]"/>Atas persetujuan dokter
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008024' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008024]"/>Rujuk:
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 30008025 && !empty($item->value))
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
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008026' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008026]"/>Atas permintaan sendiri
                    </font>
                    <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                        <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == '30008027' && $item->value == 1)
                        checked
                        @endif
                        @endforeach
                        ng-model="item.obj[30008027]"/>Lain - lain:
                        <font style="font-size: 9px; ">
                            @php
                            $found = false;
                            @endphp
                            @foreach ($res['d'] as $item)
                            @if ($item->emrdfk == 30008028 && !empty($item->value))
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
                        Saya telah menerima informasi tersebut di atas dan menyetujui bahwa Ringkasan Pulang ini hanya dapat digunakan
                        untuk kepentingan pengobatan, serta TIDAK DAPAT digunakan untuk kepentingan lainnya
                    </font>
                </td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td width="35%" style="font-size: 8pt;padding-left:5px;" colspan="3">
                    <font style="font-size: 9px; font-weight: 400;">
                        Yogyakarta, @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 30008029 && !empty($item->value))
                        {!! $item->value !!}
                        @break
                        @endif
                        @endforeach
                    </font>
                </td>
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;text-align: center;">
                    <font style="font-size: 9px; font-weight: 400;">
                        Penerima Informasi
                    </font>
                </td>
                <td style="font-size: 8pt;padding-left:5px;text-align: center;">
                    <font style="font-size: 9px; font-weight: 400;">
                        Pemberi Informasi
                    </font>
                </td>
                <td></td>
                <td width="35%"  style="font-size: 8pt;padding-left:5px;" colspan="3">
                    <font style="font-size: 9px; font-weight: 400;">
                        Dokter Penanggung Jawab Pasien
                    </font>
                </td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td height="60px"> </td>
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;text-align: center;">
                    <font style="font-size: 9px; font-weight: 400;">
                        (   @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 30008030 && !empty($item->value))
                                    {!! $item->value !!}
                                    @break
                                    @endif
                                    @endforeach
                                    {{-- {{isset($item[3018854]) ? $item[3018854]:''}} --}}
                                )
                    </font>
                </td>
                <td style="font-size: 8pt;padding-left:5px;text-align: center;">
                    <font style="font-size: 9px; font-weight: 400;">
                        (  @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 30008031 && !empty($item->value))
                                    {!! $item->value !!}
                                    @break
                                    @endif
                                    @endforeach
                                    {{-- {{isset($item[3018854]) ? $item[3018854]:''}} --}}
                                )
                    </font>
                </td>
                <td></td>
                <td width="35%"  style="font-size: 8pt;padding-left:10px;" colspan="3">
                    <font style="font-size: 9px; font-weight: 400;">
                        ( @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 30008032 && !empty($item->value))
                                    {!! $item->split !!}
                                    @break
                                    @endif
                                    @endforeach
                                    {{-- {{isset($item[3018854]) ? $item[3018854]:''}} --}}
                                )
                    </font>
                </td>
            </tr> 
        </table>
    </section>
    
    <div id="footer" class="footer3">
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
</body>

</html>