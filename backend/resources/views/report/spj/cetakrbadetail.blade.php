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
        margin:15mm 15mm 20mm 20mm;
    }

    @page :first {
        margin:15mm 15mm 20mm 20mm;
    }

    @media print {
    body {
        margin:0;
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
<body style="width:27cm;">
<div>
<table cellpadding="0" cellspacing="0"  border="0" class="tabel">
        <tbody >
        <tr>
            <td rowspan="2"  style="padding: 5px; width: 50px;" align="center">
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
            <td rowspan="2"  align="center" style="width: 150px;">
                <b style="font-size: 25px;">
                    RBA
                </b><br>
                @if($sebelum != [])
                {{substr($itahap[0]->tahap, 0, -3)}}
                @endif
            </td>
        </tr>
        <tr align="center">
            <td>
                <b>RS Jiwa GRHASIA<br>TAHUN {{ date('Y') }}</b>
            </td>
        </tr>
        <tr >
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
    <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabelss">
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
        <table cellpadding="0" cellspacing="0" width="100%"  border="0" class="tabels">
                    <tr>
                        <td align="center" style="padding: 5px; font-weight: bold ">Indikator</td>
                        <td align="center" style="padding: 5px; font-weight: bold ">Tolok Ukur</td>
                        <td align="center" style="padding: 5px; font-weight: bold ">Target Kinerja</td>
                    </tr>
                    <tr>
                        <td align="left" style="padding: 5px;">Masukan</td>
                        <td align="left" style="padding: 5px;">Dana</td>
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
                        <td align="left" style="padding: 5px;">{{ "Rp " . number_format($jumlahtotal,2,',','.') }}</td>
                    </tr>
                    <tr>
                        <td align="left" style="padding: 5px;">Keluaran</td>
                        <td align="left" style="padding: 5px;">
                            <textarea name="" id="" cols="60" rows="7" style="font-size: 11pt;">{{ $data[0]->indikatorkeluaran }}</textarea>
                        </td>
                        <td align="left" style="padding: 5px; font-size: 11pt;">
                            <textarea name="" id="" cols="60" rows="7">{{ $data[0]->targetkeluaran }}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding: 5px;">Hasil</td>
                        <td align="left" style="padding: 5px;">{{ $data[0]->indikatorhasil }}</td>
                        <td align="left" style="padding: 5px;">{{ $data[0]->targethasil }}</td>
                    </tr>
    </table>
    <table cellpadding="0" cellspacing="0"  border="0" class="tabel">
                <tr>
                    <td align="center" rowspan="2" colspan="4" style="padding: 10px; font-weight: bold ">NO. REKENING</td>
                    <td align="center" rowspan="2" style="padding: 10px; font-weight: bold ">KOMPONEN BIAYA</td>
                    <td align="center" colspan="3" style="padding: 10px; font-weight: bold ">RINCIAN BIAYA</td>
                    <td align="center" colspan="2" style="padding: 10px; font-weight: bold ">JUMLAH ANGGARAN</td>
                </tr>
                <tr>
                    <td align="center" style="padding: 10px; font-weight: bold ">Jumlah</td>
                    <td align="center" style="padding: 10px; font-weight: bold ">Satuan</td>
                    <td align="center" style="padding: 10px; font-weight: bold ">Harga Satuan</td>
                    <td align="center" style="padding: 10px; font-weight: bold ">Jasa Layanan</td>
                    <td align="center" style="padding: 10px; font-weight: bold ">APBD</td>
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
                    <td align="center" style="padding: 10px; font-weight: bold ">{{ $sb->kodemataanggaran }}</td>
                    <td align="center" style="padding: 10px; font-weight: bold "></td>
                    <td align="center" style="padding: 10px; font-weight: bold "></td>
                    <td align="center" style="padding: 10px; font-weight: bold "></td>
                    <td align="left" style="padding: 10px; font-weight: bold ">{{ $sb->keterangan }}</td>
                    @elseif($sb->kodemataanggaran == 'III')
                    @php
                    $jumlahtotaljasalayanan+=$sb->subtotaljasalayanan;
                    $jumlahtotalapbd+=$sb->subtotalapbd;
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
                    <td align="center" style="padding: 10px; font-weight: bold ">{{ $char[2].'.'.$char[3] }}</td>
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
                    <td align="center" style="padding: 10px; font-weight: bold ">{{ $char[2].'.'.$char[3] }}</td>
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
                    <td align="center" style="padding: 10px; font-weight: bold ">{{ $char[3].'.'.$char[4] }}</td>
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
                    @if($sb->kodemataanggaran == 'I' || $sb->kodemataanggaran == 'II' || $sb->kodemataanggaran == 'III')
                    <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                    @else
                    <td align="right" style="padding: 10px;">{{ number_format($sb->subtotaljasalayanan,0,',','.') }}</td>
                    <td align="right" style="padding: 10px;">{{ number_format($sb->subtotalapbd,0,',','.') }}</td>
                    @endif
                </tr>
                @endforeach
                <tr>
                    <td align="center" colspan="8"  style="padding: 10px; font-weight: bold ">JUMLAH TOTAL</td>
                    <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotaljasalayanan,0,',','.') }}</td>
                    <td align="right" style="padding: 10px; font-weight: bold ">{{ number_format($jumlahtotalapbd,0,',','.') }}</td>
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
                                   <u>dr. Akhmad Akhadi Syamsudhuha, M.P.H</u>
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