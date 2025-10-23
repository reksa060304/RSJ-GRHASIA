<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Surat KGB : {{ $data[0]->namalengkap }}</title>

    <style>
        @page {
            size: A4;
            margin: 0.5cm 0.7cm;
        }

        body {
            font-family: "Times New Roman", serif;
            font-size: 10pt;
            line-height: 1;
            margin: 0.5cm 0.7cm;
            color: #000;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            vertical-align: top;
        }

        .center { text-align: center; }

        /* HEADER */
        .header-table td { padding: 0; }
        .logo {
            display: block;
            margin: 0 auto;
            width: 50px;
            height: auto;
        }
        .kop span { display: block; }

        hr {
            border: 0.5px solid #000;
            margin: 1px 0;
        }

        /* ISI */
        .indent {
            text-indent: 1cm;
            text-align: justify;
            margin: 10px 0;
        }

        .tabel-data {
            margin-left: 1cm;
            margin-top: 2px;
            line-height: 1;
        }

        .tabel-data td {
            padding: 1px 2px;
        }

        /* TTD */
        .signature {
            text-align: center;
            margin-top: 2px;
            font-size: 8pt;
            width: 30%;
            /* margin-left: 70%; */
            line-height: 1;
        }

        .signature hr {
            text-align: right;
            border: 0.5px solid #000;
            width: 30%;
            /* margin-left: 70%; */
        }

        /* TEMBUSAN */
        .tembusan {
            margin-left: 1cm;
            font-size: 7pt;
            line-height: 1;
        }

        .tembusan td {
            padding-bottom: 1px;
        }
    </style>
</head>

<body>

    {{-- HEADER --}}
    <table class="header-table">
        <tr>
            <td width="100%">
                <img src="{{ asset(stripos(\Request::url(), 'localhost') !== FALSE ? 'img/header_word.png' : 'service/img/header_word.png') }}" class="logo">
            </td>
           
        </tr>
    </table>

    {{-- JUDUL --}}
    <div class="center" style="margin-top: 8px;">
        <b><u>SURAT PEMBERITAHUAN KENAIKAN GAJI BERKALA</u></b><br>
        NOMOR: {{ $data[0]->nosk }}
    </div>

    {{-- KEPADA --}}
    <div style="margin-top: 15px; padding-left: 25%;">
        Kepada Yth:<br>
        Kepala Badan Pengelola Keuangan dan Aset<br>
        c.q. Kepala Bidang Pengelolaan Kas Daerah DIY<br>
        di -<br>
        Yogyakarta
    </div>

    {{-- ISI --}}
    <p class="indent">
        Dengan ini diberitahukan bahwa berhubung telah dipenuhi masa kerja dan syarat-syarat lainnya maka kepada:
    </p>

    <table class="tabel-data">
        <tr><td>1.</td><td>N a m a</td><td>:</td><td>{{ $data[0]->namalengkap }}</td></tr>
        <tr><td>2.</td><td>NIP</td><td>:</td><td>{{ $data[0]->nippns }}</td></tr>
        <tr><td>3.</td><td>Pangkat/Golongan</td><td>:</td><td>{{ $data[0]->panggol }}</td></tr>
        <tr><td>4.</td><td>Instansi</td><td>:</td><td>Rumah Sakit Jiwa Grhasia Dinkes DIY</td></tr>
        <tr><td>5.</td><td>Gaji Pokok Lama</td><td>:</td><td>{{ $data[0]->gajiawal }}</td></tr>
        <tr>
            <td></td><td>Berdasarkan</td><td>:</td>
            <td>
                @if ($data[0]->jenisskco == 'KGB')
                    Surat Pemberitahuan Kenaikan Gaji Berkala
                @elseif($data[0]->jenisskco == 'KP')
                    Surat Keputusan Kenaikan Pangkat
                @endif
            </td>
        </tr>
        <tr><td></td><td style="padding-left:20px;">Nomor</td><td>:</td><td>{{ $data[0]->sklama }}</td></tr>
        <tr><td></td><td style="padding-left:20px;">Tanggal</td><td>:</td><td>{{ $data[0]->tglsklama }}</td></tr>
        <tr><td></td><td style="padding-left:20px;">Terhitung Mulai Tanggal</td><td>:</td><td>{{ $data[0]->tmtlama }}</td></tr>
    </table>

    <p class="indent" style="margin-top: 8px;">
        Diberikan Kenaikan Gaji Berkala sehingga memperoleh:
    </p>

    <table class="tabel-data">
        <tr><td>1.</td><td>Gaji Pokok Baru</td><td>:</td><td>{{ $data[0]->gajiakhir }}</td></tr>
        <tr><td>2.</td><td>Berdasarkan Masa Kerja</td><td>:</td>
            <td>{{ explode(" ", $data[0]->masakerjagolongan)[0] }} Th {{ sprintf("%02d", explode(" ", $data[0]->masakerjagolongan)[2]) }} Bln</td></tr>
        <tr><td>3.</td><td>Dalam Golongan Ruang</td><td>:</td><td>{{ $data[0]->golongan }}</td></tr>
        <tr><td>4.</td><td>Terhitung Mulai Tanggal</td><td>:</td><td>{{ $data[0]->tmtbaru }}</td></tr>
    </table>

    <p class="indent" style="margin-top: 10px;">
        Diharap agar sesuai dengan Peraturan Pemerintah {{ $data[0]->namask }}. Pegawai tersebut dapat dibayarkan penghasilannya berdasarkan gaji pokok yang baru.
    </p>

    {{-- TANDA TANGAN --}}
    {{-- <div class="signature">
        <div>Yogyakarta, {{ $data[0]->tglttd }}</div>
        <div style="margin-top: 5px;">DIREKTUR,</div>
        <div style="margin-top: 30px;">
        <b>dr. AKHMAD AKHADI S., M.P.H.</b>
        </div>
        <hr>
        <b>NIP. 19680714 200012 1 002</b>
    </div> --}}
    <table width="100%">
        <tr>
            <td width="30%">&nbsp;</td>
            <td width="40%">&nbsp;</td>
            <td width="30%"><div class="signature">
        <div>Yogyakarta, {{ $data[0]->tglttd }}</div>
        <div style="margin-top: 5px;">DIREKTUR,</div>
        <div style="margin-top: 30px;">
        <b>dr. AKHMAD AKHADI S., M.P.H.</b>
        </div>
        <hr>
        <b>NIP. 19680714 200012 1 002</b>
    </div></td>
        </tr>
    </table>

    {{-- TEMBUSAN --}}
    <table class="tembusan">
        <tr><td colspan="2">Tembusan disampaikan kepada Yth.:</td></tr>
        <tr><td>1.</td><td>Kepala Dinas Kesehatan DIY</td></tr>
        <tr><td>2.</td><td>Kepala Badan Kepegawaian Daerah DIY</td></tr>
        <tr><td>3.</td><td>Inspektur DIY</td></tr>
        <tr><td>4.</td><td>Ka. Kantor Cabang PT. TASPEN (PERSERO) Yogyakarta</td></tr>
        <tr><td>5.</td><td>Pertinggal</td></tr>
    </table>

</body>
</html>
