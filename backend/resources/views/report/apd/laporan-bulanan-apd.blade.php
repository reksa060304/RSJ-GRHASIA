<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>FORMULIR AUDIT KEPATUHAN PENGGUNAAN APD</title>
    <style>
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
            font-size: 11pt;
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
                    <td>WISMA</td>
                    <td style="padding-left: 1em; padding-right: 1em">:</td>
                    <td>
                        @if ($data && count($data) > 0)
                            {{ $data[0]->namaruangan }}
                        @else
                            -
                        @endif
                    </td>
                </tr>
                <tr>
                    <td>BULAN</td>
                    <td style="padding-left: 1em; padding-right: 1em">:</td>
                    <td>
                        @if ($data && count($data) > 0)
                            {{ date_format(date_create($data[0]->tanggal), 'F Y') }}
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
                    <th colspan="{{ count($mastercucitangan) }}" class="content">Cuci tangan sebelum menggunakan APD</th>
                </tr>
                <tr>
                    @foreach ($masterapd as $mapd)
                        <th class="content">{{ $mapd->description }}</th>
                    @endforeach
                    @foreach ($masterkesesuaian as $sesuai)
                        <th class="content">{{ $sesuai->description }}</th>
                    @endforeach
                    @foreach ($mastercucitangan as $cucitangan)
                        <th class="content">{{ $cucitangan->description }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $key=>$item)
                    <tr>
                        <td class="content">{{ $item->observer }}</td>
                        <td class="content">{{ date_format(date_create($item->tanggal), 'd-m-Y') }}</td>
                        <td class="content">{{ $item->profesi }}</td>
                        <td class="content">{{ $item->namaproduk }}</td>
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
                        @foreach ($mastercucitangan as $cucitangan)
                            @php
                                $checklist = 0;
                                if($item->cucitangan->id == $cucitangan->id){
                                    $checklist = 1;
                                }   
                            @endphp
                            <td class="content">{{ $checklist }}</td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>