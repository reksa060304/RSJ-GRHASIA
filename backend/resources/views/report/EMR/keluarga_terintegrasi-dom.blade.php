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
    <title>Formulir Edukasi Pasien dan Keluarga Terintegrasi</title>
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
                <td style="width: 12%; border-bottom:2px solid black;">
                    <img src="img/logo_grhasia_com.png" alt="Logo" style="width: 90px;">
                </td>
                <td style="border-bottom:2px solid black; text-align:center; width: 60%;">
                    <p style="margin:0; padding:0; font-size: 10px; font-weight: bold;">{{ $res['profile']->baris1 }}</p>
                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ $res['profile']->baris2 }}</p>
                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ strtoupper($res['profile']->namalengkap) }}</p>
                    <p style="font-size:8pt; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $res['profile']->kodepos }}</p>
                    <p style="font-size:8pt; margin:0;">Telp: (0274) 895143, 895297 | Faks: {{ $res['profile']->faksimile }}</p>
                </td>
                <td style="border-bottom:2px solid black; width: 28%; vertical-align: top;">
                    <table border="1" cellpadding="2" cellspacing="0" style="width: 100%;">
                        <tr>
                            <td style="font-size: 10px; border: 1px solid #000;">Nomor RM</td>
                            <td style="font-size: 10px; border: 1px solid #000;">{{ isset($data[0]->nocm) ? $data[0]->nocm : '' }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 10px; border: 1px solid #000;">Nama Pasien</td>
                            <td style="font-size: 10px; border: 1px solid #000;">{{ isset($data[0]->namapasien) ? strtoupper($data[0]->namapasien) : '' }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 10px; border: 1px solid #000;">Tanggal Lahir</td>
                            <td style="font-size: 10px; border: 1px solid #000;">{{ isset($data[0]->tgllahir) ? date('d-m-Y',strtotime($data[0]->tgllahir)) : '' }}</td>
                        </tr>
                        <tr>
                            <td style="font-size: 10px; border: 1px solid #000;">Jenis Kelamin</td>
                            <td style="font-size: 10px; border: 1px solid #000;">{{ isset($data[0]->jeniskelamin) ? strtoupper($data[0]->jeniskelamin) : '' }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                    <th style=" font-size: 15px; padding-bottom: 8px; padding-top: 5px; border: none; text-align: center;" colspan="6">EDUKASI PASIEN DAN KELUARGA TERINTEGRASI</th>
            </tr>
        </table>

        <!-- BAGIAN A: PENGKAJIAN KEBUTUHAN EDUKASI -->
        <div style="margin-top: 10px;">
            <div class="title-section">A. PENGKAJIAN KEBUTUHAN EDUKASI - DATA PASIEN</div>
            
            <table cellpadding="2" cellspacing="0" border="1">
                <!-- Tinggal Bersama -->
                <tr>
                    <td style="width: 25%; font-weight: bold;">Tinggal Bersama</td>
                    <td style="width: 75%;">
                        {{ getCheckBox($item[3000495] ?? null) }} Anak &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000496] ?? null) }} Orang Tua &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000497] ?? null) }} Sendiri &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000498] ?? null) }} Suami &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000499] ?? null) }} Istri &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000500] ?? null) }} Panti
                        @if(isset($item[3000501]) && !empty($item[3000501]))
                            <br>{{ getCheckBox($item[3000501]) }} Lainnya: {{ $item[3000502] ?? '' }}
                        @endif
                    </td>
                </tr>

                <!-- Hambatan -->
                <tr>
                    <td style="font-weight: bold;">Hambatan</td>
                    <td>
                        {{ getCheckBox($item[3000503] ?? null) }} Tidak ada &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000504] ?? null) }} Ada Yaitu: &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000505] ?? null) }} Motivasi Kurang/Buruk
                        <br>
                        {{ getCheckBox($item[3000506] ?? null) }} Gangguan Penglihatan &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000507] ?? null) }} Secara Fisiologis tidak mampu belajar
                        <br>
                        {{ getCheckBox($item[3000508] ?? null) }} Gangguan Emosi &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000509] ?? null) }} Fisik Lemah &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000510] ?? null) }} Gangguan Pendengaran
                        <br>
                        {{ getCheckBox($item[3000511] ?? null) }} Gangguan Bicara &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000512] ?? null) }} Memori Hilang &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000513] ?? null) }} Lain-lain: {{ $item[3000514] ?? '' }}
                    </td>
                </tr>

                <!-- Edukasi Diberikan Kepada -->
                <tr>
                    <td style="font-weight: bold;">Edukasi Diberikan Kepada</td>
                    <td>
                        {{ getCheckBox($item[3000515] ?? null) }} Pasien &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000516] ?? null) }} Keluarga &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000517] ?? null) }} Lain-lain: {{ $item[3000518] ?? '' }}
                    </td>
                </tr>

                <!-- Bahasa yang Digunakan -->
                <tr>
                    <td style="font-weight: bold;">Bahasa yang Digunakan</td>
                    <td>
                        {{ getCheckBox($item[3000519] ?? null) }} Indonesia &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000520] ?? null) }} Daerah: {{ $item[3000521] ?? '' }} &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000522] ?? null) }} Asing: {{ $item[3000523] ?? '' }}
                        <br>
                        {{ getCheckBox($item[3000524] ?? null) }} Isyarat
                    </td>
                </tr>

                <!-- Perlu Penerjemah -->
                <tr>
                    <td style="font-weight: bold;">Perlu Penerjemah</td>
                    <td>
                        {{ getCheckBox($item[3000525] ?? null) }} Ya &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000526] ?? null) }} Tidak
                    </td>
                </tr>

                <!-- Baca dan Tulis -->
                <tr>
                    <td style="font-weight: bold;">Baca dan Tulis</td>
                    <td>
                        {{ getCheckBox($item[3000527] ?? null) }} Bisa &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000528] ?? null) }} Tidak
                    </td>
                </tr>

                <!-- Keyakinan dan Nilai-nilai -->
                <tr>
                    <td style="font-weight: bold;">Keyakinan & Nilai-nilai</td>
                    <td>
                        {{ getCheckBox($item[3000529] ?? null) }} Ada: {{ $item[3000530] ?? '' }} &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000531] ?? null) }} Tidak ada
                    </td>
                </tr>

                <!-- Kesediaan Menerima Edukasi -->
                <tr>
                    <td style="font-weight: bold;">Kesediaan Menerima Edukasi</td>
                    <td>
                        {{ getCheckBox($item[3000532] ?? null) }} Ya &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000533] ?? null) }} Tidak
                    </td>
                </tr>

                <!-- Kebutuhan Edukasi -->
                <tr>
                    <td style="font-weight: bold; vertical-align: top;">Kebutuhan Edukasi</td>
                    <td>
                        {{ getCheckBox($item[3000534] ?? null) }} Kondisi Kesehatan & Penatalaksanaan &nbsp;&nbsp;
                        {{ getCheckBox($item[3000535] ?? null) }} Perawatan Dirumah<br>
                        {{ getCheckBox($item[3000536] ?? null) }} Manajemen Nyeri &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000537] ?? null) }} Cuci Tangan yang Benar<br>
                        {{ getCheckBox($item[3000538] ?? null) }} Penggunaan Obat Aman &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000539] ?? null) }} Peran Keluarga<br>
                        {{ getCheckBox($item[3000540] ?? null) }} Interaksi Obat & Makanan &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000541] ?? null) }} Pelayanan Kerohanian<br>
                        {{ getCheckBox($item[3000542] ?? null) }} Penggunaan Peralatan Medis &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000543] ?? null) }} Diet & Nutrisi<br>
                        {{ getCheckBox($item[3000544] ?? null) }} Teknik Rehabilitasi &nbsp;&nbsp;&nbsp;&nbsp;
                        {{ getCheckBox($item[3000545] ?? null) }} Lain-lain: {{ $item[3000546] ?? '' }}
                    </td>
                </tr>

                <!-- Tanggal dan Nama Perawat -->
                <tr>
                    <td style="font-weight: bold;">Tanggal & Jam Asesmen</td>
                    <td>{{ $item[3000547] ?? '' }}</td>
                </tr>
                <tr>
                    <td style="font-weight: bold;">Nama Perawat</td>
                    <td>{{ $item[3000548] ?? '' }}</td>
                </tr>
            </table>
        </div>

        <!-- BAGIAN B: EDUKASI -->
        <div style="margin-top: 15px;">
            <div class="title-section">B. EDUKASI</div>
            
            <table cellpadding="2" cellspacing="0" border="1">
                <thead style="background-color: #e8e8e8;">
                    <tr>
                        <th style="width: 2%; text-align: center;">No</th>
                        <th style="width: 11%;">Materi Edukasi</th>
                        <th style="width: 10%; text-align: center;">Tanggal/Jam</th>
                        <th style="width: 11%;">Media Edukasi</th>
                        <th style="width: 11%;">Metode Edukasi</th>
                        <th style="width: 11%;">Hasil Verifikasi</th>
                        <th style="width: 11%;">Tgl Re-Edukasi</th>
                        <th style="width: 11%;">Nama Pemberi Edukasi</th>
                        <th style="width: 11%;">Nama Pasien/Keluarga</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td style="text-align: center; height: 60px;">1</td>
                            <td style="text-align: center;">Kondisi Kesehatan, Diagnosa Pasti dan penatalaksanaan</td>
                            <td style="text-align: center;">{{ $item[3000549] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000550] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000551] ?? '' }}<br>
                                {{ getCheckBox($item[3000552] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000553] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000554] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000555] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000556] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000557] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000558] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000559] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000560] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">2</td>
                            <td style="text-align: center;">Manajemen Nyeri</td>
                            <td style="text-align: center;">{{ $item[3000561] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000562] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000563] ?? '' }}<br>
                                {{ getCheckBox($item[3000564] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000565] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000566] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000567] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000568] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000569] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000570] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000571] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000572] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">3</td>
                            <td style="text-align: center;">Penggunaan Obat-obatan yang efektif dan aman</td>
                            <td style="text-align: center;">{{ $item[3000573] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000574] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000575] ?? '' }}<br>
                                {{ getCheckBox($item[3000576] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000577] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000578] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000579] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000580] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000581] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000582] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000583] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000584] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">4</td>
                            <td style="text-align: center;">Potensi interaksi obat yang diresepkan dengan obat lain dan makanan</td>
                            <td style="text-align: center;">{{ $item[3000585] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000586] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000587] ?? '' }}<br>
                                {{ getCheckBox($item[3000588] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000589] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000590] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000591] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000592] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000593] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000594] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000595] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000596] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">5</td>
                            <td style="text-align: center;">Penggunaan peralatan medis yang efektif dan aman</td>
                            <td style="text-align: center;">{{ $item[3000597] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000598] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000599] ?? '' }}<br>
                                {{ getCheckBox($item[3000600] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000601] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000602] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000603] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000604] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000605] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000606] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000607] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000608] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">6</td>
                            <td style="text-align: center;">diet dan nutrisi</td>
                            <td style="text-align: center;">{{ $item[3000609] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000610] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000611] ?? '' }}<br>
                                {{ getCheckBox($item[3000612] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000613] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000614] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000615] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000616] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000617] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000618] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000619] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000620] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">7</td>
                            <td style="text-align: center;">Teknik - teknik rehabilitasi</td>
                            <td style="text-align: center;">{{ $item[3000621] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000622] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000623] ?? '' }}<br>
                                {{ getCheckBox($item[3000624] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000625] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000626] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000627] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000628] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000629] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000630] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000631] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000632] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">8</td>
                            <td style="text-align: center;">Perawatan dirumah</td>
                            <td style="text-align: center;">{{ $item[3000633] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000634] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000635] ?? '' }}<br>
                                {{ getCheckBox($item[3000636] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000637] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000638] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000639] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000640] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000641] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000642] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000643] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000644] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">9</td>
                            <td style="text-align: center;">Cuci Tangan yang benar</td>
                            <td style="text-align: center;">{{ $item[3000645] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000646] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000647] ?? '' }}<br>
                                {{ getCheckBox($item[3000648] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000649] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000650] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000651] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000652] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000653] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000654] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000655] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000656] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">10</td>
                            <td style="text-align: center;">Peran keluarga dalam perawatan pasien</td>
                            <td style="text-align: center;">{{ $item[3000657] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000658] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000659] ?? '' }}<br>
                                {{ getCheckBox($item[3000660] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000661] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000662] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000663] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000664] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000665] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000666] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000667] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000668] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">11</td>
                            <td style="text-align: center;">Pelayanan Kerohanian</td>
                            <td style="text-align: center;">{{ $item[3000669] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000670] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000671] ?? '' }}<br>
                                {{ getCheckBox($item[3000672] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000673] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000674] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000675] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000676] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000677] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000678] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000679] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000680] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">12</td>
                            <td style="text-align: center;">Pencegahan Risiko Jauh</td>
                            <td style="text-align: center;">{{ $item[3000681] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000682] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000683] ?? '' }}<br>
                                {{ getCheckBox($item[3000684] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000685] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000686] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000687] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000688] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000689] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000690] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000691] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000692] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">13</td>
                            <td style="text-align: center;">Orientasi ruang rawat inap</td>
                            <td style="text-align: center;">{{ $item[3000694] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000695] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000696] ?? '' }}<br>
                                {{ getCheckBox($item[3000697] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000698] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000699] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000700] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000701] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000702] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000703] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000704] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000705] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">14</td>
                            <td style="text-align: center;">{{ $item[3000706] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000707] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000708] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000709] ?? '' }}<br>
                                {{ getCheckBox($item[3000710] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000711] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000712] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000713] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000714] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000715] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000716] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000717] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000718] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center; height: 60px;">15</td>
                            <td style="text-align: center;">{{ $item[3000719] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000720] ?? '' }}</td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000721] ?? null) }} Leaflet, kode<br>
                                {{ $item[3000722] ?? '' }}<br>
                                {{ getCheckBox($item[3000723] ?? null) }} Lembar Balik
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000724] ?? null) }} Ceramah<br>
                                {{ getCheckBox($item[3000725] ?? null) }} Demonstrasi
                            </td>
                            <td style="text-align: center;">
                                {{ getCheckBox($item[3000726] ?? null) }} Sudah Mengerti<br>
                                {{ getCheckBox($item[3000727] ?? null) }} Re-edukasi<br>
                                {{ getCheckBox($item[3000728] ?? null) }} Re-demonstrasi
                            </td>
                            <td style="text-align: center;">{{ $item[3000729] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000730] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000731] ?? '' }}</td>
                        </tr>
                </tbody>
            </table>
        </div>

        <!-- LEMBAR BALIK -->
        <div style="margin-top: 15px;">
            <div class="title-section">LEMBAR BALIK</div>
            
            <table cellpadding="2" cellspacing="0" border="1">
                <thead style="background-color: #e8e8e8;">
                    <tr>
                        <th style="width: 20%; text-align: center;">Tanggal</th>
                        <th style="width: 40%;">Materi Edukasi</th>
                        <th style="width: 20%;">Nama & TTD Edukator</th>
                        <th style="width: 20%;">Nama & TTD Penerima Edukasi</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td style="text-align: center; height: 40px;">{{ $item[3000732] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000733] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000734] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000735] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">{{ $item[3000736] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000737] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000738] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000739] ?? '' }}</td>
                        </tr>
                        <tr>
                            <td style="text-align: center;">{{ $item[3000740] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000741] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000742] ?? '' }}</td>
                            <td style="text-align: center;">{{ $item[3000743] ?? '' }}</td>
                        </tr>
                </tbody>
            </table>
        </div>

    </section>
</body>
</html>

