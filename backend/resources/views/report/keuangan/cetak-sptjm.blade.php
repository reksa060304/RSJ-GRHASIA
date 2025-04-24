<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>SPTJM</title>
    
    <style>
        /* @font-face {
            font-family: 'BookmanOldStyle';
            src: url('{{ asset('fonts/BookmanOldStyle.TTF') }}')
        } */

        @page {
            size: 21.5 33cm;
            margin: 2cm;
        }
        @media print {
            .page, .page-break { break-after: page; }
        }
        body {
            font-family: 'Arial';
            font-size: 10pt;
            line-height: 2;
            margin: 0;
        }
        .table-target {
            border-collapse: collapse;
            margin-top: 1em;
            width: 100%;
        }
        .table-target thead tr th {
            border: 1px solid black;
            padding: .3em .6em;
        }
        .table-target tbody tr td {
            border: 1px solid black;
            padding: .3em .6em;
        }
        .inner-table tbody tr td {
            border: none;
            padding: 3px 0px;
        }
    </style>
</head>

<body>
    <div class="page">
        {{-- header --}}
        <table style="font-weight:bold; line-height: 1.5;" cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td style="text-align: center;">
                    PEMERINTAH PROVINSI DI YOGYAKARTA
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    RUMAH SAKIT JIWA GRHASIA
                </td>
            </tr>
        </table>
        
        <hr style="margin: 20px 0px; border: 1px solid black;">

        <table style="font-weight:bold; line-height: 1.5;" cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td style="text-align: center;">
                    SURAT PERNYATAAN TANGGUNG JAWAB MUTLAK SPM-LS
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    NOMOR {{ isset($data) ? $data[0]->nomorsptjm : '' }}
                </td>
            </tr>
        </table>

        <p style="text-indent: 0.5in;">Sehubungan dengan Surat Perintah Membayar Langsung <b>(SPM-LS)</b> nomor
            <br> <b>{{ isset($data) ? $data[0]->nomorspm : '' }}</b> 
                tanggal {{ isset($tglsppspmindo) ? $tglsppspmindo : '' }} 
                yang saya ajukan <br> sebesar <b>Rp. {{ isset($data) ? number_format($data[0]->totalspj,2,',','.') : '' }}</b>
                (terbilang {{ isset($terbilangSPJ) ? $terbilangSPJ : '' }}) untuk keperluan
                <b>Rumah Sakit Grhasia</b> Tahun Anggaran {{ isset($setting) ? $setting[0]->tahunanggaran : '' }}, dengan ini menyatakan dengan sebenarnya
                bahwa:
        
        </p>

        <table>
            <tbody>
                <tr>
                    <td style="vertical-align: top;">1.</td>
                    <td style="vertical-align: top;">Jumlah Langsung (LS) tersebut di atas akan dipergunakan untuk keperluan belanja kegiatan yang akan kami laksanakan sesuai DPA-SKPD.</td>
                </tr>
                <tr>
                    <td style="vertical-align: top">2.</td>
                    <td style="vertical-align: top;">Bukti-bukti belanja tersebut disimpan di Rumah Sakit Jiwa Grhasia sesuai dengan ketentuan yang berlaku untuk keperluan pemeriksaan 
                        Internal/Eksternal sebagai <b>Bukti Pertanggungjawaban Keuangan.</b></td>
                </tr>
            </tbody>
        </table>

        <p style="text-indent: 0.5in;">
            Dengan ini, saya menyatakan <b>bertanggung jawab penuh</b> atas segala pengeluaran yang dibayar lunas
            sesuai dengan ketentuan peraturan perundangan yang berlaku.
        </p>
        <p style="text-indent: 0.5in;">Demikian surat pernyataan ini dibuat untuk melengkapi persyaratan pengajuan <b>SPM-LS SKPD</b> kami.</p>


        <table style="width: 100%;">
            <tbody style="text-align: center;">
                <tr>
                    <td style="width: 50%;"></td>
                    <td>Yogyakarta, {{ isset($tglsppspmindo) ? $tglsppspmindo : '' }}</td>
                </tr>
                <tr>
                    <td style="width: 50%;"></td>
                    <td>KUASA PENGGUNA ANGGARAN</td>
                </tr>
                <tr style="font-weight:bold; text-decoration:underline;">
                    <td style="width: 50%; padding-top: 100px;"></td>
                    <td style="padding-top: 100px;">{{ isset($setting) ? $setting[0]->namalengkap : '' }}</td>
                </tr>
                <tr style="font-weight:bold;">
                    <td style="width: 50%;"></td>
                    <td>{{ isset($setting) ? $setting[0]->nipkuasa : '' }}</td>
                </tr>
            </tbody>
        </table>
        {{-- <table style="font-weight:bold; line-height: 1.5;" cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td style="text-align: center;">
                    Sehubungan dengan Surat Perintah Membayar Langsung (SPM-LS) nomor
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    {{ isset($data[0]) ? $data[0]->nomorspm : '' }} tanggal 
                </td>
            </tr>
        </table> --}}
    <script>
        window.print()
    </script>
</body>

</html>
