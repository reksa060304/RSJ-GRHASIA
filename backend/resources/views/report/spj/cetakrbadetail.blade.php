<html>
<head>
    <title>
        Report
    </title>
        @if(stripos(\Request::url(), 'localhost') !== FALSE)
         <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        @else
         <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
        @endif

<!-- <style type="text/css" media="print">
   table thead1 
   {
    display: none;
   }
   table thead2 
   {
    display: table-header-group;
   }
</style> -->

</head>
<style>
    @page {
        margin: 10mm 5mm 35mm 17mm;
        /* top right bottom left */
        size: auto;
    }

    @page :first {
        margin: 10mm 5mm 35mm 17mm;
        size: auto;
    }

    @media print {
    body {
        margin: 0px;
        /* size: auto; */
    }
    }

    body {
        font-family: Arial;
    }

    table{
		font-family:'Arial';
		margin:0;
		padding:.1cm 0;
		font-size:11pt ;
	}	

    .tabel tr td{
        border: 1px solid black;
        page-break-inside: avoid;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }

    .tabels tr td{
        border: 0.5px solid black;
        page-break-inside: avoid;
    }

    .tabels {
        width: 100%;
        border-collapse: collapse;

    }

    .tabelss {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid black;
    }

    .tabelss tr td{
        page-break-inside: avoid;
    }

    textarea {
        border: none;
        outline: none;
        resize: none;
        font-family: Arial;
    }
