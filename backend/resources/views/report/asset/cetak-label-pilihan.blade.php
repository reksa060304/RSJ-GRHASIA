<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Cetakan KIBB Label Barang</title>

    <style>
        @page {
            size: 33cm 21.5cm;
            margin: 1.5cm 2cm 4cm 1.9cm 
        }

        table {
            border-collapse: collapse;
            max-width: 3508px;
            width: 100%;
            height: 100%;
        }

        #table-content td, th{
            width: auto;
            word-wrap: break-word;
            overflow: hidden;
            border: 1px solid black;
            padding: .3em .6em;
        }
    </style>
</head>
<body>

    <table>
        <tr>
            <td style="padding: .5rem; border: 1px solid green; text-align: center;">KIB B LABEL BARANG</td>
        </tr>
    </table>

    
    <div style="margin-top: 1em; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.8em; font-size: 11pt">
        @foreach ($data as $row)
            <table style="border-collapse: collapse; border: 3px solid red;">
                <tr>
                    <td style="width: 3.5cm; border: 1px solid red">
                        @if(stripos(\Request::url(), 'localhost') !== FALSE)
                        <img src="{{ asset('img/logo-diy.jpeg') }}" style="width: 100%;" alt="LOGO DIY">
                        @else
                        <img src="{{ asset('service/img/logo-diy.jpeg') }}" style="width: 100%;" alt="LOGO DIY">
                        @endif
                    </td>
                    
                    <td style="border: 3px solid red; text-align:center;">
                        <div style="height: 100%; display:flex; flex-direction:column; justify-content: space-around;">
                            <p style="margin:0;">
                                11.01.34.00.1.02.2.22.0.00.01.0004.{{ $row->tahunperolehan }}
                            </p>
                            <hr style="margin:0; width:100%; border:0; height:1px; border-bottom: 3px solid red">
                            <p style="margin:0;">{{ $row->kdbmn }}</p>
                            <hr style="margin:0; width:100%; border:0; height:1px; border-bottom: 3px solid red">
                            <p style="margin:0;">{{ $row->namaproduk }}</p>
                            <hr style="margin:0; width:100%; border:0; height:1px; border-bottom: 3px solid red">
                            <p style="margin:0;">
                                @if($row->namaruanganasal)
                                    {{ $row->namaruanganasal }}
                                @else
                                    -
                                @endif
                            </p>
                        </div>
                    </td>
                </tr>
            </table>
        @endforeach
    </div>

    
</body>
</html>