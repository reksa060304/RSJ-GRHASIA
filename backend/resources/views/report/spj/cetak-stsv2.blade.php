<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <style>
        @page {
            size: 21.5cm 33cm;
            margin: 1cm;
        }

        #konten tr td{
            border: 1px solid black;
            padding: 0.3em 0.6em;
        }
    </style>
    
    <title>Cetak STS V2</title>
</head>

<body>
    {{-- Kop --}}
    <table style="width: 100%;">
        <tr>
            <td style="text-align: center;">Surat Tanda Setoran</td>
        </tr>
        <tr>
            <td style="text-align: center;">(STS)</td>
        </tr>
    </table>
    <table style="border-collapse:collapse;">
        <tr>
            <td>No. STS</td>
            <td style="padding: 0 0.3em;">:</td>
            <td>{{ $sts[0]->nosts }}</td>
        </tr>
        <tr>
            <td>Harap Menerima Uang Sebesar</td>
            <td style="padding: 0 0.3em;">:</td>
            <td>{{ number_format($sts[0]->totalsetoran, 2, '.', ',') }}</td>
        </tr>
        <tr>
            <td>Terbilang</td>
            <td style="padding: 0 0.3em;">:</td>
            <td>
                @php
                    function penyebut($nilai) {
                        $nilai = abs($nilai);
                        $huruf = array("", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas");
                        $temp = "";
                        if ($nilai < 12) {
                            $temp = " ". $huruf[$nilai];
                        } else if ($nilai <20) {
                            $temp = penyebut($nilai - 10). " Belas";
                        } else if ($nilai < 100) {
                            $temp = penyebut($nilai/10)." Puluh". penyebut($nilai % 10);
                        } else if ($nilai < 200) {
                            $temp = " Seratus" . penyebut($nilai - 100);
                        } else if ($nilai < 1000) {
                            $temp = penyebut($nilai/100) . " Ratus" . penyebut($nilai % 100);
                        } else if ($nilai < 2000) {
                            $temp = " Seribu" . penyebut($nilai - 1000);
                        } else if ($nilai < 1000000) {
                            $temp = penyebut($nilai/1000) . " Ribu" . penyebut($nilai % 1000);
                        } else if ($nilai < 1000000000) {
                            $temp = penyebut($nilai/1000000) . " Juta" . penyebut($nilai % 1000000);
                        } else if ($nilai < 1000000000000) {
                            $temp = penyebut($nilai/1000000000) . " Milyar" . penyebut(fmod($nilai,1000000000));
                        } else if ($nilai < 1000000000000000) {
                            $temp = penyebut($nilai/1000000000000) . " Trilyun" . penyebut(fmod($nilai,1000000000000));
                        }     
                        return $temp;
                    }
                @endphp
                {{ penyebut((float)$sts[0]->totalsetoran) }}
            </td>
        </tr>
        <tr>
            <td style="vertical-align: top;">Keterangan</td>
            <td style="padding: 0 0.3em; vertical-align: top;">:</td>
            <td>
                {{ $sts[0]->keterangan }}
            </td>
        </tr>
        <tr>
            <td>Tanggal</td>
            <td style="padding: 0 0.3em;">:</td>
            <td>{{ date('d-m-Y', strtotime($sts[0]->tglpenerimaan)) }}</td>
        </tr>
    </table>

    {{-- kontent --}}
    <table id="konten" style="width: 100%; border-collapse:collapse; margin-top:1em;">
        <tr>
            <td>Kode Rekening</td>
            <td>Uraian</td>
            <td>Jumlah</td>
        </tr>
        @php
            $idlevel1 = 0;
            $idlevel2 = 0;
            $idlevel3 = 0;
            $idlevel4 = 0;
            $idlevel5 = 0;
            $idlevel6 = 0;
            $idlevel7 = 0;
        @endphp
        @foreach ($data as $rek)
            
            {{-- level-1 --}}
            @if ($rek->idlevel1 && ($rek->idlevel1 !== $idlevel1))
                <tr style="font-weight: bold;">
                    <td>{{ $rek->koderekeninglevel1 }}</td>
                    <td>{{ $rek->namarekeninglevel1 }}</td>
                    <td>
                        @php
                            $jmllevel1 = 0;
                            foreach ($data as $key => $row) {
                                if($rek->idlevel1 == $row->idlevel1){
                                    $jmllevel1 += $row->totaldibayarclosing;
                                }
                            }
                        @endphp
                        {{ number_format($jmllevel1, 2, '.', ',') }}
                    </td>
                </tr>
            @endif

            {{-- level-2 --}}
            @if ($rek->idlevel2 && ($rek->idlevel2 !== $idlevel2))
                <tr style="font-weight: bold;">
                    <td>{{ $rek->koderekeninglevel2 }}</td>
                    <td>{{ $rek->namarekeninglevel2 }}</td>
                    <td>
                        @php
                            $jmllevel2 = 0;
                            foreach ($data as $key => $row) {
                                if($rek->idlevel2 == $row->idlevel2){
                                    $jmllevel2 += $row->totaldibayarclosing;
                                }
                            }
                        @endphp
                        {{ number_format($jmllevel2, 2, '.', ',') }}
                    </td>
                </tr>
            @endif

            {{-- level-3 --}}
            @if ($rek->idlevel3 && ($rek->idlevel3 !== $idlevel3))
                <tr style="font-weight: bold;">
                    <td style="font-weight:bold;">{{ $rek->koderekeninglevel3 }}</td>
                    <td style="font-weight:bold;">{{ $rek->namarekeninglevel3 }}</td>
                    <td style="font-weight:bold;">
                        @php
                            $jmllevel3 = 0;
                            foreach ($data as $key => $row) {
                                if($rek->idlevel3 == $row->idlevel3){
                                    $jmllevel3 += $row->totaldibayarclosing;
                                }
                            }
                        @endphp
                        {{ number_format($jmllevel3, 2, '.', ',') }}
                    </td>
                </tr>
            @endif

            {{-- level-4 --}}
            @if ($rek->idlevel4 && ($rek->idlevel4 !== $idlevel4))
                <tr style="font-weight: bold;">
                    <td>{{ $rek->koderekeninglevel4 }}</td>
                    <td>{{ $rek->namarekeninglevel4 }}</td>
                    <td>
                        @php
                            $jmllevel4 = 0;
                            foreach ($data as $key => $row) {
                                if($rek->idlevel4 == $row->idlevel4){
                                    $jmllevel4 += $row->totaldibayarclosing;
                                }
                            }
                        @endphp
                        {{ number_format($jmllevel4, 2, '.', ',') }}
                    </td>
                </tr>
            @endif

            {{-- level-5 --}}
            @if ($rek->idlevel5 && ($rek->idlevel5 !== $idlevel5))
                <tr style="font-weight: bold;">
                    <td>{{ $rek->koderekeninglevel5 }}</td>
                    <td>{{ $rek->namarekeninglevel5 }}</td>
                    <td>
                        @php
                            $jmllevel5 = 0;
                            foreach ($data as $key => $row) {
                                if($rek->idlevel5 == $row->idlevel5){
                                    $jmllevel5 += $row->totaldibayarclosing;
                                }
                            }
                        @endphp
                        {{ number_format($jmllevel5, 2, '.', ',') }}
                    </td>
                </tr>
            @endif

            {{-- level-6 --}}
            @if ($rek->idlevel6 && ($rek->idlevel6 !== $idlevel6))
                <tr style="font-weight: bold;">
                    <td>{{ $rek->koderekeninglevel6 }}</td>
                    <td>{{ $rek->namarekeninglevel6 }}</td>
                    <td>
                        @php
                            $jmllevel6 = 0;
                            foreach ($data as $key => $row) {
                                if($rek->idlevel6 == $row->idlevel6){
                                    $jmllevel6 += $row->totaldibayarclosing;
                                }
                            }
                        @endphp
                        {{ number_format($jmllevel6, 2, '.', ',') }}
                    </td>
                </tr>
            @endif

            {{-- level-7 --}}
            @if ($rek->idlevel7 && ($rek->idlevel7 !== $idlevel7) && str_contains($rek->koderekeninglevel4, '4.1.02.01'))
                <tr style="font-weight: bold;">
                    <td style="font-weight:bold;"></td>
                    <td style="font-weight:bold;">{{ $rek->namarekeninglevel7 }}</td>
                    <td style="font-weight:bold;">
                        @php
                            $jmllevel7 = 0;
                            foreach ($data as $key => $row) {
                                if($rek->idlevel7 == $row->idlevel7){
                                    $jmllevel7 += $row->totaldibayarclosing;
                                }
                            }
                        @endphp
                        {{ number_format($jmllevel7, 2, '.', ',') }}
                    </td>
                </tr>
            
            @endif

            <tr>
                <td></td>
                <td>{{ $rek->namarekening }}</td>
                <td>
                    @php
                        $jmllevel8 = 0;
                        foreach ($data as $key => $row) {
                            if($rek->idrekening == $row->idrekening){
                                $jmllevel8 += $row->totaldibayarclosing;
                            }
                        }
                    @endphp
                    {{ number_format($jmllevel8, 2, '.', ',') }}
                    
                </td>
            </tr>
            

            @php
                $idlevel1 = $rek->idlevel1;
                $idlevel2 = $rek->idlevel2;
                $idlevel3 = $rek->idlevel3;
                $idlevel4 = $rek->idlevel4;
                $idlevel5 = $rek->idlevel5;
                $idlevel6 = $rek->idlevel6;
                $idlevel7 = $rek->idlevel7;
            @endphp
        @endforeach
        <tr>
            <td colspan="2">Total</td>
            <td>
                @php
                    $jmlsemua = 0;
                    foreach ($data as $key => $row) {
                        $jmlsemua += $row->totaldibayarclosing;
                    }
                @endphp
                {{ number_format($jmlsemua, 2, '.', ',') }}
            </td>
        </tr>
    </table>


    <table style="width: 90%; font-size: 10pt; text-align: center; margin-left: auto; margin-right: auto; margin-top: 1cm;">
        <tbody>
            <tr>
                <td style="width:30%; padding: 5px;" align="center">MENGETAHUI:</td>
                <td style="width:30%; padding: 5px;" align="center">TELAH DIPERIKSA</td>
                <td style="width:30%; padding: 5px;" align="center"></td>
            </tr>
            <tr>
                <td style="width:30%; padding: 5px;" align="center">Pimpinan BLUD</td>
                <td style="width:30%; padding: 5px;" align="center">Verifikator</td>
                <td style="width:30%; padding: 5px;" align="center">Bendahara Penerima Pembantu</td>
            </tr>
            
            <tr>
                <td style="width:30%; padding: 5px; padding-top: 80px;" align="center">dr. Akhmad Akhadi S, MPH</td>
                <td style="width:30%; padding: 5px; padding-top: 80px;" align="center">Reny Astuti, SE</td>
                <td style="width:30%; padding: 5px; padding-top: 80px;" align="center">Suri Herlina Pratiwi, SKM, M.PH</td>
            </tr>
            <tr>
                <td style="width:30%; padding: 5px;" align="center">NIP. 19680714 200012 1 002</td>
                <td style="width:30%; padding: 5px;" align="center">NIP. 19700404 199303 2 005</td>
                <td style="width:30%; padding: 5px;" align="center">NIP. 19860422 201101 2 013</td>
            </tr>
        </tbody>
    </table>

    <script>
        window.print()
    </script>
</body>
</html>