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
                    <td style="width: 25%;">{{ $item[300000002] ?? '' }}</td>
                    <td style="width: 25%;"><strong>Hubungan dengan pasien</strong></td>
                    <td style="width: 25%;">{{ $item[300000003] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4" style="background-color: #f9f9f9;"><strong>B. Riwayat Penyakit</strong></td>
                </tr>
                <tr>
                    <td colspan="4"><strong>1. Keluhan Utama / Keluhan Saat Ini:</strong> {{ $item[300000004] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>2. Sejak kapan terjadi perubahan tingkah laku / peningkatan gejala?:</strong> {{ $item[300000005] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4"><strong>3. Gejala yang ditunjukkan:</strong> {{ $item[300000006] ?? '' }}</td>
                </tr>
                <tr>
                    <td colspan="4" style="padding: 0;">
                        <table style="width:100%; border:none; margin:0; padding:0;">
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; width: 35%; border-right: 1px solid #000;">
                                    <strong>4. Riwayat Penyakit Jiwa Sebelumnya</strong><br>
                                    {{ getCheckBox($item[300000007] ?? '') }} Pernah &nbsp;
                                    {{ getCheckBox($item[300000008] ?? '') }} Tidak Pernah
                                </td>
                                <td style="border:none; padding:4px; vertical-align:top; width: 30%; border-right: 1px solid #000;">
                                    <strong>Pertama kali (kapan):</strong> {{ $item[300000009] ?? '' }}<br>
                                    <strong>Berapa kali:</strong> {{ $item[300000010] ?? '' }}
                                </td>
                                <td style="border:none; padding:4px; vertical-align:top; width: 35%;">
                                    <strong>Pernah Sembuh:</strong> 
                                    {{ getCheckBox($item[300000011] ?? '') }} Ya 
                                    {{ getCheckBox($item[300000012] ?? '') }} Tidak<br>
                                    <strong>Berobat Jalan:</strong> 
                                    {{ getCheckBox($item[300000013] ?? '') }} Teratur 
                                    {{ getCheckBox($item[300000014] ?? '') }} Tidak Teratur 
                                    {{ getCheckBox($item[300000015] ?? '') }} Tidak Pernah
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="4"><strong>5. Riwayat Penggunaan Obat:</strong> &nbsp;
                        <strong>Obat Rutin:</strong> {{ $item[300000093] ?? '' }} &nbsp; | &nbsp;
                        <strong>Obat Sekarang:</strong> {{ $item[300000094] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td colspan="4"><strong>6. Faktor yang mendahului:</strong><br>
                        <strong>Organik:</strong> 
                        {{ getCheckBox($item[300000016]?? '') }} Panas &nbsp;
                        {{ getCheckBox($item[300000017]?? '') }} Kejang &nbsp;
                        {{ getCheckBox($item[300000018]?? '') }} Keracunan &nbsp;
                        {{ getCheckBox($item[300000019]?? '') }} Rudapaksa &nbsp;
                        {{ getCheckBox($item[300000020]?? '') }} Herediter<br>
                        <strong>Spiritual:</strong> {{ $item[300000021] ?? '' }} &nbsp; | &nbsp;
                        <strong>Psikososial:</strong> {{ $item[300000095] ?? '' }} &nbsp; | &nbsp;
                        <strong>Ekonomi:</strong> {{ $item[300000022] ?? '' }} &nbsp; | &nbsp;
                        <strong>Lain-lain:</strong> {{ $item[300000023] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <strong>7. Riwayat gangguan jiwa dalam keluarga:</strong> {{ $item[300000024] ?? '' }}<br>
                        <strong>8. Silsilah keluarga:</strong> {{ $item[300000025] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td colspan="4" style="padding: 0;">
                        <table style="width:100%; border:none; margin:0; padding:0;">
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; width: 60%; border-right: 1px solid #000;">
                                    <strong>9. Riwayat Pribadi:</strong><br>
                                    <strong>Kepribadian sebelum sakit:</strong> {{ $item[300000026] ?? '' }} &nbsp; | &nbsp;
                                    <strong>Pola Asuh:</strong> {{ $item[300000027] ?? '' }} &nbsp; | &nbsp;
                                    <strong>Pendidikan:</strong> {{ $item[300000028] ?? '' }}<br>
                                    <strong>Pekerjaan:</strong> {{ $item[300000029] ?? '' }} &nbsp; | &nbsp;
                                    <strong>Perkawinan:</strong> {{ $item[300000030] ?? '' }}
                                </td>
                                <td style="border:none; padding:4px; vertical-align:top; width: 40%;">
                                    <strong>10. Riwayat Penyalahgunaan NAPZA:</strong> {{ $item[300000031] ?? '' }}<br>
                                    <strong>11. Riwayat Alergi:</strong> {{ $item[300000032] ?? '' }}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">PEMERIKSAAN FISIK</th>
                </tr>
                <tr>
                    <td style="width: 25%;"><strong>A. Vital Sign</strong></td>
                    <td colspan="3">
                        TD: {{ $item[300000033] ?? '' }} mmHg &nbsp; | &nbsp; 
                        Nadi: {{ $item[300000034] ?? '' }} x/menit &nbsp; | &nbsp; 
                        Suhu: {{ $item[300000035] ?? '' }} °C &nbsp; | &nbsp; 
                        Respirasi: {{ $item[300000036] ?? '' }} x/menit
                    </td>
                </tr>
                <tr>
                    <td><strong>B. Status Generalis & Neurologis</strong></td>
                    <td colspan="3">{{ $item[300000037] ?? '' }}</td>
                </tr>
                <tr style="background-color: #f2f2f2;">
                    <th colspan="4">PEMERIKSAAN PSIKIATRIK</th>
                </tr>
                <tr>
                    <td colspan="4" style="padding: 0;">
                        <table style="width:100%; border:none; margin:0; padding:0;">
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; width: 25%; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>1. Kesan Umum</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;" colspan="3">{{ $item[300000038] ?? '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>2. Kesadaran</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000; width: 37%;">Kuantitatif: {{ $item[300000039] ?? '' }}</td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;" colspan="2">Kualitatif: {{ $item[300000040] ?? '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>3. Orientasi</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;" colspan="3">
                                    Waktu: {{ $item[300000041] ?? '' }} &nbsp; | &nbsp; 
                                    Tempat: {{ $item[300000042] ?? '' }} &nbsp; | &nbsp; 
                                    Orang: {{ $item[300000043] ?? '' }} &nbsp; | &nbsp; 
                                    Situasi: {{ $item[300000044] ?? '' }}
                                </td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>4. Sikap & Tingkah Laku</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;" colspan="3">{{ $item[300000045] ?? '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>5. Proses Pikir</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;" colspan="3">
                                    a. Bentuk: {{ $item[300000046] ?? '' }} &nbsp; | &nbsp; 
                                    b. Isi: {{ $item[300000047] ?? '' }} &nbsp; | &nbsp; 
                                    c. Progresi (Kuantitatif): {{ $item[300000048] ?? '' }} &nbsp; | &nbsp; 
                                    c. Progresi (Kualitatif): {{ $item[300000049] ?? '' }}
                                </td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>6. Mood</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;">{{ $item[300000050] ?? '' }}</td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000; width: 15%;"><strong>7. Afek</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;">{{ $item[300000051] ?? '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>8. Gangguan Persepsi</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;">{{ $item[300000052] ?? '' }}</td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>9. Ggn Memori</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;">{{ $item[300000053] ?? '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>10. Ggn Intelegensi</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;">{{ $item[300000054] ?? '' }}</td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>11. Perhatian</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;">{{ $item[300000055] ?? '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000;"><strong>Hubungan Jiwa</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000;">
                                    {{ getCheckBox($item[300000056] ?? '') }} Sukar &nbsp; 
                                    {{ getCheckBox($item[300000057] ?? '') }} Mudah
                                </td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000;"><strong>12. Insight</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top;">{{ $item[300000058] ?? '' }}</td>
                            </tr>
                        </table>
                    </td>
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
                    <td colspan="4" style="padding: 0;">
                        <table style="width:100%; border:none; margin:0; padding:0;">
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; width: 15%; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>a. Axis I</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; width: 35%; border-right: 1px solid #000; border-bottom: 1px solid #000;">{{ $item[300000060] ?? '' }}</td>
                                <td style="border:none; padding:4px; vertical-align:top; width: 15%; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>b. Axis II</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;">{{ $item[300000061] ?? '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>c. Axis III</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;">{{ $item[300000062] ?? '' }}</td>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000; border-bottom: 1px solid #000;"><strong>d. Axis IV</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top; border-bottom: 1px solid #000;">{{ $item[300000063] ?? '' }}</td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:4px; vertical-align:top; border-right: 1px solid #000;"><strong>e. Axis V</strong></td>
                                <td style="border:none; padding:4px; vertical-align:top;" colspan="3">
                                    GAF scale saat ini: {{ $item[300000064] ?? '' }} &nbsp; | &nbsp; 
                                    GAF scale 1 tahun terakhir: {{ $item[300000065] ?? '' }}
                                </td>
                            </tr>
                        </table>
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
                    <th colspan="4">EDUKASI DIAGNOSIS</th>
                </tr>
                <tr>
                    <td colspan="4">
                        {{ getCheckBox($item[300000067] ?? '') }} Pasien<br>
                        {{ getCheckBox($item[300000068] ?? '') }} Keluarga pasien: {{ $item[1901300427] ?? '' }}<br>
                        {{ getCheckBox($item[300000069] ?? '') }} Tidak dapat memberi edukasi: {{ $item[1901300428] ?? '' }}
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="vertical-align: top; padding: 0; width: 50%;">
                        <div style="padding: 4px;">
                            <div style="text-align: center; text-decoration: underline; font-weight: bold; margin-bottom: 10px;">INTEGRASI ASUHAN</div>
                            <table style="width: 100%; border: none;">
                                <tr>
                                    <td style="border: none; padding: 2px; width: 25px;">{{ getCheckBox($item[300000070] ?? '') }}</td>
                                    <td style="border: none; padding: 2px; width: 60px;">Dokter</td>
                                    <td style="border: none; padding: 2px;">: {{ $item[1901300429] ?? '' }}</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 2px;">{{ getCheckBox($item[300000071] ?? '') }}</td>
                                    <td style="border: none; padding: 2px;">Perawat</td>
                                    <td style="border: none; padding: 2px;">: {{ $item[1901300430] ?? '' }}</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 2px;">{{ getCheckBox($item[300000072] ?? '') }}</td>
                                    <td style="border: none; padding: 2px;">PPA lain</td>
                                    <td style="border: none; padding: 2px;">: {{ $item[1901300431] ?? '' }}</td>
                                </tr>
                            </table>
                            <div style="margin-top: 10px; padding: 2px;">
                                Catatan / Notasi DPJP : <br>
                                {{ $item[300000073] ?? '' }}
                            </div>
                            <div style="margin-top: 60px; text-align: right; padding-right: 10px;">
                                Paraf DPJP :  {{ !empty($item[300000080]) ? $item[300000080] : '.........................................' }}
                            </div>
                        </div>
                    </td>
                    <td colspan="2" style="vertical-align: top; padding: 0; width: 50%;">
                        <div style="padding: 4px;">
                            <div style="text-align: center; text-decoration: underline; font-weight: bold; margin-bottom: 10px;">RENCANA PEMULANGAN PASIEN</div>
                            <table style="width: 100%; border: none; margin-bottom: 5px;">
                                <tr>
                                    <td style="border: none; padding: 2px; width: 20px; vertical-align: top;">{{ getCheckBox(!empty($item[300000074]) || !empty($item[300000075]) ? '1' : '') }}</td>
                                    <td style="border: none; padding: 2px; width: 50px; vertical-align: top;">Pulang :</td>
                                    <td style="border: none; padding: 2px; vertical-align: top;">
                                        {{ getCheckBox($item[300000074] ?? '') }} Konsultasi Selesai : {{ $item[1901300432] ?? '' }}<br>
                                        <div style="margin-top: 4px;">
                                            {{ getCheckBox($item[300000075] ?? '') }} Kontrol Ulang : {{ !empty($item[1901300433]) ? $item[1901300433] : '..........' }} hari
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 2px; vertical-align: top;">{{ getCheckBox($item[300000076] ?? '') }}</td>
                                    <td style="border: none; padding: 2px;" colspan="2">Rujuk ke : {{ !empty($item[1901300434]) ? $item[1901300434] : '.......................................................................' }}</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 2px; vertical-align: top;">{{ getCheckBox($item[1901300435] ?? '') }}</td>
                                    <td style="border: none; padding: 2px;" colspan="2">{{ !empty($item[1901300435]) ? $item[1901300435] : '.......................................................................' }}</td>
                                </tr>
                            </table>
                        </div>
                        <div style="border-top: 1px solid #000; padding: 4px;">
                            <div style="margin-bottom: 15px;">
                                Pemeriksaan selesai, Pukul : {{ !empty($item[300000081]) ? date('H:i', strtotime($item[300000081])) : '..........' }}
                            </div>
                            <table style="width: 100%; border: none; text-align: center;">
                                <tr>
                                    <td style="border: none; padding: 2px; width: 50%;">Penanggung Jawab Pasien</td>
                                    <td style="border: none; padding: 2px; width: 50%;">Dokter Pemeriksa/DPJP</td>
                                </tr>
                                <tr>
                                    <td style="border: none; padding: 2px; height: 60px; vertical-align: bottom;">( {{ !empty($item[300000078]) ? $item[300000078] : '.........................................' }} )</td>
                                    <td style="border: none; padding: 2px; height: 60px; vertical-align: bottom;">( {{ !empty($item[300000079]) ? $item[300000079] : '.........................................' }} )</td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </table>
            <div style="text-align: right; font-weight: bold; font-size: 11px; margin-top: 4px;">
                CM.RM.05.02.Rev02
            </div>
    </section>
</body>
</html>
