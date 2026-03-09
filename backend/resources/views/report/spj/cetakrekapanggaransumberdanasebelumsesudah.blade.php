<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rekap RBA Sumber Dana</title>
</head>
<style>
    @page {
        size: 700mm 297mm;
        margin: 5mm 8mm;
        padding: 0;
    }

    @page :first {
        size: 700mm 297mm;
        margin: 5mm 8mm;
    }

    @media print {
        body {
            margin: 0;
        }
    }

    body {
        font-family: Arial;
    }

    table {
        font-family: 'Arial';
        margin: 0;
        padding: 0;
        font-size: 9pt;
    }

    #kop {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }
    #kop tbody tr td {
        border: 1px solid black;
    }

    #konten {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }
    #konten tr td {
        border: 1px solid black;
        padding: 4px 5px;
    }
    #konten thead td {
        font-weight: bold;
        text-transform: uppercase;
    }
</style>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="padding: 0;">
                {{-- Kop --}}
                <table id="kop" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                        <tr>
                            <td style="padding: 5px; width: 15%;">
                                <p align="center">
                                    @if(stripos(\Request::url(), 'localhost') !== FALSE)
                                    <img src="{{ asset('img/LOGO GRHASIA.png') }}" style="width: 100px">
                                    @else
                                    <img src="{{ asset('service/img/LOGO GRHASIA.png') }}" style="width: 100px">
                                    @endif
                                </p>
                            </td>
                            <td align="center" style="padding: 5px; width: auto;">
                                <b style="font-size: 23px;">
                                    RENCANA BISNIS DAN ANGGARAN<br>
                                    BADAN LAYANAN UMUM DAERAH<br>
                                    RS JIWA GRHASIA
                                </b>
                            </td>
                            <td align="center" style="padding: 5px; width: 15%;">
                                <b style="font-size: 23px;">RBA</b><br>
                                {{ isset($sebelum[0]) ? substr($sebelum[0]->tahapsesudah, 0) : '' }}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <p align="center" style="margin-top: 10px; margin-bottom:10px">
                                    <font style="font-size: 12pt;" color="#000000">
                                        <b>REKAP ANGGARAN TIAP SUB KEGIATAN (SUMBERDANA)<br>TAHUN ANGGARAN {{ date('Y') }}</b>
                                    </font>
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding: 0;">
                {{-- Tabel Data --}}
                <table id="konten" width="100%">
                    <thead>
                        <tr>
                            <td rowspan="2" style="text-align:center; width:50px;">NO</td>
                            <td rowspan="2" style="text-align:center; width:300px;">KETERANGAN</td>
                            <td colspan="6" style="text-align:center;">ANGGARAN SEBELUM PERUBAHAN</td>
                            <td colspan="6" style="text-align:center;">ANGGARAN SESUDAH PERUBAHAN</td>
                            <td rowspan="2" style="text-align:center;">BERTAMBAH / BERKURANG</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">JASA LAYANAN</td>
                            <td style="text-align:center;">APBD</td>
                            <td style="text-align:center;">DAK</td>
                            <td style="text-align:center;">DANAIS</td>
                            <td style="text-align:center;">SILPA</td>
                            <td style="text-align:center;">SUB TOTAL</td>
                            <td style="text-align:center;">JASA LAYANAN</td>
                            <td style="text-align:center;">APBD</td>
                            <td style="text-align:center;">DAK</td>
                            <td style="text-align:center;">DANAIS</td>
                            <td style="text-align:center;">SILPA</td>
                            <td style="text-align:center;">SUB TOTAL</td>
                        </tr>
                    </thead>
                    <tbody>
                        @php
                        $sebelumjasalayanan   = 0;
                        $sebelumapbd          = 0;
                        $sebelumdak           = 0;
                        $sebelumdanais        = 0;
                        $sebelumsilpa         = 0;
                        $sebelumtotal         = 0;
                        $sesudahjasalayanan   = 0;
                        $sesudahapbd          = 0;
                        $sesudahdak           = 0;
                        $sesudahdanais        = 0;
                        $sesudahsilpa         = 0;
                        $sesudahtotal         = 0;
                        $berkurang            = 0;
                        @endphp

                        @foreach($sebelum as $sb)
                        @php
                        // Akumulasi untuk total sebelum/sesudah (hanya level div == 2 agar tidak double count)
                        if ($sb->div == 2) {
                            $sebelumjasalayanan   += $sb->jasalayanan;
                            $sebelumapbd          += $sb->apbd;
                            $sebelumdak           += $sb->dak;
                            $sebelumdanais        += $sb->danais;
                            $sebelumsilpa         += $sb->silpa;
                            $sebelumtotal         += $sb->total;
                            $sesudahjasalayanan   += $sb->kjasalayanan;
                            $sesudahapbd          += $sb->kapbd;
                            $sesudahdak           += $sb->kdak;
                            $sesudahdanais        += $sb->kdanais;
                            $sesudahsilpa         += $sb->ksilpa;
                            $sesudahtotal         += $sb->ktotal;
                        }
                        // Jumlahkan semua nilai bertambah/berkurang yang tampil di kolom (tanpa filter div)
                        $berkurang += abs($sb->ktotal - $sb->total);
                        @endphp
                        <tr>
                            {{-- Kolom NO / Kode Rekening --}}
                            @if($sb->div == 1)
                            <td style="text-align:left; font-weight:bold;">{{ $sb->kode }}</td>
                            @elseif($sb->div == 2)
                            <td style="text-align:left; font-weight:bold;">{{ $sb->kode }}</td>
                            @elseif($sb->div == 3)
                            <td style="text-align:left;">{{ $sb->kode }}</td>
                            @else
                            <td style="text-align:left;">{{ $sb->kode }}</td>
                            @endif

                            {{-- Kolom KETERANGAN --}}
                            @if($sb->div == 1)
                            <td style="text-align:left; font-weight:bold;">{{ $sb->kegiatan }}</td>
                            @elseif($sb->div == 2)
                            <td style="text-align:left; font-weight:bold;">{{ $sb->kegiatan }}</td>
                            @elseif($sb->div == 3)
                            <td style="text-align:left;">{{ $sb->kegiatan }}</td>
                            @else
                            <td style="text-align:left;">{{ $sb->kegiatan }}</td>
                            @endif

                            @php $bold = $sb->div <= 2 ? 'font-weight:bold;' : ''; @endphp

                            {{-- Sebelum Perubahan --}}
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->jasalayanan == 0 ? '' : number_format($sb->jasalayanan, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->apbd == 0 ? '' : number_format($sb->apbd, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->dak == 0 ? '' : number_format($sb->dak, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->danais == 0 ? '' : number_format($sb->danais, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->silpa == 0 ? '' : number_format($sb->silpa, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->total == 0 ? '' : number_format($sb->total, 0, ',', '.') }}
                            </td>

                            {{-- Sesudah Perubahan --}}
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->kjasalayanan == 0 ? '' : number_format($sb->kjasalayanan, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->kapbd == 0 ? '' : number_format($sb->kapbd, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->kdak == 0 ? '' : number_format($sb->kdak, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->kdanais == 0 ? '' : number_format($sb->kdanais, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->ksilpa == 0 ? '' : number_format($sb->ksilpa, 0, ',', '.') }}
                            </td>
                            <td style="text-align:right; {{ $bold }}">
                                {{ $sb->ktotal == 0 ? '' : number_format($sb->ktotal, 0, ',', '.') }}
                            </td>

                            {{-- Bertambah/Berkurang: Sub Total saja --}}
                            @php $diffTotal = $sb->ktotal - $sb->total; @endphp
                            <td style="text-align:right; {{ $bold }}">
                                {{ $diffTotal == 0 ? '-' : number_format(abs($diffTotal), 0, ',', '.') }}
                            </td>
                        </tr>
                        @endforeach

                        {{-- Baris Total --}}
                        <tr>
                            <td colspan="2" style="font-weight:bold; text-align:center;">JUMLAH TOTAL</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sebelumjasalayanan, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sebelumapbd, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sebelumdak, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sebelumdanais, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sebelumsilpa, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sebelumtotal, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sesudahjasalayanan, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sesudahapbd, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sesudahdak, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sesudahdanais, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sesudahsilpa, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($sesudahtotal, 0, ',', '.') }}</td>
                            <td style="font-weight:bold; text-align:right;">{{ number_format($berkurang, 0, ',', '.') }}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </table>

    {{-- Tanda Tangan --}}
    <table cellpadding="0" cellspacing="0" width="300" border="0" style="margin-left: auto; margin-right: 0;">
        <thead>
            <tr>
                <td>
                    <p align="center" style="margin-top: 20px; margin-bottom: 0;">
                        <font style="font-size: 12pt;" color="#000000" face="Arial">
                            Yogyakarta, {{ $tanggalcetak }}
                        </font>
                    </p>
                    <p align="center" style="margin: 0 0 60px 0;">
                        <font style="font-size: 12pt;" color="#000000" face="Arial">
                            Direktur
                        </font>
                    </p>
                    <p align="center" style="margin: 0;">
                        <font style="font-size: 12pt;" color="#000000" face="Arial">
                            <u>{{ isset($settingrba[0]) ? $settingrba[0]->namalengkap : '' }}</u>
                        </font>
                    </p>
                    <p align="center" style="margin: 0;">
                        <font style="font-size: 12pt;" color="#000000" face="Arial">
                            NIP. {{ isset($settingrba[0]) ? $settingrba[0]->nippns : '' }}
                        </font>
                    </p>
                </td>
            </tr>
        </thead>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>