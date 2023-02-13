<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="style.css">
        <title>E-Resep</title>
        <style>
            body{
                line-height: 2;
            }
            .fs-11{
                font-size: 11px;
                font-family: 'Tahoma';
            }

            .fs-13{
                font-size: 13px;
                font-family: 'Tahoma';
            }

            .fs-13{
                font-size: 11px;
                font-family: 'Tahoma';
            }

            
            th,
            table {
                border-top: 1px solid black;
                border-collapse: collapse;
            }

            td.description,
            th.description {
                width: 165px;
                max-width: 165px;
            }

            td.quantity,
            th.quantity {
                width: 95px;
                max-width: 95px;
                word-break: break-all;
            }

            td.price,
            th.price {
                width: 100px;
                max-width: 100px;
            }

            .centered {
                text-align: center;
                align-content: center;
            }

            .ticket {
                width: 790px;
                max-width: 1000px;
            }

            @media print {
                .hidden-print,
                .hidden-print * {
                    display: none !important;
                }
            }

            @page {
                margin: 0;
            }
        </style>
    </head>
    <body>
        <div class="ticket">
            <p class="centered fs-11"><b>RESEP</b>
                <b><br>Rumah Sakit Jiwa Grhasia</b>
                <br>Jl. Kaliurang KM.17, Pakembinangun, Kec. Pakem, Kab. Sleman, DIY
            </p>

            <table  style="border-top: none; margin-top: -10px;">
                <tbody>
                    <tr>
                        <td class="price fs-13"><strong></strong></td>
                        <td class="description fs-13" style="text-align: left"></td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-13"><strong></strong></td>
                        <td class="description fs-13" style="text-align: right"><b>CM.FM.02</b></td>
                    </tr>
                    <tr>
                        <td class="price fs-13"><strong></strong></td>
                        <td class="description fs-13" style="text-align: left"></td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-13"><strong></strong></td>
                        <td class=" fs-13" style="text-align: right" width="200"><b><u>RESEP {{ $raw->kelompokpasien }}</u></b></td>
                    </tr>
                </tbody>
            </table>

            <p class="centered fs-13" style="margin-top: 0px;">No. Resep: {{$skrining->noresep}}</p>
            <table>
                <thead>
                    <tr>
                        <th class="quantity fs-13">R/</th>
                        <th class="description fs-13">Nama Obat</th>
                        <th class="price fs-13">Jumlah</th>
                        <th class="price fs-13">Aturan Pakai</th>
                        <th class="price fs-13">Keterangan</th>
                        <th class="price fs-13">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($details as $d){ ?>
                        <tr>
                            <td class="price fs-13" style="text-align: center"><?= $d->rke; ?></td>
                            <td class="price fs-13" style="text-align: left"><?= $d->namaproduk; ?></td>
                            <td class="price fs-13" style="text-align: center"><?= $d->jumlah; ?></td>
                            <td class="description fs-13" style="text-align: center"><?= $d->aturanpakai; ?></td>
                            <td class="description fs-13" style="text-align: center"><?= $d->keteranganpakai; ?></td>
                            <td class="description fs-13" style="text-align: center">Rp. <?= number_format($d->harga,0,',','.') ?></td>
                        </tr>
                    <?php } ?>
                    <tr style="height: 10px;"><td></td></tr>
                </tbody>
            </table>
            <table style="width: 790px">
                <tbody>
                    <tr>
                        <td class="price fs-13"><strong>Status Pembiayaan</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->kelompokpasien }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-13"><strong>Sumber Resep</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->ruangantujuan }}</td>
                    </tr>
                    <tr>
                        <td class="price fs-13"><strong>No. Rekam Medik</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->nocm }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-13"><strong>Tanggal Resep</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->tglorder }}</td>
                    </tr>
                    <tr>
                        <td class="price fs-13"><strong>Nama Pasien</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->namapasien }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-13"><strong>Nama Dokter</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->namalengkap }}</td>
                    </tr>
                    <tr>
                        <td class="price fs-13"><strong>Tgl Lahir</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->tgllahir }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-13"><strong>Jenis Kelamin</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->jeniskelamin }}</td>
                    </tr>
                    <tr>
                        <td class="price fs-13"><strong>Alergi</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->alergi }}</td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-13"><strong>Ruangan Asal</strong></td>
                        <td class="description fs-13" style="text-align: left">: {{ $raw->ruanganasal }}</td>
                    </tr>
                    <tr style="height: 10px;"><td></td></tr>
                    <tr>
                        <td class="price fs-13"><strong></strong></td>
                        <td class="description fs-13" style="text-align: left"></td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-13"><strong></strong></td>
                        <td class="price fs-13" style="text-align: center">Tanda Tangan Penerima</td>
                    </tr>
                    <tr style="height: 30px;"><td></td></tr>
                    <tr>
                        <td class="price fs-13"><strong></strong></td>
                        <td class="description fs-13" style="text-align: left"></td>
                        <td style="width: 10px;"><strong></strong></td>
                        <td class="price fs-13"><strong></strong></td>
                        <td class="price fs-13" style="text-align: center">(...............)</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </body>
</html>
<script>
    window.print();
</script>