{{-- @extends('report.dom') --}}
@php
    function toUppercase($string) {
        if(is_null($string)) return '';
        $string = str_replace(['-', '_'], ' ', $string); 
        return ucwords(strtolower($string));
    }
    
    function getCheckBox($value) {
        return (!empty($value) && $value != '0') ? '[ / ]' : '[ ]';
    }
@endphp
<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>FORMULIR TRANSFER PASIEN</title>
    {{-- @if (stripos(\Request::url(), 'localhost') !== false) --}}
        <link rel="stylesheet" href="css/report/paper.css">
        <link rel="stylesheet" href="css/report/table.css">
        <link rel="stylesheet" href="css/report/tabel.css">

        <link href="css/style.css" rel="stylesheet">
    {{-- @else
        <link rel="stylesheet" href="service/css/report/paper.css">
        <link rel="stylesheet" href="service/css/report/table.css">
        <link rel="stylesheet" href="service/css/report/tabel.css">

        <link href="service/css/style.css" rel="stylesheet">
    @endif --}}

    <style>
        @page {
            size: A4;
            margin: 5mm 5mm 6mm 5mm;
        }

        body {
            margin: 0 !important;
            padding: 0 !important;
            font-family: Arial, sans-serif;
            font-size: 11px;
        }

        .page {
            page-break-after: always;
        }

        .block {
            break-inside: avoid;
            page-break-inside: avoid;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
        }

        .header-table td {
            border: none;
            padding: 2px;
        }

        .title-section {
            font-weight: bold;
            font-size: 11px;
            padding: 6px;
            background-color: #f0f0f0;
            border: 1px solid #000;
        }

        .checkbox-row {
            padding: 3px;
        }

        .content-row td {
            border: 1px solid #000;
            padding: 3px;
            height: 20px;
        }

        .footer2 {
            text-align: center;
            margin-top: 30px;
        }

        .text-center {
            text-align: center;
        }

        .bold {
            font-weight: bold;
        }
    </style>

