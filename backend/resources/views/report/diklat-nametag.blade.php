<style>
        @page {
            size: 7in 9.25in;
            margin: 27mm 16mm 27mm 16mm;
        }

        .borderss {
            border-bottom: 1px solid black;
        }

        body {
            font-family: Arial;
            
        }

        .column {
            float: left;
            width: 50%;
            padding: 10px;
            height: 300px;
            /* Should be removed. Only for demonstration */
        }

        /* Clear floats after the columns */
        .row:after {
            content: "";
            display: table;
            clear: both;
        }
    </style>

    <title>Document</title>
<body>
    @foreach ($data as $d)

    <table border="2" style="display: inline-block;table-layout: fixed">
        <tbody style="display: inline-block; table-layout: fixed">

            <tr >
                <td style="text-align: center;">
                    <img src="{{ asset('img/logo_grhasia.png') }}" style="width: 60px" border="0">
                </td>
                <td>
                    <div style="font-size: 10px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center; letter-spacing: -1px">RUMAH
                        SAKIT JIWA GRHASIA</div>
                    <div style="font-size: 15px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;letter-spacing: -1px">
                        INSTALASI DIKLATLITBANG</div>
                </td>
            </tr>
            <tr>
                <td>
                    <img src="data:image;base64,{{$d->image}}" alt="" width="75" height="100"
                        style="padding: 5px 20px 5px 20px; text-align: center">
                </td>
                <td style="width: 200px">
                    <div style="font-size: 12px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;letter-spacing: -1px">
                        {{$d->detailjenisproduk}}</div>
                    <div style="font-size: 10px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;">
                        {{$d->institusipendidikan}}</div>
                    <div style="font-size: 13px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;">
                        {{$d->nama}}</div>
                    <div style="font-size: 12px; font-weight: bold;padding: 0px 20px 0px 20px; text-align: center;">
                        {{date('d-m-Y', strtotime($d->tanggalmulai))}} S/D {{date('d-m-Y', strtotime($d->tanggalselesai))}}</div>
                </td>
            </tr>
        </tbody>


    </table>
    @endforeach


</body>
