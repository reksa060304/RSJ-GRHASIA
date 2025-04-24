<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>SPM</title>
    
    <style>
        /* @font-face {
            font-family: 'BookmanOldStyle';
            src: url('{{ asset('fonts/BookmanOldStyle.TTF') }}')
        } */

        @page {
            size: 21.5 33cm;
        }
        @media print {
            .page, .page-break { break-after: page; }
        }
        body {
            font-family: 'Arial';
            font-size: 10pt;
            line-height: 1;
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
                    SURAT PERMINTAAN MEMBAYAR
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    LANGSUNG (LS)
                </td>
            </tr>
        </table>
    
        <table class="table-target" cellspacing="0" cellpadding="0" width="100%">
            <thead>
                <tr style="font-weight:bold;">
                    <th>Tahun Anggaran: {{ isset($setting) ? $setting[0]->tahunanggaran : '' }}</th>
                    <th>
                        Nomor SPM:
                        <br>
                        {{ isset($data) ? $data[0]->nomorspm : '' }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="width: 50%;">
                        <table class="inner-table" style="width: 100%;">
                            <tbody>
                                <tr style="font-weight:bold;">
                                    <td colspan="3">KUASA BENDAHARA UMUM DAERAH</td>
                                </tr>
                                <tr style="font-weight:bold;">
                                    <td colspan="3">PEMERINTAH PROVINSI DI YOGYAKARTA</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="padding-top:40px;">Supaya menerbitkan SP2D kepada:</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">Nama SKPD</td>
                                    <td colspan="2" style="font-weight:bold;">: Dinas Kesehatan</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">Nama Unit SKPD</td>
                                    <td colspan="2" style="font-weight:bold;">: Rumah Sakit Jiwa Grhasia</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">Nama</td>
                                    <td colspan="2" style="font-weight:bold;">: {{ isset($data) ? $data[0]->namarekanan : '' }}</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">No. Rekening Bank</td>
                                    <td colspan="2" style="font-weight:bold;">: {{ isset($data) ? $data[0]->norekrekenan : '' }}</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">Nama di Rekening Bank</td>
                                    <td colspan="2" style="font-weight:bold;">: {{ isset($data) ? $data[0]->namarekrekanan : '' }}</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">Nama Bank Cabang</td>
                                    <td colspan="2" style="font-weight:bold;">: {{ isset($data) ? $data[0]->bankrekeningnama : '' }}</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">NPWP</td>
                                    <td colspan="2" style="font-weight:bold;">: {{ isset($data) ? $data[0]->npwprekanan : '' }}</td>
                                </tr>
                                <tr>
                                    <td style="width: 40%;">Dasar Pembayaran</td>
                                    <td colspan="2" style="font-weight:bold;">:</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="font-weight:bold;">{{ isset($setting) ? $setting[0]->nomordasarpengeluaran : '' }}</td>
                                </tr>
                            </tbody>
                        </table>

                        <hr style="margin: 20px 0px;">

                        <p>Untuk keperluan</p>
                        <p style="font-weight:bold;">Pembayaran {{ isset($data) ? $data[0]->namamataanggaran.' ('.$data[0]->kodemataanggaran.') Pada Sub '.$data[0]->keterangansub.' Sub sub '.$data[0]->keterangansubsub.' Tanggal '.$tglindo : '' }}</p>
                        <p>Pembebeanan Pada:</p>
                        <table class="table-target">
                            <thead>
                                <tr>
                                    <th>Kode Rekening</th>
                                    <th>Uraian</th>
                                    <th>Nilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="3" style="font-weight:bold;">
                                        <p>Nomor {{ isset($setting) ? $setting[0]->dasarpengeluaran : '' }} : </p>
                                        <p>{{ isset($setting) ? $setting[0]->nomordasarpengeluaran : '' }}</p>
                                    </td>
                                </tr>
                                <tr style="font-weight:bold;">
                                    <td colspan="3">{{ isset($data) ? $data[0]->kodesub : '' }} - {{ isset($data) ? $data[0]->keterangansub : ''}}</td>
                                </tr>
                                <tr style="font-weight:bold;">
                                    <td colspan="3">{{ isset($data) ? $data[0]->kodesubsub : '' }} - {{ isset($data) ? $data[0]->keterangansubsub : ''}}</td>
                                </tr>
                                <tr>
                                    <td>{{ isset($data) ? $data[0]->kodemataanggaran : '' }}</td>
                                    <td>{{ isset($data) ? $data[0]->namamataanggaran : '' }}</td>
                                    <td>Rp. {{ isset($data) ? number_format($data[0]->totalspj,2,',','.') : '' }}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="text-align:right;">Jumlah : </td>
                                    <td>Rp. {{ isset($data) ? number_format($data[0]->totalspj,2,',','.') : '' }}</td>
                                </tr>   
                            </tbody>
                        </table>
                    </td>
                    <td style="width: 50%; vertical-align: top;">
                        <p>Potongan-Potongan</p>
                        <table class="table-target">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Uraian</th>
                                    <th>ID Biling</th>
                                    <th>Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($pajak as $key => $item)
                                    <tr>
                                        <td>{{ $key + 1 }}</td>
                                        <td>{{ $item->reportspm }}</td>
                                        <td>{{ $item->idbill }}</td>
                                        <td>{{ $item->jumlah }}</td>
                                    </tr>
                                @endforeach
                                <tr>
                                    <td style="text-align:right;" colspan="3">Jumlah</td>
                                    <td>
                                        @php
                                            $jumlah = 0;
                                            if(count($pajak) > 0){
                                                foreach($pajak as $item){
                                                    $jumlah += (float)$item->jumlah;
                                                }
                                            }
                                        @endphp
                                        {{ $jumlah }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p>SPM Yang Dibayarkan</p>
                        <table class="table-target">
                            <tbody>
                                <tr>
                                    <td>Jumlah Yang Diminta (Bruto)</td>
                                    <td style="font-weight:bold;">Rp. {{ isset($data) ? number_format($data[0]->totalspj,2,',','.') : '' }}</td>
                                </tr>
                                <tr>
                                    <td>Jumlah Potongan</td>
                                    <td style="font-weight:bold;">Rp. {{ number_format($jumlah,2,',','.') }}</td>
                                </tr>
                                <tr>
                                    <td>Jumlah Netto</td>
                                    <td style="font-weight:bold;">Rp. {{ isset($data) ? number_format((float)$data[0]->totalspj - (float)$jumlah,2,',','.')  : '' }}</td>
                                </tr>
                                <tr>
                                    <td>Jumlah Dibayarkan</td>
                                    <td style="font-weight:bold;">Rp. {{ isset($data) ? number_format($data[0]->totalspj,2,',','.') : '' }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p>Uang Sejumlah: ({{ $terbilangSPJ }} rupiah)</p>
                    </td>
                </tr>
                <tr>
                    <td style="vertical-align: top;">
                        <table style="margin-top: 30px;" class="inner-table">
                            <tbody>
                                <tr style="font-weight: bold;">
                                    <td style="text-align: left;">Jumlah SPP Diminta</td>
                                    <td style="text-align: right;">Rp. {{ isset($data) ? number_format($data[0]->totalspj,2,',','.') : '' }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <hr style="margin: 20px 0;" />
                        <p style="font-weight: bold;">Nomor dan Tanggal SPP</p>
                        <p>{{ isset($data) ? $data[0]->nomorspp : '' }}, {{ isset($tglsppspmindo) ? $tglsppspmindo : '' }}</p>
                    </td>
                    <td style="text-align: center;">
                        <p>Yogyakarta, {{ isset($tglsppspmindo) ? $tglsppspmindo : '' }}</p>
                        <p>KUASA PENGGUNA ANGGARAN</p>
                        <P style="margin-top:80px; font-weight:bold; text-decoration:underline;">{{ isset($setting) ? $setting[0]->namalengkap : '' }}</P>
                        <p style="font-weight:bold;">{{ isset($setting) ? $setting[0]->nipkuasa : '' }}</p>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align:center;"><i>SPM ini sah apabila telah ditandatangani dan di stempel oleh Kuasa Pengguna Anggaran</i></td>
                </tr>
            </tbody>
        </table>
    </div>
    <script>
        window.print()
    </script>
</body>

</html>
