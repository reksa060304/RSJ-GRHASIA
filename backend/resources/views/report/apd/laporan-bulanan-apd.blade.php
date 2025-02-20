<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>FORMULIR AUDIT KEPATUHAN PENGGUNAAN APD</title>
    <style>
        @page {
            size: 33cm 21.5cm landscape;
            margin: 1cm;
        }
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.3;
        }
        p {
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .content {
            padding: 6px 8px;
            border: 1px solid black;
            font-size: 11pt;
            vertical-align: middle;
        }
        th.content {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        td.content {
            height: 25px;
        }
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            table {
                page-break-inside: auto;
            }
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            thead {
                display: table-header-group;
            }
            tfoot {
                display: table-footer-group;
            }
        }
    </style>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="//cdn.rawgit.com/rainabba/jquery-table2excel/1.1.0/dist/jquery.table2excel.min.js"></script>
</head>
<body>
    <table cellspacing="0" cellpadding="0" border="0" width="100%">
        {{-- Header --}}
        <table  cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 4rem; text-align:center; font-weight:bold;">
            <tr>
                <td>FORMULIR AUDIT KEPATUHAN PENGGUNAAN APD</td>
            </tr>
            <tr>
                <td>
                    DI RS JIWA GRHASIA DIY TAHUN 
                    @if ($data && count($data) > 0)
                        {{ date_format(date_create($data[0]->tanggal), 'Y') }}
                    @else
                        {{ date('Y') }}
                    @endif
                </td>
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
                    <td>RUANGAN</td>
                    <td style="padding-left: 1em; padding-right: 1em">:</td>
                    <td>
                        @if (request()->has('objectruanganfk') && $data && count($data) > 0 && isset($data[0]->namaruangan))
                            {{ $data[0]->namaruangan }}
                        @else
                            SEMUA RUANGAN
                        @endif
                    </td>
                </tr>
                <tr>
                    <td>BULAN</td>
                    <td style="padding-left: 1em; padding-right: 1em">:</td>
                    <td>
                        @if (request()->has('bulan'))
                            {{ date('F Y', strtotime('01-'.request()->get('bulan'))) }}
                        @else
                            {{ date('F Y') }}
                        @endif
                    </td>
                </tr>
            </tbody>
        </table>
    
        {{-- Content --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid black; border-collapse: collapse;">
            <thead>
                <tr>
                    <th rowspan="2" class="content">OBSERVER</th>
                    <th rowspan="2" class="content">TANGGAL</th>
                    <th rowspan="2" class="content">PROFESI YANG DIAUDIT</th>
                    <th rowspan="2" class="content">JENIS AKTIVITAS</th>
                    <th colspan="{{ count($masterapd) }}" class="content">PILIHAN APD</th>
                    <th colspan="{{ count($masterkesesuaian) }}" class="content">KESESUIAN</th>
                    <!-- <th colspan="{{ count($mastercucitangan) }}" class="content">Cuci tangan sebelum menggunakan APD</th> -->
                </tr>
                <tr>
                    @foreach ($masterapd as $mapd)
                        <th class="content">{{ $mapd->description }}</th>
                    @endforeach
                    @foreach ($masterkesesuaian as $sesuai)
                        <th class="content">{{ $sesuai->description }}</th>
                    @endforeach
                    <!-- @foreach ($mastercucitangan as $cucitangan)
                        <th class="content">{{ $cucitangan->description }}</th>
                    @endforeach -->
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $key=>$item)
                    <tr>
                        <td class="content">{{ $item->observer }}</td>
                        <td class="content">{{ date_format(date_create($item->tanggal), 'd-m-Y') }}</td>
                        <td class="content">{{ $item->profesi }}</td>
                        <td class="content">{{ $item->namaaktifitas }}</td>
                        @foreach ($masterapd as $mapd)
                            @php
                                $checklist = 0; 
                                foreach ($item->pilihanAPD as $pilihanAPD) {
                                    if($pilihanAPD->id == $mapd->id){
                                        $checklist = 1;
                                    }
                                }  
                            @endphp
                            <td class="content">{{ $checklist }}</td>
                        @endforeach
                        @foreach ($masterkesesuaian as $sesuai)
                            @php
                                $checklist = 0;
                                if($item->kesesuaian->id == $sesuai->id){
                                    $checklist = 1;
                                }   
                            @endphp
                            <td class="content">{{ $checklist }}</td>
                        @endforeach
                    </tr>
                @endforeach
                
                <tr>
                    <td colspan="12" class="content"><strong>Jumlah</strong></td>
                
                    @foreach ($masterkesesuaian as $sesuai)
                        @php
                            $total = array_filter($data, function($item) use ($sesuai) {
                                return $item->kesesuaian->id == $sesuai->id;
                            });
                            $count = count($total);
                        @endphp
                        <td class="content"><strong>{{ $count }}</strong></td>
                    @endforeach
                </tr>
                <tr>
                    <td colspan="12" class="content"><strong>Jumlah Total</strong></td>               
                    @php
                        $totalAll = count($data);
                    @endphp
                    <td colspan="{{ count($masterkesesuaian) }}" class="content"><strong>{{ $totalAll }}</strong></td>
                </tr>

                <tr>
                    <td colspan="12" class="content"><strong>Presentase Kepatuhan</strong></td>               
                    @php
                        $totalAll = count($data);
                        $idSesuai = 9;
                        $idTidakSesuai = 10;

                        $totalKesesuaian = array_filter($data, function($item) use ($idSesuai) {
                            return $item->kesesuaian->id == $idSesuai;
                        });                     
                        $countKesesuaian = count($totalKesesuaian);
                        $percentage = $totalAll > 0 ? ($countKesesuaian / $totalAll * 100) : 0;
                    @endphp
                    <td colspan="{{ count($masterkesesuaian) }}" class="content"><strong>{{ number_format($percentage, 2) }}%</strong></td>
                </tr>
            </tbody>
        </table>
    </table>

    <script>
         window.print()
    </script>
</body>
</html>