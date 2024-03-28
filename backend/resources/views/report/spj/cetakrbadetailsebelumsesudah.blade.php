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
 
</head>
<style>
    @page {
        margin:15mm 15mm;
        size: 33cm 21.5cm;
    }

    @page :first {
        margin:15mm 15mm;
        size: 33cm 21.5cm;

    }

    body {
        font-family: Arial;
        margin: 0;
        padding: 0;
    }

    table{
		font-family:'Arial';
		margin:0;
		padding:.1cm 0;
		font-size:11pt;
	}	

    .tabel tr td{
        border: 1px solid black;
        page-break-inside: avoid;
    }

    .tabel {
        border-collapse: collapse;

    }

    .tabels tr td{
        border: 0.5px solid black;
        page-break-inside: avoid;
    }

    .tabels {
        border-collapse: collapse;

    }

    .tabelss {
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
        <table cellpadding="0" cellspacing="0"  border="0" width="100%" class="tabel">
            <tbody >
                <tr>
                    <td rowspan="2"  style="padding: 10px; width: 100px;" align="center">
                    <p align="center">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 120px" >
                            @else
                                <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 120px" >
                            @endif
                        
                    </p>
                    </td>
                    <td align="center" style="width: 300px;">
                        <b style="font-size: 25px;">
                            RENCANA BISNIS DAN ANGGARAN<br>
                            BADAN LAYANAN UMUM DAERAH
                        </b>
                    </td>
                    <td rowspan="2"  align="center" style="width: 100px;">
                        <b style="font-size: 25px;">
                            RBA
                        </b><br>
                        {{-- @if($sebelum != []) --}}
                        {{substr($itahap[0]->tahap, 0,)}}
                        {{-- @endif --}}
                    </td>
                </tr>
                <tr align="center">
                    <td>
                        <b>RS Jiwa GRHASIA<br>TAHUN {{ date('Y') }}</b>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <p align="center" style="margin-top: 10px; margin-bottom:10px">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ date('Y') }}</b>
                            </font>
                            <br>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>

        <table cellpadding="0" cellspacing="0" width="100%" border="0" class="tabelss">
            <tbody>
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
                                        : RS Jiwa GRHASIA DINKES DIY
                                        </font>
                                </p>
                            </td>
                        </tr>
                        <tr style="margin-top: -10px;">
                            <td height="15"></td>
                        </tr>
                    </td>
                </tr>
            </tbody>
        </table>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" class="tabels">
            <tr>
                <td align="center" rowspan="2"  style="padding: 2px; font-weight: bold ">Indikator</td>
                <td align="center" colspan="2" style="padding: 2px; font-weight: bold ">SEBELUM PERUBAHAN</td>
                <td align="center" colspan="2" style="padding: 2px; font-weight: bold ">SESUDAH PERUBAHAN</td>
            </tr>
            <tr>
                <td align="center" style="padding: 2px; font-weight: bold ">Tolok Ukur</td>
                <td align="center" style="padding: 2px; font-weight: bold ">Target Kinerja</td>
                <td align="center" style="padding: 2px; font-weight: bold ">Tolok Ukur</td>
                <td align="center" style="padding: 2px; font-weight: bold ">Target Kinerja</td>
            </tr>
            <tr>
                <td align="left" style="padding: 2px;">Masukan</td>
                <td align="left" style="padding: 2px;">Dana</td>
                @php
                    $jumlahtotal = 0;
                    $jumlahtotalsebelummm = 0;
                @endphp
                @foreach($sebelum as $sb)
                    @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                    @php
                    $jumlahtotalsebelummm+=$sb->subtotaljasalayanan;
                    $jumlahtotalsebelummm+=$sb->subtotalapbd;
                    $jumlahtotal+=$sb->subtotaljasalayanansetelah;
                    $jumlahtotal+=$sb->subtotalapbdsetelah;
                    @endphp
                    @endif
                @endforeach
                <td align="left" style="padding: 2px;">{{ "Rp " . number_format($jumlahtotalsebelummm,2,',','.') }}</td>
                <td align="left" style="padding: 2px;">Dana</td>
                <td align="left" style="padding: 2px;">{{ "Rp " . number_format($jumlahtotal,2,',','.') }}</td>
            </tr>
            <tr>
                <td align="left" style="padding: 2px;">Keluaran</td>
                <td align="left" style="padding: 2px;">
                    <textarea name="" id="" cols="30" rows="12">{{ $datasebelum[0]->indikatorkeluaran }}</textarea>
                </td>
                <td align="left" style="padding: 2px;">
                    <textarea name="" id="" cols="30" rows="12">{{ $datasebelum[0]->targetkeluaran }}</textarea>
                </td>
                <td align="left" style="padding: 2px;">
                    <textarea name="" id="" cols="30" rows="12">{{ $data[0]->indikatorkeluaran }}</textarea>
                </td>
                <td align="left" style="padding: 2px;">
                    <textarea name="" id="" cols="30" rows="12">{{ $data[0]->targetkeluaran }}</textarea>
                </td>
            </tr>
            <tr>
                <td align="left" style="padding: 2px;">Hasil</td>
                <td align="left" style="padding: 2px;">{{ $datasebelum[0]->indikatorhasil }}</td>
                <td align="left" style="padding: 2px;">{{ $datasebelum[0]->targethasil }}</td>
                <td align="left" style="padding: 2px;">{{ $data[0]->indikatorhasil }}</td>
                <td align="left" style="padding: 2px;">{{ $data[0]->targethasil }}</td>
            </tr>
        </table>

        @php
            $jumlahtotaljasalayanansebelum = 0;
            $jumlahtotaljasalayanansesudah = 0;
            $jumlahtotalapbdsebelum = 0;
            $jumlahtotalapbdsesudah = 0;
            $jumlahtotalselisih = 0;
        @endphp
        @foreach($sebelum as $sb)
            @if($sb->kodemataanggaran == 'I')
                @php
                    $jumlahtotaljasalayanansebelum += $sb->subtotaljasalayanan;
                    $jumlahtotaljasalayanansesudah += $sb->subtotaljasalayanansetelah;
                    $jumlahtotalapbdsebelum += $sb->subtotalapbd;
                    $jumlahtotalapbdsesudah += $sb->subtotalapbdsetelah;
                @endphp
            @elseif($sb->kodemataanggaran == 'III')
                @php
                    $jumlahtotaljasalayanansebelum += $sb->subtotaljasalayanan;
                    $jumlahtotaljasalayanansesudah += $sb->subtotaljasalayanansetelah;
                    $jumlahtotalapbdsebelum += $sb->subtotalapbd;
                    $jumlahtotalapbdsesudah += $sb->subtotalapbdsetelah;
                @endphp
            @elseif($sb->kodemataanggaran == 'II')
                @php
                    $jumlahtotaljasalayanansebelum += $sb->subtotaljasalayanan;
                    $jumlahtotaljasalayanansesudah += $sb->subtotaljasalayanansetelah;
                    $jumlahtotalapbdsebelum += $sb->subtotalapbd;
                    $jumlahtotalapbdsesudah += $sb->subtotalapbdsetelah;
                @endphp
            @endif
        @endforeach

        <table cellpadding="0" cellspacing="0"  border="0" width="100%" class="tabel">
            <tbody>
                <tr>
                    <td align="center" width="50"  colspan="5" style="padding: 5px; font-weight: bold ">ANGGARAN BELANJA</td>
                    <td align="center" width="50"  colspan="4" style="padding: 5px; font-weight: bold ">SEBELUM PERUBAHAN</td>
                    <td align="center" width="50"  colspan="4" style="padding: 5px; font-weight: bold ">SESUDAH PERUBAHAN</td>
                    <td align="center" width="50"  rowspan="3" style="padding: 5px; font-weight: bold ">BERTAMBAH/<br>BERKURANG</td>
                    <td align="center" width="50"  rowspan="3" style="padding: 5px; font-weight: bold ">%</td>
                </tr>
                <tr>
                    <td align="center" width="50"  rowspan="2" colspan="4" style="padding: 5px; font-weight: bold ">NO. REKENING</td>
                    <td align="center" width="50"  rowspan="2" style="padding: 5px; font-weight: bold ">KOMPONEN BIAYA</td>
                    <td align="center" width="50"  colspan="3" style="padding: 5px; font-weight: bold ">RINCIAN BIAYA</td>
                    @if($jumlahtotaljasalayanansebelum != 0 && $jumlahtotalapbdsebelum != 0)
                    <td align="center" width="50"   style="padding: 5px; font-weight: bold ">JUMLAH ANGGARAN</td>
                    @elseif($jumlahtotaljasalayanansebelum != 0 || $jumlahtotalapbdsebelum != 0)
                    <td align="center" width="50"   style="padding: 5px; font-weight: bold ">JUMLAH ANGGARAN</td>
                    @endif
                    <td align="center" width="50"  colspan="3" style="padding: 5px; font-weight: bold ">RINCIAN BIAYA</td>
                    @if($jumlahtotaljasalayanansesudah != 0 && $jumlahtotalapbdsesudah != 0)
                    <td align="center" width="50"   style="padding: 5px; font-weight: bold ">JUMLAH ANGGARAN</td>
                    @elseif($jumlahtotaljasalayanansesudah != 0 || $jumlahtotalapbdsesudah != 0)
                    <td align="center" width="50"   style="padding: 5px; font-weight: bold ">JUMLAH ANGGARAN</td>
                    @endif
                </tr>
                <tr>
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Jumlah</td>
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Satuan</td>
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Harga Satuan</td>
                    @if($jumlahtotaljasalayanansebelum != 0 && $jumlahtotalapbdsebelum == 0)
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Jasa Layanan</td>
                    @elseif($jumlahtotaljasalayanansebelum == 0 && $jumlahtotalapbdsebelum != 0)
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">APBD</td>
                    @elseif($jumlahtotaljasalayanansebelum != 0 && $jumlahtotalapbdsebelum != 0)
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Jasa Layanan</td>
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">APBD</td>
                    @endif
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Jumlah</td>
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Satuan</td>
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Harga Satuan</td>
                    @if($jumlahtotaljasalayanansesudah != 0 && $jumlahtotalapbdsesudah == 0)
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Jasa Layanan</td>
                    @elseif($jumlahtotaljasalayanansesudah == 0 && $jumlahtotalapbdsesudah != 0)
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">APBD</td>
                    @elseif($jumlahtotaljasalayanansesudah != 0 && $jumlahtotalapbdsesudah != 0)
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">Jasa Layanan</td>
                    <td align="center" width="50"  style="padding: 5px; font-weight: bold ">APBD</td>
                    @endif
                </tr>
                @if($sebelum!= [])
                @php
                    $jumlahtotaljasalayanansebelum = 0;
                    $jumlahtotaljasalayanansesudah = 0;
                    $jumlahtotalapbdsebelum = 0;
                    $jumlahtotalapbdsesudah = 0;
                    $jumlahtotalselisih = 0;
                @endphp
                @foreach($sebelum as $sb)
                <tr>
                    @php
                    $char = explode(".", $sb->kodemataanggaran);
                    @endphp
                    @if($sb->kodemataanggaran == 'I')
                    @php
                        $jumlahtotaljasalayanansebelum += $sb->subtotaljasalayanan;
                        $jumlahtotaljasalayanansesudah += $sb->subtotaljasalayanansetelah;
                        $jumlahtotalapbdsebelum += $sb->subtotalapbd;
                        $jumlahtotalapbdsesudah += $sb->subtotalapbdsetelah;
                    @endphp
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->kodemataanggaran == 'III')
                    @php
                    $jumlahtotaljasalayanansebelum += $sb->subtotaljasalayanan;
                        $jumlahtotaljasalayanansesudah += $sb->subtotaljasalayanansetelah;
                        $jumlahtotalapbdsebelum += $sb->subtotalapbd;
                        $jumlahtotalapbdsesudah += $sb->subtotalapbdsetelah;
                    @endphp
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->kodemataanggaran == 'II')
                    @php
                    $jumlahtotaljasalayanansebelum += $sb->subtotaljasalayanan;
                        $jumlahtotaljasalayanansesudah += $sb->subtotaljasalayanansetelah;
                        $jumlahtotalapbdsebelum += $sb->subtotalapbd;
                        $jumlahtotalapbdsesudah += $sb->subtotalapbdsetelah;
                    @endphp
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif(strpos($sb->kodemataanggaran,'I.') !== false && strlen($sb->kodemataanggaran) == 3)
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $char[1] }}</td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif(strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 5)
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $char[1] }}</td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml == 0 && strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 9)
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $char[2].'.'.$char[3] }}</td>
                    <td align="left" width="200"  style="padding: 5px;">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml != 0 && strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 9)
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px;">{{ $sb->keterangan }}</td>
                    @elseif(strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 4)
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $char[1] }}</td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml == 0 && strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 8)
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $char[2].'.'.$char[3] }}</td>
                    <td align="left" width="200"  style="padding: 5px;">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml != 0 && strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 8)
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px;">{{ $sb->keterangan }}</td>
                    @elseif((strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && strlen($sb->kodemataanggaran) == 5)
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $char[2] }}</td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml == 0 && (strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && (strlen($sb->kodemataanggaran) == 9 || strlen($sb->kodemataanggaran) == 10))
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $char[3].'.'.$char[4] }}</td>
                    <td align="left" width="200"  style="padding: 5px;">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml != 0 && (strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && (strlen($sb->kodemataanggaran) == 9 || strlen($sb->kodemataanggaran) == 10))
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 5px;">{{ $sb->keterangan }}</td>
                    @else
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 5px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="left" width="200"  style="padding: 5px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @endif
                    @if($sb->jml != 0)
                    <td align="right" width="50"  style="padding: 5px; ">{{ $sb->jml }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 5px; "></td>
                    @endif
                    <td align="center" width="50"  style="padding: 5px; ">{{ $sb->satuan }}</td>
                    @if($sb->hargasatuan != 0)
                    <td align="right" width="50"  style="padding: 5px; ">{{ number_format($sb->hargasatuan,0,',','.') }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 5px; "></td>
                    @endif
                    @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                        @if($jumlahtotaljasalayanansebelum != 0 && $jumlahtotalapbdsebelum == 0)
                        <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                        @elseif($jumlahtotaljasalayanansebelum == 0 && $jumlahtotalapbdsebelum != 0)
                        <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                        @elseif($jumlahtotaljasalayanansebelum != 0 && $jumlahtotalapbdsebelum != 0)
                        <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                        <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                        @endif
                    @else
                        @if($jumlahtotaljasalayanansebelum != 0 && $jumlahtotalapbdsebelum == 0)
                        <td align="right" width="50"  style="padding: 5px;">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                        @elseif($jumlahtotaljasalayanansebelum == 0 && $jumlahtotalapbdsebelum != 0)
                        <td align="right" width="50"  style="padding: 5px;">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                        @elseif($jumlahtotaljasalayanansebelum != 0 && $jumlahtotalapbdsebelum != 0)
                        <td align="right" width="50"  style="padding: 5px;">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                        <td align="right" width="50"  style="padding: 5px;">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                        @endif
                    @endif
                    @if($sb->jml != 0)
                    <td align="right" width="50"  style="padding: 5px; ">{{ $sb->jmlsetelah }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 5px; "></td>
                    @endif
                    <td align="center" width="50"  style="padding: 5px; ">{{ $sb->satuansetelah }}</td>
                    @if($sb->hargasatuan != 0)
                    <td align="right" width="50"  style="padding: 5px; ">{{ number_format($sb->hargasatuansetelah,0,',','.') }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 5px; "></td>
                    @endif
                    @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                        @if($jumlahtotaljasalayanansesudah != 0 && $jumlahtotalapbdsesudah == 0)
                        <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($sb->subtotaljasalayanansetelah,0,',','.') }}</td>
                        @elseif($jumlahtotaljasalayanansesudah == 0 && $jumlahtotalapbdsesudah != 0)
                        <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($sb->subtotalapbdsetelah,0,',','.') }}</td>
                        @elseif($jumlahtotaljasalayanansesudah != 0 && $jumlahtotalapbdsesudah != 0)
                        <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($sb->subtotaljasalayanansetelah,0,',','.') }}</td>
                        <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($sb->subtotalapbdsetelah,0,',','.') }}</td>
                        @endif
                    @else
                        @if($jumlahtotaljasalayanansesudah != 0 && $jumlahtotalapbdsesudah == 0)
                        <td align="right" width="50"  style="padding: 5px;"> {{ number_format($sb->subtotaljasalayanansetelah,0,',','.') }}</td>
                        @elseif($jumlahtotaljasalayanansesudah == 0 && $jumlahtotalapbdsesudah != 0)
                        <td align="right" width="50"  style="padding: 5px;"> {{ number_format($sb->subtotalapbdsetelah,0,',','.') }}</td>
                        @elseif($jumlahtotaljasalayanansesudah != 0 && $jumlahtotalapbdsesudah != 0)
                        <td align="right" width="50"  style="padding: 5px;">{{ number_format($sb->subtotaljasalayanansetelah,0,',','.') }}</td>
                        <td align="right" width="50"  style="padding: 5px;">{{ number_format($sb->subtotalapbdsetelah,0,',','.') }}</td>
                        @endif
                    @endif
                    @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                        @if(($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah) > ($sb->subtotaljasalayanan + $sb->subtotalapbd))
                        @php
                            $jumlahtotalselisih += ($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah) - ($sb->subtotaljasalayanan + $sb->subtotalapbd) 
                        @endphp
                        <td align="right" width="25"  style="padding: 5px; font-weight: bold "> {{ number_format(($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah) - ($sb->subtotaljasalayanan + $sb->subtotalapbd),0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 5px; font-weight: bold "> {{ number_format((($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah) - ($sb->subtotaljasalayanan + $sb->subtotalapbd))/($sb->subtotaljasalayanan + $sb->subtotalapbd)*100,0,',','.') }}</td>
                        @elseif(($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah) < ($sb->subtotaljasalayanan + $sb->subtotalapbd))
                        @php
                            $jumlahtotalselisih += ($sb->subtotaljasalayanan + $sb->subtotalapbd) - ($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah)
                        @endphp
                        <td align="right" width="25"  style="padding: 5px; font-weight: bold "> {{ number_format(($sb->subtotaljasalayanan + $sb->subtotalapbd) - ($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah),0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 5px; font-weight: bold ">{{ number_format((($sb->subtotaljasalayanan + $sb->subtotalapbd) - ($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah)/($sb->subtotaljasalayanan + $sb->subtotalapbd)*100),0,',','.') }}</td>
                        @else
                        <td align="right" width="25"  style="padding: 5px; font-weight: bold "> {{ number_format(0,0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 5px; font-weight: bold ">{{ number_format(0,0,',','.') }}</td>
                        @endif
                    @else
                        @if(($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah) > ($sb->subtotaljasalayanan + $sb->subtotalapbd))
                        <td align="right" width="25"  style="padding: 5px;">{{ number_format(($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah) - ($sb->subtotaljasalayanan + $sb->subtotalapbd),0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 5px;">{{ number_format((($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah) - ($sb->subtotaljasalayanan + $sb->subtotalapbd)/($sb->subtotaljasalayanan + $sb->subtotalapbd)*100),0,',','.') }}</td>
                        @elseif(($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah) < ($sb->subtotaljasalayanan + $sb->subtotalapbd))
                        <td align="right" width="25"  style="padding: 5px;">{{ number_format(($sb->subtotaljasalayanan + $sb->subtotalapbd) - ($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah),0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 5px;">{{ number_format((($sb->subtotaljasalayanan + $sb->subtotalapbd) - ($sb->subtotaljasalayanansetelah + $sb->subtotalapbdsetelah)/($sb->subtotaljasalayanan + $sb->subtotalapbd)*100),0,',','.') }}</td>
                        @else
                        <td align="right" width="25"  style="padding: 5px;"> {{ number_format(0,0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 5px;">{{ number_format(0,0,',','.') }}</td>
                        @endif
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td align="center" width="50" colspan="8"  style="padding: 5px; font-weight: bold ">JUMLAH TOTAL</td>
                    @if($jumlahtotaljasalayanansebelum != 0 && $jumlahtotalapbdsebelum == 0)
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotaljasalayanansebelum,0,',','.') }}</td>
                    @elseif($jumlahtotaljasalayanansebelum == 0 && $jumlahtotalapbdsebelum != 0)
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotalapbdsebelum,0,',','.') }}</td>
                    @elseif($jumlahtotaljasalayanansebelum != 0 && $jumlahtotalapbdsebelum != 0)
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotaljasalayanansebelum,0,',','.') }}</td>
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotalapbdsebelum,0,',','.') }}</td>
                    @endif
                    <td align="center" width="50" colspan="3"  style="padding: 5px; font-weight: bold "></td>
                    @if($jumlahtotaljasalayanansesudah != 0 && $jumlahtotalapbdsesudah == 0)
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotaljasalayanansesudah,0,',','.') }}</td>
                    @elseif($jumlahtotaljasalayanansesudah == 0 && $jumlahtotalapbdsesudah != 0)
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotalapbdsesudah,0,',','.') }}</td>
                    @elseif($jumlahtotaljasalayanansesudah != 0 && $jumlahtotalapbdsesudah != 0)
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotaljasalayanansesudah,0,',','.') }}</td>
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotalapbdsesudah,0,',','.') }}</td>
                    @endif
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotalselisih,0,',','.') }}</td>
                    <td align="right" width="50"  style="padding: 5px; font-weight: bold ">{{ number_format($jumlahtotalselisih/($jumlahtotaljasalayanansebelum + $jumlahtotalapbdsebelum)*100,0,',','.') }}</td>
                </tr>
                @endif
            </tbody>
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
                                    Kepala BLUD RS Jiwa GRHASIA
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