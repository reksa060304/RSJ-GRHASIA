<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Cetakan KIBB Label Barang</title>

    <style>
        @page {
            size: 21.5cm 33cm;
        }

        table {
            width: 100%;
            height: 100%;
        }

        #table-content td, th{
            width: auto;
            word-wrap: break-word;
            overflow: hidden;
            border: 1px solid black;
            padding: .3em .4em;
        }

        p{
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>

    <table>
        <tr>
            <td style="padding: .5rem; border: 1px solid green; text-align: center;">KIB B LABEL BARANG</td>
        </tr>
    </table>

    
    <div style="margin-top: 1em; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8em; font-size: 11pt">
        
        @foreach ($data as $row)
            <table style="font-size: 7pt; border-collapse: collapse;">
                <tr>
                    <td style="border: 1px solid black; text-align:center;">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/logo-diy.jpeg') }}" style="width: 60%;" alt="LOGO DIY">
                        @else
                        <img src="{{ asset('service/img/logo-diy.jpeg') }}" style="width: 60%;" alt="LOGO DIY">
                        @endif
                    </td>
                    <td style="font-weight: bold; border: 1px solid black;">
                        <p style="text-align: center;">PEMERINTAH DAERAH DERAH</p>
                        <p style="text-align: center;">ISTIMEWA YOGYAKARTA</p>
                        <p style="text-align: center;">DINAS KESEHATAN</p>
                        <p style="text-align: center;">RUMAH SAKIT JIWA GRHASIA<p>
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/aksara_jawa-com.png') }}" style="width: 100%;" alt="Aksara">
                        @else
                        <img src="{{ asset('service/img/aksara_jawa-com.png') }}" style="width: 100%;" alt="Aksara">
                        @endif
                    </td>
                    <td style="border: 1px solid black; text-align:center;">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/logo_grhasia_new.png') }}" style="width: 100%;" alt="LOGO DIY">
                        @else
                        <img src="{{ asset('service/img/logo_grhasia_new.png') }}" style="width: 100%;" alt="LOGO DIY">
                        @endif
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; border: 1px solid black">
                        NOMER BARANG
                    </td>
                    <td colspan="2" style="border: 1px solid black">
                        <p>11.01.34.00.1.02.2.22.0.00.01.0004.{{$row->tahunperolehan}}</p>
                        <p>{{ $row->kdbmn }}</p>
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; border: 1px solid black">
                        NOMER REGISTER SIMRS
                    </td>
                    <td colspan="2" style="border: 1px solid black">
                        {{ $row->noregisteraset }}
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; border: 1px solid black">
                        NAMA BARANG
                    </td>
                    <td colspan="2" style="border: 1px solid black">
                        {{$row->namaproduk}}
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; border: 1px solid black">
                        MERK
                    </td>
                    <td colspan="2" style="border: 1px solid black">
                        @if (isset($row->merkproduk))
                            {{ $row->merkproduk }}
                        @else
                            {{ '-' }}
                        @endif
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; border: 1px solid black">
                        TAHUN PEROLEHAN
                    </td>
                    <td colspan="2" style="border: 1px solid black">
                        {{ $row->tahunperolehan }}
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; border: 1px solid black">
                        NILAI BARANG
                    </td>
                    <td colspan="2" style="border: 1px solid black">
                        {{ number_format($row->hargaperolehan,2,',','.') }}
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: bold; border: 1px solid black">
                        PENEMPATAN
                    </td>
                    <td colspan="2" style="border: 1px solid black">
                        {{$row->namaruanganasal}}
                    </td>
                </tr>
            </table>
        @endforeach
    </div>

    <script>
        window.print()
    </script>
</body>
</html>