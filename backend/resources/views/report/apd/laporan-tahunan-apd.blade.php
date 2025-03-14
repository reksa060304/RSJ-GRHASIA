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
            text-align: center;
        }
        .text-left {
            text-align: left;
        }
        .text-center {
            text-align: center;
        }
        /* .highlight {
            background-color:rgba(0, 255, 17, 0.9);
        } */
        .debug-info {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px 0;
            font-family: monospace;
            white-space: pre-wrap;
            font-size: 10pt;
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
            .debug-info {
                display: none;
            }
        }
    </style>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="//cdn.rawgit.com/rainabba/jquery-table2excel/1.1.0/dist/jquery.table2excel.min.js"></script>
</head>
<body>

  <section>
  <table cellspacing="0" cellpadding="0" border="0" width="100%">
        {{-- Header --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 4rem; text-align:center; font-weight:bold;">
            <tr>
                <td>FORMULIR AUDIT KEPATUHAN PENGGUNAAN APD</td>
            </tr>
            <tr>
                <td>
                    DI RS JIWA GRHASIA DIY TAHUN {{ $tahun ?? date('Y') }}
                </td>
            </tr>
        </table>
        {{-- Content --}}
        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid black; border-collapse: collapse;">
            <thead>
                <tr>
                    <th rowspan="2" class="content">UNIT KERJA</th>
                    <th rowspan="2" class="content">TARGET</th>                  
                    <th colspan="12" class="content">HASIL %</th>
                    <th rowspan="2" class="content">RATA RATA</th>
                </tr>
                <tr>
                    @php
                        $months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                    @endphp
                    
                    @foreach($months as $month)
                        <th class="content">{{ $month }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @php
                    $target = 100; 
                @endphp
                
                @if(isset($ruanganData) && count($ruanganData) > 0)
                    @foreach($ruanganData as $ruanganId => $ruangan)
                        <tr>
                            <td class="content text-left"><strong>{{ ucwords(strtolower($ruangan['namaruangan'])) }}</strong></td>
                            <td class="content">{{ $target }}%</td>
                            
                            @for($month = 1; $month <= 12; $month++)
                                @php
                                    $monthStr = sprintf("%02d", $month);
                                    $percentage = isset($ruangan['statistik_bulanan']) ? 
                                        $ruangan['statistik_bulanan'][$monthStr]['persentase'] : 
                                        $ruangan['monthly_stats'][$monthStr]['percentage'];
                                    $class = '';
                                    
                                    if($percentage > 0) {
                                        $class = $percentage >= $target ? 'highlight' : '';
                                    }
                                @endphp
                                
                                <td class="content {{ $class }}">
                                    @if(isset($ruangan['statistik_bulanan']) ? 
                                        $ruangan['statistik_bulanan'][$monthStr]['total'] > 0 : 
                                        $ruangan['monthly_stats'][$monthStr]['total'] > 0)
                                        {{ $percentage }}%
                                    @else
                                        -
                                    @endif
                                </td>
                            @endfor
                            
                            <td class="content {{ (isset($ruangan['rata_tahunan']) ? $ruangan['rata_tahunan'] : $ruangan['yearly_average']) >= $target ? 'highlight' : '' }}">
                                {{ isset($ruangan['rata_tahunan']) ? $ruangan['rata_tahunan'] : $ruangan['yearly_average'] }}%
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="15" class="content">Tidak ada data untuk Tahun yang dipilih silahkan pilih Tahun lainya</td>
                    </tr>
                @endif
                
                {{-- Hospital Average Row --}}
                <tr>
                    <td class="content text-left"><strong>RATA RATA RS</strong></td>
                    <td class="content">{{ $target }}%</td>
                    
                    @if(isset($statistikBulan) || isset($statistikRumahSakit))
                        @for($month = 1; $month <= 12; $month++)
                            @php
                                $monthStr = sprintf("%02d", $month);
                                $stats = isset($statistikRumahSakit) ? $statistikRumahSakit : $statistikBulan;
                                $percentage = isset($stats[$monthStr]['persentase']) ? 
                                    $stats[$monthStr]['persentase'] : 
                                    (isset($stats[$monthStr]['percentage']) ? $stats[$monthStr]['percentage'] : 0);
                                $total = isset($stats[$monthStr]['total']) ? $stats[$monthStr]['total'] : 0;
                                $class = '';
                                
                                if($percentage > 0) {
                                    $class = $percentage >= $target ? 'highlight' : '';
                                }
                            @endphp
                            
                            <td class="content {{ $class }}">
                                @if($total > 0)
                                    {{ $percentage }}%
                                @else
                                    -
                                @endif
                            </td>
                        @endfor
                        
                        <td class="content {{ (isset($rataRataRS) ? $rataRataRS : $statistikTahun) >= $target ? 'highlight' : '' }}">
                            {{ isset($rataRataRS) ? $rataRataRS : $statistikTahun }}%
                        </td>
                    @else
                        @for($month = 1; $month <= 12; $month++)
                            <td class="content">-</td>
                        @endfor
                        <td class="content">0%</td>
                    @endif
                </tr>
            </tbody>
        </table>
    </table>
  </section>

    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 500);
        }
    </script>
</body>
</html>