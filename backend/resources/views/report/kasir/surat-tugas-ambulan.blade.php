<html>

<head>
    <title>
        Report
    </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
</head>

<style>
    body {
        margin: 0;
        padding: 0;
        background-color: #CCCCCC;
    }

    .print-container {
        width: 100%;
        max-width: 210mm;
        background-color: #ffffff;
        margin: 0 auto;
        padding: 30px;
    }

    .paragraph-header {
        font-size: 9px;
        margin-bottom: 0px;
    }

    .h5 {
        margin-bottom: -2px;
    }

    .paragraph-body {
        font-size: 12px;
        margin-bottom: 0px;
    }

    .paragraph-footer {
        font-size: 10px;
        margin-bottom: 0px;
    }

    .ttd {
        font-size: 9.5px;
        margin-bottom: 0px;
    }

    @media print {
        @page {
            size: A4;
            margin: 0;
        }

        .container {
            width: 97% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
        }
    }
</style>

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
        'December' => 'Desember',
    ];
@endphp

<body>
    <div class="print-container">
        <div class="row" style="margin-bottom: 20px;">
            <div class="col-12">
                <div class="row">
                    <div class="col-2 d-flex justify-content-center align-items-center">
                        <img src="{{ asset('img/logo-diy.jpeg') }}" style="width: 100%;" border="0" />
                    </div>
                    <div class="col-8 d-flex flex-column justify-content-center align-items-center text-center">
                        <p style="font-size: 15px; margin-bottom: 0;">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</p>
                        <h5 class="h5">DINAS KESEHATAN</h5>
                        <h5 class="h5">RUMAH SAKIT JIWA GRHASIA</h5>
                        <img src="{{ asset('img/Aksara Jawa_surat.png') }}"
                            style="width: 30%; margin-top: 2px; margin-bottom: 2px;" border="0" />
                        <p class="paragraph-header">Jalan Kaliurang Km 17 Sleman, Telepon: (0274) 895143, 895297,
                            Faksimile: (0274) 895142</p>
                        <p class="paragraph-header">Laman: grhasia.jogjaprov.go.id, Surel:
                            grhasiamentalhospital@jogjaprov.go.id</p>
                        <p class="paragraph-header">Kode Pos 55582</p>
                    </div>
                    <div class="col-2"></div>
                </div>
            </div>
        </div>

        <div class="row" style="margin-bottom: 20px;">
            <div class="col-12">
                <div style="height: 2px; background-color: black; margin: 0;"></div>
            </div>
        </div>

        <div class="row" style="margin-bottom: 20px;">
            <div class="col-12 text-center">
                <p class="paragraph-body" style="font-weight: bold; margin-bottom: -2px">SURAT TUGAS AMBULAN</p>
                <p class="paragraph-body">Nomor : <input type="text" name="nomor_surat"
                        style="border: none; outline: none; background: transparent; width: 110px; text-align: center;">
                </p>
            </div>
        </div>
        <div class="row" style="margin-bottom: 10px;">
            <div class="col-12 text-center">
                <p class="paragraph-body" style="font-weight: bold;">MEMERINTAHKAN :</p>
            </div>
        </div>

        <table class="table table-bordered border-dark" style="font-size: 11px; margin-bottom: 20px;">
            <thead>
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Nama</th>
                    <th scope="col">NIP/NIKRS</th>
                    <th scope="col">Jabatan</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $index => $item)
                    @if ($item->id === 48)
                        <tr>
                            <th scope="row">{{ $index + 1 }}</th>
                            <td>{{ $item->namalengkap }}</td>
                            <td>{{ $item->nip }}</td>
                            <td>{{ $item->jabatan }}</td>
                        </tr>
                    @endif
                @endforeach
            </tbody>
        </table>

        <div class="row" style="margin-bottom: 20px; padding: 0px 20px">
            <div class="col-2 text-end">
                <p class="paragraph-body">Untuk : </p>
            </div>
            <div class="col-10">
                <p class="paragraph-body">
                    1. {{$data[0]->namajeniskegiatan}}
                </p>
                <p class="paragraph-body">
                    2. Berangkat tanggal : {{ \Carbon\Carbon::parse($data[0]->tglpelayanan)->format('d-m-Y') }}, jam :
                    {{ \Carbon\Carbon::parse($data[0]->tglpelayanan)->format('H:i') }}
                </p>
                <p class="paragraph-body">
                    3. Selesai melaksanakan tugas segera melaporkan ke Kepala Seksie / Subbagian terkait pelayanan
                    ambulans
                </p>
                <p class="paragraph-body" style="margin-top: 20px">
                    Demikian surat tugas ini dibuat untuk dapat dilaksanakan dengan baik sesuai dengan peraturan dan
                    ketentuan yang berlaku
                </p>

            </div>
        </div>

        <div class="row" style="margin-bottom: 20px">
            <div class="row justify-content-end">
                <div class="col-auto text-end" style="font-size: 11px;">
                    <div class="text-center">
                        <span>
                            Sleman, {{ $tanggal->format('d') }} {{ $bulan[$tanggal->format('F')] }}
                            {{ $tanggal->format('Y') }}
                        </span>
                    </div>
                    <div class="mb-5 text-center">
                        <span>DIREKTUR</span>
                    </div>
                    <div class="text-center">
                        <span style="text-decoration: underline;">dr. Akhmad Akhadi S, MPH</span>
                    </div>
                    <div>
                        <span>NIP. 19680714 200012 1 002</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="container text-center border border-0 border-dark" style="font-size: 11px; margin-bottom: 10px">
            <div class="row row-cols-4 border border-1 border-dark">
                <div class="col border border-top-0 border-bottom-0 border-left-0 border-right-1 border-dark">
                    <span>Dokter</span>
                </div>
                <div class="col border border-top-0 border-bottom-0 border-left-0 border-right-1 border-dark">
                    <span>Perawat</span>
                </div>
                <div class="col border border-top-0 border-bottom-0 border-left-0 border-right-1 border-dark">
                    <span>Sopir Ambulan</span>
                </div>
                <div class="col border border-top-0 border-bottom-0 border-left-0 border-right-1 border-dark">
                    <span>Yang Menerima</span>
                </div>
            </div>
            <div class="row row-cols-4 border border-1 border-top-0 border-dark" style="height: 70px;">
                <div
                    class="col border border-top-0 border-bottom-0 border-left-0 border-right-1 border-dark  d-flex align-items-end justify-content-center">
                    @foreach ($data as $item)
                        @if ($item->id === 1)
                            <span class="ttd">{{ $item->namalengkap }}</span>
                        @else
                            &nbsp;
                        @endif
                    @endforeach
                </div>
                <div
                    class="col border border-top-0 border-bottom-0 border-left-0 border-right-1 border-dark  d-flex align-items-end justify-content-center">
                    @foreach ($data as $item)
                        @if ($item->id === 2)
                            <span class="ttd">{{ $item->namalengkap }}</span>
                        @else
                            &nbsp;
                        @endif
                    @endforeach
                </div>
                <div
                    class="col border border-top-0 border-bottom-0 border-left-0 border-right-1 border-dark  d-flex align-items-end justify-content-center">
                    @foreach ($data as $item)
                        @if ($item->id === 48)
                            <span class="ttd">{{ $item->namalengkap }}</span>
                        @else
                            &nbsp;
                        @endif
                    @endforeach
                </div>
                <div
                    class="col border border-top-0 border-bottom-0 border-left-0 border-right-1 border-dark  d-flex align-items-end justify-content-center">
                    <span></span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <p class="paragraph-footer" style="font-style: italic;">
                    Catatan : SPT dibuat rangkap 2 (dua) dan wajib melampirkan
                </p>
                <p class="paragraph-footer" style="font-style: italic;">
                    1. Nota pembelian BBM yang sah
                </p>
                <p class="paragraph-footer" style="font-style: italic;">
                    2. FC identitas pasien (KTP/SIM/Kartu BPJS/Lain-lain)
                </p>
            </div>
        </div>
    </div>
</body>

</html>
