<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>FORMULIR AUDIT KEPATUHAN PENGGUNAAN HYGIENE</title>
    <style>
        table {
            border-collapse: collapse;
            max-width: 3508px;
            width: 99vw;
            max-width: 99vw;
        }

        #table-content td, th{
            width: auto;
            word-wrap: break-word;
            border: 1px solid black;
            padding: .3em .6em;
        }

        @media print{@page {size: landscape}}
    </style>
</head>
<body>
    {{-- Header --}}
    <table style="margin-bottom: 4rem; text-align:center; font-weight:bold;">
        <tr>
            <td>FORMULIR AUDIT KEPATUHAN PENGGUNAAN HYGIENE</td>
        </tr>
        <tr>
            <td>DI RS JIWA GRHASIA DIY TAHUN {{ date_format(date_create($data[0]->tanggal), 'Y') }}</td>
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
                <td>{{ date_format(date_create($data[0]->tanggal), 'F Y') }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Content --}}
    <table style="width:95%" id="table-content">
        <thead>
            <tr>
                <th rowspan="2" class="content">OBSERVER</th>
                <th rowspan="2" class="content">TANGGAL</th>
                <th rowspan="2" class="content">PROFESI YANG DIAUDIT</th>
                <th colspan="{{ count($masterSebelumKontak) }}" class="content">Sebelum kontak dengan pasien</th>
                <th colspan="{{ count($masterSebelumProsedur) }}" class="content">Sebelum melakukan prosedur bersih/tindakan aseptik</th>
                <th colspan="{{ count($masterSetelahCairan) }}" class="content">Setelah kontak dengan cairan tubuh pasien</th>
                <th colspan="{{ count($masterSetelahKontak) }}" class="content">Setelah kontak dengan pasien</th>
                <th colspan="{{ count($masterSetelahLingkungan) }}" class="content">Setelah kontak dengan lingkungan pasien</th>
                <th colspan="{{ count($masterLainLain) }}" class="content">LAIN-LAIN</th>
            </tr>
            <tr>
                @foreach ($masterSebelumKontak as $row)
                    <th class="content">{{ $row->description }}</th>
                @endforeach
                @foreach ($masterSebelumProsedur as $row)
                    <th class="content">{{ $row->description }}</th>
                @endforeach
                @foreach ($masterSetelahCairan as $row)
                    <th class="content">{{ $row->description }}</th>
                @endforeach
                @foreach ($masterSetelahKontak as $row)
                    <th class="content">{{ $row->description }}</th>
                @endforeach
                @foreach ($masterSetelahLingkungan as $row)
                    <th class="content">{{ $row->description }}</th>
                @endforeach
                @foreach ($masterLainLain as $row)
                    <th class="content">{{ $row->description }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $key=>$item)
                <tr>
                    <td>{{ $item->observer }}</td>
                    <td>{{ date_format(date_create($item->tanggal), 'd-m-Y') }}</td>
                    <td>{{ $item->profesi }}</td>
                    @foreach ($masterSebelumKontak as $row)
                        @php
                            $checklist = 0; 
                            foreach ($item->sebelumKontak as $kontak) {
                                if($row->id == $kontak->id){
                                    $checklist = 1;
                                }
                            }  
                        @endphp
                        <td>{{ $checklist }}</td>
                    @endforeach
                    @foreach ($masterSebelumProsedur as $row)
                        @php
                            $checklist = 0;
                            foreach ($item->sebelumProsedur as $prosedur) {
                                if($row->id == $prosedur->id){
                                    $checklist = 1;
                                }
                            }   
                        @endphp
                        <td>{{ $checklist }}</td>
                    @endforeach
                    @foreach ($masterSetelahCairan as $row)
                        @php
                            $checklist = 0;
                            foreach ($item->setelahCairan as $cairan) {
                                if($row->id == $cairan->id){
                                    $checklist = 1;
                                }
                            }
                        @endphp
                        <td>{{ $checklist }}</td>
                    @endforeach
                    @foreach ($masterSetelahKontak as $row)
                        @php
                            $checklist = 0;
                            foreach ($item->setelahKontak as $sKontak) {
                                if($row->id == $sKontak->id){
                                    $checklist = 1;
                                }
                            }
                        @endphp
                        <td>{{ $checklist }}</td>
                    @endforeach
                    @foreach ($masterSetelahLingkungan as $row)
                        @php
                            $checklist = 0;
                            foreach ($item->setelahLingkungan as $lingkungan) {
                                if($row->id == $lingkungan->id){
                                    $checklist = 1;
                                }
                            }
                        @endphp
                        <td>{{ $checklist }}</td>
                    @endforeach
                    @foreach ($masterLainLain as $row)
                        @php
                            $checklist = 0;
                            foreach ($item->lainLain as $lain) {
                                if($row->id == $lain->id){
                                    $checklist = 1;
                                }
                            }
                        @endphp
                        <td>{{ $checklist }}</td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>