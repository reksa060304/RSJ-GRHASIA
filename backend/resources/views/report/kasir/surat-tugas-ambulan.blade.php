<html>

<head>
    <title>
        Report
    </title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
</head>
<style type="text/css" media="print">
    @page {
        size: auto;
        /* auto is the initial value */
        margin: 0;
        /* this affects the margin in the printer settings */
    }
</style>
<style>
    tr td {
        padding: 2px 4px 2px 4px;
    }

    /* .borderss {
        border-bottom: 1px solid black;
    } */

    body {
        font-family: Tahoma, Geneva, sans-serif;
    }

    /* tabel */
    .tg {
        border-collapse: collapse;
        border-spacing: 0;
    }

    .tg td {
        border-color: black;
        border-style: solid;
        border-width: 1px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        overflow: hidden;
        padding: 10px 5px;
        word-break: normal;
    }

    .tg th {
        /* border-color: black;
        border-style: solid;
        border-width: 1px; */
        font-family: Arial, sans-serif;
        font-size: 14px;
        overflow: hidden;
        padding: 10px 5px;
        word-break: normal;
    }

    .tg .tg-lboi {
        border-color: inherit;
        text-align: left;
        vertical-align: middle
    }

    .tg .tg-9wq8 {
        border-color: inherit;
        text-align: center;
        vertical-align: middle
    }

    .tg .tg-c3ow {
        border-color: inherit;
        text-align: center;
        vertical-align: top
    }

    .tg .tg-0pky {
        border-color: white;
        text-align: left;
        vertical-align: top
    }
</style>

