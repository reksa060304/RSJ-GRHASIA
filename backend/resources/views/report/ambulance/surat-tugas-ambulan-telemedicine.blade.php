<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Surat Perintah Tugas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <style>
        /* Reset dan Base Styles */
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            background-color: #CCCCCC;
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.4;
        }

        /* Container */
        .print-container {
            width: 100%;
            max-width: 210mm;
            background-color: #ffffff;
            margin: 0 auto;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        /* Typography */
        .header-title {
            font-size: 15px;
            font-weight: normal;
            margin-bottom: 0;
        }

        .header-subtitle {
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 0;
        }

        .header-contact {
            font-size: 12px;
            margin-bottom: 0;
        }

        .document-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .document-number {
            font-size: 12px;
            margin-bottom: 0;
        }

        .section-title {
            font-size: 12px;
            font-weight: bold;
        }

        .content-text {
            font-size: 12px;
            margin-bottom: 0;
        }

        .command-title {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 15px;
        }

        /* Layout Components */
        .header-section {
            margin-bottom: 20px;
        }


        .content-row {
            margin-bottom: 5px;
            display: flex;
            align-items: flex-start;
        }

        .content-row-spaced {
            margin-bottom: 15px;
        }

        .label-col {
            flex: 0 0 15%;
            padding-right: 10px;
        }

        .content-col {
            flex: 1;
        }

        /* Person Details */
        .person-item {
            margin-bottom: 15px;
        }

        .person-number {
            flex: 0 0 8%;
            font-weight: bold;
        }

        .person-details {
            flex: 1;
        }

        .detail-row {
            display: flex;
            margin-bottom: 2px;
        }

        .detail-label {
            flex: 0 0 25%;
            font-size: 12px;
        }

        .detail-separator {
            flex: 0 0 3%;
            font-size: 12px;
        }

        .detail-value {
            flex: 1;
            font-size: 12px;
        }

        /* Task Details */
        .task-details .detail-label {
            flex: 0 0 30%;
        }

        /* Signature Section */
        .signature-section {
            margin-top: 30px;
        }

        .signature-content {
            text-align: center;
        }

        .signature-space {
            height: 60px;
        }

        .signature-name {
            text-decoration: underline;
            font-weight: bold;
        }

        /* Logo Styling */
        .logo-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .logo-img {
            max-width: 100%;
            height: auto;
            /* Set a fixed height for logos */
        }

        .aksara-img {
            width: 30%;
            margin: 2px 0;
        }

        /* Print Styles */
        @media print {
            @page {
                size: A4;
                margin: 15mm;
            }

            body {
                background-color: white;
            }

            .print-container {
                width: 100%;
                max-width: none;
                padding: 0;
                box-shadow: none;
                margin: 0;
            }

            .no-print {
                display: none;
            }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .print-container {
                padding: 20px;
                margin: 10px;
            }

            .header-title {
                font-size: 13px;
            }

            .header-subtitle {
                font-size: 12px;
            }

            .detail-label {
                flex: 0 0 35%;
            }
        }
    </style>
</head>

@php
    $tanggal = \Carbon\Carbon::now();
    $bulan = [
        'January' => 'Januari',
        'February' => 'Februari',
        'March' => 'Maret',
        'April' => 'April',
        'May' => 'Mei',
        'June' => 'Juni',
        'July' => 'Juli',
        'August' => 'Agustus',
        'September' => 'September',
        'October' => 'Oktober',
        'November' => 'November',
        'December' => 'Desember'
    ];
    $hari = [
        'Monday' => 'Senin',
        'Tuesday' => 'Selasa',
        'Wednesday' => 'Rabu',
        'Thursday' => 'Kamis',
        'Friday' => 'Jumat',
        'Saturday' => 'Sabtu',
        'Sunday' => 'Minggu'
    ];

    function formatTanggalIndonesia($date, $hari, $bulan)
    {
        if (!$date)
            return '-';
        $carbonDate = \Carbon\Carbon::parse($date);
        return $hari[$carbonDate->format('l')] . ', ' .
            $carbonDate->format('d') . ' ' .
            $bulan[$carbonDate->format('F')] . ' ' .
            $carbonDate->format('Y');
    }

    function getImagePath($imageName)
    {
        return stripos(\Request::url(), 'localhost') !== FALSE
            ? asset('img/' . $imageName)
            : asset('service/img/' . $imageName);
    }
@endphp

<body>
    <div class="print-container">
        <div class="header-section">
            <div class="row align-items-center">
                <div class="col-2 text-center">
                    <img src="{{ getImagePath('logo-diy.jpeg') }}" alt="Logo DIY"
                        style="max-height: 100px; max-width: 100%; object-fit: contain;" />
                </div>
                <div class="col-8 text-center">
                    <p class="header-title mb-0">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</p>
                    <h5 class="header-subtitle mb-0">DINAS KESEHATAN</h5>
                    <h5 class="header-subtitle mb-1">RUMAH SAKIT JIWA GRHASIA</h5>

                    <img src="{{ getImagePath('Aksara Jawa_Surat.png') }}" class="aksara-img" alt="Aksara Jawa"
                        style="width: 30%; margin: 4px 0;" />

                    <div class="mt-2">
                        <p class="header-contact">Jalan Kaliurang Km 17 Sleman, Telepon: (0274) 895143, (0274) 895297
                        </p>
                        <p class="header-contact">Faksimile: (0274) 895142, Pos-el:
                            grhasia.mentalhospital@jogjaprov.go.id</p>
                        <p class="header-contact">Laman: grhasia.jogjaprov.go.id</p>
                    </div>
                </div>
                <div class="col-2 text-center">
                    <img src="{{ getImagePath('logo_grhasiafull.png') }}" alt="Logo Grhasia"
                        style="max-height: 170px; max-width: 100%; object-fit: contain;" />
                </div>
            </div>
            <hr style="border-top: 2px solid black; margin: 20px 0;">
        </div>

        <div class="text-center mb-4">
            <p class="document-title">SURAT PERINTAH TUGAS</p>
            <p class="document-number">Nomor : {{ $data[0]->nomorsurat ?? '-' }}</p>
        </div>

        <div class="content-row content-row-spaced">
            <div class="label-col">
                <span class="section-title">Dasar :</span>
            </div>
            <div class="content-col">
                <p class="content-text">{{ $data[0]->dasar_surat ?? '-' }}</p>
            </div>
        </div>

        <div class="command-title">MEMERINTAHKAN :</div>

        <div class="content-row-spaced">
            <div class="content-row">
                <div class="label-col">
                    <span class="section-title">Kepada :</span>
                </div>
                <div class="content-col">
                    @php $no = 1; @endphp

                    {{-- Petugas 1, 2, 3 --}}
                    @foreach(['petugas1', 'petugas2', 'petugas3'] as $petugas)
                        @if(!empty($data[0]->{'nama' . $petugas}))
                            <div class="person-item">
                                <div class="content-row">
                                    <div class="person-number">{{ $no++ }}.</div>
                                    <div class="person-details">
                                        <div class="detail-row">
                                            <span class="detail-label">Nama</span>
                                            <span class="detail-separator">:</span>
                                            <span class="detail-value">{{ $data[0]->{'nama' . $petugas} }}</span>
                                        </div>
                                        <div class="detail-row">
                                            <span class="detail-label">Pangkat/Gol</span>
                                            <span class="detail-separator">:</span>
                                            <span class="detail-value">{{ $data[0]->{'pangkat_' . $petugas} ?? '-' }}</span>
                                        </div>
                                        <div class="detail-row">
                                            <span class="detail-label">NIP</span>
                                            <span class="detail-separator">:</span>
                                            <span class="detail-value">{{ $data[0]->{'nip_' . $petugas} ?? '-' }}</span>
                                        </div>
                                        <div class="detail-row">
                                            <span class="detail-label">Jabatan</span>
                                            <span class="detail-separator">:</span>
                                            <span class="detail-value">{{ $data[0]->{'jabatan_' . $petugas} ?? '-' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endif
                    @endforeach
                </div>
            </div>
        </div>

        <div class="content-row-spaced">
            <div class="content-row">
                <div class="label-col">
                    <span class="section-title">Untuk :</span>
                </div>
                <div class="content-col task-details">
                    <div class="detail-row">
                        <span class="detail-label">Tujuan Tugas</span>
                        <span class="detail-separator">:</span>
                        <span
                            class="detail-value">{{ preg_replace('/^[A-Z0-9]{4}\+[A-Z0-9]{2,3},\s*/', '', $data[0]->address ?? '-') }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Lama Tugas</span>
                        <span class="detail-separator">:</span>
                        <span class="detail-value">1 (satu) hari</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Hari/Tanggal</span>
                        <span class="detail-separator">:</span>
                        <span
                            class="detail-value">{{ formatTanggalIndonesia($data[0]->tglpelayanan ?? null, $hari, $bulan) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Keperluan</span>
                        <span class="detail-separator">:</span>
                        <span
                            class="detail-value">{{ $data[0]->namajeniskegiatan ?? 'Penjemputan Pasien a.n ' . ($data[0]->namapasien_klien ?? '-') }}</span>
                    </div>
                </div>
            </div>
        </div>


        <div class="mb-4">
            <p class="content-text">Demikian Surat Perintah Tugas ini untuk dapat dilaksanakan dengan penuh tanggung
                jawab.</p>
        </div>
        <div class="signature-section">
            <div class="row">
                <div class="col-6"></div>
                <div class="col-6">
                    <div class="signature-content">
                        <p class="content-text">Dikeluarkan di Sleman</p>
                        <p class="content-text">Pada tanggal {{ $tanggal->format('d') }}
                            {{ $bulan[$tanggal->format('F')] }} {{ $tanggal->format('Y') }}</p>
                        <p class="content-text"><strong>DIREKTUR</strong></p>

                        <div class="signature-space"></div>

                        <p class="content-text signature-name">dr. AKHMAD AKHADI S., MPH</p>
                        <p class="content-text">NIP. 19680714 200012 1 002</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>