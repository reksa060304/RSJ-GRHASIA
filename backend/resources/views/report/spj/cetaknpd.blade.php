<html>
<head>
    <title>Nota Pencairan Dana (NPD)</title>
    <style>
        @page {
            margin: 15mm 15mm 20mm 20mm;
            size: A4 landscape;
        }

        @media print {
            body {
                margin: 0;
            }
        }

        body {
            font-family: Arial;
            font-size: 11pt;
            width: 27.5cm; /* Landscape width adjusted for margins */
            margin: auto;
        }

        table {
            font-family: 'Arial';
            margin: 0;
            padding: .1cm 0;
            font-size: 11pt;
            width: 100%;
            border-collapse: collapse;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h2 {
            margin: 0;
            font-size: 16pt;
            font-weight: bold;
        }

        .header h3 {
            margin: 0;
            font-size: 14pt;
            font-weight: bold;
        }

        .info-table td {
            padding: 2px;
            vertical-align: top;
            border: none !important;
        }

        .tabel {
            width: 100%;
            border-collapse: collapse;
        }

        .tabel th, .tabel td {
            border: 1px solid black;
            padding: 3px;
            font-size: 9pt;
        }

        .tabel th {
            background-color: #f2f2f2;
            text-align: center;
            font-weight: bold;
        }

        .text-right {
            text-align: right;
            white-space: nowrap;
        }

        .text-center {
            text-align: center;
        }

        .footer-section {
            width: 100%;
            margin-top: 15px;
        }

        .terbilang {
            font-style: italic;
            margin-top: 5px;
            padding: 5px;
        }
    </style>
</head>
<body>
    @php
        function terbilang($nilai) {
            $nilai = abs($nilai);
            $huruf = array("", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas");
            $temp = "";
            if ($nilai < 12) {
                $temp = " ". $huruf[$nilai];
            } else if ($nilai < 20) {
                $temp = terbilang($nilai - 10). " Belas";
            } else if ($nilai < 100) {
                $temp = terbilang($nilai/10)." Puluh". terbilang($nilai % 10);
            } else if ($nilai < 200) {
                $temp = " Seratus" . terbilang($nilai - 100);
            } else if ($nilai < 1000) {
                $temp = terbilang($nilai/100) . " Ratus" . terbilang($nilai % 100);
            } else if ($nilai < 2000) {
                $temp = " Seribu" . terbilang($nilai - 1000);
            } else if ($nilai < 1000000) {
                $temp = terbilang($nilai/1000) . " Ribu" . terbilang($nilai % 1000);
            } else if ($nilai < 1000000000) {
                $temp = terbilang($nilai/1000000) . " Juta" . terbilang($nilai % 1000000);
            } else if ($nilai < 1000000000000) {
                $temp = terbilang($nilai/1000000000) . " Milyar" . terbilang(fmod($nilai,1000000000));
            } else if ($nilai < 1000000000000000) {
                $temp = terbilang($nilai/1000000000000) . " Trilyun" . terbilang(fmod($nilai,1000000000000));
            }     
            return $temp;
        }
    @endphp
    <table cellpadding="0" cellspacing="0" width="100%" border="0" style="margin-bottom: 20px;">
        <tbody>
            <tr>
                <td align="center">
                    <b style="font-size: 25px;">
                        RS JIWA GRHASIA DINKES DIY
                    </b>
                </td>
            </tr>
            <tr align="center">
                <td>
                    <b style="font-size: 22px;">NOTA PENCAIRAN DANA (NPD)</b>
                </td>
            </tr>
        </tbody>
    </table>

    <table class="info-table" style="border-bottom: 1px solid black; margin-bottom: 5px;">
        <tr>
            <td colspan="3" class="text-center" style="font-weight: bold; border: 1px solid black;">BENDAHARA PENGELUARAN</td>
        </tr>
        <tr>
            <td colspan="3" class="text-center" style="font-weight: bold; border: 1px solid black;">SKPD : RS Jiwa Grhasia</td>
        </tr>
    </table>

    <p style="margin: 5px 0;">Supaya mencairkan dana kegiatan :</p>

    <table class="info-table">
        <tr>
            <td width="280" style="white-space: nowrap;">1. Pejabat Pelaksana Teknis Kegiatan</td>
            <td width="10">:</td>
            <td>{{ isset($subsubkegiatan[0]->pptk) ? $subsubkegiatan[0]->pptk : '............................................................' }}</td>
        </tr>
        <tr>
            <td>2. Program</td>
            <td>:</td>
            <td>{{ isset($subsubkegiatan[0]->program) ? $subsubkegiatan[0]->program : '-' }}</td>
        </tr>
        <tr>
            <td>3. Kegiatan</td>
            <td>:</td>
            <td>{{ isset($subsubkegiatan[0]->kegiatan) ? $subsubkegiatan[0]->kegiatan : '-' }}</td>
        </tr>
        <tr>
            <td>4. Sub Kegiatan</td>
            <td>:</td>
            <td>{{ $subkegiatan[0]->kode.' - '.$subkegiatan[0]->keterangan }}</td>
        </tr>
        <tr>
            <td>5. Sub Sub Kegiatan</td>
            <td>:</td>
            <td>{{ $subsubkegiatan[0]->kode.' - '.$subsubkegiatan[0]->keterangan2 }}</td>
        </tr>
        <tr>
            <td>6. Nomor DPA-SKPD</td>
            <td>:</td>
            <td>{{ $signatories->nomordasarpengeluaran ?? '............................................................' }}</td>
        </tr>
        <tr>
            <td>7. Tahun Anggaran</td>
            <td>:</td>
            <td>{{ $tahun }}</td>
        </tr>
    </table>

    <p class="text-center" style="font-weight: bold; margin: 10px 0;">Pembebanan pada kode rekening :</p>

    <table class="tabel">
        <thead>
            <tr>
                <th rowspan="2" width="30">No. Urut</th>
                <th rowspan="2" width="110">Kode Rekening</th>
                <th rowspan="2">Uraian</th>
                <th rowspan="2" width="105">Anggaran</th>
                <th rowspan="2" width="105">Akumulasi Pencairan sebelumnya</th>
                <th colspan="3">Pencairan saat ini</th>
                <th rowspan="2" width="105">Akumulasi Pencairan s.d saat ini</th>
                <th rowspan="2" width="105">Sisa</th>
            </tr>
            <tr>
                <th width="105">Sisa Pencairan Sebelumnya</th>
                <th width="105">UP/GU/TU</th>
                <th width="80">LS</th>
            </tr>
        </thead>
        <tbody>
            @php
                $no = 1;
                $totalAnggaran = 0;
                $totalPrev = 0;
                $totalUP = 0;
                $totalLS = 0;
                $totalAkumulasi = 0;
                $totalSisa = 0;
                $totalSisaPencairanPrev = 0;
            @endphp
            @foreach ($data as $dt)
                @php
                    $akumulasiPrev = $dt->spj_prev; 
                    $pencairanUP = $dt->spj_current; 
                    $pencairanLS = 0; 
                    $akumulasiTotal = $dt->jumlahspj;
                    
                    $totalAnggaran += $dt->jumlahanggaran;
                    $totalPrev += $akumulasiPrev;
                    $totalUP += $pencairanUP;
                    $totalLS += $pencairanLS;
                    $totalAkumulasi += $akumulasiTotal;
                    $totalSisa += $dt->sisaanggaran;
                    $totalSisaPencairanPrev += ($dt->angkas_prev - $akumulasiPrev);
                @endphp
                <tr>
                    <td class="text-center">{{ $no++ }}</td>
                    <td class="text-center">{{ $dt->kodemataanggaran }}</td>
                    <td>{{ $dt->namamataanggaran }}</td>
                    <td class="text-right">Rp {{ number_format($dt->jumlahanggaran, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($akumulasiPrev, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($dt->angkas_prev - $akumulasiPrev, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($pencairanUP, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($pencairanLS, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($akumulasiTotal, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($dt->sisaanggaran, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
        <tbody>
            <tr style="font-weight: bold;">
                <td colspan="3" class="text-center uppercase">JUMLAH</td>
                <td class="text-right">Rp {{ number_format($totalAnggaran, 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($totalPrev, 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($totalSisaPencairanPrev, 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($totalUP, 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($totalLS, 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($totalAkumulasi, 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($totalSisa, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <table style="width: 100%;">
        <tr>
            <td width="150">Jumlah yang diminta</td>
            <td width="10">:</td>
            <td style="font-weight: bold;">Rp {{ number_format($totalAkumulasi, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td>Terbilang</td>
            <td>:</td>
            <td class="terbilang" id="terbilang_text">
                {{ terbilang($totalAkumulasi) }} Rupiah
            </td>
        </tr>
    </table>

    <div class="footer-section">
        <table style="width: 100%; border: none;">
            <tr>
                <td style="width: 33%; vertical-align: top;">
                    <p style="margin: 0;">Menyetujui :</p>
                    <p style="margin: 0;">Direktur</p>
                    <br><br><br><br><br><br>
                    <p style="margin: 0; font-weight: bold; text-decoration: underline;">{{ $signatories->direktur ?? '-' }}</p>
                    <p style="margin: 0;">NIP. {{ $signatories->nip_direktur ?? '-' }}</p>
                </td>
                <td style="width: 33%; vertical-align: top; text-align: center;">
                    <p style="margin: 0;">Lunas dibayar Tgl {{ $tgllunas }}</p>
                    <p style="margin: 0;">Bendahara Pengeluaran</p>
                    <br><br><br><br><br><br>
                    <p style="margin: 0; font-weight: bold; text-decoration: underline;">{{ $signatories->bendahara ?? '-' }}</p>
                    <p style="margin: 0;">NIP. {{ $signatories->nip_bendahara ?? '-' }}</p>
                </td>
                <td style="width: 33%; vertical-align: top; text-align: right;">
                    <p style="margin: 0;">Yogyakarta, {{ $tglcetak }}</p>
                    <p style="margin: 0;">Pejabat pelaksana Teknis Kegiatan,</p>
                    <br><br><br><br><br><br>
                    <p style="margin: 0; font-weight: bold; text-decoration: underline;">{{ $subsubkegiatan[0]->pptk ?? '-' }}</p>
                    <p style="margin: 0;">NIP. {{ $subsubkegiatan[0]->nip_pptk ?? '-' }}</p>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="vertical-align: bottom;">
                    <p style="margin: 20px 0 0 0;">NPD akan dipertanggungjawabkan oleh PPTK tanggal : {{ $tglpj }}</p>
                </td>
                <td style="text-align: right; vertical-align: top;">
                    <br>
                    <p style="margin: 0;">Pelaksana,</p>
                    <br><br><br><br><br><br>
                    <p style="margin: 0; font-weight: bold; text-decoration: underline;">{{ $signatories->bendahara ?? '-' }}</p>
                    <p style="margin: 0;">NIP. {{ $signatories->nip_bendahara ?? '-' }}</p>
                </td>
            </tr>
        </table>
    </div>
    <script>
        window.print();
    </script>
</body>
</html>

