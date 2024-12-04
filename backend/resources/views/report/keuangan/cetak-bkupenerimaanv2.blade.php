<!DOCTYPE html>
<html lang="en" ng-app="angularApp">

<head>
    <meta charset="utf-8">
    <title>BKU PENERIMAAN</title>
    
    <style>
        @font-face {
            font-family: 'BookmanOldStyle';
            src: url('{{ asset('fonts/BookmanOldStyle.TTF') }}')
        }

        @page {
            size: 21.5cm 33cm;
            margin: 1.5cm 2cm 4cm 1.9cm; 
        }

        @page :first {
            size: 21.5cm 33cm;
            margin: 1cm 2cm 4cm 1.9cm
        }
        /* body{
            width: 21.5cm;
            height: 33cm;
        } */
        p {
            line-height: 1.5;
            margin: 0;
        }
        .newpage { margin-top: 1.5cm; page-break-before: always; }
        body {
            font-family: 'BookmanOldStyle';
            margin: 0;
        }
        #table-sts {
            border-collapse: collapse;
            font-size: 10pt;
        }
        #table-sts thead tr th {
            border: 1px solid black;
            padding: .3em .6em;
        }
        #table-sts tbody tr td {
            border: 1px solid black;
            padding: .3em .6em;
        }
    </style>
</head>

<body>
    {{-- Header --}}
    <table cellspacing="0" cellpadding="0" border="0" width="100%" >
        <tbody>
            <tr>
                <td width="10%" style="text-align:left;">
                    <img src="data:image/jpeg;base64,{{$profile[0]->logopemerintahan}}" alt=""
                        style="height:90px; width:87px;">
                </td>
                <td style="text-align: center; font-family: Arial">
                    <h1 style="font-size:12pt; padding:0; margin:0; font-weight:bold; ">PEMERINTAH DAERAH ISTIMEWA YOGYAKARTA</h1>
                    <h1 style="font-size:12pt; padding:0; margin:0; font-weight:bold; ">{{ $profile[0]->baris2 }}</h1>
                    <h1 style="font-size:12pt; padding:0; margin:0; font-weight:bold; text-transform:uppercase;">{{ $profile[0]->namalengkap }}</h1>
                    @if(stripos(\Request::url(), 'localhost') !== FALSE)
                    <img src="{{ asset('img/aksara_jawa-com.png') }}" style="height: 35px;" alt="Aksara">
                    @else
                    <img src="{{ asset('service/img/aksara_jawa-com.png') }}" style="height: 35px;" alt="Aksara">
                    @endif
                    <p style="font-size: 11pt; margin: 0;">Jl. Kaliurang km. 17 Telp. (0274)0895142,895143,895297 Yogyakarta {{ $profile[0]->kodepos }} </p>
                </td>
            </tr>
        </tbody>
    </table>

    <hr style="border:1px solid #000;margin-bottom:0px">
    
    <p style="text-align: center;">BUKU KAS UMUM</p>

    <p>Bulan : {{ $bulan }}</p>
    
    <table id="table-sts" cellspacing="0" cellpadding="0" width="100%">
        <thead>
            <tr>
                <th>No.</th>
                <th>Tanggal</th>
                <th>No STS</th>
                <th>Kode Rekening</th>
                <th>Uraian</th>
                <th>Penerimaan (Rp.)</th>
                <th>Pengeluaran (Rp.)</th>
                <th>Saldo (Rp.)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>Saldo Awal</td>
                <td></td>
                <td></td>
                <td>{{ $saldobulanlalu }}</td>
            </tr>
            @php
                $saldo = $saldobulanlalu;
            @endphp
            @foreach ($bulan_sekarang as $key => $item)
                @php
                    $saldo += $item->totalpenerimaan;
                    $saldo -= $item->totalpengeluaran;
                @endphp
                <tr>
                    <td>{{ $key + 1 }}</td>
                    <td>{{ $item->tglbku }}</td>
                    <td>{{ $item->nosts }}</td>
                    <td>{{ $item->norekening }}</td>
                    <td>{{ $item->uraianbku }}</td>
                    <td>{{ $item->totalpenerimaan }}</td>
                    <td>{{ $item->totalpengeluaran }}</td>
                    <td>{{ $saldo }}</td>
                </tr>    
            @endforeach
            @php
                $totalpenerimaan = 0;
                $totalpengeluaran = 0;
                foreach ($bulan_sekarang as $key => $item) {
                    $totalpenerimaan += (float)$item->totalpenerimaan;
                    $totalpengeluaran += (float)$item->totalpengeluaran;
                }
            @endphp
            <tr>
                <td style="text-align: right" colspan="5">Jumlah Dipindahkan</td>
                <td>
                    {{ $totalpenerimaan }}
                </td>
                <td>
                    {{ $totalpengeluaran }}
                </td>
                <td>
                    {{ $saldo }}
                </td>
            </tr>
            <tr>
                <td colspan="4" style="border: 0;"><p style="opacity: 0;">kosong</p></td>
                <td style="border: 0;"><p style="opacity: 0;">kosong</p></td>
                <td><p style="opacity: 0;">kosong</p></td>
                <td><p style="opacity: 0;">kosong</p></td>
                <td><p style="opacity: 0;">kosong</p></td>
            </tr>
            <tr>
                <td colspan="3" style="border: 0;"></td>
                <td colspan="2" style="border: 0;"> Jumlah Bulan ini Tgl {{ $tglindo }}</td>
                <td>{{ $totalpenerimaan }}</td>
                <td>{{ $totalpengeluaran }}</td>
                <td>{{ $totalpenerimaan - $totalpengeluaran }}</td>
            </tr>
            <tr>
                <td colspan="3" style="border: 0;"></td>
                <td colspan="2" style="border: 0;"> Jumlah Bulan Yang Lalu (Saldo Awal)</td>
                <td>{{ $saldobulanlalu }}</td>
                <td> - </td>
                <td>{{ $saldobulanlalu }}</td>
            </tr>
            <tr>
                <td colspan="3" style="border: 0;"></td>
                <td colspan="2" style="border: 0;"> Jumlah s.d bulan ini {{ $tglindo }}</td>
                <td>{{ $totalpenerimaan + $saldobulanlalu }}</td>
                <td>{{ $totalpengeluaran }}</td>
                <td>{{ ($totalpenerimaan - $totalpengeluaran) + $saldobulanlalu }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Tanda tangan --}}
    <table style="margin-top: 3em;" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
            <td></td>
            <td></td>
            <td style="text-align: center;">Yogyakarta, {{ $tglindo }}</td>
        </tr>
        <tr>
            <td style="text-align: center;">Mengetahui</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td style="text-align: center;">Kuasa Pengguna Anggaran</td>
            <td></td>
            <td style="text-align: center;">Bendahara Penerimaan</td>
        </tr>
        <tr>
            <td><p style="opacity: 0; padding:2em;">kosong</p></td>
            <td><p style="opacity: 0; padding:2em;">kosong</p></td>
            <td><p style="opacity: 0; padding:2em;">kosong</p></td>
        </tr>
        <tr>
            <td style="text-align: center;">dr. AKHMAD AKHADI S., MPH</td>
            <td></td>
            <td style="text-align: center;">SURI HERLINA PARATIWI, S.KM, M.PH</td>
        </tr>
        <tr>
            <td style="text-align: center;">NIP 196807142000121002</td>
            <td></td>
            <td style="text-align: center;">NIP 198604222011012013</td>
        </tr>
    </table>

    <script>
        window.print()
    </script>
</body>

</html>
