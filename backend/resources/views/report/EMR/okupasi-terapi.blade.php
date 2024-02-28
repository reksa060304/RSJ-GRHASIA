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
    <title>PENGKAJIAN PASIEN / KLIEN OKUPASI TERAPI</title>
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
                    <th colspan="3">PENGKAJIAN PASIEN / KLIEN OKUPASI TERAPI</th>

                </tr>
                

        </table>

        <table cellspacing="0" cellpadding="0" rules="none" width="100%" style="border: 1px solid #000;padding: 3px; ">

            <tr >
                <br>
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;border-bottom: 1px solid #000;" colspan="3"> Mulai Pemeriksaan:
                    {{isset($item[3018670]) ?$item[3018670] : ""  }}
               
                   
                </td>

            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> <font style="font-weight: bold; font-size: 10px;">A. Anamnese</font>
                <br> 
                &nbsp;&nbsp;&nbsp;&nbsp;<font style="font-weight: bold; font-size: 10px;">Activity Daily Living</font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        1. Makan dan Minum
                    </font>
                    
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Persiapan / mengambil alat makan sendiri :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018771 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Mengambil makanan dan minuman :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018772 && !empty($item->value))
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
                        2. Ketrampilan berpakaian
                    </font>
                    
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Mengambil baju sendiri :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018774 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Memakai baju sendiri :
                    </font>
                    <br>
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Baju berkancing :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018776 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Kaos :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018777 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Baju beresleting :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018778 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Rok :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018779 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Celana :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018780 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Kaos Kaki :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018781 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Sepatu :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018782 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Sandal :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018783 && !empty($item->value))
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
                        3. Hygiene
                    </font>
                    
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Membersihkan diri setelah BAK :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018785 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Membersihkan diri setelah BAB :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018786 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Mandi :
                    </font>
                    <br>
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Gosok gigi :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018788 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Pakai sabun :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018789 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Pakai shampo :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018790 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Pakai handuk :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018791 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
                &nbsp;&nbsp;&nbsp;&nbsp;<font style="font-weight: bold; font-size: 10px;">Kognitif</font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        1. Atensi dan konsentrasi
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018793 && !empty($item->value))
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
                        2. Motivasi
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018794 && !empty($item->value))
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
                        3. Pemahaman instruksi
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018795 && !empty($item->value))
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
                        4. Identifikasi
                    </font>
                    <br>
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Orang sekitar
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018797 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Benda sekitar :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018798 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Hari :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018799 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Bulan :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018800 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Rumah / alamat :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018801 && !empty($item->value))
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
                        5. Orientasi :
                    </font>
                    <br>
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Waktu :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018803 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Tempat :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018804 && !empty($item->value))
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
                        6. Pemecahan Masalah :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018805 && !empty($item->value))
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
                        7. Memory :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018807 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
                &nbsp;&nbsp;&nbsp;&nbsp;<font style="font-weight: bold; font-size: 10px;">Pre-akademik</font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                     <font style="font-size: 9px; font-weight: 400;">
                        1. Konsep warna :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018809 && !empty($item->value))
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
                        2. Konsep bentuk :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018810 && !empty($item->value))
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
                        3. Konsep angka :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018811 && !empty($item->value))
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
                        4. Konsep huruf :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018812 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
                &nbsp;&nbsp;&nbsp;&nbsp;<font style="font-weight: bold; font-size: 10px;">Emosi dan Perilaku</font>
                <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018814 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
                &nbsp;&nbsp;&nbsp;&nbsp;<font style="font-weight: bold; font-size: 10px;">Komunikasi Interaksi</font>
                
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    <font style="font-size: 9px; font-weight: 400;">
                        1. Keluarga :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018816 && !empty($item->value))
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
                        2. Sekolah :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018817 && !empty($item->value))
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
                        3. Teman :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018818 && !empty($item->value))
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
                        4. Guru :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018819 && !empty($item->value))
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
                        5. Lingkungan rumah :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018820 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3">
                &nbsp;&nbsp;&nbsp;&nbsp;<font style="font-weight: bold; font-size: 10px;">Senso-motorik</font>
                
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                   
                    <font style="font-size: 9px; font-weight: 400;">
                        1. Motorik Kasar 
                    </font>
                    <br>
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Berdiri 1 kaki selama 6 detik :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018823 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Berjalan dengan tumit :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018824 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Berjalan dengan jari kaki :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018825 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Melompat 2 kaki :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018826 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Melompat 1 kaki :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018827 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Melompat zigzag :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018828 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Melempar bola ke atas :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018829 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Menendang bola :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018830 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Naik bola :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018831 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Naik tangga :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018832 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Lari :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018833 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Berjalan mundur :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018834 && !empty($item->value))
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
                        2. Motorik Halus 
                    </font>
                    <br>
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Mencotoh :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018836 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Menggambar orang :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018837 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Memilih garis lebih panjang :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018838 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Menggoyangkan ibu jari :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018839 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Menara 2 kubus :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018840 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Menara 4 kubus :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018841 && !empty($item->value))
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
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        • Menara 6 kubus :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018842 && !empty($item->value))
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
                        3. Tonus Otot :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018843 && !empty($item->value))
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
                        4. Kontrol Postural Keseimbangan :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018844 && !empty($item->value))
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
                        5. Perencanaan Gerak / Praksis :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018845 && !empty($item->value))
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
                        6. Sensori Taktil :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018846 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> 
                    <font style="font-weight: bold; font-size: 10px;">B. Pemeriksaan Fisik</font>
                    <table cellspacing="0" cellpadding="0" rules="none" width="30%" style="border: 0.5px solid #000">
                        <tr>
                            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                               <b><u>Kemampuan Fungsional</u></b> 
                                <br>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018695' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018695]"/>1. Tidur/ 
                                </font>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018696' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018696]"/>bedrest /
                                </font>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018697' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018697]"/>gendong
                                </font>
                                
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                                <font style="font-size: 9px; font-weight: 400;">
                                    2. Jalan Sendiri :
                                </font>
                                <br>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018699' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018699]"/>Ya
                                </font>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018700' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018700]"/>Tidak
                                </font>
                                
                                
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                                <font style="font-size: 9px; font-weight: 400;">
                                    3. Kursi Roda :
                                </font>
                                <br>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018702' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018702]"/>Ya
                                </font>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018703' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018703]"/>Tidak
                                </font>
                                
                                
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                                <font style="font-size: 9px; font-weight: 400;">
                                    4. Alat Bantu :
                                </font>
                                <br>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018705' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018705]"/>Ya
                                </font>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018706' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018706]"/>Tidak
                                </font>
                                
                                
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                                <font style="font-size: 9px; font-weight: 400;">
                                    5. Prothese :
                                </font>
                                <br>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018708' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018708]"/>Ya
                                </font>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018709' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018709]"/>Tidak
                                </font>
                                
                                
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                                <font style="font-size: 9px; font-weight: 400;">
                                    6. Deformitas :
                                </font>
                                <br>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018711' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018711]"/>Ya
                                </font>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018712' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018712]"/>Tidak
                                </font>
                                
                                
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-size: 8pt;padding-left:5px;">
                                <font style="font-size: 9px; font-weight: 400;">
                                    7. Risiko Jatuh :
                                </font>
                                <br>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018715' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018715]"/>Ya
                                </font>
                                <font style="font-size: 9px;  margin-top: -3px" align="center" color="#000000">
                                    <input type="checkbox" style="transform: scale(0.8); margin-top:6.5px; !important;" @foreach ($res['d'] as $item)
                                        @if ($item->emrdfk == '3018716' && $item->value == 1)
                                    checked
                                    @endif
                                    @endforeach
                                    ng-model="item.obj[3018716]"/>Tidak
                                </font>
                                
                                
                            </td>
                        </tr>
                    </table>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> 
                    <font style="font-weight: bold; font-size: 10px;">C. Diagnosis Okupasi Terapi :</font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018848 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> 
                    <font style="font-weight: bold; font-size: 10px;">D. Program / Rencana Terapi :</font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018850 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> 
                    <font style="font-weight: bold; font-size: 10px;">E. Evaluasi :</font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018852 && !empty($item->value))
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
    
                <td style="font-size: 8pt;padding-top:12px;" colspan="2">
                    <table width="100%">
                        <tbody style="text-align: center">
                            <tr>
                                <td width="25%" style="text-align: center"></td>
                                <td width="25%"></td>
                                <td width="50%">
                                    Tanggal, @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 3018853 && !empty($item->value))
                                    {!! $item->value !!}
                                    @break
                                    @endif
                                    @endforeach
                                </td>
                            </tr>
                            <tr>
                                <td width="33%" style="text-align: center"></td>
                                <td width="33%"></td>
                                <td width="33%">
                                    Okupasi Terapis
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td height="60px"> </td>
                            </tr>
                            <tr>
                                <td style="text-align: center"></td>
                                <td style="text-align: center">&nbsp;</td>
                                <td width="33%">
                                    @foreach ($res['d'] as $item)
                                    @if ($item->emrdfk == 3018854 && !empty($item->value))
                                    {!! $item->split !!}
                                    @break
                                    @endif
                                    @endforeach
                                    {{-- {{isset($item[3018854]) ? $item[3018854]:''}} --}}
                                    
                                </td>
                            </tr>
                          
                        </tbody>
                    </table>
                </td>
                </tr>
       
        </table>
       
       
     
    </section>
  
</body>

</html>