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
    <title>PENGKAJIAN AWAL MEDIS RAWAT JALAN JIWA</title>
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
                    <th style=" font-size: 15px; padding-bottom: 8px; padding-top: 5px; border: none; text-align: center;" colspan="6">PENGKAJIAN AWAL MEDIS RAWAT JALAN JIWA</th>
            </tr>
        </table>
            <table width="100%" cellspacing="0" cellpadding="4" style="font-size:11px; border-collapse: collapse;" border="1">
                <tr style="background-color: #f2f2f2;">
                    <td colspan="2"><strong>Mulai Pemeriksaan Tanggal</strong></td>
                    <td colspan="2">{{ !empty($item[300000001]) ? date('d-m-Y H:i', strtotime($item[300000001])) : '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">ALLOANAMNESIS / ANAMNESIS</th>
                </tr>
                <tr>
                    <td style="width: 25%;"><strong>A. Diperoleh dari</strong></td>
                    <td colspan="3">{{ $item[300000002] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>Hubungan dengan pasien</strong></td>
                    <td colspan="3">{{ $item[300000003] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>B. Riwayat Penyakit</strong></td>
                </tr>
                <tr>
                    <td colspan="4"><strong>1. Keluhan Utama / Keluhan Saat Ini</strong><br>{{ $item[300000004] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>2. Sejak kapan terjadi perubahan tingkah laku / peningkatan gejala?</strong><br>{{ $item[300000005] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>3. Gejala yang ditunjukkan</strong><br>{{ $item[300000006] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>4. Riwayat Penyakit Jiwa Sebelumnya</strong><br>
                        {{ getCheckBox($item[300000007] ?? '') }} Pernah<br>
                        {{ getCheckBox($item[300000008] ?? '') }} Tidak Pernah
                    </td>
                </tr>
                <tr>
                    <td><strong>Pertama kali (kapan)</strong></td>
                    <td colspan="3">{{ $item[300000009] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>Berapa kali</strong></td>
                    <td colspan="3">{{ $item[300000010] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>Pernah Sembuh</strong><br>
                        {{ getCheckBox($item[300000011] ?? '') }} Ya<br>
                        {{ getCheckBox($item[300000012] ?? '') }} Tidak
                    </td>
                </tr>
                <tr>
                    <td colspan="4"><strong>Berobat Jalan</strong><br>
                        {{ getCheckBox($item[300000013] ?? '') }} Teratur<br>
                        {{ getCheckBox($item[300000014] ?? '') }} Tidak Teratur<br>
                        {{ getCheckBox($item[300000015] ?? '') }} Tidak Pernah
                    </td>
                </tr>
                <tr>
                    <td colspan="4"><strong>5. Riwayat Penggunaan Obat</strong><br>
                        <strong>Obat Rutin Dikonsumsi:</strong> {{ $item[300000093] ?? '' }}<br>
                        <strong>Obat yang Digunakan Sekarang:</strong> {{ $item[300000094] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td colspan="4"><strong>6. Faktor yang mendahului</strong><br>
                        <strong>Organik:</strong><br>
                        {{ getCheckBox($item[300000016]?? '') }} Panas<br>
                        {{ getCheckBox($item[300000017]?? '') }} Kejang<br>
                        {{ getCheckBox($item[300000018]?? '') }} Keracunan<br>
                        {{ getCheckBox($item[300000019]?? '') }} Rudapaksa<br>
                        {{ getCheckBox($item[300000020]?? '') }} Herediter<br>
                        <strong>Spiritual:</strong> {{ $item[300000021] ?? '' }}<br>
                        <strong>Psikososial:</strong> {{ $item[300000095] ?? '' }}<br>
                        <strong>Ekonomi:</strong> {{ $item[300000022] ?? '' }}<br>
                        <strong>Lain-lain:</strong> {{ $item[300000023] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td colspan="4"><strong>7. Riwayat gangguan jiwa dalam keluarga</strong><br>{{ $item[300000024] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>8. Silsilah keluarga</strong><br>{{ $item[300000025] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>9. Riwayat Pribadi</strong><br>
                        <strong>Kepribadian sebelum sakit:</strong> {{ $item[300000026] ?? '' }}<br>
                        <strong>Pola Asuh:</strong> {{ $item[300000027] ?? '' }}<br>
                        <strong>Pendidikan:</strong> {{ $item[300000028] ?? '' }}<br>
                        <strong>Pekerjaan:</strong> {{ $item[300000029] ?? '' }}<br>
                        <strong>Perkawinan:</strong> {{ $item[300000030] ?? '' }}<br>
                        <strong>10. Riwayat Penyalahgunaan NAPZA:</strong> {{ $item[300000031] ?? '' }}<br>
                        <strong>11. Riwayat Alergi:</strong> {{ $item[300000032] ?? '' }}
                    </td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">PEMERIKSAAN FISIK</th>
                </tr>
                <tr>
                    <td><strong>A. Vital Sign</strong></td>
                    <td colspan="3">
                        Tekanan Darah: {{ $item[300000033] ?? '' }} mmHg<br>
                        Nadi: {{ $item[300000034] ?? '' }} x/menit<br>
                        Suhu: {{ $item[300000035] ?? '' }} °C<br>
                        Respirasi: {{ $item[300000036] ?? '' }} x/menit
                    </td>
                </tr>
                <tr>
                    <td><strong>B. Status Generalis dan Neurologis</strong></td>
                    <td colspan="3">{{ $item[300000037] ?? '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">PEMERIKSAAN PSIKIATRIK</th>
                </tr>
                <tr>
                    <td><strong>1. Kesan Umum</strong></td>
                    <td colspan="3">{{ $item[300000038] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>2. Kesadaran</strong></td>
                    <td colspan="3">
                        Kuantitatif: {{ $item[300000039] ?? '' }}<br>
                        Kualitatif: {{ $item[300000040] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td><strong>3. Orientasi</strong></td>
                    <td colspan="3">
                        Waktu: {{ $item[300000041] ?? '' }}<br>
                        Tempat: {{ $item[300000042] ?? '' }}<br>
                        Orang: {{ $item[300000043] ?? '' }}<br>
                        Situasi: {{ $item[300000044] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td><strong>4. Sikap dan Tingkah Laku</strong></td>
                    <td colspan="3">{{ $item[300000045] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>5. Proses Pikir</strong></td>
                    <td colspan="3">
                        a. Bentuk pikir: {{ $item[300000046] ?? '' }}<br>
                        b. Isi pikir: {{ $item[300000047] ?? '' }}<br>
                        c. Progresi pikir (Kuantitatif): {{ $item[300000048] ?? '' }}<br>
                        c. Progresi pikir (Kualitatif): {{ $item[300000049] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td><strong>6. Mood</strong></td>
                    <td colspan="3">{{ $item[300000050] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>7. Afek</strong></td>
                    <td colspan="3">{{ $item[300000051] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>8. Gangguan Persepsi</strong></td>
                    <td colspan="3">{{ $item[300000052] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>9. Gangguan Memori</strong></td>
                    <td colspan="3">{{ $item[300000053] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>10. Gangguan Intelegensi</strong></td>
                    <td colspan="3">{{ $item[300000054] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>11. Perhatian</strong></td>
                    <td colspan="3">{{ $item[300000055] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>Hubungan Jiwa</strong><br>
                        {{ getCheckBox($item[300000056] ?? '') }} Sukar<br>
                        {{ getCheckBox($item[300000057] ?? '') }} Mudah
                    </td>
                </tr>
                <tr>
                    <td><strong>12. Insight</strong></td>
                    <td colspan="3">{{ $item[300000058] ?? '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">PEMERIKSAAN PENUNJANG</th>
                </tr>
                <tr>
                    <td colspan="4">{{ $item[300000059] ?? '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">DIAGNOSIS</th>
                </tr>
                <tr>
                    <td><strong>a. Axis I</strong></td>
                    <td colspan="3">{{ $item[300000060] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>b. Axis II</strong></td>
                    <td colspan="3">{{ $item[300000061] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>c. Axis III</strong></td>
                    <td colspan="3">{{ $item[300000062] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>d. Axis IV</strong></td>
                    <td colspan="3">{{ $item[300000063] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>e. Axis V</strong></td>
                    <td colspan="3">
                        GAF scale saat ini: {{ $item[300000064] ?? '' }}<br>
                        GAF scale 1 tahun terakhir: {{ $item[300000065] ?? '' }}
                    </td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">MASALAH KEPERAWATAN</th>
                </tr>
                <tr>
                    <td colspan="4">{{ $item[300000096] ?? '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">PENATALAKSANAAN</th>
                </tr>
                <tr>
                    <td colspan="4">{{ $item[300000066] ?? '' }}<br>
                        <strong>Keadaan waktu keluar:</strong> {{ $item[300000082] ?? '' }}
                    </td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="2">EDUKASI DIAGNOSIS</th>
                    <th colspan="2">INTEGRASI ASUHAN</th>
                </tr>
                <tr>
                    <td colspan="2">
                        {{ getCheckBox($item[300000067] ?? '') }} Pasien<br>
                        {{ getCheckBox($item[300000068] ?? '') }} Keluarga pasien: {{ $item[1901300427] ?? '' }}<br>
                        {{ getCheckBox($item[300000069] ?? '') }} Tidak dapat memberi edukasi: {{ $item[1901300428] ?? '' }}
                    </td>
                    <td colspan="2">
                        {{ getCheckBox($item[300000070] ?? '') }} Dokter: {{ $item[1901300429] ?? '' }}<br>
                        {{ getCheckBox($item[300000071] ?? '') }} Perawat: {{ $item[1901300430] ?? '' }}<br>
                        {{ getCheckBox($item[300000072] ?? '') }} PPA lain: {{ $item[1901300431] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td colspan="4"><strong>Catatan / Notasi DPJP:</strong><br>{{ $item[300000073] ?? '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">RENCANA PEMULANGAN PASIEN</th>
                </tr>
                <tr>
                    <td colspan="4">
                        {{ getCheckBox($item[300000074] ?? '') }} Pulang, konsultasi selesai: {{ $item[1901300432] ?? '' }}<br>
                        {{ getCheckBox($item[300000075] ?? '') }} Pulang, kontrol ulang: {{ $item[1901300433] ?? '' }}<br>
                        {{ getCheckBox($item[300000076] ?? '') }} Rujuk ke: {{ $item[1901300434] ?? '' }} {{ $item[1901300435] ?? '' }}
                    </td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">PENANGGUNG JAWAB</th>
                </tr>
                <tr>
                    <td><strong>Penanggung Jawab Pasien</strong></td>
                    <td colspan="3">{{ $item[300000078] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>Dokter Pemeriksa/DPJP</strong></td>
                    <td colspan="3">{{ $item[300000079] ?? '' }}</td>
                </tr>
                <tr>
                    <td><strong>Selesai Pemeriksaan Pukul</strong></td>
                    <td colspan="3">{{ !empty($item[300000081]) ? date('d-m-Y H:i', strtotime($item[300000081])) : '' }}</td>
                </tr>
            </table>
    </section>
</body>
</html>
