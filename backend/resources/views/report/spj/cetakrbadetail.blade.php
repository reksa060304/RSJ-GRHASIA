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
                @if($sebelum != [])
                {{substr($itahap[0]->tahap, 0, -3)}}
                @endif
            </td>
        </tr>
        <tr align="center">
            <td style="border-top: 3px solid black;">
                <b>RS Jiwa GRHASIA<br>TAHUN 2022</b>
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
            </td>
        </tr>
        <tr >
            <td colspan="3" style="border-top: 3px solid black;">
                <table class="tabel" width="{{$pageWidth}}" bgcolor="#FFFFFF" style="border: 1px solid black; margin-top:10px; margin-bottom:10px;">
                    <tr>
                        <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Indikator</td>
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
                        @if($sebelum != [])
                            @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                            @php
                            $jumlahtotal+=$sb->subtotaljasalayanan;
                            $jumlahtotal+=$sb->subtotalapbd;
                            @endphp
                            @endif
                        @endif
                        @endforeach
                        <td align="left" width="50"  style="padding: 10px;">{{ "Rp " . number_format($jumlahtotal,2,',','.') }}</td>
                    </tr>
                    <tr>
                        <td align="left" width="100"  style="padding: 10px;">Keluaran</td>
                        <td align="left" width="50"  style="padding: 10px;">
                            <textarea name="" id="" cols="60" rows="7">{{ $data[0]->indikatorkeluaran }}</textarea>
                        </td>
                        <td align="left" width="50"  style="padding: 10px;">
                            <textarea name="" id="" cols="60" rows="7">{{ $data[0]->targetkeluaran }}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" width="50"  style="padding: 10px;">Hasil</td>
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
                    <td align="center" width="50"  rowspan="2" colspan="4" style="padding: 10px; font-weight: bold ">NO. REKENING</td>
                    <td align="center" width="50"  rowspan="2" style="padding: 10px; font-weight: bold ">KOMPONEN BIAYA</td>
                    <td align="center" width="50"  colspan="3" style="padding: 10px; font-weight: bold ">RINCIAN BIAYA</td>
                    <td align="center" width="50"  colspan="2" style="padding: 10px; font-weight: bold ">JUMLAH ANGGARAN</td>
                </tr>
                <tr>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Jumlah</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Satuan</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Harga Satuan</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">Jasa Layanan</td>
                    <td align="center" width="50"  style="padding: 10px; font-weight: bold ">APBD</td>
                </tr>
                @php
                    $jumlahtotaljasalayanan = 0;
                    $jumlahtotalapbd = 0;
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
                    @endphp
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->kodemataanggaran == 'III')
                    @php
                    $jumlahtotaljasalayanan+=$sb->subtotaljasalayanan;
                    $jumlahtotalapbd+=$sb->subtotalapbd;
                    @endphp
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->kodemataanggaran == 'II')
                    @php
                    $jumlahtotaljasalayanan+=$sb->subtotaljasalayanan;
                    $jumlahtotalapbd+=$sb->subtotalapbd;
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
                    @elseif($sb->jml == 0 && strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 9)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[2].'.'.$char[3] }}</td>
                    <td align="left" width="200"  style="padding: 10px;">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml != 0 && strpos($sb->kodemataanggaran,'III.') !== false && strlen($sb->kodemataanggaran) == 9)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px;">{{ $sb->keterangan }}</td>
                    @elseif(strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 4)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[1] }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml == 0 && strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 8)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[2].'.'.$char[3] }}</td>
                    <td align="left" width="200"  style="padding: 10px;">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml != 0 && strpos($sb->kodemataanggaran,'II.') !== false && strlen($sb->kodemataanggaran) == 8)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px;">{{ $sb->keterangan }}</td>
                    @elseif((strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && strlen($sb->kodemataanggaran) == 5)
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[2] }}</td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="left" width="200"  style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml == 0 && (strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && (strlen($sb->kodemataanggaran) == 9 || strlen($sb->kodemataanggaran) == 10))
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold ">{{ $char[3].'.'.$char[4] }}</td>
                    <td align="left" width="200"  style="padding: 10px;">{{ $sb->keterangan }}</td>
                    @elseif($sb->jml != 0 && (strpos($sb->kodemataanggaran,'I.A.') !== false || strpos($sb->kodemataanggaran,'I.B.') !== false) && (strlen($sb->kodemataanggaran) == 9 || strlen($sb->kodemataanggaran) == 10))
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
                    <td align="center" width="25"  style="padding: 10px; font-weight: bold "></td>
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
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                    @else
                    <td align="right" width="50"  style="padding: 10px;">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                    <td align="right" width="50"  style="padding: 10px;">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td align="center" width="50" colspan="8"  style="padding: 10px; font-weight: bold ">JUMLAH TOTAL</td>
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotaljasalayanan,0,',','.') }}</td>
                    <td align="right" width="50"  style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalapbd,0,',','.') }}</td>
                </tr>
        </table>
        <table width="{{$pageWidth}}" bgcolor="#FFFFFF">
            <thead>
                <tr>
                    <td width="300">
                    </td>
                    <td width="300">
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-top: 50px;">
                            <font style="font-size: 12pt; " color="#000000" face="Arial">
                                    Yogyakarta, {{ $tanggalcetak }}
                            </font>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td width="300">
                    </td>
                    <td width="300">
                    </td>
                    <td>
                        <p align="center" style="margin-right: 30px; margin-bottom:50px">
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
                    <td width="300">
                    </td>
                    <td width="300">
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
                    <td width="300">
                    </td>
                    <td width="300">
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