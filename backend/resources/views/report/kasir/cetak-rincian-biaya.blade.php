<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rincian Biaya Pelayanan</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 10mm 10mm 10mm 10mm;
        }
        body {
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            font-size: 10px;
            color: #000;
            margin: 0;
            padding: 0;
            background-color: #fff;
        }
        .main-container {
            width: 100%;
            margin: 0 auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .kop-table td {
            vertical-align: top;
        }
        .header-title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 2px;
        }
        .paragraph-header {
            font-size: 8.5px;
            line-height: 1.2;
            margin: 0 0 2px 0;
        }
        .print-info-table td {
            font-size: 8.5px;
            padding: 1px 3px;
            vertical-align: top;
        }
        .title-box {
            border-top: 1.5px solid #000;
            border-bottom: 1.5px solid #000;
            text-align: center;
            font-weight: bold;
            font-size: 12px;
            padding: 4px 0;
            margin: 4px 0 8px 0;
        }
        .patient-table td {
            font-size: 9.5px;
            vertical-align: top;
            padding: 1px 2px;
        }
        .label-bold {
            font-weight: bold;
        }
        .data-table {
            margin-top: 6px;
            margin-bottom: 10px;
        }
        .data-table th {
            border-top: 1.5px solid #000;
            border-bottom: 1.5px solid #000;
            padding: 4px 3px;
            font-size: 9.5px;
            font-weight: bold;
        }
        .data-table td {
            border-bottom: 1px dashed #bbb;
            padding: 3px 3px;
            font-size: 9.5px;
            vertical-align: top;
        }
        .summary-table td {
            padding: 2px 3px;
            font-size: 9.5px;
        }
        .terbilang-box {
            font-size: 9.5px;
            padding-top: 4px;
        }
        .signature-box {
            margin-top: 20px;
            font-size: 9.5px;
        }
    </style>
