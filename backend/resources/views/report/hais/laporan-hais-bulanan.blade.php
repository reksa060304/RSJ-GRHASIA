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
                    <th rowspan="2" class="content">Ruangan</th>
                    <th rowspan="2" class="content">Jumlah Pasien</th>
                    <th colspan="{{ count($masterTindakan) }}" class="content">Tindakan Invansif <br><small>(Total hari pemasangan)</small></th>
                    <th colspan="{{ count($masterHAIs) }}" class="content">HAIs</th>
                    <th colspan="{{ count($masterInfeksi) }}" class="content">Infeksi Lain</th>
                    <th rowspan="2" class="content">Keterangan</th>
                </tr>
                <tr>
                    @foreach ($masterTindakan as $maT)
                        <th class="content">{{ $maT->namabundle }}</th>
                    @endforeach
                    @foreach ($masterHAIs as $maH)
                        <th class="content">{{ $maH->namabundle }}</th>
                    @endforeach
                    @foreach ($masterInfeksi as $maI)
                        <th class="content">{{ $maI->namabundle }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @php
                    $currentRuangan = null;
                @endphp

                @foreach ($data as $dt)
                    @if ($dt->namaruangan !== $currentRuangan)
                        <tr>
                            @php
                                $jumlahPasien = 0;
                                $currentPasien = null;
                                foreach($data as $item){

                                    if($dt->namaruangan == $item->namaruangan){
                                        if($currentPasien !== $item->idpasien){
                                            $jumlahPasien++;
                                            $currentPasien = $item->idpasien;
                                        }
                                    }

                                }
                            @endphp
                            <td class="content">{{ $dt->namaruangan }}</td>
                            <td class="content">{{ $jumlahPasien }}</td>
                            
                            {{-- tindakan --}}
                            @php
                                $countTindakanKuy = array();
                            @endphp
                            @foreach ($masterTindakan as $itemTindakan)
                                @php
                                    $countTindakanKuy[$itemTindakan->namabundle] = 0;
                                @endphp

                                @php
                                    foreach($data as $item){
                                        if($dt->namaruangan == $item->namaruangan){
                                            
                                            foreach($item->tindakan as $tindakan){
                                                if($tindakan->id == $itemTindakan->id){
                                                    $countTindakanKuy[$itemTindakan->namabundle]++;
                                                }
                                            }
                                        }
                                    }
                                @endphp
                                <td class="content">{{ $countTindakanKuy[$itemTindakan->namabundle] }}</td>
                            @endforeach

                            {{-- hais --}}
                            @php
                                $countHAIs = array();
                            @endphp
                            @foreach ($masterHAIs as $itemHAIs)
                                @php
                                    $countHAIs[$itemHAIs->namabundle] = 0;
                                @endphp

                                @php
                                    foreach($data as $item){
                                        if($dt->namaruangan == $item->namaruangan){
                                            
                                            foreach($item->hais as $hais){
                                                if($hais->id == $itemHAIs->id){
                                                    $countHAIs[$itemHAIs->namabundle]++;
                                                }
                                            }
                                        }
                                    }
                                @endphp
                                <td class="content">{{ $countHAIs[$itemHAIs->namabundle] }}</td>
                            @endforeach

                            {{-- Infeksi --}}
                            @php
                                $countInfeksi = array();
                            @endphp
                            @foreach ($masterInfeksi as $itemInfeksi)
                                @php
                                    $countInfeksi[$itemInfeksi->namabundle] = 0;
                                @endphp

                                @php
                                    foreach($data as $item){
                                        if($dt->namaruangan == $item->namaruangan){
                                            
                                            foreach($item->infeksi as $infeksi){
                                                if($infeksi->id == $itemInfeksi->id){
                                                    $countInfeksi[$itemInfeksi->namabundle]++;
                                                }
                                            }
                                        }
                                    }
                                @endphp
                                <td class="content">{{ $countInfeksi[$itemInfeksi->namabundle] }}</td>
                            @endforeach

                            <td>
                                
                            </td>
                        </tr>
                    @endif

                    @php
                        $currentRuangan = $dt->namaruangan;
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