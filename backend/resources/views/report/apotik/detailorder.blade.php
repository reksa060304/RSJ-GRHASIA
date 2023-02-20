<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="style.css">
        <title>E-Resep</title>
        <style>
            .fs-11{
                font-size: 13px;
                font-family: 'Tahoma';
            }

            .fs-13{
                font-size: 17px;
                font-family: 'Tahoma';
            }

            .fs-9{
                font-size: 13px;
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
                padding: 10px;
            }

            td.quantity,
            th.quantity {
                width: 95px;
                max-width: 95px;
                word-break: break-all;
                padding: 10px;
            }

            td.price,
            th.price {
                width: 100px;
                max-width: 100px;
                padding: 10px;
            }

            .centered {
                text-align: center;
                align-content: center;
            }

            .ticket {
                width: 580px;
                max-width: 580px;
                margin-left: 500px;
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
            <p class="centered fs-13" style="margin-top: 30px;"><b>E-RESEP</b>
                <b><br>Rumah Sakit Jiwa Grhasia</b>
                <br>Jl. Kaliurang KM.17, Pakembinangun, Kec. Pakem, Kab. Sleman, DIY
            </p>

            <p class="centered fs-13" style="margin-top: 0px;">No. Order: {{$noorder}}</p>
            <table>
                <thead>
                    <tr>
                        <th class="quantity fs-13">R/</th>
                        <th class="fs-13" style="width: 300px; max-width: 300px;">Nama Obat</th>
                        <th class="description fs-13">Dosis</th>
                        <th class="price fs-13">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $rke = 0
                    @endphp
                    <?php for ($i = 0; $i < count($orderPelayanan); $i++){ ?>
                        <tr>
                            @if($orderPelayanan[$i]['rke'] != $rke)
                                <td class="price fs-13" style="text-align: center; margin-top: 10px;"><?= $orderPelayanan[$i]['rke']; ?></td>
                                <td class="fs-13" style="text-align: left; margin-top: 10px; width: 300px; max-width: 300px;"><?= $orderPelayanan[$i]['namaproduk']; ?></td>
                                <td class="price fs-13" style="text-align: center; margin-top: 10px;"><?= $orderPelayanan[$i]['dosis']; ?> <?= $orderPelayanan[$i]['satuandosis']; ?></td>
                                @if($orderPelayanan[$i]['jumlahracikan'] != null)
                                <td class="price fs-13" style="text-align: center; margin-top: 10px;"><?= $orderPelayanan[$i]['jumlahracikan']; ?> <?= $orderPelayanan[$i]['satuanstandar']; ?></td>
                                @else
                                <td class="price fs-13" style="text-align: center; margin-top: 10px;"><?= $orderPelayanan[$i]['jumlahobat']; ?> <?= $orderPelayanan[$i]['satuanstandar']; ?></td>
                                @endif
                            @else
                                <td class="price fs-13" style="text-align: center"></td>
                                <td class="fs-13" style="text-align: left; width: 300px; max-width: 300px;"><?= $orderPelayanan[$i]['namaproduk']; ?></td>
                                <td class="price fs-13" style="text-align: center"><?= $orderPelayanan[$i]['dosis']; ?> <?= $orderPelayanan[$i]['satuandosis']; ?></td>
                                @if($orderPelayanan[$i]['jumlahracikan'] != null)
                                <td class="price fs-13" style="text-align: center"><?= $orderPelayanan[$i]['jumlahracikan']; ?> <?= $orderPelayanan[$i]['satuanstandar']; ?></td>
                                @else
                                <td class="price fs-13" style="text-align: center"><?= $orderPelayanan[$i]['jumlahobat']; ?> <?= $orderPelayanan[$i]['satuanstandar']; ?></td>
                                @endif
                            @endif
                            
                            
                        </tr>
                        @if($orderPelayanan[$i]['jeniskemasan'] == 'Non Racikan')
                        <tr style="">
                            <td colspan="1"></td>
                            <td colspan="4" class="price fs-13" style="text-align: center; border-top: 1px solid black;"> <?= $orderPelayanan[$i]['catatandokter'] != '-' && $orderPelayanan[$i]['catatandokter'] != '' && $orderPelayanan[$i]['catatandokter'] != ' ' ? ' / '. $orderPelayanan[$i]['catatandokter'] : null ?></td>
                        </tr>
                        @elseif($orderPelayanan[$i]['rke'] == $rke && $orderPelayanan[$i]['jeniskemasan'] == 'Racikan' && $i == count($orderPelayanan)-1)
                        <tr style="">
                            <td colspan="1"></td>
                            <td colspan="4" class="price fs-13" style="text-align: center; border-top: 1px solid black;"> <?= $orderPelayanan[$i]['catatandokter'] != '-' && $orderPelayanan[$i]['catatandokter'] != '' && $orderPelayanan[$i]['catatandokter'] != ' ' ? ' / '. $orderPelayanan[$i]['catatandokter'] : null ?></td>
                        </tr>
                        @elseif($orderPelayanan[$i]['rke'] == $rke && $orderPelayanan[$i]['jeniskemasan'] == 'Racikan' && $orderPelayanan[$i]['rke'] != $orderPelayanan[$i+1]['rke'])
                        <tr style="">
                            <td colspan="1"></td>
                            <td colspan="4" class="price fs-13" style="text-align: center; border-top: 1px solid black;"> <?= $orderPelayanan[$i]['catatandokter'] != '-' && $orderPelayanan[$i]['catatandokter'] != '' && $orderPelayanan[$i]['catatandokter'] != ' ' ? ' / '. $orderPelayanan[$i]['catatandokter'] : null ?></td>
                        </tr>
                        @endif
                        @php
                            $rke = $orderPelayanan[$i]['rke']
                        @endphp
                    <?php } ?>
                    <tr style="height: 10px;"><td></td></tr>
                </tbody>
            </table>
        </div>
    </body>
</html>