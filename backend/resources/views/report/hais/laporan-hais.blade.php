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
                <td>DI RS JIWA GRHASIA DIY TAHUN {{ date_format(date_create($tanggalcetak), 'Y') }}</td>
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
                    <td>{{ $ruangan[0]->namaruangan }}</td>
                </tr>
                <tr>
                    <td>BULAN</td>
                    <td style="padding-left: 1em; padding-right: 1em">:</td>
                    <td>{{ date_format(date_create($tanggalcetak), 'F') }}</td>
                </tr>
            </tbody>
        </table>
    
        {{-- Content --}}
        <table id="table-content" style="width:100%; border: 1px solid black; border-collapse: collapse;">
            <thead>
                <tr>
                    <th rowspan="2" class="content">Tanggal</th>
                    <th rowspan="2" class="content">No</th>
                    <th rowspan="2" class="content">Nama Pasien</th>
                    <th rowspan="2" class="content">Tirah Baring</th>
                    <th colspan="{{ count($masterTindakan) }}" class="content">Tindakan</th>
                    <th rowspan="2" class="content">Keterangan</th>
                    <th rowspan="2" class="content">Obat Antibiotik</th>
                    <th rowspan="2" class="content">Dekubitus</th>
                    <th colspan="{{ count($masterInfeksi) }}" class="content">Infeksi Rumah Sakit</th>
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
                @foreach ($data as $key => $dt)
                    <tr>
                        <td class="content">{{ date_format(date_create($dt->tglpemeriksaan), 'd/m/Y') }}</td>
                        <td class="content">{{ $key + 1 }}</td>
                        <td class="content">{{ $dt->namapasien }}</td>
                        <td class="content">{{ (isset($dt->tirahbaring)) ? '1' : '-'}}</td>
                        @foreach ($masterTindakan as $mT)
                            @php
                                $checkTindakan = '-';
                                foreach($dt->tindakan as $tindakan){
                                    if($tindakan->id == $mT->id){
                                        $checkTindakan = '1';
                                    }
                                }
                            @endphp
                            <td class="content">{{ $checkTindakan }}</td>
                        @endforeach
                        <td class="content">{{ isset($dt->keterangan) ? $dt->keterangan : '' }}</td>
                        <td class="content">{{ isset($dt->obatantibiotik) ? $dt->obatantibiotik : '' }}</td>
                        <td class="content">
                            @php
                                $checkDekubitus = '-';
                                if(count($dt->dekubitus) > 0){
                                    $checkDekubitus = '1';
                                }
                            @endphp
                            {{ $checkDekubitus }}
                        </td>
                        @foreach ($masterInfeksi as $mI)
                            @php
                                $checkInfeksi = '-';
                                foreach($dt->infeksi as $infeksi){
                                    if($infeksi->id == $mI->id){
                                        $checkInfeksi = '1';
                                    }
                                }
                            @endphp
                            <td class="content">{{ $checkInfeksi }}</td>
                        @endforeach
                    </tr>
                @endforeach
                <tr>
                    <td class="content"></td>
                    <td class="content"></td>
                    <td class="content"></td>
                    @php
                        $countTirahBaring = 0;
                        foreach($data as $dat){
                            if(isset($dat->tirahbaring)){
                                $countTirahBaring ++;
                            }
                        }
                    @endphp
                    <td class="content">{{ $countTirahBaring }}</td>
                    @php
                        $countTindakanKuy = array();
                    @endphp
                    @foreach ($masterTindakan as $itemTindakan)
                        @php
                            $countTindakanKuy[$itemTindakan->namabundle] = 0;
                        @endphp

                        @php
                            foreach($data as $item){
                                    
                                foreach($item->tindakan as $tindakan){
                                    if($tindakan->id == $itemTindakan->id){
                                        $countTindakanKuy[$itemTindakan->namabundle]++;
                                    }
                                }
                            }
                        @endphp
                        <td class="content">{{ $countTindakanKuy[$itemTindakan->namabundle] }}</td>
                    @endforeach
                    <td class="content"></td>
                    <td class="content"></td>
                    <td class="content"></td>
                    @foreach ($masterInfeksi as $maI)
                        <td class="content"></td>
                    @endforeach
                </tr>
            </tbody>
        </table>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>