</head>
<body>
<div class="main-container">

    {{-- ===== HEADER / KOP RS ===== --}}
    <table class="kop-table" style="padding-bottom: 5px;">
        <tr>
            <td style="width: 10%; text-align: center;">
                <?php
                    $logoPath = public_path('img/logo_grhasia_new.png');
                    if (file_exists($logoPath)) {
                        $rawContent = file_get_contents($logoPath);
                        if (strpos($rawContent, 'iCCP') !== false) {
                            $imgTemp = @imagecreatefrompng($logoPath);
                            if ($imgTemp) {
                                imagealphablending($imgTemp, false);
                                imagesavealpha($imgTemp, true);
                                ob_start();
                                imagepng($imgTemp);
                                $cleanPng = ob_get_clean();
                                imagedestroy($imgTemp);
                                $logoSrc = 'data:image/png;base64,' . base64_encode($cleanPng);
                            } else {
                                $logoSrc = 'data:image/png;base64,' . base64_encode($rawContent);
                            }
                        } else {
                            $logoSrc = 'data:image/png;base64,' . base64_encode($rawContent);
                        }
                    } else {
                        $logoSrc = asset('img/logo_grhasia_new.png');
                    }
                ?>
                <img src="{{ $logoSrc }}" style="width: 60px;" alt="Logo" />
            </td>
            <td style="width: 62%; padding-left: 8px;">
                <div class="header-title">Rumah Sakit Jiwa Grhasia</div>
                <div class="paragraph-header">Jalan Kaliurang KM.17, Duwetsari, Pakembinangun, Kec. Pakem, Kabupaten</div>
                <div class="paragraph-header">Sleman, Daerah Istimewa Yogyakarta, 55582, Tlpn. (0274), 895297, Fax. (0274)</div>
                <div class="paragraph-header">Email: grhasiamentalhospital@jogjaprov.go.id</div>
                <div class="paragraph-header">Website: www.grhasia.jogjaprov.go.id</div>
            </td>
            <td style="width: 28%;">
                <table class="print-info-table">
                    <tr>
                        <td style="font-weight: bold; width: 45%;">Print by</td>
                        <td>{{ $user }}</td>
                    </tr>
                    <tr>
                        <td>{{ date('d/m/Y') }}</td>
                        <td>{{ date('H:i:s') }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">No Struk</td>
                        <td>{{ $header->nokwitansi ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">Tgl. Struk</td>
                        <td>
                            @if(!empty($header->tglstruk))
                                {{ date('d/m/Y H:i:s', strtotime($header->tglstruk)) }}
                            @else
                                -
                            @endif
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- ===== JUDUL LAPORAN (2 BARIS: 1 ATAS, 1 BAWAH) ===== --}}
    <div class="title-box">
        Rincian Biaya Pelayanan
    </div>

    {{-- ===== DATA PASIEN (3 KOLOM TABLE) ===== --}}
    <table style="width: 100%; margin-bottom: 6px;">
        <tr>
            {{-- Kolom 1 --}}
            <td style="width: 33%; vertical-align: top; padding-right: 5px;">
                <table class="patient-table">
                    <tr>
                        <td style="width: 42%;" class="label-bold">No. Registrasi</td>
                        <td>: {{ $header->noregistrasi }}</td>
                    </tr>
                    <tr>
                        <td class="label-bold">No. RM</td>
                        <td>: {{ $header->nocm }}</td>
                    </tr>
                    <tr>
                        <td class="label-bold">Nama Pasien</td>
                        <td>: {{ $header->namapasienjk }}</td>
                    </tr>
                    <tr>
                        <td class="label-bold">Tipe</td>
                        <td>: {{ $header->tipepasien }}</td>
                    </tr>
                </table>
            </td>
            {{-- Kolom 2 --}}
            <td style="width: 33%; vertical-align: top; padding-right: 5px;">
                <table class="patient-table">
                    <tr>
                        <td style="width: 42%;" class="label-bold">Unit</td>
                        <td>: {{ $header->unit }}</td>
                    </tr>
                    <tr>
                        <td class="label-bold">Kamar</td>
                        <td>: {{ $header->namakamar ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label-bold">Kelas</td>
                        <td>: {{ $header->namakelas ?? 'Non Kelas' }}</td>
                    </tr>
                    <tr>
                        <td class="label-bold">Dokter P.Jawab</td>
                        <td>: {{ $header->dokterpj ?? '-' }}</td>
                    </tr>
                </table>
            </td>
            {{-- Kolom 3 --}}
            <td style="width: 34%; vertical-align: top;">
                <table class="patient-table">
                    <tr>
                        <td style="width: 40%;" class="label-bold">Tgl. Masuk</td>
                        <td>:
                            @if(!empty($header->tglregistrasi))
                                {{ date('d/m/Y H:i', strtotime($header->tglregistrasi)) }}
                            @else
                                -
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="label-bold">Tgl. Pulang</td>
                        <td>:
                            @if(!empty($header->tglpulang))
                                {{ date('d/m/Y H:i', strtotime($header->tglpulang)) }}
                            @else
                                -
                            @endif
                        </td>
                    </tr>
                    <tr>
                        <td class="label-bold">Penjamin</td>
                        <td>: {{ $header->namarekanan ?? '-' }}</td>
                    </tr>
                    <tr>
                        <td class="label-bold">Alamat</td>
                        <td>: {{ $header->alamat ?? '-' }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- ===== TABLE LAYANAN (GROUPED BY JENIS & RUANGAN) ===== --}}
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 3%; text-align: left;">No</th>
                <th style="width: 9%; text-align: left;">Tanggal</th>
                <th style="width: 27%; text-align: left;">Deskripsi</th>
                <th style="width: 9%; text-align: left;">Kelas</th>
                <th style="width: 19%; text-align: left;">Dokter</th>
                <th style="width: 5%; text-align: right;">Qty</th>
                <th style="width: 9%; text-align: right;">Tarif</th>
                <th style="width: 8%; text-align: right;">Diskon</th>
                <th style="width: 11%; text-align: right;">Sub Total</th>
            </tr>
        </thead>
        <tbody>
            @php
                $grandTotal = 0;
                $rowNo = 1;
            @endphp
            @foreach($groupedBilling as $jenisGroup)
                @php
                    $grandTotal += $jenisGroup['totalJenis'];
                @endphp
                {{-- Group Level 1: Jenisproduk --}}
                <tr style="font-style: italic; font-weight: bold;">
                    <td colspan="7" style="border-bottom: none; padding-top: 5px;">Jenis : {{ $jenisGroup['jenis'] }}</td>
                    <td style="text-align: right; border-bottom: none; padding-top: 5px;">::</td>
                    <td style="text-align: right; border-bottom: none; padding-top: 5px;">{{ number_format($jenisGroup['totalJenis'], 2, ',', '.') }}</td>
                </tr>

                @foreach($jenisGroup['ruanganList'] as $ruanganGroup)
                    {{-- Group Level 2: Ruangan --}}
                    <tr style="font-weight: bold;">
                        @if(!empty($ruanganGroup['isResep']))
                            <td colspan="3" style="border-bottom: none; padding-top: 3px;">{{ $ruanganGroup['ruangan'] }}</td>
                            <td style="border-bottom: none; padding-top: 3px;"></td>
                            <td style="border-bottom: none; padding-top: 3px; font-weight: normal;">{{ $ruanganGroup['dokterHeader'] }}</td>
                            <td colspan="3" style="border-bottom: none; padding-top: 3px;"></td>
                            <td style="text-align: right; border-bottom: none; padding-top: 3px;">{{ number_format($ruanganGroup['totalRuangan'], 2, ',', '.') }}</td>
                        @else
                            <td colspan="8" style="border-bottom: none; padding-top: 3px;">{{ $ruanganGroup['ruangan'] }}</td>
                            <td style="text-align: right; border-bottom: none; padding-top: 3px;">{{ number_format($ruanganGroup['totalRuangan'], 2, ',', '.') }}</td>
                        @endif
                    </tr>

                    {{-- Data Rows --}}
                    @foreach($ruanganGroup['items'] as $item)
                        <tr>
                            <td style="text-align: left;">{{ $rowNo++ }}</td>
                            <td style="text-align: left;">{{ date('d/m/Y', strtotime($item->tglpelayanan)) }}</td>
                            <td>{{ $item->namaproduk }}</td>
                            <td>{{ $item->namakelas }}</td>
                            <td>{{ $item->dokter }}</td>
                            <td style="text-align: right;">{{ number_format($item->jumlah, 2, ',', '.') }}</td>
                            <td style="text-align: right;">{{ number_format($item->hargajual, 2, ',', '.') }}</td>
                            <td style="text-align: right;">{{ number_format($item->diskon, 2, ',', '.') }}</td>
                            <td style="text-align: right;">{{ number_format($item->total, 2, ',', '.') }}</td>
                        </tr>
                    @endforeach
                @endforeach
            @endforeach
        </tbody>
    </table>

    {{-- ===== RINGKASAN BIAYA (SUMMARY & PERINCIAN) ===== --}}
    <div style="page-break-inside: avoid; margin-top: 10px;">
        <table style="width: 100%; margin-bottom: 5px;">
            <tr>
                {{-- Column 1: Perincian --}}
                <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                    <table class="summary-table" style="width: 100%;">
                        <tr>
                            <td style="width: 25%; font-weight: bold; vertical-align: top;">PERINCIAN</td>
                            <td style="width: 42%;">DITANGGUNG PERUSAHAAN</td>
                            <td style="width: 3%; text-align: center;">:</td>
                            <td style="width: 30%; text-align: right;">{{ number_format($ditanggungPerusahaan ?? 0, 2, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>DITANGGUNG RUMAH SAKIT</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">0.00</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>DITANGGUNG SENDIRI / OBAT</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">{{ number_format($ditanggungSendiri ?? 0, 2, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>SURPLUS / MINUS KE RS</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">0.00</td>
                        </tr>
                    </table>
                </td>

                {{-- Column 2: Ringkasan Biaya & Pembulatan --}}
                <td style="width: 52%; vertical-align: top;">
                    <table class="summary-table" style="width: 100%;">
                        <tr>
                            <td style="width: 55%; font-weight: bold;">PEMBULATAN</td>
                            <td style="width: 5%; text-align: center; font-weight: bold;">:</td>
                            <td style="width: 40%; text-align: right; font-weight: bold;">{{ number_format($pembulatan ?? 0, 0, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td>ADMINISTRASI</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">{{ number_format($totalAdmin ?? 0, 2, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td>MATERAI</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">{{ number_format($totalMaterai ?? 0, 2, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td>JUMLAH BIAYA</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">{{ number_format($grandTotal, 2, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td>DEPOSIT - UANG MUKA</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">{{ number_format($totalDeposit, 2, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td>DISKON JASA MEDIS</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">{{ number_format($totalDiskonMedis, 2, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td>DISKON UMUM</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">{{ number_format($totalDiskonUmum, 2, ',', '.') }}</td>
                        </tr>
                        <tr>
                            <td>SISA DEPOSIT</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">0.00</td>
                        </tr>
                        <tr style="font-weight: bold;">
                            <td>JUMLAH BILL</td>
                            <td style="text-align: center;">:</td>
                            <td style="text-align: right;">{{ number_format($header->totalharusdibayar ?? 0, 2, ',', '.') }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        {{-- ===== TERBILANG ===== --}}
        <div style="margin-top: 10px; margin-bottom: 12px; font-size: 9.5px;">
            <div style="font-weight: bold;">TERBILANG :</div>
            <div style="font-style: italic; font-weight: bold; padding-left: 10px;">
                # {{ strtoupper($terbilang) }} RUPIAH #
            </div>
        </div>

        {{-- ===== FOOTER TANDA TANGAN (4 KOLOM DENGAN GARIS VERTIKAL) ===== --}}
        <table style="width: 100%; border-top: 1px solid #000; border-bottom: 1px solid #000; border-collapse: collapse; margin-top: 5px; font-size: 9px;">
            <tr>
                {{-- Column 1: Kasir --}}
                <td style="width: 25%; border-right: 1px solid #000; vertical-align: top; padding: 4px;">
                    Sleman, &nbsp; {{ date('d/M/Y H:i:s') }}<br>
                    Kasir<br><br><br><br>
                </td>
                {{-- Column 2: Pemeriksa --}}
                <td style="width: 25%; border-right: 1px solid #000; vertical-align: top; padding: 4px;">
                    Pemeriksa
                </td>
                {{-- Column 3: Penanggung Biaya --}}
                <td style="width: 25%; border-right: 1px solid #000; vertical-align: top; padding: 4px;">
                    Penanggung Biaya
                </td>
                {{-- Column 4: Catatan --}}
                <td style="width: 25%; vertical-align: top; padding: 4px;">
                    Catatan<br><br><br>
                    <div style="text-align: right; font-size: 8.5px;">
                        @if(empty($isPdf))
                            Page 1 of 1<br>
                        @endif
                        <i>RJGR241217</i>
                    </div>
                </td>
            </tr>
        </table>
    </div>

</div>

<script type="text/php">
if (isset($pdf)) {
    $font = $fontMetrics->get_font("sans-serif", "normal");
    $pdf->page_text(500, 808, "Page {PAGE_NUM} of {PAGE_COUNT}", $font, 8, array(0,0,0));
}
</script>
</body>
</html>
