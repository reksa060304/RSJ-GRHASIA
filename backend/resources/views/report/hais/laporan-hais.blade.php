<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>LAPORAN HAIS</title>
    <style>
        @font-face {
            font-family: 'BookmanOldStyle';
            src: url('{{ asset('fonts/BookmanOldStyle.TTF') }}')
        }

        @page {
            size: 33cm 21.5cm;
            margin: 1cm;
        }
        p {
            margin: 0;
        }
        body {
            margin: 0;
        }
        .content {
            padding: 3px 5px;
            border: 1px solid black;
            font-size: 8pt;
        }
    </style>

</head>
<body>
    <table cellspacing="0" cellpadding="0" border="0" width="100%">
        {{-- Header --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 4rem; text-align:center; font-weight:bold;">
            <tr>
                <td>FORMULIR SURVEILANS HAIs</td>
            </tr>
            <tr>
                <td>DI RS JIWA GRHASIA DIY TAHUN {{ date_format(date_create($data[0]->tglpemeriksaan), 'Y') }}</td>
            </tr>
        </table>
    
        {{-- Deskripsi --}}
        <table style="width: auto; margin-bottom: 1rem;font-weight:bold;">
            <thead>
                <tr><td></td></tr>
                <tr><td></td></tr>
                <tr><td></td></tr>
            </thead>
            <tbody>
                <tr>
                    <td>WISMA</td>
                    <td style="padding-left: 1em; padding-right: 1em">:</td>
                    <td>{{ $data[0]->namaruangan }}</td>
                </tr>
                <tr>
                    <td>BULAN</td>
                    <td style="padding-left: 1em; padding-right: 1em">:</td>
                    <td>{{ date_format(date_create($data[0]->tglpemeriksaan), 'F Y') }}</td>
                </tr>
            </tbody>
        </table>
    
        {{-- Content --}}
        <table id="table-content" style="border: 1px solid black; border-collapse: collapse;">
            <thead>
                <tr>
                    <th rowspan="2" class="content">Tanggal</th>
                    <th rowspan="2" class="content">No</th>
                    <th rowspan="2" class="content">Nama Pasien</th>
                    <th rowspan="2" class="content">Jenis Kelamin</th>
                    <th rowspan="2" class="content">Suhu</th>
                    <th rowspan="2" class="content">Umur</th>
                    <th rowspan="2" class="content">Diagnosa Medis</th>
                    <th colspan="{{ count($masterTindakan) }}" class="content">Tindakan</th>
                    <th colspan="{{ count($masterInfeksi) }}" class="content">Infeksi Rumah Sakit</th>
                    <th rowspan="2" class="content">Tirah Baring (Ya=1, Tidak=0)</th>
                    <th rowspan="2" class="content">Pemeriksaan</th>
                    <th rowspan="2" class="content">Terapi (terutama bila diberikan antibiotik, tuliskan nama obatnya dan dosisnya, tabinjeksi)</th>
                </tr>
                <tr>
                    @foreach ($masterTindakan as $maT)
                        <th class="content">{{ $maT->namabundle }}</th>
                    @endforeach
                    @foreach ($masterInfeksi as $maI)
                        <th class="content">{{ $maI->namabundle }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @php
                    $nomor = 1;
                @endphp
                @foreach ($data as $key=>$item)
                    <tr>
                        <td class="content">{{ date_format(date_create($item->tglpemeriksaan), 'd-m-Y') }}</td>
                        <td class="content">{{ $nomor }}</td>
                        <td class="content">{{ $item->namapasien }}</td>
                        <td class="content">L</td>
                        <td class="content">{{ $item->suhu }}</td>
                        <td class="content">{{ \Carbon\Carbon::parse($item->tgllahir)->diffInYears(date('Y-m-d')) }} Tahun</td>
                        <td class="content">{{ $item->diagnosa }}</td>
                        @foreach ($masterTindakan as $maT)
                            @php
                                $checklist = 0; 
                                foreach ($item->tindakan as $pilihanTindakan) {
                                    if($pilihanTindakan->id == $maT->id){
                                        $checklist = 1;
                                    }
                                }  
                            @endphp
                            <td class="content">{{ $checklist }}</td>
                        @endforeach
                        @foreach ($masterInfeksi as $maI)
                            @php
                                $checklist = 0;
                                foreach ($item->infeksi as $pilihanInfeksi) {
                                    if($pilihanInfeksi->id == $maI->id){
                                        $checklist = 1;
                                    }
                                } 
                            @endphp
                            <td class="content">{{ $checklist }}</td>
                        @endforeach
                        @php
                            $statusTirah = null;
                            if($item->tirahbaring !== null || $item->tirahbaring !== undefined){
                                $statusTirah = 1;
                            }else{
                                $statusTirah = 0;
                            }
                        @endphp
                        <td class="content">{{ $statusTirah }}</td>
                        <td class="content">
                            @if (isset($item->pemeriksaan))
                                <p>{{ $item->pemeriksaan }}</p>
                            @else
                                <p>-</p>
                            @endif
                        </td>
                        <td class="content">
                            @if (isset($item->terapi))
                                <p>{{ $item->terapi }}</p>
                            @else
                                <p>-</p>
                            @endif
                        </td>
                    </tr>
                    @php
                        $nomor = $nomor+1
                    @endphp
                @endforeach
            </tbody>
        </table>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>