</style>
<body>
<div>
    <table cellpadding="0" cellspacing="0"  border="0" class="tabel">
        <!-- <tbody > -->
            <tr>
                <td style="padding: 5px; width: 50px;">
                        <p align="center">
                                @if(stripos(\Request::url(), 'localhost') !== FALSE)
                                <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100%;height=60%;" >
                                @else
                                <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100%;height=60%;" >
                                @endif
                        
                        </p>
                </td>
                <td align="center" style="width: 300px;">
                    <b style="font-size: 25px;">
                        RENCANA BISNIS DAN ANGGARAN<br>
                        BADAN LAYANAN UMUM DAERAH<br>
                        {{ strtoupper($settingrba[0]->pengelolakeuanganblud) }}
                    </b>
                </td>
                <td align="center" style="width: 50;">
                    <b style="font-size: 25px;">
                        RBA
                    </b><br>
                    @if($sebelum != [])
                    {{$itahap[0]->tahap}}
                    @endif
                </td>
            </tr>
            <!-- <tr align="center">
                <td> -->
                    <!-- <b>RS JIWA GRHASIA<br>TAHUN {{ date('Y') }}</b> -->

                    <!-- <b>RS JIWA GRHASIA<br>TAHUN {{ $data[0]->tahun }}</b> -->

                    <!-- <b>{{ strtoupper($settingrba[0]->pengelolakeuanganblud) }}<br>TAHUN {{ $data[0]->tahun }}</b> -->
                    
                <!-- </td>
            </tr> -->
            <tr >
                <td colspan="3">
                    <p align="center" style="margin-top: 10px; margin-bottom:10px">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                <!-- <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ date('Y') }}</b> -->

                                <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ $data[0]->tahun }}</b>
                        </font>
                        <br>
                    </p>
                </td>
            </tr>
        <!-- </tbody> -->
    </table>

    <table cellpadding="0" cellspacing="0" border="0" class="tabelss">
        <!-- <tbody> -->
            <tr>
                <td colspan="3" style="padding-top: 15px;">
                    <tr style="margin-top: -10px;">
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                            Program 
                                    </font>
                            </p>
                        </td>
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                            : {{ $data[0]->kodeprogram.' - '.$data[0]->keteranganprogram }}
                                    </font>
                            </p>
                        </td>
                    </tr>
                    <tr style="margin-top: -10px;">
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                            Kegiatan 
                                    </font>
                            </p>
                        </td>
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                            : {{ $data[0]->kodekegiatan.' - '.$data[0]->keterangankegiatan }}
                                    </font>
                            </p>
                        </td>
                    </tr>
                    <tr style="margin-top: -10px;">
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                        Sub Kegiatan 
                                    </font>
                            </p>
                        </td>
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                            : {{ $data[0]->kodesubkegiatan.' - '.$data[0]->keterangansubkegiatan }}
                                    </font>
                            </p>
                        </td>
                    </tr>
                    <tr style="margin-top: -10px;">
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                        Sub Sub Kegiatan 
                                    </font>
                            </p>
                        </td>
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                            : {{ $data[0]->kodesubsubkegiatan.' - '.$data[0]->keterangansubsubkegiatan }}
                                    </font>
                            </p>
                        </td>
                    </tr>
                    <tr style="margin-top: -10px;">
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                        Waktu Pelaksanaan
                                    </font>
                            </p>
                        </td>
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                            : {{ $data[0]->tahun }}
                                    </font>
                            </p>
                        </td>
                    </tr>
                    <tr style="margin-top: -10px;">
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Lokasi Kegiatan
                                    </font>
                            </p>
                        </td>
                        <td>
                            <p align="left" style="margin-left:10px">
                                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    : {{ $settingrba[0]->pengelolakeuanganblud }}
                                    </font>
                            </p>
                        </td>
                    </tr>
                    <tr style="margin-top: -10px;">
                        <td height="15"></td>
                    </tr>
                </td>
            </tr>
        <!-- </tbody> -->
    </table>

    <table cellpadding="0" cellspacing="0"   border="0" class="tabels">
        <tr>
            <td colspan="4" align="center" style="padding: 10px; width: 97px; font-weight: bold ">Indikator</td>
            <td colspan="4" align="center" style="padding: 10px; width: 300px; font-weight: bold ">Tolok Ukur</td>
            <td colspan="5" align="center" style="padding: 10px; font-weight: bold ">Target Kinerja</td>
        </tr>
        <tr>
            <td colspan="4" align="left" style="padding: 5px;">Masukan</td>
            <td colspan="4" align="left" style="padding: 5px;">Dana</td>
            @php
                $jumlahtotal = 0
            @endphp
            @foreach($sebelum as $sb)
            @if($sebelum != [])
                @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                @php
                $jumlahtotal+=$sb->subtotaljasalayanan;
                $jumlahtotal+=$sb->subtotalapbd;
                $jumlahtotal+=$sb->subtotaldak;
                $jumlahtotal+=$sb->subtotaldanais;
                $jumlahtotal+=$sb->subtotalsilpa;
                @endphp
                @endif
            @endif
            @endforeach
            <td colspan="5" align="left" style="padding: 5px;">{{ "Rp " . number_format($jumlahtotal,2,',','.') }}</td>
        </tr>
        <tr>
            <td colspan="4" align="left" style="padding: 5px;">Keluaran</td>
            <td colspan="4" align="left" style="padding: 5px;">
                <textarea name="" id="" cols="60" rows="7" style="font-size: 11pt;">{{ $data[0]->indikatorkeluaran }}</textarea>
            </td>
            <td colspan="5" align="left" style="padding: 5px; font-size: 11pt;">
                <textarea name="" id="" cols="60" rows="7">{{ $data[0]->targetkeluaran }}</textarea>
            </td>
        </tr>
        <tr>
            <td colspan="4" align="left" style="padding: 5px;">Hasil</td>
            <td colspan="4" align="left" style="padding: 5px;">{{ $data[0]->indikatorhasil }}</td>
            <td colspan="5" align="left" style="padding: 5px;">{{ $data[0]->targethasil }}</td>
        </tr>
    </table>
    @php
        $jumlahtotaljasalayanan = 0;
        $jumlahtotalapbd = 0;
        $jumlahtotaldak = 0;
        $jumlahtotaldanais = 0;
        $jumlahtotalsilpa = 0;
    @endphp
    @foreach($sebelum as $sb)
    @if($sb->kodemataanggaran == 'I')
    @php
    $jumlahtotaljasalayanan+=$sb->subtotaljasalayanan;
    $jumlahtotalapbd+=$sb->subtotalapbd;
    $jumlahtotaldak+=$sb->subtotaldak;
    $jumlahtotaldanais+=$sb->subtotaldanais;
    $jumlahtotalsilpa+=$sb->subtotalsilpa;
    @endphp
    @elseif($sb->kodemataanggaran == 'III')
    @php
    $jumlahtotaljasalayanan+=$sb->subtotaljasalayanan;
    $jumlahtotalapbd+=$sb->subtotalapbd;
    $jumlahtotaldak+=$sb->subtotaldak;
    $jumlahtotaldanais+=$sb->subtotaldanais;
    $jumlahtotalsilpa+=$sb->subtotalsilpa;
    @endphp
    @elseif($sb->kodemataanggaran == 'II')
    @php
    $jumlahtotaljasalayanan+=$sb->subtotaljasalayanan;
    $jumlahtotalapbd+=$sb->subtotalapbd;
    $jumlahtotaldak+=$sb->subtotaldak;
    $jumlahtotaldanais+=$sb->subtotaldanais;
    $jumlahtotalsilpa+=$sb->subtotalsilpa;
    @endphp
    @endif
    @endforeach
    <table cellpadding="0" cellspacing="0"  border="0" class="tabels">
    <thead>
        <tr>
            <td align="center" rowspan="2" colspan="4" style="padding: 10px; font-weight: bold ">NO. REKENING</td>
            <td align="center" rowspan="2" style="padding: 10px; font-weight: bold ">KOMPONEN BIAYA</td>
            <td align="center" colspan="3" style="padding: 10px; font-weight: bold ">RINCIAN BIAYA</td>

            <!-- @if($jumlahtotaljasalayanan != 0 && $jumlahtotalapbd != 0)
            <td align="center" colspan="2" style="padding: 10px; font-weight: bold ">JUMLAH ANGGARAN</td>
            @elseif($jumlahtotaljasalayanan != 0 || $jumlahtotalapbd != 0)  -->
            <td align="center" colspan="5" style="padding: 10px; font-weight: bold ">JUMLAH ANGGARAN (SUMBER DANA)</td>
            <!-- @endif -->

        </tr>
        <tr>
            <td align="center" style="padding: 10px; font-weight: bold ">Jumlah</td>
            <td align="center" style="padding: 10px; font-weight: bold ">Satuan</td>
            <td align="center" style="padding: 10px; font-weight: bold ">Harga Satuan</td>

            <!-- @if($jumlahtotaljasalayanan == -1 && $jumlahtotalapbd == -1)
            <td align="center" style="padding: 10px; font-weight: bold ">Jasa Layanan</td>
            @elseif($jumlahtotaljasalayanan == -1 && $jumlahtotalapbd == -1)
            <td align="center" style="padding: 10px; font-weight: bold ">APBD</td>
            @elseif($jumlahtotaljasalayanan != 0 && $jumlahtotalapbd != 0)
            @else -->
            <td align="center" style="padding: 10px; font-weight: bold ">Jasa Layanan</td>
            <td align="center" style="padding: 10px; font-weight: bold ">APBD</td>
            <td align="center" style="padding: 10px; font-weight: bold ">DAK</td>
            <td align="center" style="padding: 10px; font-weight: bold ">DANAIS</td>
            <td align="center" style="padding: 10px; font-weight: bold ">SiLPA</td>
            <!-- @endif -->

        </tr>
    </thead>
        @php
            $jumlahtotaljasalayanan = 0;
            $jumlahtotalapbd = 0;
            $jumlahtotaldak = 0;
            $jumlahtotaldanais = 0;
            $jumlahtotalsilpa = 0;
        @endphp
        @foreach($sebelum as $sb)
        <tr>
            @php
            $char = explode(".", $sb->kodemataanggaran);
            @endphp
            @if($sb->kodemataanggaran == 'I')
            @php
            $jumlahtotaljasalayanan+=$sb->subtotaljasalayanan;
            $jumlahtotalapbd+=$sb->subtotalapbd;
            $jumlahtotaldak+=$sb->subtotaldak;
            $jumlahtotaldanais+=$sb->subtotaldanais;
            $jumlahtotalsilpa+=$sb->subtotalsilpa;
            @endphp
            <td align="center" style="padding: 10px; font-weight: bold "> {{ $sb->kodemataanggaran }}</td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
            @elseif($sb->kodemataanggaran == 'III')
            @php
            $jumlahtotaljasalayanan+=$sb->subtotaljasalayanan;
            $jumlahtotalapbd+=$sb->subtotalapbd;
            $jumlahtotaldak+=$sb->subtotaldak;
            $jumlahtotaldanais+=$sb->subtotaldanais;
            $jumlahtotalsilpa+=$sb->subtotalsilpa;
            @endphp
            <td align="center" style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
            @elseif($sb->kodemataanggaran == 'II')
            @php
            $jumlahtotaljasalayanan+=$sb->subtotaljasalayanan;
            $jumlahtotalapbd+=$sb->subtotalapbd;
            $jumlahtotaldak+=$sb->subtotaldak;
            $jumlahtotaldanais+=$sb->subtotaldanais;
            $jumlahtotalsilpa+=$sb->subtotalsilpa;
            @endphp
            <td align="center" style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
            @elseif(strpos($sb->kodemataanggaran,'I.') !== false && strlen($sb->kodemataanggaran) == 3)
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold ">{{ $char[1] }}</td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
            @elseif(strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 5)
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold ">{{ $char[1] }}</td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
            @elseif($sb->jml == 0 && strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 9)
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px;">{{ $char[2].'.'.$char[3] }}</td>
            <td align="left" style="padding: 10px;">{{ $sb->keterangan }}</td>
            @elseif($sb->jml != 0 && strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 9)
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px;">{{ $sb->keterangan }}</td>
            @elseif(strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 4)
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold ">{{ $char[1] }}</td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
            @elseif($sb->jml == 0 && strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 8)
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px;">{{ $char[2].'.'.$char[3] }}</td>
            <td align="left" style="padding: 10px;">{{ $sb->keterangan }}</td>
            @elseif($sb->jml != 0 && strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 8)
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px;">{{ $sb->keterangan }}</td>
            @elseif((strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && strlen($sb->kodemataanggaran) == 5)
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold ">{{ $char[2] }}</td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
            @elseif($sb->jml == 0 && (strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && (strlen($sb->kodemataanggaran) == 9 || strlen($sb->kodemataanggaran) == 10))
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px;">{{ $char[3].'.'.$char[4] }}</td>
            <td align="left" style="padding: 10px;">{{ $sb->keterangan }}</td>
            @elseif($sb->jml != 0 && (strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && (strlen($sb->kodemataanggaran) == 9 || strlen($sb->kodemataanggaran) == 10))
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="left" style="padding: 10px;">{{ $sb->keterangan }}</td>
            @else
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold "></td>
            <td align="center" style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
            <td align="left" style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
            @endif
            @if($sb->jml != 0)
            <td align="right" style="padding: 10px; ">{{ $sb->jml }}</td>
            @else
            <td align="right" style="padding: 10px; "></td>
            @endif
            <td align="center" style="padding: 10px; ">{{ $sb->satuan }}</td>
            @if($sb->hargasatuan != 0)
            <td align="right" style="padding: 10px; ">{{ number_format($sb->hargasatuan,0,',','.') }}</td>
            @else
            <td align="right" style="padding: 10px; "></td>
            @endif
            @if(strlen($sb->kodemataanggaran) < 7)
                <td align="right" style="padding: 10px; font-weight: bold ">@if ($sb->subtotaljasalayanan>0) {{ number_format($sb->subtotaljasalayanan,0,',','.') }} @else {{''}} @endif</td>
                <td align="right" style="padding: 10px; font-weight: bold ">@if ($sb->subtotalapbd>0) {{ number_format($sb->subtotalapbd,0,',','.') }} @else {{''}} @endif</td>
                <td align="right" style="padding: 10px; font-weight: bold ">@if ($sb->subtotaldak>0) {{ number_format($sb->subtotaldak,0,',','.') }} @else {{''}} @endif</td>
                <td align="right" style="padding: 10px; font-weight: bold ">@if ($sb->subtotaldanais>0) {{ number_format($sb->subtotaldanais,0,',','.') }} @else {{''}} @endif</td>
                <td align="right" style="padding: 10px; font-weight: bold ">@if ($sb->subtotalsilpa>0) {{ number_format($sb->subtotalsilpa,0,',','.') }} @else {{''}} @endif</td>
                <!-- @if($jumlahtotaljasalayanan == -1 && $jumlahtotalapbd == -1)
                <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                @elseif($jumlahtotaljasalayanan == -1 && $jumlahtotalapbd == -1)
                <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                @else
                <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                @endif -->
            @else
                <td align="right" style="padding: 10px;">@if ($sb->subtotaljasalayanan>0) {{ number_format($sb->subtotaljasalayanan,0,',','.') }} @else {{''}} @endif</td>
                <td align="right" style="padding: 10px;">@if ($sb->subtotalapbd>0) {{ number_format($sb->subtotalapbd,0,',','.') }} @else {{''}} @endif</td>
                <td align="right" style="padding: 10px;">@if ($sb->subtotaldak>0) {{ number_format($sb->subtotaldak,0,',','.') }} @else {{''}} @endif</td>
                <td align="right" style="padding: 10px;">@if ($sb->subtotaldanais>0) {{ number_format($sb->subtotaldanais,0,',','.') }} @else {{''}} @endif</td>
                <td align="right" style="padding: 10px;">@if ($sb->subtotalsilpa>0) {{ number_format($sb->subtotalsilpa,0,',','.') }} @else {{''}} @endif</td>
                <!-- @if($jumlahtotaljasalayanan != 0 && $jumlahtotalapbd == 0)
                <td align="right" style="padding: 10px;">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                @elseif($jumlahtotaljasalayanan == 0 && $jumlahtotalapbd != 0)
                <td align="right" style="padding: 10px;">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                @elseif($jumlahtotaljasalayanan != 0 && $jumlahtotalapbd != 0)
                <td align="right" style="padding: 10px;">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                <td align="right" style="padding: 10px;">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                <td align="right" style="padding: 10px;">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                <td align="right" style="padding: 10px;">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                @endif -->
            @endif
        </tr>
        @endforeach
        <tr>
            <td align="center" colspan="8"  style="padding: 10px; font-weight: bold ">JUMLAH TOTAL</td>
        <!-- {{isset($item[190130815]) ? $item[190130815] : '' }} -->
            <td align="right" style="padding: 10px; font-weight: bold ">@if($jumlahtotaljasalayanan > 0) {{ number_format($jumlahtotaljasalayanan,0,',','.') }} @else {{ '' }}  @endif</td>
            <td align="right" style="padding: 10px; font-weight: bold ">@if($jumlahtotalapbd > 0) {{ number_format($jumlahtotalapbd,0,',','.') }} @else {{ '' }}  @endif</td>
            <td align="right" style="padding: 10px; font-weight: bold ">@if($jumlahtotaldak > 0) {{ number_format($jumlahtotaldak,0,',','.') }} @else {{ '' }}  @endif</td>
            <td align="right" style="padding: 10px; font-weight: bold ">@if($jumlahtotaldanais > 0) {{ number_format($jumlahtotaldanais,0,',','.') }} @else {{ '' }}  @endif</td>
            <td align="right" style="padding: 10px; font-weight: bold ">@if($jumlahtotalsilpa > 0) {{ number_format($jumlahtotalsilpa,0,',','.') }} @else {{ '' }}  @endif</td>
            <!-- @if($jumlahtotaljasalayanan == -1 && $jumlahtotalapbd == -1)
            <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotaljasalayanan,0,',','.') }}</td>
            @elseif($jumlahtotaljasalayanan == -1 && $jumlahtotalapbd == -1)
            <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalapbd,0,',','.') }}</td> -->
            <!-- @elseif($jumlahtotaljasalayanan != 0 && $jumlahtotalapbd != 0) -->
            <!-- @else
            <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotaljasalayanan,0,',','.') }}</td>
            <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalapbd,0,',','.') }}</td>
            <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalapbd,0,',','.') }}</td>
            <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalapbd,0,',','.') }}</td>
            @endif -->
        </tr>
    </table>

    <table cellpadding="0" cellspacing="0" width="100%"  border="0">
        <thead>
            <tr>
                <td width="700">
                </td>
                <td>
                </td>
                <td>
                    <p align="center" style="margin-top: 50px;">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                Yogyakarta, {{ $tanggalcetak }}
                        </font>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="700">
                </td>
                <td>
                </td>
                <td>
                    <p align="center" style="margin-bottom:50px">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                Direktur
                        </font>
                    </p>
                </td>
            </tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr></tr>
            <tr>
                <td width="700">
                </td>
                <td>
                </td>
                <td>
                    <p align="center" style="margin-top: 50px;">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                                <u>{{$settingrba[0]->namalengkap}}</u>
                        </font>
                    </p>
                </td>
            </tr>
            <tr>
                <td width="700">
                </td>
                <td>
                </td>
                <td>
                    <p align="center">
                        <font style="font-size: 12pt; " color="#000000" face="Arial">
                        NIP. {{$settingrba[0]->nippns}}
                        </font>
                    </p>
                </td>
            </tr>
    </table>
</div>
<script>
    window.print()
</script>
</body>
</html>