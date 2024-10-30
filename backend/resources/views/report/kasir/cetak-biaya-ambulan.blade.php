<html>

<head>
    <title>
        Report
    </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
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
        padding: 20px;
    }

    .paragraph-header {
        font-size: 9px;
        margin-bottom: 3px;
    }

    .paragraph-body {
        font-size: 11px;
    }

    @media print {
        @page {
            size: A4;
            margin: 0;
        }
    }
</style>

<body>
    <div class="print-container">
        <div class="row" style="margin-bottom: 20px;">
            <div class="col-9">
                <div class="row">
                    <div class="col-2 d-flex justify-content-center align-items-center">
                        <img src="{{ asset('service/img/logo_grhasia.png') }}" style="width: 80px" border="0" />
                    </div>
                    <div class="col-10">
                        <h5>Rumah Sakit Jiwa Grhasia</h5>
                        <p class="paragraph-header">
                            Jalan Kaliurang KM.17, Duwetsari, Pakembinangun, Kec. Pakem, Kabupaten
                            Sleman, Daerah Istimewa Yogyakarta, 55582, Tlpn. (0274), 895297, Fax. (0274)
                        </p>
                        <p class="paragraph-header">
                            Email. grhasiamentalhospital@jogjaprov.go.id
                        </p>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <p class="paragraph-header" style="font-weight: bold;">
                    No Struk :
                </p>
                <p class="paragraph-header" style="font-weight: bold;">
                    Tanggal Struk :
                </p>
            </div>
        </div>
        <div class="row" style="margin-bottom: 20px;">
            <div class="col d-flex justify-content-center align-items-center"
                style="padding:5px 0px; border-top: 2px solid black; border-bottom: 2px solid black;">
                <h5>Rincian Biaya Pelayanan</h5>
            </div>
        </div>
        <div class="row" style="margin-bottom: 20px;">
            <div class="col-4">
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">No.Registrasi:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">2410000310</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">No.RM:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">0123527</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Nama Pasien:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">RUTH ARCELIA MURALI (P)</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Tipe:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">BPJS</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">No SEP:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body" style="font-weight: bold;">1202R0031024V001587</span>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Unit:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">Poliklinik Jiwa</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Kamar:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">-</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Kelas:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">Non Kelas</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Dokter P.Jawab:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">dr. BUDI KRISTIANTO, M.Sc.,Sp.KJ,(K)</span>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Tgl.Masuk:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">29/10/2024 07:30</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Tgl.Pulang:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">29/10/2024 07:30</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Penjamin:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">BPJS</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <span class="paragraph-body" style="font-weight: bold;">Alamat:</span>
                    </div>
                    <div class="col-7">
                        <span class="paragraph-body">
                            KUTUTEGAL RT 9 RW 25 SINDUADI,MLATI,KAB. SLEMAN,DI.YOGYAKARTA
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <table class="table" style="font-size: 11px; margin-bottom: 20px;">
            <thead style="border-top: 1px solid black;">
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Tanggal</th>
                    <th scope="col">Deskripsi</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Tarif</th>
                    <th scope="col">Sub Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>Otto</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <td colspan="5" class="table-active"
                        style="font-weight: bold; font-style: italic; text-align: right;">
                        Jumlah Billing
                    </td>
                    <td style="font-weight: bold">
                        20000
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="container">
            <div class="row justify-content-end">
                <div class="col-auto text-end" style="font-size: 11px;">
                    <div class="text-center">
                        <span>Sleman, Oktober 2024</span>
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
        

    </div>
</body>

</html>