<body style="background-color: #CCCCCC">
    <div align="center">
        <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0"
            width="{{ $pageWidth }}">
            <tbody>
                <tr>
                    <td style="padding: 30px">
                        <div align="center">
                            <p align="right">
                            <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" height="133" border="0"
                                width="100%" style="text-align: center;">
                                <tbody>
                                    <tr>
                                        <td style="text-align:left">
                                            <div align="center">
                                                <table cellspacing="0" cellpadding="0" height="74" border="0"
                                                    width="850">
                                                    <tbody>
                                                        <tr>
                                                            <td valign="top"></td>
                                                        </tr>
                                                        <tr>
                                                            <td valign="top">
                                                                <table cellspacing="0" cellpadding="0" border="0"
                                                                    width="100%">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td width="105">
                                                                                <p align="left">
                                                                                    <img src="{{ asset('service/img/logo_grhasia.png') }}"
                                                                                        style="width: 80px"
                                                                                        border="0" />
                                                                                </p>
                                                                            </td>
                                                                            <td align="center">
                                                                                <div style="margin-left: -80px">
                                                                                    <b>
                                                                                        <font style="font-size: 14pt"
                                                                                            color="#000000">PEMERINTAH
                                                                                            DAERAH DAERAH ISTIMEWA
                                                                                            YOGYAKARTA</font>
                                                                                        <br>
                                                                                    </b>
                                                                                    <font style="font-size: 12pt"
                                                                                        color="#000000">DINAS KESEHATAN
                                                                                        RUMAH SAKIT JIWA GRHASIA
                                                                                    </font>
                                                                                    <br>
                                                                                    <font size="3"
                                                                                        color="#000000">
                                                                                        Jalan Kaliurang Km 17 Sleman,
                                                                                        Telepon: (0274) 895143, 895297,
                                                                                        Faksimile: (0274) 895142</br>
                                                                                        Laman: grhasia.jogjaprov.go.id,
                                                                                        Surel:
                                                                                        grhasiamentalhospital@jogjaprov.go.id
                                                                                        </br>
                                                                                        Kode Pos 55582
                                                                                        <font>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td width="105">&nbsp;</td>
                                                                            <td>&nbsp;</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                                <hr style="border: 1px solid black; width: 100%;">
                                                            </td>
                                                        </tr>
                                                        {{-- ini --}}
                                                        <tr>
                                                            <table class="tg"
                                                                style="table-layout: fixed; background-color: #FFFFFF; position: relative;">
                                                                <colgroup>
                                                                    <col style="width: 92.333333px; height: 20px;">
                                                                    <col style="width: 222.333333px; height: 20px;">
                                                                    <col style="width: 285.333333px; height: 20px;">
                                                                    <col style="width: 399.333333px; height: 20px;">
                                                                </colgroup>
                                                                <thead>
                                                                    <tr>
                                                                        <th class="tg-0pky" colspan="4">
                                                                            <div style="text-align: center">
                                                                                <p
                                                                                    style="margin-top: -11px;text-decoration: underline; font-weight: bold;">
                                                                                    SURAT TUGAS AMBULANS
                                                                                </p><br>
                                                                                <p
                                                                                    style="margin-top: -20px;font-weight: normal;">
                                                                                    NOMOR : ................
                                                                                </p>
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="tg-0pky" colspan="4">
                                                                            <div style="text-align: center">
                                                                                <p
                                                                                    style="margin-top: 10px;margin-bottom: 10px;font-weight: bold;">
                                                                                    MEMERINTAHKAN
                                                                                </p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </thead>
                                                            </table>
                                                        </tr>
                                                        <tr>
                                                            <table class="tg"
                                                                style="table-layout: fixed; background-color: #FFFFFF; position: relative; border-collapse: collapse;">
                                                                <colgroup>
                                                                    <col style="width: 92.33px;">
                                                                    <col style="width: 222.33px;">
                                                                    <col style="width: 285.33px;">
                                                                    <col style="width: 399.33px;">
                                                                </colgroup>
                                                                <thead>
                                                                    <tr style="border: 1px solid black;">
                                                                        <th class="tg-9wq8"
                                                                            style="border: 1px solid black; padding: 8px;">
                                                                            No</th>
                                                                        <th class="tg-9wq8"
                                                                            style="border: 1px solid black; padding: 8px;">
                                                                            Nama</th>
                                                                        <th class="tg-9wq8"
                                                                            style="border: 1px solid black; padding: 8px;">
                                                                            NIP</th>
                                                                        <th class="tg-9wq8"
                                                                            style="border: 1px solid black; padding: 8px;">
                                                                            Jabatan</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    @foreach ($data as $index => $item)
                                                                        @if ($item->id === 48)
                                                                            <tr>
                                                                                <td class="tg-c3ow"
                                                                                    style="border: 1px solid black; padding: 8px;">
                                                                                    {{ $index + 1 }}</td>
                                                                                <!-- Menampilkan nomor urut -->
                                                                                <td class="tg-c3ow"
                                                                                    style="border: 1px solid black; padding: 8px;">
                                                                                    {{ $item->namalengkap }}</td>
                                                                                <td class="tg-c3ow"
                                                                                    style="border: 1px solid black; padding: 8px;">
                                                                                    {{ $item->nip }}</td>
                                                                                <td class="tg-c3ow"
                                                                                    style="border: 1px solid black; padding: 8px;">
                                                                                    {{ $item->jabatan }}</td>
                                                                            </tr>
                                                                        @endif
                                                                    @endforeach
                                                                    <tr>
                                                                        <td class="tg-0pky" colspan="4">
                                                                            <div class="container"
                                                                                style="margin-top: 20px;">
                                                                                <div class="row">
                                                                                    <div class="col-4">
                                                                                        <p>Untuk :</p>
                                                                                    </div>
                                                                                    <div class="col-8">
                                                                                        <p>1. Menjemput pasien / Merujuk
                                                                                            pasien / Memulangkan pasien
                                                                                            /
                                                                                            Mengantar jenazah</p>
                                                                                        <p>2. Berangkat tanggal:
                                                                                            {{ \Carbon\Carbon::parse($data[0]->tglpelayanan)->format('d-m-Y') }},
                                                                                            jam:
                                                                                            {{ \Carbon\Carbon::parse($data[0]->tglpelayanan)->format('H:i') }}
                                                                                        </p>
                                                                                        <p>3. Selesai melaksanakan tugas
                                                                                            segera melaporkan ke Kepala
                                                                                            Seksie / Subbagian terkait
                                                                                            pelayanan ambulans</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="tg-0pky" colspan="4">
                                                                            <div class="container"
                                                                                style="margin-bottom: 20px;">
                                                                                <div class="row">
                                                                                    <div class="col">
                                                                                        <p>Demikian surat tugas ini
                                                                                            dibuat untuk dapat
                                                                                            dilaksanakan
                                                                                            dengan baik sesuai dengan
                                                                                            peraturan dan ketentuan yang
                                                                                            berlaku.</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="container">
                                                                                <div class="row">
                                                                                    <div class="col"></div>
                                                                                    <div class="col"></div>
                                                                                    <div class="col"
                                                                                        style="text-align: center;">
                                                                                        <p>Sleman, Oktober 2024</p>
                                                                                        <p
                                                                                            style="margin-top: -10px; margin-bottom: 50px;">
                                                                                            DIREKTUR</p>
                                                                                        <p
                                                                                            style="text-decoration: underline;">
                                                                                            dr. Akhmad Akhadi S, MPH
                                                                                        </p>
                                                                                        <p style="margin-top: -10px;">
                                                                                            NIP. 19680714 200012 1 002
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table class="tg"
                                                                style="table-layout: fixed; background-color: #FFFFFF; position: relative;">
                                                                <colgroup>
                                                                    <col style="width: 222px">
                                                                    <col style="width: 222px">
                                                                    <col style="width: 222px">
                                                                    <col style="width: 222px">
                                                                </colgroup>
                                                                <tr>
                                                                    <td class="tg-9wq8">Dokter</td>
                                                                    <td class="tg-9wq8">Perawat</td>
                                                                    <td class="tg-9wq8">Sopir Ambulans</td>
                                                                    <td class="tg-9wq8">Yang Menerima</td>
                                                                </tr>
                                                                <tr class="tr-z"
                                                                    style="background-color: antiquewhite;">
                                                                    <td class="tg-c3ow">
                                                                        @foreach ($data as $item)
                                                                            @if ($item->id === 1)
                                                                                <p
                                                                                    style="font-size: 12px; margin-top: 30px;margin-bottom: -20px">
                                                                                    {{ $item->namalengkap }}</p>
                                                                            @else
                                                                                &nbsp;
                                                                            @endif
                                                                        @endforeach
                                                                    </td>
                                                                    <td class="tg-c3ow">
                                                                        @foreach ($data as $item)
                                                                            @if ($item->id === 2)
                                                                                <p
                                                                                    style="font-size: 12px;margin-top: 30px;margin-bottom: -20px">
                                                                                    {{ $item->namalengkap }}</p>
                                                                            @else
                                                                                &nbsp;
                                                                            @endif
                                                                        @endforeach
                                                                    </td>
                                                                    <td class="tg-c3ow">
                                                                        @foreach ($data as $item)
                                                                            @if ($item->id === 48)
                                                                                <p
                                                                                    style="font-size: 12px;margin-top: 46px;margin-bottom: -20px">
                                                                                    {{ $item->namalengkap }}</p>
                                                                            @else
                                                                                &nbsp;
                                                                            @endif
                                                                        @endforeach
                                                                    </td>
                                                                    <td class="tg-c3ow">

                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <div class="container"
                                                                style="margin-top: 20px; font-size: 10px">
                                                                <div class="row">
                                                                    <div class="col" style="text-align: left">
                                                                        <p>Catatan : SPT dibuat rangkap 2 (dua)
                                                                            dan
                                                                            wajib melampirkan </p>
                                                                        <p style="margin-top: -10px">1. Nota
                                                                            pembelian
                                                                            BBM yang sah</p>
                                                                        <p style="margin-top: -10px">2. FC
                                                                            identitas
                                                                            pasien (KTP/SIM/Kartu
                                                                            BPJS/Lain-lain)</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td bordercolor="#808080" height="13"></td>
                                    </tr>
                                </tbody>
                            </table>
                            </p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>