</head>
<body>
    <section class="block" style="font-family:Arial;">
        <!-- HEADER -->
        <table cellspacing="0" cellpadding="0" border="0" class="header-table">
            <tr>
                <td style="text-align: center;" width="10%">
                        <img src="img/diy.png" alt="Logo" style="width: 100px; margin: 0 !important;
                        padding: 0 !important;">
                </td>
                <td style="text-align: center;vertical-align: top" width="35%">
                    <p style="margin:0; padding:0; font-size: 10px; font-weight: bold;">{{ $res['profile']->baris1 }}</p>
                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ $res['profile']->baris2 }}</p>
                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ strtoupper($res['profile']->namalengkap) }}</p>
                    <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 140px;"><br>
                    <p style="font-size:8pt; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $res['profile']->kodepos }}</p>
                    <p style="font-size:8pt; margin:0;">Telp: (0274) 895143, 895297 | Faks: {{ $res['profile']->faksimile }}</p>
                </td>
                <td width="25%" style="vertical-align: middle">
                            <img src="img/logo_grhasia_full.png" alt="Logo" style="width: 180px; margin: 0 !important;
                            padding: 0 !important;">
                </td>
                <td width="30%" style="vertical-align: top">
                    <table width="100%" style="font-size:11px;" border="1" class="header-table">
                        <tr>
                            <td style="font-size: 10px; font-weight: bold;">No. RM :</td>
                            <td style="font-size: 10px;"> {{ $data[0]->nocm }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 10px; font-weight: bold;">Nama :</td>
                            <td style="font-size: 10px;"> {{ $data[0]->namapasien }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 10px; font-weight: bold;">Tgl Lahir :</td>
                            <td style="font-size: 10px;"> {{ date('d-m-Y',strtotime( $data[0]->tgllahir ))  }}  </td>
                        </tr>
                        <tr>
                            <td style="font-size: 10px; font-weight: bold;">Jenis Kelamin :</td>
                            <td style="font-size: 10px;"> {{ $data[0]->jeniskelamin }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                    <td colspan="4">
                        <hr>
                    </td>
                </tr>
                <tr>
                    <th style=" font-size: 15px; padding-bottom: 8px; padding-top: 5px; border: none; text-align: center;" colspan="6">FORMULIR TRANSFER PASIEN</th>
            </tr>
        </table>
        <div style="padding: 10px;">
            <table width="100%" cellspacing="0" cellpadding="4" style="font-size:11px; border-collapse: collapse;" border="1">
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">SITUASI</th>
                </tr>
                <tr>
                    <td style="width: 16%;"><strong>Hari / Tanggal Pindah</strong></td>
                    <td style="width: 34%;">{{ !empty($item[3013350]) ? date('d-m-Y H:i', strtotime($item[3013350])) : '' }}</td>
                    <td style="width: 16%;"><strong>Asal Pasien</strong></td>
                    <td style="width: 34%;">
                        Ruang: {{ $item[3013357] ?? '' }}<br>
                        Dokter yang merawat: {{ $item[3013358] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td><strong>Diagnosa Medis</strong></td>
                    <td colspan="3">{{ $item[3013351] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>Pindah Ke</strong></td>
                    <td>{{ $item[3013359] ?? '' }}</td>
                    <td><strong>Dokter yang merawat</strong></td>
                    <td>{{ $item[3013360] ?? '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">BACKGROUND</th>
                </tr>
                <tr>
                    <td><strong>Kondisi Pasien</strong></td>
                    <td>{{ !empty($item[3013361]) ? date('H:i', strtotime($item[3013361])) : '' }}</td>
                    <td><strong>Kesadaran</strong></td>
                    <td>{{ $item[3013362] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>GCS</strong></td>
                    <td>{{ $item[3013363] ?? '' }}</td>
                    <td><strong>PANSS-EC</strong></td>
                    <td>{{ $item[3013364] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>TD</strong></td>
                    <td>{{ $item[3013365] ?? '' }}</td>
                    <td><strong>N</strong></td>
                    <td>{{ $item[3013366] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>R</strong></td>
                    <td>{{ $item[3013367] ?? '' }}</td>
                    <td><strong>T</strong></td>
                    <td>{{ $item[3013368] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>Temuan Signifikan:</strong> {{ $item[3013460] ?? '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">TINDAKAN & OBSERVASI</th>
                </tr>
                <tr>
                    <td colspan="4">
                        <table width="100%" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
                            <tr>
                                <td style="width: 25%; vertical-align: top; border: 1px solid #000;"><strong>TIANGKAT NYERI</strong><br>
                                    {{ getCheckBox($item[3013369] ?? '') }} Tidak<br>
                                    {{ getCheckBox($item[3013370] ?? '') }} Ya<br>
                                    {{ getCheckBox($item[3013371] ?? '') }} Ringan<br>
                                    {{ getCheckBox($item[3013372] ?? '') }} Sedang<br>
                                    {{ getCheckBox($item[3013373] ?? '') }} Berat<br>
                                    {{ getCheckBox($item[3013374] ?? '') }} Akut<br>
                                    {{ getCheckBox($item[3013375] ?? '') }} Kronik
                                </td>
                                <td style="width: 25%; vertical-align: top; border: 1px solid #000;"><strong>THERAPY OKSIGEN</strong><br>
                                    {{ getCheckBox($item[3013376] ?? '') }} Ya<br>
                                    {{ getCheckBox($item[3013377] ?? '') }} Tidak<br>
                                    <br>
                                    {{ getCheckBox($item[3013378] ?? '') }} Nasal Kanul<br>
                                    {{ getCheckBox($item[3013379] ?? '') }} Sungkup Non Rebreathing<br>
                                    {{ getCheckBox($item[3013380] ?? '') }} Sungkup Rebreathing<br>
                                    {{ getCheckBox($item[3013381] ?? '') }} ETT
                                </td>
                                <td style="width: 25%; vertical-align: top; border: 1px solid #000;"><strong>LINE INVASIF</strong><br>
                                    {{ getCheckBox($item[3013382] ?? '') }} Tidak ada Line Invasif<br>
                                    {{ getCheckBox($item[3013383] ?? '') }} IV Line, Tanggal: {{ $item[3013384] ?? '' }}
                                </td>
                                <td style="width: 25%; vertical-align: top; border: 1px solid #000;"><strong>INTEGRITAS KULIT / LUKA</strong><br>
                                    {{ getCheckBox($item[3013385] ?? '') }} Tidak ada luka<br>
                                    {{ getCheckBox($item[3013386] ?? '') }} Luka<br>
                                    Ukuran: {{ $item[3013387] ?? '' }}<br>
                                    Lokasi: {{ $item[3013388] ?? '' }}<br>
                                    Kondisi: {{ $item[3013389] ?? '' }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <table width="100%" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
                            <tr>
                                <td style="width: 25%; vertical-align: top; border: 1px solid #000;"><strong>MOBILISASI</strong><br>
                                    {{ getCheckBox($item[3013390] ?? '') }} Tirah Baring<br>
                                    {{ getCheckBox($item[3013391] ?? '') }} Dibantu Penuh<br>
                                    {{ getCheckBox($item[3013392] ?? '') }} Dibantu Sebagian<br>
                                    {{ getCheckBox($item[3013393] ?? '') }} Jalan<br>
                                    {{ getCheckBox($item[3013394] ?? '') }} Duduk
                                </td>
                                <td style="width: 25%; vertical-align: top; border: 1px solid #000;"><strong>ALAT BANTU</strong><br>
                                    {{ getCheckBox($item[3013395] ?? '') }} Tanpa Alat Bantu<br>
                                    {{ getCheckBox($item[3013396] ?? '') }} Alat Bantu Dengar<br>
                                    {{ getCheckBox($item[3013397] ?? '') }} Kaca mata<br>
                                    {{ getCheckBox($item[3013398] ?? '') }} Tongkat / kruk<br>
                                    {{ getCheckBox($item[3013399] ?? '') }} Lain-lain: {{ $item[3013400] ?? '' }}
                                </td>
                                <td style="width: 25%; vertical-align: top; border: 1px solid #000;"><strong>BAB</strong><br>
                                    {{ getCheckBox($item[3013401] ?? '') }} Normal<br>
                                    {{ getCheckBox($item[3013402] ?? '') }} Tidak Normal<br>
                                    Jelaskan: {{ $item[3013403] ?? '' }}
                                </td>
                                <td style="width: 25%; vertical-align: top; border: 1px solid #000;"><strong>BAK</strong><br>
                                    {{ getCheckBox($item[3013404] ?? '') }} Normal<br>
                                    {{ getCheckBox($item[3013405] ?? '') }} Tidak Normal<br>
                                    Jelaskan: {{ $item[3013406] ?? '' }}<br>
                                    {{ getCheckBox($item[3013407] ?? '') }} Kateter Urin No: {{ $item[3013408] ?? '' }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <table width="100%" cellpadding="4" cellspacing="0" style="border-collapse: collapse;">
                            <tr>
                                <td style="width: 32%; vertical-align: top; border: 1px solid #000;"><strong>Tanggal Pemasangan</strong><br>
                                    {{ !empty($item[3013409]) ? date('d-m-Y H:i', strtotime($item[3013409])) : '' }}
                                </td>
                                <td style="width: 23%; vertical-align: top; border: 1px solid #000;"><strong>NUTRISI</strong><br>
                                    {{ getCheckBox($item[3013410] ?? '') }} Oral<br>
                                    {{ getCheckBox($item[3013411] ?? '') }} NGT<br>
                                    {{ getCheckBox($item[3013412] ?? '') }} Diet khusus, jelaskan: {{ $item[3013413] ?? '' }}
                                </td>
                                <td style="width: 23%; vertical-align: top; border: 1px solid #000;"><strong>RISIKO JATUH</strong><br>
                                    {{ getCheckBox($item[3013414] ?? '') }} Tidak<br>
                                    {{ getCheckBox($item[3013415] ?? '') }} Ya
                                </td>
                                <td style="width: 22%; vertical-align: top; border: 1px solid #000;"><strong>ALERGI</strong><br>
                                    {{ getCheckBox($item[3013416] ?? '') }} Tidak<br>
                                    {{ getCheckBox($item[3013417] ?? '') }} Ya, Reaksi Alergi: {{ $item[3013418] ?? '' }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">PEMERIKSAAN PENUNJANG</th>
                </tr>
                <tr>
                    <td style="width: 25%; vertical-align: top;">{{ getCheckBox($item[3013420] ?? '') }} Laboratorium</td>
                    <td style="width: 25%; vertical-align: top;">{{ getCheckBox($item[3013424] ?? '') }} Radiologi</td>
                    <td style="width: 25%; vertical-align: top;">{{ getCheckBox($item[3013428] ?? '') }} Lain-lain</td>
                    <td style="width: 25%; vertical-align: top;">{{ getCheckBox($item[3013419] ?? '') }} Pemasangan restrain</td>
                </tr>
                <tr>
                    <td style="vertical-align: top; border: 1px solid #000;">{{ getCheckBox($item[3013421] ?? '') }} Sudah<br>
                        {{ getCheckBox($item[3013422] ?? '') }} Belum, jelaskan: {{ $item[3013423] ?? '' }}</td>
                    <td style="vertical-align: top; border: 1px solid #000;">{{ getCheckBox($item[3013425] ?? '') }} Sudah<br>
                        {{ getCheckBox($item[3013426] ?? '') }} Belum, jelaskan: {{ $item[3013427] ?? '' }}</td>
                    <td style="vertical-align: top; border: 1px solid #000;">{{ getCheckBox($item[3013429] ?? '') }} Sudah<br>
                        {{ getCheckBox($item[3013430] ?? '') }} Belum, jelaskan: {{ $item[3013431] ?? '' }}</td>
                    <td style="vertical-align: top; border: 1px solid #000;">&nbsp;</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">TERAPHY & TRANSFER</th>
                </tr>
                <tr>
                    <td colspan="2" style="border: 1px solid #000;"><strong>THERAPHY YANG SUDAH DIBERIKAN</strong><br>{{ $item[3013432] ?? '' }}</td>
                    <td colspan="2" style="border: 1px solid #000;"><strong>MASALAH KEPERAWATAN SAAT INI</strong><br>{{ $item[3013433] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="2" style="border: 1px solid #000;"><strong>CARA TRANSFER</strong><br>
                        {{ getCheckBox($item[3013434] ?? '') }} Jalan<br>
                        {{ getCheckBox($item[3013435] ?? '') }} Kursi Roda<br>
                        {{ getCheckBox($item[3013436] ?? '') }} Brankar<br>
                        {{ getCheckBox($item[3013437] ?? '') }} Lain-lain: {{ $item[3013438] ?? '' }}
                    </td>
                    <td colspan="2" style="border: 1px solid #000;"><strong>KATEGORI PASIEN TRANSFER</strong><br>
                        {{ getCheckBox($item[3013439] ?? '') }} Level 0<br>
                        {{ getCheckBox($item[3013440] ?? '') }} Level 1<br>
                        {{ getCheckBox($item[3013441] ?? '') }} Level 2<br>
                        {{ getCheckBox($item[3013442] ?? '') }} Level 3
                    </td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px solid #000;"><strong>ALASAN TRANSFER</strong><br>{{ $item[3000484] ?? '' }}</td>
                </tr>
            </table>
        </div>
        <div style="padding: 10px;">
            <table width="100%" cellspacing="0" cellpadding="4" style="font-size:11px; border-collapse: collapse;" border="1">
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">REKOMENDASI</th>
                </tr>
                <tr>
                    <td colspan="2" style="border: 1px solid #000;"><strong>RENCANA TINDAK LANJUT MEDIS</strong><br>{{ $item[3013444] ?? '' }}</td>
                    <td colspan="2" style="border: 1px solid #000;"><strong>RENCANA TINDAK LANJUT KEPERAWATAN</strong><br>{{ $item[3013446] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="2" style="border: 1px solid #000;"><strong>DOKUMEN YANG DISERAHTERIMAKAN</strong><br>{{ $item[3013445] ?? '' }}</td>
                    <td colspan="2" style="border: 1px solid #000;"><strong>HAL - HAL LAIN YANG DISERAHTERIMAKAN</strong><br>{{ $item[3013447] ?? '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">KONDISI PASIEN SAAT DITERIMA</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #000;"><strong>Tanggal / Pukul</strong><br>{{ !empty($item[3013448]) ? date('d-m-Y H:i', strtotime($item[3013448])) : '' }}</td>
                    <td style="border: 1px solid #000;"><strong>Kesadaran</strong><br>{{ $item[3013449] ?? '' }}</td>
                    <td style="border: 1px solid #000;"><strong>GCS</strong><br>{{ $item[3013450] ?? '' }}</td>
                    <td style="border: 1px solid #000;"><strong>PANSS-EC</strong><br>{{ $item[3013451] ?? '' }}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #000;"><strong>TD</strong><br>{{ $item[3013452] ?? '' }}</td>
                    <td style="border: 1px solid #000;"><strong>R</strong><br>{{ $item[3013453] ?? '' }}</td>
                    <td style="border: 1px solid #000;"><strong>T</strong><br>{{ $item[3013454] ?? '' }}</td>
                    <td style="border: 1px solid #000;">&nbsp;</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">PETUGAS PENGIRIM DAN PENERIMA PASIEN</th>
                </tr>
                <tr>
                    <td colspan="2" style="border: 1px solid #000; height: 70px; vertical-align: top;"><strong>PENGIRIM</strong><br>{{ $item[3013456] ?? '' }}</td>
                    <td style="border: 1px solid #000;height: 70px; vertical-align: top;"><strong>PENDAMPING</strong><br>{{ $item[3013457] ?? '' }}</td>
                    <td style="border: 1px solid #000;height: 70px; vertical-align: top;"><strong>PENERIMA</strong><br>{{ $item[3013458] ?? '' }}</td>
                </tr>
                {{-- <tr>
                    <td colspan="4" style="height: 70px; vertical-align: top;">(Tuliskan nama jelas dan tanda tangan)</td>
                </tr> --}}
                {{-- <tr>
                    <td style="border: 1px solid #000; vertical-align: top;">Saksi 1: {{ $item[3100592] ?? '' }}</td>
                    <td style="border: 1px solid #000; vertical-align: top;">Saksi 2: {{ $item[3100593] ?? '' }}</td>
                    <td colspan="2" style="border: 1px solid #000; vertical-align: top;">Yang menyatakan: {{ $item[3100594] ?? '' }}</td>
                </tr> --}}
            </table>
            <table width="100%" cellspacing="0" cellpadding="4" style="font-size:11px; border-collapse: collapse; margin-top: 15px;" border="1">
                        <tr>
                            <th style="width: 50px">LEVEL</th>
                            <th style="width: 250px">KATEGORI</th>
                            <th style="width: 100px">PENDAMPING</th>
                            <th style="width: 100px">PERALATAN</th>
                        </tr>
                        <tr>
                            <td>
                                <label c-label item="item">0</label>
                            </td>
                            <td>
                                <label c-label item="item">
                                    Pasien yang hanya membutuhkan ruang perawatan biasa untuk kaus psikiatri. Score Panss-EC <= 3 per item<br>
                                </label>
                            </td>
                            <td>
                                <label c-label item="item">Perawat</label>
                            </td>
                            <td>
                                <label c-label item="item">Berkas RM, hasil pemeriksaan penunjang, form transfer pasien</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label c-label item="item">1</label>
                            </td>
                            <td>
                                <label c-label item="item">
                                    Kondisi pasien yang berisiko mengalami perburukan, baru dipindahkan dari IRI, Pasien yang akan dirawat di ruang perawatan biasa dengan pengawasan tim perawatan khusus atau untuk kasus psikiatri. Score Panss-EC > 3 per item<br>
                                </label>
                            </td>
                            <td>
                                <label c-label item="item">Perawat, Sopir Ambulan, Sekuriti</label>
                            </td>
                            <td>
                                <label c-label item="item">Peralatan level 0, 02, Suction, Tiang infus, Portable, tas Emergency</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label c-label item="item">2</label>
                            </td>
                            <td>
                                <label c-label item="item">
                                    Pasien yang memerlukan observasi ketat atau intervensi khusus misalnya pada pasien yang mengalami kegagalan satu sistem organ, pasien perawatan post operatif<br>
                                </label>
                            </td>
                            <td>
                                <label c-label item="item">Dokter, Perawat, Sopir Ambulan, Sekuriti</label>
                            </td>
                            <td>
                                <label c-label item="item">Peralatan level 1 dan mesin Devibrilator bila diperlukan</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label c-label item="item">3</label>
                            </td>
                            <td>
                                <label c-label item="item">
                                    Pasien yang mengalami kegagalan multi organ dan memerlukan bantuan hidup jangka panjang ditambah dengan kebutuhan akan alat bantu pernafasan<br>
                                </label>
                            </td>
                            <td>
                                <label c-label item="item">Dokter, Perawat, Sopir Ambulan, Sekuriti</label>
                            </td>
                            <td>
                                <label c-label item="item">Peralatan level 2 + Alat bantu pernafasan</label>
                            </td>
                        </tr>
            </table>
        </div>
    </section>
</body>
</html>

