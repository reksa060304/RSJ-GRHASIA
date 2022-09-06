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
<style type="text/css" media="print">
        @page {
            size: auto;   /* auto is the initial value */
            margin: 10;  /* this affects the margin in the printer settings */
        }
</style>
<style>

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Arial;
    }

    .tabel tr td{
        border: 1px solid black;
    }

    .tabel {
        width: 100%;
        border-collapse: collapse;

    }

    textarea {
        border: none;
        outline: none;
        resize: none;
        font-family: Arial;
    }

    /* table, tr, td{
        border: 1px solid black;
    } */
</style>
<body style="background-color: #CCCCCC;">
<div align="center" >
    <table width="{{$pageWidth}}" bgcolor="#FFFFFF" style="border-left: 3px solid black; border-right: 3px solid black; border-top: 3px solid black;">
        <tbody >
        <tr>
            <td rowspan="2"  style="padding: 5px; width: 50px; border-right: 3px solid black;" align="center">
                    <p align="left">
                            @if(stripos(\Request::url(), 'localhost') !== FALSE)
                            <img src="{{ asset('img/logo_grhasia.png') }}" style="width: 120px" >
                            @else
                              <img src="{{ asset('service/img/logo_grhasia.png') }}" style="width: 120px" >
                            @endif
                      
                    </p>
            </td>
            <td align="center" style="width: 300px;">
                <b style="font-size: 25px;">
                    RENCANA BISNIS DAN ANGGARAN<br>
                    BADAN LAYANAN UMUM DAERAH
                </b>
            </td>
            <td rowspan="2"  align="center" style="width: 150px; border-left: 3px solid black;">
                <b style="font-size: 25px;">
                    RBA
                </b><br>
                {{substr($sebelum[0]->tahap, 0, -3)}}
            </td>
        </tr>
        <tr align="center">
            <td style="border-top: 3px solid black;">
                <b>RS Jiwa GRHASIA DINKES DIY<br>TAHUN 2022</b>
            </td>
        </tr>
        <tr >
            <td colspan="3" style="border-top: 3px solid black;">
                <p align="center" style="margin-top: 10px; margin-bottom:10px">
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            <b>REKAP ANGGARAN TIAP SUB KEGIATAN (JENIS ANGGARAN) <br> TAHUN ANGGARAN {{ date('Y') }}</b>
                    </font>
                    <br>
                </p>
            </td>
        </tr>
        <tr >
            <td colspan="3" style="border-top: 3px solid black;">
                <p align="left" style="margin-top: 10px; margin-bottom:10px; margin-left:10px">
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Program &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; : {{ $data[0]->kodeprogram.' - '.$data[0]->keteranganprogram }}
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Kegiatan &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; : {{ $data[0]->kodekegiatan.' - '.$data[0]->keterangankegiatan }}
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Sub Kegiatan &emsp;&emsp;&emsp;&emsp; : {{ $data[0]->kodesubkegiatan.' - '.$data[0]->keterangansubkegiatan }}
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Sub Sub Kegiatan &emsp;&emsp; : {{ $data[0]->kodesubsubkegiatan.' - '.$data[0]->keterangansubsubkegiatan }}
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Waktu Pelaksanaan &emsp;&nbsp; : {{ $data[0]->tahun }}
                    </font>
                    <br>
                    <font style="font-size: 12pt; " color="#000000" face="Arial">
                            Lokasi Kegiatan &emsp;&emsp;&emsp; : RS Jiwa GRHASIA DINKES DIY
                    </font>
                </p>
            </td>
        </tr>
        <tr >
            <td colspan="3" style="border-top: 3px solid black;">
                <table class="tabel" width="{{$pageWidth}}" bgcolor="#FFFFFF" style="border: 1px solid black; margin-top:10px; margin-bottom:10px;">
                    <tr>
                        <td align="center" width="50" rowspan="2"  style="padding: 10px; font-weight: bold ">Indikator</td>
                        <td align="center" width="50" colspan="2" style="padding: 10px; font-weight: bold ">SEBELUM PERUBAHAN</td>
                        <td align="center" width="50" colspan="2" style="padding: 10px; font-weight: bold ">SESUDAH PERUBAHAN</td>
                    </tr>
                    <tr>
                        <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Tolok Ukur</td>
                        <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Target Kinerja</td>
                        <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Tolok Ukur</td>
                        <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Target Kinerja</td>
                    </tr>
                    <tr>
                        <td align="left" width="50"  style="padding: 10px;">Masukan</td>
                        <td align="left" width="50"  style="padding: 10px;">Dana</td>
                        @php
                            $jumlahtotal = 0
                        @endphp
                        @foreach($sebelum as $sb)
                            @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                            @php
                            $jumlahtotal+=$sb->subtotal
                            @endphp
                            @endif
                        @endforeach
                        <td align="left" width="50"  style="padding: 10px;">{{ "Rp " . number_format($jumlahtotal,2,',','.') }}</td>
                        <td align="left" width="50"  style="padding: 10px;">Dana</td>
                        <td align="left" width="50"  style="padding: 10px;">{{ "Rp " . number_format($jumlahtotal,2,',','.') }}</td>
                    </tr>
                    <tr>
                        <td align="left" width="100"  style="padding: 10px;">Keluaran</td>
                        <td align="left" width="50"  style="padding: 10px;">
                            <textarea name="" id="" cols="30" rows="12">{{ $data[0]->indikatorkeluaran }}</textarea>
                        </td>
                        <td align="left" width="50"  style="padding: 10px;">
                            <textarea name="" id="" cols="30" rows="12">{{ $data[0]->targetkeluaran }}</textarea>
                        </td>
                        <td align="left" width="50"  style="padding: 10px;">
                            <textarea name="" id="" cols="30" rows="12">{{ $data[0]->indikatorkeluaran }}</textarea>
                        </td>
                        <td align="left" width="50"  style="padding: 10px;">
                            <textarea name="" id="" cols="30" rows="12">{{ $data[0]->targetkeluaran }}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" width="50"  style="padding: 10px;">Hasil</td>
                        <td align="left" width="50"  style="padding: 10px;">{{ $data[0]->indikatorhasil }}</td>
                        <td align="left" width="50"  style="padding: 10px;">{{ $data[0]->targethasil }}</td>
                        <td align="left" width="50"  style="padding: 10px;">{{ $data[0]->indikatorhasil }}</td>
                        <td align="left" width="50"  style="padding: 10px;">{{ $data[0]->targethasil }}</td>
                    </tr>
                </table>
            </td>
        </tr>
        </tbody>
    </table>
        <table class="tabel" width="{{$pageWidth}}" bgcolor="#FFFFFF" style="border: 3px solid black;">
                <tr>
                    <td align="center" width="50"  colspan="5" style="padding: 10px; font-weight: bold ">ANGGRAN BELANJA</td>
                    <td align="center" width="50"  colspan="4" style="padding: 10px; font-weight: bold ">SEBELUM PERUBAHAN</td>
                    <td align="center" width="50"  colspan="4" style="padding: 10px; font-weight: bold ">SESUDAH PERUBAHAN</td>
                    <td align="center" width="50"  rowspan="3" style="padding: 10px; font-weight: bold ">BERTAMBAH/<br>BERKURANG</td>
                    <td align="center" width="50"  rowspan="3" style="padding: 10px; font-weight: bold ">%</td>
                </tr>
                <tr>
                    <td align="center" width="50"  rowspan="2" colspan="4" style="padding: 10px; font-weight: bold ">NO. REKENING</td>
                    <td align="center" width="50"  rowspan="2" style="padding: 10px; font-weight: bold ">KOMPONEN BIAYA</td>
                    <td align="center" width="50"  colspan="3" style="padding: 10px; font-weight: bold ">RINCIAN BIAYA</td>
                    <td align="center" width="50"  colspan="1" style="padding: 10px; font-weight: bold ">JUMLAH ANGGARAN</td>
                    <td align="center" width="50"  colspan="3" style="padding: 10px; font-weight: bold ">RINCIAN BIAYA</td>
                    <td align="center" width="50"  colspan="1" style="padding: 10px; font-weight: bold ">JUMLAH ANGGARAN</td>
                </tr>
                <tr>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Jumlah</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Satuan</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Harga Satuan</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Jasa Layanan</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Jumlah</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Satuan</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Harga Satuan</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Jasa Layanan</td>
                </tr>
                @php
                    $jumlahtotalsebelum = 0;
                    $jumlahtotalsesudah = 0;
                    $jumlahtotalselisih = 0;
                @endphp
                @foreach($sebelum as $sb)
                <tr>
                    @php
                    $char = explode(".", $sb->kodemataanggaran);
                    @endphp
                    @if($sb->kodemataanggaran == 'I')
                    @php
                        $jumlahtotalsebelum += $sb->subtotal;
                        $jumlahtotalsesudah += $sb->subtotalsetelah;
                    @endphp
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->kodemataanggaran == 'III')
                    @php
                        $jumlahtotalsebelum += $sb->subtotal;
                        $jumlahtotalsesudah += $sb->subtotalsetelah;
                    @endphp
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->kodemataanggaran == 'II')
                    @php
                        $jumlahtotalsebelum += $sb->subtotal;
                        $jumlahtotalsesudah += $sb->subtotalsetelah;
                    @endphp
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif(strpos($sb->kodemataanggaran,'I.') !== false && strlen($sb->kodemataanggaran) == 3)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[1] }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif(strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 5)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[1] }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif(strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 9)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[2].'.'.$char[3] }}</td>
                    <td align="left" width="200"  style="padding: 10px;">{{ $sb->keterangan }}</td>
                    @elseif(strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 4)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[1] }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif(strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 8)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[2].'.'.$char[3] }}</td>
                    <td align="left" width="200"  style="padding: 10px;">{{ $sb->keterangan }}</td>
                    @elseif((strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && strlen($sb->kodemataanggaran) == 5)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[2] }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif((strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && (strlen($sb->kodemataanggaran) == 9 || strlen($sb->kodemataanggaran) == 10))
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[3].'.'.$char[4] }}</td>
                    <td align="left" width="200"  style="padding: 10px;">{{ $sb->keterangan }}</td>
                    @else
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @endif
                    @if($sb->jml != 0)
                    <td align="right" width="50"  style="padding: 10px; ">{{ $sb->jml }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 10px; "></td>
                    @endif
                    <td align="center" width="50"  style="padding: 10px; ">{{ $sb->satuan }}</td>
                    @if($sb->hargasatuan != 0)
                    <td align="right" width="50"  style="padding: 10px; ">{{ number_format($sb->hargasatuan,0,',','.') }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 10px; "></td>
                    @endif
                    @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotal,0,',','.') }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 10px;">{{ number_format($sb->subtotal,0,',','.') }}</td>
                    @endif
                    @if($sb->jml != 0)
                    <td align="right" width="50"  style="padding: 10px; ">{{ $sb->jmlsetelah }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 10px; "></td>
                    @endif
                    <td align="center" width="50"  style="padding: 10px; ">{{ $sb->satuansetelah }}</td>
                    @if($sb->hargasatuan != 0)
                    <td align="right" width="50"  style="padding: 10px; ">{{ number_format($sb->hargasatuansetelah,0,',','.') }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 10px; "></td>
                    @endif
                    @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotalsetelah,0,',','.') }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 10px;">{{ number_format($sb->subtotalsetelah,0,',','.') }}</td>
                    @endif
                    @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                        @if($sb->subtotalsetelah > $sb->subtotal)
                        @php
                            $jumlahtotalselisih += ($sb->subtotalsetelah - $sb->subtotal) 
                        @endphp
                        <td align="right" width="25"  style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotalsetelah - $sb->subtotal,0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 10px; font-weight: bold ">{{ number_format(($sb->subtotalsetelah - $sb->subtotal)/$sb->subtotal*100,0,',','.') }}</td>
                        @elseif($sb->subtotalsetelah < $sb->subtotal)
                        @php
                            $jumlahtotalselisih += ($sb->subtotal - $sb->subtotalsetelah)
                        @endphp
                        <td align="right" width="25"  style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotal - $sb->subtotalsetelah,0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 10px; font-weight: bold ">{{ number_format(($sb->subtotal - $sb->subtotalsetelah)/$sb->subtotal*100,0,',','.') }}</td>
                        @else
                        <td align="right" width="25"  style="padding: 10px; font-weight: bold ">{{ number_format(0,0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 10px; font-weight: bold ">{{ number_format(0,0,',','.') }}</td>
                        @endif
                    @else
                        @if($sb->subtotalsetelah > $sb->subtotal)
                        <td align="right" width="25"  style="padding: 10px;">{{ number_format($sb->subtotalsetelah - $sb->subtotal,0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 10px;">{{ number_format(($sb->subtotalsetelah - $sb->subtotal)/$sb->subtotal*100,0,',','.') }}</td>
                        @elseif($sb->subtotalsetelah < $sb->subtotal)
                        <td align="right" width="25"  style="padding: 10px;">{{ number_format($sb->subtotal - $sb->subtotalsetelah,0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 10px;">{{ number_format(($sb->subtotal - $sb->subtotalsetelah)/$sb->subtotal*100,0,',','.') }}</td>
                        @else
                        <td align="right" width="25"  style="padding: 10px;">{{ number_format(0,0,',','.') }}</td>
                        <td align="right" width="25"  style="padding: 10px;">{{ number_format(0,0,',','.') }}</td>
                        @endif
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td align="center" width="50" colspan="8"  style="padding: 10px; font-weight: bold ">JUMLAH TOTAL</td>
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalsebelum,0,',','.') }}</td>
                    <td align="center" width="50" colspan="3"  style="padding: 10px; font-weight: bold "></td>
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalsesudah,0,',','.') }}</td>
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalselisih,0,',','.') }}</td>
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalselisih/$jumlahtotalsebelum*100,0,',','.') }}</td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF">
            <thead>
                <tr>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 180px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Mengetahui,
                            </font>
                        </p>
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 180px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Yogyakarta, {{ date('d M Y') }}
                            </font>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-bottom:50px">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Kepala Dinas Kesehatan DIY
                            </font>
                        </p>
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-bottom:50px">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Kepala BLUD RS Jiwa GRHASIA DINKES DIY
                            </font>
                        </p>
                    </td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 50px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    drg. Pembajun Setyaningastutie, M.Kes
                            </font>
                        </p>
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 50px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    dr. Akhmad Akhadi Syamsudhuha, M.P.H
                            </font>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p align="center" style="margin-right: 30px; ">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                            NIP. 19650912 199303 2 006
                            </font>
                        </p>
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; ">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                            NIP. 19680714 200012 1 002
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