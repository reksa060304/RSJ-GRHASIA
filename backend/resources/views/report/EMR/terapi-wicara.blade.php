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
    <title>PENGKAJIAN PASIEN / KLIEN TERAPI WICARA</title>
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
                    <th colspan="3">PENGKAJIAN PASIEN / KLIEN TERAPI WICARA</th>

                </tr>
                

        </table>

        <table cellspacing="0" cellpadding="0" rules="none" width="100%" style="border: 1px solid #000;padding: 3px; ">
            <tr >
                <br>
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;border-bottom: 1px solid #000;" colspan="3"> Mulai Pemeriksaan:
                    {{isset($item[3018900]) ?$item[3018900] : ""  }}
               
                   
                </td>

            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> <font style="font-weight: bold; font-size: 10px;">A. Informasi Umum</font>
               
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Nama anak :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {!! $res['d'][0]->namapasien !!}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Tanggal lahir :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {!! $res['d'][0]->tgllahir !!}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Alamat :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {!! $res['d'][0]->alamatlengkap !!}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Apakah anak tinggal dengan orang tua ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {{-- {!! $res['d'][0]->alamatlengkap !!} --}}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Nama Ibu :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {!! $res['d'][0]->namaibu !!}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                       Umur :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {{-- {!! $res['d'][0]->namaibu !!} --}}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                       Pekerjaan :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {{-- {!! $res['d'][0]->namaibu !!} --}}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                      Telepon :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {{-- {!! $res['d'][0]->namaibu !!} --}}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Nama Ayah :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {!! $res['d'][0]->namaayah !!}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                       Umur :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {{-- {!! $res['d'][0]->namaibu !!} --}}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                       Pekerjaan :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {{-- {!! $res['d'][0]->namaibu !!} --}}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                      Telepon :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        {{-- {!! $res['d'][0]->namaibu !!} --}}
                    </font>
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Dirujuk oleh :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3018999 && !empty($item->value))
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
                        Diagnosa Medis :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019000 && !empty($item->value))
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
                        Saudara ( Nama dan Usia ) :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019001 && !empty($item->value))
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
                        Bahasa yang digunakan sehari - hari? Bahasa utama yang digunakan ? 
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019002 && !empty($item->value))
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
                        Dengan siapa anak menghabiskan waktunya di rumah ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019003 && !empty($item->value))
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
                        Ceritakan masalah bahasa bicara anak ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019004 && !empty($item->value))
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
                        Bagaimana biasanya anak berkomunikasi ( gerak tubuh, kata, frase, kalimat ) ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019005 && !empty($item->value))
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
                        Kapan masalah bahasa dan bicara pertama kali diketahui ? Oleh siapa ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019006 && !empty($item->value))
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
                        Apakah penyebab utama dari gangguan tersebut ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019007 && !empty($item->value))
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
                        Apakah anak peduli dengan masalahnya ? Jika iya, bagaimana dia merasakannya ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019008 && !empty($item->value))
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
                        Apakah ada anggota keluarga yang mengalami gangguan bicara, bahasa dan pendengaran ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019009 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> <font style="font-weight: bold; font-size: 10px;">B. Riwayat Pre Natal dan Natal</font>
               
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Riwayat kehamilan dan kelahiran anak :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019011 && !empty($item->value))
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
                        Apakah ada kondisi yang tidak biasa yang mempengaruhi kehamilan dan kelahiran ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019012 && !empty($item->value))
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
                        Riwayat penyakit yang pernah dialami atau rawat inap yang pernah dilakukan ?
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019013 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> <font style="font-weight: bold; font-size: 10px;">C. Riwayat Perkembangan</font>
               
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Perkiraan usia anak
                    </font>
                    <br>
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Merangkak :
                    </font>
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019016 && !empty($item->value))
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
                       Duduk :
                    </font>
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019017 && !empty($item->value))
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
                        Berdiri :
                     </font>
                    <font style="font-size: 9px; ">
                         @php
                         $found = false;
                         @endphp
                         @foreach ($res['d'] as $item)
                         @if ($item->emrdfk == 3019018 && !empty($item->value))
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
                        Jalan :
                    </font>
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019019 && !empty($item->value))
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
                       Makan Sendiri :
                    </font>
                   <font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019020 && !empty($item->value))
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
                        Pakai Baju Sendiri :
                     </font>
                    <font style="font-size: 9px; ">
                         @php
                         $found = false;
                         @endphp
                         @foreach ($res['d'] as $item)
                         @if ($item->emrdfk == 3019021 && !empty($item->value))
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
                        Ketrampilan BAK dan BAB di kamar mandi / toilet training :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019022 && !empty($item->value))
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
                        Mengujarkan satu kata :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019023 && !empty($item->value))
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
                        Mengujarkan dua kata :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019024 && !empty($item->value))
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
                        Mengujarkan tiga kata / lebih (kalimat) :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019025 && !empty($item->value))
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
                        Mengujarkan pertanyaan sederhana :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019026 && !empty($item->value))
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
                        Percakapan / cerita :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019027 && !empty($item->value))
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
                <td style="font-size: 8pt;padding-left:5px;padding-top:12px;" colspan="3"> <font style="font-weight: bold; font-size: 10px;">D. Kondisi Oral</font>
               
                 </td>
          
            </tr>
            <tr>
                <td style="font-size: 8pt;padding-left:5px;" colspan="3"> 
                    &nbsp;&nbsp; <font style="font-size: 9px; font-weight: 400;">
                        Apakah ada celah ( bibir, langit-langit ) :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019029 && !empty($item->value))
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
                        Kemampuan mengunyah :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019030 && !empty($item->value))
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
                        Kemampuan meniup :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019031 && !empty($item->value))
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
                        Kemampuan menyedot :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019032 && !empty($item->value))
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
                        Apakah anak drooling :
                    </font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019033 && !empty($item->value))
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
                    <font style="font-weight: bold; font-size: 10px;">E. Kemampuan Mendengar</font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019035 && !empty($item->value))
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
                    <font style="font-weight: bold; font-size: 10px;">F. Diagnosa Terapi Wicara</font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019037 && !empty($item->value))
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
                    <font style="font-weight: bold; font-size: 10px;">G. Pemeriksaan Fisik</font>
                    <br>
                    &nbsp;&nbsp;&nbsp;<font style="font-size: 9px; ">
                        @php
                        $found = false;
                        @endphp
                        @foreach ($res['d'] as $item)
                        @if ($item->emrdfk == 3019039 && !empty($item->value))
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
                                @if ($item->emrdfk == 3019040 && !empty($item->value))
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
                                Terapis Wicara
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
                                @if ($item->emrdfk == 3019041 && !empty($item->value))
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